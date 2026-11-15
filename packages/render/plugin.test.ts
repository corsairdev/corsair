import type { RenderKeyBuilderContext } from './index';
import { render, renderAuthConfig } from './index';

// keyBuilder only reads authType and keys.get_api_key, so these stubs stand in
// for the full key builder context; anything else it touched would be
// undefined and fail the test.
const keyContext = (apiKey: string | null) =>
	({
		authType: 'api_key',
		keys: { get_api_key: async () => apiKey },
	}) as RenderKeyBuilderContext;

describe('Render plugin auth', () => {
	it('needs only the API key, so a stored key makes the connection ready', () => {
		// Any extra account field would be required by core auth status and keep
		// a valid key at `partial`; keyBuilder only ever reads the API key.
		expect(renderAuthConfig).toEqual({ api_key: { account: [] } });
		expect(render().authConfig).toBe(renderAuthConfig);
	});

	it('resolves the stored API key for endpoint calls', async () => {
		const plugin = render();
		const key = await plugin.keyBuilder?.(keyContext('rnd_stored'), 'endpoint');
		expect(key).toBe('rnd_stored');
	});

	it('fails clearly when no API key is stored', async () => {
		const plugin = render();
		await expect(
			plugin.keyBuilder?.(keyContext(null), 'endpoint'),
		).rejects.toThrow();
	});
});
