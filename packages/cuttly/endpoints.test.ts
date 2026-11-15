import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeCuttlyRequest } from './client';
import { Links } from './endpoints';
import type {
	CuttlyContext,
	CuttlyKeyBuilderContext,
	CuttlyPluginOptions,
} from './index';
import { cuttly } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeCuttlyRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const mockCuttlyRequest = jest.mocked(makeCuttlyRequest);
const mockLogEvent = jest.mocked(logEventFromContext);

const TEST_API_KEY = 'cuttly_test_key';

// Justification for `unknown` below: unit tests run without the Corsair
// runtime, so the endpoint context is a minimal fixture carrying only the
// fields these endpoints read (`key`). `unknown` is the only sound bridge
// from that partial fixture to the full framework context type. No test
// input reaches the provider unvalidated: every endpoint parses its input
// through a zod schema before use.
const ctx = {
	key: TEST_API_KEY,
	$getAccountId: async () => 'account',
} as unknown as CuttlyContext;

function keyBuilderCtx(apiKey: string | null): CuttlyKeyBuilderContext {
	return {
		authType: 'api_key',
		options: {},
		keys: {
			get_dek: async () => 'test-dek',
			issue_new_dek: async () => 'test-dek',
			get_api_key: async () => apiKey,
			set_api_key: async () => undefined,
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => undefined,
		},
		tenantId: 'test-tenant',
	};
}

beforeEach(() => {
	mockCuttlyRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('links.shorten', () => {
	it('shortens a URL with a custom alias and returns its QR code URL', async () => {
		mockCuttlyRequest.mockResolvedValue({
			url: {
				status: 7,
				shortLink: 'https://cutt.ly/launch',
				fullLink: 'https://example.com/launch',
				qrCode: 'https://cutt.ly/qr/launch.png',
			},
		});

		const response = await Links.shorten(ctx, {
			url: 'https://example.com/launch',
			alias: 'launch',
		});

		expect(mockCuttlyRequest).toHaveBeenCalledWith(
			TEST_API_KEY,
			expect.objectContaining({
				short: 'https://example.com/launch',
				name: 'launch',
			}),
		);
		expect(response.url.shortLink).toBe('https://cutt.ly/launch');
		expect(response.url.qrCode).toBe('https://cutt.ly/qr/launch.png');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'cuttly.links.shorten',
			{ status: 7, shortUrl: 'https://cutt.ly/launch' },
			'completed',
		);
	});

	it('encodes enabled shortening flags as documented numeric values', async () => {
		mockCuttlyRequest.mockResolvedValue({ url: { status: 7 } });

		await Links.shorten(ctx, {
			url: 'https://example.com/launch',
			useCustomDomain: true,
			publicStats: true,
			noTitle: true,
		});

		expect(mockCuttlyRequest).toHaveBeenCalledWith(TEST_API_KEY, {
			short: 'https://example.com/launch',
			name: undefined,
			userDomain: 1,
			public: 1,
			noTitle: 1,
		});
	});

	it('rejects invalid destination URLs before any provider call', async () => {
		await expect(Links.shorten(ctx, { url: 'not-a-url' })).rejects.toThrow();
		expect(mockCuttlyRequest).not.toHaveBeenCalled();
	});

	it('surfaces a taken custom alias as an actionable error', async () => {
		mockCuttlyRequest.mockResolvedValue({ url: { status: 3 } });

		await expect(
			Links.shorten(ctx, { url: 'https://example.com/launch' }),
		).rejects.toMatchObject({
			name: 'CuttlyAPIError',
			message: 'The requested Cutt.ly custom alias is already in use',
			code: 3,
		});
	});

	it('rejects already-shortened URLs instead of reporting success', async () => {
		mockCuttlyRequest.mockResolvedValue({
			url: { status: 1, shortLink: 'https://cutt.ly/launch' },
		});

		await expect(
			Links.shorten(ctx, { url: 'https://cutt.ly/launch' }),
		).rejects.toMatchObject({ name: 'CuttlyAPIError', code: 1 });
	});

	it('surfaces the monthly link limit as an actionable error', async () => {
		mockCuttlyRequest.mockResolvedValue({ url: { status: 8 } });

		await expect(
			Links.shorten(ctx, { url: 'https://example.com/launch' }),
		).rejects.toMatchObject({ name: 'CuttlyAPIError', code: 8 });
	});
});

describe('links.update', () => {
	it('updates an existing short link destination', async () => {
		mockCuttlyRequest.mockResolvedValue({
			url: { status: 1, shortLink: 'https://cutt.ly/launch' },
		});

		const response = await Links.update(ctx, {
			shortUrl: 'https://cutt.ly/launch',
			url: 'https://example.com/new-launch',
		});

		expect(mockCuttlyRequest).toHaveBeenCalledWith(TEST_API_KEY, {
			edit: 'https://cutt.ly/launch',
			source: 'https://example.com/new-launch',
			name: undefined,
		});
		expect(response.url.status).toBe(1);
	});

	it('updates an existing short link alias', async () => {
		mockCuttlyRequest.mockResolvedValue({
			url: { status: 1, shortLink: 'https://cutt.ly/new-launch' },
		});

		await Links.update(ctx, {
			shortUrl: 'https://cutt.ly/launch',
			alias: 'new-launch',
		});

		expect(mockCuttlyRequest).toHaveBeenCalledWith(TEST_API_KEY, {
			edit: 'https://cutt.ly/launch',
			source: undefined,
			name: 'new-launch',
		});
	});

	it('requires a destination URL or alias for link updates', async () => {
		await expect(
			Links.update(ctx, { shortUrl: 'https://cutt.ly/launch' }),
		).rejects.toThrow();
		expect(mockCuttlyRequest).not.toHaveBeenCalled();
	});

	it('surfaces link update failures as actionable errors', async () => {
		mockCuttlyRequest.mockResolvedValue({ url: { status: 3 } });

		await expect(
			Links.update(ctx, {
				shortUrl: 'https://cutt.ly/missing',
				url: 'https://example.com/new-launch',
			}),
		).rejects.toMatchObject({
			name: 'CuttlyAPIError',
			message:
				'The Cutt.ly link does not exist or is not owned by this account',
			code: 3,
		});
	});
});

describe('links.analytics', () => {
	it('retrieves link analytics over a date range', async () => {
		mockCuttlyRequest.mockResolvedValue({
			stats: { status: 1, clicks: 42, shortLink: 'https://cutt.ly/launch' },
		});

		const response = await Links.analytics(ctx, {
			shortUrl: 'https://cutt.ly/launch',
			dateFrom: '2026-01-01',
			dateTo: '2026-01-31',
		});

		expect(mockCuttlyRequest).toHaveBeenCalledWith(TEST_API_KEY, {
			stats: 'https://cutt.ly/launch',
			date_from: '2026-01-01',
			date_to: '2026-01-31',
		});
		expect(response.stats.clicks).toBe(42);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'cuttly.links.analytics',
			{ status: 1, shortUrl: 'https://cutt.ly/launch' },
			'completed',
		);
	});

	it('surfaces unknown analytics links as actionable errors', async () => {
		mockCuttlyRequest.mockResolvedValue({ stats: { status: 0 } });

		await expect(
			Links.analytics(ctx, { shortUrl: 'https://cutt.ly/missing' }),
		).rejects.toMatchObject({
			name: 'CuttlyAPIError',
			message: 'The Cutt.ly link does not exist',
			code: 0,
		});
	});

	it('passes through the provider bot-stats notice on gated plans', async () => {
		mockCuttlyRequest.mockResolvedValue({
			stats: {
				status: 1,
				clicks: 0,
				shortLink: 'https://cutt.ly/launch',
				bots: 'Insufficient subscription level',
			},
		});

		const response = await Links.analytics(ctx, {
			shortUrl: 'https://cutt.ly/launch',
		});

		expect(response.stats.status).toBe(1);
		expect(response.stats.bots).toBe('Insufficient subscription level');
	});
});

describe('cuttly plugin', () => {
	it('uses API-key authentication and exposes the documented operations', () => {
		const plugin = cuttly<CuttlyPluginOptions>({
			key: 'configured-key',
			authType: 'api_key',
		});

		expect(plugin.id).toBe('cuttly');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig?.api_key).toEqual({});
		expect(plugin.endpoints?.links.shorten).toBeDefined();
		expect(plugin.endpoints?.links.update).toBeDefined();
		expect(plugin.endpoints?.links.analytics).toBeDefined();
		expect(plugin.webhooks).toEqual({});
	});

	it('keyBuilder returns the static key when provided in options', async () => {
		const plugin = cuttly<CuttlyPluginOptions>({ key: 'static-key' });

		await expect(
			plugin.keyBuilder?.(keyBuilderCtx(null), 'endpoint'),
		).resolves.toBe('static-key');
	});

	it('keyBuilder resolves the API key from context when not in options', async () => {
		const plugin = cuttly<CuttlyPluginOptions>({});

		await expect(
			plugin.keyBuilder?.(keyBuilderCtx('ctx-key'), 'endpoint'),
		).resolves.toBe('ctx-key');
	});

	it('keyBuilder throws AuthMissingError when no key is available', async () => {
		const plugin = cuttly<CuttlyPluginOptions>({});

		await expect(
			plugin.keyBuilder?.(keyBuilderCtx(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
