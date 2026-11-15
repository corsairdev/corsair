import { z } from 'zod';

export const ListDevicesInputSchema = z.object({
	fields: z
		.string()
		.min(1)
		.optional()
		.describe('Comma-separated pod fields to return.'),
});

export const ListDevicesResponseSchema = z
	.object({
		status: z.string(),
		result: z.array(z.object({}).passthrough()),
	})
	.passthrough();

export type ListDevicesInput = z.infer<typeof ListDevicesInputSchema>;
export type ListDevicesResponse = z.infer<typeof ListDevicesResponseSchema>;

export const SensiboEndpointInputSchemas = {
	listDevices: ListDevicesInputSchema,
} as const;

export const SensiboEndpointOutputSchemas = {
	listDevices: ListDevicesResponseSchema,
} as const;
