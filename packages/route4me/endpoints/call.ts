import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { Route4meContext } from '..';
import type { Route4MeRequest } from '../client';
import { makeRoute4MeRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Route ids and addresses are customer data, so `log`
 * records identifiers and counts rather than free text.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: Route4meContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => Route4MeRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRoute4MeRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`route4me.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** A scalar, a repeated scalar, or a provider-shaped map this plugin passes on. */
export type Route4MeValue =
	| string
	| number
	| boolean
	// A repeated query parameter, such as `fields` or `facility_ids`.
	| readonly (string | number)[]
	// unknown: caller-defined maps (`address_custom_data`, `custom_user_fields`)
	// have no fixed shape, so their leaves stay open.
	| Record<string, unknown>
	// unknown: an order's custom field rows are arrays of caller-named maps.
	| readonly Record<string, unknown>[];

/**
 * Drops unset values so an absent filter is not serialised. Route4Me validates
 * `display` and `fields` strictly enough that an empty string is rejected.
 */
export function queryOf(
	values: Record<string, Route4MeValue | undefined>,
): Record<string, Route4MeValue> {
	const kept = Object.entries(values).filter(
		(entry): entry is [string, Route4MeValue] => entry[1] !== undefined,
	);
	return Object.fromEntries(kept);
}
