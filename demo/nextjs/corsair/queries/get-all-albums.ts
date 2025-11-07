import { z } from 'corsair'
import { procedure } from '../trpc/procedures'

export const getAllAlbums = procedure
  .input(z.object({}))
  .query(async ({ input, ctx }) => {
    const albums = await ctx.db.select().from(ctx.schema.albums)
    return albums
  })
