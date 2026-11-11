import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

export const get: ShippoEndpoints['ratesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rates.get',
			input: Inputs.ratesGet,
			output: Outputs.ratesGet,
		},
		input,
		({ rate_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/rates/${segment(rate_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ rate_id }, result) => ({
				rateId: rate_id,
				provider: result.provider ?? undefined,
				amount: result.amount ?? undefined,
			}),
		},
	);
