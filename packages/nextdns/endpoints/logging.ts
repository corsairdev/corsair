/**
 * Builds an event-log payload that keeps structural identifiers (ids,
 * booleans, counts) but drops free text a caller might have supplied - a
 * domain being added to a denylist/allowlist/rewrite is filtering
 * configuration, not secret, but a profile's `name` or a rewrite's target
 * `content` is closer to user-authored text than an identifier, so it stays
 * out of the log the same way this repo's other plugins keep search terms
 * and free-text fields out of audit payloads.
 */
export function auditPayload<T extends Record<string, unknown>>(
	input: T,
	identifierKeys: readonly (keyof T)[],
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};
	for (const key of identifierKeys) {
		if (input[key] !== undefined) payload[key as string] = input[key];
	}
	return payload;
}
