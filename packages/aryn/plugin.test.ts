import { AuthMissingError } from 'corsair/core';
import { aryn, arynAuthConfig } from './index';

function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

describe('aryn plugin registration', () => {
	it('supports api_key auth only (per OSS spec)', () => {
		expect(arynAuthConfig).toEqual({
			api_key: { account: [] },
		});
	});

	it('registers all nine OSS operations as endpoints', () => {
		const plugin = aryn();
		const endpoints = plugin.endpoints as Record<
			string,
			Record<string, unknown>
		>;
		expect(Object.keys(endpoints)).toEqual([
			'docset',
			'document',
			'query',
			'asyncTasks',
		]);
		expect(endpoints.docset).toEqual(
			expect.objectContaining({
				create: expect.any(Function),
				get: expect.any(Function),
				delete: expect.any(Function),
			}),
		);
		expect(endpoints.document).toEqual(
			expect.objectContaining({
				get: expect.any(Function),
				getBinary: expect.any(Function),
				partition: expect.any(Function),
				submitAsyncAdd: expect.any(Function),
			}),
		);
		expect(endpoints.query).toEqual(
			expect.objectContaining({ generatePlan: expect.any(Function) }),
		);
		expect(endpoints.asyncTasks).toEqual(
			expect.objectContaining({ list: expect.any(Function) }),
		);
	});

	it('registers no webhooks (per OSS spec)', () => {
		const plugin = aryn();
		expect(plugin.webhooks).toEqual({});
		expect(plugin.webhookSchemas).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('returns the configured key from options when provided', async () => {
		const keyed = aryn({ key: 'options-key' });
		const token = await keyBuilderOf(keyed)(
			{ authType: 'api_key' },
			'endpoint',
		);
		expect(token).toBe('options-key');
	});

	it('resolves the stored api key for api_key auth', async () => {
		const plugin = aryn();
		const token = await keyBuilderOf(plugin)(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'stored-key' },
			},
			'endpoint',
		);
		expect(token).toBe('stored-key');
	});

	it('throws AuthMissingError when no api key is stored', async () => {
		const plugin = aryn();
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

	it('rejects webhook key sources entirely', async () => {
		const plugin = aryn();
		await expect(
			keyBuilderOf(plugin)({ authType: 'api_key' }, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
