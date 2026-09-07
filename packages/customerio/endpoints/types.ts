import { z } from 'zod';

const GetCustomerAttributesInputSchema = z.object({
	customerId: z.string(),
	idType: z.enum(['id', 'email', 'phone', 'cio_id']).optional(),
});

export type GetCustomerAttributesInput = z.infer<
	typeof GetCustomerAttributesInputSchema
>;

const GetCustomerAttributesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);

export type GetCustomerAttributesResponse = z.infer<
	typeof GetCustomerAttributesResponseSchema
>;

export type CustomerioEndpointInputs = {
	getCustomerAttributes: GetCustomerAttributesInput;
};

export type CustomerioEndpointOutputs = {
	getCustomerAttributes: GetCustomerAttributesResponse;
};

export const CustomerioEndpointInputSchemas = {
	getCustomerAttributes: GetCustomerAttributesInputSchema,
} as const;

export const CustomerioEndpointOutputSchemas = {
	getCustomerAttributes: GetCustomerAttributesResponseSchema,
} as const;
