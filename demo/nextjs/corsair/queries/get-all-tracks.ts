import { z } from 'corsair'
import { procedure } from '../trpc/procedures'

export const getAllTracks = procedure
  .input(z.object({}))
  .query(async ({ input, ctx }) => {
    const tracks = await ctx.db.select().from(ctx.schema.tracks)
    return tracks
  })
