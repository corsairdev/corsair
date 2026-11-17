import { z } from 'zod';

export const LinkupCreditEntity = z.object({
	id: z.literal('balance'),
	balance: z.number(),
});

/** A source. Extracted page text is not stored. */
export const LinkupSourceEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
	type: z.string().optional(),
	publishedAt: z.string().optional(),
});

/** A response job. The generated text is not stored. */
export const LinkupResponseEntity = z.object({
	id: z.string().min(1),
	model: z.string().optional(),
	object: z.string().optional(),
});

export type LinkupCreditEntity = z.infer<typeof LinkupCreditEntity>;
export type LinkupSourceEntity = z.infer<typeof LinkupSourceEntity>;
export type LinkupResponseEntity = z.infer<typeof LinkupResponseEntity>;
