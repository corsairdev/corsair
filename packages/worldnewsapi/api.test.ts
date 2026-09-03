import { AuthMissingError } from 'corsair/core';
import { worldnewsapi } from './index';

describe('World News API Plugin Setup & KeyBuilder', () => {
	it('instantiates plugin with default options', () => {
		const plugin = worldnewsapi();
		expect(plugin.id).toBe('worldnewsapi');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.endpoints?.news?.topNews).toBeDefined();
		expect(plugin.endpoints?.news?.extractNews).toBeDefined();
		expect(plugin.endpoints?.news?.extractNewsLinks).toBeDefined();
		expect(plugin.endpoints?.news?.getGeoCoordinates).toBeDefined();
		expect(plugin.endpoints?.news?.newsWebsiteToRssFeed).toBeDefined();
		expect(plugin.endpoints?.news?.searchNewsSources).toBeDefined();
		expect(plugin.endpoints?.news?.searchNews).toBeDefined();
	});

	it('returns explicit key from options in keyBuilder', async () => {
		const plugin = worldnewsapi({ key: 'explicit-key' });
		const key = await (plugin.keyBuilder as any)(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'vault-key' },
			},
			'endpoint',
		);
		expect(key).toBe('explicit-key');
	});

	it('resolves key from keys manager in keyBuilder when options.key is not provided', async () => {
		const plugin = worldnewsapi();
		const key = await (plugin.keyBuilder as any)(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'vault-key' },
			},
			'endpoint',
		);
		expect(key).toBe('vault-key');
	});

	it('throws AuthMissingError when key is not found', async () => {
		const plugin = worldnewsapi();
		await expect(
			(plugin.keyBuilder as any)(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => '' },
				},
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});
});
