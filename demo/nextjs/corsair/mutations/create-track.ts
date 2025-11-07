import { procedure } from '../trpc/procedures'
import { z } from 'corsair'

export const createTrack = procedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      disc_number: z.number().optional(),
      duration_ms: z.number().optional(),
      explicit: z.boolean().optional(),
      track_number: z.number().optional(),
      preview_url: z.string().optional(),
      is_local: z.boolean().optional(),
      external_urls: z.any().optional(),
      uri: z.string().optional(),
      href: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [track] = await ctx.db
      .insert(ctx.schema.tracks)
      .values({ ...input })
      .returning()

    return track
  })
