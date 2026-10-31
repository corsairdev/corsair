import { AuthMissingError } from 'corsair/core';
import { packChaserCredentials } from './client';
import { chaser } from './index';

type KeyBuilder = (ctx: unknown, source: string) => Promise<string>;

function keyBuilder(): KeyBuilder {
	const plugin = chaser();
	if (typeof plugin.keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
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

describe('chaser keyBuilder', () => {
	it('packs a key and secret stored in their own fields', async () => {
		await expect(keyBuilder()(stored('k', 's'), 'endpoint')).resolves.toBe(
			packChaserCredentials('k', 's'),
		);
	});

	it('takes key:secret from the key field when no secret is stored', async () => {
		await expect(keyBuilder()(stored('k:s', null), 'endpoint')).resolves.toBe(
			packChaserCredentials('k', 's'),
		);
	});

	it('keeps a stored secret over a colon in the key', async () => {
		await expect(keyBuilder()(stored('k:x', 's'), 'endpoint')).resolves.toBe(
			packChaserCredentials('k:x', 's'),
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
