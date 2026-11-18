import type { SuitedashEndpoints } from '..';
import { call } from './shared';
import {
	SuitedashEndpointInputSchemas as Inputs,
	SuitedashEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The body is a bare array of subscribers, not an envelope. The answer is one
 * result per subscriber, and its top-level `success` is true only when every one
 * worked. A partial failure therefore throws SuitedashAPIError; its `body.data`
 * holds the per-subscriber results (emails masked).
 */
export const subscribe: SuitedashEndpoints['marketingSubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'marketing.subscribe',
			input: Inputs.marketingSubscribe,
			output: Outputs.marketingSubscribe,
		},
		input,
		({ subscribers }) => ({
			method: 'POST',
			path: '/marketing/subscribe',
			body: subscribers,
		}),
		{
			// Only a full success returns, so the count of submitted is the count.
			log: (parsed) => ({ submitted: parsed.subscribers.length }),
		},
	);
