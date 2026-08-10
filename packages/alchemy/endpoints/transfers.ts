import { logEventFromContext } from 'corsair/core';
import type { AlchemyEndpoints } from '..';
import type { AlchemyEndpointOutputs } from './types';
import { makeAlchemyJsonRpcRequest } from '../client';

export const getAssetTransfers: AlchemyEndpoints['transfersGetAssetTransfers'] =
	async (ctx, input) => {
		const params: Record<string, unknown> = {};

		if (input.fromBlock) params.fromBlock = input.fromBlock;
		if (input.toBlock) params.toBlock = input.toBlock;
		if (input.fromAddress) params.fromAddress = input.fromAddress;
		if (input.toAddress) params.toAddress = input.toAddress;
		if (input.contractAddresses)
			params.contractAddresses = input.contractAddresses;
		if (input.category) params.category = input.category;
		if (input.maxCount) params.maxCount = input.maxCount;
		if (input.pageKey) params.pageKey = input.pageKey;
		if (input.withMetadata !== undefined)
			params.withMetadata = input.withMetadata;
		if (input.excludeZeroValue !== undefined)
			params.excludeZeroValue = input.excludeZeroValue;

		const response = await makeAlchemyJsonRpcRequest<
			AlchemyEndpointOutputs['transfersGetAssetTransfers']
		>(
			input.network || ctx.options.network || 'eth-mainnet',
			ctx.key,
			'alchemy_getAssetTransfers',
			[params],
		);

		await logEventFromContext(
			ctx,
			'alchemy.transfers.getAssetTransfers',
			{ ...input },
			'completed',
		);

		return response;
	};
