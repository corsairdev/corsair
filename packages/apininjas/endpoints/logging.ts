/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `logEventFromContext` persists whatever it is handed, and those rows inherit
 * the event log's retention, so spreading a raw endpoint input would park
 * caller data in the log indefinitely. Most inputs on this API are impersonal
 * lookup keys - a ticker, an ISO country code, an airport IATA code - but
 * several are not: email validation and the disposable-domain check take an
 * email address, phone validation takes a number, IP lookup takes an address,
 * and sentiment, similarity, embeddings, spell check, profanity filtering,
 * language detection, scraping and nutrition all take arbitrary caller text.
 *
 * So only explicitly named identifier fields are recorded by value, the names
 * of the other supplied fields are recorded without their values, and anything
 * in {@link SENSITIVE_KEYS} is reduced to a length even if a caller names it as
 * an identifier.
 */

/** Inputs that carry caller content rather than a lookup key. */
const SENSITIVE_KEYS = new Set([
	'address',
	'data',
	'email',
	'ingredients',
	'number',
	'puzzle',
	'query',
	'text',
	'text_1',
	'text_2',
	'title',
	'url',
]);

/** Size of a value, for a field whose content must not be logged. */
function sizeOf(value: unknown): number | undefined {
	if (typeof value === 'string') return value.length;
	if (Array.isArray(value)) return value.length;
	return undefined;
}

export function auditPayload<T extends Record<string, unknown>>(
	input: T,
	identifierKeys: readonly (keyof T & string)[],
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};

	for (const key of identifierKeys) {
		const value = input[key];
		if (value === undefined) continue;
		if (SENSITIVE_KEYS.has(key)) continue;
		payload[key] = value;
	}

	const supplied = Object.keys(input).filter((key) => input[key] !== undefined);
	if (supplied.length > 0) {
		payload.fields = supplied;
	}

	for (const key of supplied) {
		if (!SENSITIVE_KEYS.has(key)) continue;
		const size = sizeOf(input[key]);
		if (size !== undefined) {
			payload[`${key}_length`] = size;
		}
	}

	return payload;
}

/** Records how many rows an operation returned, without recording the rows. */
export function withCount(
	payload: Record<string, unknown>,
	result: unknown,
): Record<string, unknown> {
	if (Array.isArray(result)) {
		return { ...payload, result_count: result.length };
	}
	return payload;
}
