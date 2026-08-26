/**
 * Field names that are never safe to log the *value* of, anywhere in this
 * plugin: secret values (`secrets`, `raw`, `computed`), a Doppler Share
 * link's password and its encryption inputs (`password`, `hashedPassword`,
 * `encryptedSecret`), a service token's issued credential (`key`), a generic
 * `token`, and a webhook's signing configuration (`authentication`).
 *
 * Every current call site already lists only identifier fields in
 * `identifierKeys`, so this deny-list is not fixing an active leak - it is
 * a second, independent guarantee that does not depend on every future call
 * site getting that right by hand. Checked case-insensitively so a renamed
 * or differently-cased field (e.g. a nested `Password`) is
 * still caught.
 */
const NEVER_LOG_VALUE = new Set([
	'secrets',
	'raw',
	'computed',
	'password',
	'hashedpassword',
	'encryptedsecret',
	'key',
	'token',
	'authentication',
]);

/**
 * Builds the payload recorded in `corsair_events`.
 *
 * Doppler inputs carry material a log should not keep verbatim: secret
 * values, Doppler Share passwords and encrypted payloads, and workplace
 * users' real names/emails embedded in some list responses. None of that is
 * ever passed to `identifierKeys` by any current call site, and
 * `NEVER_LOG_VALUE` above enforces it even if one someday is.
 */
export function auditPayload<T extends Record<string, unknown>>(
	input: T,
	identifierKeys: readonly (keyof T & string)[],
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};
	for (const key of identifierKeys) {
		if (NEVER_LOG_VALUE.has(key.toLowerCase())) continue;
		if (input[key] !== undefined) payload[key] = input[key];
	}
	const supplied = Object.keys(input).filter(
		(key) =>
			input[key] !== undefined && !NEVER_LOG_VALUE.has(key.toLowerCase()),
	);
	if (supplied.length > 0) payload.fields = supplied;
	return payload;
}
