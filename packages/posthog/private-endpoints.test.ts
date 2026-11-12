import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	CAPTURE_TOKEN_TTL_MS,
	isPersonalApiKey,
	makePostHogApiRequest,
	PERSONAL_KEY_REQUIRED_MESSAGE,
	PostHogAPIError,
	packPostHogCredentials,
	resetPostHogClientCache,
	resolveCaptureTarget,
	unpackPostHogCredentials,
} from './client';
import {
	PostHogEndpointInputSchemas,
	PostHogEndpointOutputSchemas,
} from './endpoints/types';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(async () => null),
}));

import { insightsCreate, insightsDelete } from './endpoints/analytics';
import {
	annotationsCreate,
	notebookDocument,
	notebooksCreate,
	propertyDefinitionsList,
} from './endpoints/data';
// Imported after the mock so endpoint modules get the stubbed logger.
import { eventCreate, trackPage } from './endpoints/events';
import {
	experimentsCreate,
	featureFlagsCreate,
	featureFlagsUpdate,
	surveysDelete,
} from './endpoints/features';
import { organizationsGet, projectsList } from './endpoints/organization';
import { personsDeleteProperty } from './endpoints/people';
import {
	errorTrackingIssuesList,
	eventsList,
	llmAnalyticsCosts,
	logsQuery,
	queryRun as run,
	webAnalyticsStats,
} from './endpoints/query';
import { errorHandlers, isNonIdempotent } from './error-handlers';
import { posthog, posthogEndpointSchemas } from './index';

type OutputKey = keyof typeof PostHogEndpointOutputSchemas;

// Saved JSON responses; each test parses them with the schema it checks.
function fixture(name: string): unknown {
	return JSON.parse(
		readFileSync(join(__dirname, 'test-data', `${name}.json`), 'utf8'),
	);
}

type FetchCall = { url: string; init: RequestInit };

function mockFetch(
	handler: (
		url: string,
		init: RequestInit,
		// Mocked response body: any JSON a test wants fetch to return.
	) => { status: number; body: unknown },
): FetchCall[] {
	const calls: FetchCall[] = [];
	jest
		.spyOn(globalThis, 'fetch')
		.mockImplementation(
			async (input: string | URL | Request, init?: RequestInit) => {
				const url = String(input);
				const call = { url, init: init ?? {} };
				calls.push(call);
				const { status, body } = handler(url, call.init);
				return new Response(JSON.stringify(body), {
					status,
					headers: { 'Content-Type': 'application/json' },
				});
			},
		);
	return calls;
}

function authHeader(call: FetchCall): string | undefined {
	const headers = call.init.headers as Headers | Record<string, string>;
	return headers instanceof Headers
		? (headers.get('Authorization') ?? undefined)
		: headers.Authorization;
}

// Request bodies differ per endpoint; tests assert the fields they care about.
function jsonBody(call: FetchCall): Record<string, unknown> {
	return JSON.parse(String(call.init.body));
}

const PHX = 'phx_test_personal_key';
// Handlers only read `key`, `$getAccountId` and `db` from their context; the
// full plugin context type is large, so the stub is cast with `as never`.
const ctxFor = (credentials: Parameters<typeof packPostHogCredentials>[0]) =>
	({
		key: packPostHogCredentials(credentials),
		$getAccountId: async () => 'account',
		db: {},
	}) as never;

beforeEach(() => {
	resetPostHogClientCache();
	jest.restoreAllMocks();
});

describe('PostHog read schemas parse real responses', () => {
	// Fixtures are trimmed, scrubbed responses from a live run against a real
	// project on 2026-11-12.
	const fixtureNames = readdirSync(join(__dirname, 'test-data')).map((f) =>
		f.replace(/\.json$/, ''),
	);
	const outputs = fixtureNames.filter(
		(name): name is OutputKey => name in PostHogEndpointOutputSchemas,
	);

	it('has a real response for every private-API endpoint', () => {
		const missing = Object.keys(PostHogEndpointOutputSchemas).filter(
			(key) =>
				!fixtureNames.includes(key) &&
				![
					// The test project has no alerts; the schema is covered by a
					// made-up alert below.
					'alertsGet',
				].includes(key),
		);
		expect(missing).toEqual([]);
	});

	it.each(outputs)('%s', (name) => {
		const parsed = PostHogEndpointOutputSchemas[name].parse(fixture(name));
		expect(parsed).toBeTruthy();
	});

	it('keeps typed fields from the HogQL result', () => {
		const parsed = PostHogEndpointOutputSchemas.queryRun.parse(
			fixture('queryRun'),
		);
		expect(parsed.columns).toEqual(['event', 'count()']);
		expect(Array.isArray(parsed.results)).toBe(true);
	});

	it('parses an alert', () => {
		expect(
			PostHogEndpointOutputSchemas.alertsGet.parse({
				id: '0190-alert',
				name: 'Signups dropped',
				enabled: true,
				state: 'Not firing',
				condition: { type: 'absolute_value' },
				threshold: {
					configuration: { type: 'absolute', bounds: { lower: 5 } },
				},
			}).name,
		).toBe('Signups dropped');
	});

	it('parses experiment and survey objects', () => {
		expect(
			PostHogEndpointOutputSchemas.experimentsGet.parse({
				id: 1,
				name: 'Pricing page',
				feature_flag_key: 'pricing-test',
				start_date: null,
			}).id,
		).toBe(1);
		expect(
			PostHogEndpointOutputSchemas.surveysGet.parse({
				id: '0190-survey',
				name: 'NPS',
				type: 'popover',
				questions: [{ type: 'rating', question: 'How likely...' }],
			}).name,
		).toBe('NPS');
	});
});

describe('PostHog read input schemas', () => {
	it('accepts HogQL as a string or any query kind', () => {
		expect(
			PostHogEndpointInputSchemas.queryRun.parse({ query: 'select 1' }).query,
		).toBe('select 1');
		expect(
			PostHogEndpointInputSchemas.queryRun.parse({
				query: { kind: 'TrendsQuery', series: [] },
			}).query,
		).toMatchObject({ kind: 'TrendsQuery' });
		expect(() =>
			PostHogEndpointInputSchemas.queryRun.parse({ query: { series: [] } }),
		).toThrow();
	});

	it('requires at least one change for featureFlags.update', () => {
		expect(() =>
			PostHogEndpointInputSchemas.featureFlagsUpdate.parse({ id: 1 }),
		).toThrow();
		expect(
			PostHogEndpointInputSchemas.featureFlagsUpdate.parse({
				id: 1,
				active: false,
			}).active,
		).toBe(false);
	});

	it('validates list filters', () => {
		expect(() =>
			PostHogEndpointInputSchemas.personsList.parse({ limit: 0 }),
		).toThrow();
		expect(
			PostHogEndpointInputSchemas.propertyDefinitionsList.parse({
				type: 'event',
				event_names: ['$pageview'],
			}).type,
		).toBe('event');
		expect(() =>
			PostHogEndpointInputSchemas.errorTrackingIssuesList.parse({
				status: 'open',
			}),
		).toThrow();
		expect(
			PostHogEndpointInputSchemas.annotationsCreate.parse({ content: 'Deploy' })
				.content,
		).toBe('Deploy');
	});
});

describe('PostHog credentials', () => {
	it('packs and unpacks, and treats a bare string as the key', () => {
		const packed = packPostHogCredentials({ key: PHX, projectId: '12' });
		expect(unpackPostHogCredentials(packed)).toEqual({
			key: PHX,
			projectId: '12',
		});
		expect(unpackPostHogCredentials('phc_abc')).toEqual({ key: 'phc_abc' });
		expect(isPersonalApiKey(PHX)).toBe(true);
		expect(isPersonalApiKey('phc_abc')).toBe(false);
	});
});

describe('PostHog private API routing', () => {
	it('rejects read calls with a project token', async () => {
		const calls = mockFetch(() => ({ status: 200, body: {} }));
		await expect(
			makePostHogApiRequest({ key: 'phc_abc', projectId: '1' }, '/api/x/'),
		).rejects.toThrow(PERSONAL_KEY_REQUIRED_MESSAGE);
		expect(calls).toHaveLength(0);
	});

	it('rejects read calls without a project id', async () => {
		mockFetch(() => ({ status: 200, body: {} }));
		await expect(
			makePostHogApiRequest({ key: PHX }, '/api/projects/{project_id}/'),
		).rejects.toThrow('project id');
	});

	it('sends the personal key as Bearer to the US cloud first', async () => {
		const calls = mockFetch(() => ({ status: 200, body: { id: 7 } }));
		await makePostHogApiRequest(
			{ key: PHX, projectId: '7' },
			'/api/projects/{project_id}/',
		);
		expect(calls[0]!.url).toBe('https://us.posthog.com/api/projects/7/');
		expect(authHeader(calls[0]!)).toBe(`Bearer ${PHX}`);
	});

	it('retries on the EU cloud after a US 401 and remembers it', async () => {
		const calls = mockFetch((url) =>
			new URL(url).host === 'us.posthog.com'
				? { status: 401, body: { detail: 'invalid key' } }
				: { status: 200, body: { id: 7 } },
		);
		const creds = { key: PHX, projectId: '7' };
		await makePostHogApiRequest(creds, '/api/projects/{project_id}/');
		await makePostHogApiRequest(creds, '/api/projects/{project_id}/insights/');
		expect(calls.map((c) => new URL(c.url).host)).toEqual([
			'us.posthog.com',
			'eu.posthog.com',
			'eu.posthog.com',
		]);
	});

	it('throws the US error when neither region accepts the key', async () => {
		mockFetch(() => ({ status: 401, body: { detail: 'invalid key' } }));
		const error = await makePostHogApiRequest(
			{ key: PHX, projectId: '7' },
			'/api/projects/{project_id}/',
		).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(PostHogAPIError);
		expect((error as PostHogAPIError).status).toBe(401);
	});

	it('does not retry other errors on the EU cloud', async () => {
		const calls = mockFetch(() => ({ status: 403, body: { detail: 'scope' } }));
		await expect(
			makePostHogApiRequest(
				{ key: PHX, projectId: '7' },
				'/api/projects/{project_id}/',
			),
		).rejects.toBeInstanceOf(PostHogAPIError);
		expect(calls).toHaveLength(1);
	});

	it('uses a configured host only', async () => {
		const calls = mockFetch(() => ({ status: 200, body: {} }));
		await makePostHogApiRequest(
			{ key: PHX, projectId: '3', host: 'posthog.example.com/' },
			'/api/projects/{project_id}/',
		);
		expect(calls[0]!.url).toBe('https://posthog.example.com/api/projects/3/');
	});
});

describe('PostHog capture target', () => {
	it('uses a project token as is', async () => {
		const calls = mockFetch(() => ({ status: 200, body: {} }));
		expect(await resolveCaptureTarget({ key: 'phc_abc' })).toEqual({
			token: 'phc_abc',
			base: undefined,
		});
		expect(calls).toHaveLength(0);
	});

	it('looks up the project token once for a personal key', async () => {
		const calls = mockFetch(() => ({
			status: 200,
			body: { id: 9, api_token: 'phc_project_token' },
		}));
		const creds = { key: PHX, projectId: '9' };
		const first = await resolveCaptureTarget(creds);
		const second = await resolveCaptureTarget(creds);
		expect(first).toEqual({
			token: 'phc_project_token',
			base: 'https://us.i.posthog.com',
		});
		expect(second).toEqual(first);
		expect(calls).toHaveLength(1);
	});

	it('captures with the looked-up token on the EU ingestion host', async () => {
		const calls = mockFetch((url) => {
			if (new URL(url).host === 'us.posthog.com') {
				return { status: 401, body: { detail: 'invalid key' } };
			}
			if (url.includes('/api/projects/')) {
				return { status: 200, body: { id: 9, api_token: 'phc_eu' } };
			}
			return { status: 200, body: { status: 1 } };
		});
		await eventCreate(ctxFor({ key: PHX, projectId: '9' }), {
			distinct_id: 'user-1',
			event: 'signed_up',
		});
		const capture = calls[calls.length - 1]!;
		expect(capture.url).toBe('https://eu.i.posthog.com/capture/');
		expect(jsonBody(capture)).toMatchObject({
			api_key: 'phc_eu',
			event: 'signed_up',
			distinct_id: 'user-1',
		});
	});

	it('keeps the old capture host for a project token', async () => {
		const calls = mockFetch(() => ({ status: 200, body: { status: 1 } }));
		await eventCreate(ctxFor({ key: 'phc_abc' }), {
			distinct_id: 'user-1',
			event: 'signed_up',
		});
		expect(calls[0]!.url).toBe('https://app.posthog.com/capture/');
		expect(jsonBody(calls[0]!)).toMatchObject({ api_key: 'phc_abc' });
	});
});

describe('PostHog read endpoints build the right requests', () => {
	const ctx = ctxFor({
		key: PHX,
		projectId: '5',
		host: 'https://us.posthog.com',
	});

	it('wraps a HogQL string in a HogQLQuery', async () => {
		const calls = mockFetch(() => ({ status: 200, body: fixture('queryRun') }));
		await run(ctx, { query: 'select 1' });
		expect(calls[0]!.url).toBe('https://us.posthog.com/api/projects/5/query/');
		expect(calls[0]!.init.method).toBe('POST');
		expect(jsonBody(calls[0]!)).toEqual({
			query: { kind: 'HogQLQuery', query: 'select 1' },
		});
	});

	it('lists error tracking issues through an ErrorTrackingQuery', async () => {
		const calls = mockFetch(() => ({
			status: 200,
			body: fixture('errorTrackingIssuesList'),
		}));
		const result = await errorTrackingIssuesList(ctx, {
			status: 'resolved',
			search: 'TypeError',
			limit: 5,
		});
		expect(jsonBody(calls[0]!).query).toMatchObject({
			kind: 'ErrorTrackingQuery',
			status: 'resolved',
			searchQuery: 'TypeError',
			limit: 5,
			orderBy: 'occurrences',
			dateRange: { date_from: '-7d' },
		});
		expect(result.results.length).toBeGreaterThan(0);
	});

	it('drops the extra row the query runner adds for hasMore', async () => {
		// Only the row count matters in this test.
		const body = fixture('errorTrackingIssuesList') as { results: unknown[] };
		const one = body.results[0];
		mockFetch(() => ({
			status: 200,
			body: { ...body, results: [one, one, one], hasMore: true },
		}));
		const result = await errorTrackingIssuesList(ctx, { limit: 2 });
		expect(result.results).toHaveLength(2);
		expect(result.hasMore).toBe(true);
	});

	it('sends property filters as PostHog expects', async () => {
		const calls = mockFetch(() => ({
			status: 200,
			body: fixture('propertyDefinitionsList'),
		}));
		await propertyDefinitionsList(ctx, {
			type: 'event',
			event_names: ['$pageview'],
			limit: 2,
		});
		const url = new URL(calls[0]!.url);
		expect(url.pathname).toBe('/api/projects/5/property_definitions/');
		expect(url.searchParams.get('event_names')).toBe('["$pageview"]');
		expect(url.searchParams.get('filter_by_event_names')).toBe('true');
		expect(url.searchParams.get('type')).toBe('event');
	});

	it('patches a feature flag without sending its id in the body', async () => {
		const calls = mockFetch(() => ({
			status: 200,
			body: fixture('featureFlagsUpdate'),
		}));
		await featureFlagsUpdate(ctx, { id: 42, active: false });
		expect(calls[0]!.url).toBe(
			'https://us.posthog.com/api/projects/5/feature_flags/42/',
		);
		expect(calls[0]!.init.method).toBe('PATCH');
		expect(jsonBody(calls[0]!)).toEqual({ active: false });
	});
});

describe('PostHog project scope', () => {
	const ctx = ctxFor({
		key: PHX,
		projectId: '5',
		host: 'https://us.posthog.com',
	});

	it('uses a per-call project_id and never sends it to PostHog', async () => {
		const calls = mockFetch((url) => ({
			status: 200,
			body: fixture(
				url.includes('/query/') ? 'queryRun' : 'propertyDefinitionsList',
			),
		}));
		await run(ctx, { query: 'select 1', project_id: 99 });
		expect(calls[0]!.url).toBe('https://us.posthog.com/api/projects/99/query/');
		expect(jsonBody(calls[0]!)).not.toHaveProperty('project_id');

		await propertyDefinitionsList(ctx, { project_id: '42', limit: 1 });
		const url = new URL(calls[1]!.url);
		expect(url.pathname).toBe('/api/projects/42/property_definitions/');
		expect(url.searchParams.has('project_id')).toBe(false);
	});

	it('reaches organization endpoints without a project id', async () => {
		const calls = mockFetch((url) => ({
			status: 200,
			body: fixture(
				url.includes('/projects/') ? 'projectsList' : 'organizationsGet',
			),
		}));
		const noProject = ctxFor({ key: PHX, host: 'https://us.posthog.com' });
		await projectsList(noProject, {});
		await organizationsGet(noProject, { id: 'org-uuid' });
		expect(calls.map((c) => new URL(c.url).pathname)).toEqual([
			'/api/organizations/@current/projects/',
			'/api/organizations/org-uuid/',
		]);
	});
});

describe('PostHog query-backed reads', () => {
	const ctx = ctxFor({
		key: PHX,
		projectId: '5',
		host: 'https://us.posthog.com',
	});

	it('lists events through an EventsQuery', async () => {
		const calls = mockFetch(() => ({
			status: 200,
			body: fixture('eventsList'),
		}));
		await eventsList(ctx, { event: '$pageview', limit: 2 });
		expect(jsonBody(calls[0]!).query).toMatchObject({
			kind: 'EventsQuery',
			event: '$pageview',
			after: '-24h',
			orderBy: ['timestamp DESC'],
			limit: 2,
		});
	});

	it('asks for a web analytics breakdown', async () => {
		const calls = mockFetch(() => ({
			status: 200,
			body: fixture('webAnalyticsStats'),
		}));
		await webAnalyticsStats(ctx, { breakdown_by: 'InitialUTMSource' });
		expect(jsonBody(calls[0]!).query).toMatchObject({
			kind: 'WebStatsTableQuery',
			breakdownBy: 'InitialUTMSource',
			dateRange: { date_from: '-7d' },
		});
	});

	it('puts only a whole number of days into the LLM cost query', async () => {
		const calls = mockFetch(() => ({
			status: 200,
			body: fixture('llmAnalyticsCosts'),
		}));
		await llmAnalyticsCosts(ctx, { days: 14 });
		const query = (jsonBody(calls[0]!).query as { query: string }).query;
		expect(query).toContain('interval 14 day');
		expect(() =>
			PostHogEndpointInputSchemas.llmAnalyticsCosts.parse({ days: '7; drop' }),
		).toThrow();
	});

	it('queries logs on the environment logs endpoint', async () => {
		const calls = mockFetch(() => ({
			status: 200,
			body: fixture('logsQuery'),
		}));
		const filter = {
			key: 'message',
			type: 'log' as const,
			operator: 'icontains',
			value: 'timeout',
		};
		await logsQuery(ctx, {
			service_names: ['api'],
			severity_levels: ['error'],
			search: 'timeout',
			filters: [filter],
		});
		expect(calls[0]!.url).toBe(
			'https://us.posthog.com/api/environments/5/logs/query/',
		);
		expect(jsonBody(calls[0]!).query).toMatchObject({
			serviceNames: ['api'],
			severityLevels: ['error'],
			searchTerm: 'timeout',
			dateRange: { date_from: '-1h' },
			filterGroup: {
				type: 'AND',
				values: [{ type: 'AND', values: [filter] }],
			},
		});
	});

	it('pages web analytics breakdowns with offset', async () => {
		const calls = mockFetch(() => ({
			status: 200,
			body: fixture('webAnalyticsStats'),
		}));
		await webAnalyticsStats(ctx, { breakdown_by: 'Page', limit: 2, offset: 2 });
		expect(jsonBody(calls[0]!).query).toMatchObject({ limit: 2, offset: 2 });
	});
});

describe('PostHog writes', () => {
	const ctx = ctxFor({
		key: PHX,
		projectId: '5',
		host: 'https://us.posthog.com',
	});

	it('saves a new insight', async () => {
		const calls = mockFetch(() => ({
			status: 201,
			body: fixture('insightsCreate'),
		}));
		await insightsCreate(ctx, {
			name: 'Pageviews',
			query: { kind: 'InsightVizNode', source: { kind: 'TrendsQuery' } },
		});
		expect(calls[0]!.init.method).toBe('POST');
		expect(jsonBody(calls[0]!)).toMatchObject({
			name: 'Pageviews',
			saved: true,
		});
	});

	it('deletes by flagging the object deleted', async () => {
		const calls = mockFetch(() => ({
			status: 200,
			body: fixture('insightsDelete'),
		}));
		await insightsDelete(ctx, { id: 7 });
		expect(calls[0]!.url).toBe(
			'https://us.posthog.com/api/projects/5/insights/7/',
		);
		expect(calls[0]!.init.method).toBe('PATCH');
		expect(jsonBody(calls[0]!)).toEqual({ deleted: true });
	});

	it('turns rollout_percentage into a release condition', async () => {
		const calls = mockFetch(() => ({
			status: 201,
			body: fixture('featureFlagsCreate'),
		}));
		await featureFlagsCreate(ctx, {
			key: 'new-onboarding',
			active: false,
			rollout_percentage: 20,
		});
		expect(jsonBody(calls[0]!)).toEqual({
			key: 'new-onboarding',
			active: false,
			filters: { groups: [{ properties: [], rollout_percentage: 20 }] },
		});
		expect(() =>
			PostHogEndpointInputSchemas.featureFlagsCreate.parse({
				key: 'has space',
			}),
		).toThrow();
	});

	it('returns a confirmation for a survey delete (PostHog sends 204)', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response(null, { status: 204 }));
		await expect(surveysDelete(ctx, { id: 'abc' })).resolves.toEqual({
			id: 'abc',
			deleted: true,
		});
	});

	it('unsets one person property', async () => {
		const calls = mockFetch(() => ({ status: 202, body: {} }));
		const result = await personsDeleteProperty(ctx, {
			id: 'uuid-1',
			key: 'plan',
		});
		expect(calls[0]!.url).toBe(
			'https://us.posthog.com/api/projects/5/persons/uuid-1/delete_property/',
		);
		expect(jsonBody(calls[0]!)).toEqual({ $unset: 'plan' });
		expect(result).toEqual({ id: 'uuid-1', key: 'plan', success: true });
	});

	it('builds a notebook from a title and text', async () => {
		const calls = mockFetch(() => ({
			status: 201,
			body: fixture('notebooksCreate'),
		}));
		await notebooksCreate(ctx, { title: 'Weekly review', text: 'One\n\nTwo' });
		expect(jsonBody(calls[0]!).content).toEqual(
			notebookDocument('Weekly review', 'One\n\nTwo'),
		);
		expect(notebookDocument('T', 'One\n\nTwo').content).toHaveLength(3);
	});

	it('keeps experiments and surveys as drafts', () => {
		const experiment = PostHogEndpointInputSchemas.experimentsCreate.parse({
			name: 'Pricing',
			feature_flag_key: 'pricing-test',
			start_date: '2026-01-01',
		});
		expect(experiment).not.toHaveProperty('start_date');
		const survey = PostHogEndpointInputSchemas.surveysUpdate.parse({
			id: 's1',
			name: 'NPS',
			start_date: '2026-01-01',
		});
		expect(survey).not.toHaveProperty('start_date');
		expect(() =>
			PostHogEndpointInputSchemas.surveysUpdate.parse({ id: 's1' }),
		).toThrow();
	});
});

describe('PostHog input and output validation', () => {
	const ctx = ctxFor({
		key: PHX,
		projectId: '5',
		host: 'https://us.posthog.com',
	});

	it('drops start_date from experiments.create even from plain JS', async () => {
		const calls = mockFetch(() => ({
			status: 201,
			body: fixture('experimentsCreate'),
		}));
		// A plain object with a key the schema doesn't have, as an agent or a
		// JS caller could send it; `as never` skips the compile-time check.
		await experimentsCreate(ctx, {
			name: 'Pricing',
			feature_flag_key: 'pricing-test',
			start_date: '2026-01-01T00:00:00Z',
			end_date: '2026-02-01T00:00:00Z',
		} as never);
		const body = jsonBody(calls[0]!);
		expect(body).toMatchObject({
			name: 'Pricing',
			feature_flag_key: 'pricing-test',
		});
		expect(body).not.toHaveProperty('start_date');
		expect(body).not.toHaveProperty('end_date');
	});

	it('rejects invalid input before calling PostHog', async () => {
		const calls = mockFetch(() => ({ status: 200, body: {} }));
		await expect(
			featureFlagsCreate(ctx, { key: 'has space' } as never),
		).rejects.toThrow();
		await expect(
			trackPage(ctxFor({ key: 'phc_abc' }), { distinct_id: 'u' } as never),
		).rejects.toThrow();
		expect(calls).toHaveLength(0);
	});

	it('throws when a PostHog response does not match the schema', async () => {
		mockFetch(() => ({ status: 200, body: { unexpected: true } }));
		await expect(insightsDelete(ctx, { id: 7 })).rejects.toThrow(
			'posthog.insights.delete',
		);
	});

	it('scopes an annotation to its insight', async () => {
		const calls = mockFetch(() => ({
			status: 201,
			body: fixture('annotationsCreate'),
		}));
		await annotationsCreate(ctx, { content: 'Deploy', dashboard_item: 12 });
		await annotationsCreate(ctx, { content: 'Deploy' });
		expect(jsonBody(calls[0]!)).toMatchObject({
			scope: 'dashboard_item',
			dashboard_item: 12,
		});
		expect(jsonBody(calls[1]!)).toMatchObject({ scope: 'project' });
	});
});

describe('PostHog sends each action to the right place', () => {
	// Hand-written from PostHog's API reference, not derived from the code:
	// [operation, minimal input, method, path, a key the body must carry].
	const P = '/api/projects/5';
	const E = '/api/environments/5';
	// Inputs differ per endpoint; each row carries the minimal input for its action.
	const cases: [string, Record<string, unknown>, string, string, string?][] = [
		['organizations.list', {}, 'GET', '/api/organizations/'],
		['organizations.get', {}, 'GET', '/api/organizations/@current/'],
		['projects.list', {}, 'GET', '/api/organizations/@current/projects/'],
		['projects.get', {}, 'GET', `${P}/`],
		['query.run', { query: 'select 1' }, 'POST', `${P}/query/`, 'query'],
		['events.list', {}, 'POST', `${P}/query/`, 'query'],
		['errorTracking.issuesList', {}, 'POST', `${P}/query/`, 'query'],
		['webAnalytics.overview', {}, 'POST', `${P}/query/`, 'query'],
		[
			'webAnalytics.stats',
			{ breakdown_by: 'Page' },
			'POST',
			`${P}/query/`,
			'query',
		],
		['llmAnalytics.traces', {}, 'POST', `${P}/query/`, 'query'],
		['llmAnalytics.costs', {}, 'POST', `${P}/query/`, 'query'],
		['logs.query', {}, 'POST', `${E}/logs/query/`, 'query'],
		['insights.list', {}, 'GET', `${P}/insights/`],
		['insights.get', { id: 1 }, 'GET', `${P}/insights/1/`],
		[
			'insights.create',
			{ name: 'n', query: { kind: 'TrendsQuery' } },
			'POST',
			`${P}/insights/`,
			'name',
		],
		[
			'insights.update',
			{ id: 1, name: 'n' },
			'PATCH',
			`${P}/insights/1/`,
			'name',
		],
		['insights.delete', { id: 1 }, 'PATCH', `${P}/insights/1/`, 'deleted'],
		['dashboards.list', {}, 'GET', `${P}/dashboards/`],
		['dashboards.get', { id: 1 }, 'GET', `${P}/dashboards/1/`],
		['dashboards.create', { name: 'n' }, 'POST', `${P}/dashboards/`, 'name'],
		[
			'dashboards.update',
			{ id: 1, name: 'n' },
			'PATCH',
			`${P}/dashboards/1/`,
			'name',
		],
		['dashboards.delete', { id: 1 }, 'PATCH', `${P}/dashboards/1/`, 'deleted'],
		['persons.list', {}, 'GET', `${P}/persons/`],
		['persons.get', { id: 'p1' }, 'GET', `${P}/persons/p1/`],
		[
			'persons.updateProperty',
			{ id: 'p1', key: 'plan', value: 'pro' },
			'POST',
			`${P}/persons/p1/update_property/`,
			'key',
		],
		[
			'persons.deleteProperty',
			{ id: 'p1', key: 'plan' },
			'POST',
			`${P}/persons/p1/delete_property/`,
			'$unset',
		],
		['cohorts.list', {}, 'GET', `${P}/cohorts/`],
		['cohorts.get', { id: 1 }, 'GET', `${P}/cohorts/1/`],
		['cohorts.create', { name: 'n' }, 'POST', `${P}/cohorts/`, 'name'],
		[
			'cohorts.update',
			{ id: 1, name: 'n' },
			'PATCH',
			`${P}/cohorts/1/`,
			'name',
		],
		['actions.list', {}, 'GET', `${P}/actions/`],
		['actions.get', { id: 1 }, 'GET', `${P}/actions/1/`],
		[
			'actions.create',
			{ name: 'n', steps: [{ event: 'signed_up' }] },
			'POST',
			`${P}/actions/`,
			'steps',
		],
		['annotations.list', {}, 'GET', `${P}/annotations/`],
		[
			'annotations.create',
			{ content: 'c' },
			'POST',
			`${P}/annotations/`,
			'content',
		],
		[
			'annotations.update',
			{ id: 1, content: 'c' },
			'PATCH',
			`${P}/annotations/1/`,
			'content',
		],
		[
			'annotations.delete',
			{ id: 1 },
			'PATCH',
			`${P}/annotations/1/`,
			'deleted',
		],
		['eventDefinitions.list', {}, 'GET', `${P}/event_definitions/`],
		['propertyDefinitions.list', {}, 'GET', `${P}/property_definitions/`],
		['notebooks.list', {}, 'GET', `${P}/notebooks/`],
		['notebooks.get', { short_id: 'abc' }, 'GET', `${P}/notebooks/abc/`],
		['notebooks.create', { title: 't' }, 'POST', `${P}/notebooks/`, 'content'],
		['alerts.list', {}, 'GET', `${P}/alerts/`],
		['alerts.get', { id: 'a1' }, 'GET', `${P}/alerts/a1/`],
		['featureFlags.list', {}, 'GET', `${P}/feature_flags/`],
		['featureFlags.get', { id: 1 }, 'GET', `${P}/feature_flags/1/`],
		['featureFlags.create', { key: 'k' }, 'POST', `${P}/feature_flags/`, 'key'],
		[
			'featureFlags.update',
			{ id: 1, active: false },
			'PATCH',
			`${P}/feature_flags/1/`,
			'active',
		],
		[
			'featureFlags.delete',
			{ id: 1 },
			'PATCH',
			`${P}/feature_flags/1/`,
			'deleted',
		],
		['experiments.list', {}, 'GET', `${P}/experiments/`],
		['experiments.get', { id: 1 }, 'GET', `${P}/experiments/1/`],
		[
			'experiments.create',
			{ name: 'n', feature_flag_key: 'k' },
			'POST',
			`${P}/experiments/`,
			'feature_flag_key',
		],
		[
			'experiments.update',
			{ id: 1, name: 'n' },
			'PATCH',
			`${P}/experiments/1/`,
			'name',
		],
		['surveys.list', {}, 'GET', `${P}/surveys/`],
		['surveys.get', { id: 's1' }, 'GET', `${P}/surveys/s1/`],
		[
			'surveys.create',
			{ name: 'n', questions: [{ type: 'open', question: 'q' }] },
			'POST',
			`${P}/surveys/`,
			'questions',
		],
		[
			'surveys.update',
			{ id: 's1', name: 'n' },
			'PATCH',
			`${P}/surveys/s1/`,
			'name',
		],
		['surveys.delete', { id: 's1' }, 'DELETE', `${P}/surveys/s1/`],
		['earlyAccessFeatures.list', {}, 'GET', `${P}/early_access_feature/`],
		['sessionRecordings.list', {}, 'GET', `${E}/session_recordings/`],
		[
			'sessionRecordings.get',
			{ id: 'r1' },
			'GET',
			`${E}/session_recordings/r1/`,
		],
		[
			'sessionRecordingPlaylists.list',
			{},
			'GET',
			`${P}/session_recording_playlists/`,
		],
		['batchExports.list', {}, 'GET', `${P}/batch_exports/`],
		['hogFunctions.list', {}, 'GET', `${P}/hog_functions/`],
		['hogFunctions.get', { id: 'h1' }, 'GET', `${P}/hog_functions/h1/`],
		['warehouseTables.list', {}, 'GET', `${P}/warehouse_tables/`],
	];

	// Handlers by "group.method", straight from the plugin's endpoint tree.
	const tree = posthog().endpoints as unknown as Record<
		string,
		Record<string, (ctx: never, input: never) => Promise<unknown>>
	>;
	const ctx = ctxFor({
		key: PHX,
		projectId: '5',
		host: 'https://us.posthog.com',
	});

	it('covers every private-API action', () => {
		const capture = new Set([
			'events.aliasCreate',
			'events.eventCreate',
			'events.identityCreate',
			'events.trackPage',
			'events.trackScreen',
		]);
		const expected = Object.keys(posthogEndpointSchemas).filter(
			(op) => !capture.has(op),
		);
		expect(cases.map(([op]) => op).sort()).toEqual(expected.sort());
	});

	// Rows become objects: a 4-field row would hand jest's `done` callback to
	// a fifth positional parameter and the test would wait for it.
	const rows = cases.map(([operation, input, method, path, bodyKey]) => ({
		operation,
		input,
		method,
		path,
		bodyKey,
	}));

	it.each(rows)(
		'$operation → $method $path',
		async ({ operation, input, method, path, bodyKey }) => {
			const [group, action] = operation.split('.') as [string, string];
			// Hand back the action's recorded response so the output check passes
			// and the test asserts only the request.
			const name = `${group}${action[0]!.toUpperCase()}${action.slice(1)}`;
			// alerts.get has no recording (the project has no alerts).
			const body = existsSync(join(__dirname, 'test-data', `${name}.json`))
				? fixture(name)
				: { id: 'a1', name: 'Signups dropped', enabled: true };
			const calls = mockFetch(() => ({ status: 200, body }));
			const handler = tree[group]?.[action];
			expect(handler).toBeDefined();
			await handler!(ctx, input as never);
			expect(calls).toHaveLength(1);
			expect(calls[0]!.init.method ?? 'GET').toBe(method);
			expect(new URL(calls[0]!.url).pathname).toBe(path);
			if (bodyKey) expect(jsonBody(calls[0]!)).toHaveProperty([bodyKey]);
		},
	);
});

describe('PostHog retries', () => {
	// The error-handler context carries more fields; these handlers only read
	// `operation`, so the stub is cast.
	const context = (operation: string) =>
		({ operation, pluginId: 'posthog', args: {} }) as never;
	const serverError = Object.assign(new Error('Internal Server Error'), {
		status: 500,
	});
	const rateLimited = Object.assign(new Error('Too Many Requests'), {
		status: 429,
	});

	it('marks creates and captures as not safe to resend', () => {
		expect(isNonIdempotent('insights.create')).toBe(true);
		expect(isNonIdempotent('notebooks.create')).toBe(true);
		expect(isNonIdempotent('events.eventCreate')).toBe(true);
		expect(isNonIdempotent('events.trackPage')).toBe(true);
		expect(isNonIdempotent('insights.update')).toBe(false);
		expect(isNonIdempotent('query.run')).toBe(false);
	});

	it('retries a 5xx only for reads and updates', async () => {
		const handle = errorHandlers.SERVER_ERROR.handler;
		expect(errorHandlers.SERVER_ERROR.match(serverError)).toBe(true);
		expect(
			(await handle(serverError, context('insights.list'))).maxRetries,
		).toBe(2);
		expect(
			(await handle(serverError, context('featureFlags.update'))).maxRetries,
		).toBe(2);
		expect(
			(await handle(serverError, context('insights.create'))).maxRetries,
		).toBe(0);
		expect(
			(await handle(serverError, context('events.identityCreate'))).maxRetries,
		).toBe(0);
	});

	it('leaves 429 retries to the HTTP layer', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		expect((await errorHandlers.RATE_LIMIT_ERROR.handler()).maxRetries).toBe(0);
	});
});

describe('PostHog key safety and token cache', () => {
	it('refuses to send a personal key over plain http', async () => {
		const calls = mockFetch(() => ({ status: 200, body: {} }));
		await expect(
			makePostHogApiRequest(
				{ key: PHX, projectId: '1', host: 'http://posthog.example.com' },
				'/api/projects/{project_id}/',
			),
		).rejects.toThrow('plain http');
		expect(calls).toHaveLength(0);

		await makePostHogApiRequest(
			{ key: PHX, projectId: '1', host: 'http://localhost:8000' },
			'/api/projects/{project_id}/',
		);
		expect(calls[0]!.url).toBe('http://localhost:8000/api/projects/1/');
	});

	it('shares one token lookup between concurrent captures', async () => {
		const calls = mockFetch(() => ({
			status: 200,
			body: { id: 1, api_token: 'phc_shared' },
		}));
		const creds = { key: PHX, projectId: '1' };
		const targets = await Promise.all([
			resolveCaptureTarget(creds),
			resolveCaptureTarget(creds),
			resolveCaptureTarget(creds),
		]);
		expect(targets.map((t) => t.token)).toEqual([
			'phc_shared',
			'phc_shared',
			'phc_shared',
		]);
		expect(calls).toHaveLength(1);
	});

	it('forgets a failed lookup so the next capture tries again', async () => {
		let attempt = 0;
		const calls = mockFetch(() =>
			++attempt === 1
				? { status: 403, body: { detail: 'missing project:read' } }
				: { status: 200, body: { id: 1, api_token: 'phc_ok' } },
		);
		const creds = { key: PHX, projectId: '1' };
		await expect(resolveCaptureTarget(creds)).rejects.toBeInstanceOf(
			PostHogAPIError,
		);
		expect((await resolveCaptureTarget(creds)).token).toBe('phc_ok');
		expect(calls).toHaveLength(2);
	});

	it('looks the token up again after the TTL', async () => {
		const now = jest.spyOn(Date, 'now').mockReturnValue(1_000_000);
		const calls = mockFetch(() => ({
			status: 200,
			body: { id: 1, api_token: 'phc_ttl' },
		}));
		const creds = { key: PHX, projectId: '1' };
		await resolveCaptureTarget(creds);
		now.mockReturnValue(1_000_000 + CAPTURE_TOKEN_TTL_MS - 1);
		await resolveCaptureTarget(creds);
		expect(calls).toHaveLength(1);
		now.mockReturnValue(1_000_000 + CAPTURE_TOKEN_TTL_MS + 1);
		await resolveCaptureTarget(creds);
		expect(calls).toHaveLength(2);
	});

	it('refreshes a rotated project token once after a capture 401', async () => {
		let lookups = 0;
		const calls = mockFetch((url, init) => {
			if (new URL(url).pathname === '/api/projects/9/') {
				lookups += 1;
				return {
					status: 200,
					body: { id: 9, api_token: lookups === 1 ? 'phc_old' : 'phc_new' },
				};
			}
			const token = (JSON.parse(String(init.body)) as { api_key: string })
				.api_key;
			return token === 'phc_old'
				? { status: 401, body: { detail: 'invalid token' } }
				: { status: 200, body: { status: 1 } };
		});
		await eventCreate(ctxFor({ key: PHX, projectId: '9' }), {
			distinct_id: 'user-1',
			event: 'signed_up',
		});
		const captures = calls.filter(
			(c) => new URL(c.url).pathname === '/capture/',
		);
		expect(captures.map((c) => jsonBody(c).api_key)).toEqual([
			'phc_old',
			'phc_new',
		]);
		expect(lookups).toBe(2);
	});
});
