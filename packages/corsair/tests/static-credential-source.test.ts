import { CORSAIR_INTERNAL } from '../core';
import { createStaticAccountKeyManager } from '../core/auth/key-manager';
import { buildCorsairClient } from '../core/client';
import type { CorsairPlugin } from '../core/plugins';

describe('createStaticAccountKeyManager', () => {
	it('returns injected api_key credentials with no db or kek', async () => {
		const km = createStaticAccountKeyManager({
			authType: 'api_key',
			credentials: { api_key: 'sekret' },
		});
		expect(await km.get_api_key()).toBe('sekret');
		expect(await km.get_webhook_signature()).toBeNull();
	});

	it('mutates in memory on set but never persists, and exposes no vault access', async () => {
		const km = createStaticAccountKeyManager({
			authType: 'api_key',
			credentials: { api_key: 'old' },
		});
		await km.set_api_key('new');
		expect(await km.get_api_key()).toBe('new');
		await expect(
			(km as { get_dek(): Promise<string> }).get_dek(),
		).rejects.toThrow(/isolated workflow child/);
	});

	it('exposes oauth_2 integration credentials from the injected map', async () => {
		const km = createStaticAccountKeyManager({
			authType: 'oauth_2',
			credentials: { access_token: 'tok' },
			integrationCredentials: { client_id: 'cid', client_secret: 'csec' },
		});
		expect(await km.get_access_token()).toBe('tok');
		const integration = await (
			km as {
				get_integration_credentials(): Promise<{
					client_id: string | null;
					client_secret: string | null;
				}>;
			}
		).get_integration_credentials();
		expect(integration.client_id).toBe('cid');
		expect(integration.client_secret).toBe('csec');
	});
});

describe('buildCorsairClient with credentialMap', () => {
	const plugin = {
		id: 'testkey',
		options: { authType: 'api_key' },
	} as unknown as CorsairPlugin;

	it('resolves a plugin credential from the map with no db or kek', async () => {
		const client = buildCorsairClient([plugin], {
			database: undefined,
			kek: undefined,
			tenantId: 't1',
			credentialMap: { testkey: { api_key: 'sekret' } },
		});

		const keys = (
			client as unknown as Record<
				string,
				{ keys: { get_api_key(): Promise<string> } }
			>
		).testkey.keys;
		expect(await keys.get_api_key()).toBe('sekret');
	});

	it('carries no internal config to leak (no kek, no database)', async () => {
		const client = buildCorsairClient([plugin], {
			database: undefined,
			kek: undefined,
			tenantId: 't1',
			credentialMap: { testkey: { api_key: 'sekret' } },
		});

		expect(
			(client as Record<symbol, unknown>)[CORSAIR_INTERNAL],
		).toBeUndefined();
	});

	it('gives a key manager (resolving to null) for a plugin absent from the map', async () => {
		const client = buildCorsairClient([plugin], {
			database: undefined,
			kek: undefined,
			tenantId: 't1',
			credentialMap: {},
		});

		const keys = (
			client as unknown as Record<
				string,
				{ keys?: { get_api_key(): Promise<string | null> } }
			>
		).testkey.keys;
		expect(keys).toBeDefined();
		expect(await keys!.get_api_key()).toBeNull();
	});
});
