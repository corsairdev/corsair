import { z } from 'corsair'
import { procedure } from '../'

export const getAllArtists = procedure
  .input(z.object({}))
  .query(async ({ input, ctx }) => {
    const artists = await ctx.db.select().from(ctx.db._.fullSchema.artists)
    return artists
  })
