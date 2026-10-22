/**
 * Event payload safety.
 *
 * `logEventFromContext` stores its payload verbatim in the local `events`
 * table. DNSFilter payloads include credentials (`new_password`,
 * `payment_token`, SSO `client_secret`, API keys), so endpoint inputs are
 * passed through `redactSensitive` before they reach the event log.
 */

const SENSITIVE_KEY =
	/(password|passphrase|secret|token|api[_-]?key|authorization|credential)/i;

/**
 * Returns a copy of an endpoint input that is safe to store in the event log.
 *
 * `unknown` is required for the parameter because the 248 operations accept
 * heterogeneous inputs (nested objects, arrays, primitives) and the helper must
 * work for all of them. The returned value keeps the input's shape with
 * sensitive leaves replaced by `'[redacted]'`; non-object inputs log as `{}`.
 */
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
