import { createQuery, z } from 'corsair/core'
import { type DatabaseContext } from '../types'

const query = createQuery<DatabaseContext>()

/**
 * @description Retrieves all tracks from the database
 *
 * @input
 * ```typescript
 * {}
 * ```
 *
 * @output
 * ```typescript
 * Array<{
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
 * }>
 * ```
 *
 * @example
 * ```typescript
 * useCorsairQuery('get all tracks', {})
 * ```
 */
export const getAllTracks = query({
  prompt: 'get all tracks',
  input_type: z.object({}),
  // response_type: z.array(drizzleZod.createSelectSchema(schema.tracks)),
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
    const tracks = await ctx.db.select().from(ctx.schema.tracks)
    return tracks
  },
})
