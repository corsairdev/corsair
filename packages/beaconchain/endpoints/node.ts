import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainV2Request } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getNodeHealth: BeaconchainEndpoints['getNodeHealth'] = async (
	ctx,
	_input,
) => {
	const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
		'ethereum/node/health',
		ctx.key,
		{
			method: 'POST',
			body: {
				chain: 'mainnet',
			},
		},
	);
	await logEventFromContext(ctx, 'beaconchain.node.getHealth', {}, 'completed');
	return res;
};
