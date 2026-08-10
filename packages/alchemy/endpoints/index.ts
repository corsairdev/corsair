import * as core from './core';
import * as nft from './nft';
import * as token from './token';
import * as transfers from './transfers';

export const Core = {
	getBlockNumber: core.getBlockNumber,
	getBlock: core.getBlock,
	getBalance: core.getBalance,
	getTransaction: core.getTransaction,
	getTransactionReceipt: core.getTransactionReceipt,
	call: core.call,
	sendRawTransaction: core.sendRawTransaction,
};

export const Nft = {
	getNftsForOwner: nft.getNftsForOwner,
	getNftMetadata: nft.getNftMetadata,
	getOwnersForNft: nft.getOwnersForNft,
	getContractMetadata: nft.getContractMetadata,
};

export const Token = {
	getTokenBalances: token.getTokenBalances,
	getTokenMetadata: token.getTokenMetadata,
	getTokenAllowance: token.getTokenAllowance,
};

export const Transfers = {
	getAssetTransfers: transfers.getAssetTransfers,
};

export * from './types';
