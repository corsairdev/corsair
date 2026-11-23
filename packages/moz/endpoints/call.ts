import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MozContext } from '..';
import type { MozRequest } from '../client';
import { makeMozRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the JSON-RPC request, validates the response and
 * logs the event. Every Moz operation is a JSON-RPC method on the one
 * endpoint, so the request shaping lives in each endpoint's toRequest.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: MozContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => MozRequest,
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeMozRequest(ctx, toRequest(parsed));
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`moz.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
