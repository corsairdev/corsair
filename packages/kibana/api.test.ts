import { makeKibanaRequest } from './client';
import { KibanaEndpointOutputSchemas } from './endpoints/types';

const BASE_URL = process.env.KIBANA_BASE_URL ?? '';
const API_KEY = process.env.KIBANA_API_KEY ?? '';
const RUN_LIVE = BASE_URL.length > 0 && API_KEY.length > 0;
const describeLive = RUN_LIVE ? describe : describe.skip;

describeLive('Kibana live API (env-gated)', () => {
	it('GET api/status returns version payload', async () => {
		const res = await makeKibanaRequest('api/status', BASE_URL, API_KEY, {
			method: 'GET',
		});
		const parsed = KibanaEndpointOutputSchemas.statusGet.parse(res);
		expect(parsed).toBeDefined();
		expect(typeof parsed).toBe('object');
	});

	it('GET saved_objects/_find returns paged payload', async () => {
		const res = await makeKibanaRequest('api/saved_objects/_find', BASE_URL, API_KEY, {
			method: 'GET',
			query: { type: 'dashboard', per_page: 5, page: 1 },
		});
		const parsed = KibanaEndpointOutputSchemas.savedObjectsFind.parse(res);
		expect(typeof parsed.total).toBe('number');
		expect(Array.isArray(parsed.saved_objects)).toBe(true);
		expect(parsed.total).toBeGreaterThanOrEqual(0);
	});

	it('GET api/dashboards returns searchable payload', async () => {
		const res = await makeKibanaRequest('api/dashboards', BASE_URL, API_KEY, {
			method: 'GET',
			query: { limit: 5 },
		});
		const parsed = KibanaEndpointOutputSchemas.dashboardsSearch.parse(res);
		expect(parsed).toBeDefined();
		expect(typeof parsed).toBe('object');
	});

	it('GET api/data_views returns list payload', async () => {
		const res = await makeKibanaRequest('api/data_views', BASE_URL, API_KEY, {
			method: 'GET',
		});
		const parsed = KibanaEndpointOutputSchemas.dataViewsList.parse(res);
		expect(parsed).toBeDefined();
		expect(typeof parsed).toBe('object');
	});

	it('GET api/fleet/check-permissions returns permission payload', async () => {
		const res = await makeKibanaRequest(
			'api/fleet/check-permissions',
			BASE_URL,
			API_KEY,
			{ method: 'GET' },
		);
		const parsed = KibanaEndpointOutputSchemas.fleetCheckPermissions.parse(res);
		expect(parsed).toBeDefined();
		expect(typeof parsed).toBe('object');
	});
});
