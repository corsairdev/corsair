import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { NinoxContext } from '..';
import type { NinoxRequest } from '../client';
import { makeNinoxRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Record values hold customer data, so only the ids and
 * counts `log` picks are logged.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: NinoxContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => NinoxRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeNinoxRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`ninox.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Lifts the `data` block out of a list response. Ninox wraps every collection in
 * `{ data, page_info }`, and the key inside `data` differs per route, so each
 * caller names it.
 */
// unknown: the provider's envelope, read field by field.
export function dataList(
	raw: unknown,
	key: string,
): { items: unknown[]; pageInfo?: unknown } {
	const envelope = asRecord(raw);
	const items = envelope?.data;
	if (!Array.isArray(items)) {
		throw new Error(`Expected a Ninox ${key} array, got ${typeof items}`);
	}
	return { items, pageInfo: envelope?.page_info };
}

/** Reads the `data` object out of a single-resource response. */
// unknown: the provider's envelope, read field by field.
export function dataObject(raw: unknown): Record<string, unknown> {
	const data = asRecord(asRecord(raw)?.data);
	if (!data) {
		throw new Error(`Expected a Ninox data object, got ${typeof raw}`);
	}
	return data;
}
