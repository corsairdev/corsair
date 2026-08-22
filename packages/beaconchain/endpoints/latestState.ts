import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getLatestState: BeaconchainEndpoints['getLatestState'] = async (
	ctx,
	_input,
) => {
	const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
		'state/latest',
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'beaconchain.latestState.get',
		{},
		'completed',
	);
	return res;
};
