import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { encodeStartonPathSegment, makeStartonRequest } from './client';
import {
	Ipfs,
	SmartContract,
	Template,
	Transaction,
	Wallet,
	Watcher,
	Webhook,
} from './endpoints';
import {
	StartonEndpointInputSchemas,
	StartonEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import {
	isNonIdempotentOperation,
	isRetryableOperation,
	NON_IDEMPOTENT_OPERATIONS,
	RETRY_SAFE_OPERATIONS,
} from './idempotency';
import type {
	InternalStartonPlugin,
	StartonContext,
	StartonKeyBuilderContext,
} from './index';
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
	formData: FormData | undefined;
};

let captured: CapturedRequest | undefined;
// Safe: the mock only serializes whatever JSON a test sets and never reads it.
// A narrower type is not practical because each test uses a different response shape.
let nextResponseBody: unknown = {};
let nextResponseStatus = 200;

const originalFetch = globalThis.fetch;

beforeEach(() => {
	captured = undefined;
	nextResponseBody = {};
	nextResponseStatus = 200;
	// Safe: fetch is only ever called as (url, init), which the stub implements.
	// A narrower type is not practical because typeof fetch also carries static members that are not worth mocking.
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
			formData: init?.body instanceof FormData ? init.body : undefined,
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

// Safe: partial stub with only the fields the endpoints read.
// A narrower type is not practical because a full context needs the database and key manager.
const ctx = {
	key: 'test-starton-api-key',
	$getAccountId: async () => 'acct_test',
	database: undefined,
	db: {},
	endpoints: {},
} as StartonContext;

// Safe: the value only reaches the endpoint under test, whose zod schema must reject or strip it at runtime.
// A narrower type is not practical because the compiler (correctly) refuses to build a value that violates the input type.
function invalidInput<T>(value: object): T {
	return value as T;
}

// Awaits a promise expected to reject and returns the thrown Error. The
// instanceof narrowing replaces an `as Error` on the caught value.
// Safe: the resolved value is discarded; only the rejection matters.
// A narrower type is not practical because callers pass promises of many different types.
async function rejectionOf(promise: Promise<unknown>): Promise<Error> {
	try {
		await promise;
	} catch (error) {
		if (error instanceof Error) return error;
		throw error;
	}
	throw new Error('expected the promise to reject');
}

// Same as rejectionOf, narrowed to ApiError so status and body are readable.
// Safe: same as rejectionOf, the resolved value is discarded.
// A narrower type is not practical because callers pass promises of many different types.
async function apiRejectionOf(promise: Promise<unknown>): Promise<ApiError> {
	const error = await rejectionOf(promise);
	if (error instanceof ApiError) return error;
	throw error;
}

// The `file` part of the last captured multipart upload.
function uploadedFile(): File | undefined {
	const file = captured?.formData?.get('file');
	return file instanceof File ? file : undefined;
}

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

	const pageMeta = {
		itemCount: 1,
		itemsPerPage: 100,
		currentPage: 0,
	};

	it('SmartContract.list -> GET /v3/smart-contract with filters', async () => {
		nextResponseBody = {
			items: [
				{
					id: 'sc_1',
					name: 'Token',
					network: 'polygon-amoy',
					address: '0xc0ffee',
					status: 'CONFIRMED',
					state: 'SUCCESS',
					projectId: 'p',
					createdAt: 'x',
					updatedAt: 'x',
				},
			],
			meta: pageMeta,
		};
		const res = await SmartContract.list(ctx, {
			network: 'polygon-amoy',
			limit: 10,
			includeAbi: true,
		});

		expect(captured?.method).toBe('GET');
		const url = new URL(captured?.url ?? '');
		expect(url.origin + url.pathname).toBe(
			'https://api.starton.com/v3/smart-contract',
		);
		expect(Object.fromEntries(url.searchParams)).toEqual({
			network: 'polygon-amoy',
			limit: '10',
			includeAbi: 'true',
		});
		expect(res.items[0]?.address).toBe('0xc0ffee');
	});

	it('Template.list -> GET /v3/smart-contract-template with filters', async () => {
		nextResponseBody = {
			items: [
				{
					id: 'ERC20_META_TRANSACTION',
					name: 'ERC20 Fungible Token',
					description: 'd',
					shortDescription: 's',
					githubUrl: 'https://github.com/starton-io',
					blockchains: ['ethereum'],
					tags: ['token'],
					category: 'FUNGIBLE',
					humanReadableAbi: ['function name() view returns (string)'],
					abi: [{ type: 'function', name: 'name' }],
					isAudited: true,
					isActivated: true,
					order: 1,
					createdAt: 'x',
					updatedAt: 'x',
				},
			],
			meta: pageMeta,
		};
		const res = await Template.list(ctx, {
			category: 'FUNGIBLE',
			isAudited: true,
		});

		expect(captured?.method).toBe('GET');
		const url = new URL(captured?.url ?? '');
		expect(url.origin + url.pathname).toBe(
			'https://api.starton.com/v3/smart-contract-template',
		);
		expect(Object.fromEntries(url.searchParams)).toEqual({
			category: 'FUNGIBLE',
			isAudited: 'true',
		});
		expect(res.items[0]?.id).toBe('ERC20_META_TRANSACTION');
	});

	it('Template.list rejects a category outside the spec enum', async () => {
		await expect(
			Template.list(
				ctx,
				invalidInput<Parameters<typeof Template.list>[1]>({
					category: 'TOKEN',
				}),
			),
		).rejects.toThrow();
		expect(captured).toBeUndefined();
	});

	const watcherBody = {
		id: 'wat_1',
		address: '0xc0ffee',
		network: 'polygon-amoy',
		projectId: 'p',
		type: 'EVENT_TRANSFER',
		triggerType: 'EVENT',
		webhookUrl: 'https://example.com/hook',
		confirmationsBlocks: 12,
		paused: false,
		createdAt: 'x',
		updatedAt: 'x',
	};

	it('Watcher.get -> GET /v3/watcher/{id}', async () => {
		nextResponseBody = watcherBody;
		const res = await Watcher.get(ctx, { id: 'wat_1' });

		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('https://api.starton.com/v3/watcher/wat_1');
		expect(res.webhookUrl).toBe('https://example.com/hook');
		expect(res.type).toBe('EVENT_TRANSFER');
	});

	it('Watcher.delete -> DELETE /v3/watcher/{id}', async () => {
		nextResponseBody = 1;
		const res = await Watcher.delete(ctx, { id: 'wat_1' });

		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe('https://api.starton.com/v3/watcher/wat_1');
		expect(captured?.body).toBeUndefined();
		expect(res).toBe(1);
	});

	it('Watcher.delete percent-encodes the id and rejects traversal', async () => {
		nextResponseBody = 1;
		await Watcher.delete(ctx, { id: 'a/b' });
		expect(captured?.url).toBe('https://api.starton.com/v3/watcher/a%2Fb');
		await expect(Watcher.delete(ctx, { id: '..' })).rejects.toThrow(
			'Invalid path segment',
		);
	});

	it('Webhook.list -> GET /v3/webhook with status filter', async () => {
		nextResponseBody = {
			items: [
				{
					id: 'whk_1',
					refId: 'wat_1',
					status: 'SUCCESSFUL',
					payload: { event: 'transfer' },
					url: 'https://example.com/hook',
					headers: null,
					attempts: [{ status: 200 }],
					projectId: 'p',
					createdAt: 'x',
					updatedAt: 'x',
				},
			],
			meta: pageMeta,
		};
		const res = await Webhook.list(ctx, { status: 'SUCCESSFUL', page: 1 });

		expect(captured?.method).toBe('GET');
		const url = new URL(captured?.url ?? '');
		expect(url.origin + url.pathname).toBe(
			'https://api.starton.com/v3/webhook',
		);
		expect(Object.fromEntries(url.searchParams)).toEqual({
			status: 'SUCCESSFUL',
			page: '1',
		});
		expect(res.items[0]?.refId).toBe('wat_1');
	});

	it('Ipfs.uploadFile -> POST /v3/ipfs/file as multipart with file and metadata', async () => {
		nextResponseBody = {
			id: 'pin_1',
			name: 'hello.txt',
			cid: 'QmHash',
			status: 'pinned',
			projectId: 'p',
			createdAt: 'x',
			updatedAt: 'x',
		};
		const res = await Ipfs.uploadFile(ctx, {
			content: Buffer.from('hello world').toString('base64'),
			filename: 'hello.txt',
			contentType: 'text/plain',
			metadata: { purpose: 'test' },
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('https://api.starton.com/v3/ipfs/file');
		expect(captured?.headers['content-type']).toBeUndefined();
		const file = captured?.formData?.get('file');
		expect(file).toBeInstanceOf(File);
		if (!(file instanceof File)) throw new Error('expected a File');
		expect(file.name).toBe('hello.txt');
		expect(file.type).toBe('text/plain');
		expect(await file.text()).toBe('hello world');
		expect(captured?.formData?.get('metadata')).toBe('{"purpose":"test"}');
		expect(res.cid).toBe('QmHash');
	});

	it('Ipfs.uploadFile omits metadata when none is given', async () => {
		nextResponseBody = {
			id: 'pin_2',
			status: 'queued',
			projectId: 'p',
			createdAt: 'x',
			updatedAt: 'x',
		};
		await Ipfs.uploadFile(ctx, {
			content: Buffer.from('x').toString('base64'),
			filename: 'x.bin',
		});

		expect(captured?.formData?.has('metadata')).toBe(false);
		expect(uploadedFile()?.type).toBe('application/octet-stream');
	});

	it('Ipfs.uploadFile rejects malformed base64 before sending', async () => {
		await expect(
			Ipfs.uploadFile(ctx, { content: 'not base64!', filename: 'x.bin' }),
		).rejects.toThrow();
		expect(captured).toBeUndefined();
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Schema coverage — every declared endpoint has an input + output schema
// ─────────────────────────────────────────────────────────────────────────────

describe('schema coverage', () => {
	const schemaKeys = Object.keys(startonEndpointSchemas);

	it('declares 12 endpoints', () => {
		expect(schemaKeys).toHaveLength(12);
		expect(schemaKeys.sort()).toEqual([
			'ipfs.uploadFile',
			'smartContract.call',
			'smartContract.deployFromTemplate',
			'smartContract.list',
			'smartContract.read',
			'template.list',
			'transaction.get',
			'wallet.create',
			'wallet.list',
			'watcher.delete',
			'watcher.get',
			'webhook.list',
		]);
	});

	it('every endpoint schema entry has an input and output schema', () => {
		// Safe: only presence is asserted, never the schema type.
		// A narrower type is not practical because the entries differ per endpoint, so there is no common schema type.
		const entries: Record<string, { input?: unknown; output?: unknown }> =
			startonEndpointSchemas;
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
			StartonEndpointInputSchemas.walletList.safeParse({
				name: 'Treasury/../x',
			}).success,
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
				uiData: {
					version: '1',
					deployMethod: 'carrier-pigeon',
					imported: false,
				},
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
		expect(parsed).toHaveProperty('someFutureField', true);
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
			'ipfs',
			'smartContract',
			'template',
			'transaction',
			'wallet',
			'watcher',
			'webhook',
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
		const plugin: InternalStartonPlugin = starton({
			key: 'test-starton-api-key',
		});
		const withKey = { authType: 'api_key' as const };
		await expect(
			// Safe: the stub holds the only field keyBuilder reads here (the configured key short-circuits).
			// A narrower type is not practical because a real key-builder context needs the key manager.
			plugin.keyBuilder?.(withKey as StartonKeyBuilderContext, 'endpoint'),
		).resolves.toBe('test-starton-api-key');

		const noKey: InternalStartonPlugin = starton();
		const emptyCtx = {
			authType: 'api_key' as const,
			options: {},
			tenantId: 'tenant_test',
			keys: {
				get_api_key: async () => null,
				get_webhook_signature: async () => null,
				get_dek: async () => 'dek',
				issue_new_dek: async () => 'dek',
			},
		};
		await expect(
			// Safe: the stub holds the only fields keyBuilder reads on this path.
			// A narrower type is not practical because a real key manager is not worth building here.
			noKey.keyBuilder?.(emptyCtx as StartonKeyBuilderContext, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('marks write vs. read risk correctly', () => {
		const meta: Record<string, { riskLevel: string } | undefined> =
			starton().endpointMeta ?? {};
		expect(meta['wallet.create']?.riskLevel).toBe('write');
		expect(meta['wallet.list']?.riskLevel).toBe('read');
		expect(meta['smartContract.deployFromTemplate']?.riskLevel).toBe('write');
		expect(meta['smartContract.call']?.riskLevel).toBe('write');
		expect(meta['smartContract.read']?.riskLevel).toBe('read');
		expect(meta['transaction.get']?.riskLevel).toBe('read');
		expect(meta['smartContract.list']?.riskLevel).toBe('read');
		expect(meta['template.list']?.riskLevel).toBe('read');
		expect(meta['watcher.get']?.riskLevel).toBe('read');
		expect(meta['webhook.list']?.riskLevel).toBe('read');
		expect(meta['watcher.delete']?.riskLevel).toBe('destructive');
		expect(meta['ipfs.uploadFile']?.riskLevel).toBe('write');
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

		const err = await rejectionOf(
			makeStartonRequest('v3/kms/wallet', 'bad_key', { method: 'GET' }),
		);

		expect(err).toBeInstanceOf(ApiError);
		expect(err).toMatchObject({ status: 401 });
	});

	it('routes a 401 to AUTH_ERROR with no retries', async () => {
		nextResponseStatus = 401;
		nextResponseBody = { errorCode: 'NOT_AUTHENTICATED' };
		const err = await rejectionOf(
			makeStartonRequest('v3/kms/wallet', 'bad', {
				method: 'GET',
			}),
		);

		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes a 429 to RATE_LIMIT_ERROR with retries', async () => {
		nextResponseStatus = 429;
		nextResponseBody = { errorCode: 'THROTTLED' };
		const err = await rejectionOf(
			makeStartonRequest('v3/kms/wallet', 'k', {
				method: 'GET',
			}),
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		// A verified retry-safe operation — the handler now fails closed without
		// one, which is covered separately below.
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			err,
			errorContext('wallet.list'),
		);
		expect(result.maxRetries).toBe(5);
	});

	it('routes a deterministic blockchain validation error (400) to the non-retryable handler', async () => {
		nextResponseStatus = 400;
		nextResponseBody = { errorCode: 'INSUFFICIENT_FUNDS' };
		const err = await rejectionOf(
			makeStartonRequest('v3/smart-contract/polygon-mumbai/0xabc/call', 'k', {
				method: 'POST',
				body: {},
			}),
		);

		expect(errorHandlers.NOT_RETRYABLE_CLIENT_ERROR.match(err)).toBe(true);
		await expect(
			errorHandlers.NOT_RETRYABLE_CLIENT_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes a 5xx to SERVER_ERROR with limited retries', async () => {
		nextResponseStatus = 500;
		nextResponseBody = { errorCode: 'MICROSERVICE_NOT_RESPONDING' };
		const err = await rejectionOf(
			makeStartonRequest('v3/transaction/tx_1', 'k', {
				method: 'GET',
			}),
		);

		expect(errorHandlers.SERVER_ERROR.match(err)).toBe(true);
		await expect(
			errorHandlers.SERVER_ERROR.handler(err, errorContext('transaction.get')),
		).resolves.toEqual({
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
		nextResponseBody = {
			items: [],
			meta: { itemCount: 0, itemsPerPage: 100, currentPage: 0 },
		};
		await Wallet.list(ctx, {});

		expect(captured?.url).toBe('https://api.starton.com/v3/kms/wallet');
	});

	it('Wallet.list forwards the name and kmsId filters from the official spec', async () => {
		nextResponseBody = {
			items: [],
			meta: { itemCount: 0, itemsPerPage: 100, currentPage: 0 },
		};
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
		// Omit the key entirely rather than setting it to undefined, so this
		// asserts a genuinely absent required field.
		const { logs: _logs, ...withoutLogs } = TX_FIXTURE;
		expect(
			StartonEndpointOutputSchemas.transactionGet.safeParse(withoutLogs)
				.success,
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
		const err = await rejectionOf(
			makeStartonRequest('v3/kms/wallet', 'k', {
				method: 'GET',
			}),
		);

		expect(err).toBeInstanceOf(ApiError);
		expect(err).toMatchObject({ status: 403 });
		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
		expect(errorHandlers.NOT_RETRYABLE_CLIENT_ERROR.match(err)).toBe(false);
	});

	it('routes a 404 COULD_NOT_FIND_RESOURCE to the non-retryable handler', async () => {
		nextResponseStatus = 404;
		nextResponseBody = {
			statusCode: 404,
			errorCode: 'COULD_NOT_FIND_RESOURCE',
		};
		const err = await rejectionOf(
			makeStartonRequest('v3/transaction/nope', 'k', {
				method: 'GET',
			}),
		);

		expect(err).toMatchObject({ status: 404 });
		expect(errorHandlers.NOT_RETRYABLE_CLIENT_ERROR.match(err)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(false);
	});

	it('surfaces Retry-After from a 429 as headersRetryAfterMs', async () => {
		const err = new ApiError(
			{ method: 'GET', url: 'v3/kms/wallet' },
			{
				url: 'https://api.starton.com/v3/kms/wallet',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 2000 },
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(err, errorContext('wallet.list')),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2000,
		});
	});

	it('matches rate limiting by message when no typed ApiError is available', async () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too Many Requests')),
		).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(new Error('Unauthorized'))).toBe(
			true,
		);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Retry safety
//
// Starton exposes no idempotency key, and Corsair can replay a failed call at
// two layers: `corsair/http` retries 429 internally, and the endpoint binder
// re-invokes the whole endpoint whenever an error handler returns
// `maxRetries > 0`. A replayed write would broadcast a second transaction, so
// both layers must stay shut for the transaction-producing operations.
// ─────────────────────────────────────────────────────────────────────────────

function errorContext(operation: string) {
	return {
		pluginId: 'starton',
		operation,
		input: {},
		originalError: new Error('test'),
	};
}

/** Count fetch attempts, optionally succeeding once the Nth attempt is reached. */
function countingFetch(status: number, succeedOnAttempt?: number) {
	let attempts = 0;
	// Safe: fetch is only ever called as (url, init), which the stub implements.
	// A narrower type is not practical because typeof fetch also carries static members that are not worth mocking.
	globalThis.fetch = (async () => {
		attempts += 1;
		const ok = succeedOnAttempt !== undefined && attempts >= succeedOnAttempt;
		return new Response(JSON.stringify(ok ? TX_FIXTURE : { errorCode: 'X' }), {
			status: ok ? 200 : status,
			statusText: ok ? 'OK' : `status ${status}`,
			headers: { 'Content-Type': 'application/json' },
		});
	}) as typeof fetch;
	return () => attempts;
}

describe('retry safety: HTTP layer (429 replay)', () => {
	it('does not replay smartContract.call — a replay would broadcast twice', async () => {
		const attempts = countingFetch(429);

		await SmartContract.call(ctx, {
			network: 'polygon-mumbai',
			address: '0xabc',
			functionName: 'mint',
			params: [],
			signerWallet: '0x298',
		}).catch(() => undefined);

		expect(attempts()).toBe(1);
	});

	it('does not replay smartContract.deployFromTemplate', async () => {
		const attempts = countingFetch(429);

		await SmartContract.deployFromTemplate(ctx, {
			network: 'polygon-mumbai',
			signerWallet: '0x298',
			templateId: 'ERC20_MINT_META_TRANSACTION',
			name: 'TestToken',
			params: [],
		}).catch(() => undefined);

		expect(attempts()).toBe(1);
	});

	it('does not replay wallet.create — a replay would provision a second wallet', async () => {
		const attempts = countingFetch(429);

		await Wallet.create(ctx, { kmsId: 'kms_1' }).catch(() => undefined);

		expect(attempts()).toBe(1);
	});

	it('still replays a rate-limited read (the flag is scoped, not a blanket off-switch)', async () => {
		const attempts = countingFetch(429, 2);

		await Transaction.get(ctx, { id: 'tx_1' }).catch(() => undefined);

		expect(attempts()).toBe(2);
	});
});

describe('retry safety: binder layer (error-handler maxRetries)', () => {
	it('withholds 5xx retries for every transaction-producing operation', async () => {
		const err = new ApiError(
			{ method: 'POST', url: 'v3/smart-contract/x/y/call' },
			{
				url: 'https://api.starton.com',
				ok: false,
				status: 502,
				statusText: 'Bad Gateway',
				body: {},
			},
			'Bad Gateway',
		);

		for (const operation of NON_IDEMPOTENT_OPERATIONS) {
			await expect(
				errorHandlers.SERVER_ERROR.handler(err, errorContext(operation)),
			).resolves.toEqual({ maxRetries: 0 });
		}
	});

	it('still retries 5xx for reads', async () => {
		const err = new ApiError(
			{ method: 'GET', url: 'v3/transaction/tx_1' },
			{
				url: 'https://api.starton.com',
				ok: false,
				status: 500,
				statusText: 'Server Error',
				body: {},
			},
			'Server Error',
		);

		for (const operation of [
			'transaction.get',
			'wallet.list',
			'smartContract.read',
		]) {
			await expect(
				errorHandlers.SERVER_ERROR.handler(err, errorContext(operation)),
			).resolves.toEqual({ maxRetries: 3 });
		}
	});

	it('withholds 429 retries for transaction-producing operations', async () => {
		const err = new ApiError(
			{ method: 'POST', url: 'v3/smart-contract/x/y/call' },
			{
				url: 'https://api.starton.com',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 1000 },
		);

		for (const operation of NON_IDEMPOTENT_OPERATIONS) {
			await expect(
				errorHandlers.RATE_LIMIT_ERROR.handler(err, errorContext(operation)),
			).resolves.toEqual({ maxRetries: 0 });
		}

		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(err, errorContext('wallet.list')),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 1000 });
	});
});

describe('idempotency classification', () => {
	it('classifies every declared operation, and only real operations', () => {
		const declared = Object.keys(startonEndpointSchemas);

		// No entry may reference an operation that does not exist — this catches a
		// rename that would silently re-enable replay on a write.
		for (const operation of NON_IDEMPOTENT_OPERATIONS) {
			expect(declared).toContain(operation);
		}

		expect(declared.filter(isNonIdempotentOperation).sort()).toEqual([
			'ipfs.uploadFile',
			'smartContract.call',
			'smartContract.deployFromTemplate',
			'wallet.create',
			'watcher.delete',
		]);
		expect(
			declared.filter((op) => !isNonIdempotentOperation(op)).sort(),
		).toEqual([
			'smartContract.list',
			'smartContract.read',
			'template.list',
			'transaction.get',
			'wallet.list',
			'watcher.get',
			'webhook.list',
		]);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Runtime response validation
//
// Corsair's endpoint binder does not validate against `endpointSchemas` — those
// feed introspection (`zodToFormSchema`) only. Each endpoint therefore parses
// the provider payload itself, so a malformed Starton response surfaces as an
// error instead of being handed back as trustworthy typed data.
// ─────────────────────────────────────────────────────────────────────────────

describe('runtime response validation', () => {
	it('rejects a transaction response missing a spec-required field', async () => {
		const { chainId: _chainId, ...incomplete } = TX_FIXTURE;
		nextResponseBody = incomplete;

		await expect(Transaction.get(ctx, { id: 'tx_1' })).rejects.toThrow();
	});

	it('rejects a transaction whose field has the wrong primitive type', async () => {
		nextResponseBody = { ...TX_FIXTURE, chainId: '80001' };

		await expect(Transaction.get(ctx, { id: 'tx_1' })).rejects.toThrow();
	});

	it('rejects a status outside the official enum rather than passing it through', async () => {
		nextResponseBody = { ...TX_FIXTURE, status: 'NOT_A_REAL_STATUS' };

		await expect(Transaction.get(ctx, { id: 'tx_1' })).rejects.toThrow();
	});

	it('rejects a wallet-list page with a malformed nested item', async () => {
		nextResponseBody = {
			items: [{ address: '0xabc' }],
			meta: { itemCount: 1, itemsPerPage: 100, currentPage: 0 },
		};

		await expect(Wallet.list(ctx, {})).rejects.toThrow();
	});

	it('rejects an entirely unexpected response shape', async () => {
		nextResponseBody = { unexpected: 'payload' };

		await expect(Wallet.create(ctx, { kmsId: 'kms_1' })).rejects.toThrow();
	});

	it('rejects a deploy envelope missing the transaction half', async () => {
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
		};

		await expect(
			SmartContract.deployFromTemplate(ctx, {
				network: 'polygon-mumbai',
				signerWallet: '0x298',
				templateId: 'ERC20_MINT_META_TRANSACTION',
				name: 'TestToken',
				params: [],
			}),
		).rejects.toThrow();
	});

	it('still accepts a valid response and preserves unknown forward-compatible fields', async () => {
		nextResponseBody = { ...TX_FIXTURE, aFutureStartonField: 'kept' };

		const result = await Transaction.get(ctx, { id: 'tx_1' });

		expect(result.id).toBe('tx_1');
		expect(result).toHaveProperty('aFutureStartonField', 'kept');
	});

	it('a malformed response is not retried (DEFAULT handler, no side-effect replay)', async () => {
		const validationError = new Error('Invalid input');

		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(errorHandlers.SERVER_ERROR.match(validationError)).toBe(false);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(validationError)).toBe(false);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Credential handling
// ─────────────────────────────────────────────────────────────────────────────

const SECRET = 'test-starton-api-key';

describe('credential secrecy', () => {
	it('sends the key only as the x-api-key header, never in the URL or body', async () => {
		nextResponseBody = TX_FIXTURE;

		await SmartContract.call(ctx, {
			network: 'polygon-mumbai',
			address: '0xabc',
			functionName: 'mint',
			params: ['1'],
			signerWallet: '0x298',
		});

		expect(captured?.headers['x-api-key']).toBe(SECRET);
		expect(captured?.url).not.toContain(SECRET);
		expect(captured?.body ?? '').not.toContain(SECRET);
		expect(captured?.headers.authorization).toBeUndefined();
	});

	it('never leaks the key into a thrown provider error', async () => {
		nextResponseStatus = 500;
		nextResponseBody = { statusCode: 500, errorCode: 'UNKNOWN' };

		const err = await rejectionOf(
			makeStartonRequest('v3/kms/wallet', SECRET, {
				method: 'GET',
			}),
		);

		// Message, and every own enumerable property (url, request, body, ...).
		const serialized = `${err.message} ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`;
		expect(serialized).not.toContain(SECRET);
	});

	it('never leaks the key into a thrown transport error', async () => {
		// Safe: fetch is only ever called as (url, init), which the stub implements.
		// A narrower type is not practical because typeof fetch also carries static members that are not worth mocking.
		globalThis.fetch = (async () => {
			throw new Error('socket hang up');
		}) as typeof fetch;

		const err = await rejectionOf(
			makeStartonRequest('v3/kms/wallet', SECRET, {
				method: 'GET',
			}),
		);

		const serialized = `${err.message} ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`;
		expect(serialized).not.toContain(SECRET);
		expect(err).toBeInstanceOf(Error);
	});

	it('keeps the provider error useful (status and error code survive)', async () => {
		nextResponseStatus = 400;
		nextResponseBody = {
			statusCode: 400,
			errorCode: 'INSUFFICIENT_FUNDS',
			message: 'Your funds are insufficient.',
		};

		const err = await apiRejectionOf(
			makeStartonRequest('v3/kms/wallet', SECRET, {
				method: 'GET',
			}),
		);

		expect(err.status).toBe(400);
		expect(JSON.stringify(err.body)).toContain('INSUFFICIENT_FUNDS');
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Fail-closed defaults
//
// Two review findings, both about defaulting to the unsafe branch:
//   1. `replayable` defaulted to true, so a future non-GET endpoint that forgot
//      `replayable: false` would be replayed after a 429.
//   2. The retry handlers only withheld retries when an ErrorContext was
//      present, so a missing or unrecognised operation fell through to
//      retrying.
// Both now default to "do not replay".
// ─────────────────────────────────────────────────────────────────────────────

describe('replayability defaults to the safe branch per HTTP method', () => {
	it('GET defaults to replayable', async () => {
		const attempts = countingFetch(429, 2);

		await makeStartonRequest('v3/transaction/tx_1', 'k', {
			method: 'GET',
		}).catch(() => undefined);

		expect(attempts()).toBe(2);
	});

	it.each(['POST', 'PUT', 'PATCH', 'DELETE'] as const)(
		'%s defaults to non-replayable even without an explicit flag',
		async (method) => {
			const attempts = countingFetch(429);

			await makeStartonRequest('v3/kms/wallet', 'k', {
				method,
				body: { kmsId: 'kms_1' },
			}).catch(() => undefined);

			expect(attempts()).toBe(1);
		},
	);

	it('an explicit replayable: true still opts a non-GET into replay', async () => {
		const attempts = countingFetch(429, 2);

		await makeStartonRequest('v3/smart-contract/n/a/read', 'k', {
			method: 'POST',
			body: {},
			replayable: true,
		}).catch(() => undefined);

		expect(attempts()).toBe(2);
	});

	it('an explicit replayable: false still overrides the GET default', async () => {
		const attempts = countingFetch(429);

		await makeStartonRequest('v3/kms/wallet', 'k', {
			method: 'GET',
			replayable: false,
		}).catch(() => undefined);

		expect(attempts()).toBe(1);
	});

	it('smartContract.read stays replayable through the endpoint', async () => {
		const attempts = countingFetch(429, 2);

		await SmartContract.read(ctx, {
			network: 'polygon-mumbai',
			address: '0xabc',
			functionName: 'balanceOf',
			params: [],
		}).catch(() => undefined);

		expect(attempts()).toBe(2);
	});
});

describe('retry decision fails closed without a verified operation', () => {
	const rateLimited = new ApiError(
		{ method: 'POST', url: 'v3/smart-contract/x/y/call' },
		{
			url: 'https://api.starton.com',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: {},
		},
		'Too Many Requests',
		{ retryAfter: 1000 },
	);
	const serverError = new ApiError(
		{ method: 'POST', url: 'v3/smart-contract/x/y/call' },
		{
			url: 'https://api.starton.com',
			ok: false,
			status: 503,
			statusText: 'Service Unavailable',
			body: {},
		},
		'Service Unavailable',
	);

	it('withholds retries on both paths when context is absent', async () => {
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			errorHandlers.SERVER_ERROR.handler(serverError),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('withholds retries on both paths for an unrecognised operation', async () => {
		const unmapped = errorContext('starton.someFutureOperation');

		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited, unmapped),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			errorHandlers.SERVER_ERROR.handler(serverError, unmapped),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('still grants the documented limits to verified-safe operations', async () => {
		for (const operation of RETRY_SAFE_OPERATIONS) {
			await expect(
				errorHandlers.RATE_LIMIT_ERROR.handler(
					rateLimited,
					errorContext(operation),
				),
			).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 1000 });
			await expect(
				errorHandlers.SERVER_ERROR.handler(
					serverError,
					errorContext(operation),
				),
			).resolves.toEqual({ maxRetries: 3 });
		}
	});

	it('the two classifications partition every declared operation exactly', () => {
		const declared = Object.keys(startonEndpointSchemas);

		// Nothing unclassified (would fail closed at runtime) and nothing in both.
		for (const operation of declared) {
			expect(
				isRetryableOperation(operation) !== isNonIdempotentOperation(operation),
			).toBe(true);
		}
		expect(
			[...RETRY_SAFE_OPERATIONS, ...NON_IDEMPOTENT_OPERATIONS].sort(),
		).toEqual(declared.sort());
		expect(isRetryableOperation(undefined)).toBe(false);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Runtime input validation
//
// Corsair's binder does not validate against `endpointSchemas` (they feed
// introspection only), so each endpoint parses its own input. That rejects bad
// arguments before any network call, applies the schema defaults, and — because
// `z.object()` strips unknown keys — keeps caller-supplied extras out of the
// request body and query string.
// ─────────────────────────────────────────────────────────────────────────────

describe('runtime input validation', () => {
	it('rejects a missing required field without issuing a request', async () => {
		const attempts = countingFetch(200);

		await expect(
			Wallet.create(ctx, invalidInput<Parameters<typeof Wallet.create>[1]>({})),
		).rejects.toThrow();
		expect(attempts()).toBe(0);
	});

	it('rejects a wrong-typed field without issuing a request', async () => {
		const attempts = countingFetch(200);

		await expect(
			Wallet.list(
				ctx,
				invalidInput<Parameters<typeof Wallet.list>[1]>({
					limit: 'twenty',
				}),
			),
		).rejects.toThrow();
		expect(attempts()).toBe(0);
	});

	it('enforces the spec pagination ceiling before the request', async () => {
		const attempts = countingFetch(200);

		await expect(Wallet.list(ctx, { limit: 2501 })).rejects.toThrow();
		expect(attempts()).toBe(0);
	});

	it('strips unknown keys out of a POST body', async () => {
		nextResponseBody = {
			address: '0xabc',
			providerKeyId: 'pk_1',
			kmsId: 'kms_1',
			projectId: 'p',
			createdAt: 'x',
			updatedAt: 'x',
		};

		await Wallet.create(
			ctx,
			invalidInput<Parameters<typeof Wallet.create>[1]>({
				kmsId: 'kms_1',
				name: 'Treasury',
				// Not part of CreateWalletDto — must not be forwarded to Starton.
				internalNote: 'do not send me',
			}),
		);

		const body = JSON.parse(captured?.body ?? '{}');
		expect(body).toEqual({ kmsId: 'kms_1', name: 'Treasury' });
		expect(captured?.body).not.toContain('do not send me');
	});

	it('strips unknown keys out of a query string', async () => {
		nextResponseBody = {
			items: [],
			meta: { itemCount: 0, itemsPerPage: 100, currentPage: 0 },
		};

		await Wallet.list(
			ctx,
			invalidInput<Parameters<typeof Wallet.list>[1]>({
				limit: 5,
				secretFilter: 'leak',
			}),
		);

		expect(captured?.url).toContain('limit=5');
		expect(captured?.url).not.toContain('secretFilter');
		expect(captured?.url).not.toContain('leak');
	});

	it('applies the schema default for `params` rather than omitting it', async () => {
		nextResponseBody = {
			response: '1',
			params: [],
			functionName: 'totalSupply',
			address: '0xabc',
			network: 'polygon-mumbai',
		};

		await SmartContract.read(
			ctx,
			invalidInput<Parameters<typeof SmartContract.read>[1]>({
				network: 'polygon-mumbai',
				address: '0xabc',
				functionName: 'totalSupply',
			}),
		);

		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			functionName: 'totalSupply',
			params: [],
		});
	});

	it('keeps path/query fields out of the smartContract.call body after parsing', async () => {
		nextResponseBody = TX_FIXTURE;

		await SmartContract.call(
			ctx,
			invalidInput<Parameters<typeof SmartContract.call>[1]>({
				network: 'polygon-mumbai',
				address: '0xabc',
				functionName: 'mint',
				params: ['1'],
				signerWallet: '0x298',
				simulate: true,
				bogus: 'nope',
			}),
		);

		const body = JSON.parse(captured?.body ?? '{}');
		expect(body).toEqual({
			functionName: 'mint',
			params: ['1'],
			signerWallet: '0x298',
		});
		expect(captured?.url).toContain('simulate=true');
		expect(captured?.body).not.toContain('bogus');
	});

	it('a validation failure is not retried (no side-effect replay)', async () => {
		const zodish = new Error('Invalid input');

		expect(errorHandlers.SERVER_ERROR.match(zodish)).toBe(false);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(zodish)).toBe(false);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
