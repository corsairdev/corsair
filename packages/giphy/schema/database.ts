import { z } from 'zod';

export const GiphyGif = z.object({
	id: z.string(),
	url: z.string().optional(),
	slug: z.string().optional(),
	embedUrl: z.string().optional(),
	title: z.string().optional(),
	rating: z.string().optional(),
	username: z.string().optional(),
	source: z.string().optional(),
	importedAt: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const GiphyCategory = z.object({
	name: z.string(),
	nameEncoded: z.string().optional(),
	subcategories: z.array(z.string()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type GiphyGif = z.infer<typeof GiphyGif>;
export type GiphyCategory = z.infer<typeof GiphyCategory>;
