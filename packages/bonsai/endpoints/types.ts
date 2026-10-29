import { z } from 'zod';

const ClustersGetInputSchema = z.object({
	slug: z.string().min(1),
});

export type ClustersGetInput = z.infer<typeof ClustersGetInputSchema>;

const ClustersGetResponseSchema = z.object({
	cluster: z.object({
		slug: z.string(),
		name: z.string(),
		uri: z.string(),
		plan: z.object({
			slug: z.string(),
			uri: z.string(),
		}),
		release: z.object({
			version: z.string(),
			slug: z.string(),
			package_name: z.string(),
			service_type: z.string(),
			uri: z.string(),
		}),
		space: z.object({
			path: z.string(),
			region: z.string(),
			uri: z.string(),
		}),
		stats: z.object({
			docs: z.number(),
			shards_used: z.number(),
			data_bytes_used: z.number(),
		}),
		access: z.object({
			host: z.string(),
			port: z.number(),
			scheme: z.string(),
		}),
		state: z.string(),
	}),
});

export type ClustersGetResponse = z.infer<typeof ClustersGetResponseSchema>;

const SpacesListInputSchema = z.object({});

export type SpacesListInput = z.infer<typeof SpacesListInputSchema>;

const SpacesListResponseSchema = z.object({
	spaces: z.array(
		z.object({
			path: z.string(),
			private_network: z.boolean(),
			cloud: z.object({
				provider: z.string(),
				region: z.string(),
			}),
		}),
	),
});

export type SpacesListResponse = z.infer<typeof SpacesListResponseSchema>;

const SpacesGetInputSchema = z.object({
	path: z.string().min(1),
});

export type SpacesGetInput = z.infer<typeof SpacesGetInputSchema>;

const SpacesGetResponseSchema = z.object({
	path: z.string(),
	private_network: z.boolean(),
	cloud: z.object({
		provider: z.string(),
		region: z.string(),
	}),
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
