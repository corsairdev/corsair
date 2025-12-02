import { z } from 'corsair'
import { procedure } from '../procedure'
import { ilike } from 'drizzle-orm'

export const searchArtists = procedure
  .input(
    z.object({
      query: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const artists = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.artists)
      .where(ilike(ctx.db._.fullSchema.artists.name, `%${input.query}%`))

    return artists
  })
