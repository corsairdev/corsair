import { outlook } from './index';

describe('outlook managed webhook verification', () => {
	it('verifies via the stored clientState (no guard)', async () => {
		const plugin = outlook({ authType: 'managed' });
		const key = await (plugin.keyBuilder as any)(
			{
				authType: 'managed',
				keys: { get_webhook_signature: async () => 'cs' },
			},
			'webhook',
		);
		expect(key).toBe('cs');
	});

	it('fails closed when no clientState is stored', async () => {
		const plugin = outlook({ authType: 'managed' });
		await expect(
			(plugin.keyBuilder as any)(
				{
					authType: 'managed',
					keys: { get_webhook_signature: async () => null },
				},
				'webhook',
			),
		).rejects.toThrow();
	});
});
