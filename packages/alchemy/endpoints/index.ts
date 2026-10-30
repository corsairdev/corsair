import * as nft from './nft';
import * as portfolio from './portfolio';
import * as prices from './prices';
import * as rpc from './rpc';
import * as token from './token';

export const Nft = {
	isHolderOfCollection: nft.isHolderOfCollection,
	isAirdrop: nft.isAirdrop,
	isAirdropNft: nft.isAirdropNft,
	isHolderOfContract: nft.isHolderOfContract,
	isSpamContract: nft.isSpamContract,
	isSpamContractV3: nft.isSpamContractV3,
	computeRarityV3: nft.computeRarityV3,
	getCollectionsForOwner: nft.getCollectionsForOwner,
	getContractMetadataBatchV3: nft.getContractMetadataBatchV3,
	getContractMetadataV3: nft.getContractMetadataV3,
	getContractsForOwnerV3: nft.getContractsForOwnerV3,
	getCollectionMetadata: nft.getCollectionMetadata,
	getFloorPriceV3: nft.getFloorPriceV3,
	getNftMetadata: nft.getNftMetadata,
	getNftMetadataBatch: nft.getNftMetadataBatch,
	getOwnersForNftV3: nft.getOwnersForNftV3,
	getNftSalesV3: nft.getNftSalesV3,
	getNftsForCollectionV3: nft.getNftsForCollectionV3,
	getNftsForContract: nft.getNftsForContract,
	getNftsForOwner: nft.getNftsForOwner,
	getOwnersForCollection: nft.getOwnersForCollection,
	getOwnersForContract: nft.getOwnersForContract,
	invalidateContractV3: nft.invalidateContractV3,
	searchContractMetadataV3: nft.searchContractMetadataV3,
	summarizeNftAttributes: nft.summarizeNftAttributes,
};

export const Prices = {
	getHistoricalPrices: prices.getHistoricalPrices,
	getTokenPricesByAddress: prices.getTokenPricesByAddress,
	getPricesBySymbol: prices.getPricesBySymbol,
};

export const Portfolio = {
	getNftContractsByAddress: portfolio.getNftContractsByAddress,
	getPortfolioNftsByAddress: portfolio.getPortfolioNftsByAddress,
	getTokenBalancesByAddress: portfolio.getTokenBalancesByAddress,
	getTokensByAddress: portfolio.getTokensByAddress,
	getTransactionsHistoryByAddress: portfolio.getTransactionsHistoryByAddress,
};

export const Token = {
	getTokenBalances: token.getTokenBalances,
	getTokenMetadata: token.getTokenMetadata,
};

export const Rpc = {
	getTransactionCount: rpc.getTransactionCount,
};

export * from './types';
