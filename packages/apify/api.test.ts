import 'dotenv/config';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ActorsEndpoints, DocsEndpoints, RunsEndpoints } from './endpoints';
import {
	ApifyMcpEndpointOutputSchemas,
	FetchApifyDocsInputSchema,
} from './endpoints/types';
import type { ApifyMcpContext } from './index';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const TEST_API_KEY =
	process.env.APIFY_TOKEN || process.env.APIFY_API_KEY || undefined;

// Opt-in live suite: APIFY_LIVE_TESTS=1 plus a token (avoids accidental paid runs).
const describeLive =
	process.env.APIFY_LIVE_TESTS === '1' && TEST_API_KEY
		? describe
		: describe.skip;

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

function createCtx(key?: string): ApifyMcpContext {
	return {
		key,
		$getAccountId: async () => 'test-account',
		db: {
			actors: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			actorRuns: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			actorOutputs: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	} as unknown as ApifyMcpContext;
}

describe('Apify MCP endpoint guards', () => {
	it('callActor throws AuthMissingError without api key', async () => {
		await expect(
			ActorsEndpoints.callActor(createCtx(), {
				actor: 'apify/rag-web-browser',
				input: { query: 'x', maxResults: 1 },
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('ragWebBrowser throws AuthMissingError without api key', async () => {
		await expect(
			ActorsEndpoints.ragWebBrowser(createCtx(), {
				query: 'x',
				maxResults: 1,
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('getActorRun throws AuthMissingError without api key', async () => {
		await expect(
			RunsEndpoints.getActorRun(createCtx(), { runId: 'missing' }),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('getActorOutput throws AuthMissingError without api key', async () => {
		await expect(
			RunsEndpoints.getActorOutput(createCtx(), {
				datasetId: 'missing',
				limit: 1,
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('fetchApifyDocs schema allows only Apify/Crawlee docs hosts', () => {
		expect(
			FetchApifyDocsInputSchema.parse({
				url: 'https://docs.apify.com/platform/integrations/mcp',
			}).url,
		).toBe('https://docs.apify.com/platform/integrations/mcp');
		expect(
			FetchApifyDocsInputSchema.safeParse({
				url: 'https://example.com/docs',
			}).success,
		).toBe(false);
		expect(
			FetchApifyDocsInputSchema.safeParse({
				url: 'http://docs.apify.com/platform',
			}).success,
		).toBe(false);
	});
});

describeLive('Apify MCP API Type Tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('actors', () => {
		it('searchActors returns a valid response and caches', async () => {
			const ctx = createCtx(TEST_API_KEY);
			const response = await ActorsEndpoints.searchActors(ctx, {
				search: 'google search',
				limit: 2,
			});

			ApifyMcpEndpointOutputSchemas.searchActors.parse(response);
			expect(response).toBeDefined();
			expect(ctx.db.actors.upsertByEntityId).toHaveBeenCalled();
			expect(logEventFromContext).toHaveBeenCalledWith(
				ctx,
				'apify.actors.searchActors',
				expect.objectContaining({ tool: 'search-actors' }),
				'completed',
			);
		});

		it('fetchActorDetails returns a valid response and caches', async () => {
			const ctx = createCtx(TEST_API_KEY);
			const response = await ActorsEndpoints.fetchActorDetails(ctx, {
				actor: 'apify/rag-web-browser',
				output: { description: true, inputSchema: true },
			});

			ApifyMcpEndpointOutputSchemas.fetchActorDetails.parse(response);
			expect(isRecord(response)).toBe(true);
			expect(ctx.db.actors.upsertByEntityId).toHaveBeenCalled();
		});

		it('callActor returns a valid response and caches run', async () => {
			const ctx = createCtx(TEST_API_KEY);
			const response = await ActorsEndpoints.callActor(ctx, {
				actor: 'apify/rag-web-browser',
				input: { query: 'corsair apify mcp', maxResults: 1 },
			});

			ApifyMcpEndpointOutputSchemas.callActor.parse(response);
			expect(response).toBeDefined();
			expect(ctx.db.actorRuns.upsertByEntityId).toHaveBeenCalled();
		}, 120000);

		it('ragWebBrowser returns a valid response and caches run', async () => {
			const ctx = createCtx(TEST_API_KEY);
			const response = await ActorsEndpoints.ragWebBrowser(ctx, {
				query: 'Apify MCP server',
				maxResults: 1,
			});

			ApifyMcpEndpointOutputSchemas.ragWebBrowser.parse(response);
			expect(response).toBeDefined();
			expect(ctx.db.actorRuns.upsertByEntityId).toHaveBeenCalled();
		}, 90000);
	});

	describe('docs', () => {
		it('searchApifyDocs returns a valid response', async () => {
			const ctx = createCtx(TEST_API_KEY);
			const response = await DocsEndpoints.searchApifyDocs(ctx, {
				query: 'actor runs',
				docSource: 'apify',
			});

			ApifyMcpEndpointOutputSchemas.searchApifyDocs.parse(response);
			expect(response).toBeDefined();
			expect(logEventFromContext).toHaveBeenCalledWith(
				ctx,
				'apify.docs.searchApifyDocs',
				expect.objectContaining({ tool: 'search-apify-docs' }),
				'completed',
			);
		});

		it('fetchApifyDocs returns a valid response', async () => {
			const ctx = createCtx(TEST_API_KEY);
			const response = await DocsEndpoints.fetchApifyDocs(ctx, {
				url: 'https://docs.apify.com/platform/integrations/mcp',
			});

			ApifyMcpEndpointOutputSchemas.fetchApifyDocs.parse(response);
			expect(response).toBeDefined();
		});
	});

	describe('runs', () => {
		it('getActorRun and getActorOutput return valid responses via endpoints', async () => {
			const ctx = createCtx(TEST_API_KEY);
			const run = (await ActorsEndpoints.callActor(ctx, {
				actor: 'apify/rag-web-browser',
				input: { query: 'corsair integrations', maxResults: 1 },
			})) as Record<string, unknown>;

			ApifyMcpEndpointOutputSchemas.callActor.parse(run);

			const runId =
				readString(run, ['id', 'runId']) ||
				(isRecord(run.data)
					? readString(run.data, ['id', 'runId'])
					: undefined);

			expect(runId).toBeTruthy();

			const runDetails = await RunsEndpoints.getActorRun(ctx, {
				runId: runId!,
			});
			ApifyMcpEndpointOutputSchemas.getActorRun.parse(runDetails);
			expect(ctx.db.actorRuns.upsertByEntityId).toHaveBeenCalled();

			const details = isRecord(runDetails) ? runDetails : {};
			const datasetId =
				readDatasetId(details) ||
				readDatasetId(run) ||
				(isRecord(run.data) ? readDatasetId(run.data) : undefined);

			expect(datasetId).toBeTruthy();

			const output = await RunsEndpoints.getActorOutput(ctx, {
				datasetId: datasetId!,
				limit: 1,
			});
			ApifyMcpEndpointOutputSchemas.getActorOutput.parse(output);
			expect(isRecord(output)).toBe(true);
			expect(Array.isArray((output as Record<string, unknown>).items)).toBe(
				true,
			);
			// limit/offset/fields responses are not cached under bare datasetId.
			expect(ctx.db.actorOutputs.upsertByEntityId).not.toHaveBeenCalled();

			await RunsEndpoints.getActorOutput(ctx, { datasetId: datasetId! });
			expect(ctx.db.actorOutputs.upsertByEntityId).toHaveBeenCalledWith(
				datasetId,
				expect.objectContaining({ datasetId }),
			);
		}, 180000);
	});
});
