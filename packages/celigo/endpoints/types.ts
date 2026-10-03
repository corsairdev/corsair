import { z } from 'zod';

const FlowIdSchema = z
	.string()
	.min(1)
	.refine((id) => !/[/?#]/.test(id) && !/^\.{1,2}$/.test(id), {
		message:
			'id must be a single URL path segment without delimiters or dot segments',
	});

const GetFlowInputSchema = z.object({
	id: FlowIdSchema,
});

export type GetFlowInput = z.infer<typeof GetFlowInputSchema>;

const GetFlowResponseSchema = z.object({
	_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	type: z.string().optional(),
	active: z.boolean().optional(),
});

export type GetFlowResponse = z.infer<typeof GetFlowResponseSchema>;

export type CeligoEndpointInputs = {
	getFlow: GetFlowInput;
};

export type CeligoEndpointOutputs = {
	getFlow: GetFlowResponse;
};

export const CeligoEndpointInputSchemas = {
	getFlow: GetFlowInputSchema,
} as const;

export const CeligoEndpointOutputSchemas = {
	getFlow: GetFlowResponseSchema,
} as const;
