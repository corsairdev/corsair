import type { z } from 'zod';
import type { UnipileContext } from '..';
import type { UnipileRequest } from '../client';
import { makeUnipileRequest, segment } from '../client';
import { logCompleted } from '../log-event';
import type {
	UnipileEndpointOutputs,
	UnipileOperation,
	UnipileUnparsedWriteResponse,
} from './types';
import {
	UNIPILE_WRITE_OPERATIONS,
	UnipileEndpointInputSchemas,
	UnipileEndpointOutputSchemas,
} from './types';

const WRITE_OPERATIONS: ReadonlySet<UnipileOperation> = new Set(
	UNIPILE_WRITE_OPERATIONS,
);

/** An operation's input after its schema ran (defaults filled in). */
export type ParsedInput<K extends UnipileOperation> = z.output<
	(typeof UnipileEndpointInputSchemas)[K]
>;

/** `/v2/{account_id}` plus the rest of a per-account route. */
export function accountPath(accountId: string, rest: string): string {
	return `/v2/${segment(accountId)}${rest}`;
}

// Only identifiers are logged. Message text, invitation notes, names and
// profile data stay out of the event log.
const LOGGED_INPUT_KEYS = [
	'account_id',
	'chat_id',
	'request_id',
	'post_id',
	'id',
	'type',
] as const;

// unknown: inputs and results differ per operation; only string ids and the
// size of a `data` page are read from them.
function logFields(
	parsed: Record<string, unknown>,
	result: Record<string, unknown>,
): Record<string, string | number> {
	const fields: Record<string, string | number> = {};
	for (const key of LOGGED_INPUT_KEYS) {
		const value = parsed[key];
		if (typeof value === 'string') fields[key] = value;
	}
	if (Array.isArray(result.data)) fields.items = result.data.length;
	if (typeof result.id === 'string') fields.result_id = result.id;
	if (typeof result.chat_id === 'string') fields.chat_id = result.chat_id;
	if (typeof result.message_id === 'string') {
		fields.message_id = result.message_id;
	}
	if (typeof result.parse_warning === 'string') fields.unparsed_response = 1;
	return fields;
}

function unparsedWrite(
	event: string,
	error: z.ZodError,
	// unknown: the 2xx body that failed the output schema.
	body: unknown,
): UnipileUnparsedWriteResponse {
	const issues = error.issues
		.slice(0, 3)
		.map((issue) => `${issue.path.join('.') || '(body)'}: ${issue.message}`)
		.join('; ');
	const parse_warning = `Unipile accepted ${event} but its response did not match the expected shape (${issues}). The action already happened; do not resend it.`;
	console.warn(`[corsair:unipile] ${parse_warning}`);
	return { parse_warning, raw: body };
}

/**
 * Validates the input, sends one request, validates the response and logs the
 * ids involved. Retries are decided by error-handlers.ts, never here.
 *
 * Once Unipile has answered 2xx to a write, the invitation or message has
 * gone out, so nothing after that point may throw: a response that fails the
 * output schema comes back as `{ parse_warning, raw }`, and logging errors are
 * swallowed. Either would otherwise look like a failure and invite a resend.
 */
export async function call<K extends UnipileOperation>(
	ctx: UnipileContext,
	operation: K,
	event: string,
	// unknown: raw caller input, parsed below by the operation's input schema.
	input: unknown,
	toRequest: (parsed: ParsedInput<K>) => UnipileRequest,
	// unknown: the raw response body, before the output schema parses it.
	// Output schemas are loose, so fields that must not reach the caller
	// (such as a signing secret) are removed here rather than by the schema.
	prepare: (raw: unknown) => unknown = (raw) => raw,
): Promise<UnipileEndpointOutputs[K]> {
	// Indexing the schema map with a generic key yields the union of every
	// schema; the cast restores the one `operation` names.
	const parsed = UnipileEndpointInputSchemas[operation].parse(
		input ?? {},
	) as ParsedInput<K>;
	const body = prepare(await makeUnipileRequest(ctx.key, toRequest(parsed)));
	const checked = UnipileEndpointOutputSchemas[operation].safeParse(body);

	let result: UnipileEndpointOutputs[K];
	if (checked.success) {
		// Same generic-index widening as the input parse above.
		result = checked.data as UnipileEndpointOutputs[K];
	} else if (WRITE_OPERATIONS.has(operation)) {
		// K is a write operation here, whose output type includes this shape.
		result = unparsedWrite(
			event,
			checked.error,
			body,
		) as UnipileEndpointOutputs[K];
	} else {
		throw checked.error;
	}

	await logCompleted(
		ctx,
		`unipile.${event}`,
		// Every input and output schema is a z.object, so both are records.
		logFields(
			parsed as Record<string, unknown>,
			result as Record<string, unknown>,
		),
	);
	return result;
}
