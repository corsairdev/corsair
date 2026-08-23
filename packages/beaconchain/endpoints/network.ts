import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainV2Request } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getNetworkPerformance: BeaconchainEndpoints['getNetworkPerformance'] =
	async (ctx, _input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/network/performance',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.network.getPerformance',
			{},
			'completed',
		);
		return res;
	};
