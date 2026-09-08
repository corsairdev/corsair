import { logEventFromContext } from 'corsair/core';
import {
	makeBeaconchainV2Request,
	requireBeaconchainKey,
	v2Body,
} from '../client';
import type { BeaconchainEndpoints } from '../index';
import {
	BeaconchainV2ResponseSchema,
	GetLatestStateInputSchema,
} from './types';

/**
 * Retrieves the latest chain state via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including optional chain
 * @returns Latest chain state response
 */
export const getLatestState: BeaconchainEndpoints['getLatestState'] = async (
	ctx,
	input,
) => {
	const parsed = GetLatestStateInputSchema.parse(input);
	const res = await makeBeaconchainV2Request(
		'ethereum/state',
		requireBeaconchainKey(ctx.key),
		{
			method: 'POST',
			body: v2Body(parsed),
		},
	);
	await logEventFromContext(
		ctx,
		'beaconchain.latestState.get',
		{},
		'completed',
	);
	return BeaconchainV2ResponseSchema.parse(res);
};
