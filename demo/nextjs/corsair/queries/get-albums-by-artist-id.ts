import { z } from 'corsair/core'
import { query } from '../instances'
import { drizzle } from 'corsair/db/types'

export const getAlbumsByArtistId = query({
  prompt: 'get albums by artist id',
  input_type: z.object({
    artistId: z.string(),
  }),
  // response_type: z.array(drizzleZod.createSelectSchema(schema.albums)),
  dependencies: {
    tables: ['albums', 'album_artists'],
    columns: [
      'albums.id',
      'albums.name',
      'albums.album_type',
      'albums.release_date',
      'albums.total_tracks',
      'albums.images',
      'album_artists.artist_id',
      'album_artists.album_id',
    ],
  },
  handler: async (input, ctx) => {
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
  },
})
