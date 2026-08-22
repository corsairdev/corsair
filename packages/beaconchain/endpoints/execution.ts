import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getExecutionAddressErc20Tokens: BeaconchainEndpoints['getExecutionAddressErc20Tokens'] =
	async (ctx, input) => {
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`execution/address/${input.address}/erc20`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`execution/block/${input.blockId}`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`execution/produced/${input.address}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'beaconchain.execution.getProducedBlocks',
			{ address: input.address },
			'completed',
		);
		return res;
	};
