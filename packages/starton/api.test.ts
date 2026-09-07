import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { encodeStartonPathSegment, makeStartonRequest } from './client';
import { SmartContract, Transaction, Wallet } from './endpoints';
import {
	StartonEndpointInputSchemas,
	StartonEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { StartonContext } from './index';
import { starton, startonEndpointSchemas } from './index';

// ─────────────────────────────────────────────────────────────────────────────
// Fetch mock — captures the outgoing request so we can assert URL / method /
// headers / body without touching the real Starton API.
// ─────────────────────────────────────────────────────────────────────────────

type CapturedRequest = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body: string | undefined;
};

let captured: CapturedRequest | undefined;
let nextResponseBody: unknown = {};
let nextResponseStatus = 200;

const originalFetch = globalThis.fetch;

beforeEach(() => {
	captured = undefined;
	nextResponseBody = {};
	nextResponseStatus = 200;
	globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return new Response(JSON.stringify(nextResponseBody), {
			status: nextResponseStatus,
			statusText: `status ${nextResponseStatus}`,
			headers: { 'Content-Type': 'application/json' },
		});
	}) as typeof fetch;
});

afterEach(() => {
	globalThis.fetch = originalFetch;
});

const ctx = {
	key: 'test-starton-api-key',
	$getAccountId: async () => 'acct_test',
	database: undefined,
	endpoints: {},
} as unknown as StartonContext;

// ─────────────────────────────────────────────────────────────────────────────
// Client / auth
// ─────────────────────────────────────────────────────────────────────────────

describe('makeStartonRequest', () => {
	it('targets the v3 base URL and sends the API key as x-api-key', async () => {
		await makeStartonRequest('v3/kms/wallet', 'test-starton-api-key', {
			method: 'GET',
		});

		expect(captured?.url).toBe('https://api.starton.com/v3/kms/wallet');
		expect(captured?.headers['x-api-key']).toBe('test-starton-api-key');
	});

	it('serializes JSON bodies for write requests', async () => {
		await makeStartonRequest('v3/kms/wallet', 'k', {
			method: 'POST',
			body: { kmsId: 'kms_1', name: 'Treasury' },
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.headers['content-type']).toContain('application/json');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			kmsId: 'kms_1',
			name: 'Treasury',
		});
	});

	it('appends query params for list/filter requests', async () => {
		await makeStartonRequest('v3/kms/wallet', 'k', {
			method: 'GET',
			query: { page: 0, limit: 20 },
		});

		expect(captured?.url).toContain('page=0');
		expect(captured?.url).toContain('limit=20');
	});

	it('rejects path-traversal segments before building the URL', () => {
		expect(() => encodeStartonPathSegment('..')).toThrow();
		expect(() => encodeStartonPathSegment('')).toThrow();
		expect(encodeStartonPathSegment('polygon-mumbai')).toBe('polygon-mumbai');
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint request shape (path + method + payload)
// ─────────────────────────────────────────────────────────────────────────────

describe('endpoint request wiring', () => {
	it('Wallet.create -> POST /v3/kms/wallet', async () => {
		nextResponseBody = {
			address: '0xabc',
			providerKeyId: 'pk_1',
			kmsId: 'kms_1',
			projectId: 'proj_1',
			createdAt: '2024-01-01T00:00:00.000Z',
			updatedAt: '2024-01-01T00:00:00.000Z',
		};
		const res = await Wallet.create(ctx, { kmsId: 'kms_1', name: 'Treasury' });

		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('https://api.starton.com/v3/kms/wallet');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			kmsId: 'kms_1',
			name: 'Treasury',
		});
		expect(res.address).toBe('0xabc');
	});

	it('Wallet.list -> GET /v3/kms/wallet with pagination filters', async () => {
		nextResponseBody = {
			items: [{ address: '0xabc', providerKeyId: 'pk_1', kmsId: 'kms_1', projectId: 'p', createdAt: 'x', updatedAt: 'x' }],
			meta: { itemCount: 1, itemsPerPage: 20, currentPage: 0 },
		};
		const res = await Wallet.list(ctx, { page: 0, limit: 20 });

		expect(captured?.method).toBe('GET');
		expect(captured?.url).toContain('https://api.starton.com/v3/kms/wallet?');
		expect(captured?.url).toContain('page=0');
		expect(captured?.url).toContain('limit=20');
		expect(res.items).toHaveLength(1);
	});

	it('SmartContract.deployFromTemplate -> POST /v3/smart-contract/from-template', async () => {
		nextResponseBody = {
			smartContract: {
				id: 'sc_1',
				name: 'TestToken',
				network: 'polygon-mumbai',
				address: '0xdef',
				status: 'PUBLISHED',
				state: 'PENDING',
				projectId: 'p',
				createdAt: 'x',
				updatedAt: 'x',
			},
			transaction: {
				id: 'tx_1',
				chainId: 80001,
				network: 'polygon-mumbai',
				from: '0x298',
				signerWallet: '0x298',
				status: 'PUBLISHED',
				state: 'PENDING',
				logs: [],
				value: '0',
				automaticNonce: true,
				isDeployTransaction: true,
				projectId: 'p',
				createdAt: 'x',
				updatedAt: 'x',
			},
		};
		const res = await SmartContract.deployFromTemplate(ctx, {
			network: 'polygon-mumbai',
			signerWallet: '0x298e760768c8481780397eE28A127eAd584df4ee',
			templateId: 'ERC20_MINT_META_TRANSACTION',
			name: 'TestToken',
			params: ['TestToken', 'TEST', '1000000000000000000000000'],
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe(
			'https://api.starton.com/v3/smart-contract/from-template',
		);
		expect(res.smartContract.id).toBe('sc_1');
		expect(res.transaction.id).toBe('tx_1');
	});

	it('deployFromTemplate forwards `simulate` as a query param, not body', async () => {
		nextResponseBody = {
			smartContract: {
				id: 'sc_1',
				name: 'TestToken',
				network: 'polygon-mumbai',
				address: '0xdef',
				status: 'PUBLISHED',
				state: 'PENDING',
				projectId: 'p',
				createdAt: 'x',
				updatedAt: 'x',
			},
			transaction: {
				id: 'tx_1',
				chainId: 80001,
				network: 'polygon-mumbai',
				from: '0x298',
				signerWallet: '0x298',
				status: 'PUBLISHED',
				state: 'PENDING',
				logs: [],
				value: '0',
				automaticNonce: true,
				isDeployTransaction: true,
				projectId: 'p',
				createdAt: 'x',
				updatedAt: 'x',
			},
		};
		await SmartContract.deployFromTemplate(ctx, {
			network: 'polygon-mumbai',
			signerWallet: '0x298',
			templateId: 'ERC20_MINT_META_TRANSACTION',
			name: 'TestToken',
			params: [],
			simulate: true,
		});

		expect(captured?.url).toContain('simulate=true');
		expect(JSON.parse(captured?.body ?? '{}').simulate).toBeUndefined();
	});

	it('SmartContract.call -> POST /v3/smart-contract/{network}/{address}/call', async () => {
		nextResponseBody = {
			id: 'tx_1',
			chainId: 80001,
			network: 'polygon-mumbai',
			from: '0x298',
			signerWallet: '0x298',
			status: 'PUBLISHED',
			state: 'PENDING',
			logs: [],
			value: '0',
			automaticNonce: true,
			isDeployTransaction: false,
			projectId: 'p',
			createdAt: 'x',
			updatedAt: 'x',
		};
		const res = await SmartContract.call(ctx, {
			network: 'polygon-mumbai',
			address: '0x820f8728E32519b9C91B2406BF48AF80711aFecD',
			functionName: 'mint',
			params: ['0x298', '1000000000000000000'],
			signerWallet: '0x298',
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.url).toContain(
			'https://api.starton.com/v3/smart-contract/polygon-mumbai/0x820f8728E32519b9C91B2406BF48AF80711aFecD/call',
		);
		expect(res.id).toBe('tx_1');
	});

	it('SmartContract.read -> POST /v3/smart-contract/{network}/{address}/read', async () => {
		nextResponseBody = {
			response: '1000000000000000000',
			params: ['0x298'],
			functionName: 'balanceOf',
			address: '0x820f8728E32519b9C91B2406BF48AF80711aFecD',
			network: 'polygon-mumbai',
		};
		const res = await SmartContract.read(ctx, {
			network: 'polygon-mumbai',
			address: '0x820f8728E32519b9C91B2406BF48AF80711aFecD',
			functionName: 'balanceOf',
			params: ['0x298'],
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe(
			'https://api.starton.com/v3/smart-contract/polygon-mumbai/0x820f8728E32519b9C91B2406BF48AF80711aFecD/read',
		);
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			functionName: 'balanceOf',
			params: ['0x298'],
		});
		expect(res.response).toBe('1000000000000000000');
	});

	it('Transaction.get -> GET /v3/transaction/{id}', async () => {
		nextResponseBody = {
			id: 'tx_1abfa87e04814cb7a669d614d1fe5f78',
			chainId: 80001,
			network: 'polygon-mumbai',
			from: '0x298',
			signerWallet: '0x298',
			status: 'CONFIRMED',
			state: 'SUCCESS',
			logs: [],
			value: '0',
			automaticNonce: true,
			isDeployTransaction: false,
			projectId: 'p',
			createdAt: 'x',
			updatedAt: 'x',
		};
		const res = await Transaction.get(ctx, {
			id: 'tx_1abfa87e04814cb7a669d614d1fe5f78',
		});

		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe(
			'https://api.starton.com/v3/transaction/tx_1abfa87e04814cb7a669d614d1fe5f78',
		);
		expect(res.status).toBe('CONFIRMED');
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Schema coverage — every declared endpoint has an input + output schema
// ─────────────────────────────────────────────────────────────────────────────

describe('schema coverage', () => {
	const schemaKeys = Object.keys(startonEndpointSchemas);

	it('declares 6 endpoints', () => {
		expect(schemaKeys).toHaveLength(6);
		expect(schemaKeys.sort()).toEqual([
			'smartContract.call',
			'smartContract.deployFromTemplate',
			'smartContract.read',
			'transaction.get',
			'wallet.create',
			'wallet.list',
		]);
	});

	it('every endpoint schema entry has an input and output schema', () => {
		const entries = startonEndpointSchemas as Record<
			string,
			{ input?: unknown; output?: unknown }
		>;
		for (const key of schemaKeys) {
			expect(entries[key]?.input).toBeDefined();
			expect(entries[key]?.output).toBeDefined();
		}
	});

	it('input and output schema maps expose the same operation keys', () => {
		expect(Object.keys(StartonEndpointInputSchemas).sort()).toEqual(
			Object.keys(StartonEndpointOutputSchemas).sort(),
		);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Input validation
// ─────────────────────────────────────────────────────────────────────────────

describe('input schema validation', () => {
	it('requires kmsId to create a wallet', () => {
		expect(
			StartonEndpointInputSchemas.walletCreate.safeParse({ name: 'Treasury' })
				.success,
		).toBe(false);
		expect(
			StartonEndpointInputSchemas.walletCreate.safeParse({ kmsId: 'kms_1' })
				.success,
		).toBe(true);
	});

	it('caps wallet list page size at 2500 per the official spec', () => {
		expect(
			StartonEndpointInputSchemas.walletList.safeParse({ limit: 2500 }).success,
		).toBe(true);
		expect(
			StartonEndpointInputSchemas.walletList.safeParse({ limit: 2501 }).success,
		).toBe(false);
	});

	it('requires network, signerWallet, templateId, name and params to deploy from template', () => {
		expect(
			StartonEndpointInputSchemas.smartContractDeployFromTemplate.safeParse({
				network: 'polygon-mumbai',
				signerWallet: '0x298',
				templateId: 'ERC20_MINT_META_TRANSACTION',
				name: 'TestToken',
			}).success,
		).toBe(true);
		expect(
			StartonEndpointInputSchemas.smartContractDeployFromTemplate.safeParse({
				network: 'polygon-mumbai',
			}).success,
		).toBe(false);
	});

	it('requires functionName, params and signerWallet to call a contract', () => {
		expect(
			StartonEndpointInputSchemas.smartContractCall.safeParse({
				network: 'polygon-mumbai',
				address: '0xabc',
				functionName: 'mint',
				params: [],
				signerWallet: '0x298',
			}).success,
		).toBe(true);
		expect(
			StartonEndpointInputSchemas.smartContractCall.safeParse({
				network: 'polygon-mumbai',
				address: '0xabc',
				functionName: 'mint',
			}).success,
		).toBe(false);
	});

	it('rejects a wallet-list name filter outside the spec pattern', () => {
		expect(
			StartonEndpointInputSchemas.walletList.safeParse({ name: 'Treasury 1' })
				.success,
		).toBe(true);
		expect(
			StartonEndpointInputSchemas.walletList.safeParse({ name: 'Treasury/../x' })
				.success,
		).toBe(false);
	});

	it('accepts the optional uiData block on a template deploy', () => {
		const parsed =
			StartonEndpointInputSchemas.smartContractDeployFromTemplate.safeParse({
				network: 'polygon-mumbai',
				signerWallet: '0x298',
				templateId: 'ERC20_MINT_META_TRANSACTION',
				name: 'TestToken',
				params: [],
				uiData: { version: '1', deployMethod: 'kms', imported: false },
			});
		expect(parsed.success).toBe(true);
		expect(
			StartonEndpointInputSchemas.smartContractDeployFromTemplate.safeParse({
				network: 'polygon-mumbai',
				signerWallet: '0x298',
				templateId: 'ERC20_MINT_META_TRANSACTION',
				name: 'TestToken',
				params: [],
				uiData: { version: '1', deployMethod: 'carrier-pigeon', imported: false },
			}).success,
		).toBe(false);
	});

	it('read does not require signerWallet (no transaction is broadcast)', () => {
		expect(
			StartonEndpointInputSchemas.smartContractRead.safeParse({
				network: 'polygon-mumbai',
				address: '0xabc',
				functionName: 'balanceOf',
				params: ['0x298'],
			}).success,
		).toBe(true);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Output validation
// ─────────────────────────────────────────────────────────────────────────────

describe('output schema validation', () => {
	it('parses a representative Transaction and keeps unknown fields', () => {
		const parsed = StartonEndpointOutputSchemas.transactionGet.parse({
			id: 'tx_1',
			chainId: 80001,
			network: 'polygon-mumbai',
			from: '0x298',
			signerWallet: '0x298',
			status: 'CONFIRMED',
			state: 'SUCCESS',
			logs: [],
			value: '0',
			automaticNonce: true,
			isDeployTransaction: false,
			projectId: 'p',
			createdAt: 'x',
			updatedAt: 'x',
			someFutureField: true,
		});
		expect(parsed.id).toBe('tx_1');
		expect((parsed as Record<string, unknown>).someFutureField).toBe(true);
	});

	it('parses the paginated wallet-list envelope', () => {
		const parsed = StartonEndpointOutputSchemas.walletList.parse({
			items: [
				{
					address: '0xabc',
					providerKeyId: 'pk_1',
					kmsId: 'kms_1',
					projectId: 'p',
					createdAt: 'x',
					updatedAt: 'x',
				},
			],
			meta: { itemCount: 1, itemsPerPage: 100, currentPage: 0 },
		});
		expect(parsed.items).toHaveLength(1);
		expect(parsed.meta.itemCount).toBe(1);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Plugin wiring
// ─────────────────────────────────────────────────────────────────────────────

describe('starton() plugin', () => {
	it('exposes the plugin id, endpoint groups and matching meta', () => {
		const plugin = starton({ key: 'test-starton-api-key' });
		expect(plugin.id).toBe('starton');
		expect(Object.keys(plugin.endpoints ?? {}).sort()).toEqual([
			'smartContract',
			'transaction',
			'wallet',
		]);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			Object.keys(startonEndpointSchemas).sort(),
		);
	});

	it('has no webhooks — the Corsair listing declares 0 triggers', () => {
		const plugin = starton();
		expect(plugin.webhooks).toEqual({});
	});

	it('keyBuilder returns the configured key and throws when none is available', async () => {
		const plugin = starton({ key: 'test-starton-api-key' });
		const withKey = { authType: 'api_key' } as unknown as StartonContext;
		await expect(
			plugin.keyBuilder?.(withKey as never, 'endpoint'),
		).resolves.toBe('test-starton-api-key');

		const noKey = starton();
		const emptyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		} as unknown as StartonContext;
		await expect(
			noKey.keyBuilder?.(emptyCtx as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('marks write vs. read risk correctly', () => {
		const meta = starton().endpointMeta as Record<
			string,
			{ riskLevel: string } | undefined
		>;
		expect(meta['wallet.create']?.riskLevel).toBe('write');
		expect(meta['wallet.list']?.riskLevel).toBe('read');
		expect(meta['smartContract.deployFromTemplate']?.riskLevel).toBe('write');
		expect(meta['smartContract.call']?.riskLevel).toBe('write');
		expect(meta['smartContract.read']?.riskLevel).toBe('read');
		expect(meta['transaction.get']?.riskLevel).toBe('read');
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Error handling
// ─────────────────────────────────────────────────────────────────────────────

describe('error handling', () => {
	it('propagates a typed ApiError with the HTTP status preserved', async () => {
		nextResponseStatus = 401;
		nextResponseBody = {
			statusCode: 401,
			errorCode: 'NOT_AUTHENTICATED',
			message: 'Not authenticated',
		};

		const err = await makeStartonRequest('v3/kms/wallet', 'bad_key', {
			method: 'GET',
		}).catch((e) => e);

		expect(err).toBeInstanceOf(ApiError);
		expect((err as ApiError).status).toBe(401);
	});

	it('routes a 401 to AUTH_ERROR with no retries', async () => {
		nextResponseStatus = 401;
		nextResponseBody = { errorCode: 'NOT_AUTHENTICATED' };
		const err = (await makeStartonRequest('v3/kms/wallet', 'bad', {
			method: 'GET',
		}).catch((e) => e)) as Error;

		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes a 429 to RATE_LIMIT_ERROR with retries', async () => {
		nextResponseStatus = 429;
		nextResponseBody = { errorCode: 'THROTTLED' };
		const err = (await makeStartonRequest('v3/kms/wallet', 'k', {
			method: 'GET',
		}).catch((e) => e)) as Error;

		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(result.maxRetries).toBe(5);
	});

	it('routes a deterministic blockchain validation error (400) to the non-retryable handler', async () => {
		nextResponseStatus = 400;
		nextResponseBody = { errorCode: 'INSUFFICIENT_FUNDS' };
		const err = (await makeStartonRequest(
			'v3/smart-contract/polygon-mumbai/0xabc/call',
			'k',
			{ method: 'POST', body: {} },
		).catch((e) => e)) as Error;

		expect(errorHandlers.NOT_RETRYABLE_CLIENT_ERROR.match(err)).toBe(true);
		await expect(
			errorHandlers.NOT_RETRYABLE_CLIENT_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes a 5xx to SERVER_ERROR with limited retries', async () => {
		nextResponseStatus = 500;
		nextResponseBody = { errorCode: 'MICROSERVICE_NOT_RESPONDING' };
		const err = (await makeStartonRequest('v3/transaction/tx_1', 'k', {
			method: 'GET',
		}).catch((e) => e)) as Error;

		expect(errorHandlers.SERVER_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 3,
		});
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Request serialization details — what goes in the path, the query and the body
// ─────────────────────────────────────────────────────────────────────────────

const TX_FIXTURE = {
	id: 'tx_1',
	chainId: 80001,
	network: 'polygon-mumbai',
	from: '0x298',
	signerWallet: '0x298',
	status: 'PUBLISHED',
	state: 'PENDING',
	logs: [],
	value: '0',
	automaticNonce: true,
	isDeployTransaction: false,
	projectId: 'p',
	createdAt: 'x',
	updatedAt: 'x',
};

describe('request serialization', () => {
	it('Wallet.list sends no query string when no filters are supplied', async () => {
		nextResponseBody = { items: [], meta: { itemCount: 0, itemsPerPage: 100, currentPage: 0 } };
		await Wallet.list(ctx, {});

		expect(captured?.url).toBe('https://api.starton.com/v3/kms/wallet');
	});

	it('Wallet.list forwards the name and kmsId filters from the official spec', async () => {
		nextResponseBody = { items: [], meta: { itemCount: 0, itemsPerPage: 100, currentPage: 0 } };
		await Wallet.list(ctx, { name: 'Treasury', kmsId: 'kms_1' });

		expect(captured?.url).toContain('name=Treasury');
		expect(captured?.url).toContain('kmsId=kms_1');
	});

	it('SmartContract.call keeps network/address in the path and simulate in the query, never in the body', async () => {
		nextResponseBody = TX_FIXTURE;
		await SmartContract.call(ctx, {
			network: 'polygon-mumbai',
			address: '0x820f8728E32519b9C91B2406BF48AF80711aFecD',
			functionName: 'mint',
			params: ['0x298', '1'],
			signerWallet: '0x298',
			speed: 'fast',
			value: '0',
			simulate: true,
		});

		expect(captured?.url).toBe(
			'https://api.starton.com/v3/smart-contract/polygon-mumbai/0x820f8728E32519b9C91B2406BF48AF80711aFecD/call?simulate=true',
		);

		const body = JSON.parse(captured?.body ?? '{}');
		expect(body).toEqual({
			functionName: 'mint',
			params: ['0x298', '1'],
			signerWallet: '0x298',
			speed: 'fast',
			value: '0',
		});
		expect(body.network).toBeUndefined();
		expect(body.address).toBeUndefined();
		expect(body.simulate).toBeUndefined();
	});

	it('SmartContract.read sends no simulate query param (reads never broadcast)', async () => {
		nextResponseBody = {
			response: '1',
			params: [],
			functionName: 'totalSupply',
			address: '0xabc',
			network: 'polygon-mumbai',
		};
		await SmartContract.read(ctx, {
			network: 'polygon-mumbai',
			address: '0xabc',
			functionName: 'totalSupply',
			params: [],
		});

		expect(captured?.url).not.toContain('simulate');
	});

	it('percent-encodes caller-supplied path segments so they cannot escape the route', () => {
		expect(encodeStartonPathSegment('0xabc/../../v3/kms/wallet')).toBe(
			'0xabc%2F..%2F..%2Fv3%2Fkms%2Fwallet',
		);
		expect(() => encodeStartonPathSegment('.')).toThrow();
	});

	it('never puts the API key in the URL or the body', async () => {
		nextResponseBody = TX_FIXTURE;
		await Transaction.get(ctx, { id: 'tx_1' });

		expect(captured?.url).not.toContain('test-starton-api-key');
		expect(captured?.body ?? '').not.toContain('test-starton-api-key');
		expect(captured?.headers['x-api-key']).toBe('test-starton-api-key');
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Response parsing — nullable/optional fields and malformed payloads
// ─────────────────────────────────────────────────────────────────────────────

describe('response parsing', () => {
	it('accepts the nullable Wallet fields the spec marks nullable', () => {
		const parsed = StartonEndpointOutputSchemas.walletCreate.parse({
			address: '0xabc',
			providerKeyId: 'pk_1',
			kmsId: 'kms_1',
			name: null,
			description: null,
			metadata: null,
			projectId: 'p',
			createdAt: '2024-01-01T00:00:00.000Z',
			updatedAt: '2024-01-01T00:00:00.000Z',
		});
		expect(parsed.name).toBeNull();
		expect(parsed.metadata).toBeNull();
	});

	it('accepts a Transaction whose optional blockchain fields are null (not yet mined)', () => {
		const parsed = StartonEndpointOutputSchemas.transactionGet.parse({
			...TX_FIXTURE,
			blockHash: null,
			blockNumber: null,
			transactionHash: null,
			minedDate: null,
			nonce: null,
			speed: null,
			to: null,
		});
		expect(parsed.blockNumber).toBeNull();
		expect(parsed.speed).toBeNull();
	});

	it('rejects a Transaction that is missing a spec-required field', () => {
		const withoutLogs: Record<string, unknown> = { ...TX_FIXTURE };
		delete withoutLogs.logs;
		expect(
			StartonEndpointOutputSchemas.transactionGet.safeParse(withoutLogs).success,
		).toBe(false);
	});

	it('rejects a transaction status outside the official spec enum', () => {
		expect(
			StartonEndpointOutputSchemas.transactionGet.safeParse({
				...TX_FIXTURE,
				status: 'TOTALLY_MADE_UP',
			}).success,
		).toBe(false);
	});

	it('parses the deploy-from-template envelope (smartContract + transaction)', () => {
		const parsed =
			StartonEndpointOutputSchemas.smartContractDeployFromTemplate.parse({
				smartContract: {
					id: 'sc_1',
					name: 'TestToken',
					description: null,
					network: 'polygon-mumbai',
					abi: [{ type: 'function', name: 'mint' }],
					address: '0xdef',
					params: ['TestToken', 'TEST'],
					compilationDetails: null,
					creationHash: null,
					status: 'PUBLISHED',
					state: 'PENDING',
					templateId: 'ERC20_MINT_META_TRANSACTION',
					projectId: 'p',
					createdAt: 'x',
					updatedAt: 'x',
				},
				transaction: { ...TX_FIXTURE, isDeployTransaction: true },
			});
		expect(parsed.smartContract.templateId).toBe('ERC20_MINT_META_TRANSACTION');
		expect(parsed.transaction.isDeployTransaction).toBe(true);
	});

	it('parses the uiData block the spec attaches to a smart contract', () => {
		const parsed =
			StartonEndpointOutputSchemas.smartContractDeployFromTemplate.parse({
				smartContract: {
					id: 'sc_1',
					name: 'TestToken',
					network: 'polygon-mumbai',
					address: '0xdef',
					status: 'PUBLISHED',
					state: 'PENDING',
					projectId: 'p',
					createdAt: 'x',
					updatedAt: 'x',
					uiData: {
						version: '1',
						deployMethod: 'kms',
						imported: false,
						chainId: 80001,
					},
				},
				transaction: TX_FIXTURE,
			});
		expect(parsed.smartContract.uiData?.deployMethod).toBe('kms');
		expect(parsed.smartContract.uiData?.chainId).toBe(80001);
	});

	it('parses every shape the spec allows for a read response', () => {
		const base = {
			params: [],
			functionName: 'f',
			address: '0xabc',
			network: 'polygon-mumbai',
		};
		for (const response of [
			'1000',
			42,
			true,
			['a', 'b'],
			{ nested: 'value' },
		]) {
			expect(
				StartonEndpointOutputSchemas.smartContractRead.safeParse({
					...base,
					response,
				}).success,
			).toBe(true);
		}
	});

	it('parses a wallet-list page that reports the optional totals', () => {
		const parsed = StartonEndpointOutputSchemas.walletList.parse({
			items: [],
			meta: {
				itemCount: 0,
				totalItems: 120,
				itemsPerPage: 100,
				totalPages: 2,
				currentPage: 1,
			},
		});
		expect(parsed.meta.totalPages).toBe(2);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Additional API error routing
// ─────────────────────────────────────────────────────────────────────────────

describe('error routing (403 / retry-after)', () => {
	it('routes a 403 to AUTH_ERROR with no retries', async () => {
		nextResponseStatus = 403;
		nextResponseBody = { statusCode: 403, errorCode: 'FORBIDDEN' };
		const err = (await makeStartonRequest('v3/kms/wallet', 'k', {
			method: 'GET',
		}).catch((e) => e)) as Error;

		expect(err).toBeInstanceOf(ApiError);
		expect((err as ApiError).status).toBe(403);
		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
		expect(errorHandlers.NOT_RETRYABLE_CLIENT_ERROR.match(err)).toBe(false);
	});

	it('routes a 404 COULD_NOT_FIND_RESOURCE to the non-retryable handler', async () => {
		nextResponseStatus = 404;
		nextResponseBody = { statusCode: 404, errorCode: 'COULD_NOT_FIND_RESOURCE' };
		const err = (await makeStartonRequest('v3/transaction/nope', 'k', {
			method: 'GET',
		}).catch((e) => e)) as Error;

		expect((err as ApiError).status).toBe(404);
		expect(errorHandlers.NOT_RETRYABLE_CLIENT_ERROR.match(err)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(false);
	});

	it('surfaces Retry-After from a 429 as headersRetryAfterMs', async () => {
		const err = new ApiError(
			{ method: 'GET', url: 'v3/kms/wallet' },
			{ url: 'https://api.starton.com/v3/kms/wallet', ok: false, status: 429, statusText: 'Too Many Requests', body: {} },
			'Too Many Requests',
			{ retryAfter: 2000 },
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler(err)).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2000,
		});
	});

	it('matches rate limiting by message when no typed ApiError is available', async () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too Many Requests')),
		).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(new Error('Unauthorized'))).toBe(true);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});
