import { AuthMissingError } from 'corsair/core';
import { beaconchain, beaconchainAuthConfig } from './index';

function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

describe('beaconchain plugin registration', () => {
	it('registers api_key with no webhook tenant leftover', () => {
		expect(beaconchainAuthConfig).toEqual({ api_key: {} });
	});

	it('returns a direct key when provided', async () => {
		const keyed = beaconchain({ key: 'direct-token' });
		const token = await keyBuilderOf(keyed)(
			{ authType: 'api_key' },
			'endpoint',
		);
		expect(token).toBe('direct-token');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const plugin = beaconchain();
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

	it('marks validators.post as read', () => {
		expect(beaconchain().endpointMeta?.['validators.post']?.riskLevel).toBe(
			'read',
		);
	});

	it('keeps DEFAULT last when custom handlers are merged', () => {
		const plugin = beaconchain({
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
