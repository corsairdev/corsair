import { z } from 'zod';

const CdrItemSchema = z.object({
	method_type: z.string().min(1),
	cdr_amount: z.number().positive(),
});

const CurrencySchema = z.enum(['usd', 'eur', 'gbp', 'chf']);
const WeightUnitSchema = z.enum(['g', 'kg', 't']);

const PriceInputSchema = z.object({
	weight_unit: WeightUnitSchema,
	currency: CurrencySchema,
	items: z.array(CdrItemSchema).min(1),
});

const PricedCdrItemSchema = CdrItemSchema.extend({
	cost: z.number().int().nonnegative(),
});

const PriceResponseSchema = z.object({
	cost: z.object({
		items: z.array(PricedCdrItemSchema),
		removal: z.number().int().nonnegative(),
		variable_fees: z.number().int().nonnegative(),
		total: z.number().int().nonnegative(),
	}),
	currency: CurrencySchema,
	weight_unit: WeightUnitSchema,
});

const PurchaseInputSchema = PriceInputSchema.extend({
	client_reference_id: z.string().optional(),
	certificate_display_name: z.string().optional(),
});

const PurchaseResponseSchema = z.object({
	transaction_uuid: z.string(),
});

const CertificateGetInputSchema = z.object({
	id: z.string().min(1),
});

const CertificateGetResponseSchema = z.object({
	certificate_id: z.string().min(1),
	display_name: z.string().min(1),
	issued_date: z.string().min(1),
	removal_amount_kg: z.number().int().nonnegative(),
});

const HealthCheckInputSchema = z.object({}).strict();

const HealthCheckResponseSchema = z.object({
	db_up: z.record(z.string(), z.boolean()),
});

export type CdrItem = z.infer<typeof CdrItemSchema>;

export type PriceInput = z.infer<typeof PriceInputSchema>;
export type PriceResponse = z.infer<typeof PriceResponseSchema>;

export type PurchaseInput = z.infer<typeof PurchaseInputSchema>;
export type PurchaseResponse = z.infer<typeof PurchaseResponseSchema>;

export type CertificateGetInput = z.infer<typeof CertificateGetInputSchema>;
export type CertificateGetResponse = z.infer<
	typeof CertificateGetResponseSchema
>;

export type HealthCheckInput = z.infer<typeof HealthCheckInputSchema>;
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

export type CdrPlatformEndpointInputs = {
	price: PriceInput;
	purchase: PurchaseInput;
	certificateGet: CertificateGetInput;
	healthCheck: HealthCheckInput;
};

export type CdrPlatformEndpointOutputs = {
	price: PriceResponse;
	purchase: PurchaseResponse;
	certificateGet: CertificateGetResponse;
	healthCheck: HealthCheckResponse;
};

export const CdrPlatformEndpointInputSchemas = {
	price: PriceInputSchema,
	purchase: PurchaseInputSchema,
	certificateGet: CertificateGetInputSchema,
	healthCheck: HealthCheckInputSchema,
} as const;

export const CdrPlatformEndpointOutputSchemas = {
	price: PriceResponseSchema,
	purchase: PurchaseResponseSchema,
	certificateGet: CertificateGetResponseSchema,
	healthCheck: HealthCheckResponseSchema,
} as const;
