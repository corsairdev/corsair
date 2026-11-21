import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { StorerocketContext } from '..';
import type { StorerocketRequest } from '../client';
import { makeStorerocketRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. Inputs are not logged because locations carry addresses; `log`
 * picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: StorerocketContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => StorerocketRequest,
	options: {
		// unknown: raw is the response body, undefined on a 204. The output
		// schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeStorerocketRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`storerocket.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Encodes one include flag onto the numeric wire form the API expects. */
export function includeFlag(value: boolean | undefined): number | undefined {
	if (value === undefined) return undefined;
	return value ? 1 : 0;
}
