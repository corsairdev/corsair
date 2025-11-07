import { z } from 'corsair'
import { procedure } from '../trpc/procedures'

export const getTracksByAlbumId = procedure
  .input(
    z.object({
      albumId: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const tracks = await ctx.db.select().from(ctx.schema.tracks)
    return tracks
  })
