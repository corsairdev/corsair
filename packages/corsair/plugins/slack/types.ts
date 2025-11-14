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

export type SlackChannels<T extends BaseConfig> = keyof NonNullable<
  T['plugins']
>['slack']['channels'] &
  string

export type SlackMembers<T extends BaseConfig> = keyof NonNullable<
  T['plugins']
>['slack']['members'] &
  string
