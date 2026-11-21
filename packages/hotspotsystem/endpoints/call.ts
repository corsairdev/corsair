import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { HotspotSystemContext } from '..';
import type { JsonValue } from '../client';
import {
	makeHotspotSystemPageRequest,
	makeHotspotSystemRequest,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Narrows a JSON value to an object, which is the only shape worth merging. */
function asRecord(
	value: JsonValue | undefined,
): Record<string, JsonValue> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? value
		: undefined;
}

/**
 * Reads one page of a list operation and records the event.
 *
 * Every list on this API pages the same way: `limit` and `offset` in the query,
 * and the next offset in the `Link` response header. That header cannot be read
 * through `corsair/http` alongside the body, so the page request is used here
 * and the parsed page carries `next_offset` for the caller to pass back.
 *
 * Inputs are not logged: a customer record carries an email address and a phone
 * number, so `log` picks the fields that are safe to keep.
 */
export async function readPage<
	Input extends z.ZodType,
	Output extends z.ZodType,
>(
	ctx: HotspotSystemContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: each caller passes its endpoint's own input type, which the
	// schema in `operation` validates. Core hands the bound endpoint whatever
	// the caller wrote, and core is what types this argument as unknown.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => {
		path: string;
		query?: Record<string, string | number | undefined>;
	},
	options: {
		log?: (result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const { path, query } = toRequest(parsed);

	const page = await makeHotspotSystemPageRequest(ctx.key, {
		method: 'GET',
		path,
		query,
	});

	// `next_offset` is added before parsing, so it is part of the value the
	// caller receives and is declared in the schema that documents it.
	// unknown: the page body is untyped until the output schema parses it.
	const body = asRecord(page.body as JsonValue);
	const raw =
		body && page.next_offset !== undefined
			? { ...body, next_offset: page.next_offset }
			: page.body;

	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`hotspotsystem.${operation.event}`,
		options.log?.(result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Reads one operation that is not a list and returns its parsed body. `/ping`
 * and `/me` are the only two, and neither pages.
 */
export async function readOne<
	Input extends z.ZodType,
	Output extends z.ZodType,
>(
	ctx: HotspotSystemContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: see readPage.
	rawInput: unknown,
	path: string,
	options: {
		log?: (result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	operation.input.parse(rawInput ?? {});
	const raw = await makeHotspotSystemRequest(ctx.key, { method: 'GET', path });
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`hotspotsystem.${operation.event}`,
		options.log?.(result) ?? {},
		'completed',
	);
	return result;
}
