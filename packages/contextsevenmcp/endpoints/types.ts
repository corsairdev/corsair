import { z } from 'zod';

export const LibrarySearchInputSchema = z
	.object({
		libraryName: z.string().min(1).max(500),
		query: z.string().min(1).max(500),
		fast: z.enum(['true', 'false']).optional(),
	})
	.loose();

export type LibrarySearchInput = z.infer<typeof LibrarySearchInputSchema>;

export const Context7LibrarySchema = z
	.object({
		id: z.string(),
		title: z.string().optional(),
		description: z.string().optional(),
		branch: z.string().optional(),
		lastUpdateDate: z.string().optional(),
		state: z.string().optional(),
		totalTokens: z.number().optional(),
		totalSnippets: z.number().optional(),
		stars: z.number().optional(),
		trustScore: z.number().optional(),
		benchmarkScore: z.number().optional(),
		versions: z.array(z.string()).optional(),
	})
	.loose();

export const LibrarySearchResponseSchema = z
	.object({
		results: z.array(Context7LibrarySchema),
		searchFilterApplied: z.boolean(),
	})
	.loose();

export type LibrarySearchResponse = z.infer<typeof LibrarySearchResponseSchema>;

export const ContextGetInputSchema = z
	.object({
		libraryId: z.string().min(1).max(500),
		query: z.string().min(1).max(500),
		type: z.enum(['json', 'txt']).optional(),
		fast: z.enum(['true', 'false']).optional(),
	})
	.loose();

export type ContextGetInput = z.infer<typeof ContextGetInputSchema>;

export const Context7CodeExampleSchema = z
	.object({
		language: z.string(),
		code: z.string(),
	})
	.loose();

export const Context7CodeSnippetSchema = z
	.object({
		codeTitle: z.string(),
		codeDescription: z.string(),
		codeLanguage: z.string(),
		codeTokens: z.number(),
		codeId: z.string(),
		pageTitle: z.string(),
		codeList: z.array(Context7CodeExampleSchema),
		isDynamic: z.boolean().optional(),
		sourceFile: z.string().optional(),
	})
	.loose();

export const Context7InfoSnippetSchema = z
	.object({
		pageId: z.string().optional(),
		breadcrumb: z.string().optional(),
		content: z.string(),
		contentTokens: z.number(),
	})
	.loose();

export const ContextGetResponseSchema = z
	.object({
		codeSnippets: z.array(Context7CodeSnippetSchema),
		infoSnippets: z.array(Context7InfoSnippetSchema),
		rules: z
			.object({
				global: z.array(z.string()).optional(),
				libraryOwn: z.array(z.string()).optional(),
				libraryTeam: z.array(z.string()).optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export type ContextGetResponse = z.infer<typeof ContextGetResponseSchema>;

export type ContextSevenMcpEndpointInputs = {
	librarySearch: LibrarySearchInput;
	contextGet: ContextGetInput;
};

export type ContextSevenMcpEndpointOutputs = {
	librarySearch: LibrarySearchResponse;
	contextGet: ContextGetResponse;
};

export const ContextSevenMcpEndpointInputSchemas = {
	librarySearch: LibrarySearchInputSchema,
	contextGet: ContextGetInputSchema,
} as const;

export const ContextSevenMcpEndpointOutputSchemas = {
	librarySearch: LibrarySearchResponseSchema,
	contextGet: ContextGetResponseSchema,
} as const;
