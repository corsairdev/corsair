import { z } from 'zod';

// ── Symbols Schemas ──────────────────────────────────────────────────────────

export const SymbolsListInputSchema = z.object({});
export type SymbolsListInput = z.infer<typeof SymbolsListInputSchema>;

export const SymbolsListResponseSchema = z.object({
	success: z.boolean(),
	symbols: z.record(z.string(), z.string()),
});
export type SymbolsListResponse = z.infer<typeof SymbolsListResponseSchema>;

// ── Rates Schemas ────────────────────────────────────────────────────────────

export const RatesLatestInputSchema = z.object({
	base: z.string().optional(),
	symbols: z.string().optional(),
});
export type RatesLatestInput = z.infer<typeof RatesLatestInputSchema>;

export const RatesLatestResponseSchema = z.object({
	success: z.boolean(),
	timestamp: z.number().optional(),
	base: z.string(),
	date: z.string(),
	rates: z.record(z.string(), z.number()),
});
export type RatesLatestResponse = z.infer<typeof RatesLatestResponseSchema>;

export const RatesHistoricalInputSchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
	base: z.string().optional(),
	symbols: z.string().optional(),
});
export type RatesHistoricalInput = z.infer<typeof RatesHistoricalInputSchema>;

export const RatesHistoricalResponseSchema = z.object({
	success: z.boolean(),
	historical: z.boolean().optional(),
	date: z.string(),
	timestamp: z.number().optional(),
	base: z.string(),
	rates: z.record(z.string(), z.number()),
});
export type RatesHistoricalResponse = z.infer<
	typeof RatesHistoricalResponseSchema
>;

export const RatesConvertInputSchema = z.object({
	from: z.string(),
	to: z.string(),
	amount: z.number().positive(),
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
		.optional(),
});
export type RatesConvertInput = z.infer<typeof RatesConvertInputSchema>;

export const RatesConvertResponseSchema = z.object({
	success: z.boolean(),
	query: z.object({
		from: z.string(),
		to: z.string(),
		amount: z.number(),
	}),
	info: z.object({
		timestamp: z.number().optional(),
		rate: z.number(),
	}),
	historical: z.union([z.boolean(), z.string()]).optional(),
	date: z.string().optional(),
	result: z.number(),
});
export type RatesConvertResponse = z.infer<typeof RatesConvertResponseSchema>;

export const RatesTimeseriesInputSchema = z.object({
	start_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
	end_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
	base: z.string().optional(),
	symbols: z.string().optional(),
});
export type RatesTimeseriesInput = z.infer<typeof RatesTimeseriesInputSchema>;

export const RatesTimeseriesResponseSchema = z.object({
	success: z.boolean(),
	timeseries: z.boolean().optional(),
	start_date: z.string(),
	end_date: z.string(),
	base: z.string(),
	rates: z.record(z.string(), z.record(z.string(), z.number())),
});
export type RatesTimeseriesResponse = z.infer<
	typeof RatesTimeseriesResponseSchema
>;

export const RatesFluctuationInputSchema = z.object({
	start_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
	end_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
	base: z.string().optional(),
	symbols: z.string().optional(),
});
export type RatesFluctuationInput = z.infer<typeof RatesFluctuationInputSchema>;

export const RatesFluctuationResponseSchema = z.object({
	success: z.boolean(),
	fluctuation: z.boolean().optional(),
	start_date: z.string(),
	end_date: z.string(),
	base: z.string(),
	rates: z.record(
		z.string(),
		z.object({
			start_rate: z.number(),
			end_rate: z.number(),
			change: z.number(),
			change_pct: z.number(),
		}),
	),
});
export type RatesFluctuationResponse = z.infer<
	typeof RatesFluctuationResponseSchema
>;

// ── Plugin Mapping Types ──────────────────────────────────────────────────────

export type FixerEndpointInputs = {
	symbolsList: SymbolsListInput;
	ratesLatest: RatesLatestInput;
	ratesHistorical: RatesHistoricalInput;
	ratesConvert: RatesConvertInput;
	ratesTimeseries: RatesTimeseriesInput;
	ratesFluctuation: RatesFluctuationInput;
};

export type FixerEndpointOutputs = {
	symbolsList: SymbolsListResponse;
	ratesLatest: RatesLatestResponse;
	ratesHistorical: RatesHistoricalResponse;
	ratesConvert: RatesConvertResponse;
	ratesTimeseries: RatesTimeseriesResponse;
	ratesFluctuation: RatesFluctuationResponse;
};

export const FixerEndpointInputSchemas = {
	symbolsList: SymbolsListInputSchema,
	ratesLatest: RatesLatestInputSchema,
	ratesHistorical: RatesHistoricalInputSchema,
	ratesConvert: RatesConvertInputSchema,
	ratesTimeseries: RatesTimeseriesInputSchema,
	ratesFluctuation: RatesFluctuationInputSchema,
} as const;

export const FixerEndpointOutputSchemas = {
	symbolsList: SymbolsListResponseSchema,
	ratesLatest: RatesLatestResponseSchema,
	ratesHistorical: RatesHistoricalResponseSchema,
	ratesConvert: RatesConvertResponseSchema,
	ratesTimeseries: RatesTimeseriesResponseSchema,
	ratesFluctuation: RatesFluctuationResponseSchema,
} as const;
