import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RealPhoneValidationContext } from '..';
import type {
	RealPhoneValidationRequest,
	RealPhoneValidationService,
} from '../client';
import { assertNotRefused, makeRealPhoneValidationRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, checks the body is not a refusal, shapes
 * and validates the response, then logs the event.
 *
 * The refusal check is the important step: these services answer a `200` with
 * `status: "ERROR"` or `status: "invalid phone"`, and a caller that treated that
 * as a validation result would act on a number nobody actually looked up.
 *
 * Phone numbers are never logged; only status words and flags are.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RealPhoneValidationContext,
	operation: {
		event: string;
		service: RealPhoneValidationService;
		input: Input;
		output: Output;
	},
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RealPhoneValidationRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const request = toRequest(parsed);
	const raw = await makeRealPhoneValidationRequest(
		ctx.key,
		operation.service,
		request,
	);

	// A body that is really a refusal must not reach the output schema, which
	// would accept it as a result.
	assertNotRefused(raw, operation.service, request);

	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`realphonevalidation.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
