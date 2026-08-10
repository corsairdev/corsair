import { logEventFromContext } from 'corsair/core';
import type { AlchemyEndpoints } from '..';
import type { AlchemyEndpointOutputs } from './types';
import { makeAlchemyJsonRpcRequest } from '../client';

export const getTokenBalances: AlchemyEndpoints['tokenGetTokenBalances'] = async (
	ctx,
	input,
) => {
	const params: unknown[] = [input.address];
	if (input.tokenAddresses) {
		params.push(input.tokenAddresses);
	} else {
		params.push('DEFAULT'); // Fetch top 100 tokens by default if no contract address is specified
	}

	const response = await makeAlchemyJsonRpcRequest<
		AlchemyEndpointOutputs['tokenGetTokenBalances']
	>(
		input.network || ctx.options.network || 'eth-mainnet',
		ctx.key,
		'alchemy_getTokenBalances',
		params,
	);

	await logEventFromContext(
		ctx,
		'alchemy.token.getTokenBalances',
		{ ...input },
		'completed',
	);

	return response;
};

export const getTokenMetadata: AlchemyEndpoints['tokenGetTokenMetadata'] = async (
	ctx,
	input,
) => {
	const response = await makeAlchemyJsonRpcRequest<
		AlchemyEndpointOutputs['tokenGetTokenMetadata']
	>(
		input.network || ctx.options.network || 'eth-mainnet',
		ctx.key,
		'alchemy_getTokenMetadata',
		[input.contractAddress],
	);

	await logEventFromContext(
		ctx,
		'alchemy.token.getTokenMetadata',
		{ ...input },
		'completed',
	);

	return response;
};

export const getTokenAllowance: AlchemyEndpoints['tokenGetTokenAllowance'] =
	async (ctx, input) => {
		const response = await makeAlchemyJsonRpcRequest<
			AlchemyEndpointOutputs['tokenGetTokenAllowance']
		>(
			input.network || ctx.options.network || 'eth-mainnet',
			ctx.key,
			'alchemy_getTokenAllowance',
			[
				{
					contract: input.contract,
					owner: input.owner,
					spender: input.spender,
				},
			],
		);

		await logEventFromContext(
			ctx,
			'alchemy.token.getTokenAllowance',
			{ ...input },
			'completed',
		);

		return response;
	};
