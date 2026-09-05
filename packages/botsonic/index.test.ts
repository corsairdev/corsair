import { AuthMissingError } from 'corsair/core';
import { botsonic } from './index';

describe('botsonic keyBuilder', () => {
	it('returns options.key for endpoint calls', async () => {
		const plugin = botsonic({ key: 'from-options' });

		await expect(
			plugin.keyBuilder?.({ authType: 'api_key' } as never, 'endpoint'),
		).resolves.toBe('from-options');
	});

	it('returns the stored api key when options.key is absent', async () => {
		const plugin = botsonic();

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'from-store' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('from-store');
	});

	it('throws AuthMissingError when the api key is missing', async () => {
		const plugin = botsonic();

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});
});
