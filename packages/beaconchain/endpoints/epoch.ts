import { logEventFromContext } from 'corsair/core';
import {
	makeBeaconchainV1Request,
	requireBeaconchainKey,
	v1GetOptions,
} from '../client';
import type { BeaconchainEndpoints } from '../index';
import { BeaconchainV1ResponseSchema, GetEpochInputSchema } from './types';

export const getEpoch: BeaconchainEndpoints['getEpoch'] = async (
	ctx,
	input,
) => {
	const parsed = GetEpochInputSchema.parse(input);
	const res = await makeBeaconchainV1Request(
		`epoch/${parsed.epochId}`,
		requireBeaconchainKey(ctx.key),
		v1GetOptions(parsed.chain),
	);
	await logEventFromContext(
		ctx,
		'beaconchain.epoch.get',
		{ epochId: String(parsed.epochId) },
		'completed',
	);
	return BeaconchainV1ResponseSchema.parse(res);
};
