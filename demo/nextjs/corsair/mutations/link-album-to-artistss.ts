import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const linkAlbumToArtistss = procedure
  .input(
    z.object({
      albumId: z.string().min(1, 'albumId is required'),
      artistIds: z
        .array(z.string().min(1, 'artistId required'))
        .min(1, 'At least one artistId required'),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [album] = await ctx.db
      .select({ id: ctx.schema.albums.id })
      .from(ctx.schema.albums)
      .where(drizzle.eq(ctx.schema.albums.id, input.albumId))
      .limit(1)
    if (!album) {
      throw new Error('Album not found')
    }

    const artists = await ctx.db
      .select({ id: ctx.schema.artists.id })
      .from(ctx.schema.artists)
      .where(drizzle.inArray(ctx.schema.artists.id, input.artistIds))

    const foundArtistIds = new Set(artists.map(a => a.id))
    const missing = input.artistIds.filter(id => !foundArtistIds.has(id))
    if (missing.length > 0) {
      throw new Error(`Artist(s) not found: ${missing.join(', ')}`)
    }

    const existingLinks = await ctx.db
      .select({ artist_id: ctx.schema.album_artists.artist_id })
      .from(ctx.schema.album_artists)
      .where(
        drizzle.and(
          drizzle.eq(ctx.schema.album_artists.album_id, input.albumId),
          drizzle.inArray(ctx.schema.album_artists.artist_id, input.artistIds)
        )
      )
    const alreadyLinked = new Set(existingLinks.map(e => e.artist_id))

    const newLinks = input.artistIds
      .filter(artistId => !alreadyLinked.has(artistId))
      .map(artistId => ({ album_id: input.albumId, artist_id: artistId }))

    let inserted = [] as any[]
    if (newLinks.length > 0) {
      inserted = await ctx.db
        .insert(ctx.schema.album_artists)
        .values(newLinks)
        .returning()
    }

    const allLinks = await ctx.db
      .select({
        id: ctx.schema.album_artists.id,
        album_id: ctx.schema.album_artists.album_id,
        artist_id: ctx.schema.album_artists.artist_id,
      })
      .from(ctx.schema.album_artists)
      .where(drizzle.eq(ctx.schema.album_artists.album_id, input.albumId))

    return allLinks
  })
