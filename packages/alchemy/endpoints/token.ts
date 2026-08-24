import { logEventFromContext } from 'corsair/core';
import { makeAlchemyJsonRpcRequest } from '../client';
import type { AlchemyEndpoints } from '../index';
import { resolveNetwork } from './resolve';
import type { AlchemyEndpointOutputs } from './types';

export const getTokenBalances: AlchemyEndpoints['tokenGetTokenBalances'] =
	async (ctx, input) => {
		// Docs: omit second arg for default set, or pass address list / "erc20".
		const params: unknown[] = [input.address];
		params.push(input.tokenAddresses ?? 'erc20');

		const response = await makeAlchemyJsonRpcRequest<
			AlchemyEndpointOutputs['tokenGetTokenBalances']
		>(
			resolveNetwork(ctx, input.network),
			ctx.key,
			'alchemy_getTokenBalances',
			params,
		);

		await logEventFromContext(
			ctx,
			'alchemy.token.getTokenBalances',
			{ address: input.address },
			'completed',
		);
		return response;
	};

export const getTokenMetadata: AlchemyEndpoints['tokenGetTokenMetadata'] =
	async (ctx, input) => {
		const response = await makeAlchemyJsonRpcRequest<
			AlchemyEndpointOutputs['tokenGetTokenMetadata']
		>(resolveNetwork(ctx, input.network), ctx.key, 'alchemy_getTokenMetadata', [
			input.contractAddress,
		]);

		await logEventFromContext(
			ctx,
			'alchemy.token.getTokenMetadata',
			{ contractAddress: input.contractAddress },
			'completed',
		);
		return response;
	};
