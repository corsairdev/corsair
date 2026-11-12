import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
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

// Imported after the mock so endpoint modules get the stubbed logger.
import { eventCreate } from './endpoints/events';
import { featureFlagsUpdate } from './endpoints/feature-management';
import { propertyDefinitionsList } from './endpoints/product-analytics';
import { errorTrackingIssuesList, run } from './endpoints/query';

type OutputKey = keyof typeof PostHogEndpointOutputSchemas;

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

function jsonBody(call: FetchCall): Record<string, unknown> {
	return JSON.parse(String(call.init.body));
}

const PHX = 'phx_test_personal_key';
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
	const outputs: OutputKey[] = [
		'queryRun',
		'projectsGet',
		'insightsList',
		'insightsGet',
		'dashboardsList',
		'dashboardsGet',
		'personsList',
		'personsGet',
		'featureFlagsList',
		'featureFlagsGet',
		'featureFlagsUpdate',
		'sessionRecordingsList',
		'sessionRecordingsGet',
		'errorTrackingIssuesList',
		'experimentsList',
		'surveysList',
		'cohortsList',
		'actionsList',
		'annotationsList',
		'annotationsCreate',
		'eventDefinitionsList',
		'propertyDefinitionsList',
		'eventCreate',
	];

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
			url.startsWith('https://us.')
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
			if (url.startsWith('https://us.posthog.com')) {
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
