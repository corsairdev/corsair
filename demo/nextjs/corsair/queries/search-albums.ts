import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const searchAlbums = procedure
  .input(
    z.object({
      query: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const albums = await ctx.db
      .select()
      .from(ctx.schema.albums)
      .where(drizzle.ilike(ctx.schema.albums.name, `%${input.query}%`))

    return albums
  })
