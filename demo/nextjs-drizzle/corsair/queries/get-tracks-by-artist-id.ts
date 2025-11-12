import { z } from 'corsair'
import { procedure } from '../procedure'
import { eq } from 'drizzle-orm'

export const getTracksByArtistId = procedure
  .input(
    z.object({
      artistId: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const tracks = await ctx.db
      .select({
        id: ctx.schema.tracks.columns.id,
        name: ctx.schema.tracks.columns.name,
        disc_number: ctx.schema.tracks.columns.disc_number,
        duration_ms: ctx.schema.tracks.columns.duration_ms,
        explicit: ctx.schema.tracks.columns.explicit,
        track_number: ctx.schema.tracks.columns.track_number,
        preview_url: ctx.schema.tracks.columns.preview_url,
        is_local: ctx.schema.tracks.columns.is_local,
        external_urls: ctx.schema.tracks.columns.external_urls,
        uri: ctx.schema.tracks.columns.uri,
        href: ctx.schema.tracks.columns.href,
      })
      .from(ctx.db._.fullSchema.tracks)
      .innerJoin(
        ctx.db._.fullSchema.track_artists,
        eq(
          ctx.schema.tracks.columns.id,
          ctx.schema.track_artists.columns.track_id
        )
      )
      .where(eq(ctx.schema.track_artists.columns.artist_id, input.artistId))

    return tracks
  })
