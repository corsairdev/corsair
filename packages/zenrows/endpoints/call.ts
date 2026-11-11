import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ZenRowsContext } from '..';
import type { ZenrowsRequest, ZenrowsResponse } from '../client';
import { makeZenrowsRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

export type CallOptions<Input extends z.ZodType, Output extends z.ZodType> = {
	/** unknown: `raw` is the response body, as text, before the output schema parses it. */
	shape: (raw: ZenrowsResponse, parsed: z.output<Input>) => unknown;
	log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
};

/**
 * Validates the input, sends the request, parses the body into the output
 * shape, then logs the event. The URL is never logged: a Fetch call with
 * `customHeaders` carries the key in the query string, and the scraped page
 * itself may contain anything the caller should decide about.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: ZenRowsContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => ZenrowsRequest,
	options: CallOptions<Input, Output>,
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeZenrowsRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(options.shape(raw, parsed));

	await logEventFromContext(
		ctx,
		`zenrows.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
