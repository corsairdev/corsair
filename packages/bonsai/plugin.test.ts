import { AuthMissingError } from 'corsair/core';
import { bonsai, bonsaiAuthConfig } from './index';

function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

describe('bonsai plugin registration', () => {
	it('extends api_key with api_secret only', () => {
		expect(bonsaiAuthConfig).toEqual({
			api_key: { account: ['api_secret'] },
		});
	});

	it('returns packed credentials when options provide both halves', async () => {
		const keyed = bonsai({ apiKey: 'k', apiSecret: 's' });
		const token = await keyBuilderOf(keyed)(
			{ authType: 'api_key' },
			'endpoint',
		);
		expect(JSON.parse(token)).toEqual({ apiKey: 'k', apiSecret: 's' });
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const plugin = bonsai();
		await expect(
			keyBuilderOf(plugin)(
				{
					authType: 'api_key',
					keys: {
						get_api_key: async () => null,
						get_api_secret: async () => null,
					},
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('keeps DEFAULT last when custom handlers are merged', () => {
		const plugin = bonsai({
			errorHandlers: {
				CUSTOM: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys.at(-1)).toBe('DEFAULT');
		expect(keys).toContain('CUSTOM');
	});
});
