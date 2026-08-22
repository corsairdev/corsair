import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getNodeHealth: BeaconchainEndpoints['getNodeHealth'] = async (
	ctx,
	_input,
) => {
	const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
		'node/health',
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'beaconchain.node.getHealth', {}, 'completed');
	return res;
};
