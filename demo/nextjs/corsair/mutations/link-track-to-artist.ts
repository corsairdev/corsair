import { createMutation, z } from 'corsair/core'
import { type DatabaseContext } from '../types'

const mutation = createMutation<DatabaseContext>()

/**
 * @description Links a track to an artist
 *
 * @input
 * ```typescript
 * {
 *   trackId: string
 *   artistId: string
 * }
 * ```
 *
 * @output
 * ```typescript
 * {
 *   track_id: string
 *   artist_id: string
 * }
 * ```
 *
 * @example
 * ```typescript
 * useCorsairMutation('link track to artist', {
 *   trackId: '123',
 *   artistId: 'artist1'
 * })
 * ```
 */
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
