import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PolygonioContext } from '..';
import type { PolygonioRequest } from '../client';
import { makePolygonioRequest, nextPagePath } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Unparsed bodies: a response before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

/**
 * Validates the input, sends it, shapes and validates the response, then logs
 * the event.
 *
 * The API wraps a list as `{ status, results, next_url }`, and a caller paginates
 * by handing `next_url` back: it already carries the cursor and the original
 * filters, so `nextPage` rebuilds nothing and only keeps the path and query.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PolygonioContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: Untyped,
	toRequest: (parsed: z.output<Input>) => PolygonioRequest,
	options: {
		/** Rewrites the answer before the output schema parses it. */
		shape?: (raw: Untyped, parsed: z.output<Input>) => Untyped;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const request = toRequest(parsed);
	const raw = await makePolygonioRequest(ctx.key, request);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`polygonio.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Builds the request for a `nextUrl` page, or undefined when the caller gave
 * none, so an endpoint can prefer it over the filters it would otherwise send.
 */
export function nextPageRequest(
	nextUrl: string | undefined,
): PolygonioRequest | undefined {
	if (nextUrl === undefined) return undefined;
	return { method: 'GET', path: nextPagePath(nextUrl) };
}
