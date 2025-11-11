import { z } from 'corsair'
import { procedure } from '../procedure'
import { eq } from 'drizzle-orm'

export const getAlbumByIdWithArtists = procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const albumWithArtists = await ctx.db
      .select({
        albumId: ctx.schema.albums.columns.id,
        albumName: ctx.schema.albums.columns.name,
        album_type: ctx.schema.albums.columns.album_type,
        release_date: ctx.schema.albums.columns.release_date,
        release_date_precision:
          ctx.schema.albums.columns.release_date_precision,
        total_tracks: ctx.schema.albums.columns.total_tracks,
        albumImages: ctx.schema.albums.columns.images,
        external_urls: ctx.schema.albums.columns.external_urls,
        uri: ctx.schema.albums.columns.uri,
        href: ctx.schema.albums.columns.href,
        artist: {
          id: ctx.schema.artists.columns.id,
          name: ctx.schema.artists.columns.name,
          popularity: ctx.schema.artists.columns.popularity,
          followers: ctx.schema.artists.columns.followers,
          genres: ctx.schema.artists.columns.genres,
          images: ctx.schema.artists.columns.images,
          external_urls: ctx.schema.artists.columns.external_urls,
          uri: ctx.schema.artists.columns.uri,
          href: ctx.schema.artists.columns.href,
        },
      })
      .from(ctx.db._.fullSchema.albums)
      .innerJoin(
        ctx.db._.fullSchema.album_artists,
        eq(
          ctx.schema.albums.columns.id,
          ctx.schema.album_artists.columns.album_id
        )
      )
      .innerJoin(
        ctx.db._.fullSchema.artists,
        eq(
          ctx.db._.fullSchema.album_artists.artist_id,
          ctx.schema.artists.columns.id
        )
      )
      .where(eq(ctx.db._.fullSchema.albums.id, input.id))

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
