import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { EmailOctopusContext } from '..';
import type { EmailOctopusRequest } from '../client';
import { makeEmailOctopusRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs.
 * `log` picks the safe fields. Email addresses are not logged.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: EmailOctopusContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => EmailOctopusRequest,
	options: {
		// unknown: raw is the response body, undefined on 204. The output
		// schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeEmailOctopusRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`emailoctopus.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
