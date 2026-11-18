import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TelnyxContext } from '..';
import type { TelnyxRequest } from '../client';
import { makeTelnyxRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the result, then logs the
 * event. Inputs are not logged whole, because messages carry phone numbers and
 * bodies; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TelnyxContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TelnyxRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTelnyxRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`telnyx.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Telnyx pages with `page[number]` and `page[size]` as bracketed query keys. */
export function paging(
	pageNumber: number | undefined,
	pageSize: number | undefined,
): Record<string, number | undefined> {
	return {
		'page[number]': pageNumber,
		'page[size]': pageSize,
	};
}
