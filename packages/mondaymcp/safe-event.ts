// Event history must not contain caller-provided content. The event type
// identifies the operation; only numeric pagination metadata is safe across
// the loose, forward-compatible input schemas.
export function safeEventPayload(
	input: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(input).filter(
			([key, value]) =>
				(key === 'limit' || key === 'page') &&
				typeof value === 'number' &&
				Number.isFinite(value),
		),
	);
}
