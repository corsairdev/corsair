import { createMutation } from 'corsair/core'
import { schema, type DatabaseContext } from '../types'

const mutation = createMutation<DatabaseContext>()

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
