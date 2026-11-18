import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { LinguapopContext } from '..';
import type { LinguapopRequest } from '../client';
import { makeLinguapopRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. Inputs are never logged: they hold a candidate's name and email.
 * `log` picks the safe fields, and must leave out `url`, which carries the
 * invitation token.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: LinguapopContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: unknown, // unknown: raw caller input, parsed below by the input schema.
	toRequest: (parsed: z.output<Input>) => LinguapopRequest,
	log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields,
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeLinguapopRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`linguapop.${operation.event}`,
		log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
