/**
 * Builds the payload recorded in `corsair_events`.
 *
 * Doppler inputs carry material a log should not keep verbatim: secret
 * values, Doppler Share passwords and encrypted payloads, and workplace
 * users' real names/emails embedded in some list responses. None of that is
 * ever passed to `identifierKeys`.
 */
export function auditPayload<T extends Record<string, unknown>>(
	input: T,
	identifierKeys: readonly (keyof T & string)[],
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};
	for (const key of identifierKeys) {
		if (input[key] !== undefined) payload[key] = input[key];
	}
	const supplied = Object.keys(input).filter((key) => input[key] !== undefined);
	if (supplied.length > 0) payload.fields = supplied;
	return payload;
}

/** Describes a collection without copying it. */
export function countOf(value: readonly unknown[] | undefined | null): number {
	return value?.length ?? 0;
}
