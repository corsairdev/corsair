import { AuthMissingError } from 'corsair/core';
import type { WakaTimeKeyBuilderContext, WakaTimePluginOptions } from './index';
import { wakatime } from './index';

/** Stub account key manager backed by a single in-memory api key. */
function stubKeys(apiKey: string | null): WakaTimeKeyBuilderContext['keys'] {
	return {
		get_dek: async () => 'test-dek',
		issue_new_dek: async () => 'test-dek',
		get_api_key: async () => apiKey,
		set_api_key: async () => undefined,
		get_webhook_signature: async () => null,
		set_webhook_signature: async () => undefined,
	};
}

function stubCtx(
	apiKey: string | null,
	options: WakaTimePluginOptions = {},
): WakaTimeKeyBuilderContext {
	return {
		authType: 'api_key',
		options,
		keys: stubKeys(apiKey),
		tenantId: 'default',
	};
}

async function resolveKey(
	plugin: ReturnType<typeof wakatime>,
	ctx: WakaTimeKeyBuilderContext,
): Promise<string> {
	const build = plugin.keyBuilder;
	if (!build) {
		throw new Error('wakatime plugin must define keyBuilder');
	}
	return build(ctx, 'endpoint');
}

describe('wakatime keyBuilder authentication', () => {
	const plugin = wakatime();

	it('throws AuthMissingError when the keystore has no api key', async () => {
		await expect(resolveKey(plugin, stubCtx(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('throws AuthMissingError when the stored api key is an empty string', async () => {
		await expect(resolveKey(plugin, stubCtx(''))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('identifies the wakatime plugin and api_key auth in the error', async () => {
		await expect(resolveKey(plugin, stubCtx(null))).rejects.toMatchObject({
			pluginId: 'wakatime',
			authType: 'api_key',
		});
	});

	it('returns the stored api key when present', async () => {
		await expect(resolveKey(plugin, stubCtx('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('prefers options.key over the keystore', async () => {
		const withKey = wakatime({ key: 'option-key' });
		await expect(
			resolveKey(withKey, stubCtx(null, { key: 'option-key' })),
		).resolves.toBe('option-key');
	});
});
