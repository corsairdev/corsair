import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainV2Request } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getExecutionAddressErc20Tokens: BeaconchainEndpoints['getExecutionAddressErc20Tokens'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/execution/address/erc20',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					address: input.address,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.execution.getAddressErc20Tokens',
			{ address: input.address },
			'completed',
		);
		return res;
	};

export const getExecutionBlock: BeaconchainEndpoints['getExecutionBlock'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/execution/block',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					block: input.blockId,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.execution.getBlock',
			{ blockId: String(input.blockId) },
			'completed',
		);
		return res;
	};

export const getExecutionProducedBlocks: BeaconchainEndpoints['getExecutionProducedBlocks'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/execution/produced',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					address: input.address,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.execution.getProducedBlocks',
			{ address: input.address },
			'completed',
		);
		return res;
	};
