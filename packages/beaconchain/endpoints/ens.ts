import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const resolveEns: BeaconchainEndpoints['resolveEns'] = async (
	ctx,
	input,
) => {
	const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
		`ens/resolve/${input.name}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'beaconchain.ens.resolve',
		{ name: input.name },
		'completed',
	);
	return res;
};
