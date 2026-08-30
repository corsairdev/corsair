import { logEventFromContext } from 'corsair/core';
import {
	makeBeaconchainV2Request,
	requireBeaconchainKey,
	v2Body,
} from '../client';
import type { BeaconchainEndpoints } from '../index';
import { BeaconchainV2ResponseSchema, GetQueuesInputSchema } from './types';

export const getQueues: BeaconchainEndpoints['getQueues'] = async (
	ctx,
	input,
) => {
	const parsed = GetQueuesInputSchema.parse(input);
	const res = await makeBeaconchainV2Request(
		'ethereum/queues',
		requireBeaconchainKey(ctx.key),
		{
			method: 'POST',
			body: v2Body(parsed),
		},
	);
	await logEventFromContext(ctx, 'beaconchain.queues.get', {}, 'completed');
	return BeaconchainV2ResponseSchema.parse(res);
};
