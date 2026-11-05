import { AuthMissingError } from 'corsair/core';
import {
	boxhero,
	boxheroAuthConfig,
	boxheroEndpointMeta,
	boxheroEndpointSchemas,
} from './index';

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

function flattenEndpoints(plugin: ReturnType<typeof boxhero>): string[] {
	const groups = plugin.endpoints as unknown as Record<
		string,
		Record<string, unknown>
	>;
	return Object.entries(groups)
		.flatMap(([group, ops]) => Object.keys(ops).map((op) => `${group}.${op}`))
		.sort();
}

const OPS = [
	'itemAttributes.get',
	'itemAttributes.list',
	'items.delete',
	'items.get',
	'items.list',
	'locations.delete',
	'locations.get',
	'locations.list',
	'members.get',
	'members.list',
	'partners.list',
	'teams.getInfo',
	'transactions.listBasic',
	'transactions.listLocation',
];

describe('boxhero plugin registration', () => {
	const plugin = boxhero();

	it('exposes the documented operations', () => {
		expect(flattenEndpoints(plugin)).toEqual(OPS);
	});

	it('registers api_key only', () => {
		expect(Object.keys(boxheroAuthConfig)).toEqual(['api_key']);
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('has input, output, and meta for every endpoint', () => {
		expect(Object.keys(boxheroEndpointSchemas).sort()).toEqual(OPS);
		expect(Object.keys(boxheroEndpointMeta).sort()).toEqual(OPS);
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
		const keyed = boxhero({ key: 'direct-token' });
		const token = await keyBuilderOf(keyed)(
			{ authType: 'api_key' },
			'endpoint',
		);
		expect(token).toBe('direct-token');
	});
});
