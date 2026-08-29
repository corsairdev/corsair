import { z } from 'zod';
import { BLOCKNATIVE_API_BASE, makeBlocknativeRequest } from './client';
import {
	BlocknativeBaseFeeEstimates,
	BlocknativeBlockPrices,
	BlocknativeChain,
	BlocknativeGasDistribution,
	BlocknativeOracle,
} from './schema';

const LIVE_KEY = process.env.BLOCKNATIVE_API_KEY ?? '';
const describeLive = LIVE_KEY ? describe : describe.skip;

describeLive('Blocknative live Gas Platform', () => {
	it('parses official GET /chains', async () => {
		const rows = await makeBlocknativeRequest('/chains', LIVE_KEY, {
			schema: z.array(BlocknativeChain),
		});
		expect(rows.length).toBeGreaterThan(0);
		expect(rows[0]?.chainId).toEqual(expect.any(Number));
		expect(BLOCKNATIVE_API_BASE).toBe('https://api.blocknative.com');
	});

	it('parses official GET /gasprices/blockprices', async () => {
		const parsed = await makeBlocknativeRequest(
			'/gasprices/blockprices',
			LIVE_KEY,
			{
				schema: BlocknativeBlockPrices,
				query: { chainid: 1, confidenceLevels: [99, 50] },
			},
		);
		expect(parsed.blockPrices?.[0]?.estimatedPrices?.length).toBeGreaterThan(0);
	});

	it('parses official GET /gasprices/basefee-estimates', async () => {
		const parsed = await makeBlocknativeRequest(
			'/gasprices/basefee-estimates',
			LIVE_KEY,
			{ schema: BlocknativeBaseFeeEstimates },
		);
		expect(parsed.system).toBeTruthy();
	});

	it('parses official GET /gasprices/distribution', async () => {
		const parsed = await makeBlocknativeRequest(
			'/gasprices/distribution',
			LIVE_KEY,
			{
				schema: BlocknativeGasDistribution,
				query: { chainid: 1 },
			},
		);
		expect(parsed.unit).toBeTruthy();
	});

	it('parses official GET /oracles', async () => {
		const rows = await makeBlocknativeRequest('/oracles', LIVE_KEY, {
			schema: z.array(BlocknativeOracle),
		});
		if (rows[0]) expect(rows[0].arch).toBeTruthy();
	});
});
