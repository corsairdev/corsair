import { z } from 'zod';

// Source: BrandResponse.brand in https://docs.context.dev/openapi.json
export const ContextDevBrand = z.object({
	domain: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	logoUrl: z.string().optional(),
	primaryColor: z.string().optional(),
	industry: z.string().optional(),
	employeeRange: z.string().optional(),
	country: z.string().optional(),
	fetchedAt: z.coerce.date(),
});

export type ContextDevBrand = z.infer<typeof ContextDevBrand>;

// Source: POST /news/search response items in https://docs.context.dev/openapi.json
export const ContextDevNewsArticle = z.object({
	id: z.string(),
	storyId: z.string(),
	url: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	sourceDomain: z.string(),
	type: z.string(),
	publishedAt: z.coerce.date().nullable(),
});

export type ContextDevNewsArticle = z.infer<typeof ContextDevNewsArticle>;
