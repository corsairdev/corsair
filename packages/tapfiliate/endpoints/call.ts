import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TapfiliateContext } from '..';
import type { TapfiliateRequest } from '../client';
import { makeTapfiliateRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the result, then logs the
 * event. Inputs are not logged whole, because affiliate and customer records
 * hold names, emails and addresses; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TapfiliateContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TapfiliateRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTapfiliateRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`tapfiliate.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * True when a write answered without a body. Core resolves an empty body as
 * `undefined` (or `''` for an empty text body).
 * unknown: the response body is untyped.
 */
export function isEmptyBody(raw: unknown): boolean {
	return raw === undefined || raw === null || raw === '';
}

/**
 * The deletes answer 204 with no body, so there is nothing to parse and the
 * endpoint reports what it did. Returning the raw body would turn an empty
 * answer into a fake record.
 */
export async function callDelete<Input extends z.ZodType>(
	ctx: TapfiliateContext,
	operation: { event: string; input: Input },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TapfiliateRequest,
): Promise<{ success: true }> {
	const parsed = operation.input.parse(rawInput ?? {});
	await makeTapfiliateRequest(ctx.key, toRequest(parsed));

	await logEventFromContext(
		ctx,
		`tapfiliate.${operation.event}`,
		{},
		'completed',
	);
	return { success: true };
}
