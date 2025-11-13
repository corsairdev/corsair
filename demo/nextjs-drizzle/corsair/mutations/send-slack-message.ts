import { z } from 'corsair'
import { procedure } from '../procedure'
import { SlackChannels } from 'corsair/plugins'
import { type Config } from '@/corsair.config'

export const sendSlackMessage = procedure
  .input(
    z.object({
      slackChannel: z.array(z.string() as z.ZodType<SlackChannels<Config>>),
    })
  )
  .mutation(async ({ input, ctx }) => {
    return true
  })
