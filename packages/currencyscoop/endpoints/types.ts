import { z } from 'zod';
import {
	CurrencyScoopCurrencyEntity,
	CurrencyScoopQuoteEntity,
} from '../schema/database';

const code = z.string().regex(/^[A-Za-z0-9]{2,12}$/);
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const ListInputSchema = z.object({});

export const RatesInputSchema = z.object({
	base: code.optional(),
	symbols: z.string().min(1).optional(),
});

export const HistoricalInputSchema = RatesInputSchema.extend({
	date: day,
});

export const ConvertInputSchema = z.object({
	from: code,
	to: code,
	amount: z.number().positive(),
	date: day.optional(),
});

export const TimeseriesInputSchema = RatesInputSchema.extend({
	start_date: day,
	end_date: day,
});

export const CurrencyListResponseSchema = z.object({
	currencies: z.array(CurrencyScoopCurrencyEntity),
});

export const QuoteListResponseSchema = z.object({
	quotes: z.array(CurrencyScoopQuoteEntity),
});

export const ConvertResponseSchema = z.object({
	from: z.string(),
	to: z.string(),
	amount: z.number(),
	value: z.number(),
	date: z.string(),
});

export type ListInput = z.infer<typeof ListInputSchema>;
export type RatesInput = z.infer<typeof RatesInputSchema>;
export type HistoricalInput = z.infer<typeof HistoricalInputSchema>;
export type ConvertInput = z.infer<typeof ConvertInputSchema>;
export type TimeseriesInput = z.infer<typeof TimeseriesInputSchema>;
export type CurrencyListResponse = z.infer<typeof CurrencyListResponseSchema>;
export type QuoteListResponse = z.infer<typeof QuoteListResponseSchema>;
export type ConvertResponse = z.infer<typeof ConvertResponseSchema>;

export const CurrencyScoopEndpointInputSchemas = {
	'currencies.list': ListInputSchema,
	'quotes.latest': RatesInputSchema,
	'quotes.historical': HistoricalInputSchema,
	'quotes.convert': ConvertInputSchema,
	'quotes.timeseries': TimeseriesInputSchema,
};

export const CurrencyScoopEndpointOutputSchemas = {
	'currencies.list': CurrencyListResponseSchema,
	'quotes.latest': QuoteListResponseSchema,
	'quotes.historical': QuoteListResponseSchema,
	'quotes.convert': ConvertResponseSchema,
	'quotes.timeseries': QuoteListResponseSchema,
};
