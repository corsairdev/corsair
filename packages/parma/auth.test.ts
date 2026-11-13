import type { InternalParmaPlugin } from './index';
import { parma } from './index';

type KeyBuilder = NonNullable<InternalParmaPlugin['keyBuilder']>;

function context(authType: 'api_key' | 'oauth_2', token: string | null) {
	const keys = {
		get_api_key: jest.fn(async () => token),
		get_access_token: jest.fn(async () => token),
	};
	return {
		ctx: { authType, keys } as unknown as Parameters<KeyBuilder>[0],
		keys,
	};
}

test.each(['api_key', 'oauth_2'] as const)(
	'uses the stored %s credential without refreshing',
	async (authType) => {
		const { ctx, keys } = context(authType, 'stored-token');
		const plugin: InternalParmaPlugin = parma({ authType });
		await expect(plugin.keyBuilder!(ctx, 'endpoint')).resolves.toBe(
			'stored-token',
		);
		expect(keys.get_api_key).toHaveBeenCalledTimes(
			authType === 'api_key' ? 1 : 0,
		);
		expect(keys.get_access_token).toHaveBeenCalledTimes(
			authType === 'oauth_2' ? 1 : 0,
		);
		expect(ctx).not.toHaveProperty('_refreshAuth');
	},
);

test.each(['api_key', 'oauth_2'] as const)(
	'rejects missing stored %s credentials',
	async (authType) => {
		const { ctx } = context(authType, null);
		const plugin: InternalParmaPlugin = parma({ authType });
		await expect(plugin.keyBuilder!(ctx, 'endpoint')).rejects.toThrow();
	},
);

test('uses an explicit key without reading stored credentials', async () => {
	const { ctx, keys } = context('oauth_2', null);
	const plugin: InternalParmaPlugin = parma({
		authType: 'oauth_2',
		key: 'explicit',
	});
	await expect(plugin.keyBuilder!(ctx, 'endpoint')).resolves.toBe('explicit');
	expect(keys.get_access_token).not.toHaveBeenCalled();
});
