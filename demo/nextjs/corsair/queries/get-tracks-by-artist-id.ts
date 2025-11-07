import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const getTracksByArtistId = procedure
  .input(
    z.object({
      artistId: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const tracks = await ctx.db
      .select({
        id: ctx.schema.tracks.id,
        name: ctx.schema.tracks.name,
        disc_number: ctx.schema.tracks.disc_number,
        duration_ms: ctx.schema.tracks.duration_ms,
        explicit: ctx.schema.tracks.explicit,
        track_number: ctx.schema.tracks.track_number,
        preview_url: ctx.schema.tracks.preview_url,
        is_local: ctx.schema.tracks.is_local,
        external_urls: ctx.schema.tracks.external_urls,
        uri: ctx.schema.tracks.uri,
        href: ctx.schema.tracks.href,
      })
      .from(ctx.schema.tracks)
      .innerJoin(
        ctx.schema.track_artists,
        drizzle.eq(ctx.schema.tracks.id, ctx.schema.track_artists.track_id)
      )
      .where(drizzle.eq(ctx.schema.track_artists.artist_id, input.artistId))

    return tracks
  })
