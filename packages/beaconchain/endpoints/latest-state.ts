import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainV2Request } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getLatestState: BeaconchainEndpoints['getLatestState'] = async (
	ctx,
	_input,
) => {
	const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
		'ethereum/state/latest',
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
		'beaconchain.latestState.get',
		{},
		'completed',
	);
	return res;
};
