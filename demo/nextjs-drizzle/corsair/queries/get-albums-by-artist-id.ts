import { z } from 'corsair'
import { procedure } from '../procedure'
import { eq } from 'drizzle-orm'

export const getAlbumsByArtistId = procedure
  .input(
    z.object({
      artistId: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const albums = await ctx.db
      .select({
        id: ctx.schema.albums.columns.id,
        name: ctx.schema.albums.columns.name,
        album_type: ctx.schema.albums.columns.album_type,
        release_date: ctx.schema.albums.columns.release_date,
        release_date_precision:
          ctx.schema.albums.columns.release_date_precision,
        total_tracks: ctx.schema.albums.columns.total_tracks,
        images: ctx.schema.albums.columns.images,
        external_urls: ctx.schema.albums.columns.external_urls,
        uri: ctx.schema.albums.columns.uri,
        href: ctx.schema.albums.columns.href,
      })
      .from(ctx.db._.fullSchema.albums)
      .innerJoin(
        ctx.db._.fullSchema.album_artists,
        eq(
          ctx.db._.fullSchema.albums.id,
          ctx.schema.album_artists.columns.album_id
        )
      )
      .where(eq(ctx.db._.fullSchema.album_artists.artist_id, input.artistId))

    return albums
  })
