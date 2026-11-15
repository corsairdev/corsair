import { AuthMissingError } from 'corsair/core';
import {
	TONEDEN_OAUTH_AUTHORIZE_URL,
	TONEDEN_OAUTH_TOKEN_URL,
	toneden,
	tonedenAuthConfig,
	tonedenEndpointSchemas,
} from './index';

// The key builder only reads authType, options, keys and hub.
function keyContext(authType: 'api_key' | 'oauth_2', apiKey: string | null) {
	return {
		authType,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
			get_access_token: jest.fn().mockResolvedValue(null),
			get_integration_credentials: jest.fn().mockResolvedValue({}),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof toneden>,
	ctx: ReturnType<typeof keyContext>,
) {
	// unknown: the fake context is not a full KeyBuilderContext, and the key
	// builder only reads authType and keys.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'attachments.create',
	'attachments.delete',
	'attachments.entries',
	'attachments.entriesTotals',
	'attachments.get',
	'attachments.list',
	'attachments.listForUser',
	'attachments.unlockPlatforms',
	'attachments.unlocks',
	'attachments.unlocksTotals',
	'attachments.update',
	'campaigns.create',
	'campaigns.creativeInsights',
	'campaigns.delete',
	'campaigns.get',
	'campaigns.insights',
	'campaigns.list',
	'campaigns.update',
	'links.create',
	'links.delete',
	'links.expand',
	'links.get',
	'links.insights',
	'links.insightsOverview',
	'links.list',
	'links.listForUser',
	'links.update',
	'links.validPath',
	'offlineConversions.upload',
	'playbooks.create',
	'playbooks.delete',
	'playbooks.get',
	'playbooks.update',
	'userLists.create',
	'userLists.list',
	'userLists.updateContacts',
	'users.get',
	'users.update',
];

describe('toneden plugin definition', () => {
	const plugin = toneden();

	it('registers as toneden with oauth_2 auth and no webhooks', () => {
		expect(plugin.id).toBe('toneden');
		// ToneDen only issues user access tokens through its OAuth flow.
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares both auth types in its authConfig', () => {
		expect(Object.keys(tonedenAuthConfig).sort()).toEqual([
			'api_key',
			'oauth_2',
		]);
	});

	it('points the OAuth flow at the documented URLs', () => {
		expect(TONEDEN_OAUTH_AUTHORIZE_URL).toBe(
			'https://www.toneden.io/auth/oauth2/authorize',
		);
		expect(TONEDEN_OAUTH_TOKEN_URL).toBe(
			'https://www.toneden.io/auth/oauth2/token',
		);
	});

	it('exposes exactly the catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks the reads and writes apart', () => {
		const meta = plugin.endpointMeta ?? {};
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name)
			.sort();
		expect(reads).toEqual([
			'attachments.entries',
			'attachments.entriesTotals',
			'attachments.get',
			'attachments.list',
			'attachments.listForUser',
			'attachments.unlockPlatforms',
			'attachments.unlocks',
			'attachments.unlocksTotals',
			'campaigns.creativeInsights',
			'campaigns.get',
			'campaigns.insights',
			'campaigns.list',
			'links.expand',
			'links.get',
			'links.insights',
			'links.insightsOverview',
			'links.list',
			'links.listForUser',
			'links.validPath',
			'playbooks.get',
			'userLists.list',
			'users.get',
		]);
	});

	it('marks every delete destructive and irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const name of [
			'links.delete',
			'attachments.delete',
			'campaigns.delete',
			'playbooks.delete',
		] as const) {
			expect(meta[name]?.riskLevel).toBe('destructive');
			expect(meta[name]?.irreversible).toBe(true);
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(tonedenEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(tonedenEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('names no route twice', () => {
		const nested = Object.values(plugin.endpoints ?? {}).flatMap((group) =>
			Object.values(group),
		);
		expect(new Set(nested).size).toBe(nested.length);
	});
});

describe('toneden key builder', () => {
	it('prefers the inline key for api_key auth', async () => {
		const plugin = toneden({ authType: 'api_key', key: 'inline-token' });
		await expect(
			buildKey(plugin, keyContext('api_key', 'stored-token')),
		).resolves.toBe('inline-token');
	});

	it('falls back to the stored key for api_key auth', async () => {
		const plugin = toneden({ authType: 'api_key' });
		await expect(
			buildKey(plugin, keyContext('api_key', 'stored-token')),
		).resolves.toBe('stored-token');
	});

	it('throws AuthMissingError when an api_key account has no key', async () => {
		const plugin = toneden({ authType: 'api_key' });
		await expect(
			buildKey(plugin, keyContext('api_key', null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
