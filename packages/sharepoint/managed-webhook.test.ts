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

	it('returns an empty key when no clientState is stored, to let the Graph validation handshake through (the handler fails closed on real notifications)', async () => {
		const plugin = sharepoint({ authType: 'managed' });
		const key = await (plugin.keyBuilder as any)(
			{
				authType: 'managed',
				keys: { get_webhook_signature: async () => null },
			},
			'webhook',
		);
		// Throwing here would break subscription creation — the handshake arrives
		// before the clientState is persisted. Fail-closed is enforced downstream:
		// the verifier rejects an empty/absent clientState (see the listChanged tests).
		expect(key).toBe('');
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
