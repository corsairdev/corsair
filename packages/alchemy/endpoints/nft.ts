import { logEventFromContext } from 'corsair/core';
import type { AlchemyEndpoints } from '..';
import type { AlchemyEndpointOutputs } from './types';
import { makeAlchemyRestRequest } from '../client';

export const getNftsForOwner: AlchemyEndpoints['nftGetNftsForOwner'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | Array<string>> = {
		owner: input.owner,
	};
	if (input.contractAddresses) query['contractAddresses[]'] = input.contractAddresses;
	if (input.withMetadata !== undefined) query.withMetadata = input.withMetadata;
	if (input.pageKey) query.pageKey = input.pageKey;
	if (input.pageSize) query.pageSize = input.pageSize;

	const response = await makeAlchemyRestRequest<
		AlchemyEndpointOutputs['nftGetNftsForOwner']
	>(
		input.network || ctx.options.network || 'eth-mainnet',
		ctx.key,
		'/nft/v3/{apiKey}/getNFTsForOwner',
		query,
	);

	await logEventFromContext(
		ctx,
		'alchemy.nft.getNftsForOwner',
		{ ...input },
		'completed',
	);

	return response;
};

export const getNftMetadata: AlchemyEndpoints['nftGetNftMetadata'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean> = {
		contractAddress: input.contractAddress,
		tokenId: input.tokenId,
	};
	if (input.tokenType) query.tokenType = input.tokenType;
	if (input.refreshCache !== undefined) query.refreshCache = input.refreshCache;

	const response = await makeAlchemyRestRequest<
		AlchemyEndpointOutputs['nftGetNftMetadata']
	>(
		input.network || ctx.options.network || 'eth-mainnet',
		ctx.key,
		'/nft/v3/{apiKey}/getNFTMetadata',
		query,
	);

	await logEventFromContext(
		ctx,
		'alchemy.nft.getNftMetadata',
		{ ...input },
		'completed',
	);

	return response;
};

export const getOwnersForNft: AlchemyEndpoints['nftGetOwnersForNft'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean> = {
		contractAddress: input.contractAddress,
		tokenId: input.tokenId,
	};
	if (input.pageKey) query.pageKey = input.pageKey;

	const response = await makeAlchemyRestRequest<
		AlchemyEndpointOutputs['nftGetOwnersForNft']
	>(
		input.network || ctx.options.network || 'eth-mainnet',
		ctx.key,
		'/nft/v3/{apiKey}/getOwnersForNFT',
		query,
	);

	await logEventFromContext(
		ctx,
		'alchemy.nft.getOwnersForNft',
		{ ...input },
		'completed',
	);

	return response;
};

export const getContractMetadata: AlchemyEndpoints['nftGetContractMetadata'] =
	async (ctx, input) => {
		const query: Record<string, string | number | boolean> = {
			contractAddress: input.contractAddress,
		};

		const response = await makeAlchemyRestRequest<
			AlchemyEndpointOutputs['nftGetContractMetadata']
		>(
			input.network || ctx.options.network || 'eth-mainnet',
			ctx.key,
			'/nft/v3/{apiKey}/getContractMetadata',
			query,
		);

		await logEventFromContext(
			ctx,
			'alchemy.nft.getContractMetadata',
			{ ...input },
			'completed',
		);

		return response;
	};
