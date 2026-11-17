import { AuthMissingError } from 'corsair/core';
import { currencyscoop } from './index';

type KeyBuilder = NonNullable<ReturnType<typeof currencyscoop>['keyBuilder']>;
type KeyContext = Parameters<KeyBuilder>[0];

function ctx(stored: string | null): KeyContext {
	return {
		authType: 'api_key',
		keys: { get_api_key: jest.fn().mockResolvedValue(stored) },
	} as unknown as KeyContext;
}

describe('currencyscoop keyBuilder', () => {
	it('returns the stored key', async () => {
		const plugin = currencyscoop();
		await expect(plugin.keyBuilder?.(ctx('stored'), 'endpoint')).resolves.toBe(
			'stored',
		);
	});

	it('throws AuthMissingError when no key is stored, so Corsair can offer a connect link', async () => {
		const plugin = currencyscoop();
		await expect(
			plugin.keyBuilder?.(ctx(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
