import { z } from 'zod';

export const WorldNewsArticle = z.object({
	id: z.number(),
	title: z.string(),
	text: z.string().optional(),
	summary: z.string().nullable().optional(),
	url: z.string(),
	image: z.string().nullable().optional(),
	video: z.string().nullable().optional(),
	publish_date: z.string().optional(),
	author: z.string().nullable().optional(),
	authors: z.array(z.string()).optional(),
	category: z.string().optional(),
	language: z.string().optional(),
	source_country: z.string().optional(),
	sentiment: z.number().optional(),
	createdAt: z.coerce.date().optional(),
});

export const WorldNewsExtractedArticle = z.object({
	url: z.string(),
	title: z.string().optional(),
	text: z.string().optional(),
	publish_date: z.string().optional(),
	author: z.string().nullable().optional(),
	authors: z.array(z.string()).optional(),
	language: z.string().optional(),
	source_country: z.string().optional(),
	sentiment: z.number().optional(),
	extractedAt: z.coerce.date().optional(),
});

export const WorldNewsGeoCoordinate = z.object({
	location: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	city: z.string().optional(),
	resolvedAt: z.coerce.date().optional(),
});

export const WorldNewsSource = z.object({
	name: z.string(),
	url: z.string(),
	language: z.string().optional(),
	country: z.string().optional(),
	searchedAt: z.coerce.date().optional(),
});

export type WorldNewsArticle = z.infer<typeof WorldNewsArticle>;
export type WorldNewsExtractedArticle = z.infer<
	typeof WorldNewsExtractedArticle
>;
export type WorldNewsGeoCoordinate = z.infer<typeof WorldNewsGeoCoordinate>;
export type WorldNewsSource = z.infer<typeof WorldNewsSource>;
