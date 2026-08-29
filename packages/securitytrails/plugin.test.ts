import { AuthMissingError } from 'corsair/core';
import type { SecuritytrailsKeyBuilderContext } from './index';
import {
	securitytrails,
	securitytrailsAuthConfig,
	securitytrailsEndpointSchemas,
} from './index';

const OPERATIONS = [
	'account.ping',
	'account.usage',
	'domain.get',
	'domain.ssl',
	'ips.search',
	'ips.stats',
	'scroll.get',
	'sql.query',
	'sql.scroll',
	'company.associatedIps',
	'projects.list',
	'projects.bulkStaticAssetRules',
] as const;

type EndpointMeta = { riskLevel: string; description: string };
type ErrorHandler = {
	match: (error: Error) => boolean;
	handler: (error: Error) => Promise<{ maxRetries: number }>;
};
type KeyBuilder = (
	ctx: SecuritytrailsKeyBuilderContext,
	source: string,
) => Promise<string>;

/** Reads a key that must exist, so a missing one fails as an assertion. */
function required<T>(source: Record<string, T>, key: string): T {
	const value = source[key];
	if (value === undefined) {
		throw new Error(`Expected "${key}" to be registered`);
	}
	return value;
}

function flatten(endpoints: Record<string, unknown>): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members as Record<string, unknown>)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('securitytrails plugin', () => {
	const plugin = securitytrails();
	const meta = plugin.endpointMeta as unknown as Record<string, EndpointMeta>;
	const handlers = plugin.errorHandlers as unknown as Record<
		string,
		ErrorHandler
	>;
	const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
		candidate.keyBuilder as KeyBuilder;

	it('registers every advertised operation', () => {
		expect(flatten(plugin.endpoints as Record<string, unknown>)).toEqual(
			[...OPERATIONS].sort(),
		);
	});

	it('declares input and output schemas for each operation', () => {
		expect(Object.keys(securitytrailsEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);

		for (const operation of OPERATIONS) {
			const entry = securitytrailsEndpointSchemas[operation];
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('describes each operation without generator placeholder text', () => {
		for (const operation of OPERATIONS) {
			const entry = required(meta, operation);
			expect(entry.description.length).toBeGreaterThan(20);
			expect(entry.description).not.toMatch(/example resource/i);
		}
	});

	it('marks only the rule-writing operation as a write', () => {
		const writes = OPERATIONS.filter(
			(operation) => required(meta, operation).riskLevel !== 'read',
		);
		expect(writes).toEqual(['projects.bulkStaticAssetRules']);
	});

	// SecurityTrails issues API keys only; advertising oauth_2 would offer a
	// connection flow that cannot complete.
	it('offers api_key auth only', () => {
		expect(Object.keys(securitytrailsAuthConfig)).toEqual(['api_key']);
		expect(plugin.options?.authType).toBe('api_key');
	});

	describe('keyBuilder', () => {
		const keyContext = (key?: string) =>
			({
				authType: 'api_key',
				keys: { get_api_key: async () => key },
			}) as unknown as SecuritytrailsKeyBuilderContext;

		it('returns the explicitly configured key', async () => {
			const configured = securitytrails({ key: 'inline-key' });
			await expect(
				keyBuilderOf(configured)(keyContext(), 'endpoint'),
			).resolves.toBe('inline-key');
		});

		it('falls back to the stored key', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'endpoint'),
			).resolves.toBe('stored-key');
		});

		// Failing open would send an empty APIKEY header and surface the
		// provider's generic 401 instead of Corsair's disconnected-auth flow.
		it('throws AuthMissingError when no key is available', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		it('throws AuthMissingError for non-endpoint sources', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'webhook'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});

	describe('error handlers', () => {
		it('classifies the documented failure bodies', () => {
			expect(
				required(handlers, 'RATE_LIMIT_ERROR').match(
					new Error('API rate limit exceeded'),
				),
			).toBe(true);
			expect(
				required(handlers, 'AUTH_ERROR').match(new Error('Invalid API key')),
			).toBe(true);
		});

		// The transport already retries 429s, and the binder discards the value a
		// successful retry returns, so retrying here only spends quota.
		it('never asks the binder to retry', async () => {
			for (const [name, handler] of Object.entries(handlers)) {
				const result = await handler.handler(new Error('boom'));
				expect([name, result.maxRetries]).toEqual([name, 0]);
			}
		});
	});
});
