import { carbone, carboneEndpointSchemas } from './index';

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
	'render.get',
	'render.render',
	'render.renderInline',
	'status.get',
	'templates.delete',
	'templates.get',
	'templates.upload',
];

function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

function flattenEndpoints(plugin: ReturnType<typeof carbone>): string[] {
	const groups = plugin.endpoints as unknown as Record<
		string,
		Record<string, unknown>
	>;
	return Object.entries(groups)
		.flatMap(([group, ops]) => Object.keys(ops).map((op) => `${group}.${op}`))
		.sort();
}

describe('carbone plugin registration', () => {
	const plugin = carbone();

	it('exposes all expected operations', () => {
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
				expect(name.length).toBeGreaterThan(0);
			}
		}
	});

	it('has an input and output schema for every endpoint', () => {
		expect(Object.keys(carboneEndpointSchemas).sort()).toEqual(
			EXPECTED_OPERATIONS,
		);

		for (const [name, schemas] of Object.entries(carboneEndpointSchemas)) {
			expect(schemas.input).toBeDefined();
			expect(schemas.output).toBeDefined();
			expect(typeof schemas.input.parse).toBe('function');
			expect(typeof schemas.output.parse).toBe('function');
			expect(name.length).toBeGreaterThan(0);
		}
	});

	it('has metadata with risk level and description for every endpoint', () => {
		const meta = plugin.endpointMeta as unknown as Record<
			string,
			{ riskLevel: string; description: string }
		>;
		expect(Object.keys(meta).sort()).toEqual(EXPECTED_OPERATIONS);

		for (const entry of Object.values(meta)) {
			expect(['read', 'write']).toContain(entry.riskLevel);
			expect(entry.description.length).toBeGreaterThan(0);
		}
	});

	it('marks read operations appropriately', () => {
		const meta = plugin.endpointMeta as unknown as Record<
			string,
			{ riskLevel: string }
		>;
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name)
			.sort();

		expect(reads).toEqual(['render.get', 'status.get', 'templates.get']);
	});

	it('declares api_key auth and registers no webhooks', () => {
		expect(plugin.id).toBe('carbone');
		expect(plugin.authConfig).toHaveProperty('api_key');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
	});

	it('resolves a statically configured key without touching key store', async () => {
		const configured = carbone({ key: 'test-carbone-key' });
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => {
					throw new Error('key store should not be called');
				},
			},
		};

		await expect(keyBuilderOf(configured)(ctx, 'endpoint')).resolves.toBe(
			'test-carbone-key',
		);
	});

	it('resolves dynamic key from context when configured', async () => {
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => 'dynamic-key-123',
			},
		};

		await expect(keyBuilderOf(plugin)(ctx, 'endpoint')).resolves.toBe(
			'dynamic-key-123',
		);
	});

	it('throws AuthMissingError when no key is configured or found', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		};

		await expect(keyBuilderOf(plugin)(ctx, 'endpoint')).rejects.toThrow(
			'Missing api_key auth for carbone',
		);
	});

	it('properly configures error handlers', async () => {
		const handlers = plugin.errorHandlers;
		expect(handlers?.RATE_LIMIT_ERROR).toBeDefined();
		expect(handlers?.AUTH_ERROR).toBeDefined();
		expect(handlers?.NOT_FOUND_ERROR).toBeDefined();
		expect(handlers?.SERVER_ERROR).toBeDefined();
		expect(handlers?.DEFAULT).toBeDefined();

		const dummyContext = {} as any;

		if (handlers?.RATE_LIMIT_ERROR) {
			const rateLimitRes = await handlers.RATE_LIMIT_ERROR.handler(
				new Error('Rate limit 429'),
				dummyContext,
			);
			expect(rateLimitRes.maxRetries).toBe(3);
		}

		if (handlers?.AUTH_ERROR) {
			const authRes = await handlers.AUTH_ERROR.handler(
				new Error('401 unauthorized'),
				dummyContext,
			);
			expect(authRes.maxRetries).toBe(0);
		}
	});
});
