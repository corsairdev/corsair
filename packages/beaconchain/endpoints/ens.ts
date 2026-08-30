import { logEventFromContext } from 'corsair/core';
import {
	makeBeaconchainV1Request,
	requireBeaconchainKey,
	v1GetOptions,
} from '../client';
import type { BeaconchainEndpoints } from '../index';
import { BeaconchainV1ResponseSchema, ResolveEnsInputSchema } from './types';

export const resolveEns: BeaconchainEndpoints['resolveEns'] = async (
	ctx,
	input,
) => {
	const parsed = ResolveEnsInputSchema.parse(input);
	const res = await makeBeaconchainV1Request(
		`ens/lookup/${parsed.name}`,
		requireBeaconchainKey(ctx.key),
		v1GetOptions(parsed.chain),
	);
	await logEventFromContext(
		ctx,
		'beaconchain.ens.resolve',
		{ name: parsed.name },
		'completed',
	);
	return BeaconchainV1ResponseSchema.parse(res);
};
