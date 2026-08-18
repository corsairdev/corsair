/**
 * Builds the payload recorded in `corsair_events`.
 *
 * CircleCI inputs carry material a log should not keep verbatim: environment
 * variable values (masked by the API, but a mask is still part of a secret),
 * orb YAML source (may embed private implementation detail), and - on the
 * v1.1 job routes specifically - the triggering commit author's real email
 * address, which the API embeds in job-detail responses. None of that is
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
