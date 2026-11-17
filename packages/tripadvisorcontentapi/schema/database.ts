import { z } from 'zod';

/** Location summary. Address and description are not stored. */
export const TripadvisorLocationEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
	rating: z.number().optional(),
	reviewCount: z.number().optional(),
});

/** Photo. The image URL and caption are not stored. */
export const TripadvisorPhotoEntity = z.object({
	id: z.string().min(1),
	width: z.number().optional(),
	height: z.number().optional(),
});

/** Review. The text, title, and username are not stored. */
export const TripadvisorReviewEntity = z.object({
	id: z.string().min(1),
	rating: z.number().optional(),
	publishedDate: z.string().optional(),
});

export type TripadvisorLocationEntity = z.infer<
	typeof TripadvisorLocationEntity
>;
export type TripadvisorPhotoEntity = z.infer<typeof TripadvisorPhotoEntity>;
export type TripadvisorReviewEntity = z.infer<typeof TripadvisorReviewEntity>;
