import { createCorsair } from 'corsair/core';
import { minerstat, minerstatEndpointSchemas } from './index';

const api = createCorsair({ plugins: [minerstat({ key: 'test-key' })] })
	.minerstat.api;
const coin = {
	slug: 'btc',
	symbol: 'BTC',
	name: 'Bitcoin',
	algorithm: 'sha-256',
	priceUsd: null,
	marketCapUsd: null,
};
const paged = <T>(results: T[]) => ({
	offset: 20,
	limit: 20,
	count: results.length,
	results,
});
// Each case exercises a different endpoint and response shape, so the shared
// table cannot use one narrower output type; the endpoint schemas validate it.
const cases: {
	name: keyof typeof minerstatEndpointSchemas;
	call: () => Promise<unknown>;
	path: string;
	response: unknown;
}[] = [
	{
		name: 'coins.list',
		call: () =>
			api.coins.list({
				algorithm: 'sha-256',
				verified: false,
				limit: 20,
				offset: 20,
			}),
		path: '/v3/coins?algorithm=sha-256&verified=false&limit=20&offset=20',
		response: paged([coin]),
	},
	{
		name: 'coins.get',
		call: () => api.coins.get({ slug: 'btc' }),
		path: '/v3/coins/btc',
		response: {
			generatedAt: '2026-08-30T19:48:43Z',
			dataUpdatedAt: '2026-08-30T19:47:58Z',
			confidence: 95,
			coin: {
				...coin,
				website: null,
				explorerUrl: null,
				consensusType: 'PoW',
				coinType: 'coin',
				circulatingSupply: null,
				maxSupply: 21000000,
			},
		},
	},
	{
		name: 'coins.history',
		call: () => api.coins.history({ slug: 'btc', limit: 20, offset: 20 }),
		path: '/v3/coins/btc/history?limit=20&offset=20',
		response: {
			coin: 'btc',
			symbol: 'BTC',
			...paged([
				{ t: '2026-08-30T19:46:03Z', difficulty: 100, networkHashrate: 200 },
			]),
		},
	},
	{
		name: 'hardware.list',
		call: () => api.hardware.list({ type: 'ASIC', limit: 20, offset: 20 }),
		path: '/v3/hardware?type=ASIC&limit=20&offset=20',
		response: paged([
			{
				slug: 'asic',
				manufacturer: 'Bitmain',
				model: 'S23',
				type: 'ASIC',
				powerWatts: null,
				releaseDate: null,
			},
		]),
	},
	{
		name: 'hardware.get',
		call: () => api.hardware.get({ slug: 'gpu' }),
		path: '/v3/hardware/gpu',
		response: {
			hardware: {
				slug: 'gpu',
				name: 'GPU',
				manufacturer: 'Nvidia',
				type: 'GPU',
				defaultPowerWatts: 450,
				releaseDate: null,
				specs: ['Memory: 24 GB'],
			},
		},
	},
	{
		name: 'algorithms.list',
		call: () => api.algorithms.list({ limit: 20, offset: 20 }),
		path: '/v3/algorithms?limit=20&offset=20',
		response: paged([
			{ slug: 'sha-256', name: 'SHA-256', unit: 'TH/s', coins: 12 },
		]),
	},
	{
		name: 'algorithms.get',
		call: () => api.algorithms.get({ slug: 'sha-256' }),
		path: '/v3/algorithms/sha-256',
		response: {
			algorithm: {
				slug: 'sha-256',
				name: 'SHA-256',
				unit: 'TH/s',
				coins: [coin],
				hardware: [
					{
						slug: 'asic',
						name: 'ASIC',
						type: 'ASIC',
						hashrateHs: 580,
						powerWatts: 5510,
					},
				],
			},
		},
	},
	{
		name: 'pools.list',
		call: () => api.pools.list({ limit: 20, offset: 20 }),
		path: '/v3/pools?limit=20&offset=20',
		response: paged([
			{
				slug: 'f2pool',
				name: 'F2Pool',
				website: 'https://f2pool.com',
				type: 'pool',
				defaultFee: null,
				coins: 16,
				lastOkAt: null,
			},
		]),
	},
	{
		name: 'pools.get',
		call: () => api.pools.get({ slug: 'f2pool' }),
		path: '/v3/pools/f2pool',
		response: {
			pool: {
				slug: 'f2pool',
				name: 'F2Pool',
				website: 'https://f2pool.com',
				founded: '2013',
				coins: [
					{
						coin: 'btc',
						symbol: 'BTC',
						algorithm: 'sha-256',
						fee: 0.025,
						payoutScheme: 'PPS+',
						minPayout: 0.005,
					},
				],
			},
		},
	},
	{
		name: 'profitability.rank',
		call: () =>
			api.profitability.rank({
				hardware: 'gpu',
				electricity: 0.08,
				verifiedOnly: false,
				window: '24h',
			}),
		path: '/v3/profitability?hardware=gpu&electricity=0.08&verifiedOnly=false&window=24h',
		response: {
			hardware: null,
			electricityPrice: 0.08,
			currency: 'USD',
			results: [
				{
					coin: { slug: 'btc', symbol: 'BTC', algorithm: 'sha-256' },
					coinsPerDay: 1,
					revenuePerDay: 2,
					electricityPerDay: 1,
					profitPerDay: 1,
					profitMargin: 0.5,
					breakEvenElectricityPrice: 0.16,
					confidenceScore: 75,
				},
			],
		},
	},
];
let fetchMock: jest.SpyInstance;
beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('Unexpected request');
	});
});
afterEach(() => jest.restoreAllMocks());
it('covers all 10 registered operations', () => {
	expect(cases.map(({ name }) => name).sort()).toEqual(
		Object.keys(minerstatEndpointSchemas).sort(),
	);
	expect(cases).toHaveLength(10);
});
it.each(cases)(
	'$name sends the documented request and parses the response',
	async ({ call, path, response }) => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(response), {
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		expect(await call()).toEqual(response);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`https://api.minerstat.com${path}`);
		expect(request.method).toBe('GET');
		expect(new Headers(request.headers).get('X-Api-Key')).toBe('test-key');
		expect(new Headers(request.headers).get('Authorization')).toBeNull();
		expect(request.body).toBeUndefined();
	},
);
it('accepts the documented algorithms list example without pagination metadata', async () => {
	const response = {
		count: 20,
		results: [{ slug: 'sha-256', name: 'SHA-256', unit: 'TH/s', coins: 12 }],
	};
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(response), {
			headers: { 'Content-Type': 'application/json' },
		}),
	);
	await expect(api.algorithms.list({})).resolves.toEqual(response);
});
it('validates unchecked responses at each public endpoint', async () => {
	for (const { call } of cases) {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({}), {
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(call()).rejects.toBeDefined();
	}
	expect(fetchMock).toHaveBeenCalledTimes(cases.length);
});
it('rejects unsafe slugs before sending a request', async () => {
	for (const slug of ['', '.', '..', 'a/b', 'a\\b', '"x"', "'x'"]) {
		await expect(api.coins.get({ slug })).rejects.toBeDefined();
		await expect(api.hardware.get({ slug })).rejects.toBeDefined();
		await expect(api.algorithms.get({ slug })).rejects.toBeDefined();
		await expect(api.pools.get({ slug })).rejects.toBeDefined();
	}
	expect(fetchMock).not.toHaveBeenCalled();
});
it('encodes valid path slugs', async () => {
	fetchMock.mockResolvedValueOnce(
		new Response(
			JSON.stringify({
				hardware: {
					slug: 'a b',
					name: 'GPU',
					manufacturer: 'Nvidia',
					type: 'GPU',
					defaultPowerWatts: null,
					releaseDate: null,
					specs: [],
				},
			}),
			{ headers: { 'Content-Type': 'application/json' } },
		),
	);
	await api.hardware.get({ slug: 'a b' });
	expect(fetchMock.mock.calls[0][0]).toBe(
		'https://api.minerstat.com/v3/hardware/a%20b',
	);
});
it('preserves rate limit error and retry-after without retry', async () => {
	fetchMock.mockResolvedValueOnce(
		new Response(
			JSON.stringify({ error: { code: 'rate_limited', message: 'Slow down' } }),
			{
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '5' },
			},
		),
	);
	await expect(api.coins.list({})).rejects.toMatchObject({
		status: 429,
		retryAfter: 5000,
		body: { error: { code: 'rate_limited', message: 'Slow down' } },
	});
	expect(fetchMock).toHaveBeenCalledTimes(1);
});
it('sends the API key without exposing it in provider errors', async () => {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify({ error: { code: 'unauthorized' } }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
	const error = await api.coins.list({}).catch((caught) => caught);
	expect(error).toMatchObject({ status: 401 });
	expect(JSON.stringify(error)).not.toContain('test-key');
	expect(error.request.headers).toBeUndefined();
	const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
	expect(new Headers(request.headers).get('X-Api-Key')).toBe('test-key');
});
it('rejects malformed responses and missing credentials', async () => {
	fetchMock.mockResolvedValueOnce(
		new Response(
			JSON.stringify({ offset: 0, limit: 1, count: 1, results: [{ slug: 3 }] }),
			{ headers: { 'Content-Type': 'application/json' } },
		),
	);
	await expect(api.coins.list({})).rejects.toBeDefined();
	const previous = process.env.MINERSTAT_API_KEY;
	Reflect.deleteProperty(process.env, 'MINERSTAT_API_KEY');
	try {
		await expect(
			createCorsair({ plugins: [minerstat()] }).minerstat.api.coins.list({}),
		).rejects.toBeDefined();
		expect(fetchMock).toHaveBeenCalledTimes(1);
	} finally {
		if (previous !== undefined) process.env.MINERSTAT_API_KEY = previous;
	}
});
