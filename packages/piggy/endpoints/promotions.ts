import type { PiggyEndpoints } from '..';
import { call } from './call';
import {
	PiggyEndpointInputSchemas as Inputs,
	PiggyEndpointOutputSchemas as Outputs,
} from './types';

const CLIENT = '/api/v3/oauth/clients';

export const list: PiggyEndpoints['promotionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'promotions.list',
			input: Inputs.promotionsList,
			output: Outputs.promotionsList,
		},
		input,
		() => ({ method: 'GET', path: `${CLIENT}/promotions` }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const get: PiggyEndpoints['promotionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'promotions.get',
			input: Inputs.promotionsGet,
			output: Outputs.promotionsGet,
		},
		input,
		({ promotionUuid }) => ({
			method: 'GET',
			path: `${CLIENT}/promotions/${encodeURIComponent(promotionUuid)}`,
		}),
		{
			log: (_, promotion) => ({
				promotionUuid: promotion.data.uuid ?? undefined,
			}),
		},
	);
