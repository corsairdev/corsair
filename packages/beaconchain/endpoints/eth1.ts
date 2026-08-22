import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getEth1DepositsByTxHash: BeaconchainEndpoints['getEth1DepositsByTxHash'] =
	async (ctx, input) => {
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`eth1/deposit/${input.txHash}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'beaconchain.eth1.getDepositsByTxHash',
			{ txHash: input.txHash },
			'completed',
		);
		return res;
	};
