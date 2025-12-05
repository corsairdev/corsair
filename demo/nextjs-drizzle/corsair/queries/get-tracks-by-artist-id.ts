import { z } from "corsair";
import { eq } from "drizzle-orm";
import { procedure } from "../procedure";

export const getTracksByArtistId = procedure
	.input(
		z.object({
			artistId: z.string(),
		}),
	)
	.query(async ({ input, ctx }) => {
		const tracks = await ctx.db
			.select({
				id: ctx.db._.fullSchema.tracks.id,
				name: ctx.db._.fullSchema.tracks.name,
				disc_number: ctx.db._.fullSchema.tracks.disc_number,
				duration_ms: ctx.db._.fullSchema.tracks.duration_ms,
				explicit: ctx.db._.fullSchema.tracks.explicit,
				track_number: ctx.db._.fullSchema.tracks.track_number,
				preview_url: ctx.db._.fullSchema.tracks.preview_url,
				is_local: ctx.db._.fullSchema.tracks.is_local,
				external_urls: ctx.db._.fullSchema.tracks.external_urls,
				uri: ctx.db._.fullSchema.tracks.uri,
				href: ctx.db._.fullSchema.tracks.href,
			})
			.from(ctx.db._.fullSchema.tracks)
			.innerJoin(
				ctx.db._.fullSchema.track_artists,
				eq(
					ctx.db._.fullSchema.tracks.id,
					ctx.db._.fullSchema.track_artists.track_id,
				),
			)
			.where(eq(ctx.db._.fullSchema.track_artists.artist_id, input.artistId));

		return tracks;
	});
