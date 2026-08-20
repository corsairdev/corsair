import { AlchemySchema } from './schema';
import {
	AlchemyNft,
	AlchemyNftContract,
	AlchemyToken,
	AlchemyTokenBalance,
	AlchemyTokenPrice,
} from './schema/database';

describe('Alchemy schema', () => {
	it('declares a semver version', () => {
		expect(AlchemySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares doc-labeled entities', () => {
		expect(Object.keys(AlchemySchema.entities).sort()).toEqual(
			[
				'AlchemyNft',
				'AlchemyNftContract',
				'AlchemyToken',
				'AlchemyTokenBalance',
				'AlchemyTokenPrice',
			].sort(),
		);
	});

	it('parses contract metadata fields from NFT API docs', () => {
		const parsed = AlchemyNftContract.parse({
			address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
			name: 'BoredApeYachtClub',
			symbol: 'BAYC',
			totalSupply: '10000',
			tokenType: 'ERC721',
			floorPrice: 10.5,
			isSpam: false,
		});
		expect(parsed.symbol).toBe('BAYC');
	});

	it('parses token price fields from Prices API docs', () => {
		const parsed = AlchemyTokenPrice.parse({
			symbol: 'ETH',
			currency: 'usd',
			value: '1880.59',
			lastUpdatedAt: '2026-08-12T19:25:24.205Z',
		});
		expect(parsed.value).toBe('1880.59');
	});

	it('allows null tokenAddress for native balances', () => {
		expect(
			AlchemyTokenBalance.parse({
				network: 'eth-mainnet',
				walletAddress: '0xabc',
				tokenAddress: null,
				tokenBalance: '0x1',
			}).tokenAddress,
		).toBeNull();
		expect(
			AlchemyToken.parse({
				contractAddress: null,
				symbol: 'ETH',
			}).contractAddress,
		).toBeNull();
		expect(
			AlchemyNft.parse({
				contractAddress: '0xc',
				tokenId: '1',
				name: null,
			}).tokenId,
		).toBe('1');
	});
});
