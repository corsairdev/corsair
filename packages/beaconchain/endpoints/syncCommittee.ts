import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getSyncCommittee: BeaconchainEndpoints['getSyncCommittee'] =
	async (ctx, input) => {
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			'sync_committee',
			ctx.key,
			{
				method: 'GET',
				query: {
					...(input.period !== undefined ? { period: input.period } : {}),
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.syncCommittee.get',
			{ period: input.period },
			'completed',
		);
		return res;
	};
