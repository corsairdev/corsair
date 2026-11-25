import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { LinklyContext } from '..';
import type { LinklyRequest } from '../client';
import { makeLinklyRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged, because they carry destination
 * URLs and webhook endpoints; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: LinklyContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => LinklyRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeLinklyRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`linkly.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
