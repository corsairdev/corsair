import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ImejisioAPIError } from './client';
import { Designs } from './endpoints';
import type {
	ImejisioContext,
	ImejisioKeyBuilderContext,
	ImejisioPluginOptions,
} from './index';
import { imejisio } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

const TEST_RENDER_KEY = 'test-dma-render-key-456';

/**
 * Minimal test double context for Imejis endpoints.
 *
 * Minimal endpoint context: Designs.render reads only ctx.key and ctx.db.renders
 * (event logging is mocked via logEventFromContext). The full CorsairPluginContext carries
 * the bound endpoint tree, auth keys manager, and schema definitions which cannot be meaningfully
 * constructed in a unit test. This narrow assertion is safe because Designs.render accesses
 * only these members.
 */
function createMockContext(overrides?: {
	key?: string;
	db?: {
		renders?: {
			upsertByEntityId: jest.Mock;
		};
	};
}): ImejisioContext {
	// unknown justified: minimal mock double implementing key, options, and db for endpoint tests.
	return {
		key: overrides?.key ?? TEST_RENDER_KEY,
		options: {},
		db: overrides?.db,
	} as unknown as ImejisioContext;
}

const ctx = createMockContext();

// Identity handler keeps caught values typed as unknown so assertions below narrow via matchers/type guards.
const capture = (e: unknown) => e;

const originalFetch = global.fetch;

beforeEach(() => {
	mockLog.mockClear();
	global.fetch = jest.fn();
});

afterAll(() => {
	global.fetch = originalFetch;
});

const mockFetch = () => jest.mocked(global.fetch);

/** Builds a Response double for a binary (delivery=stream) render. */
function streamResponse(bytes: Buffer, contentType = 'image/jpeg'): Response {
	return new Response(bytes, {
		status: 200,
		headers: { 'content-type': contentType },
	});
}

/**
 * Builds a Response double for a JSON (delivery=hosted|signed) render.
 * unknown justified: response payload can be any serialized mock JSON.
 */
function jsonResponse(payload: unknown, status = 200): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { 'content-type': 'application/json' },
	});
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

	function stubKeys(getApiKey: () => Promise<string | null>) {
		return {
			get_dek: async () => 'test-dek',
			issue_new_dek: async () => 'test-dek',
			get_api_key: getApiKey,
			set_api_key: async (_value: string | null): Promise<void> => undefined,
			get_webhook_signature: async () => null,
			set_webhook_signature: async (_value: string | null): Promise<void> =>
				undefined,
		};
	}

	function stubKeyCtx(
		getApiKey: () => Promise<string | null>,
		overrides?: { key?: string },
	): ImejisioKeyBuilderContext {
		return {
			authType: 'api_key',
			options: { authType: 'api_key', ...overrides },
			keys: stubKeys(getApiKey),
			tenantId: 'default',
		};
	}

	it('declares the renders entity so hosted renders are queryable', () => {
		const plugin = imejisio();
		expect(Object.keys(plugin.schema?.entities ?? {})).toEqual(['renders']);
	});

	it('resolves the render key from options or context and rejects webhook lookup', async () => {
		const pluginWithOptionsKey = imejisio<ImejisioPluginOptions>({
			authType: 'api_key',
			key: TEST_RENDER_KEY,
		});
		const endpointCtx = stubKeyCtx(async () => TEST_RENDER_KEY, {
			key: TEST_RENDER_KEY,
		});
		await expect(
			pluginWithOptionsKey.keyBuilder?.(endpointCtx, 'endpoint'),
		).resolves.toBe(TEST_RENDER_KEY);

		const plugin = imejisio<ImejisioPluginOptions>({ authType: 'api_key' });
		const storedCtx = stubKeyCtx(async () => TEST_RENDER_KEY);
		await expect(plugin.keyBuilder?.(storedCtx, 'endpoint')).resolves.toBe(
			TEST_RENDER_KEY,
		);

		const emptyCtx = stubKeyCtx(async () => null);
		await expect(
			plugin.keyBuilder?.(emptyCtx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);

		await expect(
			plugin.keyBuilder?.(storedCtx, 'webhook'),
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
		mockFetch().mockResolvedValueOnce(new Response(new ArrayBuffer(4)));

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
		const emptyCtx = createMockContext({ key: '' });

		await expect(
			Designs.render(emptyCtx, { designId: 'des_1' }),
		).rejects.toBeInstanceOf(AuthMissingError);

		expect(mockFetch()).not.toHaveBeenCalled();
	});

	it('enforces runtime input validation on invalid parameters', async () => {
		await expect(Designs.render(ctx, { designId: '' })).rejects.toThrow();
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
		const loggedMeta = mockLog.mock.calls[0]?.[2];
		expect(loggedMeta).toEqual({
			designId: 'des_safe',
			format: 'jpeg',
			delivery: 'stream',
		});
		expect(loggedMeta).not.toHaveProperty('secretField');
		expect(loggedMeta).not.toHaveProperty('overrides');
	});
});

describe('Designs.render persistence', () => {
	it('mirrors a hosted render into the renders entity', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const dbCtx = createMockContext({
			db: { renders: { upsertByEntityId } },
		});

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
		const dbCtx = createMockContext({
			db: { renders: { upsertByEntityId } },
		});

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
		const dbCtx = createMockContext({
			db: { renders: { upsertByEntityId } },
		});

		mockFetch().mockResolvedValueOnce(streamResponse(Buffer.from('img')));

		await Designs.render(dbCtx, { designId: 'des_9' });

		expect(upsertByEntityId).not.toHaveBeenCalled();
	});

	it('still returns the render when the database write fails', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const dbCtx = createMockContext({
			db: {
				renders: {
					upsertByEntityId: jest.fn().mockRejectedValue(new Error('db down')),
				},
			},
		});

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
			capture,
		);

		expect(error).toBeInstanceOf(ImejisioAPIError);
		expect(error).toMatchObject({
			status: 429,
			code: 'no-plan',
		});
		expect(error).toHaveProperty('retryAfter');
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

		const error = await Designs.render(ctx, { designId: 'des_1' }).catch(
			capture,
		);

		expect(error).toBeInstanceOf(ImejisioAPIError);
		expect(error).toMatchObject({
			status: 401,
			message: 'Unauthorized',
		});
	});

	it('falls back to the raw body when the error is not JSON', async () => {
		mockFetch().mockResolvedValueOnce(
			new Response('  upstream unavailable  ', { status: 502 }),
		);

		await expect(Designs.render(ctx, { designId: 'des_1' })).rejects.toThrow(
			'upstream unavailable',
		);
	});

	it('falls back to a status message when the error body is empty', async () => {
		mockFetch().mockResolvedValueOnce(new Response('', { status: 500 }));

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
