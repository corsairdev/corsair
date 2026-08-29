import { logEventFromContext } from 'corsair/core';
import type { BlocknativeEndpoints } from '..';
import { BLOCKNATIVE_WS_URL, ethNetworkName, parseHexChainId } from '../client';
import {
	ConfigureFiltersOutputSchema,
	SubscribeMultichainOutputSchema,
	SubscribeTransactionHashOutputSchema,
	UnsubscribeMultichainOutputSchema,
	UnsubscribeTransactionHashOutputSchema,
} from './types';

export const configureFilters: BlocknativeEndpoints['configureFilters'] =
	async (ctx, input) => {
		const response = ConfigureFiltersOutputSchema.parse({
			websocketUrl: BLOCKNATIVE_WS_URL,
			system: input.system ?? 'ethereum',
			network: input.network ?? 'main',
			scope: input.scope,
			...(input.filters ? { filters: input.filters } : {}),
			...(input.abi ? { abi: input.abi } : {}),
			...(input.watchAddress !== undefined
				? { watchAddress: input.watchAddress }
				: {}),
		});
		await logEventFromContext(
			ctx,
			'blocknative.mempool.configureFilters',
			{ scope: input.scope },
			'completed',
		);
		return response;
	};

export const subscribeTransactionHash: BlocknativeEndpoints['subscribeTransactionHash'] =
	async (ctx, input) => {
		const response = SubscribeTransactionHashOutputSchema.parse({
			websocketUrl: BLOCKNATIVE_WS_URL,
			system: input.system ?? 'ethereum',
			network: input.network ?? 'main',
			hash: input.hash,
			action: 'subscribe' as const,
		});
		await logEventFromContext(
			ctx,
			'blocknative.mempool.subscribeTransactionHash',
			{ hash: input.hash },
			'completed',
		);
		return response;
	};

export const unsubscribeTransactionHash: BlocknativeEndpoints['unsubscribeTransactionHash'] =
	async (ctx, input) => {
		const response = UnsubscribeTransactionHashOutputSchema.parse({
			websocketUrl: BLOCKNATIVE_WS_URL,
			system: input.system ?? 'ethereum',
			network: input.network ?? 'main',
			hash: input.hash,
			action: 'unsubscribe' as const,
		});
		await logEventFromContext(
			ctx,
			'blocknative.mempool.unsubscribeTransactionHash',
			{ hash: input.hash },
			'completed',
		);
		return response;
	};

export const subscribeMultichain: BlocknativeEndpoints['subscribeMultichain'] =
	async (ctx, input) => {
		const chainId = parseHexChainId(input.chainId);
		const network = ethNetworkName(chainId);
		const response = SubscribeMultichainOutputSchema.parse({
			websocketUrl: BLOCKNATIVE_WS_URL,
			system: 'ethereum',
			network,
			id: input.id,
			type: input.type,
			chainId: input.chainId,
		});
		await logEventFromContext(
			ctx,
			'blocknative.multichain.subscribe',
			{ id: input.id, type: input.type, chainId: input.chainId },
			'completed',
		);
		return response;
	};

export const unsubscribeMultichain: BlocknativeEndpoints['unsubscribeMultichain'] =
	async (ctx, input) => {
		if (input.chainId) parseHexChainId(input.chainId);
		const response = UnsubscribeMultichainOutputSchema.parse({
			id: input.id,
			...(input.chainId ? { chainId: input.chainId } : {}),
			sdkCall: 'unsubscribe' as const,
		});
		await logEventFromContext(
			ctx,
			'blocknative.multichain.unsubscribe',
			{ id: input.id, chainId: input.chainId },
			'completed',
		);
		return response;
	};
