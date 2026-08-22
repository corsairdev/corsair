import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getNetworkPerformance: BeaconchainEndpoints['getNetworkPerformance'] =
	async (ctx, _input) => {
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			'network/performance',
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'beaconchain.network.getPerformance',
			{},
			'completed',
		);
		return res;
	};
