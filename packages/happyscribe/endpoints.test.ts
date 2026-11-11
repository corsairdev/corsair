import { logEventFromContext } from 'corsair/core';
import {
	Exports,
	Glossaries,
	Intelligence,
	Meetings,
	Memberships,
	Orders,
	Organizations,
	StyleGuides,
	Transcriptions,
	Translations,
	Uploads,
} from './endpoints';
import {
	badKey,
	company,
	companyList,
	exportCreated,
	exportReady,
	glossaries,
	meeting,
	meetingCompleted,
	memberships,
	notFound,
	order,
	organizations,
	person,
	personList,
	serverError,
	signedUrl,
	styleGuides,
	summary,
	transcription,
	transcriptionList,
	translationDone,
	translationTask,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'hs-test-key';

// unknown: every concrete endpoint satisfies this because parameters are
// contravariant, while each endpoint returns its own output type, so the
// shared return can only be unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: raw caller input and the result stay unknown until the
// operation's zod schemas have run; negative cases pass values no schema
// accepts.
async function invoke<T = unknown>(
	endpoint: AnyEndpoint,
	input: unknown,
): Promise<T> {
	return endpoint({ key: API_KEY } as never, input as never) as Promise<T>;
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://www.happyscribe.com');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('transcriptions', () => {
	it('lists with organization filter and flattens the next cursor', async () => {
		respond(transcriptionList);

		const result = await invoke<{
			results: (Record<string, unknown> & { id?: string; state?: string })[];
			nextPageUrl?: string;
		}>(Transcriptions.list, {
			organizationId: 123,
			page: 0,
			perPage: 25,
		});

		expect(result.results).toHaveLength(2);
		expect(result.nextPageUrl).toContain('page=2');
		expect(result.results[1]).toMatchObject({ id: transcription.id });
		expect(result.results[1]!.links).toBeDefined();
		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.path).toBe('/api/v1/transcriptions');
		expect(sent.query.organization_id).toBe('123');
		expect(sent.query.per_page).toBe('25');
	});

	it('rejects an error body as a list answer', async () => {
		respond(badKey, 401);
		await expect(
			invoke(Transcriptions.list, { organizationId: 123 }),
		).rejects.toThrow();
	});

	it('creates a transcription with the wrapped snake_case body', async () => {
		respond(transcription, 200);

		const result = await invoke<{ id: string }>(Transcriptions.create, {
			organizationId: 123,
			name: 'My Interview',
			language: 'en-GB',
			tmpUrl: 'https://example.com/my_media.mp3',
			tags: ['To do'],
		});

		expect(result.id).toBe(transcription.id);
		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.body).toEqual({
			transcription: {
				name: 'My Interview',
				language: 'en-GB',
				tmp_url: 'https://example.com/my_media.mp3',
				is_subtitle: undefined,
				organization_id: 123,
				folder_id: undefined,
				tags: ['To do'],
			},
		});
	});

	it('rejects a create without a tmpUrl', async () => {
		await expect(
			invoke(Transcriptions.create, {
				organizationId: 123,
				name: 'No media',
				language: 'en-GB',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reads details with links renamed', async () => {
		respond(transcription);
		const result = await invoke<{ state?: string }>(Transcriptions.getDetails, {
			fileId: transcription.id,
		});
		expect(result.state).toBe('automatic_done');
		expect(lastRequest().path).toBe(
			`/api/v1/transcriptions/${transcription.id}`,
		);
	});

	it('reads a meeting summary', async () => {
		respond(summary);
		const result = await invoke<{ summary?: string }>(
			Transcriptions.getSummary,
			{
				fileId: transcription.id,
			},
		);
		expect(result.summary).toContain('Q4');
		expect(lastRequest().path).toBe(
			`/api/v1/transcriptions/${transcription.id}/summary`,
		);
	});

	it('PATCHes sharing through the wrapper object', async () => {
		respond(transcription);
		await invoke(Transcriptions.updateDetails, {
			fileId: transcription.id,
			organizationId: 123,
			sharingEnabled: true,
		});
		expect(lastRequest().body).toEqual({
			transcription: { organization_id: 123, sharing_enabled: true },
		});
	});

	it('deletes and parses the empty answer', async () => {
		respondEmpty(204);
		await invoke(Transcriptions.delete, { fileId: transcription.id });
		const sent = lastRequest();
		expect(sent.method).toBe('DELETE');
	});

	it('rejects a 404 delete', async () => {
		respond(notFound, 404);
		await expect(
			invoke(Transcriptions.delete, { fileId: 'gone' }),
		).rejects.toMatchObject({ status: 404 });
	});
});

describe('exports', () => {
	it('creates an export in the wrapped snake_case body', async () => {
		respond(exportCreated);
		const result = await invoke<{ state?: string }>(Exports.create, {
			format: 'txt',
			transcriptionIds: [transcription.id],
		});
		expect(result.state).toBe('pending');
		expect(lastRequest().body).toEqual({
			export: {
				format: 'txt',
				transcription_ids: [transcription.id],
				show_timestamps: undefined,
				show_speakers: undefined,
				show_comments: undefined,
				show_highlights: undefined,
			},
		});
	});

	it('reads a ready export with its download link', async () => {
		respond(exportReady);
		const result = await invoke<{ state?: string; download_link?: string }>(
			Exports.get,
			{ exportId: exportCreated.id },
		);
		expect(result.state).toBe('ready');
		expect(result.download_link).toBeDefined();
	});
});

describe('translations', () => {
	it('creates a task and reads it back to done', async () => {
		respond(translationTask);
		const created = await invoke<{ id: string; state?: string }>(
			Translations.createTask,
			{
				sourceTranscriptionId: transcription.id,
				targetLanguage: 'es',
			},
		);
		expect(created.state).toBe('working');
		expect(lastRequest().body).toEqual({
			source_transcription_id: transcription.id,
			target_language: 'es',
		});

		respond(translationDone);
		const done = await invoke<{
			state?: string;
			translatedTranscriptionId?: string;
		}>(Translations.getTask, { taskId: created.id });
		expect(done.state).toBe('done');
		expect(done.translatedTranscriptionId).toBeDefined();
	});
});

describe('meetings', () => {
	it('creates a notetaker meeting with settings', async () => {
		respond(meeting, 200);
		const result = await invoke<{ id: string; status?: string }>(
			Meetings.create,
			{
				organizationId: 413,
				meetingUrl: 'https://zoom.us/j/123456789',
				joinAt: '2026-07-20T14:00:00Z',
				language: 'en',
				botName: 'Acme Notetaker',
				recordingMode: 'audio_only',
			},
		);
		expect(result.id).toBe(meeting.id);
		expect(result.status).toBe('queued');
		const sent = lastRequest();
		expect(sent.path).toBe('/api/v1/meetings');
		expect(sent.body).toMatchObject({
			organization_id: 413,
			settings: { bot_name: 'Acme Notetaker', recording_mode: 'audio_only' },
		});
	});

	it('reads a completed meeting', async () => {
		respond(meetingCompleted);
		const result = await invoke<{ status?: string }>(Meetings.get, {
			meetingId: meeting.id,
		});
		expect(result.status).toBe('completed');
		expect(lastRequest().path).toBe(`/api/v1/meetings/${meeting.id}`);
	});
});

describe('uploads', () => {
	it('gets a signed url for a filename', async () => {
		respond(signedUrl);
		const result = await invoke<{ signedUrl: string }>(Uploads.getSignedUrl, {
			filename: 'my_media.mp3',
		});
		expect(result.signedUrl).toBe(signedUrl.signed_url);
		expect(lastRequest().query.filename).toBe('my_media.mp3');
	});
});

describe('organization resources', () => {
	it('lists glossaries', async () => {
		respond(glossaries);
		const result = await invoke<{ glossaries: { source_language?: string }[] }>(
			Glossaries.list,
			{ organizationId: 123 },
		);
		expect(result.glossaries).toHaveLength(1);
		expect(result.glossaries[0]!.source_language).toBe('en');
	});

	it('lists style guides', async () => {
		respond(styleGuides);
		const result = await invoke<{ styleGuides: unknown[] }>(StyleGuides.list, {
			organizationId: 123,
		});
		expect(result.styleGuides).toHaveLength(1);
	});

	it('lists organizations', async () => {
		respond(organizations);
		const result = await invoke<{ organizations: { id: number }[] }>(
			Organizations.list,
			{},
		);
		expect(result.organizations[0]!.id).toBe('123');
		expect(lastRequest().path).toBe('/api/v1/organizations');
	});

	it('lists memberships', async () => {
		respond(memberships);
		const result = await invoke<{ members: { role?: string }[] }>(
			Memberships.list,
			{ organizationId: 123 },
		);
		expect(result.members[0]!.role).toBe('admin');
	});

	it('adds a member with a flat body', async () => {
		respond({ member: memberships.members[0] }, 201);
		await invoke(Memberships.add, {
			organizationId: 123,
			email: 'new-hire@acme.com',
			role: 'member',
		});
		expect(lastRequest().body).toEqual({
			organization_id: 123,
			email: 'new-hire@acme.com',
			role: 'member',
		});
	});

	it('updates a role and removes a membership', async () => {
		respond({ member: memberships.members[0] });
		await invoke(Memberships.updateRole, { membershipId: 9002, role: 'admin' });
		expect(lastRequest().body).toEqual({ role: 'admin' });

		respondEmpty(204);
		await invoke(Memberships.remove, { membershipId: 9002 });
		expect(lastRequest().method).toBe('DELETE');
	});
});

describe('orders', () => {
	it('creates an incomplete order', async () => {
		respond(order);
		const result = await invoke<{ state?: string }>(Orders.create, {
			url: 'https://example.com/media.mp3',
			language: 'es',
			service: 'pro',
			organizationId: 123,
		});
		expect(result.state).toBe('incomplete');
		expect(lastRequest().body).toMatchObject({
			order: { language: 'es', service: 'pro', organization_id: 123 },
		});
	});

	it('creates a translation order', async () => {
		respond(order);
		await invoke(Orders.createTranslation, {
			sourceTranscriptionId: transcription.id,
			targetLanguages: ['es'],
			organizationId: 123,
		});
		expect(lastRequest().path).toBe('/api/v1/orders/translation');
		expect(lastRequest().body).toEqual({
			order: {
				source_transcription_id: transcription.id,
				target_languages: ['es'],
				confirm: undefined,
				organization_id: 123,
				glossary_ids: undefined,
			},
		});
	});

	it('reads one order by id', async () => {
		respond(order);
		const result = await invoke<{ id: string; state?: string }>(Orders.get, {
			orderId: order.id,
		});
		expect(result.id).toBe(order.id);
		expectAuthenticated();
		expect(lastRequest().path).toBe(`/api/v1/orders/${order.id}`);
	});

	it('confirms an order', async () => {
		respond({ ...order, state: 'working' });
		const result = await invoke<{ state?: string }>(Orders.confirm, {
			orderId: order.id,
		});
		expect(result.state).toBe('working');
		expect(lastRequest().path).toBe(`/api/v1/orders/${order.id}/confirm`);
	});
});

describe('intelligence', () => {
	it('lists companies with the cursor flattened', async () => {
		respond(companyList);
		const result = await invoke<{
			results: { primaryDomain?: string }[];
			nextPageUrl?: string;
		}>(Intelligence.listCompanies, {
			organizationId: 123,
			domain: 'acme.com',
		});
		expect(result.results[0]!.primaryDomain).toBe('acme.com');
		expect(result.nextPageUrl).toContain('page=2');
		expect(lastRequest().query.domain).toBe('acme.com');
	});

	it('reads a company and a person', async () => {
		respond(company);
		const got = await invoke<{ industry?: string }>(Intelligence.getCompany, {
			companyId: 1,
			organizationId: 123,
		});
		expect(got.industry).toBe('Technology');
		// Live: without organization_id the API answers 400 "Parameter
		// missing: workspace_id".
		expect(lastRequest().path).toBe('/api/v1/companies/1');
		expect(lastRequest().query.organization_id).toBe('123');

		respond(person);
		const personResult = await invoke<{ primaryEmail?: string }>(
			Intelligence.getPerson,
			{ personId: 1, organizationId: 123 },
		);
		expect(personResult.primaryEmail).toBe('jane@acme.com');
		expect(lastRequest().path).toBe('/api/v1/people/1');
		expect(lastRequest().query.organization_id).toBe('123');
	});

	it('lists people filtered by email', async () => {
		respond(personList);
		const result = await invoke<{ results: { primaryEmail?: string }[] }>(
			Intelligence.listPeople,
			{
				organizationId: 123,
				email: 'jane@acme.com',
			},
		);
		expect(result.results).toHaveLength(1);
		expect(lastRequest().query.email).toBe('jane@acme.com');
	});
});

describe('error transport', () => {
	it('surfaces a 503 with its status', async () => {
		respond(serverError, 503);
		await expect(
			invoke(Transcriptions.list, { organizationId: 123 }),
		).rejects.toMatchObject({ status: 503 });
	});
});

// Response shapes copied from https://dev.happyscribe.com/sections/product/.
describe('documented response shapes', () => {
	it('lists style guides from the snake_case style_guides key', async () => {
		respond({
			style_guides: [
				{ id: 1, name: 'Corporate Standard', operation: 'transcription' },
			],
		});
		const result = await invoke<{ styleGuides: { id: number }[] }>(
			StyleGuides.list,
			{ organizationId: 123 },
		);
		expect(result.styleGuides).toEqual([
			expect.objectContaining({ id: 1, name: 'Corporate Standard' }),
		]);
	});

	it('accepts numeric organization ids as the reference shows them', async () => {
		respond({ organizations: [{ id: 123, name: 'Acme Corp', role: 'owner' }] });
		const result = await invoke<{ organizations: { id: string | number }[] }>(
			Organizations.list,
			{},
		);
		expect(result.organizations[0]!.id).toBe(123);
	});

	it('reads the member envelope when adding an existing user', async () => {
		respond(
			{
				member: {
					id: 9002,
					organizationId: 123,
					email: 'new-hire@acme.com',
					role: 'member',
				},
			},
			201,
		);
		const result = await invoke<{ member?: { id: number } }>(Memberships.add, {
			organizationId: 123,
			email: 'new-hire@acme.com',
			role: 'member',
		});
		expect(result.member?.id).toBe(9002);
	});

	it('reads the invite envelope when the email is new', async () => {
		respond({ invite: { email: 'new-hire@acme.com', role: 'member' } }, 202);
		const result = await invoke<{ invite?: { email?: string } }>(
			Memberships.add,
			{ organizationId: 123, email: 'new-hire@acme.com', role: 'member' },
		);
		expect(result.invite?.email).toBe('new-hire@acme.com');
	});

	it('reads the member envelope on a role change', async () => {
		respond({ member: { id: 9002, role: 'admin' } });
		const result = await invoke<{ member?: { role?: string } }>(
			Memberships.updateRole,
			{ membershipId: 9002, role: 'admin' },
		);
		expect(result.member?.role).toBe('admin');
	});

	it('pages memberships and flattens the next cursor', async () => {
		respond({
			members: [{ id: 9001, role: 'admin' }],
			_links: {
				next: {
					url: 'https://www.happyscribe.com/api/v1/organization_memberships?organization_id=123&page=2',
				},
			},
		});
		const result = await invoke<{ nextPageUrl?: string }>(Memberships.list, {
			organizationId: 123,
			page: 2,
		});
		expect(lastRequest().query.page).toBe('2');
		expect(result.nextPageUrl).toContain('page=2');
	});
});

describe('documented inputs', () => {
	it('orders the automatic service, which is the documented default', async () => {
		respond(order);
		await invoke(Orders.create, {
			url: 'https://example.com/media.mp3',
			language: 'es',
			service: 'auto',
			organizationId: 123,
		});
		expect(lastRequest().body).toMatchObject({ order: { service: 'auto' } });
	});

	it('rejects the undocumented standard service', async () => {
		await expect(
			invoke(Orders.create, {
				url: 'https://example.com/media.mp3',
				language: 'es',
				service: 'standard',
				organizationId: 123,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends the service on a translation order', async () => {
		respond(order);
		await invoke(Orders.createTranslation, {
			sourceTranscriptionId: transcription.id,
			targetLanguages: ['es'],
			organizationId: 123,
			service: 'pro',
		});
		expect(lastRequest().body).toMatchObject({ order: { service: 'pro' } });
	});

	it.each(['xlsx', 'csv', 'mp4', 'stl'])(
		'accepts the documented %s export format',
		async (format) => {
			respond(exportCreated);
			await invoke(Exports.create, {
				format,
				transcriptionIds: [transcription.id],
			});
			expect(lastRequest().body).toMatchObject({ export: { format } });
		},
	);

	it('rejects tsv, which is not an export format', async () => {
		await expect(
			invoke(Exports.create, {
				format: 'tsv',
				transcriptionIds: [transcription.id],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('moves to the trash by default and deletes for good on permanent', async () => {
		respondEmpty(204);
		await invoke(Transcriptions.delete, { fileId: transcription.id });
		expect(lastRequest().query.permanent).toBeUndefined();

		respondEmpty(204);
		await invoke(Transcriptions.delete, {
			fileId: transcription.id,
			permanent: true,
		});
		expect(lastRequest().query.permanent).toBe('true');
	});

	it('renames and moves a transcription to a folder', async () => {
		respond(transcription);
		await invoke(Transcriptions.updateDetails, {
			fileId: transcription.id,
			organizationId: 123,
			name: 'Renamed',
			folderId: 521,
		});
		expect(lastRequest().body).toEqual({
			transcription: {
				organization_id: 123,
				name: 'Renamed',
				folder_id: 521,
			},
		});
	});

	it('dispatches a meeting now when joinAt and language are omitted', async () => {
		respond(meeting, 201);
		await invoke(Meetings.create, {
			organizationId: 413,
			meetingUrl: 'https://zoom.us/j/123456789',
			accessLevel: 'organization_participants',
		});
		const body = lastRequest().body as Record<string, unknown>;
		expect(body).not.toHaveProperty('join_at');
		expect(body).not.toHaveProperty('language');
		expect(body).toMatchObject({
			settings: { access_level: 'organization_participants' },
		});
	});
});
