// Event payloads are persisted to event history. Repository rules (R8) require
// secrets and customer content to stay out of event payloads, so handlers log
// only allowlisted operation identifiers: IDs, actions, modes and pagination.
// Never passwords, command text, search text (it can hold an email address),
// document content, answers or prompts. Values must be scalars or arrays of
// scalars to keep payloads small.
// An explicit list, not a suffix match: input schemas are loose, and keys such
// as managedAppleId hold an email address.
const SAFE_EVENT_KEYS = new Set([
	'_id',
	'id',
	'ids',
	'group_id',
	'policy_id',
	'system_id',
	'systemIds',
	'action',
	'type',
	'kind',
	'mode',
	'limit',
	'page',
	'cursor',
	'order_by',
	'operationType',
]);

const SAFE_SCALARS = new Set(['string', 'number', 'boolean']);

export function safeEventPayload(
	input: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(input).filter(
			([key, value]) =>
				SAFE_EVENT_KEYS.has(key) &&
				(SAFE_SCALARS.has(typeof value) ||
					(Array.isArray(value) &&
						value.every((item) => SAFE_SCALARS.has(typeof item)))),
		),
	);
}
