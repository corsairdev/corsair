import { z } from 'zod';

/** Official create/list payload field `analytics` from api.tinyurl.com. */
export const TinyurlAnalytics = z
	.object({
		enabled: z.boolean().optional(),
		public: z.boolean().optional(),
	})
	.loose();

export type TinyurlAnalytics = z.infer<typeof TinyurlAnalytics>;

/**
 * TinyURL link object from POST /create and GET /urls/{type}.
 * List items omit `url` (destination); create always returns it.
 */
export const TinyurlLink = z
	.object({
		domain: z.string(),
		alias: z.string(),
		deleted: z.boolean().optional(),
		archived: z.boolean().optional(),
		analytics: TinyurlAnalytics.optional(),
		tags: z.array(z.string()).optional(),
		created_at: z.string().optional(),
		expires_at: z.string().nullable().optional(),
		tiny_url: z.string().url(),
		url: z.string().url().optional(),
		description: z.string().optional(),
	})
	.loose();

export type TinyurlLink = z.infer<typeof TinyurlLink>;
