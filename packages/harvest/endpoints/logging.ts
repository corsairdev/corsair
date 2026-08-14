/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `logEventFromContext` persists whatever it is handed, and those rows inherit
 * the event log's retention. Harvest inputs carry material a log should not
 * keep verbatim — contact email addresses, invoice notes, time-entry
 * descriptions of client work. Only explicitly named identifier fields are
 * recorded; the names of the remaining supplied fields are kept without their
 * values, so an operator can still see what a call requested without the log
 * becoming a copy of the account's contents.
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
