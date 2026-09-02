import type { AccountKeyManagerFor } from 'corsair/core';
import type { appveyorAuthConfig } from './index';
import { appveyor, appveyorEndpointSchemas } from './index';

function endpointPaths(value: unknown, prefix = ''): string[] {
	if (typeof value === 'function') return [prefix];
	if (!value || typeof value !== 'object') return [];
	return Object.entries(value).flatMap(([key, child]) =>
		endpointPaths(child, prefix ? `${prefix}.${key}` : key),
	);
}

type ApiKeyManager = AccountKeyManagerFor<'api_key', typeof appveyorAuthConfig>;

describe('AppVeyor plugin', () => {
	it('exposes every configured operation without webhooks', () => {
		const plugin = appveyor({ key: 'test-key' });
		const paths = endpointPaths(plugin.endpoints).sort();
		const schemaPaths = Object.keys(appveyorEndpointSchemas).sort();

		expect(paths).toHaveLength(14);
		expect(paths).toEqual(schemaPaths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.webhookSchemas).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
	});

	it('uses API-key authentication and validates endpoint metadata', () => {
		const plugin = appveyor();
		expect(plugin.id).toBe('appveyor');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: { account: [] } });
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(14);
	});

	it('rejects missing endpoint credentials', async () => {
		const plugin = appveyor();
		const keys: ApiKeyManager = {
			get_api_key: async () => null,
			set_api_key: async () => {},
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => {},
			get_dek: async () => 'test-dek',
			issue_new_dek: async () => 'test-dek',
		};
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys,
					tenantId: 'test-tenant',
				},
				'endpoint',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError', pluginId: 'appveyor' });
	});
});
