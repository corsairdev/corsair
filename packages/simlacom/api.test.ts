import { makeSimlaComRequest } from './client';
import { SIMLACOM_OUTPUT_SCHEMAS } from './endpoints/schemas';
import { getSimlaComOperation } from './endpoints/types';

const apiKey = process.env.SIMLACOM_API_KEY;
const subdomain = process.env.SIMLACOM_SUBDOMAIN;
const hasLiveCredentials = Boolean(apiKey && subdomain);

if (!hasLiveCredentials) {
	console.warn(
		'[simlacom] live smoke test skipped: set SIMLACOM_API_KEY and SIMLACOM_SUBDOMAIN to run it.',
	);
}

const liveTest = hasLiveCredentials ? test : test.skip;

liveTest(
	'reads the current API version list using the configured instance',
	async () => {
		const operation = getSimlaComOperation('api.apiVersions.get');
		const response = await makeSimlaComRequest(
			operation,
			apiKey ?? '',
			subdomain,
			{},
		);
		const output = SIMLACOM_OUTPUT_SCHEMAS.get(operation.id);
		expect(output).toBeDefined();
		expect(output?.parse(response)).toMatchObject({ success: true });
	},
);
