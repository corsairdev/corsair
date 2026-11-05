/**
 * Shared helpers for Benchmark Email endpoint implementations.
 */

/**
 * Drops `undefined` query values so optional filters that were not supplied
 * are never sent to the API.
 */
export function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const out: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			out[key] = value;
		}
	}
	return out;
}

/**
 * Builds a safe audit-log payload that excludes the request body (`data`) and
 * any additional named sensitive fields.
 *
 * The classic API carries the request body on every mutation in `input.data`;
 * for credential routes that body is the entire input (a password, a PIN or a
 * login token), so spreading `{ ...input }` would write secrets straight into
 * `corsair_events.payload`. Dropping `data` (and PII keys such as an email
 * address) keeps only the operation metadata we want logged.
 *
 * @param input - The validated endpoint input.
 * @param dropKeys - Additional top-level keys (e.g. an email address) to strip.
 * @returns A shallow copy of `input` without the sensitive fields.
 */
export function eventLogPayload(
	input: Record<string, unknown>,
	dropKeys: readonly string[] = [],
): Record<string, unknown> {
	const excluded = new Set<string>(['data', ...dropKeys]);
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(input)) {
		if (!excluded.has(key)) {
			out[key] = value;
		}
	}
	return out;
}
