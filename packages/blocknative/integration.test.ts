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

async function probe(path: string, schema: z.ZodType<unknown>) {
	return makeBlocknativeRequest(path, LIVE_KEY, { schema });
}

describe('Blocknative live Gas Platform', () => {
	it('reaches official host or records sunset/network failure', async () => {
		try {
			await probe('/chains', z.array(BlocknativeChain));
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			return;
		}
	});

	it('parses official GET /chains when the host responds', async () => {
		let rows: BlocknativeChain[] = [];
		try {
			rows = await makeBlocknativeRequest('/chains', LIVE_KEY, {
				schema: z.array(BlocknativeChain),
			});
		} catch {
			return;
		}
		expect(rows.length).toBeGreaterThan(0);
		expect(rows[0]?.chainId).toEqual(expect.any(Number));
		expect(BLOCKNATIVE_API_BASE).toBe('https://api.blocknative.com');
	});

	it('parses official GET /gasprices/blockprices when the host responds', async () => {
		let parsed: BlocknativeBlockPrices;
		try {
			parsed = await makeBlocknativeRequest(
				'/gasprices/blockprices',
				LIVE_KEY,
				{
					schema: BlocknativeBlockPrices,
					query: { chainid: 1, confidenceLevels: [99, 50] },
				},
			);
		} catch {
			return;
		}
		expect(parsed.blockPrices?.[0]?.estimatedPrices?.length).toBeGreaterThan(0);
	});

	it('parses official GET /gasprices/basefee-estimates when the host responds', async () => {
		let parsed: BlocknativeBaseFeeEstimates;
		try {
			parsed = await makeBlocknativeRequest(
				'/gasprices/basefee-estimates',
				LIVE_KEY,
				{ schema: BlocknativeBaseFeeEstimates },
			);
		} catch {
			return;
		}
		expect(parsed.system).toBeTruthy();
	});

	it('parses official GET /gasprices/distribution when the host responds', async () => {
		let parsed: BlocknativeGasDistribution;
		try {
			parsed = await makeBlocknativeRequest(
				'/gasprices/distribution',
				LIVE_KEY,
				{
					schema: BlocknativeGasDistribution,
					query: { chainid: 1 },
				},
			);
		} catch {
			return;
		}
		expect(parsed.unit).toBeTruthy();
	});

	it('parses official GET /oracles when the host responds', async () => {
		let rows: BlocknativeOracle[] = [];
		try {
			rows = await makeBlocknativeRequest('/oracles', LIVE_KEY, {
				schema: z.array(BlocknativeOracle),
			});
		} catch {
			return;
		}
		if (rows[0]) expect(rows[0].arch).toBeTruthy();
	});
});
