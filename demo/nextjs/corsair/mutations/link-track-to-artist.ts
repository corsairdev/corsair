import { z } from 'corsair/core'
import { mutation } from '../instances'

export const linkTrackToArtist = mutation({
  prompt: 'link track to artist',
  input_type: z.object({
    trackId: z.string(),
    artistId: z.string(),
  }),
  // response_type: drizzleZod.createSelectSchema(schema.track_artists),
  dependencies: {
    tables: ['track_artists'],
    columns: ['track_artists.track_id', 'track_artists.artist_id'],
  },
  handler: async (input, ctx) => {
    const [link] = await ctx.db
      .insert(ctx.schema.track_artists)
      .values({
        track_id: input.trackId,
        artist_id: input.artistId,
      })
      .returning()

    return link
  },
})
