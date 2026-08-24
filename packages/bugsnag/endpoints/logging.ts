/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `logEventFromContext` persists whatever it is handed, and those rows inherit the
 * event log's retention. BugSnag carries three distinct kinds of material that must
 * not be copied there:
 *
 * - **End-user personal data.** A notifier can attach a `user` block with a name
 *   and email address to every event, plus arbitrary `metaData` and `request`
 *   contents - URLs, headers, IP addresses, whatever the application chose to send.
 *   Confirmed live: a seeded event returned
 *   `"user": {"id": ..., "name": ..., "email": ...}`.
 * - **Collaborator identities.** Names and email addresses of the people on the
 *   account.
 * - **Secrets.** An organization and a project each carry an `api_key`, and a
 *   project also carries `upload_api_key`. Logging either would put a live
 *   credential into durable storage.
 *
 * Only explicitly named identifier fields are recorded. The names of the remaining
 * supplied fields are kept without their values, so an operator can still see what
 * a call requested without the log becoming a copy of the account's contents.
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
		// `supplied_fields` rather than `fields`, so the list can never overwrite an
		// identifier that was copied above. No current operation has an input named
		// `fields`, but one named `display_id` or `path` already exists, and a provider
		// adding a `fields` parameter later would have silently replaced a recorded id
		// with this list - losing the identifier an audit trail is for.
		payload.supplied_fields = supplied;
	}

	return payload;
}

/**
 * Describes a collection without copying it.
 *
 * An error list carries messages that routinely contain user input, and an event
 * list carries per-event context, so a read is logged as a count of rows rather
 * than as its contents.
 */
export function countOf(value: readonly unknown[] | undefined | null): number {
	return value?.length ?? 0;
}
