import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ImejisioAPIError } from './client';
import { Designs } from './endpoints';
import type { ImejisioContext } from './index';
import { imejisio } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const TEST_RENDER_KEY = 'test-dma-render-key-456';

const ctx = {
	key: TEST_RENDER_KEY,
	options: {},
} as unknown as ImejisioContext;

const originalFetch = global.fetch;

beforeEach(() => {
	mockLog.mockClear();
	global.fetch = jest.fn();
});

afterAll(() => {
	global.fetch = originalFetch;
});

const mockFetch = () => global.fetch as jest.MockedFunction<typeof fetch>;

/** Builds a Response double for a binary (delivery=stream) render. */
function streamResponse(bytes: Buffer, contentType = 'image/jpeg') {
	return {
		ok: true,
		status: 200,
		headers: new Headers({ 'content-type': contentType }),
		arrayBuffer: async () =>
			bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
		text: async () => '',
	} as Response;
}

/** Builds a Response double for a JSON (delivery=hosted|signed) render. */
function jsonResponse(payload: unknown, status = 200) {
	return {
		ok: status >= 200 && status < 300,
		status,
		headers: new Headers({ 'content-type': 'application/json' }),
		json: async () => payload,
		text: async () => JSON.stringify(payload),
	} as Response;
}

describe('plugin shape', () => {
	it('registers designs.render as the only catalog endpoint and no webhooks', () => {
		const plugin = imejisio();
		expect(plugin.id).toBe('imejisio');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.authConfig?.api_key?.account).toEqual([]);
		expect(Object.keys(plugin.endpoints ?? {})).toEqual(['designs']);
		expect(Object.keys(plugin.endpoints?.designs ?? {})).toEqual(['render']);
		expect(typeof plugin.endpoints?.designs?.render).toBe('function');
	});

	it('declares the renders entity so hosted renders are queryable', () => {
		const plugin = imejisio();
		expect(Object.keys(plugin.schema?.entities ?? {})).toEqual(['renders']);
	});

	it('resolves the render key from options or context and rejects webhook lookup', async () => {
		const pluginWithOptionsKey = imejisio({ key: TEST_RENDER_KEY });
		await expect(
			pluginWithOptionsKey.keyBuilder?.(
				{ authType: 'api_key' } as never,
				'endpoint',
			),
		).resolves.toBe(TEST_RENDER_KEY);

		const plugin = imejisio();
		const storedCtx = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue(TEST_RENDER_KEY) },
		};
		await expect(
			plugin.keyBuilder?.(storedCtx as never, 'endpoint'),
		).resolves.toBe(TEST_RENDER_KEY);

		const emptyCtx = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue(null) },
		};
		await expect(
			plugin.keyBuilder?.(emptyCtx as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);

		await expect(
			plugin.keyBuilder?.(storedCtx as never, 'webhook' as never),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('Designs.render', () => {
	it('renders stream mode with raw binary converted to base64', async () => {
		const binaryBytes = Buffer.from('fake-jpeg-image-bytes');
		mockFetch().mockResolvedValueOnce(streamResponse(binaryBytes));

		const result = await Designs.render(ctx, { designId: 'des_456' });

		expect(result).toEqual({
			delivery: 'stream',
			format: 'jpeg',
			contentType: 'image/jpeg',
			base64: binaryBytes.toString('base64'),
		});

		expect(mockFetch()).toHaveBeenCalledTimes(1);
		const [calledUrl, calledOptions] = mockFetch().mock.calls[0]!;
		expect(calledUrl).toBe(
			'https://render.imejis.io/v1/des_456?format=jpeg&delivery=stream',
		);
		expect(calledOptions?.method).toBe('POST');
		expect(calledOptions?.headers).toEqual({
			'dma-api-key': TEST_RENDER_KEY,
			'Content-Type': 'application/json',
		});
		expect(calledOptions?.body).toBe('{}');

		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'imejisio.designs.render',
			{ designId: 'des_456', format: 'jpeg', delivery: 'stream' },
			'completed',
		);
	});

	it('falls back to a format-derived content type when the header is absent', async () => {
		mockFetch().mockResolvedValueOnce({
			ok: true,
			status: 200,
			headers: new Headers(),
			arrayBuffer: async () => new ArrayBuffer(4),
			text: async () => '',
		} as Response);

		const result = await Designs.render(ctx, {
			designId: 'des_1',
			format: 'pdf',
		});

		expect(result).toMatchObject({
			delivery: 'stream',
			format: 'pdf',
			contentType: 'application/pdf',
		});
	});

	it('renders hosted mode returning a JSON URL response', async () => {
		mockFetch().mockResolvedValueOnce(
			jsonResponse({
				success: true,
				delivery: 'hosted',
				url: 'https://cdn.imejis.io/renders/hosted-123.png',
				format: 'png',
				file: { size: 1024 },
			}),
		);

		const result = await Designs.render(ctx, {
			designId: 'des_456',
			format: 'png',
			delivery: 'hosted',
		});

		expect(result).toEqual({
			delivery: 'hosted',
			success: true,
			url: 'https://cdn.imejis.io/renders/hosted-123.png',
			format: 'png',
			file: { size: 1024 },
		});

		const [calledUrl] = mockFetch().mock.calls[0]!;
		expect(calledUrl).toBe(
			'https://render.imejis.io/v1/des_456?format=png&delivery=hosted',
		);
	});

	it('renders signed mode with expiresIn and dynamic overrides body', async () => {
		mockFetch().mockResolvedValueOnce(
			jsonResponse({
				success: true,
				delivery: 'signed',
				url: 'https://cdn.imejis.io/renders/signed-123.jpeg?token=xyz',
				expiresAt: '2026-09-07T12:00:00.000Z',
				format: 'jpeg',
			}),
		);

		const result = await Designs.render(ctx, {
			designId: 'des_456',
			delivery: 'signed',
			quality: 85,
			expiresIn: 120,
			overrides: { headline: 'Flash Sale', discount: 50 },
		});

		expect(result).toMatchObject({
			delivery: 'signed',
			url: 'https://cdn.imejis.io/renders/signed-123.jpeg?token=xyz',
			expiresAt: '2026-09-07T12:00:00.000Z',
		});

		const [calledUrl, calledOptions] = mockFetch().mock.calls[0]!;
		expect(calledUrl).toBe(
			'https://render.imejis.io/v1/des_456?format=jpeg&delivery=signed&quality=85&expiresIn=120',
		);
		expect(calledOptions?.body).toBe(
			JSON.stringify({ headline: 'Flash Sale', discount: 50 }),
		);
	});

	it('refuses redirects so the render key cannot leak cross-origin', async () => {
		mockFetch().mockResolvedValueOnce(streamResponse(Buffer.from('x')));

		await Designs.render(ctx, { designId: 'des_1' });

		const [, calledOptions] = mockFetch().mock.calls[0]!;
		expect(calledOptions?.redirect).toBe('error');
	});

	it('percent-encodes the design id into the render path', async () => {
		mockFetch().mockResolvedValueOnce(streamResponse(Buffer.from('x')));

		await Designs.render(ctx, { designId: 'des/../admin' });

		const [calledUrl] = mockFetch().mock.calls[0]!;
		expect(calledUrl).toBe(
			'https://render.imejis.io/v1/des%2F..%2Fadmin?format=jpeg&delivery=stream',
		);
	});

	it('throws AuthMissingError without calling fetch when no key is resolved', async () => {
		const emptyCtx = { key: '', options: {} } as unknown as ImejisioContext;

		await expect(
			Designs.render(emptyCtx, { designId: 'des_1' }),
		).rejects.toBeInstanceOf(AuthMissingError);

		expect(mockFetch()).not.toHaveBeenCalled();
	});

	it('enforces runtime input validation on invalid parameters', async () => {
		await expect(Designs.render(ctx, { designId: '' })).rejects.toThrow();
		await expect(
			Designs.render(ctx, { designId: 'des_1', format: 'svg' as never }),
		).rejects.toThrow();
		await expect(
			Designs.render(ctx, { designId: 'des_1', quality: 200 }),
		).rejects.toThrow();
		await expect(
			Designs.render(ctx, { designId: 'des_1', expiresIn: 10081 }),
		).rejects.toThrow();

		expect(mockFetch()).not.toHaveBeenCalled();
	});

	it('enforces runtime output validation on a malformed provider payload', async () => {
		// delivery=hosted with no `url` — fails the discriminated union.
		mockFetch().mockResolvedValueOnce(jsonResponse({ delivery: 'hosted' }));

		await expect(
			Designs.render(ctx, { designId: 'des_1', delivery: 'hosted' }),
		).rejects.toThrow();
	});

	it('does NOT log the render key or dynamic overrides', async () => {
		mockFetch().mockResolvedValueOnce(streamResponse(Buffer.from('img')));

		await Designs.render(ctx, {
			designId: 'des_safe',
			overrides: { secretField: 'top-secret-val' },
		});

		expect(mockLog).toHaveBeenCalledTimes(1);
		const loggedMeta = mockLog.mock.calls[0]![2] as Record<string, unknown>;
		expect(loggedMeta).toEqual({
			designId: 'des_safe',
			format: 'jpeg',
			delivery: 'stream',
		});
		expect(loggedMeta.secretField).toBeUndefined();
		expect(loggedMeta.overrides).toBeUndefined();
	});
});

describe('Designs.render persistence', () => {
	it('mirrors a hosted render into the renders entity', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const dbCtx = {
			key: TEST_RENDER_KEY,
			options: {},
			db: { renders: { upsertByEntityId } },
		} as unknown as ImejisioContext;

		mockFetch().mockResolvedValueOnce(
			jsonResponse({
				success: true,
				delivery: 'hosted',
				url: 'https://cdn.imejis.io/renders/hosted-9.png',
				format: 'png',
				file: { size: 2048 },
			}),
		);

		await Designs.render(dbCtx, {
			designId: 'des_9',
			format: 'png',
			delivery: 'hosted',
		});

		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		const [entityId, row] = upsertByEntityId.mock.calls[0]!;
		expect(entityId).toBe('https://cdn.imejis.io/renders/hosted-9.png');
		expect(row).toMatchObject({
			designId: 'des_9',
			delivery: 'hosted',
			url: 'https://cdn.imejis.io/renders/hosted-9.png',
			format: 'png',
			expiresAt: null,
			file: { size: 2048 },
		});
		expect(row.renderedAt).toBeInstanceOf(Date);
	});

	it('records the expiry of a signed render', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const dbCtx = {
			key: TEST_RENDER_KEY,
			options: {},
			db: { renders: { upsertByEntityId } },
		} as unknown as ImejisioContext;

		mockFetch().mockResolvedValueOnce(
			jsonResponse({
				delivery: 'signed',
				url: 'https://cdn.imejis.io/renders/signed-9.jpeg?token=abc',
				expiresAt: '2026-09-14T12:00:00.000Z',
			}),
		);

		await Designs.render(dbCtx, { designId: 'des_9', delivery: 'signed' });

		expect(upsertByEntityId.mock.calls[0]![1]).toMatchObject({
			delivery: 'signed',
			expiresAt: '2026-09-14T12:00:00.000Z',
		});
	});

	it('does not persist stream renders, which Imejis never stores', async () => {
		const upsertByEntityId = jest.fn();
		const dbCtx = {
			key: TEST_RENDER_KEY,
			options: {},
			db: { renders: { upsertByEntityId } },
		} as unknown as ImejisioContext;

		mockFetch().mockResolvedValueOnce(streamResponse(Buffer.from('img')));

		await Designs.render(dbCtx, { designId: 'des_9' });

		expect(upsertByEntityId).not.toHaveBeenCalled();
	});

	it('still returns the render when the database write fails', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const dbCtx = {
			key: TEST_RENDER_KEY,
			options: {},
			db: {
				renders: {
					upsertByEntityId: jest.fn().mockRejectedValue(new Error('db down')),
				},
			},
		} as unknown as ImejisioContext;

		mockFetch().mockResolvedValueOnce(
			jsonResponse({
				delivery: 'hosted',
				url: 'https://cdn.imejis.io/renders/hosted-10.png',
			}),
		);

		const result = await Designs.render(dbCtx, {
			designId: 'des_10',
			delivery: 'hosted',
		});

		expect(result).toMatchObject({ delivery: 'hosted' });
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});

describe('Designs.render error mapping', () => {
	it('surfaces the provider message from a JSON error body', async () => {
		mockFetch().mockResolvedValueOnce(
			jsonResponse({ success: false, message: 'Design not found' }, 404),
		);

		await expect(
			Designs.render(ctx, { designId: 'nonexistent' }),
		).rejects.toThrow('Design not found');
	});

	it('carries status, reason and quota reset off a real 429 body', async () => {
		// Verbatim body returned by render.imejis.io for an out-of-quota workspace.
		const resetAt = new Date(Date.now() + 60_000).toISOString();
		mockFetch().mockResolvedValueOnce(
			jsonResponse(
				{
					success: false,
					message:
						'Your workspace has no active plan. Choose a plan to start generating images.',
					reason: 'no-plan',
					data: { usage: 0, limit: 0, remaining: 0, resetAt },
					requestId: '320766a0-d2ad-4f00-8b3e-16e076ef166c',
				},
				429,
			),
		);

		const error = await Designs.render(ctx, { designId: 'des_1' }).catch(
			(e: unknown) => e,
		);

		expect(error).toBeInstanceOf(ImejisioAPIError);
		const apiError = error as ImejisioAPIError;
		expect(apiError.status).toBe(429);
		expect(apiError.code).toBe('no-plan');
		expect(apiError.retryAfter).toBeGreaterThan(0);
		expect(apiError.retryAfter).toBeLessThanOrEqual(60_000);
	});

	it('surfaces the `error` field used by auth failures', async () => {
		// Verbatim 404 body returned by render.imejis.io for an unknown key.
		mockFetch().mockResolvedValueOnce(
			jsonResponse({ success: false, error: 'Key not found' }, 404),
		);

		await expect(Designs.render(ctx, { designId: 'des_1' })).rejects.toThrow(
			'Key not found',
		);
	});

	it('surfaces the `error` field on a 401 from a missing key', async () => {
		mockFetch().mockResolvedValueOnce(
			jsonResponse({ success: false, error: 'Unauthorized' }, 401),
		);

		const error = (await Designs.render(ctx, { designId: 'des_1' }).catch(
			(e: unknown) => e,
		)) as ImejisioAPIError;

		expect(error.status).toBe(401);
		expect(error.message).toBe('Unauthorized');
	});

	it('falls back to the raw body when the error is not JSON', async () => {
		mockFetch().mockResolvedValueOnce({
			ok: false,
			status: 502,
			headers: new Headers(),
			text: async () => '  upstream unavailable  ',
		} as Response);

		await expect(Designs.render(ctx, { designId: 'des_1' })).rejects.toThrow(
			'upstream unavailable',
		);
	});

	it('falls back to a status message when the error body is empty', async () => {
		mockFetch().mockResolvedValueOnce({
			ok: false,
			status: 500,
			headers: new Headers(),
			text: async () => '',
		} as Response);

		await expect(Designs.render(ctx, { designId: 'des_1' })).rejects.toThrow(
			'Imejis render request failed with status 500',
		);
	});

	it('wraps transport failures in ImejisioAPIError', async () => {
		mockFetch().mockRejectedValueOnce(new Error('Network failure'));

		await expect(Designs.render(ctx, { designId: 'des_1' })).rejects.toThrow(
			'Failed to connect to Imejis render service: Network failure',
		);
	});
});
