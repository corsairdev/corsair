import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainHealthRequest, requireBeaconchainKey } from '../client';
import type { BeaconchainEndpoints } from '../index';
import {
	BeaconchainHealthResponseSchema,
	GetNodeHealthInputSchema,
} from './types';

export const getNodeHealth: BeaconchainEndpoints['getNodeHealth'] = async (
	ctx,
	input,
) => {
	const parsed = GetNodeHealthInputSchema.parse(input);
	const raw = await makeBeaconchainHealthRequest(
		requireBeaconchainKey(ctx.key),
		parsed.chain ?? 'mainnet',
	);
	await logEventFromContext(ctx, 'beaconchain.node.getHealth', {}, 'completed');
	return BeaconchainHealthResponseSchema.parse({ data: raw });
};
