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
