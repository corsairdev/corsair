import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { NeuronwriterContext } from '..';
import type { NeuronwriterRequest } from '../client';
import { makeNeuronwriterRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Article text is never logged; `log` picks ids and counts.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: NeuronwriterContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => NeuronwriterRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeNeuronwriterRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`neuronwriter.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Every method answers a bare array where the docs show a list, so the wrapper
 * keys it. A non-array means the provider answered an error object instead.
 */
export function asList(
	// unknown: the provider's array, or something that is not one.
	raw: unknown,
	name: string,
): unknown[] {
	if (!Array.isArray(raw)) {
		throw new Error(`Expected a NEURONwriter ${name} array, got ${typeof raw}`);
	}
	return raw;
}
