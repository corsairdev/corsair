import { z } from 'corsair'
import { procedure } from '../trpc'

export const getTracksByAlbumId = procedure
  .input(
    z.object({
      albumId: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const tracks = await ctx.db.select().from(ctx.db._.fullSchema.tracks)
    return tracks
  })
