/**
 * Entity id construction for the plugin's local cache.
 *
 * Every writer to a cached table has to agree on the key, otherwise the same
 * provider record is stored twice and later updates or deletes only reach one
 * of the copies. These helpers are the single place those keys are built.
 */

/**
 * Key for `db.messages`.
 *
 * Slack scopes `ts` to a channel, so it is not unique on its own: the same
 * timestamp can occur in two channels and would collide on a store keyed by
 * the timestamp alone, silently overwriting one message with the other. The
 * channel qualifies it.
 *
 * Both the webhook handlers and the `chat.*` endpoints write to `db.messages`,
 * so both must key through here. Keying one side on a bare `ts` splits a single
 * message across two rows.
 */
export function messageEntityId(channel: string, ts: string): string {
	return `${channel}:${ts}`;
}
