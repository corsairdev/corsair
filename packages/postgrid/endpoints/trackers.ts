import type { PostgridEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PostgridEndpointInputSchemas as Inputs,
	PostgridEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Reads one order's current position in its lifecycle. The route answers the
 * order itself, so the output accepts any order's fields and reports `status`
 * plus, on live US mail, the `imbStatus` USPS stage.
 */
export const get: PostgridEndpoints['trackersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trackers.get',
			input: Inputs.trackersGet,
			output: Outputs.trackersGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/trackers/${segment(id)}` }),
		{
			log: ({ id }, result) => ({
				orderId: id,
				status: result.status ?? undefined,
				imbStatus: result.imbStatus ?? undefined,
			}),
		},
	);
