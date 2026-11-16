import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { NgrokContext } from '..';
import type { NgrokRequest } from '../client';
import { makeNgrokRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. A create returns a token on apiKeys.create, so only the
 * ids `log` picks are logged.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: NgrokContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => NgrokRequest,
	options: {
		// unknown: raw is the response body, undefined for a 204. The output
		// schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeNgrokRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`ngrok.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A ngrok delete answers 204 with no body. The success flag is derived from the
 * call that already happened, because a body to parse does not exist.
 */
export function deleted(id: string): { deleted: true; id: string } {
	return { deleted: true, id };
}
