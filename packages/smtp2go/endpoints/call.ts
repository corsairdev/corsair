import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { Smtp2goContext } from '..';
import type { Smtp2goRequest } from '../client';
import {
	makeSmtp2goRequest,
	readEnvelopeError,
	Smtp2goEnvelopeError,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, checks the envelope for an embedded
 * error, then validates the response. Inputs are not logged, because message
 * bodies hold recipient addresses; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: Smtp2goContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => Smtp2goRequest,
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const request = toRequest(parsed);
	const raw = await makeSmtp2goRequest(
		{ key: ctx.key, options: ctx.options },
		request,
	);

	// A 2xx body can still be an error: the envelope carries `data.error`
	// alongside the request_id (and a bare `{ error, error_code }` shape is
	// documented for some failures). Fail here rather than parsing it.
	const envelopeError = readEnvelopeError(raw);
	if (envelopeError) {
		throw new Smtp2goEnvelopeError(request.path, envelopeError, request.body);
	}

	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`smtp2go.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
