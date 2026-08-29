import { logEventFromContext } from 'corsair/core';
import type { BlocknativeEndpoints } from '..';
import {
	BLOCKNATIVE_DAPP_ID_PLACEHOLDER,
	BLOCKNATIVE_WS_URL,
	ethNetworkName,
	initializeMessage,
	parseHexChainId,
} from '../client';
import {
	ConfigureFiltersOutputSchema,
	SubscribeMultichainOutputSchema,
	SubscribeTransactionHashOutputSchema,
	UnsubscribeMultichainOutputSchema,
	UnsubscribeTransactionHashOutputSchema,
	WS_AUTH,
} from './types';

function envelope(
	system: string,
	network: string,
	body: Record<string, unknown>,
): Record<string, unknown> {
	return {
		timeStamp: new Date().toISOString(),
		dappId: BLOCKNATIVE_DAPP_ID_PLACEHOLDER,
		version: '1.0.0',
		blockchain: { system, network },
		...body,
	};
}

export const configureFilters: BlocknativeEndpoints['configureFilters'] =
	async (ctx, input) => {
		const system = input.system ?? 'ethereum';
		const network = input.network ?? 'main';
		const config: Record<string, unknown> = { scope: input.scope };
		if (input.filters) config.filters = input.filters;
		if (input.abi) config.abi = input.abi;
		if (input.watchAddress !== undefined)
			config.watchAddress = input.watchAddress;

		const response = ConfigureFiltersOutputSchema.parse({
			websocketUrl: BLOCKNATIVE_WS_URL,
			auth: WS_AUTH,
			initialize: initializeMessage(system, network),
			config: envelope(system, network, {
				categoryCode: 'configs',
				eventCode: 'put',
				config,
			}),
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
		const system = input.system ?? 'ethereum';
		const network = input.network ?? 'main';
		const transaction =
			system === 'ethereum'
				? {
						hash: input.hash,
						id: input.hash,
						startTime: Date.now(),
						status: 'sent',
					}
				: {
						txid: input.hash,
						id: input.hash,
						startTime: Date.now(),
						status: 'sent',
					};

		const response = SubscribeTransactionHashOutputSchema.parse({
			websocketUrl: BLOCKNATIVE_WS_URL,
			auth: WS_AUTH,
			initialize: initializeMessage(system, network),
			subscribe: envelope(system, network, {
				categoryCode: 'activeTransaction',
				eventCode: 'txSent',
				transaction,
			}),
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
		const system = input.system ?? 'ethereum';
		const network = input.network ?? 'main';
		const transaction =
			system === 'ethereum'
				? { hash: input.hash, id: input.hash, status: 'unsubscribed' }
				: { txid: input.hash, id: input.hash, status: 'unsubscribed' };

		const response = UnsubscribeTransactionHashOutputSchema.parse({
			websocketUrl: BLOCKNATIVE_WS_URL,
			auth: WS_AUTH,
			initialize: initializeMessage(system, network),
			unsubscribe: envelope(system, network, {
				categoryCode: 'activeTransaction',
				eventCode: 'unwatch',
				transaction,
			}),
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
		const subscribe =
			input.type === 'account'
				? envelope('ethereum', network, {
						categoryCode: 'configs',
						eventCode: 'put',
						config: {
							scope: input.id,
							filters: input.filters ?? [],
							...(input.abi ? { abi: input.abi } : {}),
							watchAddress: true,
						},
					})
				: envelope('ethereum', network, {
						categoryCode: 'activeTransaction',
						eventCode: 'txSent',
						transaction: {
							hash: input.id,
							id: input.id,
							startTime: Date.now(),
							status: 'sent',
						},
					});

		const response = SubscribeMultichainOutputSchema.parse({
			websocketUrl: BLOCKNATIVE_WS_URL,
			auth: WS_AUTH,
			initialize: initializeMessage('ethereum', network),
			subscribe,
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
