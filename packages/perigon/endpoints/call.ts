import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PerigonContext } from '..';
import type { PerigonRequest } from '../client';
import { makePerigonRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. Article content is licensed data and is not logged.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PerigonContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => PerigonRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makePerigonRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`perigon.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
