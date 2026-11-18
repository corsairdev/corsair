import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { EventzillaContext } from '..';
import type { EventzillaRequest } from '../client';
import { makeEventzillaRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

export type ShapeOptions<Input extends z.ZodType, Output extends z.ZodType> = {
	// unknown: `raw` is the response body, or undefined when the route answered
	// an empty 2xx. Whatever this returns is validated by the output schema.
	shape?: (
		// unknown: the response body, validated by the output schema.
		raw: unknown,
		parsed: z.output<Input>,
	) => unknown;
	log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
};

/**
 * Validates the input, sends one request, shapes and validates the response,
 * then logs. Inputs are not logged wholesale — attendee and buyer records hold
 * names and email addresses — so `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: EventzillaContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
		// The path id and the body share a name on the ticket-type update, so the
		// builder reads the parsed input rather than a subset of it.
		toRequest: (parsed: z.output<Input>) => EventzillaRequest;
	},
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	options: ShapeOptions<Input, Output> = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeEventzillaRequest(ctx.key, operation.toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`eventzilla.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
