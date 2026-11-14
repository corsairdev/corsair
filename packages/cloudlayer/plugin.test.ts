import { AuthMissingError } from 'corsair/core';
import { cloudlayer } from './index';

function keyContext(storedKey: string | null) {
	return {
		authType: 'api_key' as const,
		keys: { get_api_key: async () => storedKey },
	};
}

function buildKey(
	plugin: ReturnType<typeof cloudlayer>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

describe('cloudlayer keyBuilder', () => {
	it('returns the stored tenant key', async () => {
		await expect(
			buildKey(cloudlayer(), keyContext('stored-key')),
		).resolves.toBe('stored-key');
	});

	it('prefers the key passed in the plugin options', async () => {
		await expect(
			buildKey(cloudlayer({ key: 'option-key' }), keyContext('stored-key')),
		).resolves.toBe('option-key');
	});

	it('raises AuthMissingError when no key is stored, so core can offer a connect link', async () => {
		await expect(
			buildKey(cloudlayer(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
