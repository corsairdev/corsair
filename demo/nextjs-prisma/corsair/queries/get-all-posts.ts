import { procedure } from '@/corsair/procedure';

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
	const result = await ctx.db.post.findMany({
		where: {
			published: true,
		},
		include: {
			author: true,
		},
		orderBy: {
			publishedAt: 'desc',
		},
	});

	return result.map((post) => ({
		id: post.id,
		title: post.title,
		slug: post.slug,
		content: post.content,
		excerpt: post.excerpt,
		cover_image_url: post.coverImageUrl,
		view_count: post.viewCount,
		published_at: post.publishedAt,
		author: {
			id: post.author.id,
			name: post.author.name,
			email: post.author.email,
			avatar_url: post.author.avatarUrl,
			bio: post.author.bio,
			created_at: post.author.createdAt,
			updated_at: post.author.updatedAt,
		},
	}));
});
