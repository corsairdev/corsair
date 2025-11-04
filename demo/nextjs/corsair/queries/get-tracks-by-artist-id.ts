import { createQuery, z } from 'corsair/core'
import { type DatabaseContext } from '../types'
import { drizzle } from 'corsair/db/types'

const query = createQuery<DatabaseContext>()

export const getTracksByArtistId = query({
  prompt: 'get tracks by artist id',
  input_type: z.object({
    artistId: z.string(),
  }),
  // response_type: z.array(drizzleZod.createSelectSchema(schema.tracks)),
  dependencies: {
    tables: ['tracks', 'track_artists'],
    columns: [
      'tracks.id',
      'tracks.name',
      'tracks.duration_ms',
      'tracks.explicit',
      'tracks.track_number',
      'track_artists.artist_id',
      'track_artists.track_id',
    ],
  },
  handler: async (input, ctx) => {
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
  },
})
