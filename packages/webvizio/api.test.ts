import {
	makeWebvizioRequest,
	unwrapWebvizioList,
	WEBVIZIO_MCP_API_BASE,
} from './client';
import { WebvizioEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.WEBVIZIO_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('Webvizio live API integration tests', () => {
	it('fetches MCP projects as uuid/name rows', async () => {
		const projects = await makeWebvizioRequest<unknown>(
			'/projects',
			TEST_API_KEY as string,
			{ baseUrl: WEBVIZIO_MCP_API_BASE },
		);

		const parsed = WebvizioEndpointOutputSchemas.projectsList.parse(
			unwrapWebvizioList(projects),
		);
		expect(parsed.length).toBeGreaterThanOrEqual(1);
		expect(parsed[0]?.uuid).toEqual(expect.any(String));
		expect(parsed[0]?.name).toEqual(expect.any(String));
	});
});
