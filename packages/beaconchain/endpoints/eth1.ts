import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainV2Request } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getEth1DepositsByTxHash: BeaconchainEndpoints['getEth1DepositsByTxHash'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/eth1/deposit',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					tx_hash: input.txHash,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.eth1.getDepositsByTxHash',
			{ txHash: input.txHash },
			'completed',
		);
		return res;
	};
