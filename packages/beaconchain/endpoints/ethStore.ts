import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getEthStoreDaily: BeaconchainEndpoints['getEthStoreDaily'] =
	async (ctx, input) => {
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			'ethstore/daily',
			ctx.key,
			{
				method: 'GET',
				query: {
					...(input.day !== undefined ? { day: input.day } : {}),
					...(input.limit !== undefined ? { limit: input.limit } : {}),
					...(input.page !== undefined ? { page: input.page } : {}),
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.ethStore.getDaily',
			{ day: input.day },
			'completed',
		);
		return res;
	};
