import type { WaiverFileEndpoints } from '..';
import { call } from './call';
import {
	WaiverFileEndpointInputSchemas as Inputs,
	WaiverFileEndpointOutputSchemas as Outputs,
} from './types';

/** SMS subscribers added in a range. */
export const list: WaiverFileEndpoints['subscribersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscribers.list',
			input: Inputs.subscribersList,
			output: Outputs.subscribersList,
		},
		input,
		({ startDateUTC, endDateUTC }) => ({
			method: 'GET',
			path: '/api/v1/GetSubscribersByDate',
			query: { startDateUTC, endDateUTC },
		}),
		{
			log: (_, result) => ({ count: result.Subscribers?.length ?? 0 }),
		},
	);

/** Subscribers who opted out in a range, which is what a suppression list needs. */
export const optedOut: WaiverFileEndpoints['subscribersOptedOut'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscribers.optedOut',
			input: Inputs.subscribersOptedOut,
			output: Outputs.subscribersOptedOut,
		},
		input,
		({ startDateUTC, endDateUTC }) => ({
			method: 'GET',
			path: '/api/v1/GetOptedOutSubscribersByOptOutDate',
			query: { startDateUTC, endDateUTC },
		}),
		{
			log: (_, result) => ({ count: result.Subscribers?.length ?? 0 }),
		},
	);
