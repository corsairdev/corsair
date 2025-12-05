import { desc, eq } from "drizzle-orm";
import { procedure } from "@/corsair/procedure";

/**
 * INPUT: {}
 * OUTPUT: Array<{ id: string, title: string, slug: string, content: string, excerpt: string | null, cover_image_url: string | null, view_count: number, published_at: Date | null, author: { id: string, name: string | null, email: string, avatar_url: string | null, bio: string | null, created_at: Date, updated_at: Date } }>
 *
 * PSEUDO CODE:
 * 1. Query the posts table where published is true
 * 2. Join users to get each post's author details
 * 3. Order by published_at descending
 * 4. Return the post array, each with author details
 *
 * USER INSTRUCTIONS: fetch all published posts with author details, ordered by published_at descending
 */
export const getAllPosts = procedure.query(async ({ ctx }) => {
	const result = await ctx.db
		.select()
		.from(ctx.db._.fullSchema.posts)
		.innerJoin(
			ctx.db._.fullSchema.users,
			eq(ctx.db._.fullSchema.posts.author_id, ctx.db._.fullSchema.users.id),
		)
		.where(eq(ctx.db._.fullSchema.posts.published, true))
		.orderBy(desc(ctx.db._.fullSchema.posts.published_at));

	// result: Array<{ posts: Post; users: User }>
	return result.map(({ posts, users }) => ({
		id: posts.id,
		title: posts.title,
		slug: posts.slug,
		content: posts.content,
		excerpt: posts.excerpt,
		cover_image_url: posts.cover_image_url,
		view_count: posts.view_count,
		published_at: posts.published_at,
		author: {
			id: users.id,
			name: users.name,
			email: users.email,
			avatar_url: users.avatar_url,
			bio: users.bio,
			created_at: users.created_at,
			updated_at: users.updated_at,
		},
	}));
});
