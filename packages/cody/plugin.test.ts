import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import type { CodyKeyBuilderContext } from './index';
import { cody, codyAuthConfig, codyEndpointSchemas } from './index';

type KeyBuilder = (
	ctx: CodyKeyBuilderContext,
	source: string,
) => Promise<string>;

describe('Cody plugin', () => {
	const plugin = cody();
	const keyBuilderOf = (candidate: ReturnType<typeof cody>): KeyBuilder => {
		if (!candidate.keyBuilder) throw new Error('keyBuilder missing');
		return candidate.keyBuilder as KeyBuilder;
	};

	it('instantiates with plugin id cody and api_key auth config', () => {
		expect(plugin.id).toBe('cody');
		expect(Object.keys(codyAuthConfig)).toEqual(['api_key']);
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('registers endpoint schemas for all 21 Cody endpoints', () => {
		const expectedEndpoints = [
			'bots.list',
			'conversations.list',
			'conversations.create',
			'conversations.get',
			'conversations.update',
			'conversations.delete',
			'documents.list',
			'documents.create',
			'documents.createFromFile',
			'documents.createFromWebpage',
			'documents.get',
			'documents.delete',
			'folders.list',
			'folders.create',
			'folders.get',
			'folders.update',
			'messages.list',
			'messages.send',
			'messages.get',
			'messages.sendForStream',
			'uploads.getSignedUrl',
		];

		expect(Object.keys(codyEndpointSchemas).sort()).toEqual(
			expectedEndpoints.slice().sort(),
		);

		for (const key of expectedEndpoints) {
			const schema =
				codyEndpointSchemas[key as keyof typeof codyEndpointSchemas];
			expect(typeof schema.input.parse).toBe('function');
			expect(typeof schema.output.parse).toBe('function');
		}
	});

	describe('keyBuilder', () => {
		const keyContext = (key?: string): CodyKeyBuilderContext => ({
			authType: 'api_key',
			options: { authType: 'api_key' },
			keys: {
				get_api_key: async () => key ?? null,
				set_api_key: async () => {},
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => {},
				get_dek: async () => '',
				issue_new_dek: async () => '',
			},
			tenantId: 'default',
		});

		it('returns options.key when explicitly provided', async () => {
			const configured = cody({ key: 'inline-key' });
			await expect(
				keyBuilderOf(configured)(keyContext(), 'endpoint'),
			).resolves.toBe('inline-key');
		});

		it('falls back to stored key from context', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'endpoint'),
			).resolves.toBe('stored-key');
		});

		it('throws AuthMissingError when no key is available', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		it('throws AuthMissingError when key is whitespace only', async () => {
			const whitespaceConfigured = cody({ key: '   ' });
			await expect(
				keyBuilderOf(whitespaceConfigured)(keyContext('   '), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		it('throws AuthMissingError for non-endpoint sources', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'webhook'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});

	describe('errorHandlers', () => {
		function makeApiError(status: number, retryAfter?: number): ApiError {
			return new ApiError(
				{ method: 'GET', url: 'https://getcody.ai/api/v1/bots' },
				{
					url: 'https://getcody.ai/api/v1/bots',
					ok: false,
					status,
					statusText: status === 429 ? 'Too Many Requests' : 'Unauthorized',
					body: { message: 'error' },
				},
				status === 429 ? 'Too Many Requests' : 'Unauthorized',
				{ retryAfter },
			);
		}

		it('matches 429 ApiError and returns maxRetries with headersRetryAfterMs', async () => {
			const handler = errorHandlers.RATE_LIMIT_ERROR;
			const error = makeApiError(429, 2500);

			expect(handler.match(error)).toBe(true);
			const result = await handler.handler(error);
			expect(result).toEqual({ maxRetries: 5, headersRetryAfterMs: 2500 });
		});

		it('matches 401 ApiError in AUTH_ERROR and does not retry', async () => {
			const handler = errorHandlers.AUTH_ERROR;
			const error = makeApiError(401);

			expect(handler.match(error)).toBe(true);
			const result = await handler.handler(error);
			expect(result).toEqual({ maxRetries: 0 });
		});

		it('catches other errors in DEFAULT handler', async () => {
			const handler = errorHandlers.DEFAULT;
			expect(handler.match(new Error('something else'))).toBe(true);
			const result = await handler.handler(new Error('something else'));
			expect(result).toEqual({ maxRetries: 0 });
		});
	});
});
