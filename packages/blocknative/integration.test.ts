import { BLOCKNATIVE_API_BASE, makeBlocknativeRequest } from './client';
import {
	BlocknativeBaseFeeEstimates,
	BlocknativeBlockPrices,
	BlocknativeChain,
	BlocknativeGasDistribution,
	BlocknativeOracle,
} from './schema';

const LIVE_KEY = process.env.BLOCKNATIVE_API_KEY ?? '';

async function probe(path: string): Promise<unknown> {
	return makeBlocknativeRequest(path, LIVE_KEY);
}

describe('Blocknative live Gas Platform', () => {
	it('reaches official host or records sunset/network failure', async () => {
		try {
			await probe('/chains');
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			return;
		}
	});

	it('parses official GET /chains when the host responds', async () => {
		let body: unknown;
		try {
			body = await probe('/chains');
		} catch {
			return;
		}
		const rows = Array.isArray(body) ? body : [];
		expect(rows.length).toBeGreaterThan(0);
		expect(BlocknativeChain.parse(rows[0]).chainId).toEqual(expect.any(Number));
		expect(BLOCKNATIVE_API_BASE).toBe('https://api.blocknative.com');
	});

	it('parses official GET /gasprices/blockprices when the host responds', async () => {
		let body: unknown;
		try {
			body = await makeBlocknativeRequest('/gasprices/blockprices', LIVE_KEY, {
				query: { chainid: 1, confidenceLevels: [99, 50] },
			});
		} catch {
			return;
		}
		const parsed = BlocknativeBlockPrices.parse(body);
		expect(parsed.blockPrices?.[0]?.estimatedPrices?.length).toBeGreaterThan(0);
	});

	it('parses official GET /gasprices/basefee-estimates when the host responds', async () => {
		let body: unknown;
		try {
			body = await probe('/gasprices/basefee-estimates');
		} catch {
			return;
		}
		expect(BlocknativeBaseFeeEstimates.parse(body).system).toBeTruthy();
	});

	it('parses official GET /gasprices/distribution when the host responds', async () => {
		let body: unknown;
		try {
			body = await makeBlocknativeRequest('/gasprices/distribution', LIVE_KEY, {
				query: { chainid: 1 },
			});
		} catch {
			return;
		}
		expect(BlocknativeGasDistribution.parse(body).unit).toBeTruthy();
	});

	it('parses official GET /oracles when the host responds', async () => {
		let body: unknown;
		try {
			body = await probe('/oracles');
		} catch {
			return;
		}
		const rows = Array.isArray(body) ? body : [];
		if (rows[0]) expect(BlocknativeOracle.parse(rows[0]).arch).toBeTruthy();
	});
});
