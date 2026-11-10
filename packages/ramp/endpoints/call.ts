import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RampContext } from '..';
import type { RampRequest } from '../client';
import { makeRampRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Memos and vendor details are business data, so `log`
 * records ids and counts rather than free text.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RampContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RampRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRampRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`ramp.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Drops unset query values so an absent filter is not sent as the string
 * "undefined". Ramp validates several enums strictly and answers 400 for an
 * empty value.
 */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const kept = Object.entries(values).filter(
		([, value]) => value !== undefined,
	);
	return Object.fromEntries(kept);
}
