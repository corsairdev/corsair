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

export type ViewerResponse = z.infer<typeof ViewerResponseSchema>;
export type SearchInput = z.input<typeof SearchInputSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type GraphqlInput = z.input<typeof GraphqlInputSchema>;
export type GraphqlResponse = z.infer<typeof GraphqlResponseSchema>;

export type CodyEndpointInputs = {
	viewer: z.infer<typeof EmptyInputSchema>;
	search: SearchInput;
	graphql: GraphqlInput;
};

export type CodyEndpointOutputs = {
	viewer: ViewerResponse;
	search: SearchResponse;
	graphql: GraphqlResponse;
};

export const CodyEndpointInputSchemas = {
	viewer: EmptyInputSchema,
	search: SearchInputSchema,
	graphql: GraphqlInputSchema,
} as const;

export const CodyEndpointOutputSchemas = {
	viewer: ViewerResponseSchema,
	search: SearchResponseSchema,
	graphql: GraphqlResponseSchema,
} as const;
