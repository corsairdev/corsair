import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getEpoch: BeaconchainEndpoints['getEpoch'] = async (
	ctx,
	input,
) => {
	const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
		`epoch/${input.epochId}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'beaconchain.epoch.get',
		{ epochId: String(input.epochId) },
		'completed',
	);
	return res;
};
