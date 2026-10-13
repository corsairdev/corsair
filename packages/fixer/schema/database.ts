import { z } from 'zod';

// Modeled on the Fixer response objects.
// https://docs.apilayer.com/fixer/docs/api-documentation

// One /latest or /{date} response. Entity id is `${base}:${date}`.
export const FixerRateSnapshot = z.object({
	base: z.string(),
	date: z.string(),
	timestamp: z.number().nullable().optional(),
	historical: z.boolean(),
	rates: z.record(z.string(), z.number()),
});

// One entry of the /symbols map. Entity id is the currency code.
export const FixerCurrency = z.object({
	code: z.string(),
	name: z.string(),
});

// One /convert response. Entity id is `${from}:${to}:${amount}:${date | 'latest'}`.
export const FixerConversion = z.object({
	from: z.string(),
	to: z.string(),
	amount: z.number(),
	rate: z.number(),
	result: z.number(),
	timestamp: z.number().nullable().optional(),
	date: z.string().nullable().optional(),
});
