import { AuthMissingError } from 'corsair/core';
import type { AllimagesaiKeyBuilderContext } from './index';
import {
	allimagesai,
	allimagesaiAuthConfig,
	allimagesaiEndpointSchemas,
} from './index';

const OPERATIONS = [
	'apiKeys.check',
	'credits.get',
	'webhooks.create',
	'webhooks.get',
	'imageGenerations.list',
	'imageGenerations.delete',
	'images.listDownloaded',
] as const;

type EndpointMeta = { riskLevel: string; description: string };
type ErrorHandler = {
	match: (error: Error) => boolean;
	handler: (error: Error) => Promise<{ maxRetries: number }>;
};
type KeyBuilder = (
	ctx: AllimagesaiKeyBuilderContext,
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

describe('allimagesai plugin', () => {
	const plugin = allimagesai();
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
		expect(Object.keys(allimagesaiEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);

		for (const operation of OPERATIONS) {
			const entry = allimagesaiEndpointSchemas[operation];
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

	it('classifies deletion as destructive and subscription as a write', () => {
		expect(required(meta, 'imageGenerations.delete').riskLevel).toBe(
			'destructive',
		);
		expect(required(meta, 'webhooks.create').riskLevel).toBe('write');

		const reads = OPERATIONS.filter(
			(operation) => required(meta, operation).riskLevel === 'read',
		);
		expect(reads).toEqual([
			'apiKeys.check',
			'credits.get',
			'webhooks.get',
			'imageGenerations.list',
			'images.listDownloaded',
		]);
	});

	// All-Images.ai issues personal access tokens only; advertising oauth_2
	// would offer a connection flow that cannot complete.
	it('offers api_key auth only', () => {
		expect(Object.keys(allimagesaiAuthConfig)).toEqual(['api_key']);
		expect(plugin.options?.authType).toBe('api_key');
	});

	describe('keyBuilder', () => {
		const keyContext = (key?: string) =>
			({
				authType: 'api_key',
				keys: { get_api_key: async () => key },
			}) as unknown as AllimagesaiKeyBuilderContext;

		it('returns the explicitly configured key', async () => {
			const configured = allimagesai({ key: 'inline-key' });
			await expect(
				keyBuilderOf(configured)(keyContext(), 'endpoint'),
			).resolves.toBe('inline-key');
		});

		it('falls back to the stored key', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'endpoint'),
			).resolves.toBe('stored-key');
		});

		// Failing open would send an empty api-key header and surface the
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
		it('classifies the documented failure statuses', () => {
			const apiError = (status: number) =>
				Object.assign(new Error('boom'), {
					status,
					name: 'ApiError',
				}) as Error;

			expect(
				required(handlers, 'AUTH_ERROR').match(new Error('Unauthorized')),
			).toBe(true);
			// DEFAULT must catch anything the specific handlers do not.
			expect(required(handlers, 'DEFAULT').match(apiError(418))).toBe(true);
		});

		// The transport already retries 429s, the binder discards a successful
		// retry's value, and credits are debited per image operation — so a retry
		// here can be billed without ever recovering.
		it('never asks the binder to retry', async () => {
			for (const [name, handler] of Object.entries(handlers)) {
				const result = await handler.handler(new Error('boom'));
				expect([name, result.maxRetries]).toEqual([name, 0]);
			}
		});
	});
});
