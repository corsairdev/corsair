/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `logEventFromContext` persists whatever it is handed, and those rows inherit
 * the event log's retention. Beeminder inputs can carry sensitive data, so
 * only explicitly named identifier fields are recorded.
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
