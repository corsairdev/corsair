import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const getAlbumByIdWithArtists = procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const albumWithArtists = await ctx.db
      .select({
        albumId: ctx.schema.albums.id,
        albumName: ctx.schema.albums.name,
        album_type: ctx.schema.albums.album_type,
        release_date: ctx.schema.albums.release_date,
        release_date_precision: ctx.schema.albums.release_date_precision,
        total_tracks: ctx.schema.albums.total_tracks,
        albumImages: ctx.schema.albums.images,
        external_urls: ctx.schema.albums.external_urls,
        uri: ctx.schema.albums.uri,
        href: ctx.schema.albums.href,
        artist: {
          id: ctx.schema.artists.id,
          name: ctx.schema.artists.name,
          popularity: ctx.schema.artists.popularity,
          followers: ctx.schema.artists.followers,
          genres: ctx.schema.artists.genres,
          images: ctx.schema.artists.images,
          external_urls: ctx.schema.artists.external_urls,
          uri: ctx.schema.artists.uri,
          href: ctx.schema.artists.href,
        },
      })
      .from(ctx.schema.albums)
      .innerJoin(
        ctx.schema.album_artists,
        drizzle.eq(ctx.schema.albums.id, ctx.schema.album_artists.album_id)
      )
      .innerJoin(
        ctx.schema.artists,
        drizzle.eq(ctx.schema.album_artists.artist_id, ctx.schema.artists.id)
      )
      .where(drizzle.eq(ctx.schema.albums.id, input.id))

    if (albumWithArtists.length === 0) {
      return null
    }

    const firstRow = albumWithArtists[0]
    const album = {
      id: firstRow.albumId,
      name: firstRow.albumName,
      album_type: firstRow.album_type,
      release_date: firstRow.release_date,
      release_date_precision: firstRow.release_date_precision,
      total_tracks: firstRow.total_tracks,
      images: firstRow.albumImages,
      external_urls: firstRow.external_urls,
      uri: firstRow.uri,
      href: firstRow.href,
      artists: albumWithArtists.map(row => row.artist),
    }

    return album
  })
