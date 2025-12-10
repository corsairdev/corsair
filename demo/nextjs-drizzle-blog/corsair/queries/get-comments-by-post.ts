import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { procedure } from '@/corsair/procedure';

/**
 * INPUT: { postId: string }
 * OUTPUT: Array<{ id: string; content: string; post_id: string; author_id: string; parent_id: string | null; created_at: string; updated_at: string; author: { id: string; email: string; name: string | null; avatar_url: string | null; bio: string | null; created_at: string; updated_at: string; } }>
 *
 * PSEUDO CODE:
 * 1. Accept postId as input parameter
 * 2. Query the comments table filtering by post_id matching input.postId
 * 3. Join the users table on comments.author_id = users.id to get author details
 * 4. Order the results by comments.created_at in ascending order
 * 5. Return all comments with their respective author details
 *
 * USER INSTRUCTIONS: fetch all comments for a post by postId with author details, ordered by created_at ascending
 */
export const getCommentsByPost = procedure
	.input(z.object({ postId: z.string() }))
	.query(async ({ input, ctx }) => {
		const commentsWithAuthors = await ctx.db
			.select({
				id: ctx.db._.fullSchema.comments.id,
				content: ctx.db._.fullSchema.comments.content,
				post_id: ctx.db._.fullSchema.comments.post_id,
				author_id: ctx.db._.fullSchema.comments.author_id,
				parent_id: ctx.db._.fullSchema.comments.parent_id,
				created_at: ctx.db._.fullSchema.comments.created_at,
				updated_at: ctx.db._.fullSchema.comments.updated_at,
				author: {
					id: ctx.db._.fullSchema.users.id,
					email: ctx.db._.fullSchema.users.email,
					name: ctx.db._.fullSchema.users.name,
					avatar_url: ctx.db._.fullSchema.users.avatar_url,
					bio: ctx.db._.fullSchema.users.bio,
					created_at: ctx.db._.fullSchema.users.created_at,
					updated_at: ctx.db._.fullSchema.users.updated_at,
				},
			})
			.from(ctx.db._.fullSchema.comments)
			.innerJoin(
				ctx.db._.fullSchema.users,
				eq(
					ctx.db._.fullSchema.comments.author_id,
					ctx.db._.fullSchema.users.id,
				),
			)
			.where(eq(ctx.db._.fullSchema.comments.post_id, input.postId))
			.orderBy(asc(ctx.db._.fullSchema.comments.created_at));

		return commentsWithAuthors;
	});
