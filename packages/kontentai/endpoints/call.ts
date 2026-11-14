import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { KontentContext } from '..';
import type { KontentRequest } from '../client';
import { makeKontentRequest, nextSkipFrom } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * The environment ID doubles as the credential here, because the Delivery API
 * needs no key for published content unless secure access is on. Neither it
 * nor the Delivery API key is ever logged.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: KontentContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => KontentRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// The Delivery API key comes only from the account's stored
	// `delivery_api_key`, never from plugin options (R8, Credentials). Core
	// builds `ctx.keys` only with a database and a kek. Without one there is no
	// stored Delivery API key, and a published read needs none.
	const deliveryApiKey = await ctx.keys?.get_delivery_api_key();
	const raw = await makeKontentRequest(
		ctx.key,
		toRequest(parsed),
		deliveryApiKey,
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`kontentai.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A list answer's `next_skip` is derived from `pagination.next_page`, which
 * Kontent sends as a full URL or an empty string. Reading the number out of it
 * is done here rather than through a transform, because the docs generator reads
 * a transform's input side and would never show the field.
 */
export function listShape(
	// unknown: the raw body is an untyped envelope until the output schema runs.
	raw: unknown,
	parsed: { skip?: number | undefined; limit?: number | undefined },
	key: 'items' | 'types' | 'taxonomies' | 'languages',
	defaultLimit: number,
) {
	const record = asRecord(raw) ?? {};
	const entries = record[key];
	const count = Array.isArray(entries) ? entries.length : 0;
	return {
		...record,
		next_skip: nextSkipFrom(
			raw,
			parsed.skip ?? 0,
			count,
			parsed.limit ?? defaultLimit,
		),
	};
}
