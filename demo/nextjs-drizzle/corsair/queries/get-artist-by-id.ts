import { z } from 'corsair'
import { procedure } from '../procedure'
import { eq } from 'drizzle-orm'

export const getArtistById = procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    let [artist] = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.artists)
      .where(eq(ctx.db._.fullSchema.artists.id, input.id))
      .limit(1)

    return artist || null
  })
