import { createMutation, z } from 'corsair/core'
import { type DatabaseContext } from '../types'
import { drizzle } from 'corsair/db/types'

const mutation = createMutation<DatabaseContext>()

/**
 * @description Toggles the explicit flag on a track
 *
 * @input
 * ```typescript
 * {
 *   trackId: string
 * }
 * ```
 *
 * @output
 * ```typescript
 * {
 *   id: string
 *   name: string | null
 *   duration_ms: number | null
 *   explicit: boolean | null
 *   album_id: string | null
 * } | null
 * ```
 *
 * @example
 * ```typescript
 * useCorsairMutation('toggle track explicit', {
 *   trackId: '123'
 * })
 * ```
 */
export const toggleTrackExplicit = mutation({
  prompt: 'toggle track explicit',
  input_type: z.object({
    trackId: z.string(),
  }),
  // response_type: drizzleZod.createSelectSchema(schema.tracks).nullable(),
  dependencies: {
    tables: ['tracks'],
    columns: ['tracks.id', 'tracks.explicit'],
  },
  handler: async (input, ctx) => {
    // First get the current track to toggle its explicit value
    const [currentTrack] = await ctx.db
      .select()
      .from(ctx.schema.tracks)
      .where(drizzle.eq(ctx.schema.tracks.id, input.trackId))
      .limit(1)

    if (!currentTrack) {
      return null
    }

    const [track] = await ctx.db
      .update(ctx.schema.tracks)
      .set({
        explicit: !currentTrack.explicit,
      })
      .where(drizzle.eq(ctx.schema.tracks.id, input.trackId))
      .returning()

    return track || null
  },
})
