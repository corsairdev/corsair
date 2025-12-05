import { z } from "corsair";
import { procedure } from "../procedure";

export const linkAlbumToArtist = procedure
	.input(
		z.object({
			albumId: z.string(),
			artistId: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const [link] = await ctx.db
			.insert(ctx.db._.fullSchema.album_artists)
			.values({
				album_id: input.albumId,
				artist_id: input.artistId,
			})
			.returning();

		return link;
	});
