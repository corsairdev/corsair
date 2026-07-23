import { z } from 'zod';

export const RetailedProductSchema = z
	.object({
		id: z.string(),
		productId: z.string(),
		name: z.string(),
		url: z.string().optional(),
		domain: z.string().optional(),
		price: z.number().nullable().optional(),
	})
	.passthrough();

export type RetailedProduct = z.infer<typeof RetailedProductSchema>;
