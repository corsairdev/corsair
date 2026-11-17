import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** GET /v2/merchants/{merchant_id} (RetrieveMerchant). */
export const get: SquareEndpoints['merchantsGet'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.merchantsGet.parse(rawInput);
	return callSquare(ctx, '/v2/merchants/{merchant_id}', {
		path: { merchant_id: input.merchant_id },
		output: SquareEndpointOutputSchemas.merchantsGet,
		event: 'merchants.get',
		logged: { merchant_id: input.merchant_id },
	});
};

/** GET /v2/merchants (ListMerchants). */
export const list: SquareEndpoints['merchantsList'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.merchantsList.parse(rawInput ?? {});
	return callSquare(ctx, '/v2/merchants', {
		query: input,
		output: SquareEndpointOutputSchemas.merchantsList,
		event: 'merchants.list',
	});
};
