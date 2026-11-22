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
				get_api_key: async () => options.token,
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
	 * Only the list edits change anything. A report read and a discovery page
	 * spend a credit on the first request, but they only return data, and
	 * metered reads stay `read` (R8, as in the Ahrefs plugin).
	 */
	it('marks only the list edits as writes', () => {
		const writes = OPERATIONS.filter(
			(operation) => metaOf(operation).riskLevel === 'write',
		);
		expect(writes).toEqual(['lists.add', 'lists.remove']);
	});

	it('says which reads spend credits', () => {
		for (const operation of OPERATIONS.filter((o) =>
			o.startsWith('reports.'),
		)) {
			expect(metaOf(operation).description).toMatch(/spends a credit/);
		}
		expect(metaOf('discovery.search').description).toMatch(/costs one/);
	});

	it('marks everything else as reads', () => {
		const reads = OPERATIONS.filter(
			(operation) => metaOf(operation).riskLevel === 'read',
		);
		expect(reads).toEqual([
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
	 * The token is the account's base `api_key` field, which every api_key
	 * account has; the Client ID is the one extra account field.
	 */
	it('adds the Client ID as the only extra account field', () => {
		expect(hypeauditorAuthConfig.api_key.account).toEqual(['client_id']);
		expect('integration' in hypeauditorAuthConfig.api_key).toBe(false);
	});

	it('offers api_key auth only, and no webhooks', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	describe('keyBuilder', () => {
		it('packs the stored Client ID and token into one key', async () => {
			await expect(
				keyBuilderOf(plugin)(
					keyContext({ clientId: '123', token: 'stored-token' }),
					'endpoint',
				),
			).resolves.toBe('123:stored-token');
		});

		it('throws AuthMissingError when the Client ID is missing', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext({ token: 't' }), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
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
