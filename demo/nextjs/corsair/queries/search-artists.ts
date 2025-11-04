import { createQuery, z } from 'corsair/core'
import { type DatabaseContext } from '../types'
import { drizzle } from 'corsair/db/types'

const query = createQuery<DatabaseContext>()

export const searchArtists = query({
  prompt: 'search artists',
  input_type: z.object({
    query: z.string(),
  }),
  // response_type: z.array(drizzleZod.createSelectSchema(schema.artists)),
  dependencies: {
    tables: ['artists'],
    columns: [
      'artists.id',
      'artists.name',
      'artists.popularity',
      'artists.followers',
      'artists.genres',
      'artists.images',
    ],
  },
  handler: async (input, ctx) => {
    const artists = await ctx.db
      .select()
      .from(ctx.schema.artists)
      .where(drizzle.ilike(ctx.schema.artists.name, `%${input.query}%`))

    return artists
  },
})
