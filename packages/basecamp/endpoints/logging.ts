const SNAKE_IDENTIFIER = /(?:^|_)ids?$/i;
/**
 * Endpoint inputs name their identifiers in camelCase (bucketId, recordingId,
 * subscriptionIds), so the snake_case pattern alone would drop nearly every id
 * from the audit trail. The capital I is required so ordinary words ending in
 * "id" — valid, grid — are not mistaken for identifiers.
 */
const CAMEL_IDENTIFIER = /[a-z](?:Id|Ids)$/;
const SECRET = /token|secret|key|content|description|email|name|filename|url/i;

function isIdentifier(key: string): boolean {
	return SNAKE_IDENTIFIER.test(key) || CAMEL_IDENTIFIER.test(key);
}

/** Keeps field names, identifiers, booleans and counts; drops content and secrets. */
export function basecampAuditPayload(
	input: Record<string, unknown>,
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};
	const fields = Object.keys(input).filter(
		(key) => input[key] !== undefined && !SECRET.test(key),
	);
	if (fields.length > 0) payload.fields = fields;
	for (const key of fields) {
		const value = input[key];
		if (Array.isArray(value)) payload[key + '_count'] = value.length;
		else if (
			isIdentifier(key) &&
			(typeof value === 'string' || typeof value === 'number')
		)
			payload[key] = value;
		else if (typeof value === 'boolean') payload[key] = value;
	}
	return payload;
}
