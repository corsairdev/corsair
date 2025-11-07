import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const updateAlbumType = procedure
  .input(
    z.object({
      albumId: z.string(),
      albumType: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [album] = await ctx.db
      .update(ctx.schema.albums)
      .set({
        album_type: input.albumType,
      })
      .where(drizzle.eq(ctx.schema.albums.id, input.albumId))
      .returning()

    return album || null
  })
