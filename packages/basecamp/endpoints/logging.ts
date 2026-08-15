const IDENTIFIER = /(?:^|_)(?:id|ids)$/i;
const SECRET = /token|secret|key|content|description|email|name|filename|url/i;

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
			IDENTIFIER.test(key) &&
			(typeof value === 'string' || typeof value === 'number')
		)
			payload[key] = value;
		else if (typeof value === 'boolean') payload[key] = value;
	}
	return payload;
}
