import { makeWebvizioRequest, WEBVIZIO_MCP_API_BASE } from './client';
import { WebvizioEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.WEBVIZIO_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('Webvizio live API integration tests', () => {
	it('fetches real projects list with valid token', async () => {
		const projects = await makeWebvizioRequest<unknown[]>(
			'/projects',
			TEST_API_KEY as string,
			{ baseUrl: WEBVIZIO_MCP_API_BASE },
		);

		expect(Array.isArray(projects)).toBe(true);
		const parsed = WebvizioEndpointOutputSchemas.projectsList.parse(projects);
		expect(parsed.length).toBeGreaterThanOrEqual(1);
		expect(parsed[0]?.uuid).toBeDefined();
		expect(parsed[0]?.name).toBeDefined();
	});
});
