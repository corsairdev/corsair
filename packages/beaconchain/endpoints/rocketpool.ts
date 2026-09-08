import { logEventFromContext } from 'corsair/core';
import {
	makeBeaconchainV1Request,
	requireBeaconchainKey,
	v1GetOptions,
} from '../client';
import type { BeaconchainEndpoints } from '../index';
import {
	BeaconchainV1ResponseSchema,
	GetRocketpoolValidatorInputSchema,
} from './types';

/**
 * Retrieves Rocket Pool validator details via Beaconchain V1 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including indexOrPubkey and optional chain
 * @returns Rocket Pool validator response
 */
export const getRocketpoolValidator: BeaconchainEndpoints['getRocketpoolValidator'] =
	async (ctx, input) => {
		const parsed = GetRocketpoolValidatorInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			`rocketpool/validator/${parsed.indexOrPubkey}`,
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.rocketpool.getValidator',
			{ indexOrPubkey: parsed.indexOrPubkey },
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};
