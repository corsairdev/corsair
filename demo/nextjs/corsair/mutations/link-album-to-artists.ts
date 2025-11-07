import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const linkAlbumToArtists = procedure
  .input(
    z.object({
      albumId: z.string(),
      artistIds: z.array(z.string()),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { albumId, artistIds } = input

    const [album] = await ctx.db
      .select({ id: ctx.schema.albums.id })
      .from(ctx.schema.albums)
      .where(drizzle.eq(ctx.schema.albums.id, albumId))
      .limit(1)
    if (!album) {
      throw new Error(`Album with id '${albumId}' does not exist.`)
    }

    const existingArtistRows = await ctx.db
      .select({ id: ctx.schema.artists.id })
      .from(ctx.schema.artists)
      .where(drizzle.inArray(ctx.schema.artists.id, artistIds))
    const foundArtistIds = new Set(existingArtistRows.map(a => a.id))
    const missingArtistIds = artistIds.filter(id => !foundArtistIds.has(id))
    if (missingArtistIds.length > 0) {
      throw new Error(
        `These artistIds do not exist: ${missingArtistIds.join(', ')}`
      )
    }

    const existingLinks = await ctx.db
      .select({ artist_id: ctx.schema.album_artists.artist_id })
      .from(ctx.schema.album_artists)
      .where(
        drizzle.and(
          drizzle.eq(ctx.schema.album_artists.album_id, albumId),
          drizzle.inArray(ctx.schema.album_artists.artist_id, artistIds)
        )
      )
    const alreadyLinkedSet = new Set(existingLinks.map(l => l.artist_id))

    const newLinks = artistIds.filter(id => !alreadyLinkedSet.has(id))
    if (newLinks.length === 0) {
      const allLinks = await ctx.db
        .select()
        .from(ctx.schema.album_artists)
        .where(drizzle.eq(ctx.schema.album_artists.album_id, albumId))
      return allLinks
    }

    const insertRows = newLinks.map(artist_id => ({
      album_id: albumId,
      artist_id,
    }))

    const inserted = await ctx.db
      .insert(ctx.schema.album_artists)
      .values(insertRows)
      .returning()

    const allLinks = await ctx.db
      .select()
      .from(ctx.schema.album_artists)
      .where(drizzle.eq(ctx.schema.album_artists.album_id, albumId))

    return allLinks
  })
