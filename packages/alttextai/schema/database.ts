import { z } from 'zod';

export const AltTextAiImageRecord = z
	.object({
		assetId: z.string().optional(),
		url: z.string().optional(),
		altText: z.string().nullable().optional(),
		altTexts: z.record(z.string(), z.string()).optional(),
		tags: z.array(z.string()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
		creditsUsed: z.number().optional(),
	})
	.loose();

export type AltTextAiImageRecord = z.infer<typeof AltTextAiImageRecord>;
