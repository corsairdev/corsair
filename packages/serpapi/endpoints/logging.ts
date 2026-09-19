/**
 * Builds an event-log payload that keeps structural identifiers but drops
 * free text a caller might have supplied - a search query, a URL, a review
 * id are the caller's own input, not something worth persisting into the
 * audit trail verbatim (matches this repo's established discipline of
 * keeping search terms and free-text fields out of logged payloads).
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
