import { z } from 'zod';
import { SNAPCHAT_OPERATIONS } from '../operations';

const GenericInputSchema = z.record(z.string(), z.unknown());
const GenericOutputSchema = z
	.object({
		successful: z.boolean().optional(),
		data: z.unknown().optional(),
		error: z.unknown().optional(),
		log_id: z.string().optional(),
		status: z.string().optional(),
		request_id: z.string().optional(),
	})
	.loose();

const inputEntries = SNAPCHAT_OPERATIONS.map((operation) => [
	operation.name,
	GenericInputSchema,
]);

const outputEntries = SNAPCHAT_OPERATIONS.map((operation) => [
	operation.name,
	GenericOutputSchema,
]);

export const SnapchatEndpointInputSchemas = Object.fromEntries(
	inputEntries,
) as {
	[K in (typeof SNAPCHAT_OPERATIONS)[number]['name']]: typeof GenericInputSchema;
};

export const SnapchatEndpointOutputSchemas = Object.fromEntries(
	outputEntries,
) as {
	[K in (typeof SNAPCHAT_OPERATIONS)[number]['name']]: typeof GenericOutputSchema;
};

export type SnapchatEndpointInputs = {
	[K in keyof typeof SnapchatEndpointInputSchemas]: z.input<
		(typeof SnapchatEndpointInputSchemas)[K]
	>;
};

export type SnapchatEndpointOutputs = {
	[K in keyof typeof SnapchatEndpointOutputSchemas]: z.infer<
		(typeof SnapchatEndpointOutputSchemas)[K]
	>;
};
