import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const getArtistById = procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    let [artist] = await ctx.db
      .select()
      .from(ctx.schema.artists)
      .where(drizzle.eq(ctx.schema.artists.id, input.id))
      .limit(1)

    return artist || null
  })
