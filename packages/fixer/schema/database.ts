import { z } from 'zod';

export const FixerRate = z.object({
	base: z.string(),
	date: z.string(),
	rates: z.record(z.string(), z.number()),
	updated_at: z.coerce.date().nullable().optional(),
});
export type FixerRate = z.infer<typeof FixerRate>;

export const FixerSymbol = z.object({
	code: z.string(),
	name: z.string(),
	updated_at: z.coerce.date().nullable().optional(),
});
export type FixerSymbol = z.infer<typeof FixerSymbol>;
