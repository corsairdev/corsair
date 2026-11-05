import type { TinyFishEndpoints } from '..';
import { makeTinyFishRequest } from '../client';
import { callTinyFish } from './call';
import {
	TinyFishEndpointInputSchemas,
	TinyFishEndpointOutputSchemas,
} from './types';

export const get: TinyFishEndpoints['getWallet'] = async (ctx) => {
	return callTinyFish(
		ctx,
		'tinyfish.wallet.get',
		TinyFishEndpointInputSchemas.getWallet,
		TinyFishEndpointOutputSchemas.getWallet,
		{},
		() =>
			makeTinyFishRequest('agent', '/v1/wallet', ctx.key, { method: 'GET' }),
		(_validated, response) => ({
			availableBalance: response.available_balance,
			currency: response.currency,
			pendingTopUp: response.pending_top_up !== null,
		}),
	);
};
