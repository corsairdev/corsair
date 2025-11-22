import type { BaseConfig } from '../../../config'
import type { SlackChannels } from '../types'

export const sendMessage = <T extends BaseConfig = any>({
  config,
  channelId,
  message,
}: {
  config?: T
  channelId: SlackChannels<T>
  message: string
}) => {
  console.log(`[Slack] Sending message to ${channelId}: ${message}`)
  return {
    success: true,
    messageId: `msg_${Date.now()}`,
    timestamp: new Date().toISOString(),
  }
}
