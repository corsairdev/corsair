import { logEventFromContext } from 'corsair/core';
import {
	makeBeaconchainV2Request,
	requireBeaconchainKey,
	v2Body,
} from '../client';
import type { BeaconchainEndpoints } from '../index';
import {
	BeaconchainV2ResponseSchema,
	GetSyncCommitteeInputSchema,
} from './types';

/**
 * Retrieves sync committee members via Beaconchain V2 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including optional period, chain, cursor, page_size
 * @returns Sync committee response
 */
export const getSyncCommittee: BeaconchainEndpoints['getSyncCommittee'] =
	async (ctx, input) => {
		const parsed = GetSyncCommitteeInputSchema.parse(input);
		const res = await makeBeaconchainV2Request(
			'ethereum/sync-committee',
			requireBeaconchainKey(ctx.key),
			{
				method: 'POST',
				body: v2Body(parsed, {
					sync_committee_period:
						parsed.period !== undefined
							? { period: parsed.period }
							: { view: 'latest' },
				}),
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.syncCommittee.get',
			{ period: parsed.period },
			'completed',
		);
		return BeaconchainV2ResponseSchema.parse(res);
	};
