import { mutation } from '../instances'
import { schema } from '../types'

export const createAlbum = mutation({
  prompt: 'create album',
  input_type: schema.albums._.inferInsert,
  // response_type: drizzleZod.createSelectSchema(schema.albums),
  dependencies: {
    tables: ['albums'],
    columns: [
      'albums.id',
      'albums.name',
      'albums.album_type',
      'albums.release_date',
      'albums.total_tracks',
    ],
  },
  handler: async (input, ctx) => {
    const [album] = await ctx.db
      .insert(ctx.schema.albums)
      .values({ ...input })
      .returning()

    return album
  },
})
