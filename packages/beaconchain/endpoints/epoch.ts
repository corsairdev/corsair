import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainV2Request } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getEpoch: BeaconchainEndpoints['getEpoch'] = async (
	ctx,
	input,
) => {
	const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
		'ethereum/epoch',
		ctx.key,
		{
			method: 'POST',
			body: {
				chain: 'mainnet',
				epoch: input.epochId,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'beaconchain.epoch.get',
		{ epochId: String(input.epochId) },
		'completed',
	);
	return res;
};
