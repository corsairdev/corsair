import { z } from 'zod';

const CurrencyCodeSchema = z
	.string()
	.length(3)
	.describe('ISO 4217 currency code, e.g. USD');

const RatesRecordSchema = z
	.record(z.string(), z.number())
	.describe('Map of currency code to exchange rate against the base currency');

const ExchangeRatesResponseSchema = z.object({
	success: z.boolean(),
	timestamp: z
		.number()
		.describe('Unix timestamp of when the rates were collected'),
	historical: z
		.boolean()
		.optional()
		.describe(
			'True when the response is for a past date rather than the latest rates',
		),
	base: z.string().describe('Base currency the rates are quoted against'),
	date: z.string().describe('Date the rates apply to, YYYY-MM-DD'),
	rates: RatesRecordSchema,
});
export type ExchangeRatesResponse = z.infer<typeof ExchangeRatesResponseSchema>;

const GetLatestRatesInputSchema = z.object({
	base: CurrencyCodeSchema.optional().describe(
		'Base currency to convert rates from (paid plans only; free plan is fixed to EUR)',
	),
	symbols: z
		.array(CurrencyCodeSchema)
		.optional()
		.describe('Limit results to these currency codes'),
});
export type GetLatestRatesInput = z.infer<typeof GetLatestRatesInputSchema>;

const DateStringSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
	.refine((value) => {
		const year = Number(value.slice(0, 4));
		const month = Number(value.slice(5, 7));
		const day = Number(value.slice(8, 10));
		const date = new Date(Date.UTC(year, month - 1, day));
		return (
			date.getUTCFullYear() === year &&
			date.getUTCMonth() === month - 1 &&
			date.getUTCDate() === day
		);
	}, 'Date must be a valid calendar date');

const GetHistoricalRatesInputSchema = z.object({
	date: DateStringSchema.describe(
		'Historical date to fetch rates for, YYYY-MM-DD',
	),
	base: CurrencyCodeSchema.optional().describe(
		'Base currency to convert rates from (paid plans only; free plan is fixed to EUR)',
	),
	symbols: z
		.array(CurrencyCodeSchema)
		.optional()
		.describe('Limit results to these currency codes'),
});
export type GetHistoricalRatesInput = z.infer<
	typeof GetHistoricalRatesInputSchema
>;

const GetSupportedSymbolsInputSchema = z.object({});
export type GetSupportedSymbolsInput = z.infer<
	typeof GetSupportedSymbolsInputSchema
>;

const SupportedSymbolsResponseSchema = z.object({
	success: z.boolean(),
	symbols: z
		.record(z.string(), z.string())
		.describe('Map of currency code to full currency name'),
});
export type SupportedSymbolsResponse = z.infer<
	typeof SupportedSymbolsResponseSchema
>;

export type FixerEndpointInputs = {
	ratesLatest: GetLatestRatesInput;
	ratesHistorical: GetHistoricalRatesInput;
	symbolsList: GetSupportedSymbolsInput;
};

export type FixerEndpointOutputs = {
	ratesLatest: ExchangeRatesResponse;
	ratesHistorical: ExchangeRatesResponse;
	symbolsList: SupportedSymbolsResponse;
};

export const FixerEndpointInputSchemas = {
	ratesLatest: GetLatestRatesInputSchema,
	ratesHistorical: GetHistoricalRatesInputSchema,
	symbolsList: GetSupportedSymbolsInputSchema,
} as const;

export const FixerEndpointOutputSchemas = {
	ratesLatest: ExchangeRatesResponseSchema,
	ratesHistorical: ExchangeRatesResponseSchema,
	symbolsList: SupportedSymbolsResponseSchema,
} as const;
