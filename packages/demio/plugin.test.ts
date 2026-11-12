import { AuthMissingError } from 'corsair/core';
import { packDemioCredentials } from './client';
import type { DemioKeyBuilderContext } from './index';
import {
	demio,
	demioAuthConfig,
	demioEndpointSchemas,
	parseDemioCredentials,
} from './index';

const OPERATIONS = [
	'events.list',
	'events.get',
	'events.getDate',
	'registrations.create',
	'reports.participants',
	'ping.check',
] as const;

type EndpointMeta = {
	riskLevel: string;
	description: string;
	irreversible?: boolean;
};
type KeyBuilder = (
	ctx: DemioKeyBuilderContext,
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

describe('demio plugin', () => {
	const plugin = demio();
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
		expect(Object.keys(demioEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const operation of OPERATIONS) {
			const entry = required(demioEndpointSchemas, operation);
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

	// Only registration changes state. Everything else reads, so a read-only
	// caller can do all of it without an approval prompt.
	it('classifies registration as the only write', () => {
		expect(required(meta, 'registrations.create').riskLevel).toBe('write');

		const writes = OPERATIONS.filter(
			(operation) => required(meta, operation).riskLevel !== 'read',
		);
		expect(writes).toEqual(['registrations.create']);
	});

	// Demio issues a key and a secret from Account Settings and has no OAuth
	// flow, so advertising one would offer a connection that cannot complete.
	it('offers api_key auth only', () => {
		expect(Object.keys(demioAuthConfig)).toEqual(['api_key']);
		expect(plugin.options?.authType).toBe('api_key');
	});

	// The key manager builds accessors only for declared fields, so a secret
	// missing here cannot be read at all. The base api_key fields already
	// include `api_key`.
	it('stores the secret beside the key on the account', () => {
		expect(demioAuthConfig.api_key.account).toContain('api_secret');
	});

	it('receives no webhooks', () => {
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {},
				body: {},
				method: 'POST',
				url: 'https://example.test',
				// unknown: the matcher only reads headers, and this fake request
				// deliberately omits nothing it would touch.
			} as never),
		).toBe(false);
	});

	describe('keyBuilder', () => {
		// unknown: the fixture implements only the two accessors the key builder
		// reads, not the full AccountKeyManager an api_key context carries.
		const keyContext = (apiKey?: string, apiSecret?: string) =>
			({
				authType: 'api_key',
				keys: {
					get_api_key: async () => apiKey,
					get_api_secret: async () => apiSecret,
				},
			}) as unknown as DemioKeyBuilderContext;

		it('returns the explicitly configured key', async () => {
			const packed = packDemioCredentials({ apiKey: 'k', apiSecret: 's' });
			const configured = demio({ key: packed });

			await expect(
				keyBuilderOf(configured)(keyContext(), 'endpoint'),
			).resolves.toBe(packed);
		});

		it('packs the stored key and secret into one key', async () => {
			const packed = await keyBuilderOf(plugin)(
				keyContext('stored-key', 'stored-secret'),
				'endpoint',
			);

			expect(parseDemioCredentials(packed)).toEqual({
				apiKey: 'stored-key',
				apiSecret: 'stored-secret',
			});
		});

		// Failing open would send one header and collect the provider's generic
		// 401 instead of Corsair's disconnected-auth flow.
		it('throws when neither credential is stored', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(undefined, undefined), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		// Demio rejects a request carrying one without the other, so a half-set
		// account is no better than an empty one.
		it('throws when only the key is stored', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key', undefined), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		it('throws when only the secret is stored', async () => {
			await expect(
				keyBuilderOf(plugin)(
					keyContext(undefined, 'stored-secret'),
					'endpoint',
				),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});
