import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SimplesatContext } from '..';
import type { SimplesatRequest } from '../client';
import { makeSimplesatRequest } from '../client';
import type { JsonObject, UnknownJson } from '../json';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Simplesat's `next` link is a full URL. The client joins `path` onto the API
 * base, so the base is stripped here; a link pointing anywhere else is refused
 * rather than sent, because following it would carry the token off-host.
 */
export function parseNextLink(nextLink: string): string | null {
	let url: URL;
	try {
		url = new URL(nextLink, 'https://api.simplesat.io');
	} catch {
		return null;
	}
	if (url.origin !== 'https://api.simplesat.io') return null;
	return `${url.pathname}${url.search}`;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Contact details are not logged: a customer carries an
 * email address and a response can carry a comment, so `log` picks ids only.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SimplesatContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: UnknownJson, // unknown: raw caller input, parsed by the input schema
	toRequest: (parsed: z.output<Input>) => SimplesatRequest,
	options: {
		shape?: (
			raw: UnknownJson, // unknown: the response body, absent when empty
			parsed: z.output<Input>,
		) => UnknownJson; // unknown: the output schema validates what this returns
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeSimplesatRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`simplesat.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A page link is a URL on api.simplesat.io or null on the last page. Anything
 * else is refused: a wrong type would read as "no more pages", and a link to
 * another host would carry the token off-host if followed.
 */
function pageLink(
	value: UnknownJson, // unknown: the raw `next` or `previous` field
	name: string,
): string | null {
	if (value === null || value === undefined) return null;
	if (typeof value !== 'string') {
		throw new Error(`Simplesat sent a ${typeof value} as the ${name} link.`);
	}
	const path = parseNextLink(value);
	if (path === null) {
		throw new Error(
			`Simplesat sent a ${name} link that is not on api.simplesat.io.`,
		);
	}
	return path;
}

/**
 * Turns a list answer into the shape the output schema declares: the page links
 * become paths, and the resource array is renamed to `results` so one shape
 * covers every list route.
 *
 * `PageOutput` is the caller's own output type, so the caller names it and the
 * schema still validates every field. The items are passed through untouched:
 * the output schema is what checks each one.
 */
export function pageShape<PageOutput>(
	raw: UnknownJson, // unknown: the envelope as returned, checked below
	key: string,
): PageOutput {
	const record =
		raw !== null && typeof raw === 'object' && !Array.isArray(raw)
			? (raw as JsonObject)
			: undefined;
	const items = record?.[key];
	if (!Array.isArray(items)) {
		throw new Error(
			`Expected a ${key} array from Simplesat, which answers lists with { next, previous, count, ${key} }.`,
		);
	}
	const count = record?.count;
	const shaped: UnknownJson = {
		next: pageLink(record?.next, 'next'),
		previous: pageLink(record?.previous, 'previous'),
		count: typeof count === 'number' ? count : null,
		results: items,
	};
	return shaped as PageOutput;
}
