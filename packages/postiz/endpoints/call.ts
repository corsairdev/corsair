import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PostizContext } from '..';
import type { PostizRequest } from '../client';
import { makePostizRequest, resolvePostizBaseUrl } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Unparsed bodies: a response before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

/**
 * Validates the input, sends it, shapes and validates the response, then logs
 * the event.
 *
 * A few routes answer a bare array rather than an object, so `shape` wraps it
 * under the key the output schema expects.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PostizContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: Untyped,
	toRequest: (parsed: z.output<Input>) => PostizRequest,
	options: {
		/** Rewrites the answer before the output schema parses it. */
		shape?: (raw: Untyped, parsed: z.output<Input>) => Untyped;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const request = toRequest(parsed);
	const raw = await makePostizRequest(
		ctx.key,
		request,
		await resolvePostizBaseUrl(ctx),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`postiz.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Wraps a body that a route answers as a bare array, so a route documented to
 * return a list is validated as one rather than as an object that is absent.
 */
// unknown: the route's bare array before the output schema parses it.
export function asList(key: string): (raw: Untyped) => Untyped {
	return (raw) => ({ [key]: raw });
}
