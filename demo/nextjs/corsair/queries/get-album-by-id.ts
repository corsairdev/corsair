import { createQuery, z } from 'corsair/core'
import { type DatabaseContext } from '../types'
import { drizzle } from 'corsair/db/types'

const query = createQuery<DatabaseContext>()

export const getAlbumById = query({
  prompt: 'get album by id',
  input_type: z.object({
    id: z.string(),
  }),
  // response_type: drizzleZod.createSelectSchema(schema.albums).nullable(),
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
    const [album] = await ctx.db
      .select()
      .from(ctx.schema.albums)
      .where(drizzle.eq(ctx.schema.albums.id, input.id))
      .limit(1)

    return album || null
  },
})
