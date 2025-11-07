import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const getAllAlbumsByArtistId = procedure
  .input(
    z.object({
      artistId: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const albumsByArtistId = await ctx.db
      .select()
      .from(ctx.schema.albums)
      .innerJoin(
        ctx.schema.album_artists,
        drizzle.eq(ctx.schema.albums.id, ctx.schema.album_artists.album_id)
      )
      .where(drizzle.eq(ctx.schema.album_artists.artist_id, input.artistId))

    return albumsByArtistId
  })
