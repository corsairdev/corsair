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

async function resolveKey(
	plugin: ReturnType<typeof toggl>,
	ctx: TogglKeyBuilderContext,
): Promise<string> {
	const build = plugin.keyBuilder;
	if (!build) {
		throw new Error('toggl plugin must define keyBuilder');
	}
	return build(ctx, 'endpoint');
}

describe('toggl keyBuilder authentication', () => {
	const plugin = toggl();

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
		const err: unknown = await resolveKey(plugin, stubCtx(null)).catch(
			(e: unknown) => e,
		);
		expect(err).toBeInstanceOf(AuthMissingError);
		if (!(err instanceof AuthMissingError)) {
			throw new Error('expected AuthMissingError');
		}
		expect(err.pluginId).toBe('toggl');
		expect(err.authType).toBe('api_key');
	});

	it('returns the stored api key', async () => {
		await expect(resolveKey(plugin, stubCtx('stored-token'))).resolves.toBe(
			'stored-token',
		);
	});

	it('returns options.key without reading the key manager', async () => {
		const withKey = toggl({ key: 'option-token' });
		await expect(resolveKey(withKey, stubCtx(null))).resolves.toBe(
			'option-token',
		);
	});
});
