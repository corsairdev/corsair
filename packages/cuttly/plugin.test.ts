import { CuttlyAPIError, makeCuttlyRequest } from './client';
import { Links } from './endpoints';
import { errorHandlers } from './error-handlers';
import type { CuttlyContext } from './index';
import { cuttly } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeCuttlyRequest: jest.fn(),
}));

const request = makeCuttlyRequest as jest.MockedFunction<
	typeof makeCuttlyRequest
>;
// Endpoint context includes runtime services not needed by these unit tests.
const ctx = {
	key: 'cuttly_test_key',
	$getAccountId: async () => 'account',
} as CuttlyContext;

describe('Cutt.ly links', () => {
	beforeEach(() => request.mockReset());

	it('shortens a URL with a custom alias and returns its QR code URL', async () => {
		request.mockResolvedValue({
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
		expect(request).toHaveBeenCalledWith(
			'cuttly_test_key',
			expect.objectContaining({
				short: 'https://example.com/launch',
				name: 'launch',
			}),
		);
		expect(response.url.qrCode).toBe('https://cutt.ly/qr/launch.png');
	});

	it('encodes enabled Cutt.ly shortening flags as documented numeric values', async () => {
		request.mockResolvedValue({ url: { status: 7 } });
		await Links.shorten(ctx, {
			url: 'https://example.com/launch',
			useCustomDomain: true,
			publicStats: true,
			noTitle: true,
		});
		expect(request).toHaveBeenCalledWith('cuttly_test_key', {
			short: 'https://example.com/launch',
			name: undefined,
			userDomain: 1,
			public: 1,
			noTitle: 1,
		});
	});

	it('updates an existing short link destination', async () => {
		request.mockResolvedValue({
			url: { status: 1, shortLink: 'https://cutt.ly/launch' },
		});
		await Links.update(ctx, {
			shortUrl: 'https://cutt.ly/launch',
			url: 'https://example.com/new-launch',
		});
		expect(request).toHaveBeenCalledWith('cuttly_test_key', {
			edit: 'https://cutt.ly/launch',
			source: 'https://example.com/new-launch',
			name: undefined,
		});
	});

	it('updates an existing short link alias', async () => {
		request.mockResolvedValue({
			url: { status: 1, shortLink: 'https://cutt.ly/new-launch' },
		});
		await Links.update(ctx, {
			shortUrl: 'https://cutt.ly/launch',
			alias: 'new-launch',
		});
		expect(request).toHaveBeenCalledWith('cuttly_test_key', {
			edit: 'https://cutt.ly/launch',
			source: undefined,
			name: 'new-launch',
		});
	});

	it('retrieves link analytics over a date range', async () => {
		request.mockResolvedValue({
			stats: { status: 1, clicks: 42, shortLink: 'https://cutt.ly/launch' },
		});
		const response = await Links.analytics(ctx, {
			shortUrl: 'https://cutt.ly/launch',
			dateFrom: '2026-01-01',
			dateTo: '2026-01-31',
		});
		expect(request).toHaveBeenCalledWith('cuttly_test_key', {
			stats: 'https://cutt.ly/launch',
			date_from: '2026-01-01',
			date_to: '2026-01-31',
		});
		expect(response.stats.clicks).toBe(42);
	});

	it('surfaces Cutt.ly API status failures as actionable errors', async () => {
		request.mockResolvedValue({ url: { status: 3 } });
		await expect(
			Links.shorten(ctx, { url: 'https://example.com/launch' }),
		).rejects.toMatchObject({
			message: 'The requested Cutt.ly custom alias is already in use',
			code: 3,
		});
	});
});

describe('Cutt.ly plugin', () => {
	it('uses API-key authentication and exposes the requested operations', () => {
		const plugin = cuttly({ key: 'configured-key' });
		expect(plugin.authConfig?.api_key).toEqual({});
		expect(plugin.endpoints?.links.shorten).toBeDefined();
		expect(plugin.endpoints?.links.analytics).toBeDefined();
	});

	it('recognizes Cutt.ly rate-limit responses for retry handling', () => {
		const error = new CuttlyAPIError(
			'Too many requests',
			undefined,
			429,
			60000,
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});
});
