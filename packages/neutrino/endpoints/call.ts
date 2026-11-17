import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { NeutrinoContext } from '..';
import type { NeutrinoRequest } from '../client';
import { makeNeutrinoRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged whole: they can hold email
 * addresses and phone numbers, so `log` picks what is safe.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: NeutrinoContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => NeutrinoRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// ctx.key is the `user-id:api-key` pair the key builder combined.
	const raw = await makeNeutrinoRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`neutrino.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
