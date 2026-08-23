import { z } from 'zod';

/**
 * DiffbotArticle — cached article entity.
 * Useful when storing extracted articles locally via the Corsair database.
 */
export const DiffbotArticle = z.object({
	pageUrl: z.string(),
	title: z.string().optional(),
	text: z.string().optional(),
	author: z.string().optional(),
	date: z.string().optional(),
	siteName: z.string().optional(),
	humanLanguage: z.string().optional(),
	tags: z.array(z.object({ label: z.string() })).optional(),
	extractedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotArticle = z.infer<typeof DiffbotArticle>;

/**
 * DiffbotProduct — cached product entity.
 * Useful when storing extracted product data locally via the Corsair database.
 */
export const DiffbotProduct = z.object({
	pageUrl: z.string(),
	title: z.string().optional(),
	brand: z.string().optional(),
	offerPrice: z.string().optional(),
	regularPrice: z.string().optional(),
	availability: z.boolean().optional(),
	sku: z.string().optional(),
	humanLanguage: z.string().optional(),
	extractedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotProduct = z.infer<typeof DiffbotProduct>;
