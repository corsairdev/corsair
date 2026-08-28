import { z } from 'zod';

const SearchInputSchema = z.object({
	q: z.string(),
});

export type SearchInput = z.infer<typeof SearchInputSchema>;

const SearchResponseSchema = z.object({
	results: z.array(
		z.object({
			type: z.string(),
			data: z.unknown(),
		}),
	),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export type SourcegraphEndpointInputs = {
	search: SearchInput;
};

export type SourcegraphEndpointOutputs = {
	search: SearchResponse;
};

export const SourcegraphEndpointInputSchemas = {
	search: SearchInputSchema,
} as const;

export const SourcegraphEndpointOutputSchemas = {
	search: SearchResponseSchema,
} as const;
