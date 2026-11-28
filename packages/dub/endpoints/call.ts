import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { DubContext } from '..';
import type { DubRequest } from '../client';
import { makeDubRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged: link bodies hold destination
 * URLs and track calls hold customer emails.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: DubContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => DubRequest,
	options: {
		// unknown: raw is the response body, a string for qr.get and undefined
		// never: Dub answers JSON (or SVG) on every documented success.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeDubRequest({ key: ctx.key }, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`dub.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
