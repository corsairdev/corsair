import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaContext, CanvaEndpoints } from '../index';
import { loggable } from './mappers';
import { CanvaEndpointInputSchemas, CanvaEndpointOutputSchemas } from './types';

/** An id placed in a URL path; encoded so a stray `/` or `?` can't reach another route. */
export function seg(value: string): string {
	return encodeURIComponent(value);
}

type RequestOptions = Parameters<typeof makeCanvaRequest>[2];

/** One Canva call plus its event log, for endpoints with nothing else to do. */
export async function callCanva<T>(
	ctx: CanvaContext,
	event: string,
	// unknown: each endpoint logs its own input shape; the logger only serializes it.
	logged: Record<string, unknown>,
	path: string,
	options: RequestOptions = { method: 'GET' },
): Promise<T> {
	const result = await makeCanvaRequest<T>(path, ctx.key, options);
	await logEventFromContext(
		ctx,
		`canva.${event}`,
		loggable(logged),
		'completed',
	);
	return result;
}

/** Drops keys whose value is undefined, for a query or body. */
// unknown: the helper works on any query or body object and keeps its value types.
export function defined<T extends Record<string, unknown>>(value: T) {
	return Object.fromEntries(
		Object.entries(value).filter(([, v]) => v !== undefined),
	) as { [K in keyof T]: Exclude<T[K], undefined> };
}

type EndpointKey = keyof CanvaEndpoints;

/**
 * Checks an operation's input and output against its schemas. The schemas in
 * `endpointSchemas` only describe the operation; this is what enforces them, so
 * a bad input fails before any request and a response that has drifted from
 * Canva's spec fails loudly instead of reaching the caller.
 */
export function validated<K extends EndpointKey>(
	key: K,
	endpoint: CanvaEndpoints[K],
): CanvaEndpoints[K] {
	const run = endpoint as (
		ctx: CanvaContext,
		input: unknown, // unknown: the parsed input of whichever operation K is
	) => Promise<unknown>; // unknown: checked against the output schema below
	return (async (ctx: CanvaContext, input: unknown) => {
		const parsed = CanvaEndpointInputSchemas[key].parse(input);
		const result = await run(ctx, parsed);
		return CanvaEndpointOutputSchemas[key].parse(result);
	}) as CanvaEndpoints[K];
}
