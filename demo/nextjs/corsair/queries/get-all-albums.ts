import { z } from 'corsair/core'
import { query } from '../instances'

export const getAllAlbums = query({
  prompt: 'get all albums',
  input_type: z.object({}),
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
    const albums = await ctx.db.select().from(ctx.schema.albums)
    return albums
  },
})
