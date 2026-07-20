import { makeDatadogRequest, parseDatadogKey } from './client';
import {
	ApiKeysEndpoints,
	AwsEndpoints,
	DashboardsEndpoints,
	DowntimesEndpoints,
	EventsEndpoints,
	HostsEndpoints,
	IncidentsEndpoints,
	LogsEndpoints,
	MetricsEndpoints,
	MonitorsEndpoints,
	RolesEndpoints,
	ServicesEndpoints,
	SlosEndpoints,
	SpansEndpoints,
	SyntheticsEndpoints,
	TagsEndpoints,
	UsageEndpoints,
	UsersEndpoints,
	WebhooksEndpoints,
} from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeDatadogRequest: jest.fn() };
});

const mockRequest = jest.mocked(makeDatadogRequest);

type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

function createContext() {
	const entityClient = () => ({
		upsertByEntityId: jest.fn().mockResolvedValue({ id: 'internal-1' }),
		deleteByEntityId: jest.fn().mockResolvedValue(undefined),
		existsByEntityId: jest.fn().mockResolvedValue(false),
		findIdByEntityId: jest.fn().mockResolvedValue(null),
	});
	return {
		key: 'test-key',
		endpoints: {},
		db: {
			monitors: entityClient(),
			dashboards: entityClient(),
			slos: entityClient(),
			incidents: entityClient(),
		},
	};
}

describe('Datadog credential packing', () => {
	it('round-trips packed credentials', () => {
		const parsed = parseDatadogKey(
			JSON.stringify({ apiKey: 'a', appKey: 'b', site: 'datadoghq.eu' }),
		);
		expect(parsed).toEqual({ apiKey: 'a', appKey: 'b', site: 'datadoghq.eu' });
	});

	it('treats a bare string as the API key alone', () => {
		expect(parseDatadogKey('raw-api-key')).toEqual({ apiKey: 'raw-api-key' });
	});
});

describe('Datadog endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// One row per implemented endpoint (R2: every endpoint has a test).
	const cases: Array<{
		name: string;
		fn: AnyEndpoint;
		input: Record<string, unknown>;
		path: string;
		method: string;
		response?: unknown;
	}> = [
		{
			name: 'dashboards.list',
			fn: DashboardsEndpoints.list as AnyEndpoint,
			input: { count: 5 },
			path: '/api/v1/dashboard',
			method: 'GET',
			response: { dashboards: [] },
		},
		{
			name: 'dashboards.get',
			fn: DashboardsEndpoints.get as AnyEndpoint,
			input: { dashboardId: 'abc-123' },
			path: '/api/v1/dashboard/{dashboardId}',
			method: 'GET',
		},
		{
			name: 'dashboards.create',
			fn: DashboardsEndpoints.create as AnyEndpoint,
			input: { title: 't', widgets: [], layoutType: 'ordered' },
			path: '/api/v1/dashboard',
			method: 'POST',
		},
		{
			name: 'dashboards.update',
			fn: DashboardsEndpoints.update as AnyEndpoint,
			input: {
				dashboardId: 'abc-123',
				title: 't',
				widgets: [],
				layoutType: 'ordered',
			},
			path: '/api/v1/dashboard/{dashboardId}',
			method: 'PUT',
		},
		{
			name: 'dashboards.delete',
			fn: DashboardsEndpoints.delete as AnyEndpoint,
			input: { dashboardId: 'abc-123' },
			path: '/api/v1/dashboard/{dashboardId}',
			method: 'DELETE',
		},
		{
			name: 'monitors.list',
			fn: MonitorsEndpoints.list as AnyEndpoint,
			input: { pageSize: 10 },
			path: '/api/v1/monitor',
			method: 'GET',
			response: [],
		},
		{
			name: 'monitors.search',
			fn: MonitorsEndpoints.search as AnyEndpoint,
			input: { query: 'status:alert' },
			path: '/api/v1/monitor/search',
			method: 'GET',
			response: { monitors: [] },
		},
		{
			name: 'monitors.get',
			fn: MonitorsEndpoints.get as AnyEndpoint,
			input: { monitorId: 42 },
			path: '/api/v1/monitor/{monitorId}',
			method: 'GET',
		},
		{
			name: 'monitors.create',
			fn: MonitorsEndpoints.create as AnyEndpoint,
			input: { type: 'metric alert', query: 'q', name: 'n' },
			path: '/api/v1/monitor',
			method: 'POST',
		},
		{
			name: 'monitors.update',
			fn: MonitorsEndpoints.update as AnyEndpoint,
			input: { monitorId: 42, name: 'renamed' },
			path: '/api/v1/monitor/{monitorId}',
			method: 'PUT',
		},
		{
			name: 'monitors.delete',
			fn: MonitorsEndpoints.delete as AnyEndpoint,
			input: { monitorId: 42 },
			path: '/api/v1/monitor/{monitorId}',
			method: 'DELETE',
		},
		{
			name: 'monitors.mute',
			fn: MonitorsEndpoints.mute as AnyEndpoint,
			input: { monitorId: 42, scope: 'host:a' },
			path: '/api/v1/monitor/{monitorId}/mute',
			method: 'POST',
		},
		{
			name: 'monitors.unmute',
			fn: MonitorsEndpoints.unmute as AnyEndpoint,
			input: { monitorId: 42 },
			path: '/api/v1/monitor/{monitorId}/unmute',
			method: 'POST',
		},
		{
			name: 'slos.list',
			fn: SlosEndpoints.list as AnyEndpoint,
			input: {},
			path: '/api/v1/slo',
			method: 'GET',
			response: { data: [] },
		},
		{
			name: 'slos.create',
			fn: SlosEndpoints.create as AnyEndpoint,
			input: {
				name: 's',
				type: 'monitor',
				thresholds: [{ timeframe: '30d', target: 99.9 }],
				monitorIds: [42],
			},
			path: '/api/v1/slo',
			method: 'POST',
			response: { data: [] },
		},
		{
			name: 'synthetics.listTests',
			fn: SyntheticsEndpoints.listTests as AnyEndpoint,
			input: {},
			path: '/api/v1/synthetics/tests',
			method: 'GET',
		},
		{
			name: 'synthetics.getApiTest',
			fn: SyntheticsEndpoints.getApiTest as AnyEndpoint,
			input: { publicId: 'pub-1' },
			path: '/api/v1/synthetics/tests/api/{publicId}',
			method: 'GET',
		},
		{
			name: 'synthetics.createApiTest',
			fn: SyntheticsEndpoints.createApiTest as AnyEndpoint,
			input: {
				name: 't',
				config: {},
				locations: ['aws:us-east-1'],
				options: {},
			},
			path: '/api/v1/synthetics/tests/api',
			method: 'POST',
		},
		{
			name: 'synthetics.listLocations',
			fn: SyntheticsEndpoints.listLocations as AnyEndpoint,
			input: {},
			path: '/api/v1/synthetics/locations',
			method: 'GET',
		},
		{
			name: 'events.list',
			fn: EventsEndpoints.list as AnyEndpoint,
			input: { start: 1, end: 2 },
			path: '/api/v1/events',
			method: 'GET',
		},
		{
			name: 'events.create',
			fn: EventsEndpoints.create as AnyEndpoint,
			input: { title: 't', text: 'x' },
			path: '/api/v1/events',
			method: 'POST',
		},
		{
			name: 'downtimes.list',
			fn: DowntimesEndpoints.list as AnyEndpoint,
			input: {},
			path: '/api/v2/downtime',
			method: 'GET',
		},
		{
			name: 'downtimes.create',
			fn: DowntimesEndpoints.create as AnyEndpoint,
			input: { scope: 'env:prod' },
			path: '/api/v2/downtime',
			method: 'POST',
		},
		{
			name: 'webhooks.get',
			fn: WebhooksEndpoints.get as AnyEndpoint,
			input: { webhookName: 'hook' },
			path: '/api/v1/integration/webhooks/configuration/webhooks/{webhookName}',
			method: 'GET',
		},
		{
			name: 'webhooks.create',
			fn: WebhooksEndpoints.create as AnyEndpoint,
			input: { name: 'hook', url: 'https://example.com' },
			path: '/api/v1/integration/webhooks/configuration/webhooks',
			method: 'POST',
		},
		{
			name: 'hosts.list',
			fn: HostsEndpoints.list as AnyEndpoint,
			input: { filter: 'env:prod' },
			path: '/api/v1/hosts',
			method: 'GET',
		},
		{
			name: 'hosts.totals',
			fn: HostsEndpoints.totals as AnyEndpoint,
			input: {},
			path: '/api/v1/hosts/totals',
			method: 'GET',
		},
		{
			name: 'tags.list',
			fn: TagsEndpoints.list as AnyEndpoint,
			input: {},
			path: '/api/v1/tags/hosts',
			method: 'GET',
		},
		{
			name: 'tags.getHost',
			fn: TagsEndpoints.getHost as AnyEndpoint,
			input: { hostName: 'web-1' },
			path: '/api/v1/tags/hosts/{hostName}',
			method: 'GET',
		},
		{
			name: 'tags.updateHost',
			fn: TagsEndpoints.updateHost as AnyEndpoint,
			input: { hostName: 'web-1', tags: ['env:prod'] },
			path: '/api/v1/tags/hosts/{hostName}',
			method: 'PUT',
		},
		{
			name: 'services.listDefinitions',
			fn: ServicesEndpoints.listDefinitions as AnyEndpoint,
			input: {},
			path: '/api/v2/services/definitions',
			method: 'GET',
		},
		{
			name: 'spans.search',
			fn: SpansEndpoints.search as AnyEndpoint,
			input: { query: '*', from: 'now-15m', to: 'now' },
			path: '/api/v2/spans/events/search',
			method: 'POST',
		},
		{
			name: 'spans.aggregate',
			fn: SpansEndpoints.aggregate as AnyEndpoint,
			input: { query: '*', from: 'now-15m', to: 'now', aggregation: 'count' },
			path: '/api/v2/spans/analytics/aggregate',
			method: 'POST',
		},
		{
			name: 'logs.search',
			fn: LogsEndpoints.search as AnyEndpoint,
			input: { query: 'status:error', from: 'now-15m', to: 'now' },
			path: '/api/v2/logs/events/search',
			method: 'POST',
		},
		{
			name: 'logs.aggregate',
			fn: LogsEndpoints.aggregate as AnyEndpoint,
			input: {
				query: 'status:error',
				from: 'now-15m',
				to: 'now',
				aggregation: 'count',
			},
			path: '/api/v2/logs/analytics/aggregate',
			method: 'POST',
		},
		{
			name: 'logs.listIndexes',
			fn: LogsEndpoints.listIndexes as AnyEndpoint,
			input: {},
			path: '/api/v1/logs/config/indexes',
			method: 'GET',
		},
		{
			name: 'metrics.listActive',
			fn: MetricsEndpoints.listActive as AnyEndpoint,
			input: { from: 1 },
			path: '/api/v1/metrics',
			method: 'GET',
		},
		{
			name: 'metrics.query',
			fn: MetricsEndpoints.query as AnyEndpoint,
			input: { query: 'avg:system.cpu.user{*}', from: 1, to: 2 },
			path: '/api/v1/query',
			method: 'GET',
		},
		{
			name: 'metrics.submit',
			fn: MetricsEndpoints.submit as AnyEndpoint,
			input: { series: [{ metric: 'custom.m', points: [[1, 2]] }] },
			path: '/api/v1/series',
			method: 'POST',
		},
		{
			name: 'users.list',
			fn: UsersEndpoints.list as AnyEndpoint,
			input: {},
			path: '/api/v2/users',
			method: 'GET',
		},
		{
			name: 'roles.list',
			fn: RolesEndpoints.list as AnyEndpoint,
			input: {},
			path: '/api/v2/roles',
			method: 'GET',
		},
		{
			name: 'apiKeys.list',
			fn: ApiKeysEndpoints.list as AnyEndpoint,
			input: {},
			path: '/api/v2/api_keys',
			method: 'GET',
		},
		{
			name: 'incidents.list',
			fn: IncidentsEndpoints.list as AnyEndpoint,
			input: {},
			path: '/api/v2/incidents',
			method: 'GET',
		},
		{
			name: 'aws.list',
			fn: AwsEndpoints.list as AnyEndpoint,
			input: {},
			path: '/api/v1/integration/aws',
			method: 'GET',
		},
		{
			name: 'usage.getSummary',
			fn: UsageEndpoints.getSummary as AnyEndpoint,
			input: { startMonth: '2026-06' },
			path: '/api/v1/usage/summary',
			method: 'GET',
		},
	];

	it.each(cases)('$name calls $method $path', async (c) => {
		mockRequest.mockResolvedValue(c.response ?? {});
		const ctx = createContext();

		await c.fn(ctx, c.input);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [path, key, options] = mockRequest.mock.calls[0]!;
		expect(path).toBe(c.path);
		expect(key).toBe('test-key');
		expect(options?.method ?? 'GET').toBe(c.method);
	});
});

describe('Datadog entity storage', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores monitors returned by list', async () => {
		mockRequest.mockResolvedValue([
			{ id: 7, name: 'cpu high', type: 'metric alert', query: 'q' },
		]);
		const ctx = createContext();

		await (MonitorsEndpoints.list as AnyEndpoint)(ctx, {});

		expect(ctx.db.monitors.upsertByEntityId).toHaveBeenCalledWith(
			'7',
			expect.objectContaining({ id: '7', name: 'cpu high' }),
		);
	});

	it('removes a stored monitor when it is deleted upstream', async () => {
		mockRequest.mockResolvedValue({ deleted_monitor_id: 7 });
		const ctx = createContext();

		await (MonitorsEndpoints.delete as AnyEndpoint)(ctx, { monitorId: 7 });

		expect(ctx.db.monitors.deleteByEntityId).toHaveBeenCalledWith('7');
	});

	it('stores dashboards returned by get', async () => {
		mockRequest.mockResolvedValue({
			id: 'dash-1',
			title: 'Prod overview',
			layout_type: 'ordered',
		});
		const ctx = createContext();

		await (DashboardsEndpoints.get as AnyEndpoint)(ctx, {
			dashboardId: 'dash-1',
		});

		expect(ctx.db.dashboards.upsertByEntityId).toHaveBeenCalledWith(
			'dash-1',
			expect.objectContaining({ id: 'dash-1', title: 'Prod overview' }),
		);
	});

	it('survives entity storage failures without failing the call', async () => {
		mockRequest.mockResolvedValue([{ id: 7, name: 'cpu high' }]);
		const ctx = createContext();
		ctx.db.monitors.upsertByEntityId.mockRejectedValue(new Error('db down'));

		const result = await (MonitorsEndpoints.list as AnyEndpoint)(ctx, {});

		expect(Array.isArray(result)).toBe(true);
	});
});

describe('Datadog request shaping', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('maps camelCase inputs to Datadog query params', async () => {
		mockRequest.mockResolvedValue([]);
		const ctx = createContext();

		await (MonitorsEndpoints.list as AnyEndpoint)(ctx, {
			monitorTags: 'service:web',
			groupStates: 'alert',
			pageSize: 50,
		});

		const [, , options] = mockRequest.mock.calls[0]!;
		expect(options?.query).toEqual(
			expect.objectContaining({
				monitor_tags: 'service:web',
				group_states: 'alert',
				page_size: 50,
			}),
		);
	});

	it('builds the v2 downtime payload with a monitor identifier', async () => {
		mockRequest.mockResolvedValue({ data: {} });
		const ctx = createContext();

		await (DowntimesEndpoints.create as AnyEndpoint)(ctx, {
			scope: 'env:prod',
			monitorId: 42,
			start: '2026-07-14T00:00:00Z',
		});

		const [, , options] = mockRequest.mock.calls[0]!;
		expect(options?.body).toEqual({
			data: {
				type: 'downtime',
				attributes: expect.objectContaining({
					scope: 'env:prod',
					monitor_identifier: { monitor_id: 42 },
				}),
			},
		});
	});

	it('builds the v2 logs search payload with filter and paging', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		const ctx = createContext();

		await (LogsEndpoints.search as AnyEndpoint)(ctx, {
			query: 'status:error',
			from: 'now-15m',
			to: 'now',
			pageLimit: 25,
			pageCursor: 'cursor-1',
		});

		const [, , options] = mockRequest.mock.calls[0]!;
		expect(options?.body).toEqual(
			expect.objectContaining({
				filter: expect.objectContaining({
					query: 'status:error',
					from: 'now-15m',
					to: 'now',
				}),
				page: { limit: 25, cursor: 'cursor-1' },
			}),
		);
	});

	it('passes host names through the encoded path map, not the URL string', async () => {
		mockRequest.mockResolvedValue({ host: 'my host', tags: [] });
		const ctx = createContext();

		await (TagsEndpoints.getHost as AnyEndpoint)(ctx, { hostName: 'my host' });

		const [path, , options] = mockRequest.mock.calls[0]!;
		expect(path).toBe('/api/v1/tags/hosts/{hostName}');
		expect(options?.path).toEqual({ hostName: 'my host' });
	});

	it('keeps endpoint paths constant so hostile ids cannot alter the URL', async () => {
		mockRequest.mockResolvedValue({});
		const ctx = createContext();

		await (DashboardsEndpoints.get as AnyEndpoint)(ctx, {
			dashboardId: '{{evil}}/../x',
		});

		const [path, , options] = mockRequest.mock.calls[0]!;
		expect(path).toBe('/api/v1/dashboard/{dashboardId}');
		expect(options?.path).toEqual({ dashboardId: '{{evil}}/../x' });
	});

	it('sends mute scope and end in the body, not as query params', async () => {
		mockRequest.mockResolvedValue({});
		const ctx = createContext();

		await (MonitorsEndpoints.mute as AnyEndpoint)(ctx, {
			monitorId: 42,
			scope: 'host:app1',
			end: 1735689600,
		});

		const [, , options] = mockRequest.mock.calls[0]!;
		expect(options?.body).toEqual({ scope: 'host:app1', end: 1735689600 });
		expect(options?.query).toBeUndefined();
	});

	it('sends unmute scope and all_scopes in the body, not as query params', async () => {
		mockRequest.mockResolvedValue({});
		const ctx = createContext();

		await (MonitorsEndpoints.unmute as AnyEndpoint)(ctx, {
			monitorId: 42,
			scope: 'host:app1',
			allScopes: true,
		});

		const [, , options] = mockRequest.mock.calls[0]!;
		expect(options?.body).toEqual({ scope: 'host:app1', all_scopes: true });
		expect(options?.query).toBeUndefined();
	});
});
