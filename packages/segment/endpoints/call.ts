import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SegmentContext } from '..';
import type { SegmentRequest } from '../client';
import { makeSegmentRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the `{ data: ... }`
 * envelope, then logs the event. Inputs are not logged: subject ids on
 * regulations are personal data, and resource settings can carry credentials.
 * `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SegmentContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => SegmentRequest,
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeSegmentRequest(
		ctx.key,
		toRequest(parsed),
		ctx.options?.baseUrl,
	);
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`segment.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
