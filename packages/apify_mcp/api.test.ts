import 'dotenv/config';
import { callApifyMcpTool } from './client';
import { ApifyMcpEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.APIFY_TOKEN ?? process.env.APIFY_API_KEY;

describe('Apify MCP API Type Tests', () => {
	describe('actors', () => {
		it('searchActors returns a valid response', async () => {
			const response = await callApifyMcpTool(
				'search-actors',
				{ search: 'google search', limit: 2 },
				TEST_API_KEY,
			);

			ApifyMcpEndpointOutputSchemas.searchActors.parse(response);
			expect(response).toBeDefined();
		});

		it('fetchActorDetails returns a valid response', async () => {
			const response = await callApifyMcpTool(
				'fetch-actor-details',
				{
					actor: 'apify/rag-web-browser',
					output: { description: true, inputSchema: true },
				},
				TEST_API_KEY,
			);

			ApifyMcpEndpointOutputSchemas.fetchActorDetails.parse(response);
			expect(response).toBeDefined();
		});

		it('ragWebBrowser returns a valid response', async () => {
			if (!TEST_API_KEY) {
				console.warn('Skipping: APIFY_TOKEN not set');
				return;
			}

			const response = await callApifyMcpTool(
				'apify/rag-web-browser',
				{ query: 'Apify MCP server', maxResults: 1 },
				TEST_API_KEY,
			);

			ApifyMcpEndpointOutputSchemas.ragWebBrowser.parse(response);
			expect(response).toBeDefined();
		}, 90000);
	});

	describe('docs', () => {
		it('searchApifyDocs returns a valid response', async () => {
			const response = await callApifyMcpTool(
				'search-apify-docs',
				{ query: 'actor runs', docSource: 'apify' },
				TEST_API_KEY,
			);

			ApifyMcpEndpointOutputSchemas.searchApifyDocs.parse(response);
			expect(response).toBeDefined();
		});

		it('fetchApifyDocs returns a valid response', async () => {
			const response = await callApifyMcpTool(
				'fetch-apify-docs',
				{ url: 'https://docs.apify.com/platform/integrations/mcp' },
				TEST_API_KEY,
			);

			ApifyMcpEndpointOutputSchemas.fetchApifyDocs.parse(response);
			expect(response).toBeDefined();
		});
	});

	describe('runs', () => {
		it('getActorRun and getActorOutput return valid responses', async () => {
			if (!TEST_API_KEY) {
				console.warn('Skipping: APIFY_TOKEN not set');
				return;
			}

			const run = await callApifyMcpTool<Record<string, unknown>>(
				'apify/rag-web-browser',
				{ query: 'corsair integrations', maxResults: 1 },
				TEST_API_KEY,
			);

			const runId =
				(typeof run.id === 'string' && run.id) ||
				(typeof run.runId === 'string' && run.runId) ||
				(isRecord(run.data) &&
					typeof run.data.id === 'string' &&
					run.data.id) ||
				undefined;

			expect(runId).toBeTruthy();

			const runDetails = await callApifyMcpTool(
				'get-actor-run',
				{ runId: runId! },
				TEST_API_KEY,
			);
			ApifyMcpEndpointOutputSchemas.getActorRun.parse(runDetails);

			const datasetId =
				(isRecord(runDetails) && typeof runDetails.datasetId === 'string'
					? runDetails.datasetId
					: undefined) ||
				(typeof run.datasetId === 'string' ? run.datasetId : undefined);

			if (!datasetId) {
				console.warn('Skipping getActorOutput: datasetId not available yet');
				return;
			}

			const output = await callApifyMcpTool(
				'get-actor-output',
				{ datasetId, limit: 1 },
				TEST_API_KEY,
			);
			ApifyMcpEndpointOutputSchemas.getActorOutput.parse(output);
		}, 120000);
	});
});

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
