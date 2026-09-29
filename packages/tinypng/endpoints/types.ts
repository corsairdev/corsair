import { z } from 'zod';

const CompressInputSchema = z.object({
	url: z.string().url(),
});

export type CompressInput = z.infer<typeof CompressInputSchema>;

const CompressResponseSchema = z.object({
	originalUrl: z.string().url(),
	optimizedUrl: z.string().url(),
});

export type CompressResponse = z.infer<typeof CompressResponseSchema>;

export type TinypngEndpointInputs = {
	compress: CompressInput;
};

export type TinypngEndpointOutputs = {
	compress: CompressResponse;
};

export const TinypngEndpointInputSchemas = {
	compress: CompressInputSchema,
} as const;

export const TinypngEndpointOutputSchemas = {
	compress: CompressResponseSchema,
} as const;
