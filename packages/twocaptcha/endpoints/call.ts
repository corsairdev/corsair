import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TwoCaptchaContext } from '..';
import type { TwoCaptchaRequest } from '../client';
import {
	isNotReady,
	makeTwoCaptchaRequest,
	readEnvelope,
	TwoCaptchaAPIError,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, checks the envelope, validates the
 * result, then logs the event.
 *
 * A `status: 0` answer is an error, except for `CAPCHA_NOT_READY` from the task
 * result route: that is a "poll again" state, which `allowNotReady` lets through
 * so a caller can wait on one call rather than catching an exception.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TwoCaptchaContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TwoCaptchaRequest,
	options: {
		allowNotReady?: boolean;
		// unknown: raw is the response body; the output schema validates it.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTwoCaptchaRequest(ctx.key, toRequest(parsed));
	const envelope = readEnvelope(raw);
	if (!envelope.ok && !(options.allowNotReady && isNotReady(envelope))) {
		// Both parts are kept: the code is what a caller matches on, and the text
		// is what tells them what to fix.
		const detail = [envelope.code, envelope.errorText]
			.filter((part): part is string => part !== undefined && part.length > 0)
			.join(': ');
		throw new TwoCaptchaAPIError(
			`${operation.event} was refused: ${detail || 'no reason given'}`,
			{ code: envelope.code, providerMessage: envelope.errorText },
		);
	}
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`twocaptcha.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
