import { AuthMissingError } from 'corsair/core';
import type { EventzillaKeyBuilderContext } from './index';
import {
	eventzilla,
	eventzillaAuthConfig,
	eventzillaEndpointSchemas,
} from './index';

const OPERATIONS = [
	'attendees.checkin',
	'attendees.get',
	'categories.list',
	'checkout.confirm',
	'checkout.create',
	'checkout.fillOrder',
	'checkout.prepare',
	'events.attendees',
	'events.get',
	'events.list',
	'events.transactions',
	'orders.cancel',
	'orders.confirm',
	'sales.toggle',
	'tickets.create',
	'tickets.list',
	'tickets.update',
	'transactions.get',
	'users.get',
	'users.list',
] as const;

/** Reads a member that must exist, so a missing one fails as an assertion. */
function required<T>(source: Record<string, T>, key: string): T {
	const value = source[key];
	if (value === undefined) {
		throw new Error(`Expected "${key}" to be registered`);
	}
	return value;
}

describe('eventzilla plugin', () => {
	const plugin = eventzilla();
	const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
	const meta = plugin.endpointMeta as NonNullable<typeof plugin.endpointMeta>;
	const handlers = plugin.errorHandlers as NonNullable<
		typeof plugin.errorHandlers
	>;

	it('uses the documented id and auth type', () => {
		expect(plugin.id).toBe('eventzilla');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('declares only an api_key auth config with no account extras', () => {
		// Two credentials on an api_key integration would throw at runtime: core
		// only installs the integration getters for oauth_2.
		expect(Object.keys(eventzillaAuthConfig)).toEqual(['api_key']);
		expect(eventzillaAuthConfig.api_key).toEqual({});
	});

	it('registers every advertised operation and nothing else', () => {
		const paths: string[] = [];
		for (const [group, members] of Object.entries(endpoints)) {
			for (const name of Object.keys(members)) {
				paths.push(`${group}.${name}`);
			}
		}
		expect(paths.sort()).toEqual([...OPERATIONS]);
	});

	it('has a schema entry for every operation', () => {
		expect(Object.keys(eventzillaEndpointSchemas).sort()).toEqual([
			...OPERATIONS,
		]);
	});

	it('has metadata for every operation', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS]);
	});

	it('describes every operation in more than a few words', () => {
		for (const [name, entry] of Object.entries(meta)) {
			expect({ name, tooShort: (entry.description ?? '').length < 30 }).toEqual(
				{
					name,
					tooShort: false,
				},
			);
		}
	});

	it('marks the risky writes correctly', () => {
		expect(required(meta, 'orders.cancel').riskLevel).toBe('destructive');
		expect(required(meta, 'orders.cancel').irreversible).toBe(true);

		for (const name of [
			'tickets.create',
			'tickets.update',
			'attendees.checkin',
			'orders.confirm',
			'sales.toggle',
			'checkout.create',
			'checkout.fillOrder',
			'checkout.confirm',
		]) {
			expect({ name, risk: required(meta, name).riskLevel }).toEqual({
				name,
				risk: 'write',
			});
		}
	});

	it('marks every read as a read', () => {
		for (const name of [
			'events.list',
			'events.get',
			'events.transactions',
			'events.attendees',
			'tickets.list',
			'attendees.get',
			'checkout.prepare',
			'categories.list',
			'users.list',
			'users.get',
			'transactions.get',
		]) {
			expect({ name, risk: required(meta, name).riskLevel }).toEqual({
				name,
				risk: 'read',
			});
		}
	});

	it('marks no read as a credential leak', () => {
		// A route that mints or returns a credential (a token, a signed URL, a
		// session key) is a write even when it is a GET. Nothing here returns one;
		// this pins that none was added as a read by mistake. Matched on the
		// operation name rather than the prose, which mentions "API key" often.
		const suspicious = Object.keys(meta).filter((name) =>
			/(token|credential|signedurl|session|login)/i.test(name),
		);
		expect(suspicious).toEqual([]);
	});

	it('registers no webhooks: Eventzilla signs none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.webhookSchemas).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {},
				body: {},
				query: {},
			} as never),
		).toBe(false);
	});

	it('has no tenant matcher or oauth link resolver', () => {
		expect(plugin.pluginTenantWebhookMatcher).toBeUndefined();
		expect(plugin.oauthWebhookTenantLinkResolver).toBeUndefined();
	});

	describe('keyBuilder', () => {
		// Safe: a full AccountKeyManager implements get_dek, issue_new_dek and the
		// rest; the builder only reads the api key, so one method is supplied.
		const contextWith = (stored?: string) =>
			({
				authType: 'api_key',
				keys: { get_api_key: async () => stored },
				// Safe: only get_api_key is read; the real manager has the rest.
			}) as unknown as EventzillaKeyBuilderContext;

		function builderOf(options: Parameters<typeof eventzilla>[0]) {
			const builder = eventzilla(options).keyBuilder;
			if (!builder) throw new Error('Expected a keyBuilder');
			return builder;
		}

		it('prefers an inline key over the stored one', async () => {
			await expect(
				builderOf({ key: 'inline-key' })(contextWith('stored-key'), 'endpoint'),
			).resolves.toBe('inline-key');
		});

		it('falls back to the stored key', async () => {
			await expect(
				builderOf(undefined)(contextWith('stored-key'), 'endpoint'),
			).resolves.toBe('stored-key');
		});

		it('throws AuthMissingError when neither exists', async () => {
			await expect(
				builderOf(undefined)(contextWith(undefined), 'endpoint'),
			).rejects.toThrow(AuthMissingError);
		});

		it('refuses a webhook source rather than handing it the API key', async () => {
			await expect(
				builderOf({ key: 'inline-key' })(contextWith('stored-key'), 'webhook'),
			).rejects.toThrow(AuthMissingError);
		});
	});

	describe('error handlers', () => {
		it('keeps DEFAULT last after the plugin builds its map', () => {
			expect(Object.keys(handlers).at(-1)).toBe('DEFAULT');
		});

		it('starts with the caller handlers so an override can take effect', () => {
			const custom = eventzilla({
				errorHandlers: {
					MINE: {
						match: () => false,
						handler: async () => ({ maxRetries: 0 }),
					},
				},
			});
			const merged = custom.errorHandlers as NonNullable<
				typeof custom.errorHandlers
			>;
			expect(Object.keys(merged)[0]).toBe('MINE');
			expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		});
	});
});
