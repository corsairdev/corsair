import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainV2Request } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getRocketpoolValidator: BeaconchainEndpoints['getRocketpoolValidator'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/rocketpool/validator',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					validator: {
						validator_identifiers: [input.indexOrPubkey],
					},
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.rocketpool.getValidator',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};
