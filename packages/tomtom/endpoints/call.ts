import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TomTomContext } from '..';
import type { TomTomRequest } from '../client';
import { makeTomTomRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs the
 * event. A route's waypoints are logged as counts, not coordinates.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TomTomContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TomTomRequest,
	options: {
		// unknown: raw is the response body; the output schema validates it.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTomTomRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`tomtom.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Renders a waypoint list as the `lat,lon:lat,lon` path segment. */
export function routePoints(
	points: readonly { latitude: number; longitude: number }[],
): string {
	return points
		.map((point) => `${point.latitude},${point.longitude}`)
		.join(':');
}
