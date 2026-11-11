import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { U301Context } from '..';
import type { U301Request } from '../client';
import { makeU301Request, U301APIError } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Route names that must never be read as a short link's host, because the link and
 * domain routes share the `/shorten` prefix. A short link built from one of these
 * would address a different endpoint than the one the caller was authorised for.
 */
const U301_RESERVED_SEGMENTS = new Set(['domains', 'analytics', 'shorten']);

/** A short link that cannot be turned into a safe path. Caught before any request. */
class U301InputError extends U301APIError {
	constructor(message: string) {
		super(message, { replayable: false });
		this.name = 'U301InputError';
	}
}

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
 * The API takes the whole short link as one path segment, such as `u301.co/abc123`,
 * and `encodeURIComponent` would escape that slash, so the slash is kept and only
 * the parts that must not appear raw are encoded.
 *
 * The slash is also why this validates rather than passing anything through: the
 * delete routes for links and domains share a prefix, so a value such as
 * `domains/example.com` would build the domain-delete URL on a call the caller was
 * permitted to make only as `links.delete`. Exactly one separator is allowed, and
 * the first segment may not be a reserved collection name.
 */
export function shortLinkSegment(shortlink: string): string {
	const stripped = shortlink.replace(/^https?:\/\//i, '');
	const parts = stripped.split('/');
	const [host, slug] = parts;
	if (parts.length !== 2 || !host || !slug) {
		throw new U301InputError(
			'A short link must be one host and one slug, such as u301.co/abc123.',
		);
	}
	if (U301_RESERVED_SEGMENTS.has(host.toLowerCase())) {
		throw new U301InputError(
			`"${host}" is a reserved route, not a short link host.`,
		);
	}
	return `${encodeURIComponent(host)}/${encodeURIComponent(slug)}`;
}
