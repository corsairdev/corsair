import { z } from 'zod';

export const WixContact = z
	.object({
		id: z.string().optional(),
		revision: z.number().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
	})
	.loose();

export type WixContact = z.infer<typeof WixContact>;

export const WixProduct = z
	.object({
		id: z.string().optional(),
		revision: z.string().optional(),
		name: z.string().optional(),
		slug: z.string().optional(),
	})
	.loose();

export type WixProduct = z.infer<typeof WixProduct>;

export const WixOrder = z
	.object({
		id: z.string().optional(),
		revision: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();

export type WixOrder = z.infer<typeof WixOrder>;
