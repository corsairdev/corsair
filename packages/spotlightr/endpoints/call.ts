import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SpotlightrContext } from '..';
import type { SpotlightrRequest } from '../client';
import { makeSpotlightrRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Uploads and video names are not logged as input; `log`
 * picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SpotlightrContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => SpotlightrRequest,
	options: {
		// unknown: raw is the response body; the output schema validates what
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeSpotlightrRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`spotlightr.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Spotlightr takes 1/0 where a caller would pass a boolean, and `getFormData`
 * in `corsair/http` would JSON-stringify a boolean into `"true"`. This renders
 * the flag as `1` or `0` so the route reads the value it documents.
 */
export function flag(value: boolean | undefined): 1 | 0 | undefined {
	if (value === undefined) return undefined;
	return value ? 1 : 0;
}
