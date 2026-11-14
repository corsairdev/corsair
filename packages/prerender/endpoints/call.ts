import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PrerenderContext } from '..';
import type { PrerenderRequest } from '../client';
import { makePrerenderRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Unparsed bodies: a response before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

/**
 * Validates the input, sends it, shapes and validates the response, then logs
 * the event.
 *
 * The token is added by the client, so no endpoint builds it into a body.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PrerenderContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: Untyped,
	toRequest: (parsed: z.output<Input>) => PrerenderRequest,
	options: {
		/** Rewrites the answer before the output schema parses it. */
		shape?: (raw: Untyped, parsed: z.output<Input>) => Untyped;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const request = toRequest(parsed);
	const raw = await makePrerenderRequest(ctx.key, request);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`prerender.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Coerces a route's answer into an object the output schema can read. Prerender
 * answers a short text confirmation on some routes and JSON on others, so a
 * string becomes `{ message }` rather than failing a call that succeeded.
 */
// unknown: the route's own answer, before the output schema parses it.
export function asConfirmation(raw: Untyped): Untyped {
	if (typeof raw === 'string') return { message: raw };
	if (raw === null || raw === undefined) return {};
	return raw;
}
