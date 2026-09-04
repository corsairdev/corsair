import { z } from 'zod';

const InitializePaymentInputSchema = z.object({
	tx_ref: z.string().min(1),
	amount: z.number().positive(),
	currency: z.string().default('NGN'),
	redirect_url: z.string().url(),

	customer: z.object({
		email: z.string().email(),
		name: z.string().optional(),
		phonenumber: z.string().optional(),
	}),

	customizations: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
			logo: z.string().url().optional(),
		})
		.optional(),
});

export type InitializePaymentInput = z.infer<
	typeof InitializePaymentInputSchema
>;

const InitializePaymentResponseSchema = z.object({
	status: z.string(),
	message: z.string(),

	data: z
		.object({
			link: z.string().url().optional(),
		})
		.passthrough()
		.optional(),
});

export type InitializePaymentResponse = z.infer<
	typeof InitializePaymentResponseSchema
>;

export type FlutterwaveEndpointInputs = {
	initializePayment: InitializePaymentInput;
};

export type FlutterwaveEndpointOutputs = {
	initializePayment: InitializePaymentResponse;
};

export const FlutterwaveEndpointInputSchemas = {
	initializePayment: InitializePaymentInputSchema,
} as const;

export const FlutterwaveEndpointOutputSchemas = {
	initializePayment: InitializePaymentResponseSchema,
} as const;
