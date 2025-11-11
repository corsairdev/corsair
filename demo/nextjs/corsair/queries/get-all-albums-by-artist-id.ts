import { z } from 'corsair'
import { procedure } from '../'
import { eq } from 'drizzle-orm'

export const getAllAlbumsByArtistId = procedure
  .input(
    z.object({
      artistId: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const albumsByArtistId = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.albums)
      .innerJoin(
        ctx.db._.fullSchema.album_artists,
        eq(
          ctx.db._.fullSchema.albums.id,
          ctx.schema.album_artists.columns.album_id
        )
      )
      .where(eq(ctx.db._.fullSchema.album_artists.artist_id, input.artistId))

    return albumsByArtistId
  })
