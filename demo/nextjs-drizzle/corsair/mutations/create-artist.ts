import { z } from 'corsair';
import { procedure } from '../procedure';

export const createArtist = procedure
	.input(
		z.object({
			id: z.string(),
			name: z.string(),
			popularity: z.number().min(0).max(100).optional(),
			followers: z.number().optional(),
			genres: z.array(z.string()).optional(),
			images: z.any().optional(),
			external_urls: z.any().optional(),
			uri: z.string().optional(),
			href: z.string().optional(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const [artist] = await ctx.db
			.insert(ctx.db._.fullSchema.artists)
			.values({
				id: input.id,
				name: input.name,
				popularity: input.popularity || 0,
				followers: input.followers || 0,
				genres: input.genres,
				images: input.images,
				external_urls: input.external_urls,
				uri: input.uri || '',
				href: input.href || '',
			})
			.returning();

		return artist;
	});
