import { logEventFromContext } from 'corsair/core';
import type { InstantlyContext } from '..';
import type { InstantlyRequest } from '../client';
import { makeInstantlyRequest } from '../client';
import type {
	InstantlyEndpointOutputs,
	InstantlyOperation,
	InstantlyParsedInputs,
} from './types';
import {
	InstantlyEndpointInputSchemas,
	InstantlyEndpointOutputSchemas,
} from './types';

type LogFields = Record<string, string | number | boolean | null | undefined>;

/**
 * Validates the input, sends one request, validates the response and logs
 * the call. Only IDs and counts are logged: inputs and results hold lead
 * names, addresses and email bodies.
 */
export async function call<K extends InstantlyOperation>(
	ctx: InstantlyContext,
	operation: K,
	event: string,
	// unknown: raw caller input, parsed below by the operation's input schema.
	input: unknown,
	toRequest: (parsed: InstantlyParsedInputs[K]) => InstantlyRequest,
	options: {
		log?: (
			parsed: InstantlyParsedInputs[K],
			result: InstantlyEndpointOutputs[K],
		) => LogFields;
		after?: (
			result: InstantlyEndpointOutputs[K],
			parsed: InstantlyParsedInputs[K],
		) => Promise<void>;
	} = {},
): Promise<InstantlyEndpointOutputs[K]> {
	// The schema map is indexed by a generic key, which TypeScript cannot
	// narrow to the matching schema; parse() is that schema's output type.
	const parsed = InstantlyEndpointInputSchemas[operation].parse(
		input ?? {},
	) as InstantlyParsedInputs[K];
	const raw = await makeInstantlyRequest(ctx.key, toRequest(parsed));
	const result = InstantlyEndpointOutputSchemas[operation].parse(
		raw,
	) as InstantlyEndpointOutputs[K];

	await options.after?.(result, parsed);
	await logEventFromContext(
		ctx,
		`instantly.${event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

export function countOf(value: { items?: readonly unknown[] } | unknown[]) {
	return Array.isArray(value) ? value.length : (value.items?.length ?? 0);
}
