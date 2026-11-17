import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TwoCaptchaContext } from '..';
import type { TwoCaptchaMethod } from '../client';
import { makeTwoCaptchaRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends `POST /<method>` with the JSON body, checks the
 * `errorId` envelope (the client throws on a failure), validates the result,
 * then logs the event.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TwoCaptchaContext,
	operation: {
		event: string;
		method: TwoCaptchaMethod;
		input: Input;
		output: Output;
	},
	// unknown: parsed below by the operation's input schema.
	rawInput: unknown,
	// unknown: each method's own body fields, built from the parsed input.
	toBody: (parsed: z.output<Input>) => Record<string, unknown>,
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTwoCaptchaRequest(
		ctx.key,
		operation.method,
		toBody(parsed),
	);
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`twocaptcha.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
