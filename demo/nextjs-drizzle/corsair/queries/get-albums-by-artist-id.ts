import { z } from 'corsair';
import { eq } from 'drizzle-orm';
import { procedure } from '../procedure';

export const getAlbumsByArtistId = procedure
	.input(
		z.object({
			artistId: z.string(),
		}),
	)
	.query(async ({ input, ctx }) => {
		const albums = await ctx.db
			.select({
				id: ctx.db._.fullSchema.albums.id,
				name: ctx.db._.fullSchema.albums.name,
				album_type: ctx.db._.fullSchema.albums.album_type,
				release_date: ctx.db._.fullSchema.albums.release_date,
				release_date_precision:
					ctx.db._.fullSchema.albums.release_date_precision,
				total_tracks: ctx.db._.fullSchema.albums.total_tracks,
				images: ctx.db._.fullSchema.albums.images,
				external_urls: ctx.db._.fullSchema.albums.external_urls,
				uri: ctx.db._.fullSchema.albums.uri,
				href: ctx.db._.fullSchema.albums.href,
			})
			.from(ctx.db._.fullSchema.albums)
			.innerJoin(
				ctx.db._.fullSchema.album_artists,
				eq(
					ctx.db._.fullSchema.albums.id,
					ctx.db._.fullSchema.album_artists.album_id,
				),
			)
			.where(eq(ctx.db._.fullSchema.album_artists.artist_id, input.artistId));

		return albums;
	});
