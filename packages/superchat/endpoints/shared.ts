import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SuperchatContext } from '..';
import { makeSuperchatRequest } from '../client';
import type { UnknownJson } from '../json';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request and validates the response, then logs
 * the event. Contact details are not logged: a handle is an email address or a
 * phone number, and message content is the customer's own words.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SuperchatContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: UnknownJson, // unknown: raw caller input, parsed by the input schema
	toRequest: (parsed: z.output<Input>) => {
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		path: string;
		query?: Record<string, string | number | boolean | undefined>;
		body?: UnknownJson; // unknown: already validated by the input schema
	},
	options: {
		// unknown: the response body, absent when empty. The output schema
		// validates whatever this returns.
		shape?: (raw: UnknownJson, parsed: z.output<Input>) => UnknownJson;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const { method, path, query, body } = toRequest(parsed);
	const raw = await makeSuperchatRequest(ctx.key, {
		method,
		path,
		query,
		body,
	});
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`superchat.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A delete answers no body, so the result records what was removed. Anything
 * that arrives is checked rather than ignored: a 200 carrying another error
 * envelope would otherwise look like a successful delete.
 */
export function deletion(
	raw: UnknownJson, // unknown: the body of a delete, which should be empty
	id: string,
): { id: string; deleted: true } {
	if (raw !== undefined && raw !== null) {
		// Superchat answers an empty body or `{ id }` naming the deleted record
		// (DELETE /contacts/:id returns 200 `{ "id": "ct_..." }`). Anything else,
		// including a different id, is not a confirmation.
		const confirms =
			typeof raw === 'object' &&
			!Array.isArray(raw) &&
			Object.entries(raw).every(([key, value]) => key === 'id' && value === id);
		if (!confirms) {
			throw new Error(
				'Superchat answered a delete with a body, so nothing was confirmed. Re-read the record before assuming it was removed.',
			);
		}
	}
	return { id, deleted: true as const };
}
