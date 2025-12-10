import { z } from 'corsair';
import { ilike } from 'drizzle-orm';
import { procedure } from '../procedure';

export const searchAlbums = procedure
	.input(
		z.object({
			query: z.string(),
		}),
	)
	.query(async ({ input, ctx }) => {
		const albums = await ctx.db
			.select()
			.from(ctx.db._.fullSchema.albums)
			.where(ilike(ctx.db._.fullSchema.albums.name, `%${input.query}%`));

		return albums;
	});
