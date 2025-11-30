import { WebClient } from '@slack/web-api'
import { BaseConfig } from '../../../config'
import { SlackChannels, MessageTs, MessagesResponse } from '../types'

export const getMessages = async <T extends BaseConfig = any>({
  config,
  channelId,
  options = {},
}: {
  config?: T
  channelId: SlackChannels<T>
  options?: {
    limit?: number // default 100, max 1000
    oldest?: MessageTs // only messages after this timestamp
    latest?: MessageTs // only messages before this timestamp
    cursor?: string // for pagination
  }
}): Promise<MessagesResponse> => {
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
    // Default limit to 100, max 1000
    const limit = Math.min(options.limit || 100, 1000)

    // Call Slack API to get messages
    const result = await client.conversations.history({
      channel: actualChannelId,
      limit,
      oldest: options.oldest,
      latest: options.latest,
      cursor: options.cursor,
    })

    // Return success response with messages
    return {
      success: true,
      data: {
        messages: (result.messages || []) as Array<{
          type: string
          user?: string
          text: string
          ts: MessageTs
          thread_ts?: MessageTs
        }>,
        hasMore: result.has_more || false,
        nextCursor: result.response_metadata?.next_cursor,
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
