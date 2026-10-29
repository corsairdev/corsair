import { teams } from './index';

describe('teams managed webhook verification', () => {
	it('verifies via the stored clientState (no guard)', async () => {
		const plugin = teams({ authType: 'managed' });
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
		const plugin = teams({ authType: 'managed' });
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
