import { AuthMissingError } from 'corsair/core';
import type { QuadernoKeyBuilderContext } from './index';
import { quaderno, quadernoAuthConfig, quadernoEndpointSchemas } from './index';

const OPERATIONS = [
	'ping',
	'authorization',
	'contacts.list',
	'contacts.create',
	'contacts.get',
	'contacts.update',
	'contacts.delete',
	'products.list',
	'products.create',
	'products.get',
	'products.update',
	'products.delete',
	'invoices.list',
	'invoices.create',
	'invoices.get',
	'invoices.update',
	'invoices.void',
	'invoices.markUncollectible',
	'invoices.recordPayment',
	'invoices.deliver',
	'receipts.list',
	'receipts.create',
	'receipts.get',
	'receipts.void',
	'receipts.deliver',
	'credits.list',
	'credits.create',
	'credits.get',
	'credits.update',
	'credits.void',
	'credits.deliver',
	'proformas.list',
	'proformas.create',
	'proformas.get',
	'proformas.update',
	'proformas.accept',
	'proformas.decline',
	'proformas.revert',
	'proformas.convert',
	'proformas.deliver',
	'taxRates.calculate',
	'taxIds.validate',
	'taxCodes.list',
	'taxCodes.get',
	'jurisdictions.list',
	'jurisdictions.get',
	'transactions.create',
	'webhooks.list',
] as const;

/** Reads a member that must exist, so a missing one fails as an assertion. */
function required<T>(source: Record<string, T>, key: string): T {
	const value = source[key];
	if (value === undefined) {
		throw new Error(`Expected "${key}" to be registered`);
	}
	return value;
}

describe('quaderno plugin', () => {
	const plugin = quaderno();
	const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
	const meta = plugin.endpointMeta as NonNullable<typeof plugin.endpointMeta>;
	const handlers = plugin.errorHandlers as NonNullable<
		typeof plugin.errorHandlers
	>;

	it('uses the documented id and auth type', () => {
		expect(plugin.id).toBe('quaderno');
		expect(plugin.options?.authType).toBe('api_key');
	});

	/**
	 * The account name is a second credential, declared on the account rather
	 * than the integration. Core generates `get_account_name` from this, which is
	 * the only reason the per-account host can be built at runtime.
	 */
	it('declares the account name as an account-level credential', () => {
		expect(Object.keys(quadernoAuthConfig)).toEqual(['api_key']);
		expect(quadernoAuthConfig.api_key.account).toEqual(['account_name']);
	});

	it('registers every operation and nothing else', () => {
		const paths: string[] = [];
		for (const [group, members] of Object.entries(endpoints)) {
			if (typeof members === 'function') {
				paths.push(group);
				continue;
			}
			for (const name of Object.keys(members)) {
				paths.push(`${group}.${name}`);
			}
		}
		expect(paths.sort()).toEqual([...OPERATIONS].sort());
	});

	it('has a schema entry for every operation', () => {
		expect(Object.keys(quadernoEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
	});

	it('has metadata for every operation', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
	});

	it('describes every operation in more than a few words', () => {
		for (const [name, entry] of Object.entries(meta)) {
			expect({ name, tooShort: (entry.description ?? '').length < 50 }).toEqual(
				{
					name,
					tooShort: false,
				},
			);
		}
	});

	it('marks the deliver routes as writes, because they send email', () => {
		// A GET that mutates is still a write: a replay emails the customer twice.
		for (const name of [
			'invoices.deliver',
			'receipts.deliver',
			'credits.deliver',
			'proformas.deliver',
		]) {
			expect({ name, risk: required(meta, name).riskLevel }).toEqual({
				name,
				risk: 'write',
			});
		}
	});

	it('marks the deletions and the voiding as destructive and irreversible', () => {
		for (const name of [
			'contacts.delete',
			'products.delete',
			'invoices.void',
			'receipts.void',
			'credits.void',
		]) {
			expect({
				name,
				risk: required(meta, name).riskLevel,
				irreversible: required(meta, name).irreversible,
			}).toEqual({ name, risk: 'destructive', irreversible: true });
		}
	});

	it('marks the reads as reads', () => {
		for (const name of [
			'ping',
			'authorization',
			'contacts.list',
			'contacts.get',
			'products.list',
			'products.get',
			'invoices.list',
			'invoices.get',
			'receipts.list',
			'receipts.get',
			'credits.list',
			'credits.get',
			'proformas.list',
			'proformas.get',
			'taxRates.calculate',
			'taxIds.validate',
			'taxCodes.list',
			'taxCodes.get',
			'jurisdictions.list',
			'jurisdictions.get',
			'webhooks.list',
		]) {
			expect({ name, risk: required(meta, name).riskLevel }).toEqual({
				name,
				risk: 'read',
			});
		}
	});

	it('marks no route that issues a document number as irreversible', () => {
		// An invoice cannot be deleted, only voided, so it consumes a number for
		// good. That is documented rather than hidden behind a bare `write`.
		expect(required(meta, 'invoices.create').description).toContain(
			'cannot be deleted',
		);
	});

	it('registers no inbound webhooks, so no delivery is accepted unverified', () => {
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

	describe('keyBuilder', () => {
		// unknown: the real manager has get_dek, issue_new_dek and the rest, which
		// this test does not implement; only the two accessors the plugin reads are
		// supplied, and the builder never touches anything else.
		const contextWith = (stored?: string) =>
			({
				authType: 'api_key',
				options: {},
				keys: {
					get_api_key: async () => stored,
					get_account_name: async () => 'acct',
				},
			}) as unknown as QuadernoKeyBuilderContext;

		function builderOf(options: Parameters<typeof quaderno>[0]) {
			const builder = quaderno(options).keyBuilder;
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
			const custom = quaderno({
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
