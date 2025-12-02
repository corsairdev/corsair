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
        albumId: ctx.db._.fullSchema.albums.id,
        albumName: ctx.db._.fullSchema.albums.name,
        album_type: ctx.db._.fullSchema.albums.album_type,
        release_date: ctx.db._.fullSchema.albums.release_date,
        release_date_precision:
          ctx.db._.fullSchema.albums.release_date_precision,
        total_tracks: ctx.db._.fullSchema.albums.total_tracks,
        albumImages: ctx.db._.fullSchema.albums.images,
        external_urls: ctx.db._.fullSchema.albums.external_urls,
        uri: ctx.db._.fullSchema.albums.uri,
        href: ctx.db._.fullSchema.albums.href,
        artist: {
          id: ctx.db._.fullSchema.artists.id,
          name: ctx.db._.fullSchema.artists.name,
          popularity: ctx.db._.fullSchema.artists.popularity,
          followers: ctx.db._.fullSchema.artists.followers,
          genres: ctx.db._.fullSchema.artists.genres,
          images: ctx.db._.fullSchema.artists.images,
          external_urls: ctx.db._.fullSchema.artists.external_urls,
          uri: ctx.db._.fullSchema.artists.uri,
          href: ctx.db._.fullSchema.artists.href,
        },
      })
      .from(ctx.db._.fullSchema.albums)
      .innerJoin(
        ctx.db._.fullSchema.album_artists,
        eq(
          ctx.db._.fullSchema.albums.id,
          ctx.db._.fullSchema.album_artists.album_id
        )
      )
      .innerJoin(
        ctx.db._.fullSchema.artists,
        eq(
          ctx.db._.fullSchema.album_artists.artist_id,
          ctx.db._.fullSchema.artists.id
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
