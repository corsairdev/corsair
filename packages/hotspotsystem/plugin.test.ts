import { AuthMissingError } from 'corsair/core';
import type { HotspotSystemKeyBuilderContext } from './index';
import {
	hotspotsystem,
	hotspotsystemEndpointMeta,
	hotspotsystemEndpointSchemas,
} from './index';

const OPERATIONS = [
	'ping.check',
	'me.get',
	'locations.list',
	'locations.options',
	'locations.customers',
	'locations.subscribers',
	'locations.vouchers',
	'locations.paidTransactions',
	'locations.voucherTransactions',
	'locations.socialTransactions',
	'locations.macTransactions',
	'customers.list',
	'subscribers.list',
	'vouchers.list',
	'transactions.paid',
	'transactions.voucher',
	'transactions.social',
	'transactions.mac',
] as const;

/** The shape core calls: a source of `endpoint` or `webhook`, and a key back. */
type KeyBuilder = NonNullable<ReturnType<typeof hotspotsystem>['keyBuilder']>;

function flatten(endpoints: object): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members as object)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('hotspotsystem plugin', () => {
	const plugin = hotspotsystem();
	// The literal's own type omits `irreversible` on entries that do not set it,
	// so each entry is read through the contract core uses.
	const metaOf = (operation: keyof typeof hotspotsystemEndpointMeta) =>
		hotspotsystemEndpointMeta[operation] as {
			riskLevel: string;
			irreversible?: boolean;
			description: string;
		};
	const keyBuilderOf = (candidate: { keyBuilder?: KeyBuilder }): KeyBuilder =>
		candidate.keyBuilder as KeyBuilder;

	// A fixture only implements `get_api_key`, while the real context carries a
	// full AccountKeyManager. The keyBuilder reads nothing else.
	const keyContext = (key?: string) =>
		// unknown: a stand-in for a context whose type brings the whole key manager.
		({
			authType: 'api_key',
			keys: { get_api_key: async () => key },
		}) as unknown as HotspotSystemKeyBuilderContext;

	it('registers every operation as api.<group>.<name>', () => {
		expect(flatten(plugin.endpoints as object)).toEqual([...OPERATIONS].sort());
	});

	it('declares input and output schemas for every operation', () => {
		expect(Object.keys(hotspotsystemEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const operation of OPERATIONS) {
			const entry = hotspotsystemEndpointSchemas[operation];
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('declares metadata for every operation, with a real description', () => {
		expect(Object.keys(hotspotsystemEndpointMeta).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const operation of OPERATIONS) {
			const entry = metaOf(operation);
			expect(entry.description.length).toBeGreaterThan(40);
			expect(entry.description).not.toMatch(/TODO|example resource/i);
		}
	});

	// The documented API is read-only: 18 GETs and no write of any kind. If a
	// later version adds one, this test is where it gets noticed.
	it('marks every operation read-only', () => {
		for (const operation of OPERATIONS) {
			expect([operation, metaOf(operation).riskLevel]).toEqual([
				operation,
				'read',
			]);
		}
	});

	it('offers api_key auth only, and no webhooks', () => {
		// The provider documents no inbound deliveries, so registering a route
		// would offer a webhook URL that never receives anything.
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	describe('keyBuilder', () => {
		it('returns the explicitly configured key', async () => {
			const configured = hotspotsystem({ key: 'inline-key' });
			await expect(
				keyBuilderOf(configured)(keyContext(), 'endpoint'),
			).resolves.toBe('inline-key');
		});

		it('falls back to the stored key', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'endpoint'),
			).resolves.toBe('stored-key');
		});

		// Failing open would send an empty `sn-apikey` header and surface the
		// provider's `Invalid authentication!` instead of Corsair's
		// disconnected-auth flow.
		it('throws AuthMissingError when no key is available', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		it('throws AuthMissingError for a non-endpoint source', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'webhook'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});
