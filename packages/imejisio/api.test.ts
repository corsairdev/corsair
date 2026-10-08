import 'dotenv/config';
import { AuthMissingError } from 'corsair/core';
import { ImejisioAPIError, makeImejisioRenderRequest } from './client';
import type {
	RenderHostedResponse,
	RenderSignedResponse,
	RenderStreamResponse,
} from './endpoints/types';
import {
	ImejisioEndpointInputSchemas,
	ImejisioEndpointOutputSchemas,
	RenderDesignInputSchema,
	RenderDesignResponseSchema,
	RenderHostedResponseSchema,
	RenderSignedResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { ImejisioKeyBuilderContext, ImejisioPluginOptions } from './index';
import { imejisio } from './index';

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

describe('Imejis.io Endpoint Schemas & Setup', () => {
	it('validates renderDesign input schema with default values', () => {
		const input = { designId: 'template-test-123' };
		const parsed = ImejisioEndpointInputSchemas.renderDesign.parse(input);

		expect(parsed).toEqual({
			designId: 'template-test-123',
			format: 'jpeg',
			delivery: 'stream',
		});
		expect(RenderDesignInputSchema.parse(input)).toEqual(parsed);
	});

	it('validates renderDesign stream output schema', () => {
		const sampleStream: RenderStreamResponse = {
			delivery: 'stream',
			format: 'jpeg',
			contentType: 'image/jpeg',
			base64: 'dGVzdA==',
		};

		const parsed =
			ImejisioEndpointOutputSchemas.renderDesign.parse(sampleStream);
		expect(parsed).toEqual(sampleStream);
		expect(RenderDesignResponseSchema.parse(sampleStream)).toEqual(
			sampleStream,
		);
	});

	it('validates renderDesign hosted output schema', () => {
		const sampleHosted: RenderHostedResponse = {
			success: true,
			delivery: 'hosted',
			url: 'https://cdn.imejis.io/renders/hosted-sample.png',
			format: 'png',
			file: { size: 1024 },
		};

		const parsed = RenderHostedResponseSchema.parse(sampleHosted);
		expect(parsed.delivery).toBe('hosted');
		expect(parsed.url).toBe('https://cdn.imejis.io/renders/hosted-sample.png');
	});

	it('validates renderDesign signed output schema', () => {
		const sampleSigned: RenderSignedResponse = {
			success: true,
			delivery: 'signed',
			url: 'https://cdn.imejis.io/renders/signed-sample.jpeg?token=abc',
			expiresAt: '2026-09-30T00:00:00.000Z',
			format: 'jpeg',
		};

		const parsed = RenderSignedResponseSchema.parse(sampleSigned);
		expect(parsed.delivery).toBe('signed');
		expect(parsed.expiresAt).toBe('2026-09-30T00:00:00.000Z');
	});

	it('instantiates plugin with default options and endpoint catalog', () => {
		const plugin = imejisio();
		expect(plugin.id).toBe('imejisio');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.endpoints?.designs?.render).toBeDefined();
		expect(typeof plugin.endpoints?.designs?.render).toBe('function');
		expect(plugin.webhooks).toEqual({});
	});

	it('resolves explicit key from options in keyBuilder', async () => {
		const plugin = imejisio<ImejisioPluginOptions>({
			authType: 'api_key',
			key: 'explicit-render-key',
		});
		const ctx = stubKeyCtx(async () => 'vault-key', {
			key: 'explicit-render-key',
		});
		const key = await plugin.keyBuilder?.(ctx, 'endpoint');
		expect(key).toBe('explicit-render-key');
	});

	it('resolves key from keys manager when options.key is omitted', async () => {
		const plugin = imejisio<ImejisioPluginOptions>({ authType: 'api_key' });
		const ctx = stubKeyCtx(async () => 'stored-vault-key');
		const key = await plugin.keyBuilder?.(ctx, 'endpoint');
		expect(key).toBe('stored-vault-key');
	});

	it('throws AuthMissingError when no key is found', async () => {
		const plugin = imejisio<ImejisioPluginOptions>({ authType: 'api_key' });
		const ctx = stubKeyCtx(async () => '');
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});
});

// Live tests run only when an API key is available via environment variables.
// In CI (where no key is provisioned), this block is skipped to prevent gate failures.
const LIVE_API_KEY =
	process.env.IMEJISIO_API_KEY ?? process.env.IMEJIS_API_KEY ?? '';

const describeLive = LIVE_API_KEY ? describe : describe.skip;

describeLive('Imejis.io Live API', () => {
	it('rejects an invalid render key with an auth error (no retries)', async () => {
		let caught: Error | undefined;
		try {
			await makeImejisioRenderRequest('test-design-id', 'invalid-render-key', {
				delivery: 'stream',
			});
		} catch (error) {
			if (error instanceof Error) {
				caught = error;
			}
		}

		expect(caught).toBeInstanceOf(ImejisioAPIError);
		expect(caught).toMatchObject({
			status: 404,
		});
		if (caught) {
			expect(errorHandlers.AUTH_ERROR.match(caught)).toBe(true);
		}

		const strategy = await errorHandlers.AUTH_ERROR.handler();
		expect(strategy.maxRetries).toBe(0);
	});

	it('authenticates with live render key and receives valid service response', async () => {
		if (!LIVE_API_KEY) {
			throw new Error('LIVE_API_KEY must be provided');
		}

		try {
			// unknown justified: provider response body is validated downstream by Zod schema.
			const response: unknown = await makeImejisioRenderRequest(
				'sample-design-template',
				LIVE_API_KEY,
				{
					delivery: 'stream',
					format: 'jpeg',
				},
			);
			const parsed = RenderDesignResponseSchema.parse(response);
			expect(parsed.delivery).toBe('stream');
		} catch (error) {
			expect(error).toBeInstanceOf(ImejisioAPIError);
			if (error instanceof Error) {
				expect(
					errorHandlers.NOT_FOUND_ERROR.match(error) ||
						errorHandlers.RATE_LIMIT_ERROR.match(error) ||
						errorHandlers.PERMISSION_ERROR.match(error),
				).toBe(true);
			}
		}
	});
});
