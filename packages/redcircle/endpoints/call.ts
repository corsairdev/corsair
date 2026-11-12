import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RedcircleContext } from '..';
import type { RedcircleRequest } from '../client';
import { makeRedcircleRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. The `api_key` is never logged, and neither is a product
 * title or a review body, because both are scraping output rather than ids.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RedcircleContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RedcircleRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRedcircleRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`redcircle.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Drops unset query values so an absent filter is not serialised. RedCircle
 * validates `type` strictly: an unknown value answers 400 with the list of valid
 * ones, and an empty `search_term` is a different request from an omitted one.
 */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const kept = Object.entries(values).filter(
		([, value]) => value !== undefined,
	);
	return Object.fromEntries(kept);
}
