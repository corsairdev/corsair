import { z } from 'zod';
import {
	SerplyArticleEntity,
	SerplyImageEntity,
	SerplyPlaceEntity,
} from '../schema/database';

export const QueryInputSchema = z.object({
	q: z.string().min(1),
});

export const ImageInputSchema = QueryInputSchema.extend({
	num: z.number().int().min(1).max(20).optional(),
});

export const ImageResponseSchema = z.object({
	images: z.array(SerplyImageEntity),
});
export const PlaceResponseSchema = z.object({
	places: z.array(SerplyPlaceEntity),
});
export const ArticleResponseSchema = z.object({
	articles: z.array(SerplyArticleEntity),
});

export type QueryInput = z.infer<typeof QueryInputSchema>;
export type ImageInput = z.infer<typeof ImageInputSchema>;
export type ImageResponse = z.infer<typeof ImageResponseSchema>;
export type PlaceResponse = z.infer<typeof PlaceResponseSchema>;
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;

export const SerplyEndpointInputSchemas = {
	'images.search': ImageInputSchema,
	'places.search': QueryInputSchema,
	'articles.search': QueryInputSchema,
};

export const SerplyEndpointOutputSchemas = {
	'images.search': ImageResponseSchema,
	'places.search': PlaceResponseSchema,
	'articles.search': ArticleResponseSchema,
};
