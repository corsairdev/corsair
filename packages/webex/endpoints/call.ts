import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { WebexContext } from '..';
import type { WebexRequest } from '../client';
import { makeWebexListRequest, makeWebexRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. A message body is the user's content, so `log` picks the
 * fields rather than logging the object.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: WebexContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => WebexRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeWebexRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`webex.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A list call. Same contract as `call`, but the page is fetched with the client's
 * list request so the `Link` header survives, and the next page's URL is added to
 * the result as `nextLink`.
 */
export async function list<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: WebexContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => {
		path: string;
		query?: Record<string, string | number | boolean | undefined>;
	},
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output> & { nextLink?: string }> {
	const parsed = operation.input.parse(rawInput ?? {});
	const { path, query } = toRequest(parsed);
	// `nextLink` replaces the path and query: it is the URL Webex itself returned.
	const nextLink = (parsed as { nextLink?: string }).nextLink;
	const page = await makeWebexListRequest(ctx.key, { path, query, nextLink });
	const result = operation.output.parse(page.body) as z.output<Output>;

	await logEventFromContext(
		ctx,
		`webex.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	// The output schema is always an object for a list, so the spread is safe; the
	// cast states that to the compiler, which only knows the generic.
	return {
		...(result as Record<string, unknown>),
		nextLink: page.nextLink,
	} as z.output<Output> & {
		nextLink?: string;
	};
}
