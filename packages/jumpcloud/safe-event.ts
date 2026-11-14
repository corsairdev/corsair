// Event payloads are persisted to event history. Repository rules (R8) require
// secrets and customer content to stay out of event payloads, so handlers log
// only allowlisted operation identifiers: IDs, actions, modes and pagination.
// Never passwords, command text, search text (it can hold an email address),
// document content, answers or prompts. Values must be scalars or arrays of
// scalars to keep payloads small.
const SAFE_EVENT_KEY =
	/(Ids?$)|(_ids?$)|(^ids?$)|^(action|type|kind|mode|limit|page|cursor|order_by|operationType)$/;

const SAFE_SCALARS = new Set(['string', 'number', 'boolean']);

export function safeEventPayload(
	input: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(input).filter(
			([key, value]) =>
				SAFE_EVENT_KEY.test(key) &&
				(SAFE_SCALARS.has(typeof value) ||
					(Array.isArray(value) &&
						value.every((item) => SAFE_SCALARS.has(typeof item)))),
		),
	);
}
