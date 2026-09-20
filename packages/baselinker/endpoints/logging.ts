const IDENTIFIER_KEY = /(?:^|_)(?:id|ids)$/;

/** Records identifiers, booleans and counts without retaining customer data. */
export function auditPayload(
	input: Record<string, unknown>,
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};
	const fields = Object.keys(input).filter((key) => input[key] !== undefined);
	if (fields.length > 0) payload.fields = fields;

	for (const key of fields) {
		const value = input[key];
		if (Array.isArray(value)) {
			payload[`${key}_count`] = value.length;
		} else if (
			IDENTIFIER_KEY.test(key) &&
			(typeof value === 'string' || typeof value === 'number')
		) {
			payload[key] = value;
		} else if (typeof value === 'boolean') {
			payload[key] = value;
		}
	}
	return payload;
}
