import { logEventFromContext } from 'corsair/core';
import {
	makeBeaconchainV2Request,
	requireBeaconchainKey,
	v2Body,
} from '../client';
import type { BeaconchainEndpoints } from '../index';
import {
	BeaconchainV2ResponseSchema,
	GetEthStoreDailyInputSchema,
} from './types';

export const getEthStoreDaily: BeaconchainEndpoints['getEthStoreDaily'] =
	async (ctx, input) => {
		const parsed = GetEthStoreDailyInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/eth-store',
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
			'beaconchain.ethStore.getDaily',
			{ evaluation_window: parsed.evaluation_window ?? '24h' },
			'completed',
		);
		return BeaconchainV2ResponseSchema.parse(res);
	};
