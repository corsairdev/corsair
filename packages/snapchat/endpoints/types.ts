import { z } from 'zod';

const SnapchatDataInputSchema = z.object({
	search: z.string().optional(),
});

export type SnapchatDataInput = z.infer<typeof SnapchatDataInputSchema>;

const SnapchatDataResponseSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			timestamp: z.string().optional(),
			text: z.string().optional(),
			source: z.string().optional(),
		}),
	),
});

export type SnapchatDataResponse = z.infer<typeof SnapchatDataResponseSchema>;

export type SnapchatEndpointInputs = {
	getPublicData: SnapchatDataInput;
};

export type SnapchatEndpointOutputs = {
	getPublicData: SnapchatDataResponse;
};

export const SnapchatEndpointInputSchemas = {
	getPublicData: SnapchatDataInputSchema,
} as const;

export const SnapchatEndpointOutputSchemas = {
	getPublicData: SnapchatDataResponseSchema,
} as const;