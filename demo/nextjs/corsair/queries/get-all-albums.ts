import { z } from 'corsair'
import { procedure } from '../procedure'

export const getAllAlbums = procedure
  .input(z.object({}))
  .query(async ({ input, ctx }) => {
    const albums = await ctx.db.select().from(ctx.db._.fullSchema.albums)
    return albums
  })
