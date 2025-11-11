import { z } from 'corsair'
import { procedure } from '../trpc'
import { eq } from 'drizzle-orm'

export const getAlbumById = procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const [album] = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.albums)
      .where(eq(ctx.schema.albums.columns.id, input.id))
      .limit(1)

    return album || null
  })
