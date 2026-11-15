import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { EventbriteContext } from '..';
import type { EventbriteRequest } from '../client';
import { makeEventbriteRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Joined for Eventbrite's comma-separated list parameters. */
export function commaList(
	values: ReadonlyArray<string | number> | undefined,
): string | undefined {
	return values && values.length > 0 ? values.join(',') : undefined;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged: they carry attendee emails,
 * passwords and discount codes, so `log` picks only the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: EventbriteContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => EventbriteRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeEventbriteRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`eventbrite.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
