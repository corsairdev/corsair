import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { FoursquareContext } from '..';
import type { FoursquareRequest } from '../client';
import { makeFoursquareRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: FoursquareContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => FoursquareRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeFoursquareRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`foursquare.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Drops unset query values, and joins array-valued parameters with commas,
 * which is the form Foursquare documents for `fsq_category_ids`, `fields` and
 * the rest. An empty string would be sent verbatim and rejected, so `undefined`
 * is the only "not set" value.
 */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	return Object.fromEntries(
		Object.entries(values).filter(([, value]) => value !== undefined),
	);
}

/**
 * Joins an optional array parameter the way Foursquare expects it. An undefined
 * or empty list stays undefined so nothing is sent.
 */
export function csv(
	values: readonly (string | number)[] | undefined,
): string | undefined {
	return values === undefined || values.length === 0
		? undefined
		: values.join(',');
}

/**
 * Joins a `fields` selection, always keeping the identifiers the output schema
 * requires.
 *
 * Foursquare returns **only** the fields asked for, so `fields=name` answers
 * `{"results":[{"name":"Thalia Hall"}]}` with no `fsq_place_id`, which fails the
 * output parse. Verified live. Adding the required ids back means a caller's
 * selection works and still yields a usable object, rather than the plugin
 * weakening its schema to accept an ID-less place.
 */
export function fieldsWith(
	values: readonly string[] | undefined,
	required: readonly string[],
): string | undefined {
	if (values === undefined) return undefined;
	const kept = [...values];
	for (const field of required) {
		if (!kept.includes(field)) kept.push(field);
	}
	return kept.join(',');
}
