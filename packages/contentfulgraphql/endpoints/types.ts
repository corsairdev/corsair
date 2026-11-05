import { z } from 'zod';

const GraphQlDataSchema = z.record(z.string(), z.unknown());
const GraphQlVariablesSchema = z.record(z.string(), z.unknown());

// ─────────────────────────────────────────────────────────────────────────────
// Get CMA token
// ─────────────────────────────────────────────────────────────────────────────

export const GetCmaTokenInputSchema = z.object({});

export type GetCmaTokenInput = z.infer<typeof GetCmaTokenInputSchema>;

export const GetCmaTokenResponseSchema = z.object({
	space_id: z.string(),
	environment_id: z.string().optional(),
});

export type GetCmaTokenResponse = z.infer<typeof GetCmaTokenResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// GraphQL Content API — query
// ─────────────────────────────────────────────────────────────────────────────

export const GraphQlContentApiQueryInputSchema = z.object({
	query: z.string().min(1),
	variables: GraphQlVariablesSchema.optional(),
	operationName: z.string().min(1).optional(),
});

export type GraphQlContentApiQueryInput = z.infer<
	typeof GraphQlContentApiQueryInputSchema
>;

export const GraphQlContentApiQueryResponseSchema = z.object({
	data: GraphQlDataSchema,
});

export type GraphQlContentApiQueryResponse = z.infer<
	typeof GraphQlContentApiQueryResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// GraphQL Content API — automatic persisted query
// ─────────────────────────────────────────────────────────────────────────────

export const GraphQlContentApiPersistedQueryInputSchema = z
	.object({
		query: z.string().min(1).optional(),
		sha256Hash: z.string().min(1).optional(),
		variables: GraphQlVariablesSchema.optional(),
		operationName: z.string().min(1).optional(),
	})
	.refine(
		(value) => value.query !== undefined || value.sha256Hash !== undefined,
		{
			message: 'Provide query or sha256Hash',
		},
	);

export type GraphQlContentApiPersistedQueryInput = z.infer<
	typeof GraphQlContentApiPersistedQueryInputSchema
>;

export const GraphQlContentApiPersistedQueryResponseSchema = z.object({
	data: GraphQlDataSchema,
});

export type GraphQlContentApiPersistedQueryResponse = z.infer<
	typeof GraphQlContentApiPersistedQueryResponseSchema
>;

export type ContentfulGraphqlEndpointInputs = {
	getCmaToken: GetCmaTokenInput;
	graphQlContentApiQuery: GraphQlContentApiQueryInput;
	graphQlContentApiPersistedQuery: GraphQlContentApiPersistedQueryInput;
};

export type ContentfulGraphqlEndpointOutputs = {
	getCmaToken: GetCmaTokenResponse;
	graphQlContentApiQuery: GraphQlContentApiQueryResponse;
	graphQlContentApiPersistedQuery: GraphQlContentApiPersistedQueryResponse;
};

export const ContentfulGraphqlEndpointInputSchemas = {
	getCmaToken: GetCmaTokenInputSchema,
	graphQlContentApiQuery: GraphQlContentApiQueryInputSchema,
	graphQlContentApiPersistedQuery: GraphQlContentApiPersistedQueryInputSchema,
} as const;

export const ContentfulGraphqlEndpointOutputSchemas = {
	getCmaToken: GetCmaTokenResponseSchema,
	graphQlContentApiQuery: GraphQlContentApiQueryResponseSchema,
	graphQlContentApiPersistedQuery:
		GraphQlContentApiPersistedQueryResponseSchema,
} as const;
