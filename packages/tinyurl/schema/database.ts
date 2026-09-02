import { z } from 'zod';

export const TinyurlLink = z
	.object({
		domain: z.string().optional(),
		alias: z.string().optional(),
		deleted: z.boolean().optional(),
		archived: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		created_at: z.string().optional(),
		expires_at: z.string().nullable().optional(),
		tiny_url: z.string(),
		url: z.string(),
		description: z.string().optional(),
	})
	.loose();

export type TinyurlLink = z.infer<typeof TinyurlLink>;
