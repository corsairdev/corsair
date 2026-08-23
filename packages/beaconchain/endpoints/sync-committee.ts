import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainV2Request } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getSyncCommittee: BeaconchainEndpoints['getSyncCommittee'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/sync-committee',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
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
