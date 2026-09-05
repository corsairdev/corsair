import { AuthMissingError } from 'corsair/core';
import type { CallinglyContext, CallinglyKeyBuilderContext } from './index';
import { callingly } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

describe('callingly plugin instance', () => {
	const plugin = callingly();

	it('initializes with default options and correct id', () => {
		expect(plugin.id).toBe('callingly');
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.webhooks).toBeDefined();
		expect(plugin.schema).toBeDefined();
		expect(plugin.authConfig).toBeDefined();
	});

	it('matches webhook signature headers correctly', () => {
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-callingly-signature': 'sig123' },
			} as any),
		).toBe(true);
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-other-header': 'val' },
			} as any),
		).toBe(false);
	});
});

describe('callingly keyBuilder authentication', () => {
	const plugin = callingly();
	const KEY = 'test-api-key';

	it('returns options.key for endpoint source', async () => {
		const withOptionsKey = callingly({ key: KEY });
		const out = await withOptionsKey.keyBuilder!(
			{ authType: 'api_key', keys: {} } as CallinglyKeyBuilderContext,
			'endpoint',
		);
		expect(out).toBe(KEY);
	});

	it('throws AuthMissingError when api key is absent', async () => {
		const noKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => null },
		} as unknown as CallinglyKeyBuilderContext;

		await expect(
			plugin.keyBuilder!(noKeyCtx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('reads api key from key manager', async () => {
		const withKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => KEY },
		} as unknown as CallinglyKeyBuilderContext;

		await expect(plugin.keyBuilder!(withKeyCtx, 'endpoint')).resolves.toBe(KEY);
	});
});

describe('callingly webhooks', () => {
	const plugin = callingly();

	it('executes callCompleted webhook handler correctly', async () => {
		const completedWebhook = plugin.webhooks!.calls.completed;
		expect(
			completedWebhook.match({
				headers: {},
				rawBody: '',
				body: { event: 'call.completed' },
				payload: { event: 'call.completed' },
				query: {},
				method: 'POST',
				url: 'https://example.com/webhook',
			} as any),
		).toBe(true);

		const result = await completedWebhook.handler(
			{} as CallinglyContext,
			{
				payload: { event: 'call.completed', call_id: 'call_55' },
				headers: {},
				rawBody: '',
				query: {},
				method: 'POST',
				url: 'https://example.com/webhook',
			} as any,
		);

		expect(result.success).toBe(true);
		expect(result.corsairEntityId).toBe('call_55');
	});

	it('executes leadCreated webhook handler correctly', async () => {
		const leadWebhook = plugin.webhooks!.leads.created;
		expect(
			leadWebhook.match({
				headers: {},
				rawBody: '',
				body: { event: 'lead.created' },
				payload: { event: 'lead.created' },
				query: {},
				method: 'POST',
				url: 'https://example.com/webhook',
			} as any),
		).toBe(true);

		const result = await leadWebhook.handler(
			{} as CallinglyContext,
			{
				payload: { event: 'lead.created', lead_id: 'lead_77', name: 'Bob' },
				headers: {},
				rawBody: '',
				query: {},
				method: 'POST',
				url: 'https://example.com/webhook',
			} as any,
		);

		expect(result.success).toBe(true);
		expect(result.corsairEntityId).toBe('lead_77');
	});
});
