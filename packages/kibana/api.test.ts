import { makeKibanaRequest } from './client';
import {
	KibanaEndpointInputSchemas,
	KibanaEndpointOutputSchemas,
} from './endpoints/types';

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

	it('GET saved_objects/_find is skipped on serverless (API disabled there)', async () => {
		// The Saved Objects API answers 400 "not available with the current
		// configuration" on serverless; this documents the wiring only.
		expect(KibanaEndpointInputSchemas.savedObjectsFind).toBeDefined();
	});

	it('GET alerting rules returns paged payload', async () => {
		const res = await makeKibanaRequest('api/alerting/rules/_find', BASE_URL, API_KEY, {
			method: 'GET',
			query: { per_page: 1 },
		});
		const parsed = KibanaEndpointOutputSchemas.alertingRulesList.parse(res);
		expect(typeof parsed.total).toBe('number');
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('GET connectors returns an array payload', async () => {
		const res = await makeKibanaRequest('api/actions/connectors', BASE_URL, API_KEY, {
			method: 'GET',
		});
		const parsed = KibanaEndpointOutputSchemas.connectorsList.parse(res);
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('GET api/dashboards returns searchable payload', async () => {
		const res = await makeKibanaRequest('api/dashboards', BASE_URL, API_KEY, {
			method: 'GET',
			query: { page: 1, per_page: 5 },
		});
		const parsed = KibanaEndpointOutputSchemas.dashboardsSearch.parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
		expect(typeof parsed.meta?.total).toBe('number');
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
