import * as client from '../client';
import {
	Alerting,
	Cases,
	Connectors,
	Dashboards,
	DataViews,
	DataViewsExt,
	DetectionEngine,
	Fleet,
	ListsOsquery,
	OpsUnverified,
	SavedObjects,
	Security,
	Status,
} from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	makeKibanaRequest: jest.fn(),
}));

const mockedRequest = client.makeKibanaRequest as jest.MockedFunction<
	typeof client.makeKibanaRequest
>;

const ctx = {
	key: 'test-api-key',
	options: {
		baseUrl: 'https://kibana.example.com:5601',
	},
	keys: {
		get_base_url: jest
			.fn()
			.mockResolvedValue('https://kibana.example.com:5601'),
	},
} as unknown as Parameters<typeof SavedObjects.find>[0];

const BASE = 'https://kibana.example.com:5601';

describe('Kibana Endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({} as never);
	});

	describe('savedObjects', () => {
		it('finds saved objects with query parameters', async () => {
			mockedRequest.mockResolvedValueOnce({ total: 1, saved_objects: [] });

			const input = {
				type: ['dashboard', 'visualization'],
				search: 'logs',
				page: 1,
				per_page: 10,
			};

			await SavedObjects.find(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/saved_objects/_find',
				'https://kibana.example.com:5601',
				ctx.key,
				{
					method: 'GET',
					query: {
						type: 'dashboard,visualization',
						search: 'logs',
						page: 1,
						per_page: 10,
					},
				},
			);
		});

		it('gets a saved object by type and ID', async () => {
			mockedRequest.mockResolvedValueOnce({
				id: 'my-id',
				type: 'dashboard',
				attributes: {},
			});

			await SavedObjects.get(ctx, { type: 'dashboard', id: 'my-id' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/saved_objects/dashboard/my-id',
				'https://kibana.example.com:5601',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('creates a new saved object', async () => {
			const input = {
				type: 'index-pattern',
				attributes: { title: 'filebeat-*' },
			};

			mockedRequest.mockResolvedValueOnce({
				id: 'new-id',
				type: 'index-pattern',
				attributes: { title: 'filebeat-*' },
			});

			await SavedObjects.create(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/saved_objects/index-pattern',
				'https://kibana.example.com:5601',
				ctx.key,
				{
					method: 'POST',
					query: undefined,
					body: {
						attributes: { title: 'filebeat-*' },
					},
				},
			);
		});

		it('creates with overwrite query forwarded on POST', async () => {
			mockedRequest.mockResolvedValueOnce({
				id: 'new-id',
				type: 'index-pattern',
				attributes: { title: 'filebeat-*' },
			});

			await SavedObjects.create(ctx, {
				type: 'index-pattern',
				attributes: { title: 'filebeat-*' },
				overwrite: true,
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/saved_objects/index-pattern',
				'https://kibana.example.com:5601',
				ctx.key,
				{
					method: 'POST',
					query: { overwrite: true },
					body: {
						attributes: { title: 'filebeat-*' },
					},
				},
			);
		});

		it('updates a saved object via PUT', async () => {
			mockedRequest.mockResolvedValueOnce({
				id: 'dash-1',
				type: 'dashboard',
				attributes: { title: 'Updated' },
			});

			const result = await SavedObjects.update(ctx, {
				type: 'dashboard',
				id: 'dash-1',
				attributes: { title: 'Updated' },
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/saved_objects/dashboard/dash-1',
				'https://kibana.example.com:5601',
				ctx.key,
				{
					method: 'PUT',
					body: {
						attributes: { title: 'Updated' },
					},
				},
			);
			expect(result.id).toBe('dash-1');
			expect(result.type).toBe('dashboard');
		});

		it('deletes a saved object', async () => {
			mockedRequest.mockResolvedValueOnce({});

			await SavedObjects.remove(ctx, { type: 'dashboard', id: 'old-id' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/saved_objects/dashboard/old-id',
				'https://kibana.example.com:5601',
				ctx.key,
				{ method: 'DELETE' },
			);
		});
	});

	describe('dataViews', () => {
		it('retrieves a data view by ID', async () => {
			mockedRequest.mockResolvedValueOnce({
				data_view: { id: 'view-1', title: 'packetbeat-*' },
			});

			await DataViews.get(ctx, { id: 'view-1' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/data_views/data_view/view-1',
				'https://kibana.example.com:5601',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('lists all data views', async () => {
			mockedRequest.mockResolvedValueOnce({ data_view: [] });

			await DataViewsExt.list(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/data_views',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('creates a data view via POST', async () => {
			mockedRequest.mockResolvedValueOnce({
				data_view: { id: 'v1', title: 'logs-*' },
			});

			const res = await DataViewsExt.create(ctx, { title: 'logs-*' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/data_views/data_view',
				BASE,
				ctx.key,
				{ method: 'POST', body: { data_view: { title: 'logs-*' } } },
			);
			expect(res.data_view?.title).toBe('logs-*');
		});
	});

	describe('status', () => {
		it('retrieves Kibana status', async () => {
			mockedRequest.mockResolvedValueOnce({
				name: 'kibana-node-1',
				status: { overall: { state: 'green' } },
			});

			await Status.get(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/status',
				'https://kibana.example.com:5601',
				ctx.key,
				{ method: 'GET' },
			);
		});
	});

	describe('dashboards', () => {
		it('searches dashboards with query params', async () => {
			mockedRequest.mockResolvedValueOnce({ dashboards: [], total: 0 });

			const res = await Dashboards.search(ctx, { search: 'logs', limit: 10 });

			expect(mockedRequest).toHaveBeenCalledWith('api/dashboards', BASE, ctx.key, {
				method: 'GET',
				query: { search: 'logs', limit: 10 },
			});
			expect(res.total).toBe(0);
		});

		it('creates a dashboard via POST', async () => {
			mockedRequest.mockResolvedValueOnce({ id: 'd1', title: 'Main' });

			const res = await Dashboards.create(ctx, { title: 'Main' });

			expect(mockedRequest).toHaveBeenCalledWith('api/dashboards', BASE, ctx.key, {
				method: 'POST',
				body: { title: 'Main' },
			});
			expect(res.id).toBe('d1');
		});

		it('gets a dashboard by id', async () => {
			mockedRequest.mockResolvedValueOnce({ id: 'd1' });

			await Dashboards.get(ctx, { id: 'd1' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/dashboards/d1',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('upserts a dashboard via PUT without id in body', async () => {
			mockedRequest.mockResolvedValueOnce({ id: 'd1' });

			await Dashboards.upsert(ctx, { id: 'd1', title: 'New' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/dashboards/d1',
				BASE,
				ctx.key,
				{ method: 'PUT', body: { title: 'New' } },
			);
		});

		it('deletes a dashboard', async () => {
			mockedRequest.mockResolvedValueOnce({});

			await Dashboards.remove(ctx, { id: 'd1' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/dashboards/d1',
				BASE,
				ctx.key,
				{ method: 'DELETE' },
			);
		});
	});

	describe('alerting', () => {
		it('creates a rule via POST with id in path', async () => {
			mockedRequest.mockResolvedValueOnce({ id: 'r1', name: 'R' });

			const res = await Alerting.createRule(ctx, {
				id: 'r1',
				body: { name: 'R', rule_type_id: '.es-query' },
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/alerting/rule/r1',
				BASE,
				ctx.key,
				{ method: 'POST', body: { name: 'R', rule_type_id: '.es-query' } },
			);
			expect(res.id).toBe('r1');
		});

		it('lists rules with pagination query', async () => {
			mockedRequest.mockResolvedValueOnce({ total: 2, data: [] });

			const res = await Alerting.listRules(ctx, { page: 1, per_page: 10 });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/alerting/rules/_find',
				BASE,
				ctx.key,
				{ method: 'GET', query: { page: 1, per_page: 10 } },
			);
			expect(res.total).toBe(2);
		});

		it('deletes a rule', async () => {
			mockedRequest.mockResolvedValueOnce({});

			await Alerting.deleteRule(ctx, { id: 'r1' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/alerting/rule/r1',
				BASE,
				ctx.key,
				{ method: 'DELETE' },
			);
		});

		it('lists rule types', async () => {
			mockedRequest.mockResolvedValueOnce({ rule_types: [] });

			await Alerting.listRuleTypes(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/alerting/rule_types',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});
	});

	describe('cases', () => {
		it('creates a case via POST', async () => {
			mockedRequest.mockResolvedValueOnce({ id: 'c1', title: 'T' });

			const res = await Cases.create(ctx, {
				title: 'T',
				description: 'D',
				owner: 'sec',
				connector: { id: 'none', type: '.none' },
				settings: {},
				tags: ['t1'],
			});

			expect(mockedRequest).toHaveBeenCalledWith('api/cases', BASE, ctx.key, {
				method: 'POST',
				body: {
					title: 'T',
					description: 'D',
					owner: 'sec',
					connector: { id: 'none', type: '.none' },
					settings: {},
					tags: ['t1'],
				},
			});
			expect(res.id).toBe('c1');
		});

		it('lists cases with filters', async () => {
			mockedRequest.mockResolvedValueOnce({ total: 1, cases: [] });

			const res = await Cases.list(ctx, { status: 'open', per_page: 5 });

			expect(mockedRequest).toHaveBeenCalledWith('api/cases/_find', BASE, ctx.key, {
				method: 'GET',
				query: { status: 'open', per_page: 5 },
			});
			expect(res.total).toBe(1);
		});
	});

	describe('connectors', () => {
		it('creates a connector via POST with id in path', async () => {
			mockedRequest.mockResolvedValueOnce({ id: 'k1', name: 'N' });

			const res = await Connectors.create(ctx, {
				id: 'k1',
				connector_type_id: '.webhook',
				name: 'N',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/actions/connector/k1',
				BASE,
				ctx.key,
				{ method: 'POST', body: { connector_type_id: '.webhook', name: 'N' } },
			);
			expect(res.name).toBe('N');
		});

		it('gets a connector by id', async () => {
			mockedRequest.mockResolvedValueOnce({ id: 'k1' });

			await Connectors.get(ctx, { id: 'k1' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/actions/connector/k1',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('lists all connectors', async () => {
			mockedRequest.mockResolvedValueOnce({ data: [] });

			await Connectors.list(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/actions/connectors',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('deletes a connector', async () => {
			mockedRequest.mockResolvedValueOnce({});

			await Connectors.remove(ctx, { id: 'k1' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/actions/connector/k1',
				BASE,
				ctx.key,
				{ method: 'DELETE' },
			);
		});

		it('lists connector types with optional feature filter', async () => {
			mockedRequest.mockResolvedValueOnce({ connector_types: [] });

			await Connectors.listTypes(ctx, { feature_id: 'alerting' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/actions/connector_types',
				BASE,
				ctx.key,
				{ method: 'GET', query: { feature_id: 'alerting' } },
			);
		});
	});

	describe('fleet', () => {
		it('checks fleet permissions', async () => {
			mockedRequest.mockResolvedValueOnce({ success: true });

			const res = await Fleet.checkPermissions(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/check-permissions',
				BASE,
				ctx.key,
				{ method: 'GET', query: undefined },
			);
			expect(res.success).toBe(true);
		});

		it('lists agent policies with pagination', async () => {
			mockedRequest.mockResolvedValueOnce({ total: 1, items: [] });

			await Fleet.agentPoliciesList(ctx, { page: 1, perPage: 20 });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/agent_policies',
				BASE,
				ctx.key,
				{ method: 'GET', query: { page: 1, perPage: 20 } },
			);
		});

		it('lists package policies', async () => {
			mockedRequest.mockResolvedValueOnce({ total: 0, items: [] });

			await Fleet.packagePoliciesList(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/package_policies',
				BASE,
				ctx.key,
				{ method: 'GET', query: undefined },
			);
		});

		it('lists enrollment keys', async () => {
			mockedRequest.mockResolvedValueOnce({ total: 1, items: [] });

			await Fleet.enrollmentKeysList(ctx, { page: 1 });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/enrollment_api_keys',
				BASE,
				ctx.key,
				{ method: 'GET', query: { page: 1 } },
			);
		});

		it('gets an enrollment key by id', async () => {
			mockedRequest.mockResolvedValueOnce({ item: { id: 'k1' } });

			await Fleet.enrollmentKeyGet(ctx, { keyId: 'k1' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/enrollment_api_keys/k1',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('lists server hosts', async () => {
			mockedRequest.mockResolvedValueOnce({ items: [] });

			await Fleet.serverHostsList(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/fleet_server_hosts',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('gets a server host by id', async () => {
			mockedRequest.mockResolvedValueOnce({ item: {} });

			await Fleet.serverHostGet(ctx, { itemId: 'h1' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/fleet_server_hosts/h1',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('deletes an output', async () => {
			mockedRequest.mockResolvedValueOnce({});

			await Fleet.outputDelete(ctx, { outputId: 'o1' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/outputs/o1',
				BASE,
				ctx.key,
				{ method: 'DELETE' },
			);
		});

		it('deletes a proxy', async () => {
			mockedRequest.mockResolvedValueOnce({});

			await Fleet.proxyDelete(ctx, { itemId: 'p1' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/proxies/p1',
				BASE,
				ctx.key,
				{ method: 'DELETE' },
			);
		});

		it('gets agents setup status', async () => {
			mockedRequest.mockResolvedValueOnce({ isReady: true });

			const res = await Fleet.agentsSetup(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/agents/setup',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
			expect(res.isReady).toBe(true);
		});

		it('lists available agent versions', async () => {
			mockedRequest.mockResolvedValueOnce({ items: ['8.15.0'] });

			const res = await Fleet.agentsVersions(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/agents/available_versions',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
			expect(res.items).toEqual(['8.15.0']);
		});

		it('lists epm packages', async () => {
			mockedRequest.mockResolvedValueOnce({ response: [] });

			await Fleet.epmPackagesList(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/epm/packages',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('lists limited epm packages', async () => {
			mockedRequest.mockResolvedValueOnce({ response: ['system'] });

			await Fleet.epmPackagesLimited(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/epm/packages/limited',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('lists installed epm packages', async () => {
			mockedRequest.mockResolvedValueOnce({ response: [] });

			await Fleet.epmPackagesInstalled(ctx, { perPage: 10 });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/epm/packages/installed',
				BASE,
				ctx.key,
				{ method: 'GET', query: { perPage: 10 } },
			);
		});

		it('gets epm package details', async () => {
			mockedRequest.mockResolvedValueOnce({ response: {} });

			await Fleet.epmPackageDetails(ctx, { pkgName: 'system', pkgVersion: '1.0.0' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/epm/packages/system/1.0.0',
				BASE,
				ctx.key,
				{ method: 'GET', query: undefined },
			);
		});

		it('gets an epm package file', async () => {
			mockedRequest.mockResolvedValueOnce({});

			await Fleet.epmPackageFile(ctx, {
				pkgName: 'system',
				pkgVersion: '1.0.0',
				filePath: 'manifest.yml',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/epm/packages/system/1.0.0/manifest.yml',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('gets epm package stats', async () => {
			mockedRequest.mockResolvedValueOnce({ response: {} });

			await Fleet.epmPackageStats(ctx, { pkgName: 'system' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/epm/packages/system/stats',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('lists epm data streams', async () => {
			mockedRequest.mockResolvedValueOnce({ data_streams: [] });

			await Fleet.epmDataStreams(ctx, { type: 'logs' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/epm/data_streams',
				BASE,
				ctx.key,
				{ method: 'GET', query: { type: 'logs' } },
			);
		});

		it('lists epm categories', async () => {
			mockedRequest.mockResolvedValueOnce({ response: [] });

			await Fleet.epmCategories(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/fleet/epm/categories',
				BASE,
				ctx.key,
				{ method: 'GET', query: undefined },
			);
		});
	});

	describe('detection', () => {
		it('finds detection rules with filters', async () => {
			mockedRequest.mockResolvedValueOnce({ total: 3, data: [] });

			const res = await DetectionEngine.findRules(ctx, { page: 1, per_page: 20 });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/detection_engine/rules/_find',
				BASE,
				ctx.key,
				{ method: 'GET', query: { page: 1, per_page: 20 } },
			);
			expect(res.total).toBe(3);
		});

		it('finds alerts via POST search', async () => {
			mockedRequest.mockResolvedValueOnce({ took: 5, timed_out: false });

			const res = await DetectionEngine.findAlerts(ctx, { size: 10 });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/detection_engine/signals/search',
				BASE,
				ctx.key,
				{ method: 'POST', body: { size: 10 } },
			);
			expect(res.took).toBe(5);
		});
	});

	describe('security', () => {
		it('lists endpoint list items', async () => {
			mockedRequest.mockResolvedValueOnce({ total: 1, data: [] });

			await Security.listEndpointItems(ctx, { per_page: 10 });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/endpoint_list/items/_find',
				BASE,
				ctx.key,
				{ method: 'GET', query: { per_page: 10 } },
			);
		});

		it('gets entity store status', async () => {
			mockedRequest.mockResolvedValueOnce({ status: 'running', engines: [] });

			const res = await Security.entityStoreStatus(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/security/entity_store/status',
				BASE,
				ctx.key,
				{ method: 'GET', query: undefined },
			);
			expect(res.status).toBe('running');
		});

		it('gets entity store engines from status endpoint', async () => {
			mockedRequest.mockResolvedValueOnce({ engines: [] });

			await Security.entityStoreEngines(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/security/entity_store/status',
				BASE,
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('lists entity store entities in page mode with filterQuery', async () => {
			mockedRequest.mockResolvedValueOnce({ total: 0, records: [] });

			await Security.entitiesList(ctx, { page: 1, filterQuery: 'user:*' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/security/entity_store/entities',
				BASE,
				ctx.key,
				{ method: 'GET', query: { filterQuery: 'user:*', page: 1 } },
			);
		});

		it('lists entity store entities in search-after mode without page params', async () => {
			mockedRequest.mockResolvedValueOnce({ total: 0, records: [] });

			await Security.entitiesList(ctx, {
				searchAfter: '[123]',
				size: 10,
				filter: 'user.name: root',
				page: 2,
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/security/entity_store/entities',
				BASE,
				ctx.key,
				{
					method: 'GET',
					query: { filter: 'user.name: root', size: 10, searchAfter: '[123]' },
				},
			);
		});
	});

	describe('lists + osquery', () => {
		it('deletes a list via query id', async () => {
			mockedRequest.mockResolvedValueOnce({});

			await ListsOsquery.deleteList(ctx, { id: 'list-1' });

			expect(mockedRequest).toHaveBeenCalledWith('api/lists', BASE, ctx.key, {
				method: 'DELETE',
				query: { id: 'list-1' },
			});
		});

		it('deletes an osquery saved query', async () => {
			mockedRequest.mockResolvedValueOnce({});

			await ListsOsquery.deleteSavedQuery(ctx, { id: 'q-1' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/osquery/saved_queries/q-1',
				BASE,
				ctx.key,
				{ method: 'DELETE' },
			);
		});
	});

	describe('reporting + metrics + index', () => {
		it('lists reporting jobs', async () => {
			mockedRequest.mockResolvedValueOnce({ jobs: [], total: 0 });

			await OpsUnverified.listJobs(ctx, { page: 1 });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/reporting/jobs',
				BASE,
				ctx.key,
				{ method: 'GET', query: { page: 1 } },
			);
		});

		it('gets node metrics against the elasticsearch base URL', async () => {
			mockedRequest.mockResolvedValueOnce({ nodes: {} });

			await OpsUnverified.nodeMetrics(
				{
					...ctx,
					options: {
						...ctx.options,
						elasticsearchBaseUrl: 'https://es.example.com:9200',
					},
				},
				{},
			);

			expect(mockedRequest).toHaveBeenCalledWith(
				'_nodes/stats',
				'https://es.example.com:9200',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('lists indices', async () => {
			mockedRequest.mockResolvedValueOnce({ indices: [] });

			await OpsUnverified.listIndices(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/index_management/indices',
				BASE,
				ctx.key,
				{ method: 'GET', query: undefined },
			);
		});
	});
});
