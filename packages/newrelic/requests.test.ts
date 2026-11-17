import { createCorsair } from 'corsair';
import type { CorsairEndpoint } from 'corsair/core';
import { asRecord } from 'corsair/core';
import type { NewrelicPluginOptions } from './index';
import { newrelic, newrelicEndpointsNested } from './index';
import {
	applications,
	conditions,
	createdPolicy,
	entitySearchAnswer,
	graphqlForbidden,
	graphqlNrqlError,
	issuesAnswer,
	metricData,
	nrqlCondition,
	nrqlPercentileResult,
	nrqlResult,
	nrqlUniquesResult,
	policies,
	rateLimited,
	restAuthError,
	restErrorTitle,
	silentApplication,
	summarizedMetricData,
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

/**
 * Runs one endpoint and returns the response and the request that made it.
 *
 * `input` and `body` are unknown on purpose. Each endpoint has its own input and
 * output type, and `newrelicEndpointsNested` keys them by resource and then by
 * operation, so a shared parameter type strict enough to typecheck every call
 * site would need the union of all of them. Each test passes a literal that the
 * endpoint's zod schema validates at runtime and asserts on the parsed result.
 */
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

/** The `values` map of the first timeslice of the first metric series. */
function metricValues(result: unknown): unknown {
	const series = asRecord(asRecord(result)?.metric_data)?.metrics;
	const first = asRecord(Array.isArray(series) ? series[0] : null);
	const timeslices = first?.timeslices;
	const slice = asRecord(Array.isArray(timeslices) ? timeslices[0] : null);
	return slice?.values;
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

		expect(metricValues(result)).toEqual({
			average_value: 0.97,
			call_count: 1,
		});
	});

	it('accepts the summarized form, which has one timeslice', async () => {
		const { result } = await capture(
			endpoints.metrics.get,
			{ applicationId: 1129082, names: ['Apdex'], summarize: true },
			summarizedMetricData,
		);

		expect(metricValues(result)).toEqual({
			average_value: 0.97,
			call_count: 1840,
		});
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

describe('alerts policy update and NRQL conditions', () => {
	it('updates a policy with PUT and only the fields given', async () => {
		const { url, init } = await capture(
			endpoints.alerts.updatePolicy,
			{
				policyId: 41534,
				name: 'renamed',
				incident_preference: 'PER_CONDITION',
			},
			createdPolicy,
		);
		expect(url).toBe('https://api.newrelic.com/v2/alerts_policies/41534.json');
		expect(init.method).toBe('PUT');
		expect(JSON.parse(String(init.body))).toEqual({
			policy: { name: 'renamed', incident_preference: 'PER_CONDITION' },
		});
	});

	it('requires both policy fields, since New Relic replaces the policy', async () => {
		// Live 11-17: a PUT with only `name` answered 500, without it 422.
		await expect(
			endpoints.alerts.updatePolicy(
				makeContext() as never,
				{
					policyId: 1,
					name: 'only-name',
					// The missing field is the point of the test.
				} as never,
			),
		).rejects.toThrow();
	});

	it('lists NRQL conditions and reads string thresholds', async () => {
		const { result, url } = await capture(
			endpoints.alerts.nrqlConditions,
			{ policyId: 8345516 },
			{ nrql_conditions: [nrqlCondition.nrql_condition] },
		);
		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/v2/alerts_nrql_conditions.json');
		expect(parsed.searchParams.get('policy_id')).toBe('8345516');
		const list = asRecord(result)?.nrql_conditions;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		expect(first?.entity_guid).toBe(
			'ODc0NjQ2MXxBSU9QU3xDT05ESVRJT058Njk4Nzk2NzU',
		);
	});

	it('creates a condition under its policy wrapped in nrql_condition', async () => {
		const condition = {
			name: 'corsair-plugin-test',
			enabled: false,
			terms: [
				{
					duration: '5',
					operator: 'above',
					priority: 'critical',
					threshold: '1000',
					time_function: 'all',
				},
			],
			value_function: 'single_value',
			nrql: { query: 'SELECT count(*) FROM Transaction' },
			signal: { aggregation_window: '60' },
		};
		const { result, url, init } = await capture(
			endpoints.alerts.createNrqlCondition,
			{ policyId: 8345516, condition },
			nrqlCondition,
		);
		expect(url).toBe(
			'https://api.newrelic.com/v2/alerts_nrql_conditions/policies/8345516.json',
		);
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toEqual({
			nrql_condition: condition,
		});
		expect(asRecord(asRecord(result)?.nrql_condition)?.id).toBe(69879675);
	});

	it('rejects a partial condition update, which New Relic answers 400', async () => {
		await expect(
			endpoints.alerts.updateNrqlCondition(
				makeContext() as never,
				{
					conditionId: 1,
					condition: { enabled: true },
					// The partial body is the point of the test.
				} as never,
			),
		).rejects.toThrow();
	});

	it('updates and deletes a condition by id', async () => {
		const condition = {
			name: 'corsair-plugin-test-2',
			enabled: true,
			terms: [
				{
					duration: '5',
					operator: 'above',
					threshold: '1000',
					time_function: 'all',
				},
			],
			value_function: 'single_value',
			nrql: { query: 'SELECT count(*) FROM Transaction' },
		};
		const updated = await capture(
			endpoints.alerts.updateNrqlCondition,
			{ conditionId: 69879675, condition },
			nrqlCondition,
		);
		expect(updated.url).toBe(
			'https://api.newrelic.com/v2/alerts_nrql_conditions/69879675.json',
		);
		expect(updated.init.method).toBe('PUT');
		expect(JSON.parse(String(updated.init.body))).toEqual({
			nrql_condition: condition,
		});

		const deleted = await capture(
			endpoints.alerts.deleteNrqlCondition,
			{ conditionId: 69879675 },
			nrqlCondition,
		);
		expect(deleted.init.method).toBe('DELETE');
		expect(deleted.url).toBe(updated.url);
	});
});

describe('NerdGraph reads and the deployment marker', () => {
	it('lists accounts', async () => {
		const { result, init } = await capture(
			endpoints.accounts.list,
			{},
			{ data: { actor: { accounts: [{ id: 1, name: 'Main' }] } } },
		);
		expect(String(JSON.parse(String(init.body)).query)).toContain('accounts');
		expect(asRecord(result)?.accounts).toEqual([{ id: 1, name: 'Main' }]);
	});

	it('searches entities and lifts the page out', async () => {
		const { result, url, init } = await capture(
			endpoints.entities.search,
			{ query: "type = 'CONDITION'" },
			entitySearchAnswer,
		);
		expect(url).toBe('https://api.newrelic.com/graphql');
		expect(JSON.parse(String(init.body)).variables).toEqual({
			query: "type = 'CONDITION'",
		});
		expect(asRecord(result)?.count).toBe(1);
		const list = asRecord(result)?.entities;
		expect(Array.isArray(list) ? list.length : 0).toBe(1);
	});

	it('reads entities by guid', async () => {
		const entity =
			entitySearchAnswer.data.actor.entitySearch.results.entities[0];
		const { result, init } = await capture(
			endpoints.entities.get,
			{ guids: [entity?.guid ?? ''] },
			{ data: { actor: { entities: [entity] } } },
		);
		expect(JSON.parse(String(init.body)).variables.guids).toEqual([
			entity?.guid,
		]);
		const list = asRecord(result)?.entities;
		expect(Array.isArray(list) ? list.length : 0).toBe(1);
	});

	it('sends the issue filter and time window as variables', async () => {
		const { result, init } = await capture(
			endpoints.issues.list,
			{
				accountId: 1234567,
				states: ['ACTIVATED'],
				startTime: 1,
				endTime: 2,
			},
			issuesAnswer,
		);
		expect(JSON.parse(String(init.body)).variables).toEqual({
			accountId: 1234567,
			filter: { states: ['ACTIVATED'] },
			timeWindow: { startTime: 1, endTime: 2 },
		});
		const list = asRecord(result)?.issues;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		expect(first?.title).toEqual(['CPU above 90%']);
	});

	it('creates a deployment marker without sending the region', async () => {
		const { result, init } = await capture(
			endpoints.changeTracking.createDeployment,
			{ region: 'us', entityGuid: 'abc', version: '1.2.3' },
			{
				data: {
					changeTrackingCreateDeployment: {
						deploymentId: 'd-1',
						entityGuid: 'abc',
						version: '1.2.3',
						timestamp: 1794915648829,
					},
				},
			},
		);
		expect(JSON.parse(String(init.body)).variables).toEqual({
			deployment: { entityGuid: 'abc', version: '1.2.3' },
		});
		expect(asRecord(result)?.deploymentId).toBe('d-1');
	});

	it('throws when the answer misses the asked-for path', async () => {
		await expect(
			capture(endpoints.entities.search, { query: 'x' }, { data: {} }),
		).rejects.toThrow('data.actor.entitySearch');
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
		// NerdGraph answers the window in epoch milliseconds.
		const window = asRecord(asRecord(asRecord(result)?.metadata)?.timeWindow);
		expect(window?.begin).toBe(1763301600000);
	});

	it('keeps an array cell from uniques()', async () => {
		const { result } = await capture(
			endpoints.query.nrql,
			{ accountId: 1234567, query: 'SELECT uniques(appName) FROM Transaction' },
			nrqlUniquesResult,
		);

		const rows = asRecord(result)?.results;
		const first = asRecord(Array.isArray(rows) ? rows[0] : null);
		expect(first?.uniques).toEqual(['My Web Page', 'Silent Worker']);
	});

	it('keeps an object cell from percentile()', async () => {
		const { result } = await capture(
			endpoints.query.nrql,
			{
				accountId: 1234567,
				query: 'SELECT percentile(duration, 50, 95) FROM Transaction',
			},
			nrqlPercentileResult,
		);

		const rows = asRecord(result)?.results;
		const first = asRecord(Array.isArray(rows) ? rows[0] : null);
		expect(first?.percentile).toEqual({ 50: 0.012, 95: 0.048 });
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
			endpoints.query.nrql(
				makeContext() as never,
				{
					query: 'SELECT 1',
				} as never,
			),
		).rejects.toThrow();
	});
});

describe('newrelic error reporting', () => {
	it('reads the REST v2 error title', async () => {
		const error = await capture(
			endpoints.alerts.deletePolicy,
			{ policyId: 1 },
			restErrorTitle,
			{ status: 404 },
		).catch((caught: unknown) => caught);
		expect(String(error)).toContain('Policy not found');
	});

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

	it('exposes exactly the 18 catalog operations', () => {
		const nested = Object.entries(newrelicEndpointsNested).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([
			'accounts.list',
			'alerts.conditions',
			'alerts.createNrqlCondition',
			'alerts.createPolicy',
			'alerts.deleteNrqlCondition',
			'alerts.deletePolicy',
			'alerts.nrqlConditions',
			'alerts.policies',
			'alerts.updateNrqlCondition',
			'alerts.updatePolicy',
			'applications.get',
			'applications.list',
			'changeTracking.createDeployment',
			'entities.get',
			'entities.search',
			'issues.list',
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
		expect(meta['alerts.deleteNrqlCondition']?.riskLevel).toBe('destructive');
		expect(meta['alerts.deleteNrqlCondition']?.irreversible).toBe(true);
		for (const write of [
			'alerts.updatePolicy',
			'alerts.createNrqlCondition',
			'alerts.updateNrqlCondition',
			'changeTracking.createDeployment',
		] as const) {
			expect(meta[write]?.riskLevel).toBe('write');
		}
		for (const read of [
			'accounts.list',
			'entities.search',
			'entities.get',
			'issues.list',
			'alerts.nrqlConditions',
		] as const) {
			expect(meta[read]?.riskLevel).toBe('read');
		}
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
