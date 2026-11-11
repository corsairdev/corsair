import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { U301Context } from '..';
import type { U301Request } from '../client';
import { makeU301Request } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response, then
 * logs the event.
 *
 * Inputs are logged only through `log`: a destination URL can itself be sensitive,
 * and `comment` is the caller's note, so neither is logged. The callbacks report
 * ids, slugs and counts.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: U301Context,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => U301Request,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeU301Request(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`u301.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Makes a short link safe to put in a path.
 *
 * The API takes the whole short link as one path segment, such as `u301.co/abc123`.
 * `encodeURIComponent` would escape that slash, so the slash is left alone and only
 * the parts that must not appear raw are encoded. A stored link never contains a
 * `?` or `#`, and a caller who includes a scheme passes it through.
 */
export function shortLinkSegment(shortlink: string): string {
	const stripped = shortlink.replace(/^https?:\/\//i, '');
	return encodeURIComponent(stripped).replace(/%2F/gi, '/');
}
