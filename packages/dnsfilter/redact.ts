// Inputs can hold passwords, payment tokens, API keys and SSO secrets; strip
// them before logEventFromContext stores the payload.

const SENSITIVE_KEY =
	/(password|passphrase|secret|token|api[_-]?key|authorization|credential)/i;

// Returns a redacted copy for the event log. Inputs vary across operations,
// so the parameter is `unknown`; non-objects log as {}.
export function redactSensitive(value: unknown): Record<string, unknown> {
	const redacted = redact(value, 0);
	if (Array.isArray(redacted)) return { values: redacted };
	return typeof redacted === 'object' && redacted !== null
		? (redacted as Record<string, unknown>)
		: {};
}

function redact(value: unknown, depth: number): unknown {
	if (depth > 6) return '[truncated]';
	if (value instanceof Date) return value.toISOString();
	if (Array.isArray(value)) {
		return value.map((entry) => redact(entry, depth + 1));
	}
	if (typeof value !== 'object' || value === null) return value;
	const source = value as Record<string, unknown>;
	const result: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(source)) {
		result[key] = SENSITIVE_KEY.test(key)
			? '[redacted]'
			: redact(entry, depth + 1);
	}
	return result;
}
