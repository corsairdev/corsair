import { WebClient } from '@slack/web-api'
import { type BaseConfig } from '../../../config'
import { type SlackChannels, type MessageResponse } from '../types'

export const sendMessage = async <T extends BaseConfig = any>({
  config,
  channelId,
  content,
}: {
  config?: T
  channelId: SlackChannels<T>
  content: string
}): Promise<MessageResponse> => {
  // Validate that Slack token is configured
  if (!config?.plugins?.slack?.token) {
    return {
      success: false,
      error:
        'Slack token not configured. Please add token to corsair.config.ts plugins.slack.token',
    }
  }

  // Look up actual channel ID from config using the friendly name
  const actualChannelId = config.plugins.slack.channels?.[channelId]
  if (!actualChannelId) {
    const availableChannels = Object.keys(
      config.plugins.slack.channels || {}
    ).join(', ')
    return {
      success: false,
      error: `Channel '${channelId}' not found in config. Available channels: ${availableChannels}`,
    }
  }

  // Initialize Slack WebClient
  const client = new WebClient(config.plugins.slack.token)

  try {
    // Call Slack API to send message
    const result = await client.chat.postMessage({
      channel: actualChannelId,
      text: content,
    })

    // Return success response with message details
    return {
      success: true,
      data: {
        messageId: result.ts as string,
        channel: result.channel as string,
        timestamp: result.ts as string,
      },
    }
  } catch (error) {
    // Handle any Slack API errors
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
