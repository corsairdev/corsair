import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MapboxContext } from '..';
import type { MapboxRequest } from '../client';
import { makeMapboxRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. Inputs are not logged: they hold addresses and coordinates, which
 * are personal data, so `log` picks counts and codes only.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: MapboxContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: unknown /* unknown: parsed below by the input schema */,
	toRequest: (parsed: z.output<Input>) => MapboxRequest,
	log?: (result: z.output<Output>) => LogFields,
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeMapboxRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`mapbox.${operation.event}`,
		log?.(result) ?? {},
		'completed',
	);
	return result;
}
