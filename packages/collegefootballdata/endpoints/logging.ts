/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `logEventFromContext` persists whatever it is handed, and those rows
 * inherit the event log's retention. Every operation in this catalog is a
 * read against public sports data - not the personal-data risk this
 * pattern guards against in Harvest/Mailtrap - but a free-text search term
 * (`SEARCH_PLAYERS`) or a long filter combination is still not worth
 * parking in the log indefinitely.
 *
 * So only explicitly named identifier fields are recorded. The names of the
 * other supplied fields are kept, without their values, so an operator can
 * still see what a call filtered on.
 */
export function auditPayload<T extends Record<string, unknown>>(
	input: T,
	identifierKeys: readonly (keyof T & string)[],
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};

	for (const key of identifierKeys) {
		if (input[key] !== undefined) {
			payload[key] = input[key];
		}
	}

	const supplied = Object.keys(input).filter((key) => input[key] !== undefined);
	if (supplied.length > 0) {
		payload.fields = supplied;
	}

	return payload;
}
