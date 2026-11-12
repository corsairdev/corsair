import { AuthMissingError } from 'corsair/core';
import { RecruiteeEndpointInputSchemas } from './endpoints/types';
import type { RecruiteeKeyBuilderContext } from './index';
import { recruitee } from './index';

function keyContext(
	apiKey: string | undefined,
	companyId: string | null = '1111',
	authType: 'api_key' = 'api_key',
): RecruiteeKeyBuilderContext {
	return {
		authType,
		options: {},
		keys: {
			get_api_key: async () => apiKey,
			get_company_id: async () => companyId,
		},
		// unknown: the fixture implements the one method the builder calls, not
		// the full AccountKeyManager, so the cast sits here rather than at every
		// call site.
	} as unknown as RecruiteeKeyBuilderContext;
}

type KeyBuilder = (
	ctx: RecruiteeKeyBuilderContext,
	source: string,
) => Promise<string>;

/**
 * unknown: the map values are concrete endpoints with per-operation signatures,
 * which a single record type cannot name; the tests only read their key names.
 */
type PluginInternals = {
	endpoints: Record<string, Record<string, unknown>>;
	// unknown: a schema's input and output types differ per operation, so the
	// shared view names only that the entries exist.
	endpointSchemas: Record<string, { input?: unknown; output?: unknown }>;
	endpointMeta: Record<string, { riskLevel: string; description: string }>;
	authConfig?: Record<string, { account?: readonly string[] }>;
	webhooks: Record<string, unknown>;
	// unknown: the matcher narrows its own request argument; a test that calls it
	// with no headers cannot name a stricter parameter type.
	pluginWebhookMatcher?: (request: unknown) => boolean;
};

function internalsOf(plugin: ReturnType<typeof recruitee>): PluginInternals {
	// unknown: the plugin's own type parameterises these by operation, so one
	// shared view of them has to widen first.
	return plugin as unknown as PluginInternals;
}

// unknown: `keyBuilder` is optional on the public plugin type and its source
// parameter is narrowed per call site, so the builder is widened to this
// signature once rather than casting at each call.
function keyBuilderOf(candidate: { keyBuilder?: unknown }): KeyBuilder {
	return candidate.keyBuilder as KeyBuilder;
}

function required<T>(source: Record<string, T | undefined>, key: string): T {
	const value = source[key];
	if (value === undefined) {
		throw new Error(`Expected "${key}" to be registered`);
	}
	return value;
}

const OPERATIONS = [
	'candidates.create',
	'candidates.delete',
	'candidates.get',
	'candidates.list',
	'candidates.update',
	'departments.list',
	'locations.list',
	'offers.create',
	'offers.get',
	'offers.list',
	'offers.update',
];

describe('recruitee plugin', () => {
	it('has the id and default auth type core registers under', () => {
		const plugin = recruitee();

		expect(plugin.id).toBe('recruitee');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('declares the company id as an account-level credential', () => {
		const plugin = internalsOf(recruitee());

		// Every ATS route is under `/c/{company_id}`, so the id has to be stored
		// per account beside the token.
		expect(plugin.authConfig?.api_key?.account).toEqual(['company_id']);
	});

	it('declares every operation as a registered endpoint schema', () => {
		const plugin = internalsOf(recruitee());

		expect(Object.keys(plugin.endpointSchemas).sort()).toEqual(OPERATIONS);
	});

	it('gives every operation a description and a risk level', () => {
		const plugin = internalsOf(recruitee());

		for (const [operation, meta] of Object.entries(plugin.endpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(operation).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});

	it('marks the candidate delete as destructive', () => {
		const plugin = internalsOf(recruitee());

		expect(required(plugin.endpointMeta, 'candidates.delete').riskLevel).toBe(
			'destructive',
		);
	});

	it('does not call the candidate delete irreversible, since Recruitee keeps it restorable for 7 days', () => {
		const plugin = internalsOf(recruitee());
		const meta = required(plugin.endpointMeta, 'candidates.delete') as {
			irreversible?: boolean;
			description: string;
		};

		expect(meta.irreversible).not.toBe(true);
		expect(meta.description).toContain('7 days');
	});

	it('marks the creates and updates as writes', () => {
		const plugin = internalsOf(recruitee());

		expect(required(plugin.endpointMeta, 'candidates.create').riskLevel).toBe(
			'write',
		);
		expect(required(plugin.endpointMeta, 'offers.update').riskLevel).toBe(
			'write',
		);
		expect(required(plugin.endpointMeta, 'offers.list').riskLevel).toBe('read');
	});

	it('exposes an input schema for every operation the nested map holds', () => {
		const plugin = internalsOf(recruitee());
		const nested: string[] = [];
		for (const [group, operations] of Object.entries(plugin.endpoints)) {
			for (const operation of Object.keys(operations)) {
				nested.push(`${group}.${operation}`);
			}
		}

		expect(nested.sort()).toEqual(Object.keys(plugin.endpointSchemas).sort());
	});

	it('declares no webhook receiver, because deliveries are configured in Recruitee', () => {
		const plugin = internalsOf(recruitee());

		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {} })).toBe(false);
	});

	it('exports an input schema for each endpoint key', () => {
		expect(Object.keys(RecruiteeEndpointInputSchemas)).toHaveLength(
			OPERATIONS.length,
		);
	});
});

describe('keyBuilder', () => {
	it('prefers the inline key over the stored one', async () => {
		const plugin = recruitee({ key: 'inline-key' });

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-key'),
			'endpoint',
		);

		expect(key).toBe('inline-key');
	});

	it('falls back to the stored account key', async () => {
		const plugin = recruitee();

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-key'),
			'endpoint',
		);

		expect(key).toBe('stored-key');
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = recruitee();

		await expect(
			keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when the token is stored without its company id', async () => {
		const plugin = recruitee();

		await expect(
			keyBuilderOf(plugin)(keyContext('stored-key', null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('accepts a company id passed in the plugin options', async () => {
		const plugin = recruitee({ company_id: '2222' });

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-key', null),
			'endpoint',
		);

		expect(key).toBe('stored-key');
	});
});
