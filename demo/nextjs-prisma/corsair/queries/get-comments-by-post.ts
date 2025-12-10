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
		const comments = await ctx.db.comment.findMany({
			where: {
				postId: input.postId,
			},
			include: {
				author: true,
			},
			orderBy: {
				createdAt: 'asc',
			},
		});

		return comments.map((comment) => ({
			id: comment.id,
			content: comment.content,
			post_id: comment.postId,
			author_id: comment.authorId,
			parent_id: comment.parentId,
			created_at: comment.createdAt.toISOString(),
			updated_at: comment.updatedAt.toISOString(),
			author: {
				id: comment.author.id,
				email: comment.author.email,
				name: comment.author.name,
				avatar_url: comment.author.avatarUrl,
				bio: comment.author.bio,
				created_at: comment.author.createdAt.toISOString(),
				updated_at: comment.author.updatedAt.toISOString(),
			},
		}));
	});
