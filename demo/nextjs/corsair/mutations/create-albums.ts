import { procedure } from '../'
import { z } from 'corsair'
import { inArray } from 'drizzle-orm'

export const createAlbums = procedure
  .input(
    z.object({
      albums: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          album_type: z.string(),
          release_date: z.string().optional(),
          release_date_precision: z.string().optional(),
          total_tracks: z.number().optional(),
          images: z.any().optional(),
          external_urls: z.any().optional(),
          uri: z.string().optional(),
          href: z.string().optional(),
          artist_ids: z.array(z.string()),
        })
      ),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const allArtistIds: string[] = [
      ...new Set(input.albums.flatMap(a => a.artist_ids)),
    ]
    if (allArtistIds.length > 0) {
      const existingArtists = await ctx.db
        .select({ id: ctx.schema.artists.columns.id })
        .from(ctx.db._.fullSchema.artists)
        .where(inArray(ctx.db._.fullSchema.artists.id, allArtistIds))
      const foundArtistIds = new Set(existingArtists.map(a => a.id))
      const missingIds = allArtistIds.filter(id => !foundArtistIds.has(id))
      if (missingIds.length > 0) {
        throw new Error(
          `Some artist_ids do not exist: ${missingIds.join(', ')}`
        )
      }
    }

    const createdAlbums = []
    for (const album of input.albums) {
      const [insertedAlbum] = await ctx.db
        .insert(ctx.db._.fullSchema.albums)
        .values({
          id: album.id,
          name: album.name,
          album_type: album.album_type,
          release_date: album.release_date,
          release_date_precision: album.release_date_precision,
          total_tracks: album.total_tracks,
          images: album.images,
          external_urls: album.external_urls,
          uri: album.uri,
          href: album.href,
        })
        .onConflictDoNothing()
        .returning()
      if (!insertedAlbum) {
        throw new Error(`Album with id '${album.id}' already exists.`)
      }

      for (const artist_id of album.artist_ids) {
        await ctx.db
          .insert(ctx.db._.fullSchema.album_artists)
          .values({
            album_id: album.id,
            artist_id: artist_id,
          })
          .onConflictDoNothing()
      }
      createdAlbums.push(insertedAlbum)
    }
    return createdAlbums
  })
