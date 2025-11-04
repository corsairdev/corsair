import { z } from 'corsair/core'
import { query } from '../instances'
import { drizzle } from 'corsair/db/types'

export const searchAlbums = query({
  prompt: 'search albums',
  input_type: z.object({
    query: z.string(),
  }),
  // response_type: z.array(drizzleZod.createSelectSchema(schema.albums)),
  dependencies: {
    tables: ['albums'],
    columns: [
      'albums.id',
      'albums.name',
      'albums.album_type',
      'albums.release_date',
      'albums.total_tracks',
      'albums.images',
    ],
  },
  handler: async (input, ctx) => {
    const albums = await ctx.db
      .select()
      .from(ctx.schema.albums)
      .where(drizzle.ilike(ctx.schema.albums.name, `%${input.query}%`))

    return albums
  },
})
