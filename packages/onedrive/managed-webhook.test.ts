import { onedrive } from './index';

describe('onedrive managed webhook verification', () => {
	it('verifies via the stored clientState (no guard)', async () => {
		const plugin = onedrive({ authType: 'managed' });
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
		const plugin = onedrive({ authType: 'managed' });
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
