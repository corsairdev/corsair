import { BaseConfig } from '../../config'

export interface SlackPlugin {
  /**
   * Slack API token
   */
  token: string
  /**
   * All channels.
   * `[{
   *   'name-of-channel': 'id-of-channel'
   * }]`
   */
  channels?: Record<string, string>

  /**
   * People
   * `[{
   *   'name-of-person': 'id-of-person'
   * }]`
   */
  members?: Record<string, string>
}

export type BaseSlackPluginResponse<T extends Record<string, any>> = {
  success: boolean
  data?: T 
  error?: string
  
}

export type SlackChannels<T extends BaseConfig> = keyof NonNullable<
  T['plugins']
>['slack']['channels'] &
  string

export type SlackMembers<T extends BaseConfig> = keyof NonNullable<
  T['plugins']
>['slack']['members'] &
  string

// Message timestamp type (Slack uses this for message IDs)
export type MessageTs = string

// Emoji name type
export type EmojiName = string


// Response type for sendMessage, replyToThread, and updateMessage operations
export type MessageResponse = BaseSlackPluginResponse<{
  messageId: MessageTs
  channel: string
  timestamp: MessageTs
  }>
  
// Message type for individual Slack messages
export interface SlackMessage {
  type: string
  user?: string
  text: string
  ts: MessageTs
  thread_ts?: MessageTs
}

// Response type for getMessages operation
export type MessagesResponse = BaseSlackPluginResponse<{
  messages: SlackMessage[]
  hasMore: boolean
  nextCursor?: string
}>

// Response type for addReaction operation
export type ReactionResponse = BaseSlackPluginResponse<{
  ok: boolean
}>

// Channel type for Slack channels
export interface SlackChannel {
  id: string
  name: string
  is_private: boolean
  is_archived: boolean
}

// Response type for getChannels operation
export type ChannelsResponse = BaseSlackPluginResponse<{
  channels: SlackChannel[]
  hasMore: boolean
  nextCursor?: string
}>
