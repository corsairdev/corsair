/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `logEventFromContext` persists whatever it is handed, and those rows
 * inherit the event log's retention. Spreading a raw endpoint input would
 * therefore park user-authored content — contact fields, template bodies,
 * export filters, SMTP credentials from an update body — in the log
 * indefinitely.
 *
 * So only explicitly named identifier fields are recorded. The names of the
 * other supplied fields are kept, without their values, so an operator can
 * still see what a call attempted to change.
 */
/**
 * `unknown`, not a narrower value type: every endpoint's input schema has a
 * different shape, and this function never inspects a value beyond checking
 * it against `undefined` — narrowing here would gain nothing and would have
 * to be re-widened at every call site anyway.
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
