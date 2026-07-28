const SENSITIVE_TEXT_FIELDS = new Set([
	'contentMarkdown',
	'content',
	'htmlContent',
	'bodyMarkdown',
]);

export function redactEventPayload<T extends Record<string, unknown>>(
	input: T,
): Record<string, unknown> {
	if (!input || typeof input !== 'object') {
		return input as unknown as Record<string, unknown>;
	}

	const payload: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(input)) {
		if (SENSITIVE_TEXT_FIELDS.has(key) && typeof value === 'string') {
			payload[`${key}Length`] = value.length;
		} else {
			payload[key] = value;
		}
	}

	return payload;
}
