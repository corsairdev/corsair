import { logEventFromContext } from 'corsair/core';
import {
	makeBeaconchainV2Request,
	requireBeaconchainKey,
	v2Body,
} from '../client';
import type { BeaconchainEndpoints } from '../index';
import {
	BeaconchainV2ResponseSchema,
	GetNetworkPerformanceInputSchema,
} from './types';

export const getNetworkPerformance: BeaconchainEndpoints['getNetworkPerformance'] =
	async (ctx, input) => {
		const parsed = GetNetworkPerformanceInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/performance-aggregate',
			requireBeaconchainKey(ctx.key),
			{
				method: 'POST',
				body: v2Body(parsed, {
					range: {
						evaluation_window: parsed.evaluation_window ?? '24h',
					},
				}),
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.network.getPerformance',
			{},
			'completed',
		);
		return BeaconchainV2ResponseSchema.parse(res);
	};
