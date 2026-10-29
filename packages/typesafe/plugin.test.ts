import { AuthMissingError } from 'corsair/core';
import { resolveManagedPricingApiKey } from 'corsair/hub';
import { typeSafeEndpointSchemas, typesafe } from './index';

jest.mock('corsair/hub', () => ({
	createManagedPricingCredentialCache: jest.fn(() => ({})),
	resolveManagedPricingApiKey: jest.fn().mockResolvedValue('ts-metered-key'),
}));

const mockResolveManaged = jest.mocked(resolveManagedPricingApiKey);

// The key builder only reads authType, keys and meteredOperationId.
function keyContext(fields: {
	authType: 'api_key' | 'managed_pricing';
	apiKey?: string | null;
	meteredOperationId?: string;
}) {
	return {
		authType: fields.authType,
		options: {},
		tenantId: 'default',
		meteredOperationId: fields.meteredOperationId,
		keys: { get_api_key: jest.fn().mockResolvedValue(fields.apiKey ?? null) },
	};
}

function buildKey(
	plugin: ReturnType<typeof typesafe>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = ['systemOne.ask', 'models.list'];

beforeEach(() => {
	mockResolveManaged.mockClear();
});

describe('typesafe plugin definition', () => {
	const plugin = typesafe();

	it('registers as typesafe with api_key auth by default and no webhooks', () => {
		expect(plugin.id).toBe('typesafe');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes the full nested endpoint tree', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([...operations].sort());
	});

	it('marks every endpoint read-only with a description', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual([...operations].sort());
		for (const entry of Object.values(meta)) {
			expect(entry.riskLevel).toBe('read');
			expect(entry.description?.length).toBeGreaterThan(10);
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(typeSafeEndpointSchemas).sort()).toEqual(
			[...operations].sort(),
		);
		for (const schemas of Object.values(typeSafeEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = typesafe({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names).toContain('OVERLOADED_ERROR');
	});
});

describe('typesafe key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(buildKey(typesafe({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key for api_key auth', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(buildKey(typesafe(), ctx)).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: null });

		await expect(buildKey(typesafe(), ctx)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('resolves a metered key through Hub for managed_pricing', async () => {
		const ctx = keyContext({
			authType: 'managed_pricing',
			meteredOperationId: 'systemOne.ask',
		});

		await expect(
			buildKey(typesafe({ authType: 'managed_pricing' }), ctx),
		).resolves.toBe('ts-metered-key');
		expect(mockResolveManaged).toHaveBeenCalledWith(
			ctx,
			expect.objectContaining({
				plugin: 'typesafe',
				operation: 'systemOne.ask',
			}),
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('refuses webhook keys', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(
			typesafe().keyBuilder?.(ctx as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
