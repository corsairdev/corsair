import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SimpleroContext } from '..';
import type { SimpleroRequest } from '../client';
import { makeSimpleroRequest } from '../client';
import type { JsonObject, UnknownJson } from '../json';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Field values are not logged: a customer carries an email
 * address and a purchase an address, so `log` picks identifiers only.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SimpleroContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: UnknownJson, // unknown: raw caller input, parsed by the input schema
	toRequest: (parsed: z.output<Input>) => SimpleroRequest,
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeSimpleroRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`simplero.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Splits `id` off the body of a PATCH, so the record id stays in the path and
 * the body carries only the fields being changed.
 */
export function without<T extends { id: number } & Record<string, UnknownJson>>(
	parsed: T,
): Record<string, UnknownJson> {
	const { id: _id, ...body } = parsed;
	return body;
}

/**
 * Drops undefined values so a PATCH does not send keys the caller did not set.
 * Simplero treats a present null as "clear this", so nulls are kept.
 */
export function compact(
	body: Record<string, UnknownJson>,
): Record<string, UnknownJson> {
	const out: Record<string, UnknownJson> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

/**
 * Reads the record id out of a `{ data: T }` envelope, for a log line. Not every
 * record carries an `id` (lists, tags and products are identified by `token`),
 * so the value is checked rather than asserted.
 */
export function dataId(result: { data: JsonObject }): number | undefined {
	const id = result.data.id;
	return typeof id === 'number' ? id : undefined;
}
