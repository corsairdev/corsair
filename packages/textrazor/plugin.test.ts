import { textrazor, textrazorEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} auth for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}

	return { AuthMissingError, logEventFromContext: jest.fn() };
});

const EXPECTED_OPERATIONS = [
	'account.get',
	'analysis.analyzeContent',
	'analysis.classifyText',
	'analysis.extractEntities',
	'classifiers.delete',
	'classifiers.deleteCategory',
	'classifiers.getCategory',
	'classifiers.listCategories',
	'classifiers.put',
	'dictionaries.addEntries',
	'dictionaries.create',
	'dictionaries.delete',
	'dictionaries.deleteEntry',
	'dictionaries.get',
	'dictionaries.getEntry',
	'dictionaries.list',
	'dictionaries.listEntries',
];

function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

function flattenEndpoints(plugin: ReturnType<typeof textrazor>): string[] {
	const groups = plugin.endpoints as unknown as Record<
		string,
		Record<string, unknown>
	>;
	return Object.entries(groups)
		.flatMap(([group, ops]) => Object.keys(ops).map((op) => `${group}.${op}`))
		.sort();
}

describe('textrazor plugin registration', () => {
	const plugin = textrazor();

	it('exposes the TextRazor operations', () => {
		expect(flattenEndpoints(plugin)).toEqual(EXPECTED_OPERATIONS);
	});

	it('registers every endpoint as a callable function', () => {
		const groups = plugin.endpoints as unknown as Record<
			string,
			Record<string, unknown>
		>;
		for (const ops of Object.values(groups)) {
			for (const [name, fn] of Object.entries(ops)) {
				expect(typeof fn).toBe('function');
				expect(name).not.toHaveLength(0);
			}
		}
	});

	it('has an input and output schema for every endpoint', () => {
		expect(Object.keys(textrazorEndpointSchemas).sort()).toEqual(
			EXPECTED_OPERATIONS,
		);
		for (const [name, schemas] of Object.entries(textrazorEndpointSchemas)) {
			expect(schemas.input).toBeDefined();
			expect(schemas.output).toBeDefined();
			expect(typeof schemas.input.parse).toBe('function');
			expect(typeof schemas.output.parse).toBe('function');
			expect(name).not.toHaveLength(0);
		}
	});

	it('has metadata with a risk level and description for every endpoint', () => {
		const meta = plugin.endpointMeta as unknown as Record<
			string,
			{ riskLevel: string; description: string }
		>;
		expect(Object.keys(meta).sort()).toEqual(EXPECTED_OPERATIONS);
		for (const entry of Object.values(meta)) {
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
			expect(entry.description.length).toBeGreaterThan(0);
		}
	});

	it('declares api_key auth and registers no webhooks', () => {
		expect(plugin.id).toBe('textrazor');
		expect(plugin.authConfig).toHaveProperty('api_key');
		expect(plugin.authConfig).not.toHaveProperty('oauth_2');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {} } as never)).toBe(false);
	});

	it('resolves a statically configured key without touching the key store', async () => {
		const configured = textrazor({ key: 'static-key' });
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => {
					throw new Error('key store should not be consulted');
				},
			},
		};
		await expect(keyBuilderOf(configured)(ctx, 'endpoint')).resolves.toBe(
			'static-key',
		);
	});

	it('throws AuthMissingError when no key is configured or stored', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		};
		await expect(keyBuilderOf(plugin)(ctx, 'endpoint')).rejects.toThrow();
	});
});
