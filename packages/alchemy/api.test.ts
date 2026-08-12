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

describe('Alchemy claim endpoint schemas', () => {
	it('registers all 36 claim endpoints', () => {
		expect(Object.keys(alchemyEndpointSchemas)).toHaveLength(36);
		expect(alchemyEndpointSchemas['nft.getNftsForOwner']).toBeDefined();
		expect(alchemyEndpointSchemas['prices.getPricesBySymbol']).toBeDefined();
		expect(
			alchemyEndpointSchemas['portfolio.getTokensByAddress'],
		).toBeDefined();
		expect(alchemyEndpointSchemas['token.getTokenBalances']).toBeDefined();
		expect(alchemyEndpointSchemas['rpc.getTransactionCount']).toBeDefined();
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

	it('isHolderOfContract calls NFT isHolderOfContract', async () => {
		mockedNft.mockResolvedValueOnce({ isHolderOfContract: true });
		const result = await nft.isHolderOfContract(fakeCtx(), {
			wallet: '0xwallet',
			contractAddress: '0xcontract',
		});
		expect(result).toEqual({ isHolderOfContract: true });
		expect(mockedNft).toHaveBeenCalledWith(
			'eth-mainnet',
			'test-key',
			'isHolderOfContract',
			{ wallet: '0xwallet', contractAddress: '0xcontract' },
		);
	});

	it('isHolderOfCollection aliases isHolderOfContract', async () => {
		mockedNft.mockResolvedValueOnce({ isHolderOfContract: false });
		await nft.isHolderOfCollection(fakeCtx(), {
			wallet: '0xwallet',
			contractAddress: '0xcontract',
		});
		expect(mockedNft.mock.calls[0]?.[2]).toBe('isHolderOfContract');
	});

	it('isAirdropNft calls isAirdropNFT', async () => {
		mockedNft.mockResolvedValueOnce(true);
		await nft.isAirdropNft(fakeCtx(), {
			contractAddress: '0xcontract',
			tokenId: '1',
		});
		expect(mockedNft.mock.calls[0]?.[2]).toBe('isAirdropNFT');
	});

	it('isSpamContractV3 calls isSpamContract', async () => {
		mockedNft.mockResolvedValueOnce(false);
		await nft.isSpamContractV3(fakeCtx(), { contractAddress: '0xcontract' });
		expect(mockedNft.mock.calls[0]?.[2]).toBe('isSpamContract');
	});

	it('getNftMetadataBatch posts tokens body', async () => {
		mockedNft.mockResolvedValueOnce({ nfts: [] });
		await nft.getNftMetadataBatch(fakeCtx(), {
			tokens: [{ contractAddress: '0xc', tokenId: '1' }],
		});
		expect(mockedNft).toHaveBeenCalledWith(
			'eth-mainnet',
			'test-key',
			'getNFTMetadataBatch',
			undefined,
			{
				method: 'POST',
				body: {
					tokens: [{ contractAddress: '0xc', tokenId: '1' }],
					tokenUriTimeoutInMs: undefined,
					refreshCache: undefined,
				},
			},
		);
	});

	it('getNftsForOwner maps array query keys', async () => {
		mockedNft.mockResolvedValueOnce({ ownedNfts: [] });
		await nft.getNftsForOwner(fakeCtx(), {
			owner: '0xowner',
			contractAddresses: ['0xa'],
			excludeFilters: ['SPAM'],
		});
		expect(mockedNft.mock.calls[0]?.[3]).toMatchObject({
			owner: '0xowner',
			'contractAddresses[]': ['0xa'],
			'excludeFilters[]': ['SPAM'],
		});
	});

	it('getNftsForCollectionV3 prefers collection slug path', async () => {
		mockedNft.mockResolvedValueOnce({ nfts: [] });
		await nft.getNftsForCollectionV3(fakeCtx(), {
			collectionSlug: 'boredapeyachtclub',
		});
		expect(mockedNft.mock.calls[0]?.[2]).toBe('getNFTsForCollection');
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
				body: expect.objectContaining({ symbol: 'ETH', interval: '1d' }),
			},
		);
	});

	it('getTokensByAddress posts portfolio path', async () => {
		mockedData.mockResolvedValueOnce({ data: { tokens: [] } });
		await portfolio.getTokensByAddress(fakeCtx(), {
			addresses: [{ address: '0xowner', networks: ['eth-mainnet'] }],
		});
		expect(mockedData).toHaveBeenCalledWith(
			'test-key',
			'/assets/tokens/by-address',
			expect.objectContaining({
				addresses: [{ address: '0xowner', networks: ['eth-mainnet'] }],
			}),
		);
	});

	it('getPortfolioNftsByAddress posts nfts path', async () => {
		mockedData.mockResolvedValueOnce({ data: { ownedNfts: [] } });
		await portfolio.getPortfolioNftsByAddress(fakeCtx(), {
			addresses: [{ address: '0xowner', networks: ['eth-mainnet'] }],
			pageSize: 2,
		});
		expect(mockedData.mock.calls[0]?.[1]).toBe('/assets/nfts/by-address');
	});

	it('getTokenBalances uses erc20 tokenSpec when omitted', async () => {
		mockedRpc.mockResolvedValueOnce({
			address: '0xowner',
			tokenBalances: [],
		});
		await token.getTokenBalances(fakeCtx(), { address: '0xowner' });
		expect(mockedRpc).toHaveBeenCalledWith(
			'eth-mainnet',
			'test-key',
			'alchemy_getTokenBalances',
			['0xowner', 'erc20'],
		);
	});

	it('getTransactionCount parses hex nonce', async () => {
		mockedRpc.mockResolvedValueOnce('0x10');
		const result = await rpc.getTransactionCount(fakeCtx(), {
			address: '0xowner',
			blockTag: 'latest',
		});
		expect(result).toEqual({ count: 16, hex: '0x10' });
	});

	it('rejects invalid network before NFT request', async () => {
		await expect(
			nft.getContractMetadataV3(
				{ key: 'k', options: { network: 'evil.com' } } as never,
				{ contractAddress: '0xc' },
			),
		).rejects.toThrow(/Unsupported Alchemy network/);
		expect(mockedNft).not.toHaveBeenCalled();
	});
});
