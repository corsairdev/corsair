import { makeFiberyCommand } from './client';
import { FiberyEndpointOutputSchemas } from './endpoints/types';

const WORKSPACE_URL = process.env.FIBERY_WORKSPACE_URL ?? '';
const API_KEY = process.env.FIBERY_API_KEY ?? '';
const hasLiveCredentials = WORKSPACE_URL.length > 0 && API_KEY.length > 0;
if (!hasLiveCredentials) {
	console.warn(
		'Skipping Fibery live tests: set FIBERY_WORKSPACE_URL and FIBERY_API_KEY.',
	);
}
const describeLive = hasLiveCredentials ? describe : describe.skip;

describeLive('Fibery live API (read-only, env-gated)', () => {
	it('reads and validates workspace schema metadata', async () => {
		const response = await makeFiberyCommand(
			'fibery.schema/query',
			{},
			API_KEY,
			{ workspaceUrl: WORKSPACE_URL },
		);
		const parsed = FiberyEndpointOutputSchemas.schemaQuery.parse(response);
		expect(parsed).toBeDefined();
		expect(JSON.stringify(parsed)).not.toContain(API_KEY);
	});
});
