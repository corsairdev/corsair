import { sharepoint } from './index';
import { listChanged } from './webhooks/list-changes';

describe('sharepoint managed webhook verification', () => {
	it('verifies via the stored clientState when no static override', async () => {
		const plugin = sharepoint({ authType: 'managed' });
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
		const plugin = sharepoint({ authType: 'managed' });
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

	it('honors the static webhookClientState override', async () => {
		const plugin = sharepoint({
			authType: 'managed',
			webhookClientState: 'static',
		});
		const key = await (plugin.keyBuilder as any)(
			{
				authType: 'managed',
				keys: { get_webhook_signature: async () => 'cs' },
			},
			'webhook',
		);
		expect(key).toBe('static');
	});
});

describe('sharepoint listChanged handler verifies against ctx.key', () => {
	const req = (clientState: unknown) =>
		({
			headers: {},
			query: {},
			payload: {
				value: [
					{ clientState, subscriptionId: 'sub', resource: 'r', siteUrl: 's' },
				],
			},
		}) as any;

	it('rejects a notification whose clientState mismatches ctx.key', async () => {
		const res = await (listChanged.handler as any)(
			{ key: 'cs', options: {} },
			req('wrong'),
		);
		expect(res.success).toBe(false);
		expect(res.statusCode).toBe(401);
	});

	it('rejects when ctx.key is absent (fail closed)', async () => {
		const res = await (listChanged.handler as any)(
			{ key: undefined, options: {} },
			req('cs'),
		);
		expect(res.success).toBe(false);
		expect(res.statusCode).toBe(401);
	});
});
