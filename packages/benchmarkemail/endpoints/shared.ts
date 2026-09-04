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
