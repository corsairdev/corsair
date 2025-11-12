import { z } from 'corsair'
import { procedure } from '../procedure'
import { ilike } from 'drizzle-orm'

export const searchAlbums = procedure
  .input(
    z.object({
      query: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const albums = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.albums)
      .where(ilike(ctx.schema.albums.columns.name, `%${input.query}%`))

    return albums
  })
