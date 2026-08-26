import { AuthMissingError } from 'corsair/core';
import {
	beeminder,
	beeminderAuthConfig,
	beeminderEndpointSchemas,
} from './index';

function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

function flattenEndpoints(plugin: ReturnType<typeof beeminder>): string[] {
	const groups = plugin.endpoints as unknown as Record<
		string,
		Record<string, unknown>
	>;
	return Object.entries(groups)
		.flatMap(([group, ops]) => Object.keys(ops).map((op) => `${group}.${op}`))
		.sort();
}

describe('beeminder plugin registration', () => {
	const plugin = beeminder();

	it('exposes the four required operations', () => {
		expect(flattenEndpoints(plugin)).toEqual([
			'charges.create',
			'goals.list',
			'goals.listArchived',
			'user.get',
		]);
	});

	it('registers api_key and oauth_2', () => {
		expect(Object.keys(beeminderAuthConfig).sort()).toEqual([
			'api_key',
			'oauth_2',
		]);
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.oauthConfig).toBeUndefined();
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(beeminderEndpointSchemas).sort()).toEqual([
			'charges.create',
			'goals.list',
			'goals.listArchived',
			'user.get',
		]);
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
		const keyed = beeminder({ key: 'direct-token' });
		const token = await keyBuilderOf(keyed)(
			{ authType: 'api_key' },
			'endpoint',
		);
		expect(token).toBe('direct-token');
	});
});
