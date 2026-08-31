import { AuthMissingError } from 'corsair/core';
import { mailboxLayerAuthConfig, mailboxlayer } from './index';

function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

describe('mailboxlayer plugin registration', () => {
	it('registers api_key with no webhook tenant leftover', () => {
		expect(mailboxLayerAuthConfig).toEqual({ api_key: {} });
	});

	it('returns a direct key when provided', async () => {
		const keyed = mailboxlayer({ key: 'direct-token' });
		const token = await keyBuilderOf(keyed)(
			{ authType: 'api_key' },
			'endpoint',
		);
		expect(token).toBe('direct-token');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const plugin = mailboxlayer();
		await expect(
			keyBuilderOf(plugin)(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => null },
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when the account has no DEK', async () => {
		const plugin = mailboxlayer();
		await expect(
			keyBuilderOf(plugin)(
				{
					authType: 'api_key',
					keys: {
						get_api_key: async () => {
							throw new Error(
								'No DEK found for account (tenant: "default", integration: "mailboxlayer")',
							);
						},
					},
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('keeps DEFAULT last when custom handlers are merged', () => {
		const plugin = mailboxlayer({
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
