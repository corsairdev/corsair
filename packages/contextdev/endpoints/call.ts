import { logEventFromContext } from 'corsair/core';
import type { ContextDevContext } from '..';
import type { ContextDevQuery } from '../client';
import { makeContextDevRequest } from '../client';
import type {
	ContextDevEndpointInputs,
	ContextDevEndpointOutputs,
} from './types';
import {
	ContextDevEndpointInputSchemas,
	ContextDevEndpointOutputSchemas,
} from './types';

type Operation = keyof ContextDevEndpointInputs;

/**
 * Validates the input, sends it as the query string (GET) or JSON body (POST),
 * validates the response and logs the call with its credit cost.
 */
export async function call<K extends Operation>(
	ctx: ContextDevContext,
	operation: K,
	event: string,
	method: 'GET' | 'POST',
	path: string,
	input: unknown,
): Promise<ContextDevEndpointOutputs[K]> {
	const parsed = ContextDevEndpointInputSchemas[operation].parse(input ?? {});
	const raw = await makeContextDevRequest<unknown>(path, ctx.key, {
		method,
		...(method === 'GET'
			? { query: parsed as ContextDevQuery }
			: { body: parsed }),
	});
	const result = ContextDevEndpointOutputSchemas[operation].parse(
		raw,
	) as ContextDevEndpointOutputs[K];

	const credits =
		'key_metadata' in result
			? result.key_metadata?.credits_consumed
			: undefined;
	await logEventFromContext(
		ctx,
		`contextdev.${event}`,
		{ creditsConsumed: credits },
		'completed',
	);
	return result;
}
