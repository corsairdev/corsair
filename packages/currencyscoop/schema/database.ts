import { z } from 'zod';

/** Supported currency. https://www.currencybeacon.com/supported-currencies */
export const CurrencyScoopCurrencyEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
	symbol: z.string().optional(),
});

/** One rate. https://www.currencybeacon.com/api-documentation */
export const CurrencyScoopQuoteEntity = z.object({
	id: z.string().min(1),
	date: z.string().min(1),
	base: z.string().min(1),
	code: z.string().min(1),
	rate: z.number(),
});

export type CurrencyScoopCurrencyEntity = z.infer<
	typeof CurrencyScoopCurrencyEntity
>;
export type CurrencyScoopQuoteEntity = z.infer<typeof CurrencyScoopQuoteEntity>;
