/**
 * Field names that are never safe to log the *value* of, anywhere in this
 * plugin.
 *
 * `connection` is deny-listed for a confirmed-live reason, not a
 * precautionary one: creating an external connector with `password`/`user`
 * inside its `connection` object gets that same `password` echoed back in
 * plaintext on every subsequent GET and in the LIST envelope - BigML's own
 * API behaviour. `password`/`user`/`host`/`port`/`database` are deny-listed
 * individually too, in case a future operation ever surfaces one of them
 * outside the `connection` wrapper.
 */
const NEVER_LOG_VALUE = new Set([
	'connection',
	'password',
	'user',
	'host',
	'hosts',
	'port',
	'database',
	'http_auth',
	'key',
	'secret',
	'token',
	'api_key',
	'apikey',
]);

/** Builds the payload recorded in `corsair_events`. */
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

/** Describes a collection without copying it. */
export function countOf(value: readonly unknown[] | undefined | null): number {
	return value?.length ?? 0;
}
