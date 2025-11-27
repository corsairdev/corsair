import { z } from 'zod'
import { procedure } from '@/corsair/procedure'
import { eq } from 'drizzle-orm'

/**
 * INPUT: { artistId: string, popularity: number }
 * OUTPUT: { success: boolean, updatedArtist?: Artist }
 * 
 * PSEUDO CODE:
 * 1. Accept artistId and popularity as input parameters
 * 2. Update the 'popularity' field in the artists table for the row matching the artistId
 * 3. Return success true if exactly one row was updated, else false
 * 4. Return the updated artist if update is successful
 * 
 * USER INSTRUCTIONS: update the popularity field of an artist by id in the artists table
 */
export const updateArtistPopularity = procedure
  .input(
    z.object({
      artistId: z.string(),
      popularity: z.number(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [updatedArtist] = await ctx.db
      .update(ctx.db._.fullSchema.artists)
      .set({ popularity: input.popularity })
      .where(eq(ctx.db._.fullSchema.artists.id, input.artistId))
      .returning()

    if (!updatedArtist) {
      return { success: false }
    }

    return { success: true, updatedArtist }
  })
