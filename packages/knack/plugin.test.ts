import { AuthMissingError } from 'corsair/core';
import { packKnackCredentials } from './client';
import type { KnackKeyBuilderContext } from './index';
import {
	knack,
	knackAuthConfig,
	knackEndpointSchemas,
	parseKnackCredentials,
} from './index';

const OPERATIONS = [
	'applications.get',
	'objects.list',
	'objects.get',
	'records.list',
	'records.get',
	'records.create',
	'records.update',
	'records.delete',
] as const;

type EndpointMeta = {
	riskLevel: string;
	description: string;
	irreversible?: boolean;
};
type KeyBuilder = (
	ctx: KnackKeyBuilderContext,
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

// unknown: the plugin's endpoint map is read through these aliases because
// Object.entries and Object.keys erase the literal types the plugin declares.
// `required` narrows each entry before anything is asserted on it.
function flatten(endpoints: Record<string, unknown>): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members as Record<string, unknown>)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('knack plugin', () => {
	const plugin = knack();
	// unknown: the plugin's declared metadata is a narrow literal type, and this
	// alias is what lets the test read a risk level by operation name.
	const meta = plugin.endpointMeta as unknown as Record<string, EndpointMeta>;
	// unknown: keyBuilder is an untyped member on the plugin object; the cast
	// narrows it to the call signature the test drives.
	const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
		candidate.keyBuilder as KeyBuilder;

	it('registers every advertised operation', () => {
		expect(flatten(plugin.endpoints as Record<string, unknown>)).toEqual(
			[...OPERATIONS].sort(),
		);
	});

	it('declares input and output schemas for each operation', () => {
		expect(Object.keys(knackEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const operation of OPERATIONS) {
			const entry = required(knackEndpointSchemas, operation);
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

	// A delete is permanent and cannot be undone by another call, so it is both
	// destructive and irreversible. The two writes are recoverable.
	it('classifies delete as destructive and the writes as writes', () => {
		expect(required(meta, 'records.delete').riskLevel).toBe('destructive');
		expect(required(meta, 'records.delete').irreversible).toBe(true);
		expect(required(meta, 'records.create').riskLevel).toBe('write');
		expect(required(meta, 'records.update').riskLevel).toBe('write');

		const nonReads = OPERATIONS.filter(
			(operation) => required(meta, operation).riskLevel !== 'read',
		);
		expect(nonReads.sort()).toEqual(
			['records.create', 'records.delete', 'records.update'].sort(),
		);
	});

	// Knack issues one API key per app alongside its application id, and has no
	// OAuth flow, so advertising one would offer a connection that cannot finish.
	it('offers api_key auth only', () => {
		expect(Object.keys(knackAuthConfig)).toEqual(['api_key']);
		expect(plugin.options?.authType).toBe('api_key');
	});

	// The key manager builds accessors only for declared fields, so a key that
	// is not declared cannot be read at all. The application id uses the base
	// `api_key` field.
	it('stores the API key beside the application id on the account', () => {
		expect(knackAuthConfig.api_key.account).toContain('api_secret');
	});

	it('receives no webhooks', () => {
		expect(plugin.webhooks).toEqual({});
	});

	describe('keyBuilder', () => {
		// unknown: the fixture implements only the two accessors the key builder
		// reads, not the full AccountKeyManager an api_key context carries.
		const keyContext = (applicationId?: string, apiKey?: string) =>
			({
				authType: 'api_key',
				keys: {
					get_api_key: async () => applicationId,
					get_api_secret: async () => apiKey,
				},
			}) as unknown as KnackKeyBuilderContext;

		it('returns the explicitly configured key', async () => {
			const packed = packKnackCredentials({ applicationId: 'a', apiKey: 'k' });
			const configured = knack({ key: packed });

			await expect(
				keyBuilderOf(configured)(keyContext(), 'endpoint'),
			).resolves.toBe(packed);
		});

		it('packs the stored id and key into one credential pair', async () => {
			const packed = await keyBuilderOf(plugin)(
				keyContext(
					'6af358626e7887956647723f',
					'b81e8bc4-4519-4257-82fc-b0508a6728a2',
				),
				'endpoint',
			);

			expect(parseKnackCredentials(packed)).toEqual({
				applicationId: '6af358626e7887956647723f',
				apiKey: 'b81e8bc4-4519-4257-82fc-b0508a6728a2',
			});
		});

		// Failing open would send one header and collect Knack's plain-text
		// `Invalid API Key` instead of Corsair's disconnected-auth flow.
		it('throws when neither value is stored', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		it('throws when only the application id is stored', async () => {
			await expect(
				keyBuilderOf(plugin)(
					keyContext('6af358626e7887956647723f'),
					'endpoint',
				),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		it('throws when only the API key is stored', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(undefined, 'b81e8bc4'), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});
