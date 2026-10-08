import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { HtmlToImageAPIError, makeHtmlToImageRequest } from './client';
import {
	HtmlToImageEndpointInputSchemas,
	HtmlToImageEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { HtmlToImageContext, HtmlToImageKeyBuilderContext } from './index';
import { htmlToImageEndpointSchemas, htmltoimage } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

const CDN_URL = 'https://i.html2img.com/image-1786092598870-921691.png';

const accountPayload = {
	email: 'you@example.com',
	plan: '1k',
	plan_name: '1,000 Credits',
	active: true,
	free_plan: false,
	credits_remaining: 850,
	credits_reset_at: '2026-09-01T00:00:00+00:00',
};

const convertPayload = {
	success: true,
	id: '8a9dda43-5f42-4b93-8ff4-cd69ed32d402',
	expires_at: null,
	credits_remaining: 950,
	url: CDN_URL,
};

const mockCtx = {
	key: 'htim_test_key',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
	keyBuilder: async () => 'htim_test_key',
} as unknown as HtmlToImageContext;

function pluginEndpoints() {
	const endpoints = htmltoimage({ key: 'htim_test_key' }).endpoints;
	if (!endpoints) {
		throw new Error('missing endpoints');
	}
	return endpoints;
}

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return name ?? 'none';
}

function httpError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://app.html2img.com/api/me' },
		{
			url: 'https://app.html2img.com/api/me',
			ok: false,
			status,
			statusText: 'Error',
			body: { error: message },
		},
		message,
	);
}

describe('htmltoimage plugin shape', () => {
	it('registers the three operations and no webhooks', () => {
		const plugin = htmltoimage();
		expect(plugin.id).toBe('htmltoimage');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
		expect(plugin.webhookHooks).toBeUndefined();
		expect(Object.keys(htmlToImageEndpointSchemas).sort()).toEqual([
			'account.checkUsage',
			'html.convertToImage',
			'image.getImage',
		]);
	});
});

describe('htmltoimage keyBuilder', () => {
	it('returns options.key for endpoint calls', async () => {
		const plugin = htmltoimage({ key: 'htim_test_key' });
		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				{ authType: 'api_key' },
				'endpoint',
			),
		).resolves.toBe('htim_test_key');
	});

	it('throws AuthMissingError when the api key is absent', async () => {
		const plugin = htmltoimage();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => null },
		} as unknown as HtmlToImageKeyBuilderContext;

		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				ctx,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for non-endpoint sources', async () => {
		const plugin = htmltoimage({ key: 'htim_test_key' });
		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				{ authType: 'api_key' },
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('htmltoimage request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(accountPayload);
	});

	it('sends X-API-Key against the html2img host', async () => {
		await makeHtmlToImageRequest('api/me', 'htim_test_key', { method: 'GET' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://app.html2img.com',
				HEADERS: expect.objectContaining({
					'X-API-Key': 'htim_test_key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'api/me',
			}),
		);
	});

	it('rethrows ApiError so status stays on the error', async () => {
		const err = httpError(401, 'Invalid API key');
		mockRequest.mockRejectedValue(err);

		await expect(
			makeHtmlToImageRequest('api/me', 'htim_test_key'),
		).rejects.toBe(err);
	});

	it('preserves a wrapper for unknown failures', async () => {
		mockRequest.mockRejectedValue(new Error('boom'));

		await expect(
			makeHtmlToImageRequest('api/me', 'htim_test_key'),
		).rejects.toBeInstanceOf(HtmlToImageAPIError);
	});
});

describe('checkUsage', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(accountPayload);
	});

	it('GETs /api/me and returns the official account shape', async () => {
		const result = await pluginEndpoints().account.checkUsage(
			mockCtx,
			{} as never,
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'GET', url: 'api/me' }),
		);
		expect(result).toEqual(accountPayload);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'htmltoimage.check_usage',
			{},
			'completed',
		);
	});

	it('rejects an HCTI-style usage payload', () => {
		expect(() =>
			HtmlToImageEndpointOutputSchemas.checkUsage.parse({
				hourly: 1,
				daily: 2,
				monthly: 3,
			}),
		).toThrow();
	});

	it('accepts a documented account with a null plan', () => {
		expect(
			HtmlToImageEndpointOutputSchemas.checkUsage.parse({
				email: 'you@example.com',
				plan: null,
				active: true,
				free_plan: true,
				credits_remaining: 0,
				credits_reset_at: null,
			}),
		).toMatchObject({ credits_remaining: 0, plan: null });
	});
});

describe('convertToImage', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(convertPayload);
	});

	it('POSTs parsed html to /api/html', async () => {
		const result = await pluginEndpoints().html.convertToImage(mockCtx, {
			html: '<h1>Hello</h1>',
			css: 'h1{color:red}',
			width: 1200,
			format: 'png',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'api/html',
				body: expect.objectContaining({
					html: '<h1>Hello</h1>',
					css: 'h1{color:red}',
					width: 1200,
					format: 'png',
				}),
			}),
		);
		expect(result).toEqual(convertPayload);
	});

	it('rejects empty html before calling the API', async () => {
		await expect(
			pluginEndpoints().html.convertToImage(mockCtx, { html: '' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('POSTs a public url to /api/screenshot', async () => {
		const result = await pluginEndpoints().html.convertToImage(mockCtx, {
			url: 'https://example.com',
			selector: '#hero',
			width: 1200,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'api/screenshot',
				body: expect.objectContaining({
					url: 'https://example.com',
					selector: '#hero',
					width: 1200,
				}),
			}),
		);
		expect(result).toEqual(convertPayload);
	});

	it('rejects html and url together', () => {
		expect(
			HtmlToImageEndpointInputSchemas.convertToImage.safeParse({
				html: '<h1>x</h1>',
				url: 'https://example.com',
			}).success,
		).toBe(false);
	});

	it('rejects selector without url', () => {
		expect(
			HtmlToImageEndpointInputSchemas.convertToImage.safeParse({
				html: '<h1>x</h1>',
				selector: '#hero',
			}).success,
		).toBe(false);
	});

	it('accepts http and https screenshot urls', () => {
		expect(
			HtmlToImageEndpointInputSchemas.convertToImage.safeParse({
				url: 'https://example.com',
			}).success,
		).toBe(true);
		expect(
			HtmlToImageEndpointInputSchemas.convertToImage.safeParse({
				url: 'http://example.com',
			}).success,
		).toBe(true);
	});

	it('rejects non-http screenshot urls', () => {
		expect(
			HtmlToImageEndpointInputSchemas.convertToImage.safeParse({
				url: 'mailto:you@example.com',
			}).success,
		).toBe(false);
		expect(
			HtmlToImageEndpointInputSchemas.convertToImage.safeParse({
				url: 'file:///tmp/page.html',
			}).success,
		).toBe(false);
	});

	it('rejects selector when format is pdf', () => {
		expect(
			HtmlToImageEndpointInputSchemas.convertToImage.safeParse({
				url: 'https://example.com',
				selector: '#hero',
				format: 'pdf',
			}).success,
		).toBe(false);
	});

	it('accepts documented ms_delay and scale_to_fit', () => {
		expect(
			HtmlToImageEndpointInputSchemas.convertToImage.parse({
				html: '<div/>',
				ms_delay: 750,
				scale_to_fit: true,
			}),
		).toEqual(
			expect.objectContaining({
				html: '<div/>',
				ms_delay: 750,
				scale_to_fit: true,
			}),
		);
	});

	it('logs processing without html when the API is async', async () => {
		mockRequest.mockResolvedValue({
			...convertPayload,
			status: 'processing',
			message: 'Screenshot generation started',
		});

		await pluginEndpoints().html.convertToImage(mockCtx, {
			html: '<h1>secret invoice</h1>',
			css: '.hidden{}',
			webhook_url: 'https://example.com/hook',
			format: 'png',
			width: 1200,
		});

		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'htmltoimage.convert_to_image',
			{
				id: convertPayload.id,
				format: 'png',
				width: 1200,
			},
			'processing',
		);
		const payload = mockLog.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload).not.toHaveProperty('html');
		expect(payload).not.toHaveProperty('css');
		expect(payload).not.toHaveProperty('webhook_url');
	});
});

describe('getImage', () => {
	const fetchMock = jest.fn();

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		fetchMock.mockReset();
		globalThis.fetch = fetchMock as unknown as typeof fetch;
	});

	it('returns a CDN url without fetching it', async () => {
		const result = await pluginEndpoints().image.getImage(mockCtx, {
			url: CDN_URL,
		});

		expect(result).toEqual({ url: CDN_URL });
		expect(fetchMock).not.toHaveBeenCalled();
		expect(mockRequest).not.toHaveBeenCalled();
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'htmltoimage.get_image',
			{ host: 'i.html2img.com' },
			'completed',
		);
	});

	it('rejects non-CDN urls before any network call', async () => {
		await expect(
			pluginEndpoints().image.getImage(mockCtx, {
				url: 'http://169.254.169.254/latest/meta-data/',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('htmltoimage error classification', () => {
	it('classifies documented html2img status codes', () => {
		expect(classify(httpError(401, 'Invalid API key'))).toBe('AUTH_ERROR');
		expect(classify(httpError(402, 'Insufficient credits'))).toBe(
			'CREDIT_LIMIT_ERROR',
		);
		expect(classify(httpError(403, 'not_subscribed'))).toBe('PERMISSION_ERROR');
		expect(classify(httpError(422, 'Render failed'))).toBe('VALIDATION_ERROR');
		expect(classify(httpError(429, 'too many requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(classify(httpError(500, 'Service error'))).toBe('SERVER_ERROR');
		expect(classify(httpError(504, 'Request timed out'))).toBe('TIMEOUT_ERROR');
	});

	it('classifies invalid_api_key from the message when status is wrapped', () => {
		const wrapped = Object.assign(new HtmlToImageAPIError('invalid_api_key'), {
			status: 401,
		});
		expect(classify(wrapped)).toBe('AUTH_ERROR');
	});
});
