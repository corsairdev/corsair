import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PostmarkContext } from '..';
import type { PostmarkRequest } from '../client';
import { makePostmarkRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Unparsed bodies: a response before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

/**
 * Validates the input, sends it, shapes and validates the response, then logs
 * the event.
 *
 * A send never carries a recipient address into the log: the log picks safe
 * fields such as the message id and the resulting code.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PostmarkContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: Untyped,
	toRequest: (parsed: z.output<Input>) => PostmarkRequest,
	options: {
		/** Rewrites the answer before the output schema parses it. */
		shape?: (raw: Untyped, parsed: z.output<Input>) => Untyped;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const request = toRequest(parsed);
	const raw = await makePostmarkRequest(ctx.key, request);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`postmark.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Wraps a body a route answers as a bare array or object, under the key the
 * output schema expects. A send answers one result object directly, and a batch
 * answers an array of them, so both are wrapped rather than parsed as envelopes.
 */
// unknown: the route's bare body before the output schema parses it.
export function asKey(key: string): (raw: Untyped) => Untyped {
	return (raw) => ({ [key]: raw });
}
