import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { KommoContext } from '..';
import type { KommoRequest } from '../client';
import { makeKommoRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * The subdomain Kommo serves this account from. It is a per-account credential
 * field rather than a plugin option, so one integration serves several
 * customers.
 */
export async function resolveSubdomain(ctx: KommoContext): Promise<string> {
	const fromOption = ctx.options.subdomain;
	if (fromOption) return fromOption;
	const stored = await ctx.keys.get_subdomain();
	return stored ?? '';
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * A lead or contact carries the customer's name, phone and email, so `log` names
 * the entity by ID and never by its contents.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: KommoContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => KommoRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const subdomain = await resolveSubdomain(ctx);
	const raw = await makeKommoRequest(ctx.key, subdomain, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`kommo.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Kommo lists by page number and reports the next page only through `_links`,
 * which is absent on the last page. `next_page` is derived from it here rather
 * than through a transform, because the docs generator reads a transform's
 * input side and would never show the field.
 */
// unknown: the raw body is an untyped HAL envelope until the output schema runs.
export function pageFrom(
	// unknown: the raw body is an untyped HAL envelope until the output schema
	// runs.
	raw: unknown,
	requestedPage: number | undefined,
	returned: number,
	requestedLimit: number | undefined,
): number | null {
	const record =
		raw !== null && typeof raw === 'object' && !Array.isArray(raw)
			? (raw as Record<string, unknown>)
			: null;
	const links = record?._links;
	const next =
		links !== null && typeof links === 'object' && !Array.isArray(links)
			? (links as Record<string, unknown>).next
			: undefined;
	if (next !== undefined && next !== null) {
		return (requestedPage ?? 1) + 1;
	}
	// A full page is worth following even when Kommo omits the link, and a short
	// page is the last one.
	const limit = requestedLimit ?? 250;
	return returned >= limit ? (requestedPage ?? 1) + 1 : null;
}
