import 'dotenv/config';
import { callApifyMcpTool } from './client';
import { ApifyMcpEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY =
	process.env.APIFY_TOKEN || process.env.APIFY_API_KEY || undefined;

const describeLive = TEST_API_KEY ? describe : describe.skip;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, keys: string[]) {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === 'string' && value.length > 0) return value;
	}
	return undefined;
}

function readDatasetId(record: Record<string, unknown>) {
	const direct = readString(record, ['datasetId', 'defaultDatasetId']);
	if (direct) return direct;

	const storages = record.storages;
	if (!isRecord(storages)) return undefined;
	const datasets = storages.datasets;
	if (!isRecord(datasets)) return undefined;
	const defaults = datasets.default;
	if (!isRecord(defaults)) return undefined;
	return readString(defaults, ['id']);
}

describeLive('Apify MCP API Type Tests', () => {
	describe('actors', () => {
		it('searchActors returns a valid response', async () => {
			const response = await callApifyMcpTool(
				'search-actors',
				{ search: 'google search', limit: 2 },
				TEST_API_KEY,
			);

			ApifyMcpEndpointOutputSchemas.searchActors.parse(response);
			expect(response).toBeDefined();
			if (Array.isArray(response)) {
				expect(response.length).toBeGreaterThan(0);
			} else if (isRecord(response)) {
				const items = Array.isArray(response.items)
					? response.items
					: Array.isArray(response.actors)
						? response.actors
						: null;
				if (items) expect(items.length).toBeGreaterThan(0);
			}
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
			expect(isRecord(response)).toBe(true);
		});

		it('callActor returns a valid response', async () => {
			const response = await callApifyMcpTool(
				'call-actor',
				{
					actor: 'apify/rag-web-browser',
					input: { query: 'corsair apify mcp', maxResults: 1 },
				},
				TEST_API_KEY,
			);

			ApifyMcpEndpointOutputSchemas.callActor.parse(response);
			expect(response).toBeDefined();
		}, 120000);

		it('ragWebBrowser returns a valid response', async () => {
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
			const run = await callApifyMcpTool<Record<string, unknown>>(
				'call-actor',
				{
					actor: 'apify/rag-web-browser',
					input: { query: 'corsair integrations', maxResults: 1 },
				},
				TEST_API_KEY,
			);

			ApifyMcpEndpointOutputSchemas.callActor.parse(run);

			const runId =
				readString(run, ['id', 'runId']) ||
				(isRecord(run.data) ? readString(run.data, ['id', 'runId']) : undefined);

			expect(runId).toBeTruthy();

			const runDetails = await callApifyMcpTool(
				'get-actor-run',
				{ runId: runId! },
				TEST_API_KEY,
			);
			ApifyMcpEndpointOutputSchemas.getActorRun.parse(runDetails);
			expect(runDetails).toBeDefined();

			const details = isRecord(runDetails) ? runDetails : {};
			const datasetId =
				readDatasetId(details) ||
				readDatasetId(run) ||
				(isRecord(run.data) ? readDatasetId(run.data) : undefined);

			expect(datasetId).toBeTruthy();

			const output = await callApifyMcpTool(
				'get-dataset-items',
				{ datasetId: datasetId!, limit: 1 },
				TEST_API_KEY,
			);
			ApifyMcpEndpointOutputSchemas.getActorOutput.parse(output);
			expect(output).toBeDefined();
			expect(isRecord(output)).toBe(true);
			expect(Array.isArray((output as Record<string, unknown>).items)).toBe(
				true,
			);
		}, 180000);
	});
});
