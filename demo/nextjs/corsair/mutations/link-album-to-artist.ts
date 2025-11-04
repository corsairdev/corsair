import { createMutation, z } from 'corsair/core'
import { type DatabaseContext } from '../types'

const mutation = createMutation<DatabaseContext>()

export const linkAlbumToArtist = mutation({
  prompt: 'link album to artist',
  input_type: z.object({
    albumId: z.string(),
    artistId: z.string(),
  }),
  // response_type: drizzleZod.createSelectSchema(schema.album_artists),
  dependencies: {
    tables: ['album_artists'],
    columns: ['album_artists.album_id', 'album_artists.artist_id'],
  },
  handler: async (input, ctx) => {
    const [link] = await ctx.db
      .insert(ctx.schema.album_artists)
      .values({
        album_id: input.albumId,
        artist_id: input.artistId,
      })
      .returning()

    return link
  },
})
