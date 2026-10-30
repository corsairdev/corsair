/**
 * Field names that are never safe to log the *value* of, anywhere in this
 * plugin. Bubble thing fields are caller-defined, so a record's field names
 * cannot be enumerated in advance; any of these names appearing among a
 * thing's fields is denied from the audit log. `api_key`/`token`/`secret`
 * also defend against a stored key ever leaking into `corsair_events`.
 */
const NEVER_LOG_VALUE = new Set([
	'password',
	'api_key',
	'apikey',
	'key',
	'token',
	'secret',
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
