import { createQuery, z } from 'corsair/core'
import { type DatabaseContext } from '../types'

const query = createQuery<DatabaseContext>()

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
