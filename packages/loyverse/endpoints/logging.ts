/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `logEventFromContext` persists whatever it is handed, and those rows inherit
 * the event log's retention. Loyverse inputs carry material a log should not
 * keep verbatim: customer names, email addresses, phone numbers and postal
 * addresses, employee contact details, supplier contacts, and the free-text
 * `note` and per-line `line_note` fields on receipts.
 *
 * Only explicitly named identifier fields are recorded. The names of the
 * remaining supplied fields are kept without their values, so an operator can
 * still see what a call requested without the log becoming a copy of the
 * account's customer list.
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

/**
 * Describes a collection without copying it.
 *
 * Receipt line items carry item names and per-line notes, so a receipt is
 * logged as a count of lines rather than as its contents.
 */
export function countOf(value: readonly unknown[] | undefined | null): number {
	return value?.length ?? 0;
}
