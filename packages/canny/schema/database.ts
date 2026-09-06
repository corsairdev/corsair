import { z } from 'zod';

/**
 * Canny Board Entity Schema
 * @see https://developers.canny.io/api-reference#boards
 */
export const CannyBoard = z
	.object({
		id: z.string(),
		name: z.string(),
		created: z.coerce.date().nullable().optional(),
		isPrivate: z.boolean().optional(),
		postCount: z.number().optional(),
		privateComments: z.boolean().optional(),
		url: z.string().optional(),
		token: z.string().optional(),
	})
	.catchall(z.unknown());

/**
 * Canny Post Entity Schema
 * @see https://developers.canny.io/api-reference#posts
 */
export const CannyPost = z
	.object({
		id: z.string(),
		title: z.string(),
		details: z.string().optional(),
		score: z.number().optional(),
		status: z.string().optional(),
		created: z.coerce.date().nullable().optional(),
		url: z.string().optional(),
		commentCount: z.number().optional(),
		eta: z.string().nullable().optional(),
		imageURLs: z.array(z.string()).optional(),
		boardID: z.string().optional(),
		authorID: z.string().optional(),
	})
	.catchall(z.unknown());

/**
 * Canny Comment Entity Schema
 * @see https://developers.canny.io/api-reference#comments
 */
export const CannyComment = z
	.object({
		id: z.string(),
		value: z.string(),
		created: z.coerce.date().nullable().optional(),
		postID: z.string().optional(),
		authorID: z.string().optional(),
		parentID: z.string().nullable().optional(),
		internal: z.boolean().optional(),
		likeCount: z.number().optional(),
		imageURLs: z.array(z.string()).optional(),
	})
	.catchall(z.unknown());

/**
 * Canny Vote Entity Schema
 * @see https://developers.canny.io/api-reference#votes
 */
export const CannyVote = z
	.object({
		id: z.string(),
		created: z.coerce.date().nullable().optional(),
		postID: z.string().optional(),
		voterID: z.string().optional(),
		boardID: z.string().optional(),
	})
	.catchall(z.unknown());

export type CannyBoard = z.infer<typeof CannyBoard>;
export type CannyPost = z.infer<typeof CannyPost>;
export type CannyComment = z.infer<typeof CannyComment>;
export type CannyVote = z.infer<typeof CannyVote>;
