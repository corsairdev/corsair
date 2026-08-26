/**
 * Field names that are never safe to log the *value* of, anywhere in this
 * plugin. Phase 1's own resources (brands, brand properties, fields, lists,
 * connections, message types, senders) carry no genuinely secret value in
 * any documented response - BigMailer's connection/sender objects never echo
 * the underlying AWS SES credential or DNS-verification secret back through
 * this API surface, confirmed against every `/reference/*.md` page fetched
 * this session. `logo` is excluded on size/hygiene grounds (a base64-encoded
 * image, not something an audit log should carry), and the rest
 * (`key`/`secret`/`token`/`password`/`api_key`/`apikey`) are declared ahead
 * of need for later phases (contacts, templates, transactional campaigns)
 * that may introduce genuinely sensitive fields - the same "second,
 * independent guarantee" reasoning Doppler's `logging.ts` uses.
 */
const NEVER_LOG_VALUE = new Set([
	'logo',
	'key',
	'secret',
	'token',
	'password',
	'api_key',
	'apikey',
	/**
	 * A contact's email address - personal data. Deny-listed by key name as a
	 * second, independent guarantee alongside `contacts.ts` never passing
	 * `contactId` as an identifier key either (that path parameter is itself
	 * documented as accepting an email address in place of an id, so a
	 * deny-list keyed only on the literal name `email` would not have caught
	 * it - see `contacts.ts`'s own audit-payload comments).
	 */
	'email',
]);

/** Own-property names that must never be assigned via bracket notation - see `auditPayload`. */
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Builds the payload recorded in `corsair_events`.
 *
 * `identifierKeys` is a hardcoded literal array at every call site in this
 * plugin today, never derived from external input, so `__proto__` cannot
 * currently reach `payload[key] = ...` - but a null-prototype object plus an
 * explicit skip costs nothing and removes the question entirely for any call
 * site added later.
 */
export function auditPayload<T extends Record<string, unknown>>(
	input: T,
	identifierKeys: readonly (keyof T & string)[],
): Record<string, unknown> {
	const payload: Record<string, unknown> = Object.create(null);
	for (const key of identifierKeys) {
		if (UNSAFE_KEYS.has(key) || NEVER_LOG_VALUE.has(key.toLowerCase())) {
			continue;
		}
		if (input[key] !== undefined) payload[key] = input[key];
	}
	const supplied = Object.keys(input).filter(
		(key) =>
			input[key] !== undefined && !NEVER_LOG_VALUE.has(key.toLowerCase()),
	);
	if (supplied.length > 0) payload.fields = supplied;
	return payload;
}

/** Describes a collection without copying it. */
export function countOf(value: readonly unknown[] | undefined | null): number {
	return value?.length ?? 0;
}
