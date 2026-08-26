import { z } from 'zod';

// Get Bonsai Cluster Details — GET /clusters/:slug
const ClustersGetInputSchema = z.object({
	slug: z.string(),
});

export type ClustersGetInput = z.infer<typeof ClustersGetInputSchema>;

const ClustersGetResponseSchema = z.object({
	slug: z.string(),
	name: z.string(),
	plan: z.string(),
	region: z.string(),
	status: z.string(),
	created_at: z.string(),
});

export type ClustersGetResponse = z.infer<typeof ClustersGetResponseSchema>;

// List Spaces — GET /spaces
const SpacesListInputSchema = z.object({});

export type SpacesListInput = z.infer<typeof SpacesListInputSchema>;

const SpacesListResponseSchema = z.object({
	spaces: z.array(
		z.object({
			path: z.string(),
			name: z.string(),
			description: z.string().optional(),
			created_at: z.string(),
		}),
	),
});

export type SpacesListResponse = z.infer<typeof SpacesListResponseSchema>;

// Retrieve Space Details — GET /spaces/:path
const SpacesGetInputSchema = z.object({
	path: z.string(),
});

export type SpacesGetInput = z.infer<typeof SpacesGetInputSchema>;

const SpacesGetResponseSchema = z.object({
	path: z.string(),
	name: z.string(),
	description: z.string().optional(),
	created_at: z.string(),
});

export type SpacesGetResponse = z.infer<typeof SpacesGetResponseSchema>;

export type BonsaiEndpointInputs = {
	clustersGet: ClustersGetInput;
	spacesList: SpacesListInput;
	spacesGet: SpacesGetInput;
};

export type BonsaiEndpointOutputs = {
	clustersGet: ClustersGetResponse;
	spacesList: SpacesListResponse;
	spacesGet: SpacesGetResponse;
};

export const BonsaiEndpointInputSchemas = {
	clustersGet: ClustersGetInputSchema,
	spacesList: SpacesListInputSchema,
	spacesGet: SpacesGetInputSchema,
} as const;

export const BonsaiEndpointOutputSchemas = {
	clustersGet: ClustersGetResponseSchema,
	spacesList: SpacesListResponseSchema,
	spacesGet: SpacesGetResponseSchema,
} as const;
