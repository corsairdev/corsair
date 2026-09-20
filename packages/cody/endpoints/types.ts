import { z } from 'zod';

const ViewerResponseSchema = z
	.object({
		data: z
			.object({
				currentUser: z
					.object({
						username: z.string(),
						displayName: z.string().nullable().optional(),
						siteAdmin: z.boolean().optional(),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	.passthrough();

const SearchInputSchema = z.object({
	query: z.string().min(1),
});

const SearchResponseSchema = z
	.object({
		data: z
			.object({
				search: z
					.object({
						results: z
							.object({
								matchCount: z.number(),
							})
							.passthrough(),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	.passthrough();

const GraphqlInputSchema = z.object({
	query: z.string().min(1),
	variables: z.record(z.string(), z.unknown()).optional(),
});

const GraphqlResponseSchema = z
	.object({
		data: z.record(z.string(), z.unknown()).optional(),
		errors: z.array(z.object({ message: z.string() }).passthrough()).optional(),
	})
	.passthrough();

const EmptyInputSchema = z.object({});

const CompletionMessageSchema = z.object({
	speaker: z.string().min(1),
	text: z.string(),
});

const CompletionsInputSchema = z.object({
	messages: z.array(CompletionMessageSchema).min(1),
	model: z.string().optional(),
	maxTokensToSample: z.number().int().positive().optional(),
	temperature: z.number().optional(),
	stopSequences: z.array(z.string()).optional(),
	timeoutMs: z.number().int().positive().optional(),
	stream: z.boolean().optional(),
	apiVersion: z.string().optional(),
	clientName: z.string().optional(),
	clientVersion: z.string().optional(),
});

const CompletionsResponseSchema = z
	.object({
		completion: z.string().optional(),
		deltaText: z.string().optional(),
		stopReason: z.string().optional(),
	})
	.passthrough();

const ModelsResponseSchema = z.unknown();
const ClientConfigResponseSchema = z.unknown();

export type ViewerResponse = z.infer<typeof ViewerResponseSchema>;
export type SearchInput = z.input<typeof SearchInputSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type GraphqlInput = z.input<typeof GraphqlInputSchema>;
export type GraphqlResponse = z.infer<typeof GraphqlResponseSchema>;
export type CompletionsInput = z.input<typeof CompletionsInputSchema>;
export type CompletionsResponse = z.infer<typeof CompletionsResponseSchema>;

export type CodyEndpointInputs = {
	viewer: z.infer<typeof EmptyInputSchema>;
	search: SearchInput;
	graphql: GraphqlInput;
	completionsCode: CompletionsInput;
	completionsStream: CompletionsInput;
	listModels: z.infer<typeof EmptyInputSchema>;
	getClientConfig: z.infer<typeof EmptyInputSchema>;
};

export type CodyEndpointOutputs = {
	viewer: ViewerResponse;
	search: SearchResponse;
	graphql: GraphqlResponse;
	completionsCode: CompletionsResponse;
	completionsStream: CompletionsResponse;
	listModels: unknown;
	getClientConfig: unknown;
};

export const CodyEndpointInputSchemas = {
	viewer: EmptyInputSchema,
	search: SearchInputSchema,
	graphql: GraphqlInputSchema,
	completionsCode: CompletionsInputSchema,
	completionsStream: CompletionsInputSchema,
	listModels: EmptyInputSchema,
	getClientConfig: EmptyInputSchema,
} as const;

export const CodyEndpointOutputSchemas = {
	viewer: ViewerResponseSchema,
	search: SearchResponseSchema,
	graphql: GraphqlResponseSchema,
	completionsCode: CompletionsResponseSchema,
	completionsStream: CompletionsResponseSchema,
	listModels: ModelsResponseSchema,
	getClientConfig: ClientConfigResponseSchema,
} as const;
