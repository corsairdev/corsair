import { AuthMissingError } from 'corsair/core';
import { contextSevenMcpAuthConfig, contextsevenmcp } from './index';

function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

describe('contextsevenmcp plugin registration', () => {
	it('supports api_key auth only', () => {
		expect(contextSevenMcpAuthConfig).toEqual({
			api_key: { account: [] },
		});
	});

	it('registers search and get-context endpoints', () => {
		const plugin = contextsevenmcp();
		const endpoints = plugin.endpoints as Record<
			string,
			Record<string, unknown>
		>;
		expect(Object.keys(endpoints)).toEqual(['library', 'context']);
		expect(endpoints.library).toEqual(
			expect.objectContaining({ search: expect.any(Function) }),
		);
		expect(endpoints.context).toEqual(
			expect.objectContaining({ get: expect.any(Function) }),
		);
	});

	it('registers no webhooks', () => {
		const plugin = contextsevenmcp();
		expect(plugin.webhooks).toEqual({});
		expect(plugin.webhookSchemas).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('returns the configured key from options when provided', async () => {
		const keyed = contextsevenmcp({ key: 'ctx7sk-test' });
		const token = await keyBuilderOf(keyed)(
			{ authType: 'api_key' },
			'endpoint',
		);
		expect(token).toBe('ctx7sk-test');
	});

	it('resolves the stored api key for api_key auth', async () => {
		const plugin = contextsevenmcp();
		const token = await keyBuilderOf(plugin)(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'ctx7sk-stored' },
			},
			'endpoint',
		);
		expect(token).toBe('ctx7sk-stored');
	});

	it('throws AuthMissingError when no api key is stored', async () => {
		const plugin = contextsevenmcp();
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

	it('rejects webhook key sources', async () => {
		const plugin = contextsevenmcp();
		await expect(
			keyBuilderOf(plugin)({ authType: 'api_key' }, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
