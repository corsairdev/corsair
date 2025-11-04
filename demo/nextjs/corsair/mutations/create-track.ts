import { createMutation } from 'corsair/core'
import { schema, type DatabaseContext } from '../types'

const mutation = createMutation<DatabaseContext>()

/**
 * @description Creates a new track in the database
 *
 * @input
 * ```typescript
 * {
 *   id: string
 *   name: string | null
 *   duration_ms: number | null
 *   explicit: boolean | null
 *   album_id: string | null
 *   track_number: number | null
 *   disc_number: number | null
 *   external_urls: unknown | null
 *   uri: string | null
 *   href: string | null
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
 *   track_number: number | null
 *   disc_number: number | null
 *   external_urls: unknown | null
 *   uri: string | null
 *   href: string | null
 * }
 * ```
 *
 * @example
 * ```typescript
 * useCorsairMutation('create track', {
 *   id: 'track123',
 *   name: 'My Song',
 *   duration_ms: 240000,
 *   explicit: false,
 *   album_id: 'album123',
 *   track_number: 1
 * })
 * ```
 */
export const createTrack = mutation({
  prompt: 'create track',
  input_type: schema.tracks._.inferInsert,
  // response_type: drizzleZod.createSelectSchema(schema.tracks),
  dependencies: {
    tables: ['tracks'],
    columns: [
      'tracks.id',
      'tracks.name',
      'tracks.duration_ms',
      'tracks.explicit',
      'tracks.track_number',
    ],
  },
  handler: async (input, ctx) => {
    const [track] = await ctx.db
      .insert(ctx.schema.tracks)
      .values({ ...input })
      .returning()

    return track
  },
})
