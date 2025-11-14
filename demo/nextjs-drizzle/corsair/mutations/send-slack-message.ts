import { z } from 'corsair'
import { procedure } from '../procedure'
import { SlackChannels } from 'corsair/plugins/types'
import { type Config } from '@/corsair.config'

export const sendSlackMessage = procedure
  .input(
    z.object({
      channel: z.string() as z.ZodType<SlackChannels<Config>>,
      message: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const slack = ctx.plugins.slack.sendMessage({
      channelId: 'general',
      message: '',
    })

    // return slack.sendMessage({
    //   channelId: input.channel,
    //   message: input.message,
    // })

    return true
  })
