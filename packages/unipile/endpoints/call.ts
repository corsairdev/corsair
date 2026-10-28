import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { UnipileContext } from '..';
import type { UnipileRequest } from '../client';
import { makeUnipileRequest, segment } from '../client';
import type { UnipileEndpointOutputs, UnipileOperation } from './types';
import {
	UnipileEndpointInputSchemas,
	UnipileEndpointOutputSchemas,
} from './types';

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
	return fields;
}

/**
 * Validates the input, sends one request, validates the response and logs the
 * ids involved. Retries are decided by error-handlers.ts, never here.
 */
export async function call<K extends UnipileOperation>(
	ctx: UnipileContext,
	operation: K,
	event: string,
	// unknown: raw caller input, parsed below by the operation's input schema.
	input: unknown,
	toRequest: (parsed: ParsedInput<K>) => UnipileRequest,
): Promise<UnipileEndpointOutputs[K]> {
	// Indexing the schema map with a generic key yields the union of every
	// schema; the cast restores the one `operation` names.
	const parsed = UnipileEndpointInputSchemas[operation].parse(
		input ?? {},
	) as ParsedInput<K>;
	const raw = await makeUnipileRequest(ctx.key, toRequest(parsed));
	const result = UnipileEndpointOutputSchemas[operation].parse(
		raw,
	) as UnipileEndpointOutputs[K];

	await logEventFromContext(
		ctx,
		`unipile.${event}`,
		// Every input and output schema is a z.object, so both are records.
		logFields(
			parsed as Record<string, unknown>,
			result as Record<string, unknown>,
		),
		'completed',
	);
	return result;
}
