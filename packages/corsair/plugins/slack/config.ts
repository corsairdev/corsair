// {
// /**
//  * ID of Slack channel.
//  */
// id: string
// /**
//  * Exact name of Slack channel (e.g. general).
//  * This is what Corsair will use when you instruct something like "send a message to the general channel about the new signup"
//  */
// name: string
// }[]
export interface SlackPlugin {
  /**
   * All channels.
   * `[{
   *   'name-of-channel': 'id-of-channel'
   * }]`
   */
  channels?: Record<string, string>

  /**
   * Specific people. Useful for mentions.
   */
  people?: {
    /**
     * ID of Person.
     */
    id: string
    /**
     * Name of Person.
     * This is what Corsair will use when you instruct something like "tag John Smith on the message to #general"
     */
    name: string
  }[]
}
