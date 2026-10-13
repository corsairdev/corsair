import {
	Ipfs,
	SmartContract,
	Template,
	Transaction,
	Wallet,
	Watcher,
	Webhook,
} from './endpoints';
import type { StartonContext } from './index';

const STAMP = '2024-01-01T00:00:00.000Z';
const META = { itemCount: 1, itemsPerPage: 20, currentPage: 0 };

const WALLET = {
	address: '0xabc',
	providerKeyId: 'pk_1',
	kmsId: 'kms_1',
	projectId: 'p',
	createdAt: STAMP,
	updatedAt: STAMP,
};
const CONTRACT = {
	id: 'sc_1',
	name: 'Token',
	network: 'polygon-mumbai',
	address: '0xdef',
	status: 'PUBLISHED',
	state: 'PENDING',
	projectId: 'p',
	createdAt: STAMP,
	updatedAt: STAMP,
};
const TX = {
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
	createdAt: STAMP,
	updatedAt: STAMP,
};
const TEMPLATE = {
	id: 'ERC20',
	name: 'ERC20',
	description: 'd',
	shortDescription: 's',
	githubUrl: 'https://github.com/x',
	blockchains: ['polygon-mumbai'],
	tags: [],
	category: 'FUNGIBLE',
	humanReadableAbi: [],
	abi: [],
	isAudited: true,
	isActivated: true,
	order: 1,
	createdAt: STAMP,
	updatedAt: STAMP,
};
const WATCHER = {
	id: 'w_1',
	address: '0xabc',
	network: 'polygon-mumbai',
	projectId: 'p',
	type: 'ADDRESS_ACTIVITY',
	triggerType: 'TRANSACTION',
	webhookUrl: 'https://example.com/hook',
	confirmationsBlocks: 1,
	paused: false,
	createdAt: STAMP,
	updatedAt: STAMP,
};
const WEBHOOK = {
	id: 'wh_1',
	refId: 'w_1',
	status: 'SUCCESSFUL',
	payload: null,
	url: 'https://example.com/hook',
	headers: null,
	attempts: [],
	projectId: 'p',
	createdAt: STAMP,
	updatedAt: STAMP,
};
const PIN = {
	id: 'pin_1',
	cid: 'Qm1',
	status: 'pinned',
	projectId: 'p',
	createdAt: STAMP,
	updatedAt: STAMP,
};

const ENTITIES = [
	'wallets',
	'smartContracts',
	'transactions',
	'templates',
	'watchers',
	'webhooks',
	'pins',
] as const;

type Stores = Record<
	(typeof ENTITIES)[number],
	{ upsertByEntityId: jest.Mock }
>;

function makeStores(failWith?: Error): Stores {
	const make = () => ({
		upsertByEntityId: failWith
			? jest.fn().mockRejectedValue(failWith)
			: jest.fn().mockResolvedValue(undefined),
	});
	return {
		wallets: make(),
		smartContracts: make(),
		transactions: make(),
		templates: make(),
		watchers: make(),
		webhooks: make(),
		pins: make(),
	};
}

function ctxWith(stores: Stores): StartonContext {
	// Safe: test-only partial stub holding just the fields the endpoints read.
	// A narrower type is not practical because a full context needs the database
	// and key manager, which these tests do not exercise.
	const ctx = {
		key: 'test-starton-api-key',
		$getAccountId: async () => 'acct_test',
		database: undefined,
		db: {},
		endpoints: {},
	} as StartonContext;
	// Object.assign takes the mock stores without a type assertion on the context.
	Object.assign(ctx.db, stores);
	return ctx;
}

const originalFetch = globalThis.fetch;
function respondWith(body: object | number) {
	// Safe: fetch is only ever called as (url, init), which the stub implements.
	// A narrower type is not practical because typeof fetch also carries static members that are not worth mocking.
	globalThis.fetch = (async () =>
		new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})) as typeof fetch;
}
afterEach(() => {
	globalThis.fetch = originalFetch;
	jest.restoreAllMocks();
});

describe('database persistence', () => {
	it('Wallet.create upserts the wallet keyed by address', async () => {
		const stores = makeStores();
		respondWith(WALLET);
		await Wallet.create(ctxWith(stores), { kmsId: 'kms_1' });
		expect(stores.wallets.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(stores.wallets.upsertByEntityId).toHaveBeenCalledWith(
			'0xabc',
			WALLET,
		);
	});

	it('Wallet.list upserts every wallet', async () => {
		const stores = makeStores();
		respondWith({
			items: [WALLET, { ...WALLET, address: '0xdef' }],
			meta: META,
		});
		await Wallet.list(ctxWith(stores), {});
		expect(stores.wallets.upsertByEntityId.mock.calls.map((c) => c[0])).toEqual(
			['0xabc', '0xdef'],
		);
	});

	it('SmartContract.deployFromTemplate upserts the contract and its transaction', async () => {
		const stores = makeStores();
		respondWith({ smartContract: CONTRACT, transaction: TX });
		await SmartContract.deployFromTemplate(ctxWith(stores), {
			network: 'polygon-mumbai',
			signerWallet: '0x298e760768c8481780397eE28A127eAd584df4ee',
			templateId: 'ERC20',
			name: 'Token',
			params: [],
		});
		expect(stores.smartContracts.upsertByEntityId).toHaveBeenCalledWith(
			'sc_1',
			CONTRACT,
		);
		expect(stores.transactions.upsertByEntityId).toHaveBeenCalledWith(
			'tx_1',
			TX,
		);
	});

	it('SmartContract.call upserts the transaction', async () => {
		const stores = makeStores();
		respondWith(TX);
		await SmartContract.call(ctxWith(stores), {
			network: 'polygon-mumbai',
			address: '0xdef',
			signerWallet: '0x298e760768c8481780397eE28A127eAd584df4ee',
			functionName: 'mint',
			params: [],
		});
		expect(stores.transactions.upsertByEntityId).toHaveBeenCalledWith(
			'tx_1',
			TX,
		);
	});

	it('SmartContract.list upserts every contract', async () => {
		const stores = makeStores();
		respondWith({ items: [CONTRACT], meta: META });
		await SmartContract.list(ctxWith(stores), {});
		expect(stores.smartContracts.upsertByEntityId).toHaveBeenCalledWith(
			'sc_1',
			CONTRACT,
		);
	});

	it('Template.list upserts every template', async () => {
		const stores = makeStores();
		respondWith({ items: [TEMPLATE], meta: META });
		await Template.list(ctxWith(stores), {});
		expect(stores.templates.upsertByEntityId).toHaveBeenCalledWith(
			'ERC20',
			TEMPLATE,
		);
	});

	it('Transaction.get upserts the transaction', async () => {
		const stores = makeStores();
		respondWith(TX);
		await Transaction.get(ctxWith(stores), { id: 'tx_1' });
		expect(stores.transactions.upsertByEntityId).toHaveBeenCalledWith(
			'tx_1',
			TX,
		);
	});

	it('Watcher.get upserts the watcher', async () => {
		const stores = makeStores();
		respondWith(WATCHER);
		await Watcher.get(ctxWith(stores), { id: 'w_1' });
		expect(stores.watchers.upsertByEntityId).toHaveBeenCalledWith(
			'w_1',
			WATCHER,
		);
	});

	it('Webhook.list upserts every delivery', async () => {
		const stores = makeStores();
		respondWith({ items: [WEBHOOK], meta: META });
		await Webhook.list(ctxWith(stores), {});
		expect(stores.webhooks.upsertByEntityId).toHaveBeenCalledWith(
			'wh_1',
			WEBHOOK,
		);
	});

	it('Ipfs.uploadFile upserts the pin', async () => {
		const stores = makeStores();
		respondWith(PIN);
		await Ipfs.uploadFile(ctxWith(stores), {
			content: Buffer.from('hi').toString('base64'),
			filename: 'hi.txt',
		});
		expect(stores.pins.upsertByEntityId).toHaveBeenCalledWith('pin_1', PIN);
	});

	it('Watcher.delete removes the saved watcher', async () => {
		const stores = makeStores();
		const deleteByEntityId = jest.fn().mockResolvedValue(true);
		Object.assign(stores.watchers, { deleteByEntityId });
		respondWith(1);
		await Watcher.delete(ctxWith(stores), { id: 'w_1' });
		expect(deleteByEntityId).toHaveBeenCalledWith('w_1');
	});

	it('nested customGas and uiData drop undocumented keys before the request', async () => {
		const stores = makeStores();
		let sent = '';
		// Safe: fetch is only ever called as (url, init), which the stub implements.
		// A narrower type is not practical because typeof fetch also carries static members that are not worth mocking.
		globalThis.fetch = (async (_url: string | URL, init?: RequestInit) => {
			sent = typeof init?.body === 'string' ? init.body : '';
			return new Response(
				JSON.stringify({ smartContract: CONTRACT, transaction: TX }),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}) as typeof fetch;
		// Variables, not literals, so the compiler's excess-property check does not
		// reject the undocumented keys this test sends on purpose.
		const customGas = { gasPrice: '1', extra: 'x' };
		const uiData = {
			version: '1' as const,
			deployMethod: 'kms' as const,
			imported: false,
			extra: 'x',
		};
		await SmartContract.deployFromTemplate(ctxWith(stores), {
			network: 'polygon-mumbai',
			signerWallet: '0x298e760768c8481780397eE28A127eAd584df4ee',
			templateId: 'ERC20',
			name: 'Token',
			params: [],
			customGas,
			uiData,
		});
		const body = JSON.parse(sent);
		expect(body.customGas).toEqual({ gasPrice: '1' });
		expect(body.uiData).toEqual({
			version: '1',
			deployMethod: 'kms',
			imported: false,
		});
	});

	it('a database failure does not fail the API call', async () => {
		const stores = makeStores(new Error('db down'));
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		respondWith(WALLET);
		const wallet = await Wallet.create(ctxWith(stores), { kmsId: 'kms_1' });
		expect(wallet.address).toBe('0xabc');
		expect(warn).toHaveBeenCalledTimes(1);
	});
});
