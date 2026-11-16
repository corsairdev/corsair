import { createCorsair } from 'corsair';
import type { CorsairEndpoint } from 'corsair/core';
import { asRecord } from 'corsair/core';
import type { NewrelicPluginOptions } from './index';
import { newrelic, newrelicEndpointsNested } from './index';
import {
	applications,
	conditions,
	createdPolicy,
	graphqlForbidden,
	graphqlNrqlError,
	metricData,
	nrqlResult,
	policies,
	rateLimited,
	restAuthError,
	silentApplication,
} from './test-fixtures';

const API_KEY = 'NRAK-TESTKEY';

function makeContext() {
	return {
		key: API_KEY,
		authType: 'api_key' as const,
		options: {} as NewrelicPluginOptions,
		tenantId: 'default',
		log: async () => undefined,
		db: {},
		keys: {},
		_http: {},
	};
}

// unknown: each operation has its own input and output, and every call site
// passes a concrete value that the operation's schema validates.
type Endpoint = CorsairEndpoint<never, unknown, unknown>;

const endpoints = newrelicEndpointsNested;

/** Runs one endpoint and returns the response and the request that made it. */
async function capture(
	endpoint: Endpoint,
	input: unknown,
	body: unknown,
	{ status = 200, contentType = 'application/json', headers = {} } = {},
): Promise<{ result: unknown; url: string; init: RequestInit }> {
	const original = globalThis.fetch;
	let url = '';
	let init: RequestInit = {};
	globalThis.fetch = (async (called: string, options: RequestInit) => {
		url = called;
		init = options;
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{ status, headers: { 'Content-Type': contentType, ...headers } },
		);
	}) as typeof fetch;

	try {
		const result = await endpoint(makeContext() as never, input);
		if (!url) throw new Error('no request was made');
		return { result, url, init };
	} finally {
		globalThis.fetch = original;
	}
}

function sentBody(init: RequestInit): Record<string, unknown> {
	// unknown: the body is the JSON the endpoint built; read as a record.
	const parsed = JSON.parse(String(init.body)) as unknown;
	const record = asRecord(parsed);
	if (!record) throw new Error('request body was not an object');
	return record;
}

describe('request shape', () => {
	it('sends the user key in the API-Key header on REST v2', async () => {
		const { url, init } = await capture(
			endpoints.applications.list,
			{},
			applications,
		);

		expect(url).toBe('https://api.newrelic.com/v2/applications.json');
		const headers = new Headers(init.headers);
		expect(headers.get('api-key')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
	});

	it('uses the EU host when the region is eu', async () => {
		const { url } = await capture(
			endpoints.applications.list,
			{ region: 'eu' },
			applications,
		);

		expect(url.startsWith('https://api.eu.newrelic.com/v2/')).toBe(true);
	});
});

describe('applications.list', () => {
	it('lifts the applications out and keeps the health colour', async () => {
		const { result } = await capture(
			endpoints.applications.list,
			{},
			applications,
		);

		const list = asRecord(result)?.applications;
		const app = asRecord(Array.isArray(list) ? list[0] : null);
		expect(app?.health_status).toBe('green');
		expect(app?.reporting).toBe(true);
		const summary = asRecord(app?.application_summary);
		expect(summary?.apdex_score).toBe(0.97);
	});

	it('sends the filters as bracketed query names', async () => {
		const { url } = await capture(
			endpoints.applications.list,
			{ name: 'Web', host: 'web-01', ids: [1129082, 1129083], page: 2 },
			applications,
		);

		const parsed = new URL(url);
		expect(parsed.searchParams.get('filter[name]')).toBe('Web');
		expect(parsed.searchParams.get('filter[host]')).toBe('web-01');
		expect(parsed.searchParams.get('filter[ids]')).toBe('1129082,1129083');
		expect(parsed.searchParams.get('page')).toBe('2');
	});

	it('keeps a silent app with unknown health and no last report', async () => {
		const { result } = await capture(
			endpoints.applications.get,
			{ applicationId: 1129083 },
			silentApplication,
		);

		const app = asRecord(asRecord(result)?.application);
		expect(app?.health_status).toBe('unknown');
		expect(app?.reporting).toBe(false);
		expect(app?.last_reported_at).toBe('');
	});
});

describe('applications.get', () => {
	it('addresses the app by id', async () => {
		const { url } = await capture(
			endpoints.applications.get,
			{ applicationId: 1129082 },
			silentApplication,
		);

		expect(url).toBe('https://api.newrelic.com/v2/applications/1129082.json');
	});

	it('rejects a non-integer id before sending', async () => {
		await expect(
			endpoints.applications.get(makeContext() as never, {
				applicationId: 1.5,
			}),
		).rejects.toThrow();
	});
});

describe('metrics.get', () => {
	it('repeats names[] once per metric', async () => {
		const { url } = await capture(
			endpoints.metrics.get,
			{ applicationId: 1129082, names: ['Apdex', 'Errors/all'] },
			metricData,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/v2/applications/1129082/metrics/data.json');
		expect(parsed.searchParams.getAll('names[]')).toEqual([
			'Apdex',
			'Errors/all',
		]);
	});

	it('passes the window and the summarize flag', async () => {
		const { url } = await capture(
			endpoints.metrics.get,
			{
				applicationId: 1129082,
				names: ['Apdex'],
				from: '2026-11-16T14:42:00+00:00',
				to: '2026-11-16T15:12:00+00:00',
				summarize: true,
			},
			metricData,
		);

		const parsed = new URL(url);
		expect(parsed.searchParams.get('summarize')).toBe('true');
		// The offset's + is percent-encoded, which New Relic accepts.
		expect(parsed.searchParams.get('from')).toBe('2026-11-16T14:42:00+00:00');
	});

	it('keeps the timeslice values', async () => {
		const { result } = await capture(
			endpoints.metrics.get,
			{ applicationId: 1129082, names: ['Apdex'] },
			metricData,
		);

		const series = asRecord(asRecord(result)?.metric_data)?.metrics;
		const first = asRecord(Array.isArray(series) ? series[0] : null);
		const values = first?.values;
		const value = asRecord(Array.isArray(values) ? values[0] : null);
		expect(value?.average_value).toBe(0.97);
		expect(value?.call_count).toBe(1);
	});

	it('rejects an empty metric name list', async () => {
		await expect(
			endpoints.metrics.get(makeContext() as never, {
				applicationId: 1129082,
				names: [],
			}),
		).rejects.toThrow();
	});
});

describe('alerts policies', () => {
	it('lists policies with their incident preference', async () => {
		const { result, url } = await capture(
			endpoints.alerts.policies,
			{},
			policies,
		);

		expect(url).toBe('https://api.newrelic.com/v2/alerts_policies.json');
		const list = asRecord(result)?.policies;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		expect(first?.incident_preference).toBe('PER_POLICY');
	});

	it('wraps a create in a policy object', async () => {
		const { result, init } = await capture(
			endpoints.alerts.createPolicy,
			{ name: 'EMEA API alerts', incident_preference: 'PER_CONDITION' },
			createdPolicy,
			{ status: 201 },
		);

		const body = sentBody(init);
		const policy = asRecord(body.policy);
		expect(policy?.name).toBe('EMEA API alerts');
		expect(policy?.incident_preference).toBe('PER_CONDITION');
		expect(asRecord(asRecord(result)?.policy)?.id).toBe(999001);
	});

	it('rejects an incident preference New Relic does not offer', async () => {
		await expect(
			endpoints.alerts.createPolicy(makeContext() as never, {
				name: 'x',
				incident_preference: 'PER_WHATEVER' as never,
			}),
		).rejects.toThrow();
	});

	it('deletes with the id in the path', async () => {
		const { init, url } = await capture(
			endpoints.alerts.deletePolicy,
			{ policyId: 41534 },
			{ policy: { id: 41534, name: 'Browser Agent Alert Policy' } },
		);

		expect(url).toBe('https://api.newrelic.com/v2/alerts_policies/41534.json');
		expect(init.method).toBe('DELETE');
	});
});

describe('alerts.conditions', () => {
	it('filters by policy and reads the terms', async () => {
		const { result, url } = await capture(
			endpoints.alerts.conditions,
			{ policyId: 41534 },
			conditions,
		);

		expect(new URL(url).searchParams.get('policy_id')).toBe('41534');
		const list = asRecord(result)?.conditions;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		expect(first?.type).toBe('apm_app_metric');
		const terms = first?.terms;
		const term = asRecord(Array.isArray(terms) ? terms[0] : null);
		expect(term?.threshold).toBe('0.7');
	});
});

describe('query.nrql', () => {
	it('posts a GraphQL document with accountId and query as variables', async () => {
		const { url, init } = await capture(
			endpoints.query.nrql,
			{ accountId: 1234567, query: 'SELECT count(*) FROM Transaction' },
			nrqlResult,
		);

		// NerdGraph answers a trailing slash with 404, so the path is bare.
		expect(url).toBe('https://api.newrelic.com/graphql');
		expect(init.method).toBe('POST');
		const body = sentBody(init);
		expect(String(body.query)).toContain('query Nrql');
		const variables = asRecord(body.variables);
		expect(variables?.accountId).toBe(1234567);
		expect(variables?.query).toBe('SELECT count(*) FROM Transaction');
	});

	it('lifts the rows and the time window out of the GraphQL envelope', async () => {
		const { result } = await capture(
			endpoints.query.nrql,
			{ accountId: 1234567, query: 'SELECT count(*) FROM Transaction' },
			nrqlResult,
		);

		const rows = asRecord(result)?.results;
		const first = asRecord(Array.isArray(rows) ? rows[0] : null);
		expect(first?.count).toBe(1234);
		const window = asRecord(asRecord(asRecord(result)?.metadata)?.timeWindow);
		expect(window?.begin).toBe('2026-11-16T14:00:00Z');
	});

	it('throws on a 200 that carries GraphQL errors', async () => {
		const error = await capture(
			endpoints.query.nrql,
			{ accountId: 1234567, query: 'SELECT nope' },
			graphqlNrqlError,
			{ status: 200 },
		).catch((caught: unknown) => caught);

		expect(String(error)).toContain('NRQL syntax error');
	});

	it('uses the EU GraphQL host when asked', async () => {
		const { url } = await capture(
			endpoints.query.nrql,
			{ region: 'eu', accountId: 1, query: 'SELECT 1' },
			nrqlResult,
		);

		expect(url).toBe('https://api.eu.newrelic.com/graphql');
	});

	it('rejects a query with no account id', async () => {
		await expect(
			// Cast past the type: the point is that the schema refuses a missing
			// accountId at runtime for a caller passing untyped input.
			endpoints.query.nrql(makeContext() as never, {
				query: 'SELECT 1',
			} as never),
		).rejects.toThrow();
	});
});

describe('newrelic error reporting', () => {
	it('reads the REST v2 errors array', async () => {
		const error = await capture(
			endpoints.applications.list,
			{},
			restAuthError,
			{ status: 401 },
		).catch((caught: unknown) => caught);

		expect(String(error)).toContain('authentication required');
		expect(String(error)).toContain('401');
	});

	it('recognises a GraphQL FORBIDDEN as a permission failure', async () => {
		const error = await capture(
			endpoints.query.nrql,
			{ accountId: 1, query: 'SELECT 1' },
			graphqlForbidden,
		).catch((caught: unknown) => caught);

		expect(String(error)).toContain('do not have permission');
	});

	it('keeps Retry-After on a 429', async () => {
		const error = await capture(endpoints.applications.list, {}, rateLimited, {
			status: 429,
			headers: { 'Retry-After': '3' },
		}).catch((caught: unknown) => caught);

		expect(asRecord(error)?.retryAfter).toBe(3000);
	});

	it('does not leak the API key into the error message', async () => {
		const error = await capture(
			endpoints.applications.list,
			{},
			restAuthError,
			{ status: 401 },
		).catch((caught: unknown) => caught);

		expect(String(error)).not.toContain(API_KEY);
	});
});

describe('newrelic plugin definition', () => {
	it('registers as newrelic with api_key auth and no webhooks', () => {
		const plugin = newrelic();
		expect(plugin.id).toBe('newrelic');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the eight catalog operations', () => {
		const nested = Object.entries(newrelicEndpointsNested).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([
			'alerts.conditions',
			'alerts.createPolicy',
			'alerts.deletePolicy',
			'alerts.policies',
			'applications.get',
			'applications.list',
			'metrics.get',
			'query.nrql',
		]);
	});

	it('marks the policy delete destructive and the create a write', () => {
		const meta = newrelic().endpointMeta ?? {};
		expect(meta['alerts.deletePolicy']?.riskLevel).toBe('destructive');
		expect(meta['alerts.deletePolicy']?.irreversible).toBe(true);
		expect(meta['alerts.createPolicy']?.riskLevel).toBe('write');
		// A NRQL query only reads, even though NerdGraph takes it as a POST.
		expect(meta['query.nrql']?.riskLevel).toBe('read');
	});

	it('builds a key from the option, then the stored key, then throws', async () => {
		const plugin = newrelic();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve('stored') },
				} as never,
				'endpoint',
			),
		).resolves.toBe('stored');

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve(undefined) },
				} as never,
				'endpoint',
			),
		).rejects.toThrow();
	});

	it('is creatable through createCorsair', () => {
		const corsair = createCorsair({ plugins: [newrelic({ key: 'k' })] });
		expect(corsair.newrelic).toBeDefined();
	});
});
