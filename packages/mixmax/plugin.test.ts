import type { MixmaxKeyBuilderContext } from './index';
import { mixmax, mixmaxAuthConfig } from './index';

const keyContext = (apiKey: string | null) =>
	({
		authType: 'api_key',
		keys: { get_api_key: async () => apiKey },
	}) as MixmaxKeyBuilderContext;

describe('Mixmax plugin auth', () => {
	it('uses api_key auth by default', () => {
		expect(mixmaxAuthConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
			oauth_2: { account: ['tenant_external_id'] },
		});
		expect(mixmax().authConfig).toBe(mixmaxAuthConfig);
	});

	it('resolves the stored API key for endpoint calls', async () => {
		const plugin = mixmax();
		const key = await plugin.keyBuilder?.(keyContext('mx_test_key'), 'endpoint');
		expect(key).toBe('mx_test_key');
	});

	it('fails clearly when no API key is stored', async () => {
		const plugin = mixmax();
		await expect(
			plugin.keyBuilder?.(keyContext(null), 'endpoint'),
		).rejects.toThrow();
	});
});