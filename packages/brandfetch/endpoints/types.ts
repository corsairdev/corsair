import { z } from 'zod';

const GetBrandInfoInputSchema = z.object({
	domain: z.string().min(1),
});

export type GetBrandInfoInput = z.infer<typeof GetBrandInfoInputSchema>;

const GetBrandInfoResponseSchema = z.object({
	id: z.string(),
	name: z.string().nullable(),
	domain: z.string(),
	claimed: z.boolean(),
	description: z.string().nullable(),
	longDescription: z.string().nullable(),
	links: z.array(z.unknown()),
	logos: z.array(z.unknown()),
	colors: z.array(z.unknown()),
	fonts: z.array(z.unknown()),
	images: z.array(z.unknown()),
	qualityScore: z.number(),
	company: z.unknown(),
	isNsfw: z.boolean(),
	urn: z.string(),
});

export type GetBrandInfoResponse = z.infer<typeof GetBrandInfoResponseSchema>;

export type BrandfetchEndpointInputs = {
	getBrandInfo: GetBrandInfoInput;
};

export type BrandfetchEndpointOutputs = {
	getBrandInfo: GetBrandInfoResponse;
};

export const BrandfetchEndpointInputSchemas = {
	getBrandInfo: GetBrandInfoInputSchema,
} as const;

export const BrandfetchEndpointOutputSchemas = {
	getBrandInfo: GetBrandInfoResponseSchema,
} as const;
