import { z } from 'zod';
import { procedure } from '@/corsair/procedure';

/**
 * INPUT: { content: string, postId: string, authorId: string }
 * OUTPUT: { success: boolean, comment: Comment }
 *
 * PSEUDO CODE:
 * 1. Accept content, postId, and authorId as input parameters
 * 2. Insert a new comment into the comments table with provided content, postId, and authorId
 * 3. Return success flag and the newly created comment object
 *
 * USER INSTRUCTIONS: create a new comment with content, postId, and authorId
 */
export const createComment = procedure
	.input(
		z.object({
			content: z.string(),
			postId: z.string(),
			authorId: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const newComment = await ctx.db.comment.create({
			data: {
				content: input.content,
				postId: input.postId,
				authorId: input.authorId,
			},
		});

		return { success: true, comment: newComment };
	});
