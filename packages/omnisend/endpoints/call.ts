import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { OmnisendContext } from '..';
import type { OmnisendQuery, OmnisendRequest } from '../client';
import { makeOmnisendRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: OmnisendContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => OmnisendRequest,
	options: {
		// unknown: the response body before the output schema validates it.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeOmnisendRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`omnisend.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** A path segment, percent-encoded. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/** The query keys of a cursor-paged list route. */
export function cursorPageQuery(parsed: {
	limit?: number;
	after?: string;
	before?: string;
}): OmnisendQuery {
	return { limit: parsed.limit, after: parsed.after, before: parsed.before };
}

/** The query keys of an offset-paged list route. */
export function offsetPageQuery(parsed: {
	offset?: number;
	limit?: number;
}): OmnisendQuery {
	return { offset: parsed.offset, limit: parsed.limit };
}

/**
 * The cursor-paged response with `nextCursor` added, from `paging.cursors.after`.
 *
 * The envelope is passed through unchanged, so the resource array and `paging`
 * stay exactly as Omnisend sent them. `after` is null on the last page.
 */
// unknown: `raw` is the response body, validated by the output schema.
export function withCursor(raw: unknown): unknown {
	const cursors = asRecord(asRecord(asRecord(raw)?.paging)?.cursors);
	const after = cursors?.after;
	return {
		...(asRecord(raw) ?? {}),
		nextCursor:
			typeof after === 'string' && after.length > 0 ? after : undefined,
	};
}

/**
 * The offset-paged response with `nextOffset` added, from the `offset` query
 * parameter of `paging.next`.
 *
 * Omnisend puts absolute URLs in `paging.next`/`paging.previous`; parsing the
 * cursor out of the URL saves the caller from doing it. Absent on the last page.
 */
// unknown: `raw` is the response body, validated by the output schema.
export function withNextOffset(raw: unknown): unknown {
	return { ...(asRecord(raw) ?? {}), nextOffset: nextOffset(raw) };
}

/** The next page's offset, read out of `paging.next`. */
// unknown: `raw` is the response body; the offset lives in the `next` URL.
export function nextOffset(raw: unknown): number | undefined {
	const next = asRecord(asRecord(raw)?.paging)?.next;
	if (typeof next !== 'string' || next.length === 0) return undefined;
	try {
		const value = new URL(next).searchParams.get('offset');
		if (value === null) return undefined;
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : undefined;
	} catch {
		return undefined;
	}
}
