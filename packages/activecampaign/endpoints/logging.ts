/**
 * Builds the payload recorded in `corsair_events` for an operation.
 *
 * ActiveCampaign inputs carry personal data - email addresses, first and last
 * names, phone numbers, and free-text note bodies. None of that belongs in a
 * durable event log, so this allow-lists the keys that may be recorded by
 * value (identifiers, pagination, status flags) and records every other
 * supplied key by *name only*, so an audit still shows which fields an
 * operation touched without storing what was in them.
 *
 * `endpoints.test.ts` asserts the exact payload for the operations that accept
 * personal data, because this is the one place caller-supplied text could
 * reach durable storage.
 */
export function auditPayload(
	input: Record<string, unknown>,
	allowedKeys: readonly string[],
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};
	const redactedFields: string[] = [];

	for (const [key, value] of Object.entries(input)) {
		if (value === undefined) {
			continue;
		}
		if (allowedKeys.includes(key)) {
			payload[key] = value;
		} else {
			redactedFields.push(key);
		}
	}

	if (redactedFields.length > 0) {
		payload.fields = redactedFields.sort();
	}

	return payload;
}

/**
 * Records how many rows a list operation returned, rather than the rows.
 */
export function listAuditPayload(
	input: Record<string, unknown>,
	allowedKeys: readonly string[],
	returnedCount: number,
): Record<string, unknown> {
	return { ...auditPayload(input, allowedKeys), returnedCount };
}
