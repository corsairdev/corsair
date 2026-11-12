import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { HeyyContext } from '..';
import type { HeyyRequest } from '../client';
import { makeHeyyRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * Every Heyy success body wraps its payload in `data`, and each search adds a
 * `pagination` object, so `shape` lifts the payload into a named field before
 * the output schema parses it. Renaming happens here rather than in a
 * `.transform()`, because the docs generator reads a transform's input side.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: HeyyContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => HeyyRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// A single credential is required by the keyBuilder, so ctx.key is always the
	// bearer token here.
	const raw = await makeHeyyRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(options.shape(raw, parsed));

	await logEventFromContext(
		ctx,
		`heyy.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * The search body, with only the fields the caller actually set.
 *
 * The search schemas are `additionalProperties: false`, and sending an explicit
 * `null` for an omitted field is not the same as omitting it, so unset keys are
 * dropped rather than passed as undefined.
 */
export function searchBody(parsed: {
	query?: string;
	sortBy?: string;
	search?: string;
	pagination?: { page: number; limit: number };
}): Record<string, unknown> {
	// unknown: the body is assembled, then serialized.
	const body: Record<string, unknown> = {}; // unknown: see the return type.
	if (parsed.query !== undefined) body.query = parsed.query;
	if (parsed.sortBy !== undefined) body.sortBy = parsed.sortBy;
	if (parsed.search !== undefined) body.search = parsed.search;
	if (parsed.pagination !== undefined) body.pagination = parsed.pagination;
	return body;
}
