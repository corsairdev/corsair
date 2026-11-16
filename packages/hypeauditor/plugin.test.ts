import { AuthMissingError } from 'corsair/core';
import type { HypeAuditorKeyBuilderContext } from './index';
import {
	hypeauditor,
	hypeauditorAuthConfig,
	hypeauditorEndpointMeta,
	hypeauditorEndpointSchemas,
} from './index';

const OPERATIONS = [
	'reports.instagram',
	'reports.youtube',
	'reports.tiktok',
	'reports.twitch',
	'reports.twitter',
	'reports.snapchat',
	'media.instagram',
	'media.youtube',
	'media.tiktok',
	'history.instagram',
	'history.youtube',
	'history.tiktok',
	'history.twitch',
	'history.twitter',
	'mentions.youtube',
	'mentions.tiktok',
	'discovery.search',
	'discovery.keywords',
	'lists.list',
	'lists.items',
	'lists.add',
	'lists.remove',
	'account.planInfo',
	'account.unlockedReports',
	'suggester.get',
	'taxonomy.get',
] as const;

/** The shape core calls: a source of `endpoint` or `webhook`, and a key back. */
type KeyBuilder = NonNullable<ReturnType<typeof hypeauditor>['keyBuilder']>;

function flatten(endpoints: object): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members as object)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('hypeauditor plugin', () => {
	const plugin = hypeauditor();
	const metaOf = (operation: keyof typeof hypeauditorEndpointMeta) =>
		hypeauditorEndpointMeta[operation] as {
			riskLevel: string;
			irreversible?: boolean;
			description: string;
		};
	const keyBuilderOf = (candidate: { keyBuilder?: KeyBuilder }): KeyBuilder =>
		candidate.keyBuilder as KeyBuilder;

	const keyContext = (options: { clientId?: string; token?: string } = {}) =>
		// unknown: a stand-in for a context whose type brings the whole key manager.
		({
			authType: 'api_key',
			keys: {
				get_client_id: async () => options.clientId,
				get_access_token: async () => options.token,
			},
		}) as unknown as HypeAuditorKeyBuilderContext; // unknown: fixture, see above

	it('registers every operation as api.<group>.<name>', () => {
		expect(flatten(plugin.endpoints as object)).toEqual([...OPERATIONS].sort());
	});

	it('declares input and output schemas for every operation', () => {
		expect(Object.keys(hypeauditorEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const operation of OPERATIONS) {
			const entry = hypeauditorEndpointSchemas[operation];
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('declares metadata for every operation, with a real description', () => {
		expect(Object.keys(hypeauditorEndpointMeta).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const operation of OPERATIONS) {
			const entry = metaOf(operation);
			expect(entry.description.length).toBeGreaterThan(40);
			expect(entry.description).not.toMatch(/TODO|example resource/i);
		}
	});

	/**
	 * A report read and a discovery page each spend a credit on the first
	 * request. Both are writes for that reason, even though a report read is a
	 * GET and the discovery page spends only a call rather than a credit.
	 */
	it('marks the credit-spending operations as writes', () => {
		const writes = OPERATIONS.filter(
			(operation) => metaOf(operation).riskLevel === 'write',
		);
		expect(writes).toEqual([
			'reports.instagram',
			'reports.youtube',
			'reports.tiktok',
			'reports.twitch',
			'reports.twitter',
			'reports.snapchat',
			'discovery.search',
			'lists.add',
			'lists.remove',
		]);
	});

	it('marks the free reads as reads', () => {
		const reads = OPERATIONS.filter(
			(operation) => metaOf(operation).riskLevel === 'read',
		);
		expect(reads).toEqual([
			'media.instagram',
			'media.youtube',
			'media.tiktok',
			'history.instagram',
			'history.youtube',
			'history.tiktok',
			'history.twitch',
			'history.twitter',
			'mentions.youtube',
			'mentions.tiktok',
			'discovery.keywords',
			'lists.list',
			'lists.items',
			'account.planInfo',
			'account.unlockedReports',
			'suggester.get',
			'taxonomy.get',
		]);
	});

	// Nothing here deletes anything: a report can be re-read and a list entry
	// can be re-added, so no operation is irreversible.
	it('marks nothing irreversible', () => {
		for (const operation of OPERATIONS) {
			expect([operation, metaOf(operation).irreversible]).toEqual([
				operation,
				undefined,
			]);
		}
	});

	/**
	 * Both credentials are account fields. An `api_key` account only builds
	 * getters for its own `account` list, so a pair declared under `integration`
	 * would have no getter at all.
	 */
	it('declares both credentials as account fields', () => {
		expect(hypeauditorAuthConfig.api_key.account).toEqual([
			'client_id',
			'access_token',
		]);
		expect('integration' in hypeauditorAuthConfig.api_key).toBe(false);
	});

	it('offers api_key auth only, and no webhooks', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	describe('keyBuilder', () => {
		it('returns an inline API token', async () => {
			const configured = hypeauditor({ apiToken: 'inline-token' });
			await expect(
				keyBuilderOf(configured)(keyContext(), 'endpoint'),
			).resolves.toBe('inline-token');
		});

		it('falls back to the stored token', async () => {
			await expect(
				keyBuilderOf(plugin)(
					keyContext({ clientId: 'c', token: 'stored-token' }),
					'endpoint',
				),
			).resolves.toBe('stored-token');
		});

		// Failing open would send an empty header and surface the provider's
		// `Invalid token` instead of Corsair's disconnected-auth flow.
		it('throws AuthMissingError when no token is stored', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		it('throws AuthMissingError for a non-endpoint source', async () => {
			await expect(
				keyBuilderOf(plugin)(
					keyContext({ clientId: 'c', token: 't' }),
					'webhook',
				),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});
