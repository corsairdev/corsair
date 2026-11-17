import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { NiftyimagesContext } from '..';
import type { NiftyimagesRequest } from '../client';
import { makeNiftyimagesRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Widget users hold email addresses, so only the counts
 * `log` picks are logged.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: NiftyimagesContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => NiftyimagesRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeNiftyimagesRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`niftyimages.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Several list calls answer a bare array, which the wrapper keys. The docs' own
 * example for `/Widgets` shows a bare array, so a non-array means an error body
 * rather than an empty page.
 */
export function asList(
	// unknown: the provider's array, or something that is not one.
	raw: unknown,
	name: string,
): unknown[] {
	if (!Array.isArray(raw)) {
		throw new Error(`Expected a NiftyImages ${name} array, got ${typeof raw}`);
	}
	return raw;
}
