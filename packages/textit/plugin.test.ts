import { AuthMissingError } from 'corsair/core';
import { textit } from './index';

function context(key: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(key) },
	};
}

describe('TextIt plugin', () => {
	it('uses explicit credentials before stored credentials', async () => {
		const plugin = textit({ key: 'configured' });
		const ctx = context('stored');
		await expect(plugin.keyBuilder?.(ctx as never, 'endpoint')).resolves.toBe(
			'configured',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('uses stored credentials and rejects missing keys', async () => {
		const plugin = textit();
		await expect(
			plugin.keyBuilder?.(context('stored') as never, 'endpoint'),
		).resolves.toBe('stored');
		await expect(
			plugin.keyBuilder?.(context(null) as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('declares outgoing resthook operations but no incoming webhook handler', () => {
		const plugin = textit();
		expect(plugin.id).toBe('textit');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});
});
