import { z } from 'zod';

// --- rates.latest ---
export const RatesLatestInputSchema = z.object({
	base: z.string().optional(),
	symbols: z.array(z.string()).optional(),
});
export type RatesLatestInput = z.infer<typeof RatesLatestInputSchema>;

export const RatesLatestOutputSchema = z.object({
	success: z.boolean(),
	timestamp: z.number().optional(),
	base: z.string().optional(),
	date: z.string().optional(),
	rates: z.record(z.string(), z.number()),
});
export type RatesLatestOutput = z.infer<typeof RatesLatestOutputSchema>;

// --- rates.convert ---
export const RatesConvertInputSchema = z.object({
	from: z.string(),
	to: z.string(),
	amount: z.number(),
	date: z.string().optional(),
});
export type RatesConvertInput = z.infer<typeof RatesConvertInputSchema>;

export const RatesConvertOutputSchema = z.object({
	success: z.boolean(),
	query: z
		.object({
			from: z.string(),
			to: z.string(),
			amount: z.number(),
		})
		.optional(),
	info: z
		.object({
			timestamp: z.number().optional(),
			rate: z.number(),
		})
		.optional(),
	date: z.string().optional(),
	result: z.number(),
});
export type RatesConvertOutput = z.infer<typeof RatesConvertOutputSchema>;

// --- rates.historical ---
export const RatesHistoricalInputSchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
	base: z.string().optional(),
	symbols: z.array(z.string()).optional(),
});
export type RatesHistoricalInput = z.infer<typeof RatesHistoricalInputSchema>;

export const RatesHistoricalOutputSchema = z.object({
	success: z.boolean(),
	historical: z.boolean().optional(),
	date: z.string().optional(),
	base: z.string().optional(),
	rates: z.record(z.string(), z.number()),
});
export type RatesHistoricalOutput = z.infer<typeof RatesHistoricalOutputSchema>;

// --- currencies.getAll ---
export const CurrenciesGetAllInputSchema = z.object({});
export type CurrenciesGetAllInput = z.infer<typeof CurrenciesGetAllInputSchema>;

export const CurrenciesGetAllOutputSchema = z.object({
	success: z.boolean(),
	symbols: z.record(z.string(), z.string()),
});
export type CurrenciesGetAllOutput = z.infer<
	typeof CurrenciesGetAllOutputSchema
>;

export const FixerEndpointInputSchemas = {
	ratesLatest: RatesLatestInputSchema,
	ratesConvert: RatesConvertInputSchema,
	ratesHistorical: RatesHistoricalInputSchema,
	currenciesGetAll: CurrenciesGetAllInputSchema,
} as const;

export const FixerEndpointOutputSchemas = {
	ratesLatest: RatesLatestOutputSchema,
	ratesConvert: RatesConvertOutputSchema,
	ratesHistorical: RatesHistoricalOutputSchema,
	currenciesGetAll: CurrenciesGetAllOutputSchema,
} as const;

export type FixerEndpointInputs = {
	[K in keyof typeof FixerEndpointInputSchemas]: z.infer<
		(typeof FixerEndpointInputSchemas)[K]
	>;
};

export type FixerEndpointOutputs = {
	[K in keyof typeof FixerEndpointOutputSchemas]: z.infer<
		(typeof FixerEndpointOutputSchemas)[K]
	>;
};
