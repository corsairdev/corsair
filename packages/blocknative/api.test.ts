import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	BLOCKNATIVE_API_BASE,
	BLOCKNATIVE_WS_URL,
	BlocknativeAPIError,
	BlocknativeRateLimitError,
	makeBlocknativeRequest,
} from './client';
import {
	getBaseFeeEstimates,
	getGasDistribution,
	getGasOracles,
	getGasPrices,
	getSupportedChains,
} from './endpoints/gas';
import {
	BlocknativeEndpointInputSchemas,
	BlocknativeEndpointOutputSchemas,
} from './endpoints/types';
import {
	configureFilters,
	subscribeMultichain,
	subscribeTransactionHash,
	unsubscribeMultichain,
	unsubscribeTransactionHash,
} from './endpoints/websocket';
import { errorHandlers } from './error-handlers';
import { blocknative } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

const mockFetch = jest.fn();

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});

beforeEach(() => {
	mockFetch.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

const ctx = {
	key: 'test-api-key',
	$getAccountId: async () => 'test-account',
} as never;

const TX = '0xbb1af436fd539a6282c6f45ed900abb5ac95ec435367f61fa8815a61bd2a7211';
const ADDR = '0x32ee303b76B27A1cd1013DE2eA4513aceB937c72';

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers as Record<string, string>),
		},
	});
}

function lastRequest(): { url: string; auth: string | null } {
	expect(mockFetch).toHaveBeenCalled();
	const [input, init] = mockFetch.mock.calls[0] as [
		string | URL | Request,
		RequestInit | undefined,
	];
	const url =
		typeof input === 'string'
			? input
			: input instanceof URL
				? input.toString()
				: input.url;
	const headers = new Headers(init?.headers);
	return { url, auth: headers.get('Authorization') };
}

describe('Blocknative plugin', () => {
	it('creates plugin instance with 10 endpoints and api_key auth', () => {
		const plugin = blocknative({ key: 'test-api-key' });
		expect(plugin.id).toBe('blocknative');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(10);
		expect(plugin.webhooks).toEqual({});
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const plugin = blocknative();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('sends official Authorization header (raw API key, not Bearer)', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				system: 'ethereum',
				network: 'main',
				unit: 'gwei',
				blockPrices: [],
			}),
		);
		await getGasPrices(
			ctx,
			BlocknativeEndpointInputSchemas.getGasPrices.parse({
				chainid: 1,
				confidenceLevels: [99, 50],
			}),
		);
		const { url, auth } = lastRequest();
		expect(
			url.startsWith(`${BLOCKNATIVE_API_BASE}/gasprices/blockprices`),
		).toBe(true);
		expect(url).toContain('chainid=1');
		expect(url).toContain('confidenceLevels=99');
		expect(url).toContain('confidenceLevels=50');
		expect(auth).toBe('test-api-key');
		expect(auth).not.toMatch(/^Bearer /);
	});

	it('maps GET /gasprices/basefee-estimates', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				system: 'ethereum',
				network: 'main',
				unit: 'gwei',
				estimatedBaseFees: [],
			}),
		);
		const result = await getBaseFeeEstimates(ctx, {});
		expect(lastRequest().url).toBe(
			`${BLOCKNATIVE_API_BASE}/gasprices/basefee-estimates`,
		);
		expect(
			BlocknativeEndpointOutputSchemas.getBaseFeeEstimates.parse(result).unit,
		).toBe('gwei');
	});

	it('maps GET /gasprices/distribution', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				system: 'ethereum',
				network: 'main',
				unit: 'gwei',
				topNDistribution: { distribution: [[1, 2]], n: 1 },
			}),
		);
		const result = await getGasDistribution(
			ctx,
			BlocknativeEndpointInputSchemas.getGasDistribution.parse({ chainid: 1 }),
		);
		expect(lastRequest().url).toContain('/gasprices/distribution?chainid=1');
		expect(result.topNDistribution?.n).toBe(1);
	});

	it('maps GET /oracles and GET /chains arrays', async () => {
		mockFetch.mockResolvedValueOnce(
			jsonResponse([{ arch: 'evm', chainId: 1, label: 'Ethereum' }]),
		);
		const oracles = await getGasOracles(ctx, {});
		expect(lastRequest().url).toBe(`${BLOCKNATIVE_API_BASE}/oracles`);
		expect(oracles.oracles[0]?.chainId).toBe(1);

		mockFetch.mockReset();
		mockFetch.mockResolvedValueOnce(
			jsonResponse([{ arch: 'evm', chainId: 1, label: 'Ethereum' }]),
		);
		const chains = await getSupportedChains(ctx, {});
		expect(lastRequest().url).toBe(`${BLOCKNATIVE_API_BASE}/chains`);
		expect(chains.chains[0]?.label).toBe('Ethereum');
	});

	it('builds official configs/put filter message', async () => {
		const result = await configureFilters(
			ctx,
			BlocknativeEndpointInputSchemas.configureFilters.parse({
				scope: ADDR,
				watchAddress: true,
				filters: [{ 'contractCall.methodName': 'transfer' }],
			}),
		);
		expect(result.websocketUrl).toBe(BLOCKNATIVE_WS_URL);
		expect(result.initialize.eventCode).toBe('checkDappId');
		expect(result.config.categoryCode).toBe('configs');
		expect(result.config.eventCode).toBe('put');
		expect(
			(result.config.config as { scope: string; watchAddress: boolean }).scope,
		).toBe(ADDR);
	});

	it('builds official activeTransaction subscribe/unwatch messages', async () => {
		const sub = await subscribeTransactionHash(
			ctx,
			BlocknativeEndpointInputSchemas.subscribeTransactionHash.parse({
				hash: TX,
			}),
		);
		expect(sub.subscribe.categoryCode).toBe('activeTransaction');
		expect(sub.subscribe.eventCode).toBe('txSent');
		expect((sub.subscribe.transaction as { hash: string }).hash).toBe(TX);

		const unsub = await unsubscribeTransactionHash(
			ctx,
			BlocknativeEndpointInputSchemas.unsubscribeTransactionHash.parse({
				hash: TX,
			}),
		);
		expect(unsub.unsubscribe.eventCode).toBe('unwatch');
		expect((unsub.unsubscribe.transaction as { status: string }).status).toBe(
			'unsubscribed',
		);
	});

	it('builds official multichain account + transaction subscribe payloads', async () => {
		const account = await subscribeMultichain(
			ctx,
			BlocknativeEndpointInputSchemas.subscribeMultichain.parse({
				id: ADDR,
				type: 'account',
				chainId: '0x1',
			}),
		);
		expect(account.initialize.blockchain).toEqual({
			system: 'ethereum',
			network: 'main',
		});
		expect(account.subscribe.categoryCode).toBe('configs');
		expect(
			(account.subscribe.config as { watchAddress: boolean }).watchAddress,
		).toBe(true);

		const tx = await subscribeMultichain(
			ctx,
			BlocknativeEndpointInputSchemas.subscribeMultichain.parse({
				id: TX,
				type: 'transaction',
				chainId: '0x1',
			}),
		);
		expect(tx.subscribe.eventCode).toBe('txSent');

		const stop = await unsubscribeMultichain(
			ctx,
			BlocknativeEndpointInputSchemas.unsubscribeMultichain.parse({
				id: TX,
				chainId: '0x1',
			}),
		);
		expect(stop).toEqual({
			id: TX,
			chainId: '0x1',
			sdkCall: 'unsubscribe',
		});
	});

	it('maps 401 and 429 through plugin error handlers', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse(
				{ msg: 'Authorization header must contain a valid apikey' },
				{ status: 401 },
			),
		);
		await expect(
			makeBlocknativeRequest('/chains', 'bad'),
		).rejects.toMatchObject({ name: 'BlocknativeAPIError', status: 401 });

		const authErr = new BlocknativeAPIError(
			'Authorization header must contain a valid apikey',
			undefined,
			401,
		);
		expect(errorHandlers.AUTH_ERROR.match(authErr)).toBe(true);

		const rate = new BlocknativeRateLimitError('ratelimit', 1000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rate)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler(rate)).resolves.toEqual(
			{
				maxRetries: 5,
				headersRetryAfterMs: 1000,
			},
		);
	});
});
