import { z } from 'corsair'
import { procedure } from '../'
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
      .where(ilike(ctx.schema.artists.columns.name, `%${input.query}%`))

    return artists
  })
