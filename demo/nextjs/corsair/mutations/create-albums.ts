import { mutation } from '../instances'
import { z } from 'corsair/core'
import { drizzle } from 'corsair/db/types'

export const createAlbums = mutation({
  prompt: 'create albums',
  input_type: z.object({
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
  }),
  handler: async (input, ctx) => {
    const allArtistIds: string[] = [
      ...new Set(input.albums.flatMap(a => a.artist_ids)),
    ]
    if (allArtistIds.length > 0) {
      const existingArtists = await ctx.db
        .select({ id: ctx.schema.artists.id })
        .from(ctx.schema.artists)
        .where(drizzle.inArray(ctx.schema.artists.id, allArtistIds))
      const foundArtistIds = new Set(existingArtists.map(a => a.id))
      const missingIds = allArtistIds.filter(id => !foundArtistIds.has(id))
      if (missingIds.length > 0) {
        throw new Error(
          `Some artist_ids do not exist: ${missingIds.join(', ')}`
        )
      }
    }

    // Insert albums and create album_artists relationships
    const createdAlbums = []
    for (const album of input.albums) {
      // Insert album
      const [insertedAlbum] = await ctx.db
        .insert(ctx.schema.albums)
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
        // Album with this id already exists: safe to continue or throw?
        throw new Error(`Album with id '${album.id}' already exists.`)
      }

      // Insert into album_artists
      for (const artist_id of album.artist_ids) {
        await ctx.db
          .insert(ctx.schema.album_artists)
          .values({
            album_id: album.id,
            artist_id: artist_id,
          })
          .onConflictDoNothing()
      }
      createdAlbums.push(insertedAlbum)
    }
    return createdAlbums
  },
})
