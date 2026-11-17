import { z } from 'zod';

/** Image hit. https://serply.io/docs/resources/google-images */
export const SerplyImageEntity = z.object({
	id: z.string().min(1),
	src: z.string().optional(),
	alt: z.string().optional(),
	title: z.string().optional(),
	domain: z.string().optional(),
	originalSrc: z.string().optional(),
	width: z.string().optional(),
	height: z.string().optional(),
});

/** Place hit. https://serply.io/docs/resources/google-maps */
export const SerplyPlaceEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	rating: z.number().optional(),
	address: z.string().optional(),
});

/** Scholar hit. https://serply.io/docs/resources/google-scholar */
export const SerplyArticleEntity = z.object({
	id: z.string().min(1),
	title: z.string().optional(),
	link: z.string().optional(),
});

export type SerplyImageEntity = z.infer<typeof SerplyImageEntity>;
export type SerplyPlaceEntity = z.infer<typeof SerplyPlaceEntity>;
export type SerplyArticleEntity = z.infer<typeof SerplyArticleEntity>;
