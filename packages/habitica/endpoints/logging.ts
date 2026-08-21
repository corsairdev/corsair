/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `logEventFromContext` persists whatever it is handed, and those rows inherit
 * the event log's retention. Habitica inputs carry material a log should not
 * keep verbatim: task titles and notes are the account holder's own writing and
 * can be about anything, chat and inbox messages are private correspondence,
 * profile text and display names identify a person, and group invitations are
 * given by email address or username.
 *
 * Only explicitly named identifier fields are recorded. The names of the
 * remaining supplied fields are kept without their values, so an operator can
 * still see what a call requested without the log becoming a copy of the
 * account's private data.
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
 * A task's checklist and a group invitation's recipient list both hold values
 * that should not reach the log, so they are recorded as a count.
 */
export function countOf(value: readonly unknown[] | undefined | null): number {
	return value?.length ?? 0;
}

/**
 * The audit payload for the three credential-minting operations.
 *
 * `LOCAL_REGISTER`, `LOCAL_LOGIN` and `SOCIAL_AUTH` are the only operations
 * whose inputs are themselves credentials - a password, or a third-party OAuth
 * token. {@link auditPayload} is not safe for them even with an empty
 * identifier list, because it records the *names* of the supplied fields, and
 * `fields: ["username","password"]` in a retained log is a standing invitation
 * to widen it later into the values.
 *
 * These calls therefore record that an attempt happened and nothing else. Not
 * the email, not the username, not the network. An operator can still see the
 * call in the log and correlate it by timestamp; they cannot learn who it was
 * for. This is deliberately stricter than every other operation in the plugin.
 */
export function credentialAuditPayload(): Record<string, unknown> {
	return {
		recorded: 'attempt only - inputs are credentials and are not logged',
	};
}
