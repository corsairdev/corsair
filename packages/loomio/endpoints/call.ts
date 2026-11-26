import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { LoomioContext } from '..';
import type { LoomioRequest } from '../client';
import { makeLoomioRequest } from '../client';
import { nextOffset } from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * The installation origin: `options.baseUrl` first, then the account's stored
 * `base_url`, else undefined (www.loomio.com). Read per call so each tenant's
 * account can point at its own self-hosted install.
 */
export async function resolveBaseUrl(
	ctx: LoomioContext,
): Promise<string | undefined> {
	const fromOptions = ctx.options?.baseUrl?.trim();
	if (fromOptions) return fromOptions;
	const fromAccount = (await ctx.keys?.get_base_url?.())?.trim();
	return fromAccount ? fromAccount : undefined;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged because discussion and comment
 * bodies hold user content; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: LoomioContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => LoomioRequest,
	options: {
		// unknown: raw is the response body, parsed by the output schema below.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeLoomioRequest(
		{ key: ctx.key, baseUrl: await resolveBaseUrl(ctx) },
		toRequest(parsed),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`loomio.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Spreads the compound-record envelope and adds `next_offset`, derived from
 * `meta.total` and how many primary records the page actually returned. A
 * wrong-shaped envelope yields next_offset: undefined and still fails the
 * output parse when the primary array is missing.
 */
export function withPaging(
	// unknown: raw is the response body, parsed by the output schema below.
	raw: unknown,
	root: string,
	offset: number,
): Record<string, unknown> {
	const envelope = asRecord(raw) ?? {};
	const primary = envelope[root];
	const returned = Array.isArray(primary) ? primary.length : 0;
	const total = asRecord(envelope.meta)?.total;
	return {
		...envelope,
		next_offset: nextOffset(
			typeof total === 'number' ? total : null,
			offset,
			returned,
		),
	};
}

/**
 * Spreads the envelope of a single-record response and adds `<singular>` from
 * the first element of the `<root>` array (Loomio's show routes answer the
 * collection form with one element). A missing element leaves `<singular>`
 * undefined, which the required output field turns into a loud parse failure.
 */
export function unwrapResource(
	// unknown: raw is the response body, parsed by the output schema below.
	raw: unknown,
	root: string,
	singular: string,
): Record<string, unknown> {
	const envelope = asRecord(raw) ?? {};
	const primary = envelope[root];
	const first = Array.isArray(primary) ? primary[0] : undefined;
	return { ...envelope, [singular]: first };
}

/** Copy of `input` without the listed keys (path params that aren't body fields). */
export function bodyWithout<
	T extends Record<string, unknown>,
	K extends keyof T,
>(input: T, ...keys: K[]): Omit<T, K> {
	const copy: Record<string, unknown> = { ...input };
	for (const key of keys) delete copy[key as string];
	return copy as Omit<T, K>;
}
