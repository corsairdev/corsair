import { logEventFromContext } from 'corsair/core';
import { makeAlchemyDataRequest } from '../client';
import type { AlchemyEndpoints } from '../index';
import type { AlchemyEndpointOutputs } from './types';

export const getNftContractsByAddress: AlchemyEndpoints['portfolioGetNftContractsByAddress'] =
	async (ctx, input) => {
		const response = await makeAlchemyDataRequest<
			AlchemyEndpointOutputs['portfolioGetNftContractsByAddress']
		>(ctx.key, '/assets/nfts/contracts/by-address', {
			addresses: input.addresses,
			withMetadata: input.withMetadata,
			pageKey: input.pageKey,
			pageSize: input.pageSize,
			orderBy: input.orderBy,
			sortOrder: input.sortOrder,
		});

		await logEventFromContext(
			ctx,
			'alchemy.portfolio.getNftContractsByAddress',
			{ count: input.addresses.length },
			'completed',
		);
		return response;
	};

export const getPortfolioNftsByAddress: AlchemyEndpoints['portfolioGetPortfolioNftsByAddress'] =
	async (ctx, input) => {
		const response = await makeAlchemyDataRequest<
			AlchemyEndpointOutputs['portfolioGetPortfolioNftsByAddress']
		>(ctx.key, '/assets/nfts/by-address', {
			addresses: input.addresses,
			withMetadata: input.withMetadata,
			excludeFilters: input.excludeFilters,
			includeFilters: input.includeFilters,
			spamConfidenceLevel: input.spamConfidenceLevel,
			pageKey: input.pageKey,
			pageSize: input.pageSize,
			orderBy: input.orderBy,
			sortOrder: input.sortOrder,
		});

		await logEventFromContext(
			ctx,
			'alchemy.portfolio.getPortfolioNftsByAddress',
			{ count: input.addresses.length },
			'completed',
		);
		return response;
	};

export const getTokenBalancesByAddress: AlchemyEndpoints['portfolioGetTokenBalancesByAddress'] =
	async (ctx, input) => {
		const response = await makeAlchemyDataRequest<
			AlchemyEndpointOutputs['portfolioGetTokenBalancesByAddress']
		>(ctx.key, '/assets/tokens/balances/by-address', {
			addresses: input.addresses,
			includeNativeTokens: input.includeNativeTokens,
			includeErc20Tokens: input.includeErc20Tokens,
			pageKey: input.pageKey,
		});

		await logEventFromContext(
			ctx,
			'alchemy.portfolio.getTokenBalancesByAddress',
			{ count: input.addresses.length },
			'completed',
		);
		return response;
	};

export const getTokensByAddress: AlchemyEndpoints['portfolioGetTokensByAddress'] =
	async (ctx, input) => {
		const response = await makeAlchemyDataRequest<
			AlchemyEndpointOutputs['portfolioGetTokensByAddress']
		>(ctx.key, '/assets/tokens/by-address', {
			addresses: input.addresses,
			withMetadata: input.withMetadata,
			withPrices: input.withPrices,
			includeNativeTokens: input.includeNativeTokens,
			includeErc20Tokens: input.includeErc20Tokens,
			pageKey: input.pageKey,
		});

		await logEventFromContext(
			ctx,
			'alchemy.portfolio.getTokensByAddress',
			{ count: input.addresses.length },
			'completed',
		);
		return response;
	};

export const getTransactionsHistoryByAddress: AlchemyEndpoints['portfolioGetTransactionsHistoryByAddress'] =
	async (ctx, input) => {
		const response = await makeAlchemyDataRequest<
			AlchemyEndpointOutputs['portfolioGetTransactionsHistoryByAddress']
		>(ctx.key, '/transactions/history/by-address', {
			addresses: input.addresses,
			before: input.before,
			after: input.after,
			limit: input.limit,
		});

		await logEventFromContext(
			ctx,
			'alchemy.portfolio.getTransactionsHistoryByAddress',
			{ count: input.addresses.length },
			'completed',
		);
		return response;
	};
