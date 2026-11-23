import { createCorsair, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { list as listMeetings, listTypes } from './endpoints/meetings';
import {
	getDownload,
	getSummary,
	getTranscript,
	requestDownload,
} from './endpoints/recordings';
import { listMembers, list as listTeams } from './endpoints/teams';
import { storableMeeting } from './endpoints/types';
import { list as listUsers } from './endpoints/users';
import { create as createWebhook, remove } from './endpoints/webhooks';
import { errorHandlers } from './error-handlers';
import { fathomai } from './index';
import { FathomAiSchema } from './schema';
import { MEETING } from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

type Ctx = Parameters<typeof listMeetings>[0];

// `unknown`: the fake database records whatever each entity is given, across entity types.
const upserts: Array<[string, string, unknown]> = [];

function entity(name: string) {
	return {
		// `unknown`: same fake database, any entity's record.
		upsertByEntityId: async (id: string, data: unknown) => {
			upserts.push([name, id, data]);
			return null;
		},
	};
}

// Safe (`as unknown as Ctx`): the endpoints read only `key` and the `db` entities; the runtime builds the rest from a live database.
const ctx = {
	key: 'fathom-test-key',
	db: Object.fromEntries(
		Object.keys(FathomAiSchema.entities).map((name) => [name, entity(name)]),
	),
} as unknown as Ctx;

const BASE = 'https://api.fathom.ai/external/v1';

// `unknown`: test responses are arbitrary JSON, including deliberately malformed ones.
function json(status: number, body: unknown) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

describe('Fathom AI endpoints', () => {
	const originalFetch = global.fetch;
	let fetchMock: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		upserts.length = 0;
		fetchMock = jest.fn();
		global.fetch = fetchMock;
	});

	afterAll(() => {
		global.fetch = originalFetch;
	});

	function sent() {
		const [url, init] = fetchMock.mock.calls[0];
		const parsed = new URL(String(url));
		return {
			path: `${parsed.origin}${parsed.pathname}`,
			query: [...parsed.searchParams].sort(),
			method: init.method,
			body: init.body ? JSON.parse(init.body) : undefined,
			headers: new Headers(init.headers),
		};
	}

	it('meetings.list sends filters as repeated [] params, persists by recording id, logs only the count', async () => {
		const page = { limit: 10, next_cursor: 'eyJwIjoyfQ==', items: [MEETING] };
		fetchMock.mockResolvedValue(json(200, page));

		const result = await listMeetings(ctx, {
			cursor: 'eyJwIjoxfQ==',
			created_after: '2025-01-01T00:00:00Z',
			teams: ['Sales', 'Customer Success'],
			recorded_by: ['ceo@acme.com'],
			calendar_invitees_domains: ['client.com'],
			include_transcript: true,
		});

		const call = sent();
		expect(call.method).toBe('GET');
		expect(call.path).toBe(`${BASE}/meetings`);
		expect(call.query).toEqual([
			['calendar_invitees_domains[]', 'client.com'],
			['created_after', '2025-01-01T00:00:00Z'],
			['cursor', 'eyJwIjoxfQ=='],
			['include_transcript', 'true'],
			['recorded_by[]', 'ceo@acme.com'],
			['teams[]', 'Customer Success'],
			['teams[]', 'Sales'],
		]);
		expect(call.headers.get('X-Api-Key')).toBe('fathom-test-key');
		expect(call.headers.get('Authorization')).toBeNull();
		expect(result).toEqual(page);
		expect(upserts).toEqual([
			['meetings', '123456789', storableMeeting(MEETING)],
		]);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'fathomai.meetings.list',
			{ count: 1 },
			'completed',
		);
	});

	it('meetings.list rejects a malformed recorded_by email before calling Fathom', async () => {
		await expect(
			listMeetings(ctx, { recorded_by: ['not-an-email'] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('meetingTypes.list pages with the cursor and persists by name', async () => {
		const type = {
			name: 'Quarterly Business Review',
			status: 'inactive',
			created_at: '2023-11-10T12:00:00Z',
		};
		fetchMock.mockResolvedValue(
			json(200, { limit: null, next_cursor: null, items: [type] }),
		);

		const result = await listTypes(ctx, { cursor: 'c2' });

		const call = sent();
		expect(call.path).toBe(`${BASE}/meeting_types`);
		expect(call.query).toEqual([['cursor', 'c2']]);
		expect(result.items).toEqual([type]);
		expect(upserts).toEqual([
			['meetingTypes', 'Quarterly Business Review', type],
		]);
	});

	it('recordings.getSummary returns the summary inline and logs only the recording id', async () => {
		fetchMock.mockResolvedValue(
			json(200, { summary: MEETING.default_summary }),
		);

		const result = await getSummary(ctx, { recording_id: 123456789 });

		const call = sent();
		expect(call.method).toBe('GET');
		expect(call.path).toBe(`${BASE}/recordings/123456789/summary`);
		expect(call.query).toEqual([]);
		expect(result).toEqual({ summary: MEETING.default_summary });
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'fathomai.recordings.getSummary',
			{ recording_id: 123456789 },
			'completed',
		);
	});

	it('recordings.getSummary returns a null summary for a recording that has none', async () => {
		// Live response (11-23) for Fathom's onboarding demo recording, which has no generated summary.
		fetchMock.mockResolvedValue(json(200, { summary: null }));

		await expect(getSummary(ctx, { recording_id: 42 })).resolves.toEqual({
			summary: null,
		});
	});

	it('recordings.getTranscript with destination_url returns the async acknowledgement', async () => {
		const destination = 'https://example.com/hooks/transcript';
		fetchMock.mockResolvedValue(json(200, { destination_url: destination }));

		const result = await getTranscript(ctx, {
			recording_id: 42,
			destination_url: destination,
		});

		const call = sent();
		expect(call.path).toBe(`${BASE}/recordings/42/transcript`);
		expect(call.query).toEqual([['destination_url', destination]]);
		expect(result).toEqual({ destination_url: destination });
	});

	it('recordings.getTranscript returns speaker-labelled lines inline', async () => {
		fetchMock.mockResolvedValue(json(200, { transcript: MEETING.transcript }));

		await expect(getTranscript(ctx, { recording_id: 42 })).resolves.toEqual({
			transcript: MEETING.transcript,
		});
	});

	it('recordings.requestDownload posts to the download route and returns the pending job', async () => {
		const job = {
			download_id: 'dl_CJAj1YPuruCgWHaKgEBv6Mb1UsNj8x',
			recording_id: 42,
			status: 'processing',
		};
		fetchMock.mockResolvedValue(json(202, job));

		const result = await requestDownload(ctx, { recording_id: 42 });

		const call = sent();
		expect(call.method).toBe('POST');
		expect(call.path).toBe(`${BASE}/recordings/42/download`);
		expect(call.body).toEqual({});
		expect(result).toEqual(job);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'fathomai.recordings.requestDownload',
			{ recording_id: 42, status: 'processing' },
			'completed',
		);
	});

	it('recordings.getDownload returns the signed file once completed', async () => {
		const done = {
			download_id: 'dl_1',
			recording_id: 42,
			status: 'completed',
			video: {
				url: 'https://media.fathom.ai/downloads/dl_1.mp4',
				content_type: 'video/mp4',
				file_size_bytes: 154763264,
				expires_at: '2026-07-13T18:30:00Z',
			},
		};
		fetchMock.mockResolvedValue(json(200, done));

		const result = await getDownload(ctx, {
			recording_id: 42,
			download_id: 'dl_1',
		});

		expect(sent().path).toBe(`${BASE}/recordings/42/downloads/dl_1`);
		expect(result).toEqual(done);
	});

	it('teams.list persists teams by name', async () => {
		const team = { name: 'Sales', created_at: '2023-11-10T12:00:00Z' };
		fetchMock.mockResolvedValue(
			json(200, { limit: 10, next_cursor: null, items: [team] }),
		);

		await listTeams(ctx, {});

		expect(sent().path).toBe(`${BASE}/teams`);
		expect(upserts).toEqual([['teams', 'Sales', team]]);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'fathomai.teams.list',
			{ count: 1 },
			'completed',
		);
	});

	it('teamMembers.list filters by team and persists members by email', async () => {
		const member = {
			name: 'Bob Lee',
			email: 'bob.lee@acme.com',
			created_at: '2024-06-01T08:30:00Z',
		};
		fetchMock.mockResolvedValue(
			json(200, { limit: 10, next_cursor: null, items: [member] }),
		);

		await listMembers(ctx, { team: 'Sales' });

		const call = sent();
		expect(call.path).toBe(`${BASE}/team_members`);
		expect(call.query).toEqual([['team', 'Sales']]);
		expect(upserts).toEqual([['teamMembers', 'bob.lee@acme.com', member]]);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'fathomai.teamMembers.list',
			{ count: 1 },
			'completed',
		);
	});

	it('users.list keeps invited users that have no permissions', async () => {
		const admin = {
			name: 'Bob Lee',
			email: 'bob.lee@acme.com',
			created_at: '2024-06-01T08:30:00Z',
			status: 'active',
			permissions: {
				settings_access: { level: 'account_admin', teams: ['Sales'] },
				view_access: { level: 'all_teams', teams: ['Sales'] },
			},
		};
		const invited = {
			name: null,
			email: 'new@acme.com',
			created_at: '2025-01-02T00:00:00Z',
			status: 'invited',
		};
		fetchMock.mockResolvedValue(
			json(200, { limit: 10, next_cursor: null, items: [admin, invited] }),
		);

		const result = await listUsers(ctx, { status: 'active' });

		const call = sent();
		expect(call.path).toBe(`${BASE}/users`);
		expect(call.query).toEqual([['status', 'active']]);
		expect(result.items).toEqual([admin, invited]);
		expect(upserts.map(([name, id]) => [name, id])).toEqual([
			['users', 'bob.lee@acme.com'],
			['users', 'new@acme.com'],
		]);
	});

	it('webhooks.create posts the config and keeps the signing secret out of the log', async () => {
		const webhook = {
			id: 'ikEoQ4bVoq4JYUmc',
			url: 'https://example.com/webhook',
			secret: 'whsec_test',
			created_at: '2025-06-30T10:40:46Z',
			include_transcript: true,
			include_crm_matches: false,
			include_summary: true,
			include_action_items: false,
			triggered_for: ['my_recordings'],
		};
		fetchMock.mockResolvedValue(json(201, webhook));

		const result = await createWebhook(ctx, {
			destination_url: 'https://example.com/webhook',
			triggered_for: ['my_recordings'],
			include_transcript: true,
			include_summary: true,
		});

		const call = sent();
		expect(call.method).toBe('POST');
		expect(call.path).toBe(`${BASE}/webhooks`);
		expect(call.headers.get('Content-Type')).toBe('application/json');
		expect(call.body).toEqual({
			destination_url: 'https://example.com/webhook',
			triggered_for: ['my_recordings'],
			include_transcript: true,
			include_summary: true,
		});
		expect(result).toEqual(webhook);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'fathomai.webhooks.create',
			{ id: 'ikEoQ4bVoq4JYUmc', triggered_for: ['my_recordings'] },
			'completed',
		);
	});

	it('webhooks.create refuses a webhook that would carry no content', async () => {
		await expect(
			createWebhook(ctx, {
				destination_url: 'https://example.com/webhook',
				triggered_for: ['my_recordings'],
			}),
		).rejects.toThrow('Set at least one of include_transcript');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('webhooks.delete sends DELETE and reports the removed id on 204', async () => {
		fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

		const result = await remove(ctx, { id: 'ikEoQ4bVoq4JYUmc' });

		const call = sent();
		expect(call.method).toBe('DELETE');
		expect(call.path).toBe(`${BASE}/webhooks/ikEoQ4bVoq4JYUmc`);
		expect(result).toEqual({ id: 'ikEoQ4bVoq4JYUmc', deleted: true });
	});

	it('stores meeting metadata only, so a basic list after a rich one keeps the same record', async () => {
		const rich = { limit: 10, next_cursor: null, items: [MEETING] };
		const basicMeeting = storableMeeting(MEETING);
		const basic = { limit: 10, next_cursor: null, items: [basicMeeting] };
		fetchMock
			.mockResolvedValueOnce(json(200, rich))
			.mockResolvedValueOnce(json(200, basic));

		const first = await listMeetings(ctx, {
			include_transcript: true,
			include_summary: true,
			include_action_items: true,
		});
		await listMeetings(ctx, {});

		expect(first.items[0]?.transcript).toEqual(MEETING.transcript);
		const [richRecord, basicRecord] = upserts.map(([, , data]) => data);
		expect(richRecord).toEqual(basicRecord);
		expect(richRecord).not.toHaveProperty('transcript');
		expect(richRecord).not.toHaveProperty('default_summary');
		expect(richRecord).toMatchObject({ recording_id: 123456789 });
	});

	it('keeps email addresses and destination URLs out of a failed request', async () => {
		fetchMock.mockResolvedValue(json(400, { error: 'Bad request' }));

		// `unknown`: a rejection value is untyped until the assertion narrows it.
		const error = await listMeetings(ctx, {
			recorded_by: ['ceo@acme.com'],
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(400);
		expect(apiError.body).toEqual({ error: 'Bad request' });
		const exposed = JSON.stringify({
			url: apiError.url,
			message: apiError.message,
			request: apiError.request,
		});
		expect(exposed).not.toContain('acme.com');
		expect(apiError.url).toBe(`${BASE}/meetings`);

		fetchMock.mockResolvedValue(json(404, { error: 'Not found' }));
		const transcriptError = await getTranscript(ctx, {
			recording_id: 42,
			destination_url: 'https://example.com/hook?token=abc',
			// `unknown`: a rejection value is untyped until the assertion narrows it.
		}).catch((e: unknown) => e);
		expect(JSON.stringify(transcriptError)).not.toContain('token=abc');
		expect((transcriptError as ApiError).url).toBe(
			`${BASE}/recordings/{recording_id}/transcript`,
		);
	});

	it('accepts enum values Fathom adds to responses later', async () => {
		fetchMock.mockResolvedValue(
			json(200, {
				limit: 10,
				next_cursor: null,
				items: [{ ...MEETING, shared_with: 'some_new_sharing_mode' }],
			}),
		);
		const result = await listMeetings(ctx, {});
		expect(result.items[0]?.shared_with).toBe('some_new_sharing_mode');
	});

	it('passes a 401 through as ApiError without persisting or logging', async () => {
		fetchMock.mockResolvedValue(json(401, { error: 'Unauthorized' }));

		// `unknown`: a rejection value is untyped until the assertion narrows it.
		const error = await listTeams(ctx, {}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
		expect(upserts).toEqual([]);
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
});

describe('Fathom AI through a Corsair client', () => {
	const originalFetch = global.fetch;
	const team = { name: 'Sales', created_at: '2023-11-10T12:00:00Z' };
	let fetchMock: jest.Mock;

	async function createClient(options: { key?: string }) {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'fathomai', 'default');
		const corsair = createCorsair({
			plugins: [fathomai(options)],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		await corsair.fathomai.keys.issue_new_dek();
		await corsair.fathomai.keys.set_api_key('stored-key');
		return { corsair, testDb };
	}

	beforeEach(() => {
		fetchMock = jest.fn();
		global.fetch = fetchMock;
	});

	afterAll(() => {
		global.fetch = originalFetch;
	});

	it('sends the stored api key and syncs the result into the database', async () => {
		fetchMock.mockResolvedValue(
			json(200, { limit: 10, next_cursor: null, items: [team] }),
		);
		const { corsair, testDb } = await createClient({});
		try {
			const result = await corsair.fathomai.api.teams.list({});

			const [url, init] = fetchMock.mock.calls[0];
			expect(String(url)).toBe(`${BASE}/teams`);
			expect(new Headers(init.headers).get('X-Api-Key')).toBe('stored-key');
			expect(result.items).toEqual([team]);
			const stored = await corsair.fathomai.db.teams.findByEntityId('Sales');
			expect(stored?.data).toEqual(team);
		} finally {
			testDb.cleanup();
		}
	});

	it('prefers the key plugin option over the stored key', async () => {
		fetchMock.mockResolvedValue(
			json(200, { limit: 10, next_cursor: null, items: [] }),
		);
		const { corsair, testDb } = await createClient({ key: 'option-key' });
		try {
			await corsair.fathomai.api.teams.list({});

			const [, init] = fetchMock.mock.calls[0];
			expect(new Headers(init.headers).get('X-Api-Key')).toBe('option-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('fails a rejected key once, without retrying', async () => {
		fetchMock.mockImplementation(async () =>
			json(401, { error: 'Unauthorized' }),
		);
		const { corsair, testDb } = await createClient({});
		try {
			const error = await corsair.fathomai.api.teams
				.list({})
				// `unknown`: a rejection value is untyped until the assertion narrows it.
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(401);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Fathom AI error handlers', () => {
	const apiError = (status: number) =>
		new ApiError(
			{ method: 'GET', url: '/meetings' },
			{ url: '/meetings', ok: false, status, statusText: '', body: {} },
			'failed',
		);

	it('routes 429 to the rate limit handler without retrying again', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(429))).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(401))).toBe(false);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 401 to the auth handler, which does not retry', async () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiError(500))).toBe(false);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
