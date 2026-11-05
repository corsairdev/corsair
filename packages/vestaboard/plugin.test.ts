import { AuthMissingError } from 'corsair/core';
import { packVestaboardCredentials } from './client';
import { vestaboard } from './index';

// unknown: the tests pass a hand-built context holding only `keys`, not the
// full KeyBuilderContext the plugin's own types expect.
type KeyBuilder = (ctx: unknown, source: string) => Promise<string>;

function keyBuilder(): KeyBuilder {
	const plugin = vestaboard();
	if (typeof plugin.keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	// Safe: the plugin's keyBuilder reads only `authType` and `keys`, which
	// `stored()` provides.
	return plugin.keyBuilder as KeyBuilder;
}

function stored(apiKey: string | null, apiSecret: string | null) {
	return {
		authType: 'api_key',
		keys: {
			get_api_key: async () => apiKey,
			get_api_secret: async () => apiSecret,
		},
	};
}

describe('vestaboard keyBuilder', () => {
	it('packs a key and secret stored in their own fields', async () => {
		await expect(keyBuilder()(stored('k', 's'), 'endpoint')).resolves.toBe(
			packVestaboardCredentials('k', 's'),
		);
	});

	it('takes key:secret from the key field when no secret is stored', async () => {
		await expect(keyBuilder()(stored('k:s', null), 'endpoint')).resolves.toBe(
			packVestaboardCredentials('k', 's'),
		);
	});

	it('keeps later colons in the secret', async () => {
		await expect(
			keyBuilder()(stored('k:s:more', null), 'endpoint'),
		).resolves.toBe(packVestaboardCredentials('k', 's:more'));
	});

	it('keeps a stored secret over a colon in the key', async () => {
		await expect(keyBuilder()(stored('k:x', 's'), 'endpoint')).resolves.toBe(
			packVestaboardCredentials('k:x', 's'),
		);
	});

	it.each([
		['a key with no secret', 'k'],
		['an empty key half', ':s'],
		['an empty secret half', 'k:'],
	])('refuses %s', async (_name, apiKey) => {
		await expect(
			keyBuilder()(stored(apiKey, null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
