import { AuthMissingError } from 'corsair/core';
import { searchapi } from './index';

type KeyBuilder = NonNullable<ReturnType<typeof searchapi>['keyBuilder']>;
type KeyContext = Parameters<KeyBuilder>[0];

function ctx(stored: string | null): KeyContext {
	return {
		authType: 'api_key',
		keys: { get_api_key: jest.fn().mockResolvedValue(stored) },
	} as unknown as KeyContext;
}

describe('searchapi keyBuilder', () => {
	it('returns the stored key', async () => {
		const plugin = searchapi();
		await expect(plugin.keyBuilder?.(ctx('stored'), 'endpoint')).resolves.toBe(
			'stored',
		);
	});

	it('throws AuthMissingError when no key is stored, so Corsair can offer a connect link', async () => {
		const plugin = searchapi();
		await expect(
			plugin.keyBuilder?.(ctx(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
