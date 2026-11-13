import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RadarContext } from '..';
import type { RadarRequest } from '../client';
import { makeRadarRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Coordinates and user ids are personal data, so `log`
 * records ids, counts and codes rather than positions.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RadarContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RadarRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRadarRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`radar.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** A body member: a scalar, a coordinate array, a ring, or a metadata map. */
export type RadarValue =
	| string
	| number
	| boolean
	| number[]
	| number[][]
	// The caller's own metadata map, whose keys are theirs.
	| Record<string, string | number | boolean>;

/**
 * Drops unset values so an absent filter is not serialised. Radar reads `limit`
 * and its date cursors strictly enough that an empty value is a different query,
 * and it rejects a bad one with a `meta.code` of 400. The same helper builds a
 * request body, whose geometry and metadata members are arrays and maps.
 */
export function queryOf(
	values: Record<string, RadarValue | undefined>,
): Record<string, RadarValue> {
	const kept = Object.entries(values).filter(
		(entry): entry is [string, RadarValue] => entry[1] !== undefined,
	);
	return Object.fromEntries(kept);
}
