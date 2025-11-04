import { createQuery, z } from 'corsair/core'
import { type DatabaseContext } from '../types'

const query = createQuery<DatabaseContext>()

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
