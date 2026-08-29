import {
	BlocknativeBaseFeeEstimates,
	BlocknativeBlockPrices,
	BlocknativeChain,
	BlocknativeGasDistribution,
	BlocknativeOracle,
	BlocknativeSchema,
} from './schema';

/** Official Block Price fixture (Rootstock docs sample, Ethereum-shaped). */
const OFFICIAL_BLOCK_PRICES = {
	system: 'rootstock',
	network: 'mainnet',
	unit: 'gwei',
	maxPrice: 0.1,
	currentBlockNumber: 7309086,
	msSinceLastBlock: 20466,
	blockPrices: [
		{
			blockNumber: 7309087,
			estimatedTransactionCount: 6,
			baseFeePerGas: 0.0,
			estimatedPrices: [
				{
					confidence: 99,
					price: 0.083,
					maxPriorityFeePerGas: 0.085,
					maxFeePerGas: 0.085,
				},
			],
		},
	],
};

describe('Blocknative schema', () => {
	it('declares a semver version', () => {
		expect(BlocknativeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official Gas Platform entities', () => {
		expect(Object.keys(BlocknativeSchema.entities).sort()).toEqual([
			'baseFeeEstimates',
			'blockPrices',
			'chains',
			'gasDistributions',
			'oracles',
		]);
	});

	it('parses official Block Price API JSON', () => {
		const parsed = BlocknativeBlockPrices.parse(OFFICIAL_BLOCK_PRICES);
		expect(parsed.blockPrices?.[0]?.estimatedPrices?.[0]?.confidence).toBe(99);
		expect(parsed.unit).toBe('gwei');
	});

	it('parses official Chains API fields', () => {
		expect(
			BlocknativeChain.parse({
				arch: 'evm',
				chainId: 1,
				label: 'Ethereum',
				system: 'ethereum',
				network: 'main',
			}).chainId,
		).toBe(1);
	});

	it('parses official Oracles API fields', () => {
		expect(
			BlocknativeOracle.parse({
				arch: 'evm',
				chainId: 1,
				label: 'Ethereum',
				addressByVersion: {
					'2': '0x1c51B22954af03FE11183aaDF43F6415907a9287',
				},
				rpcUrl: 'https://optimism.llamarpc.com',
			}).addressByVersion?.['2'],
		).toMatch(/^0x/);
	});

	it('parses official Distribution API envelope', () => {
		const parsed = BlocknativeGasDistribution.parse({
			system: 'ethereum',
			network: 'main',
			unit: 'gwei',
			maxPrice: 12,
			currentBlockNumber: 1,
			msSinceLastBlock: 100,
			topNDistribution: {
				distribution: [
					[3.16, 5],
					[1, 11],
				],
				n: 128,
			},
		});
		expect(parsed.topNDistribution?.n).toBe(128);
	});

	it('parses official base-fee estimate envelope', () => {
		const parsed = BlocknativeBaseFeeEstimates.parse({
			system: 'ethereum',
			network: 'main',
			unit: 'gwei',
			currentBlockNumber: 10,
			msSinceLastBlock: 200,
			estimatedBaseFees: [
				{
					'pending+1': [
						{ confidence: 99, baseFee: 12.3 },
						{ confidence: 50, baseFee: 11.1 },
					],
				},
			],
		});
		expect(parsed.estimatedBaseFees).toHaveLength(1);
	});

	it('rejects empty and unknown-only provider objects', () => {
		expect(() => BlocknativeBlockPrices.parse({})).toThrow();
		expect(() => BlocknativeBlockPrices.parse({ extra: true })).toThrow();
		expect(() =>
			BlocknativeBlockPrices.parse({
				system: 'ethereum',
				network: 'main',
				unit: 'gwei',
				blockPrices: [{}],
			}),
		).toThrow();
		expect(() => BlocknativeChain.parse({})).toThrow();
		expect(() => BlocknativeOracle.parse({ arch: 'evm' })).toThrow();
		expect(() => BlocknativeGasDistribution.parse({})).toThrow();
		expect(() => BlocknativeBaseFeeEstimates.parse({})).toThrow();
	});
});
