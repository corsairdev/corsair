import { z } from 'corsair'
import { procedure } from '../trpc/procedures'

export const linkTrackToArtist = procedure
  .input(
    z.object({
      trackId: z.string(),
      artistId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [link] = await ctx.db
      .insert(ctx.schema.track_artists)
      .values({
        track_id: input.trackId,
        artist_id: input.artistId,
      })
      .returning()

    return link
  })
