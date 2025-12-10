import { z } from 'corsair';
import { procedure } from '../procedure';

export const createAlbum = procedure
	.input(
		z.object({
			id: z.string(),
			name: z.string(),
			album_type: z.string(),
			release_date: z.string().optional(),
			release_date_precision: z.string().optional(),
			total_tracks: z.number().optional(),
			images: z.any().optional(),
			external_urls: z.any().optional(),
			uri: z.string().optional(),
			href: z.string().optional(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const [album] = await ctx.db
			.insert(ctx.db._.fullSchema.albums)
			.values({ ...input })
			.returning();

		return album;
	});
