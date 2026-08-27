import { AuthMissingError } from 'corsair/core';
import { browseai, browseaiAuthConfig, browseaiEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} auth for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}

	return { AuthMissingError, logEventFromContext: jest.fn() };
});

function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

function flattenEndpoints(plugin: ReturnType<typeof browseai>): string[] {
	const groups = plugin.endpoints as unknown as Record<
		string,
		Record<string, unknown>
	>;
	return Object.entries(groups)
		.flatMap(([group, ops]) => Object.keys(ops).map((op) => `${group}.${op}`))
		.sort();
}

const OPS = [
	'monitors.create',
	'monitors.delete',
	'robots.bulkRun',
	'robots.list',
	'robots.run',
	'system.getStatus',
	'tasks.get',
	'tasks.list',
	'webhooks.create',
	'webhooks.list',
];

describe('browseai plugin registration', () => {
	const plugin = browseai();

	it('exposes the documented operations', () => {
		expect(flattenEndpoints(plugin)).toEqual(OPS);
	});

	it('registers api_key only', () => {
		expect(Object.keys(browseaiAuthConfig)).toEqual(['api_key']);
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(browseaiEndpointSchemas).sort()).toEqual(OPS);
	});

	it('registers no webhooks', () => {
		expect(plugin.webhooks).toEqual({});
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const keyBuilder = keyBuilderOf(plugin);
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => null },
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('returns a direct key when provided', async () => {
		const keyed = browseai({ key: 'direct-token' });
		const token = await keyBuilderOf(keyed)(
			{ authType: 'api_key' },
			'endpoint',
		);
		expect(token).toBe('direct-token');
	});
});
