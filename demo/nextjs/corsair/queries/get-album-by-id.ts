import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const getAlbumById = procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const [album] = await ctx.db
      .select()
      .from(ctx.schema.albums)
      .where(drizzle.eq(ctx.schema.albums.id, input.id))
      .limit(1)

    return album || null
  })
