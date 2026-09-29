// Builds a safe log payload for direct-postgres operations: never log the
// password, and omit the raw SQL so sensitive values stay out of the event log.
export function safeLogPostgresInput(input: Record<string, unknown>) {
	const logInput: Record<string, unknown> = {};
	for (const key of ['host', 'port', 'user', 'database']) {
		if (input[key] !== undefined) logInput[key] = input[key];
	}
	logInput.hasSql = typeof input.sql === 'string' && input.sql.length > 0;
	return logInput;
}
