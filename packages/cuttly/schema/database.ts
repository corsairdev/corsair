import { z } from 'zod';

/** Official `url` object returned by the Cutt.ly regular API. */
export const CuttlyLinkEntity = z
	.object({
		status: z.number(),
		date: z.string().optional(),
		shortLink: z.string().url().optional(),
		fullLink: z.string().url().optional(),
		title: z.string().optional(),
		qrCode: z.string().url().optional(),
		id: z.union([z.string(), z.number()]).optional(),
	})
	.loose();

export type CuttlyLinkEntity = z.infer<typeof CuttlyLinkEntity>;
