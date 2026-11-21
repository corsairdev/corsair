import { AuthMissingError } from 'corsair/core';
import { resolveManagedPricingApiKey } from 'corsair/hub';
import { litescrape } from './index';

jest.mock('corsair/hub', () => ({
	createManagedPricingCredentialCache: jest.fn(() => ({})),
	resolveManagedPricingApiKey: jest.fn().mockResolvedValue('ls-metered-key'),
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
	plugin: ReturnType<typeof litescrape>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, source);
}

describe('litescrape key builder', () => {
	beforeEach(() => mockResolveManaged.mockClear());

	it('prefers an explicit key option', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(
			buildKey(litescrape({ key: 'option-key' }), ctx),
		).resolves.toBe('option-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key for api_key auth', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(buildKey(litescrape(), ctx)).resolves.toBe('stored-key');
		expect(mockResolveManaged).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: null });

		await expect(buildKey(litescrape(), ctx)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('resolves a metered key through Hub for managed_pricing', async () => {
		const ctx = keyContext({
			authType: 'managed_pricing',
			meteredOperationId: 'google.search',
		});

		await expect(
			buildKey(litescrape({ authType: 'managed_pricing' }), ctx),
		).resolves.toBe('ls-metered-key');
		expect(mockResolveManaged).toHaveBeenCalledWith(
			ctx,
			expect.objectContaining({
				plugin: 'litescrape',
				operation: 'google.search',
			}),
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('gives webhooks no key: the plugin has none', async () => {
		const ctx = keyContext({ authType: 'managed_pricing' });

		await expect(
			buildKey(litescrape({ authType: 'managed_pricing' }), ctx, 'webhook'),
		).resolves.toBe('');
		expect(mockResolveManaged).not.toHaveBeenCalled();
	});
});
