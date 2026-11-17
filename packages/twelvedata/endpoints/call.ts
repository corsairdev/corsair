import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TwelveDataContext } from '..';
import type { TwelveDataRequest } from '../client';
import { assertOk, makeTwelveDataRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, checks that the body did not say
 * `status: error`, validates the response, then logs the event.
 *
 * Twelve Data answers 200 with an error body for a bad symbol, so the status
 * check is what makes a failed lookup throw.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TwelveDataContext,
	operation: {
		/** The telemetry label, such as `quote`. */
		event: string;
		/** The caller-facing path, such as `market.quote`, used in errors. */
		operation: string;
		input: Input;
		output: Output;
	},
	// unknown: parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TwelveDataRequest,
	options: {
		// unknown: raw is the response body; the output schema validates it.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTwelveDataRequest(ctx.key, toRequest(parsed));
	assertOk(raw, operation.operation);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`twelvedata.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
