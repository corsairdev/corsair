import { logEventFromContext } from 'corsair/core';
import {
	makeBeaconchainV1Request,
	requireBeaconchainKey,
	v1GetOptions,
} from '../client';
import type { BeaconchainEndpoints } from '../index';
import {
	BeaconchainV1ResponseSchema,
	GetEth1DepositsByTxHashInputSchema,
} from './types';

/**
 * Retrieves Eth1 deposits by transaction hash via Beaconchain V1 API.
 * @param ctx - Plugin context with authentication
 * @param input - Input parameters including txHash and optional chain
 * @returns Eth1 deposits response
 */
export const getEth1DepositsByTxHash: BeaconchainEndpoints['getEth1DepositsByTxHash'] =
	async (ctx, input) => {
		const parsed = GetEth1DepositsByTxHashInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			`eth1deposit/${parsed.txHash}`,
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.eth1.getDepositsByTxHash',
			{ txHash: parsed.txHash },
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};
