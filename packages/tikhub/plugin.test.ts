import { AuthMissingError } from 'corsair/core';
import { resolveManagedPricingApiKey } from 'corsair/hub';
import { tikhub, tikhubEndpointSchemas } from './index';

jest.mock('corsair/hub', () => ({
	createManagedPricingCredentialCache: jest.fn(() => ({})),
	resolveManagedPricingApiKey: jest.fn().mockResolvedValue('th-metered-key'),
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
	plugin: ReturnType<typeof tikhub>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'tiktok.searchVideos',
	'tiktok.getUserProfile',
	'tiktok.getVideo',
	'tiktok.getUserVideos',
	'tiktok.getVideoComments',
	'tiktok.getHashtag',
	'tiktok.getHashtagVideos',
	'instagram.getUserByUsername',
	'instagram.getUserPosts',
	'instagram.getUserReels',
	'instagram.getPostByUrl',
	'instagram.getPostComments',
	'youtube.getVideo',
	'youtube.search',
	'youtube.getChannelVideos',
	'twitter.getUserProfile',
	'twitter.getUserTweets',
	'twitter.searchTweets',
	'twitter.getTweet',
	'reddit.search',
	'account.getInfo',
];

beforeEach(() => {
	mockResolveManaged.mockClear();
});

describe('tikhub plugin definition', () => {
	const plugin = tikhub();

	it('registers as tikhub with api_key auth by default and no webhooks', () => {
		expect(plugin.id).toBe('tikhub');
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
		expect(Object.keys(tikhubEndpointSchemas).sort()).toEqual(
			[...operations].sort(),
		);
		for (const schemas of Object.values(tikhubEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = tikhub({
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
		expect(names).toContain('INSUFFICIENT_BALANCE_ERROR');
	});
});

describe('tikhub key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(buildKey(tikhub({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key for api_key auth', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(buildKey(tikhub(), ctx)).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: null });

		await expect(buildKey(tikhub(), ctx)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('resolves a metered key through Hub for managed_pricing', async () => {
		const ctx = keyContext({
			authType: 'managed_pricing',
			meteredOperationId: 'tiktok.searchVideos',
		});

		await expect(
			buildKey(tikhub({ authType: 'managed_pricing' }), ctx),
		).resolves.toBe('th-metered-key');
		expect(mockResolveManaged).toHaveBeenCalledWith(
			ctx,
			expect.objectContaining({
				plugin: 'tikhub',
				operation: 'tiktok.searchVideos',
			}),
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('refuses webhook keys', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(
			tikhub().keyBuilder?.(ctx as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
