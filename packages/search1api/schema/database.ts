import { z } from 'zod';

/**
 * The link is the identity: re-running a search refreshes the stored row
 * instead of duplicating it.
 */
export const Search1APISearchResult = z.object({
	title: z.string(),
	link: z.string(),
	snippet: z.string(),
	content: z.string().nullable().optional(),
	publishedDate: z.coerce.date().nullable().optional(),
	service: z.string().nullable().optional(),
	query: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type Search1APISearchResult = z.infer<typeof Search1APISearchResult>;
