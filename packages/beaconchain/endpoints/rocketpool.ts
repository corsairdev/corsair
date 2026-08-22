import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getRocketpoolValidator: BeaconchainEndpoints['getRocketpoolValidator'] =
	async (ctx, input) => {
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`rocketpool/validator/${input.indexOrPubkey}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'beaconchain.rocketpool.getValidator',
			{ indexOrPubkey: input.indexOrPubkey },
			'completed',
		);
		return res;
	};
