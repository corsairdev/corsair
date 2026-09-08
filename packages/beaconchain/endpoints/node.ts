import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainHealthRequest, requireBeaconchainKey } from '../client';
import type { BeaconchainEndpoints } from '../index';
import {
	BeaconchainHealthResponseSchema,
	GetNodeHealthInputSchema,
} from './types';

/**
 * Retrieves node health status via Beaconchain health endpoint.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including optional chain
 * @returns Node health response
 */
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
