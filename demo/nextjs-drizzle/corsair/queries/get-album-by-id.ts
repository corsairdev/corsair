import { z } from 'corsair';
import { eq } from 'drizzle-orm';
import { procedure } from '../procedure';

export const getAlbumById = procedure
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.query(async ({ input, ctx }) => {
		const [album] = await ctx.db
			.select()
			.from(ctx.db._.fullSchema.albums)
			.where(eq(ctx.db._.fullSchema.albums.id, input.id))
			.limit(1);

		return album || null;
	});
