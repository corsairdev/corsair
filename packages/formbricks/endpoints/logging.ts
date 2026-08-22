/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `logEventFromContext` persists whatever it is handed, and those rows inherit the event log's
 * retention. Formbricks carries material that must not be copied there, and the balance is
 * different from most providers: **the sensitive data mostly belongs to third parties, not to
 * the API caller.**
 *
 * - **Survey respondents' answers.** A response's `data` is whatever the survey asked, `meta`
 *   carries their URL, user agent and country, and `contactAttributes` can carry their email
 *   address. A survey exists to collect this, so it is the common case rather than an edge one.
 * - **Contact identities.** A contact's `attributes` holds email, name and whatever else the
 *   workspace collects about a person.
 * - **A webhook signing secret.** `POST v1/webhooks` returns `secret` on the create response
 *   only. Logging it would put a live credential in durable storage.
 *
 * Only explicitly named identifier fields are recorded. The *names* of the remaining supplied
 * fields are kept without their values, so an operator can see what a call requested without
 * the log becoming a copy of the workspace's respondents.
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
		// `supplied_fields` rather than `fields`, so this list can never overwrite an identifier
		// copied above. No current operation has an input named `fields`, but a provider adding
		// one later would silently have replaced a recorded id with this list.
		payload.supplied_fields = supplied;
	}

	return payload;
}

/**
 * Describes a collection without copying it.
 *
 * A response list is the clearest case: every row is someone's survey answers, so a read is
 * logged as a count of rows rather than as its contents.
 */
export function countOf(value: readonly unknown[] | undefined | null): number {
	return value?.length ?? 0;
}

/**
 * Names the keys of a caller-supplied object without recording its values.
 *
 * Used for the places where the *shape* of a request is worth auditing but its contents are
 * not: which attributes a contact was created with, which question ids a response answered.
 * Knowing an operator set `email` is useful; recording the address is not.
 */
export function keyNamesOf(value: unknown): string[] {
	if (value === null || typeof value !== 'object' || Array.isArray(value))
		return [];
	return Object.keys(value as Record<string, unknown>);
}
