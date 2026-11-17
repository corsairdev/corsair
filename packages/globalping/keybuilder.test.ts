import { globalping } from './index';

type KeyBuilder = NonNullable<ReturnType<typeof globalping>['keyBuilder']>;
type KeyContext = Parameters<KeyBuilder>[0];

function ctx(get: () => Promise<string | null>): KeyContext {
	return {
		authType: 'api_key',
		keys: { get_api_key: jest.fn(get) },
	} as unknown as KeyContext;
}

describe('globalping keyBuilder (the key is optional)', () => {
	it('returns the stored token', async () => {
		const plugin = globalping();
		await expect(
			plugin.keyBuilder?.(
				ctx(async () => 'tok'),
				'endpoint',
			),
		).resolves.toBe('tok');
	});

	it('goes anonymous when no key is stored', async () => {
		const plugin = globalping();
		await expect(
			plugin.keyBuilder?.(
				ctx(async () => null),
				'endpoint',
			),
		).resolves.toBe('');
	});

	it('goes anonymous when the tenant has no Globalping account yet', async () => {
		const plugin = globalping();
		await expect(
			plugin.keyBuilder?.(
				ctx(async () => {
					throw new Error('Account not found');
				}),
				'endpoint',
			),
		).resolves.toBe('');
	});
});
