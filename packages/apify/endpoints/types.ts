import { z } from 'zod';

const ActorOutputFlagsSchema = z
	.object({
		inputSchema: z.boolean().optional(),
		outputSchema: z.boolean().optional(),
		description: z.boolean().optional(),
		readme: z.boolean().optional(),
		pricing: z.boolean().optional(),
		mcpTools: z.boolean().optional(),
	})
	.optional();

export const SearchActorsInputSchema = z.object({
	search: z.string().min(1).describe('Search query for Apify Store Actors'),
	limit: z.number().int().positive().max(50).optional(),
	offset: z.number().int().nonnegative().optional(),
});

export const FetchActorDetailsInputSchema = z.object({
	actor: z.string().min(1).describe('Actor ID or full name (username/name)'),
	output: ActorOutputFlagsSchema,
});

export const CallActorInputSchema = z.object({
	actor: z.string().min(1).describe('Actor ID or full name (username/name)'),
	// Actor input schemas differ per Actor; values stay unknown until Actor-specific validation.
	input: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Actor input object matching the Actor input schema'),
	build: z.string().optional(),
	timeout: z.number().int().positive().optional(),
	memory: z.number().int().positive().optional(),
});

export const RagWebBrowserInputSchema = z.object({
	query: z
		.string()
		.min(1)
		.describe('Search query for the RAG Web Browser Actor'),
	maxResults: z.number().int().positive().max(20).optional(),
});

export const GetActorRunInputSchema = z.object({
	runId: z.string().min(1).describe('Actor run ID'),
});

export const GetActorOutputInputSchema = z.object({
	datasetId: z
		.string()
		.min(1)
		.describe('Dataset ID from an Actor run (storages.datasets.default.id)'),
	limit: z.number().int().positive().max(1000).optional(),
	offset: z.number().int().nonnegative().optional(),
	fields: z.string().optional(),
});

export const SearchApifyDocsInputSchema = z.object({
	query: z.string().min(1).describe('Documentation search query'),
	docSource: z
		.enum(['apify', 'crawlee-js', 'crawlee-py'])
		.optional()
		.describe('Documentation source to search'),
});

const APIFY_DOCS_HOSTS = new Set(['docs.apify.com', 'crawlee.dev']);

export const FetchApifyDocsInputSchema = z.object({
	url: z
		.string()
		.url()
		.refine(
			(value) => {
				try {
					const parsed = new URL(value);
					return (
						parsed.protocol === 'https:' &&
						APIFY_DOCS_HOSTS.has(parsed.hostname)
					);
				} catch {
					return false;
				}
			},
			{
				message:
					'Only https://docs.apify.com and https://crawlee.dev documentation URLs are allowed',
			},
		)
		.describe('Full Apify or Crawlee documentation page URL'),
});

// MCP tool responses vary by tool and Actor; validated at runtime via shared unknown schemas.
const McpToolResponseSchema = z.unknown();

export type SearchActorsInput = z.infer<typeof SearchActorsInputSchema>;
export type FetchActorDetailsInput = z.infer<
	typeof FetchActorDetailsInputSchema
>;
export type CallActorInput = z.infer<typeof CallActorInputSchema>;
export type RagWebBrowserInput = z.infer<typeof RagWebBrowserInputSchema>;
export type GetActorRunInput = z.infer<typeof GetActorRunInputSchema>;
export type GetActorOutputInput = z.infer<typeof GetActorOutputInputSchema>;
export type SearchApifyDocsInput = z.infer<typeof SearchApifyDocsInputSchema>;
export type FetchApifyDocsInput = z.infer<typeof FetchApifyDocsInputSchema>;

export type McpToolResponse = z.infer<typeof McpToolResponseSchema>;

export type ApifyMcpEndpointInputs = {
	searchActors: SearchActorsInput;
	fetchActorDetails: FetchActorDetailsInput;
	callActor: CallActorInput;
	ragWebBrowser: RagWebBrowserInput;
	getActorRun: GetActorRunInput;
	getActorOutput: GetActorOutputInput;
	searchApifyDocs: SearchApifyDocsInput;
	fetchApifyDocs: FetchApifyDocsInput;
};

export type ApifyMcpEndpointOutputs = {
	searchActors: McpToolResponse;
	fetchActorDetails: McpToolResponse;
	callActor: McpToolResponse;
	ragWebBrowser: McpToolResponse;
	getActorRun: McpToolResponse;
	getActorOutput: McpToolResponse;
	searchApifyDocs: McpToolResponse;
	fetchApifyDocs: McpToolResponse;
};

export const ApifyMcpEndpointInputSchemas = {
	searchActors: SearchActorsInputSchema,
	fetchActorDetails: FetchActorDetailsInputSchema,
	callActor: CallActorInputSchema,
	ragWebBrowser: RagWebBrowserInputSchema,
	getActorRun: GetActorRunInputSchema,
	getActorOutput: GetActorOutputInputSchema,
	searchApifyDocs: SearchApifyDocsInputSchema,
	fetchApifyDocs: FetchApifyDocsInputSchema,
} as const;

export const ApifyMcpEndpointOutputSchemas = {
	searchActors: McpToolResponseSchema,
	fetchActorDetails: McpToolResponseSchema,
	callActor: McpToolResponseSchema,
	ragWebBrowser: McpToolResponseSchema,
	getActorRun: McpToolResponseSchema,
	getActorOutput: McpToolResponseSchema,
	searchApifyDocs: McpToolResponseSchema,
	fetchApifyDocs: McpToolResponseSchema,
} as const;
