import { logEventFromContext } from 'corsair/core';
import { makeAlchemyNftRequest } from '../client';
import type { AlchemyEndpoints } from '../index';
import { compactQuery, resolveNetwork } from './resolve';
import type { AlchemyEndpointOutputs } from './types';

async function nftGet<T>(
	ctx: Parameters<AlchemyEndpoints['nftGetNftsForOwner']>[0],
	network: string | undefined,
	method: string,
	query: Record<string, unknown>,
): Promise<T> {
	return makeAlchemyNftRequest<T>(
		resolveNetwork(ctx, network),
		ctx.key,
		method,
		compactQuery(query),
	);
}

async function nftPost<T>(
	ctx: Parameters<AlchemyEndpoints['nftGetNftsForOwner']>[0],
	network: string | undefined,
	method: string,
	body: unknown,
): Promise<T> {
	return makeAlchemyNftRequest<T>(
		resolveNetwork(ctx, network),
		ctx.key,
		method,
		undefined,
		{ method: 'POST', body },
	);
}

export const isHolderOfCollection: AlchemyEndpoints['nftIsHolderOfCollection'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftIsHolderOfCollection']
		>(ctx, input.network, 'isHolderOfContract', {
			wallet: input.wallet,
			contractAddress: input.contractAddress,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.isHolderOfCollection',
			{ wallet: input.wallet, contractAddress: input.contractAddress },
			'completed',
		);
		return response;
	};

export const isAirdrop: AlchemyEndpoints['nftIsAirdrop'] = async (
	ctx,
	input,
) => {
	const response = await nftGet<AlchemyEndpointOutputs['nftIsAirdrop']>(
		ctx,
		input.network,
		'isAirdropNFT',
		{
			contractAddress: input.contractAddress,
			tokenId: input.tokenId,
		},
	);
	await logEventFromContext(
		ctx,
		'alchemy.nft.isAirdrop',
		{ contractAddress: input.contractAddress, tokenId: input.tokenId },
		'completed',
	);
	return response;
};

export const isAirdropNft: AlchemyEndpoints['nftIsAirdropNft'] = async (
	ctx,
	input,
) => {
	const response = await nftGet<AlchemyEndpointOutputs['nftIsAirdropNft']>(
		ctx,
		input.network,
		'isAirdropNFT',
		{
			contractAddress: input.contractAddress,
			tokenId: input.tokenId,
		},
	);
	await logEventFromContext(
		ctx,
		'alchemy.nft.isAirdropNft',
		{ contractAddress: input.contractAddress, tokenId: input.tokenId },
		'completed',
	);
	return response;
};

export const isHolderOfContract: AlchemyEndpoints['nftIsHolderOfContract'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftIsHolderOfContract']
		>(ctx, input.network, 'isHolderOfContract', {
			wallet: input.wallet,
			contractAddress: input.contractAddress,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.isHolderOfContract',
			{ wallet: input.wallet, contractAddress: input.contractAddress },
			'completed',
		);
		return response;
	};

export const isSpamContract: AlchemyEndpoints['nftIsSpamContract'] = async (
	ctx,
	input,
) => {
	const response = await nftGet<AlchemyEndpointOutputs['nftIsSpamContract']>(
		ctx,
		input.network,
		'isSpamContract',
		{ contractAddress: input.contractAddress },
	);
	await logEventFromContext(
		ctx,
		'alchemy.nft.isSpamContract',
		{ contractAddress: input.contractAddress },
		'completed',
	);
	return response;
};

export const isSpamContractV3: AlchemyEndpoints['nftIsSpamContractV3'] = async (
	ctx,
	input,
) => {
	const response = await nftGet<AlchemyEndpointOutputs['nftIsSpamContractV3']>(
		ctx,
		input.network,
		'isSpamContract',
		{ contractAddress: input.contractAddress },
	);
	await logEventFromContext(
		ctx,
		'alchemy.nft.isSpamContractV3',
		{ contractAddress: input.contractAddress },
		'completed',
	);
	return response;
};

export const computeRarityV3: AlchemyEndpoints['nftComputeRarityV3'] = async (
	ctx,
	input,
) => {
	const response = await nftGet<AlchemyEndpointOutputs['nftComputeRarityV3']>(
		ctx,
		input.network,
		'computeRarity',
		{
			contractAddress: input.contractAddress,
			tokenId: input.tokenId,
		},
	);
	await logEventFromContext(
		ctx,
		'alchemy.nft.computeRarityV3',
		{ contractAddress: input.contractAddress, tokenId: input.tokenId },
		'completed',
	);
	return response;
};

export const getCollectionsForOwner: AlchemyEndpoints['nftGetCollectionsForOwner'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftGetCollectionsForOwner']
		>(ctx, input.network, 'getCollectionsForOwner', {
			owner: input.owner,
			withMetadata: input.withMetadata,
			'includeFilters[]': input.includeFilters,
			'excludeFilters[]': input.excludeFilters,
			pageKey: input.pageKey,
			pageSize: input.pageSize,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.getCollectionsForOwner',
			{ owner: input.owner },
			'completed',
		);
		return response;
	};

export const getContractMetadataBatchV3: AlchemyEndpoints['nftGetContractMetadataBatchV3'] =
	async (ctx, input) => {
		const response = await nftPost<
			AlchemyEndpointOutputs['nftGetContractMetadataBatchV3']
		>(ctx, input.network, 'getContractMetadataBatch', {
			contractAddresses: input.contractAddresses,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.getContractMetadataBatchV3',
			{ count: input.contractAddresses.length },
			'completed',
		);
		return response;
	};

export const getContractMetadataV3: AlchemyEndpoints['nftGetContractMetadataV3'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftGetContractMetadataV3']
		>(ctx, input.network, 'getContractMetadata', {
			contractAddress: input.contractAddress,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.getContractMetadataV3',
			{ contractAddress: input.contractAddress },
			'completed',
		);
		return response;
	};

export const getContractsForOwnerV3: AlchemyEndpoints['nftGetContractsForOwnerV3'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftGetContractsForOwnerV3']
		>(ctx, input.network, 'getContractsForOwner', {
			owner: input.owner,
			withMetadata: input.withMetadata,
			'includeFilters[]': input.includeFilters,
			'excludeFilters[]': input.excludeFilters,
			pageKey: input.pageKey,
			pageSize: input.pageSize,
			orderBy: input.orderBy,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.getContractsForOwnerV3',
			{ owner: input.owner },
			'completed',
		);
		return response;
	};

export const getCollectionMetadata: AlchemyEndpoints['nftGetCollectionMetadata'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftGetCollectionMetadata']
		>(ctx, input.network, 'getCollectionMetadata', {
			collectionSlug: input.collectionSlug,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.getCollectionMetadata',
			{ collectionSlug: input.collectionSlug },
			'completed',
		);
		return response;
	};

export const getFloorPriceV3: AlchemyEndpoints['nftGetFloorPriceV3'] = async (
	ctx,
	input,
) => {
	const response = await nftGet<AlchemyEndpointOutputs['nftGetFloorPriceV3']>(
		ctx,
		input.network,
		'getFloorPrice',
		{
			contractAddress: input.contractAddress,
			collectionSlug: input.collectionSlug,
		},
	);
	await logEventFromContext(
		ctx,
		'alchemy.nft.getFloorPriceV3',
		{ contractAddress: input.contractAddress },
		'completed',
	);
	return response;
};

export const getNftMetadata: AlchemyEndpoints['nftGetNftMetadata'] = async (
	ctx,
	input,
) => {
	const response = await nftGet<AlchemyEndpointOutputs['nftGetNftMetadata']>(
		ctx,
		input.network,
		'getNFTMetadata',
		{
			contractAddress: input.contractAddress,
			tokenId: input.tokenId,
			tokenType: input.tokenType,
			tokenUriTimeoutInMs: input.tokenUriTimeoutInMs,
			refreshCache: input.refreshCache,
		},
	);
	await logEventFromContext(
		ctx,
		'alchemy.nft.getNftMetadata',
		{ contractAddress: input.contractAddress, tokenId: input.tokenId },
		'completed',
	);
	return response;
};

export const getNftMetadataBatch: AlchemyEndpoints['nftGetNftMetadataBatch'] =
	async (ctx, input) => {
		const response = await nftPost<
			AlchemyEndpointOutputs['nftGetNftMetadataBatch']
		>(ctx, input.network, 'getNFTMetadataBatch', {
			tokens: input.tokens,
			tokenUriTimeoutInMs: input.tokenUriTimeoutInMs,
			refreshCache: input.refreshCache,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.getNftMetadataBatch',
			{ count: input.tokens.length },
			'completed',
		);
		return response;
	};

export const getOwnersForNftV3: AlchemyEndpoints['nftGetOwnersForNftV3'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftGetOwnersForNftV3']
		>(ctx, input.network, 'getOwnersForNFT', {
			contractAddress: input.contractAddress,
			tokenId: input.tokenId,
			pageKey: input.pageKey,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.getOwnersForNftV3',
			{ contractAddress: input.contractAddress, tokenId: input.tokenId },
			'completed',
		);
		return response;
	};

export const getNftSalesV3: AlchemyEndpoints['nftGetNftSalesV3'] = async (
	ctx,
	input,
) => {
	const response = await nftGet<AlchemyEndpointOutputs['nftGetNftSalesV3']>(
		ctx,
		input.network,
		'getNFTSales',
		{
			fromBlock: input.fromBlock,
			toBlock: input.toBlock,
			order: input.order,
			marketplace: input.marketplace,
			contractAddress: input.contractAddress,
			tokenId: input.tokenId,
			buyerAddress: input.buyerAddress,
			sellerAddress: input.sellerAddress,
			taker: input.taker,
			limit: input.limit,
			pageKey: input.pageKey,
		},
	);
	await logEventFromContext(
		ctx,
		'alchemy.nft.getNftSalesV3',
		{ contractAddress: input.contractAddress },
		'completed',
	);
	return response;
};

export const getNftsForCollectionV3: AlchemyEndpoints['nftGetNftsForCollectionV3'] =
	async (ctx, input) => {
		const method = input.collectionSlug
			? 'getNFTsForCollection'
			: 'getNFTsForContract';
		const response = await nftGet<
			AlchemyEndpointOutputs['nftGetNftsForCollectionV3']
		>(ctx, input.network, method, {
			collectionSlug: input.collectionSlug,
			contractAddress: input.contractAddress,
			withMetadata: input.withMetadata,
			startToken: input.startToken,
			limit: input.limit,
			tokenUriTimeoutInMs: input.tokenUriTimeoutInMs,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.getNftsForCollectionV3',
			{
				collectionSlug: input.collectionSlug,
				contractAddress: input.contractAddress,
			},
			'completed',
		);
		return response;
	};

export const getNftsForContract: AlchemyEndpoints['nftGetNftsForContract'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftGetNftsForContract']
		>(ctx, input.network, 'getNFTsForContract', {
			contractAddress: input.contractAddress,
			withMetadata: input.withMetadata,
			startToken: input.startToken,
			limit: input.limit,
			tokenUriTimeoutInMs: input.tokenUriTimeoutInMs,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.getNftsForContract',
			{ contractAddress: input.contractAddress },
			'completed',
		);
		return response;
	};

export const getNftsForOwner: AlchemyEndpoints['nftGetNftsForOwner'] = async (
	ctx,
	input,
) => {
	const response = await nftGet<AlchemyEndpointOutputs['nftGetNftsForOwner']>(
		ctx,
		input.network,
		'getNFTsForOwner',
		{
			owner: input.owner,
			'contractAddresses[]': input.contractAddresses,
			withMetadata: input.withMetadata,
			orderBy: input.orderBy,
			'excludeFilters[]': input.excludeFilters,
			'includeFilters[]': input.includeFilters,
			spamConfidenceLevel: input.spamConfidenceLevel,
			tokenUriTimeoutInMs: input.tokenUriTimeoutInMs,
			pageKey: input.pageKey,
			pageSize: input.pageSize,
		},
	);
	await logEventFromContext(
		ctx,
		'alchemy.nft.getNftsForOwner',
		{ owner: input.owner },
		'completed',
	);
	return response;
};

export const getOwnersForCollection: AlchemyEndpoints['nftGetOwnersForCollection'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftGetOwnersForCollection']
		>(ctx, input.network, 'getOwnersForContract', {
			contractAddress: input.contractAddress,
			withTokenBalances: input.withTokenBalances,
			block: input.block,
			pageKey: input.pageKey,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.getOwnersForCollection',
			{ contractAddress: input.contractAddress },
			'completed',
		);
		return response;
	};

export const getOwnersForContract: AlchemyEndpoints['nftGetOwnersForContract'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftGetOwnersForContract']
		>(ctx, input.network, 'getOwnersForContract', {
			contractAddress: input.contractAddress,
			withTokenBalances: input.withTokenBalances,
			block: input.block,
			pageKey: input.pageKey,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.getOwnersForContract',
			{ contractAddress: input.contractAddress },
			'completed',
		);
		return response;
	};

export const invalidateContractV3: AlchemyEndpoints['nftInvalidateContractV3'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftInvalidateContractV3']
		>(ctx, input.network, 'invalidateContract', {
			contractAddress: input.contractAddress,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.invalidateContractV3',
			{ contractAddress: input.contractAddress },
			'completed',
		);
		return response;
	};

export const searchContractMetadataV3: AlchemyEndpoints['nftSearchContractMetadataV3'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftSearchContractMetadataV3']
		>(ctx, input.network, 'searchContractMetadata', {
			query: input.query,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.searchContractMetadataV3',
			{ query: input.query },
			'completed',
		);
		return response;
	};

export const summarizeNftAttributes: AlchemyEndpoints['nftSummarizeNftAttributes'] =
	async (ctx, input) => {
		const response = await nftGet<
			AlchemyEndpointOutputs['nftSummarizeNftAttributes']
		>(ctx, input.network, 'summarizeNFTAttributes', {
			contractAddress: input.contractAddress,
		});
		await logEventFromContext(
			ctx,
			'alchemy.nft.summarizeNftAttributes',
			{ contractAddress: input.contractAddress },
			'completed',
		);
		return response;
	};
