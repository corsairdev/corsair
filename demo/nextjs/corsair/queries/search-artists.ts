import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const searchArtists = procedure
  .input(
    z.object({
      query: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const artists = await ctx.db
      .select()
      .from(ctx.schema.artists)
      .where(drizzle.ilike(ctx.schema.artists.name, `%${input.query}%`))

    return artists
  })
