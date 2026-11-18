import type { TinyFishEndpoints } from '..';
import { makeTinyFishRequest } from '../client';
import { callTinyFish } from './call';
import {
	TinyFishEndpointInputSchemas,
	TinyFishEndpointOutputSchemas,
} from './types';

export const list: TinyFishEndpoints['listVaultItems'] = async (ctx) => {
	return callTinyFish(
		ctx,
		'tinyfish.vault.list',
		TinyFishEndpointInputSchemas.listVaultItems,
		TinyFishEndpointOutputSchemas.listVaultItems,
		{},
		() =>
			makeTinyFishRequest('agent', '/v1/vault/items', ctx.key, {
				method: 'GET',
			}),
		(_validated, response) => ({
			count: response.items.length,
			totpCount: response.items.filter((item) => item.hasTotp).length,
		}),
	);
};
