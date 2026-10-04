import { AuthMissingError } from 'corsair/core';
import type { TogglKeyBuilderContext, TogglPluginOptions } from './index';
import { toggl } from './index';

/** Stub key manager: keyBuilder only reads get_api_key. */
function stubCtx(
	apiKey: string | null,
	options: TogglPluginOptions = {},
): TogglKeyBuilderContext {
	const ignoreSetter = async (): Promise<void> => undefined;
	return {
		authType: 'api_key',
		options,
		keys: {
			get_dek: async () => 'test-dek',
			issue_new_dek: async () => 'test-dek',
			get_api_key: async () => apiKey,
			set_api_key: ignoreSetter,
			get_webhook_signature: async () => null,
			set_webhook_signature: ignoreSetter,
		},
		tenantId: 'default',
	};
}

/**
 * Invokes keyBuilder with a TogglKeyBuilderContext. The plugin is pinned to
 * TogglPluginOptions so the callback accepts that context.
 */
async function resolveKey(
	plugin: ReturnType<typeof toggl<TogglPluginOptions>>,
	ctx: TogglKeyBuilderContext,
): Promise<string> {
	const build = plugin.keyBuilder;
	if (!build) {
		throw new Error('toggl plugin must define keyBuilder');
	}
	return Promise.resolve(build(ctx, 'endpoint'));
}

describe('toggl keyBuilder authentication', () => {
	const plugin = toggl<TogglPluginOptions>();

	it('throws AuthMissingError when no api key is stored', async () => {
		await expect(resolveKey(plugin, stubCtx(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('throws AuthMissingError when the stored api key is empty', async () => {
		await expect(resolveKey(plugin, stubCtx(''))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('reports toggl / api_key on the thrown error', async () => {
		await expect(resolveKey(plugin, stubCtx(null))).rejects.toMatchObject({
			pluginId: 'toggl',
			authType: 'api_key',
		});
	});

	it('returns the stored api key', async () => {
		await expect(resolveKey(plugin, stubCtx('stored-token'))).resolves.toBe(
			'stored-token',
		);
	});

	it('returns options.key without reading the key manager', async () => {
		let reads = 0;
		const ctx = stubCtx(null);
		ctx.keys.get_api_key = async () => {
			reads += 1;
			return null;
		};
		const withKey = toggl<TogglPluginOptions>({ key: 'option-token' });
		await expect(resolveKey(withKey, ctx)).resolves.toBe('option-token');
		expect(reads).toBe(0);
	});
});
