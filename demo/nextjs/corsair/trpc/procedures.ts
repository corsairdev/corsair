import { createCorsairTRPC, z } from 'corsair'
import { type DatabaseContext, schema } from '../types'
import { drizzle } from 'corsair/db/types'

// Initialize tRPC with proper context typing using the core factory
const t = createCorsairTRPC<DatabaseContext>()
export const { router, procedure } = t

// Example Query: "get artist by id" written as tRPC procedure
export const getArtistById = procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const [artist] = await ctx.db
      .select()
      .from(ctx.schema.artists)
      .where(drizzle.eq(ctx.schema.artists.id, input.id))
      .limit(1)

    return artist || null
  })

// Example Mutation: "update artist popularity" written as tRPC procedure
export const updateArtistPopularity = procedure
  .input(
    z.object({
      artistId: z.string(),
      popularity: z.number().min(0).max(100),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [artist] = await ctx.db
      .update(ctx.schema.artists)
      .set({
        popularity: Math.max(0, Math.min(100, input.popularity)),
      })
      .where(drizzle.eq(ctx.schema.artists.id, input.artistId))
      .returning()

    return artist || null
  })

const createAlbum = procedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      album_type: z.string(),
      release_date: z.string(),
      release_date_precision: z.string(),
      total_tracks: z.number(),
      images: z.any(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [album] = await ctx.db
      .insert(ctx.schema.albums)
      .values(input)
      .returning()
    return album
  })

const getAllArtists = procedure
  .input(z.object({}))
  .query(async ({ input, ctx }) => {
    const artists = await ctx.db.select().from(ctx.schema.artists)
    return artists
  })

const getAllAlbums = procedure
  .input(z.object({}))
  .query(async ({ input, ctx }) => {
    const albums = await ctx.db.select().from(ctx.schema.albums)
    return albums
  })

const getAlbumsByArtistId = procedure
  .input(z.object({ artistId: z.string() }))
  .query(async ({ input, ctx }) => {
    const albums = await ctx.db
      .select()
      .from(ctx.schema.albums)
      // this is wrong but i just have it like this for now
      .where(drizzle.eq(ctx.schema.albums.id, input.artistId))
    return albums
  })

// New tRPC router using procedure syntax with natural language keys
export const corsairProcedureRouter = router({
  'get artist by id': getArtistById,
  'get all artists': getAllArtists,
  'get all albums': getAllAlbums,
  'get albums by artist id': getAlbumsByArtistId,
  'update artist popularity': updateArtistPopularity,
  'create album': createAlbum,

  // Example of a more complex query with joins
  'get album by id with artists': procedure
    .input(z.object({ id: z.string() }))
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

      // Group artists for the album
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
    }),

  // Example search query
  'search artists': procedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input, ctx }) => {
      const artists = await ctx.db
        .select()
        .from(ctx.schema.artists)
        .where(drizzle.ilike(ctx.schema.artists.name, `%${input.query}%`))

      return artists
    }),
})

export type CorsairProcedureRouter = typeof corsairProcedureRouter
