/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `logEventFromContext` persists whatever it is handed, and those rows inherit
 * the event log's retention. Spreading a raw endpoint input would therefore
 * park user-authored content — time entry descriptions, client and project
 * names, profile email and full name — in the log indefinitely.
 *
 * So only explicitly named identifier fields are recorded. The names of the
 * other supplied fields are kept, without their values, so an operator can
 * still see what a call attempted to change.
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
