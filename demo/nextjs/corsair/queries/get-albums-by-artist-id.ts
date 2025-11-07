import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const getAlbumsByArtistId = procedure
  .input(
    z.object({
      artistId: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const albums = await ctx.db
      .select({
        id: ctx.schema.albums.id,
        name: ctx.schema.albums.name,
        album_type: ctx.schema.albums.album_type,
        release_date: ctx.schema.albums.release_date,
        release_date_precision: ctx.schema.albums.release_date_precision,
        total_tracks: ctx.schema.albums.total_tracks,
        images: ctx.schema.albums.images,
        external_urls: ctx.schema.albums.external_urls,
        uri: ctx.schema.albums.uri,
        href: ctx.schema.albums.href,
      })
      .from(ctx.schema.albums)
      .innerJoin(
        ctx.schema.album_artists,
        drizzle.eq(ctx.schema.albums.id, ctx.schema.album_artists.album_id)
      )
      .where(drizzle.eq(ctx.schema.album_artists.artist_id, input.artistId))

    return albums
  })
