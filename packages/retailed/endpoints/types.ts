import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*                                   Usage                                    */
/* -------------------------------------------------------------------------- */

const GetUsageInputSchema = z.object({});

const GetUsageResponseSchema = z.object({
	plan: z.string(),
	remaining: z.string(),
});

export type GetUsageInput = z.infer<typeof GetUsageInputSchema>;
export type GetUsageResponse = z.infer<typeof GetUsageResponseSchema>;

export type RetailedEndpointInputs = {
	getUsage: GetUsageInput;
};

export type RetailedEndpointOutputs = {
	getUsage: GetUsageResponse;
};

export const RetailedEndpointInputSchemas = {
	getUsage: GetUsageInputSchema,
} as const;

export const RetailedEndpointOutputSchemas = {
	getUsage: GetUsageResponseSchema,
} as const;
