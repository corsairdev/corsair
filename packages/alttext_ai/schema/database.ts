import { z } from 'zod';

export const AltTextAiImageRecord = z.object({
	assetId: z.string().optional(),
	url: z.string().optional(),
	altText: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type AltTextAiImageRecord = z.infer<typeof AltTextAiImageRecord>;
