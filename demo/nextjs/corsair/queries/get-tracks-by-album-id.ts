import { createQuery, z } from 'corsair/core'
import { type DatabaseContext } from '../types'

const query = createQuery<DatabaseContext>()

/**
 * @description Retrieves all tracks for a specific album
 *
 * @input
 * ```typescript
 * {
 *   albumId: string
 * }
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
 * }>
 * ```
 *
 * @example
 * ```typescript
 * useCorsairQuery('get tracks by album id', {
 *   albumId: 'album123'
 * })
 * ```
 */
export const getTracksByAlbumId = query({
  prompt: 'get tracks by album id',
  input_type: z.object({
    albumId: z.string(),
  }),
  // response_type: z.array(drizzleZod.createSelectSchema(schema.tracks)),
  dependencies: {
    tables: ['tracks'],
    columns: [
      'tracks.id',
      'tracks.name',
      'tracks.album_id',
      'tracks.duration_ms',
      'tracks.explicit',
      'tracks.track_number',
    ],
  },
  handler: async (input, ctx) => {
    const tracks = await ctx.db.select().from(ctx.schema.tracks)
    // .where(drizzle.eq(ctx.schema.tracks.album_id, input.albumId));

    return tracks
  },
})
