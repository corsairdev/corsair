import {
	makeAlchemyDataRequest,
	makeAlchemyJsonRpcRequest,
	makeAlchemyNftRequest,
	makeAlchemyPricesRequest,
} from './client';
import * as nft from './endpoints/nft';
import * as portfolio from './endpoints/portfolio';
import * as prices from './endpoints/prices';
import * as rpc from './endpoints/rpc';
import * as token from './endpoints/token';
import {
	AlchemyEndpointInputSchemas,
	AlchemyEndpointOutputSchemas,
	alchemyEndpointSchemas,
} from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeAlchemyNftRequest: jest.fn(),
		makeAlchemyPricesRequest: jest.fn(),
		makeAlchemyDataRequest: jest.fn(),
		makeAlchemyJsonRpcRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockedNft = makeAlchemyNftRequest as jest.MockedFunction<
	typeof makeAlchemyNftRequest
>;
const mockedPrices = makeAlchemyPricesRequest as jest.MockedFunction<
	typeof makeAlchemyPricesRequest
>;
const mockedData = makeAlchemyDataRequest as jest.MockedFunction<
	typeof makeAlchemyDataRequest
>;
const mockedRpc = makeAlchemyJsonRpcRequest as jest.MockedFunction<
	typeof makeAlchemyJsonRpcRequest
>;

function fakeCtx(key = 'test-key') {
	return {
		key,
		options: { network: 'eth-mainnet' as const },
	} as never;
}

const wallet = '0xwallet';
const contract = '0xcontract';
const owner = '0xowner';
const addresses = [{ address: owner, networks: ['eth-mainnet'] }];

describe('Alchemy claim endpoint schemas', () => {
	it('registers all 36 claim endpoints', () => {
		expect(Object.keys(alchemyEndpointSchemas)).toHaveLength(36);
	});

	it('rejects unsupported networks on NFT inputs', () => {
		expect(() =>
			AlchemyEndpointInputSchemas.nftGetNftsForOwner.parse({
				owner: '0xabc',
				network: 'evil.com/x',
			}),
		).toThrow();
	});

	it('enforces historical price identity XOR', () => {
		expect(() =>
			AlchemyEndpointInputSchemas.pricesGetHistoricalPrices.parse({
				symbol: 'ETH',
				network: 'eth-mainnet',
				address: '0xabc',
				startTime: '2026-08-01T00:00:00Z',
				endTime: '2026-08-02T00:00:00Z',
			}),
		).toThrow();
		expect(
			AlchemyEndpointInputSchemas.pricesGetHistoricalPrices.parse({
				symbol: 'ETH',
				startTime: '2026-08-01T00:00:00Z',
				endTime: '2026-08-02T00:00:00Z',
			}),
		).toMatchObject({ symbol: 'ETH' });
	});

	it('parses prices-by-symbol output from live shape', () => {
		const parsed = AlchemyEndpointOutputSchemas.pricesGetPricesBySymbol.parse({
			data: [
				{
					symbol: 'ETH',
					prices: [
						{
							currency: 'usd',
							value: '1880.59',
							lastUpdatedAt: '2026-08-12T19:25:24.205Z',
						},
					],
				},
			],
		});
		expect(parsed.data[0]?.symbol).toBe('ETH');
	});

	it('defaults transaction-count blockTag to latest', () => {
		expect(
			AlchemyEndpointInputSchemas.rpcGetTransactionCount.parse({
				address: '0xabc',
			}),
		).toMatchObject({ blockTag: 'latest' });
	});
});

describe('Alchemy endpoint behavior', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it.each([
		[
			'isHolderOfCollection',
			'isHolderOfContract',
			{ wallet, contractAddress: contract },
			() =>
				nft.isHolderOfCollection(fakeCtx(), {
					wallet,
					contractAddress: contract,
				}),
		],
		[
			'isHolderOfContract',
			'isHolderOfContract',
			{ wallet, contractAddress: contract },
			() =>
				nft.isHolderOfContract(fakeCtx(), {
					wallet,
					contractAddress: contract,
				}),
		],
		[
			'isAirdrop',
			'isAirdropNFT',
			{ contractAddress: contract, tokenId: '1' },
			() =>
				nft.isAirdrop(fakeCtx(), { contractAddress: contract, tokenId: '1' }),
		],
		[
			'isAirdropNft',
			'isAirdropNFT',
			{ contractAddress: contract, tokenId: '1' },
			() =>
				nft.isAirdropNft(fakeCtx(), {
					contractAddress: contract,
					tokenId: '1',
				}),
		],
		[
			'isSpamContract',
			'isSpamContract',
			{ contractAddress: contract },
			() => nft.isSpamContract(fakeCtx(), { contractAddress: contract }),
		],
		[
			'isSpamContractV3',
			'isSpamContract',
			{ contractAddress: contract },
			() => nft.isSpamContractV3(fakeCtx(), { contractAddress: contract }),
		],
		[
			'computeRarityV3',
			'computeRarity',
			{ contractAddress: contract, tokenId: '1' },
			() =>
				nft.computeRarityV3(fakeCtx(), {
					contractAddress: contract,
					tokenId: '1',
				}),
		],
		[
			'getCollectionsForOwner',
			'getCollectionsForOwner',
			{ owner },
			() => nft.getCollectionsForOwner(fakeCtx(), { owner }),
		],
		[
			'getContractMetadataV3',
			'getContractMetadata',
			{ contractAddress: contract },
			() => nft.getContractMetadataV3(fakeCtx(), { contractAddress: contract }),
		],
		[
			'getContractsForOwnerV3',
			'getContractsForOwner',
			{ owner },
			() => nft.getContractsForOwnerV3(fakeCtx(), { owner }),
		],
		[
			'getCollectionMetadata',
			'getCollectionMetadata',
			{ collectionSlug: 'boredapeyachtclub' },
			() =>
				nft.getCollectionMetadata(fakeCtx(), {
					collectionSlug: 'boredapeyachtclub',
				}),
		],
		[
			'getFloorPriceV3',
			'getFloorPrice',
			{ contractAddress: contract },
			() => nft.getFloorPriceV3(fakeCtx(), { contractAddress: contract }),
		],
		[
			'getNftMetadata',
			'getNFTMetadata',
			{ contractAddress: contract, tokenId: '1' },
			() =>
				nft.getNftMetadata(fakeCtx(), {
					contractAddress: contract,
					tokenId: '1',
				}),
		],
		[
			'getOwnersForNftV3',
			'getOwnersForNFT',
			{ contractAddress: contract, tokenId: '1' },
			() =>
				nft.getOwnersForNftV3(fakeCtx(), {
					contractAddress: contract,
					tokenId: '1',
				}),
		],
		[
			'getNftSalesV3',
			'getNFTSales',
			{ contractAddress: contract },
			() => nft.getNftSalesV3(fakeCtx(), { contractAddress: contract }),
		],
		[
			'getNftsForContract',
			'getNFTsForContract',
			{ contractAddress: contract },
			() => nft.getNftsForContract(fakeCtx(), { contractAddress: contract }),
		],
		[
			'getNftsForOwner',
			'getNFTsForOwner',
			{ owner },
			() => nft.getNftsForOwner(fakeCtx(), { owner }),
		],
		[
			'getOwnersForCollection',
			'getOwnersForContract',
			{ contractAddress: contract },
			() =>
				nft.getOwnersForCollection(fakeCtx(), { contractAddress: contract }),
		],
		[
			'getOwnersForContract',
			'getOwnersForContract',
			{ contractAddress: contract },
			() => nft.getOwnersForContract(fakeCtx(), { contractAddress: contract }),
		],
		[
			'invalidateContractV3',
			'invalidateContract',
			{ contractAddress: contract },
			() => nft.invalidateContractV3(fakeCtx(), { contractAddress: contract }),
		],
		[
			'searchContractMetadataV3',
			'searchContractMetadata',
			{ query: 'bayc' },
			() => nft.searchContractMetadataV3(fakeCtx(), { query: 'bayc' }),
		],
		[
			'summarizeNftAttributes',
			'summarizeNFTAttributes',
			{ contractAddress: contract },
			() =>
				nft.summarizeNftAttributes(fakeCtx(), { contractAddress: contract }),
		],
	] as const)(
		'%s maps query for NFT %s',
		async (_name, method, query, invoke) => {
			mockedNft.mockResolvedValueOnce({});
			await invoke();
			expect(mockedNft).toHaveBeenCalledWith(
				'eth-mainnet',
				'test-key',
				method,
				query,
			);
		},
	);

	it('getNftsForCollectionV3 maps slug query', async () => {
		mockedNft.mockResolvedValueOnce({ nfts: [] });
		await nft.getNftsForCollectionV3(fakeCtx(), {
			collectionSlug: 'boredapeyachtclub',
		});
		expect(mockedNft).toHaveBeenCalledWith(
			'eth-mainnet',
			'test-key',
			'getNFTsForCollection',
			{ collectionSlug: 'boredapeyachtclub' },
		);
	});

	it('getNftsForCollectionV3 maps contract query', async () => {
		mockedNft.mockResolvedValueOnce({ nfts: [] });
		await nft.getNftsForCollectionV3(fakeCtx(), {
			contractAddress: contract,
		});
		expect(mockedNft).toHaveBeenCalledWith(
			'eth-mainnet',
			'test-key',
			'getNFTsForContract',
			{ contractAddress: contract },
		);
	});

	it('getContractMetadataBatchV3 posts contractAddresses', async () => {
		mockedNft.mockResolvedValueOnce({ contracts: [] });
		await nft.getContractMetadataBatchV3(fakeCtx(), {
			contractAddresses: [contract],
		});
		expect(mockedNft).toHaveBeenCalledWith(
			'eth-mainnet',
			'test-key',
			'getContractMetadataBatch',
			undefined,
			{ method: 'POST', body: { contractAddresses: [contract] } },
		);
	});

	it('getNftMetadataBatch posts tokens and batch options', async () => {
		mockedNft.mockResolvedValueOnce({ nfts: [] });
		const tokens = [{ contractAddress: contract, tokenId: '1' }];
		await nft.getNftMetadataBatch(fakeCtx(), {
			tokens,
			tokenUriTimeoutInMs: 1000,
			refreshCache: true,
		});
		expect(mockedNft).toHaveBeenCalledWith(
			'eth-mainnet',
			'test-key',
			'getNFTMetadataBatch',
			undefined,
			{
				method: 'POST',
				body: {
					tokens,
					tokenUriTimeoutInMs: 1000,
					refreshCache: true,
				},
			},
		);
	});

	it('getNftsForOwner maps array query keys', async () => {
		mockedNft.mockResolvedValueOnce({ ownedNfts: [] });
		await nft.getNftsForOwner(fakeCtx(), {
			owner,
			contractAddresses: ['0xa'],
			excludeFilters: ['SPAM'],
		});
		expect(mockedNft).toHaveBeenCalledWith(
			'eth-mainnet',
			'test-key',
			'getNFTsForOwner',
			{
				owner,
				'contractAddresses[]': ['0xa'],
				'excludeFilters[]': ['SPAM'],
			},
		);
	});

	it('getPricesBySymbol hits prices by-symbol', async () => {
		mockedPrices.mockResolvedValueOnce({ data: [] });
		await prices.getPricesBySymbol(fakeCtx(), { symbols: ['ETH', 'USDC'] });
		expect(mockedPrices).toHaveBeenCalledWith('test-key', '/tokens/by-symbol', {
			method: 'GET',
			query: { symbols: ['ETH', 'USDC'] },
		});
	});

	it('getHistoricalPrices posts symbol body', async () => {
		mockedPrices.mockResolvedValueOnce({ data: [] });
		await prices.getHistoricalPrices(fakeCtx(), {
			symbol: 'ETH',
			startTime: '2026-08-01T00:00:00Z',
			endTime: '2026-08-05T00:00:00Z',
			interval: '1d',
		});
		expect(mockedPrices).toHaveBeenCalledWith(
			'test-key',
			'/tokens/historical',
			{
				method: 'POST',
				body: expect.objectContaining({
					symbol: 'ETH',
					startTime: '2026-08-01T00:00:00Z',
					endTime: '2026-08-05T00:00:00Z',
					interval: '1d',
				}),
			},
		);
	});

	it('getTokenPricesByAddress posts address pairs', async () => {
		mockedPrices.mockResolvedValueOnce({ data: [] });
		await prices.getTokenPricesByAddress(fakeCtx(), {
			addresses: [{ network: 'eth-mainnet', address: contract }],
		});
		expect(mockedPrices).toHaveBeenCalledWith(
			'test-key',
			'/tokens/by-address',
			{
				method: 'POST',
				body: {
					addresses: [{ network: 'eth-mainnet', address: contract }],
				},
			},
		);
	});

	it.each([
		[
			'getNftContractsByAddress',
			'/assets/nfts/contracts/by-address',
			{ addresses },
			() => portfolio.getNftContractsByAddress(fakeCtx(), { addresses }),
		],
		[
			'getPortfolioNftsByAddress',
			'/assets/nfts/by-address',
			{
				addresses,
				excludeFilters: ['SPAM'],
				pageSize: 2,
			},
			() =>
				portfolio.getPortfolioNftsByAddress(fakeCtx(), {
					addresses,
					excludeFilters: ['SPAM'],
					pageSize: 2,
				}),
		],
		[
			'getTokenBalancesByAddress',
			'/assets/tokens/balances/by-address',
			{
				addresses,
				includeNativeTokens: true,
				includeErc20Tokens: false,
			},
			() =>
				portfolio.getTokenBalancesByAddress(fakeCtx(), {
					addresses,
					includeNativeTokens: true,
					includeErc20Tokens: false,
				}),
		],
		[
			'getTokensByAddress',
			'/assets/tokens/by-address',
			{
				addresses,
				withMetadata: true,
				withPrices: false,
			},
			() =>
				portfolio.getTokensByAddress(fakeCtx(), {
					addresses,
					withMetadata: true,
					withPrices: false,
				}),
		],
		[
			'getTransactionsHistoryByAddress',
			'/transactions/history/by-address',
			{ addresses, limit: 5 },
			() =>
				portfolio.getTransactionsHistoryByAddress(fakeCtx(), {
					addresses,
					limit: 5,
				}),
		],
	] as const)('%s posts body to %s', async (_name, path, body, invoke) => {
		mockedData.mockResolvedValueOnce({ data: {} });
		await invoke();
		const [, calledPath, calledBody] = mockedData.mock.calls[0] ?? [];
		expect(calledPath).toBe(path);
		expect(calledBody).toEqual(expect.objectContaining(body));
		expect(calledBody).toEqual(expect.objectContaining({ addresses }));
	});

	it('getTokenBalances uses erc20 tokenSpec when omitted', async () => {
		mockedRpc.mockResolvedValueOnce({
			address: owner,
			tokenBalances: [],
		});
		await token.getTokenBalances(fakeCtx(), { address: owner });
		expect(mockedRpc).toHaveBeenCalledWith(
			'eth-mainnet',
			'test-key',
			'alchemy_getTokenBalances',
			[owner, 'erc20'],
		);
	});

	it('getTokenMetadata calls alchemy_getTokenMetadata', async () => {
		mockedRpc.mockResolvedValueOnce({ name: 'USD Coin', symbol: 'USDC' });
		await token.getTokenMetadata(fakeCtx(), { contractAddress: contract });
		expect(mockedRpc).toHaveBeenCalledWith(
			'eth-mainnet',
			'test-key',
			'alchemy_getTokenMetadata',
			[contract],
		);
	});

	it('getTransactionCount parses hex nonce', async () => {
		mockedRpc.mockResolvedValueOnce('0x10');
		const result = await rpc.getTransactionCount(fakeCtx(), {
			address: owner,
			blockTag: 'latest',
		});
		expect(result).toEqual({ count: 16, hex: '0x10' });
	});

	it('rejects transaction counts beyond Number.MAX_SAFE_INTEGER', async () => {
		mockedRpc.mockResolvedValueOnce('0x20000000000001');
		await expect(
			rpc.getTransactionCount(fakeCtx(), {
				address: owner,
				blockTag: 'latest',
			}),
		).rejects.toThrow(/MAX_SAFE_INTEGER/);
	});

	it('rejects invalid network before NFT request', async () => {
		await expect(
			nft.getContractMetadataV3(
				{ key: 'k', options: { network: 'evil.com' } } as never,
				{ contractAddress: contract },
			),
		).rejects.toThrow(/Unsupported Alchemy network/);
		expect(mockedNft).not.toHaveBeenCalled();
	});
});
