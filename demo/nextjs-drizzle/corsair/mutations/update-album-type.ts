import { z } from 'corsair'
import { procedure } from '../procedure'
import { eq } from 'drizzle-orm'

export const updateAlbumType = procedure
  .input(
    z.object({
      albumId: z.string(),
      albumType: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [album] = await ctx.db
      .update(ctx.db._.fullSchema.albums)
      .set({
        album_type: input.albumType,
      })
      .where(eq(ctx.db._.fullSchema.albums.id, input.albumId))
      .returning()

    return album || null
  })
