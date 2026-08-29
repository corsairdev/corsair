import { z } from 'zod';

const CdrItemSchema = z.object({
	method_type: z.string().min(1),
	cdr_amount: z.number().positive(),
});

const PriceInputSchema = z.object({
	weight_unit: z.string().min(1),
	currency: z.string().min(1),
	items: z.array(CdrItemSchema).min(1),
});

const PriceResponseSchema = z.record(z.string(), z.unknown());

const PurchaseInputSchema = PriceInputSchema.extend({
	client_reference_id: z.string().optional(),
	certificate_display_name: z.string().optional(),
});

const PurchaseResponseSchema = z.object({
	transaction_uuid: z.string(),
});

export type CdrItem = z.infer<typeof CdrItemSchema>;

export type PriceInput = z.infer<typeof PriceInputSchema>;
export type PriceResponse = z.infer<typeof PriceResponseSchema>;

export type PurchaseInput = z.infer<typeof PurchaseInputSchema>;
export type PurchaseResponse = z.infer<typeof PurchaseResponseSchema>;

export type CdrPlatformEndpointInputs = {
	price: PriceInput;
	purchase: PurchaseInput;
};

export type CdrPlatformEndpointOutputs = {
	price: PriceResponse;
	purchase: PurchaseResponse;
};

export const CdrPlatformEndpointInputSchemas = {
	price: PriceInputSchema,
	purchase: PurchaseInputSchema,
} as const;

export const CdrPlatformEndpointOutputSchemas = {
	price: PriceResponseSchema,
	purchase: PurchaseResponseSchema,
} as const;
