import { logEventFromContext } from 'corsair/core';
import type { TikHubContext } from '..';
import type { TikHubQuery } from '../client';
import { errorFromEnvelope, makeTikHubRequest } from '../client';
import type {
	TikHubEndpointInputs,
	TikHubEndpointOutputs,
	TikHubOperation,
} from './types';
import {
	TikHubEndpointInputSchemas,
	TikHubEndpointOutputSchemas,
} from './types';

/**
 * Validates the input, sends it as the query string, rejects envelopes that
 * report a failure, validates the response and logs the call.
 */
export async function call<K extends TikHubOperation>(
	ctx: TikHubContext,
	operation: K,
	event: string,
	path: string,
	// unknown: raw caller input, parsed below by the operation's input schema.
	input: unknown,
	toQuery: (parsed: TikHubEndpointInputs[K]) => TikHubQuery = (parsed) =>
		parsed as TikHubQuery,
): Promise<TikHubEndpointOutputs[K]> {
	const parsed = TikHubEndpointInputSchemas[operation].parse(
		input ?? {},
	) as TikHubEndpointInputs[K];
	const query = toQuery(parsed);
	const raw = await makeTikHubRequest(path, ctx.key, query);

	const envelopeError = errorFromEnvelope(raw);
	if (envelopeError) throw envelopeError;

	const result = TikHubEndpointOutputSchemas[operation].parse(
		raw,
	) as TikHubEndpointOutputs[K];

	await logEventFromContext(
		ctx,
		`tikhub.${event}`,
		{
			...query,
			requestId: 'request_id' in result ? result.request_id : undefined,
		},
		'completed',
	);
	return result;
}
