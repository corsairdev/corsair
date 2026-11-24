import { ApiError } from 'corsair/http';
import { packMixpanelKey } from './client';
import { mixpanelEndpointsNested } from './endpoints';

// Every request goes through a mocked fetch; an unmocked call throws.
const fetchMock = jest.fn();
const realFetch = global.fetch;

const SECRET = 'svc-secret-value-123456';
const TOKEN = 'project-token-abcdef123456';

const key = (region: 'us' | 'eu' | 'in' = 'us', extra = {}) =>
	packMixpanelKey({
		username: 'corsair.abc123.mp-service-account',
		secret: SECRET,
		projectId: 4086621,
		region,
		projectToken: TOKEN,
		...extra,
	});

function ctx(region: 'us' | 'eu' | 'in' = 'us', extra = {}) {
	return {
		key: key(region, extra),
		// Event logging is best effort; failing to resolve an account only warns.
		$getAccountId: async () => {
			throw new Error('no account in unit tests');
		},
	} as never;
}

function reply(status: number, body: unknown, type = 'application/json') {
	return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
		status,
		headers: { 'content-type': type },
	});
}

type Sent = { url: URL; method: string; headers: Headers; body: string };

function sent(index = 0): Sent {
	const [url, init] = fetchMock.mock.calls[index] as [string, RequestInit];
	return {
		url: new URL(url),
		method: String(init.method),
		headers: new Headers(init.headers),
		body: typeof init.body === 'string' ? init.body : '',
	};
}

beforeAll(() => {
	global.fetch = fetchMock as never;
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});
afterAll(() => {
	global.fetch = realFetch;
});
beforeEach(() => {
	fetchMock.mockReset();
	fetchMock.mockImplementation(() => {
		throw new Error('unexpected request');
	});
});

const api = mixpanelEndpointsNested;

describe('authentication and hosts', () => {
	it('sends the service account as base64 Basic auth (Mixpanel 401s the raw pair)', async () => {
		fetchMock.mockResolvedValueOnce(reply(200, { status: 'ok', results: [] }));
		await api.annotations.list(ctx(), {});
		const { url, headers } = sent();
		expect(url.origin + url.pathname).toBe(
			'https://mixpanel.com/api/app/projects/4086621/annotations',
		);
		const auth = headers.get('authorization') ?? '';
		expect(auth.startsWith('Basic ')).toBe(true);
		expect(Buffer.from(auth.slice(6), 'base64').toString()).toBe(
			`corsair.abc123.mp-service-account:${SECRET}`,
		);
	});

	it.each([
		['us', 'https://api.mixpanel.com/import'],
		['eu', 'https://api-eu.mixpanel.com/import'],
		['in', 'https://api-in.mixpanel.com/import'],
	] as const)('routes %s ingestion to %s', async (region, expected) => {
		fetchMock.mockResolvedValueOnce(
			reply(200, { code: 200, num_records_imported: 1, status: 'OK' }),
		);
		await api.events.import(ctx(region), {
			events: [
				{
					event: 'Signed up',
					properties: { time: 1, distinct_id: 'u1', $insert_id: 'abc-1' },
				},
			],
		});
		const { url } = sent();
		expect(url.origin + url.pathname).toBe(expected);
		expect(url.searchParams.get('project_id')).toBe('4086621');
		expect(url.searchParams.get('strict')).toBe('1');
	});

	it.each([
		['eu', 'https://eu.mixpanel.com/api/query/engage'],
		['in', 'https://in.mixpanel.com/api/query/engage'],
	] as const)('routes %s queries to %s', async (region, expected) => {
		fetchMock.mockResolvedValueOnce(
			reply(200, { results: [], page: 0, page_size: 1000, total: 0 }),
		);
		await api.profiles.query(ctx(region), {});
		const { url } = sent();
		expect(url.origin + url.pathname).toBe(expected);
	});

	it('routes the export and platform APIs to their own hosts', async () => {
		fetchMock
			.mockResolvedValueOnce(reply(200, '', 'text/plain'))
			.mockResolvedValueOnce(
				reply(200, { results: [], pagination: { next_cursor: null } }),
			);
		await api.export.events(ctx('eu'), {
			from_date: '2026-11-01',
			to_date: '2026-11-02',
		});
		await api.dataDefinitions.list(ctx('in'), {
			workspace_id: 77,
			type: ['event', 'metric'],
		});
		expect(sent(0).url.origin).toBe('https://data-eu.mixpanel.com');
		expect(sent(0).url.pathname).toBe('/api/2.0/export');
		expect(sent(1).url.origin).toBe('https://platform-in.mixpanel.com');
		expect(sent(1).url.pathname).toBe('/v1/workspaces/77/data-definitions');
		expect(sent(1).url.searchParams.getAll('type')).toEqual([
			'event',
			'metric',
		]);
	});
});

describe('ingestion with the project token', () => {
	it('maps distinct_id to $distinct_id and adds $token on profile updates', async () => {
		fetchMock.mockResolvedValueOnce(reply(200, { error: null, status: 1 }));
		const result = await api.profiles.set(ctx(), {
			distinct_id: 'user-1',
			$set: { plan: 'pro' },
		});
		const { url, body, headers } = sent();
		expect(url.toString()).toBe(
			'https://api.mixpanel.com/engage?verbose=1&ip=0',
		);
		expect(headers.get('authorization')).toBeNull();
		expect(JSON.parse(body)).toEqual([
			{ $distinct_id: 'user-1', $set: { plan: 'pro' }, $token: TOKEN },
		]);
		expect(result.status).toBe(1);
	});

	it('deletes a profile with $delete and keeps $ignore_alias when given', async () => {
		fetchMock.mockResolvedValueOnce(reply(200, { error: null, status: 1 }));
		await api.profiles.delete(ctx(), {
			distinct_id: 'user-1',
			ignore_alias: true,
		});
		expect(JSON.parse(sent().body)).toEqual([
			{
				$distinct_id: 'user-1',
				$delete: '',
				$ignore_alias: true,
				$token: TOKEN,
			},
		]);
	});

	it('sends group updates with $group_key and $group_id', async () => {
		fetchMock.mockResolvedValueOnce(reply(200, { error: null, status: 1 }));
		await api.groups.unset(ctx(), {
			group_key: 'company',
			group_id: 'Acme',
			$unset: ['tier'],
		});
		expect(sent().url.pathname).toBe('/groups');
		expect(JSON.parse(sent().body)).toEqual([
			{
				$group_key: 'company',
				$group_id: 'Acme',
				$unset: ['tier'],
				$token: TOKEN,
			},
		]);
	});

	it('puts the token in each tracked event', async () => {
		fetchMock.mockResolvedValueOnce(reply(200, { error: null, status: 1 }));
		await api.events.track(ctx(), {
			events: [{ event: 'Viewed', properties: { distinct_id: 'u1' } }],
		});
		expect(JSON.parse(sent().body)).toEqual([
			{ event: 'Viewed', properties: { distinct_id: 'u1', token: TOKEN } },
		]);
	});

	it('form-encodes $identify as the data field', async () => {
		fetchMock.mockResolvedValueOnce(reply(200, { error: null, status: 1 }));
		await api.identity.createIdentity(ctx(), {
			identified_id: 'known',
			anon_id: 'anon',
		});
		const data = new URLSearchParams(sent().body).get('data') ?? '';
		expect(JSON.parse(data)).toEqual({
			event: '$identify',
			properties: { $identified_id: 'known', $anon_id: 'anon', token: TOKEN },
		});
	});

	it('fails before sending when the project token is missing', async () => {
		await expect(
			api.profiles.set(ctx('us', { projectToken: undefined }), {
				distinct_id: 'u1',
				$set: { a: 1 },
			}),
		).rejects.toThrow(/project_token/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('treats a verbose status 0 answer as a failure', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(200, { error: '$distinct_id, missing or empty', status: 0 }),
		);
		await expect(
			api.groups.delete(ctx(), { group_key: 'company', group_id: 'Acme' }),
		).rejects.toThrow('$distinct_id, missing or empty');
	});
});

describe('events.import validation', () => {
	const event = (insertId: string, distinctId: string) => ({
		event: 'Signed up',
		properties: { time: 1, distinct_id: distinctId, $insert_id: insertId },
	});

	it('accepts two users that share an $insert_id (dedup key is the 4-tuple)', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(200, { code: 200, num_records_imported: 2, status: 'OK' }),
		);
		const result = await api.events.import(ctx(), {
			events: [event('request-1', 'alice'), event('request-1', 'bob')],
		});
		expect(result.num_records_imported).toBe(2);
	});

	it('rejects a distinct_id Mixpanel disallows', async () => {
		await expect(
			api.events.import(ctx(), { events: [event('x', 'undefined')] }),
		).rejects.toThrow(/disallows/);
	});

	it('quotes the first failed-record message on a strict 400', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(400, {
				code: 400,
				error: 'some data points in the request failed validation',
				failed_records: [
					'identity events are not allowed when project is using simplified identity management',
				],
				num_records_imported: 0,
				status: 'Bad Request',
			}),
		);
		const error = await api.identity
			.merge(ctx(), { distinct_ids: ['a', 'b'] })
			.catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(400);
		expect((error as ApiError).message).toContain(
			'simplified identity management',
		);
	});
});

describe('errors', () => {
	it('rethrows core ApiError without the request body and scrubs echoed secrets', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(401, {
				status: 'error',
				error: `bad token ${TOKEN}`,
			}),
		);
		const error = (await api.profiles
			.set(ctx(), { distinct_id: 'person@example.com', $set: { a: 1 } })
			.catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(401);
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.request.headers).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain(TOKEN);
		expect(error.message).not.toContain(TOKEN);
		expect(JSON.stringify(error.request)).not.toContain('person@example.com');
	});

	it('surfaces the free-plan 402 with its error code', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(402, {
				request: '/api/query/cohorts/list?project_id=4086621',
				status: 'error',
				error:
					'Your plan does not allow API calls. Upgrade at mixpanel.com/pricing',
				error_code: 'query_api.request.plan_restricted',
			}),
		);
		await expect(api.cohorts.list(ctx(), {})).rejects.toMatchObject({
			status: 402,
			message: expect.stringContaining('query_api.request.plan_restricted'),
		});
	});

	it('reports a malformed export line by number only', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(
				200,
				'{"event":"a","properties":{}}\n{"email":"alice@example.com"',
				'text/plain',
			),
		);
		const error = (await api.export
			.events(ctx(), { from_date: '2026-11-01', to_date: '2026-11-01' })
			.catch((e: unknown) => e)) as Error;
		expect(error.message).toBe('Mixpanel export line 1 is not valid JSON');
	});
});

describe('response shapes seen live', () => {
	it('parses export JSONL into events', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(
				200,
				'{"event":"a","properties":{"time":1}}\n{"event":"b","properties":{"time":2}}\n',
				'text/plain',
			),
		);
		const result = await api.export.events(ctx(), {
			from_date: '2026-11-01',
			to_date: '2026-11-01',
			event_names: ['a', 'b'],
		});
		expect(result.events.map((e) => e.event)).toEqual(['a', 'b']);
		expect(sent().url.searchParams.get('event')).toBe('["a","b"]');
	});

	it('accepts lookupTables.list with results null (empty project)', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(200, { code: 200, results: null, status: 'OK' }),
		);
		const result = await api.lookupTables.list(ctx(), {});
		expect(result.results).toBeNull();
	});

	it('accepts lexicon.listForEntity as a list or, with entity_name, one schema', async () => {
		fetchMock
			.mockResolvedValueOnce(
				reply(200, {
					status: 'ok',
					results: [{ entityType: 'profile', name: '$user', schemaJson: {} }],
				}),
			)
			.mockResolvedValueOnce(
				reply(200, { status: 'ok', results: { properties: {}, required: [] } }),
			);
		await api.lexicon.listForEntity(ctx(), { entity_type: 'profile' });
		const one = await api.lexicon.listForEntity(ctx(), {
			entity_type: 'event',
			entity_name: 'Signed up',
		});
		expect(Array.isArray(one.results)).toBe(false);
		expect(sent(1).url.pathname).toBe(
			'/api/app/projects/4086621/schemas/event',
		);
	});

	it('wraps bare arrays from cohorts, funnels and event names', async () => {
		fetchMock
			.mockResolvedValueOnce(reply(200, [{ id: 1, name: 'c', count: 3 }]))
			.mockResolvedValueOnce(reply(200, [{ funnel_id: 9, name: 'f' }]))
			.mockResolvedValueOnce(reply(200, ['Signed up']));
		expect((await api.cohorts.list(ctx(), {})).cohorts[0]?.id).toBe(1);
		expect((await api.funnels.list(ctx(), {})).funnels[0]?.funnel_id).toBe(9);
		expect((await api.events.names(ctx(), { type: 'general' })).names).toEqual([
			'Signed up',
		]);
		expect(sent(0).method).toBe('POST');
	});

	it('derives next_page from a full engage page', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(200, {
				results: [{ $distinct_id: 'a', $properties: {} }],
				page: 0,
				page_size: 1,
				session_id: 's1',
				total: 3,
				status: 'ok',
			}),
		);
		const page = await api.profiles.query(ctx(), {
			where: 'properties["plan"] == "pro"',
			output_properties: ['plan'],
			filter_by_cohort: 12,
		});
		expect(page.next_page).toBe(1);
		const form = new URLSearchParams(sent().body);
		expect(form.get('output_properties')).toBe('["plan"]');
		expect(form.get('filter_by_cohort')).toBe('{"id":12}');
	});

	it('creates a feature flag on the workspace route', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(200, { status: 'ok', results: { id: 'f-1', key: 'k', name: 'n' } }),
		);
		const result = await api.featureFlags.create(ctx(), {
			workspace_id: 4583382,
			name: 'n',
			key: 'k',
			tags: [],
			context: 'distinct_id',
			serving_method: 'remote_or_local',
			ruleset: { variants: [], rollout: [] },
		});
		expect(result.results?.id).toBe('f-1');
		expect(sent().url.pathname).toBe(
			'/api/app/projects/4086621/workspaces/4583382/feature-flags',
		);
		expect(JSON.parse(sent().body).workspace_id).toBeUndefined();
	});

	it('sends GDPR calls with the bearer token and project token query', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(201, { status: 'ok', results: { task_id: 't-1' } }),
		);
		const result = await api.gdpr.createRetrieval(
			ctx('us', { gdprToken: 'gdpr-oauth-token-xyz' }),
			{ distinct_ids: ['u1'] },
		);
		expect(result.results?.task_id).toBe('t-1');
		expect(sent().headers.get('authorization')).toBe(
			'Bearer gdpr-oauth-token-xyz',
		);
		expect(sent().url.searchParams.get('token')).toBe(TOKEN);
	});

	it('refuses GDPR calls without the GDPR token', async () => {
		await expect(
			api.gdpr.getDeletion(ctx(), { tracking_id: 't-1' }),
		).rejects.toThrow(/gdpr_token/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('form-encodes data pipeline calls with the project id', async () => {
		fetchMock.mockResolvedValueOnce(reply(200, {}));
		await api.pipelines.pause(ctx(), { name: 'trial-events-daily' });
		const form = new URLSearchParams(sent().body);
		expect(sent().url.toString()).toBe(
			'https://data.mixpanel.com/api/2.0/nessie/pipeline/pause',
		);
		expect(form.get('project_id')).toBe('4086621');
		expect(form.get('name')).toBe('trial-events-daily');
	});

	it('encodes path ids', async () => {
		fetchMock.mockResolvedValueOnce(reply(200, { status: 'ok', results: {} }));
		await api.lexicon.get(ctx(), { entity_type: 'event', name: 'a/b c' });
		expect(sent().url.pathname).toBe(
			'/api/app/projects/4086621/schemas/event/a%2Fb%20c',
		);
	});
});
