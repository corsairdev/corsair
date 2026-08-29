import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Web Unlocker Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const WebUnlockerUnlockInputSchema = z
	.object({
		zone: z.string().describe('Bright Data Web Unlocker zone name'),
		url: z.string().url().describe('Target URL to unlock and scrape'),
		format: z.enum(['raw', 'json']).optional().describe('Response format'),
		method: z
			.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
			.optional()
			.describe('HTTP method for target URL'),
		country: z
			.string()
			.optional()
			.describe('2-letter ISO country code for geo-targeting'),
		headers: z
			.record(z.string(), z.string())
			.optional()
			.describe('Custom HTTP headers to send to target'),
		body: z
			.string()
			.optional()
			.describe('Payload to send to target (for POST/PUT)'),
		debug: z
			.boolean()
			.optional()
			.describe('Include debug information in response'),
		unblock_act: z
			.string()
			.optional()
			.describe('Custom action instructions for Web Unlocker'),
	})
	.passthrough();

export const WebUnlockerUnlockOutputSchema = z
	.object({
		status: z.union([z.string(), z.number()]).optional(),
		headers: z.record(z.string(), z.string()).optional(),
		body: z.string().optional(),
		response_id: z.string().optional(),
		data: z.unknown().optional(),
	})
	.passthrough();

export const WebUnlockerUnlockAsyncInputSchema = z
	.object({
		zone: z.string().describe('Bright Data Web Unlocker zone name'),
		url: z.string().url().describe('Target URL to unlock asynchronously'),
		format: z.enum(['raw', 'json']).optional(),
		method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).optional(),
		country: z.string().optional(),
		headers: z.record(z.string(), z.string()).optional(),
		body: z.string().optional(),
		debug: z.boolean().optional(),
		endpoint: z
			.string()
			.url()
			.optional()
			.describe('Webhook callback URL to receive results'),
	})
	.passthrough();

export const WebUnlockerUnlockAsyncOutputSchema = z
	.object({
		response_id: z.string().optional(),
		status: z.union([z.string(), z.number()]).optional(),
	})
	.passthrough();

export const WebUnlockerGetAsyncResultInputSchema = z
	.object({
		id: z.string().describe('Async response ID (from unlockAsync)'),
	})
	.passthrough();

export const WebUnlockerGetAsyncResultOutputSchema = z
	.object({
		status: z.union([z.string(), z.number()]).optional(),
		body: z.string().optional(),
		response_id: z.string().optional(),
		data: z.unknown().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// SERP API Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const SerpSearchInputSchema = z
	.object({
		zone: z.string().describe('Bright Data SERP zone name'),
		url: z.string().describe('Full search engine URL to fetch'),
		format: z.enum(['raw', 'json']).optional().describe('Response format'),
		country: z.string().optional().describe('Country code'),
		search_engine: z.string().optional().describe('Search engine identifier'),
		brd_json: z.union([z.string(), z.number()]).optional(),
		headers: z.record(z.string(), z.string()).optional(),
	})
	.passthrough();

export const SerpOrganicResultSchema = z
	.object({
		link: z.string(),
		title: z.string(),
		description: z.string().optional(),
		rank: z.number().optional(),
		display_link: z.string().optional(),
	})
	.passthrough();

export const SerpSearchOutputSchema = z
	.object({
		general: z
			.object({
				search_engine: z.string().optional(),
				results_cnt: z.number().optional(),
				search_time: z.number().optional(),
				language: z.string().optional(),
				location: z.string().optional(),
			})
			.passthrough()
			.optional(),
		organic: z.array(SerpOrganicResultSchema).optional(),
		knowledge: z.record(z.string(), z.unknown()).optional(),
		related: z
			.array(
				z
					.object({
						text: z.string().optional(),
						link: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		pagination: z.record(z.string(), z.unknown()).optional(),
		body: z.string().optional(),
		status: z.union([z.string(), z.number()]).optional(),
	})
	.passthrough();

export const SerpQueryInputSchema = z
	.object({
		zone: z.string().describe('Bright Data SERP zone name'),
		query: z.string().describe('Search query string'),
		engine: z
			.enum(['google', 'bing', 'yandex', 'duckduckgo'])
			.optional()
			.describe('Search engine to query'),
		country: z.string().optional().describe('2-letter ISO country code'),
		language: z.string().optional().describe('Language code (e.g. en, es)'),
		num_results: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Number of results per page'),
		page: z.number().int().positive().optional().describe('Page number'),
		format: z.enum(['raw', 'json']).optional(),
	})
	.passthrough();

export const SerpQueryOutputSchema = SerpSearchOutputSchema;

// ─────────────────────────────────────────────────────────────────────────────
// Web Scraper / Datasets Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const ScraperTriggerInputSchema = z
	.object({
		dataset_id: z.string().describe('Bright Data Dataset ID'),
		inputs: z
			.array(z.record(z.string(), z.unknown()))
			.describe('Array of input objects/URLs for the scraper'),
		include_errors: z
			.boolean()
			.optional()
			.describe('Include error logs in the collection output'),
		format: z
			.enum(['json', 'csv', 'jsonl'])
			.optional()
			.describe('Desired output format'),
		endpoint: z
			.string()
			.url()
			.optional()
			.describe('Webhook delivery endpoint URL'),
		uncompressed_webhook: z.boolean().optional(),
		download_fields: z
			.string()
			.optional()
			.describe('Comma-separated list of extra fields to download'),
		custom_output_fields: z.string().optional(),
	})
	.passthrough();

export const ScraperTriggerOutputSchema = z
	.object({
		snapshot_id: z.string(),
	})
	.passthrough();

export const ScraperGetProgressInputSchema = z
	.object({
		snapshot_id: z.string().describe('Dataset snapshot ID'),
	})
	.passthrough();

export const ScraperGetProgressOutputSchema = z
	.object({
		status: z
			.union([z.string(), z.number()])
			.describe('Snapshot status (e.g. ready, building, failed)'),
		progress: z.number().optional(),
		error: z.string().optional(),
		error_message: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();

export const ScraperGetSnapshotInputSchema = z
	.object({
		snapshot_id: z.string().describe('Dataset snapshot ID'),
		format: z.enum(['json', 'csv', 'jsonl']).optional(),
		compress: z.boolean().optional(),
	})
	.passthrough();

export const ScraperGetSnapshotOutputSchema = z
	.object({
		data: z.union([
			z.array(z.record(z.string(), z.unknown())),
			z.record(z.string(), z.unknown()),
			z.string(),
		]),
	})
	.passthrough();

export const ScraperGetSnapshotMetadataInputSchema = z
	.object({
		snapshot_id: z.string().describe('Dataset snapshot ID'),
	})
	.passthrough();

export const ScraperGetSnapshotMetadataOutputSchema = z
	.object({
		snapshot_id: z.string().optional(),
		dataset_id: z.string().optional(),
		status: z.union([z.string(), z.number()]).optional(),
		created_at: z.string().optional(),
		records_count: z.number().optional(),
		size: z.number().optional(),
	})
	.passthrough();

export const ScraperDeliverSnapshotInputSchema = z
	.object({
		snapshot_id: z.string().describe('Dataset snapshot ID'),
		deliver: z
			.object({
				target: z.enum(['webhook', 's3', 'gcs', 'azure']),
				url: z.string().optional(),
			})
			.passthrough(),
	})
	.passthrough();

export const ScraperDeliverSnapshotOutputSchema = z
	.object({
		status: z.union([z.string(), z.number()]).optional(),
		message: z.string().optional(),
	})
	.passthrough();

export const ScraperListDatasetsInputSchema = z
	.object({
		limit: z.number().int().positive().optional(),
		offset: z.number().int().nonnegative().optional(),
	})
	.passthrough();

export const ScraperListDatasetsOutputSchema = z
	.object({
		datasets: z.array(
			z
				.object({
					id: z.string(),
					name: z.string().optional(),
					description: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Account / Zones Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AccountGetBalanceInputSchema = z.object({}).passthrough();

export const AccountGetBalanceOutputSchema = z
	.object({
		balance: z.number().optional(),
		currency: z.string().optional(),
	})
	.passthrough();

export const AccountListZonesInputSchema = z.object({}).passthrough();

export const AccountListZonesOutputSchema = z
	.object({
		zones: z.array(
			z
				.object({
					name: z.string(),
					type: z.string().optional(),
					plan: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Map of Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const BrightDataEndpointInputSchemas = {
	'webUnlocker.unlock': WebUnlockerUnlockInputSchema,
	'webUnlocker.unlockAsync': WebUnlockerUnlockAsyncInputSchema,
	'webUnlocker.getAsyncResult': WebUnlockerGetAsyncResultInputSchema,
	'serp.search': SerpSearchInputSchema,
	'serp.query': SerpQueryInputSchema,
	'scraper.trigger': ScraperTriggerInputSchema,
	'scraper.getProgress': ScraperGetProgressInputSchema,
	'scraper.getSnapshot': ScraperGetSnapshotInputSchema,
	'scraper.getSnapshotMetadata': ScraperGetSnapshotMetadataInputSchema,
	'scraper.deliverSnapshot': ScraperDeliverSnapshotInputSchema,
	'scraper.listDatasets': ScraperListDatasetsInputSchema,
	'account.getBalance': AccountGetBalanceInputSchema,
	'account.listZones': AccountListZonesInputSchema,
} as const;

export const BrightDataEndpointOutputSchemas = {
	'webUnlocker.unlock': WebUnlockerUnlockOutputSchema,
	'webUnlocker.unlockAsync': WebUnlockerUnlockAsyncOutputSchema,
	'webUnlocker.getAsyncResult': WebUnlockerGetAsyncResultOutputSchema,
	'serp.search': SerpSearchOutputSchema,
	'serp.query': SerpQueryOutputSchema,
	'scraper.trigger': ScraperTriggerOutputSchema,
	'scraper.getProgress': ScraperGetProgressOutputSchema,
	'scraper.getSnapshot': ScraperGetSnapshotOutputSchema,
	'scraper.getSnapshotMetadata': ScraperGetSnapshotMetadataOutputSchema,
	'scraper.deliverSnapshot': ScraperDeliverSnapshotOutputSchema,
	'scraper.listDatasets': ScraperListDatasetsOutputSchema,
	'account.getBalance': AccountGetBalanceOutputSchema,
	'account.listZones': AccountListZonesOutputSchema,
} as const;

export type BrightDataEndpointInputs = {
	[K in keyof typeof BrightDataEndpointInputSchemas]: z.infer<
		(typeof BrightDataEndpointInputSchemas)[K]
	>;
};

export type BrightDataEndpointOutputs = {
	[K in keyof typeof BrightDataEndpointOutputSchemas]: z.infer<
		(typeof BrightDataEndpointOutputSchemas)[K]
	>;
};

// Inferred types for convenience
export type WebUnlockerUnlockInput = z.infer<typeof WebUnlockerUnlockInputSchema>;
export type WebUnlockerUnlockOutput = z.infer<typeof WebUnlockerUnlockOutputSchema>;
export type WebUnlockerUnlockAsyncInput = z.infer<typeof WebUnlockerUnlockAsyncInputSchema>;
export type WebUnlockerUnlockAsyncOutput = z.infer<typeof WebUnlockerUnlockAsyncOutputSchema>;
export type WebUnlockerGetAsyncResultInput = z.infer<typeof WebUnlockerGetAsyncResultInputSchema>;
export type WebUnlockerGetAsyncResultOutput = z.infer<typeof WebUnlockerGetAsyncResultOutputSchema>;

export type SerpSearchInput = z.infer<typeof SerpSearchInputSchema>;
export type SerpSearchOutput = z.infer<typeof SerpSearchOutputSchema>;
export type SerpQueryInput = z.infer<typeof SerpQueryInputSchema>;
export type SerpQueryOutput = z.infer<typeof SerpQueryOutputSchema>;

export type ScraperTriggerInput = z.infer<typeof ScraperTriggerInputSchema>;
export type ScraperTriggerOutput = z.infer<typeof ScraperTriggerOutputSchema>;
export type ScraperGetProgressInput = z.infer<typeof ScraperGetProgressInputSchema>;
export type ScraperGetProgressOutput = z.infer<typeof ScraperGetProgressOutputSchema>;
export type ScraperGetSnapshotInput = z.infer<typeof ScraperGetSnapshotInputSchema>;
export type ScraperGetSnapshotOutput = z.infer<typeof ScraperGetSnapshotOutputSchema>;
export type ScraperGetSnapshotMetadataInput = z.infer<typeof ScraperGetSnapshotMetadataInputSchema>;
export type ScraperGetSnapshotMetadataOutput = z.infer<typeof ScraperGetSnapshotMetadataOutputSchema>;
export type ScraperDeliverSnapshotInput = z.infer<typeof ScraperDeliverSnapshotInputSchema>;
export type ScraperDeliverSnapshotOutput = z.infer<typeof ScraperDeliverSnapshotOutputSchema>;
export type ScraperListDatasetsInput = z.infer<typeof ScraperListDatasetsInputSchema>;
export type ScraperListDatasetsOutput = z.infer<typeof ScraperListDatasetsOutputSchema>;

export type AccountGetBalanceInput = z.infer<typeof AccountGetBalanceInputSchema>;
export type AccountGetBalanceOutput = z.infer<typeof AccountGetBalanceOutputSchema>;
export type AccountListZonesInput = z.infer<typeof AccountListZonesInputSchema>;
export type AccountListZonesOutput = z.infer<typeof AccountListZonesOutputSchema>;
