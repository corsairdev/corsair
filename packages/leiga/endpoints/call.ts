import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { LeigaContext } from '..';
import type { LeigaRequest } from '../client';
import { makeLeigaRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. The envelope's `data` arrives here already unwrapped by
 * `makeLeigaRequest`, which throws on any non-zero `code`.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: LeigaContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => LeigaRequest,
	options: {
		// unknown: raw is the unwrapped `data` value. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeLeigaRequest(
		ctx.key,
		toRequest(parsed),
		operation.event,
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`leiga.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Wraps a bare array under a key. Leiga returns a top-level array for most
 * lists (`project/list`, `sprint/list-with-count`, `tag/list`) and an object
 * with `list` and `total` for `issue/page`, so both shapes have to be handled
 * and anything else has to fail rather than become an empty page.
 */
export function wrapList(
	raw: unknown,
	label: string,
): Record<string, unknown>[] {
	if (!Array.isArray(raw)) {
		throw new Error(`Leiga returned an unexpected ${label} body`);
	}
	for (const [index, entry] of raw.entries()) {
		if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
			throw new Error(
				`Leiga returned an unexpected ${label} body: entry ${index} is not an object`,
			);
		}
	}
	return raw as Record<string, unknown>[];
}
