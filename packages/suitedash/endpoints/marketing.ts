import type { SuitedashEndpoints } from '..';
import { call } from './shared';
import {
	SuitedashEndpointInputSchemas as Inputs,
	SuitedashEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The body is a bare array of subscribers, not an envelope. The answer is one
 * result per subscriber, and its top-level `success` is true only when every one
 * worked, so a partial failure is visible in the per-item flags.
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
			log: (parsed, result) => ({
				submitted: parsed.subscribers.length,
				failed: result.data.filter((entry) => entry.success === false).length,
			}),
		},
	);
