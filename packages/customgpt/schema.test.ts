import * as CorsairCore from 'corsair/core';
import * as CorsairHttp from 'corsair/http';
import { ApiError } from 'corsair/http';
import { CustomGPTAPIError } from './client';
import {
	createConversation,
	getMessages,
	listProjects,
	sendMessage,
} from './endpoints/customgpt';
import {
	CustomGPTEndpointInputSchemas,
	CustomGPTEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import {
	customGPTAuthConfig,
	customGPTEndpointSchemas,
	customgpt,
} from './index';
import { CustomGPTSchema } from './schema';

describe('CustomGPT schema', () => {
	it('declares a semver version', () => {
		expect(CustomGPTSchema.version).toBeDefined();
		expect(CustomGPTSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CustomGPTSchema.entities).toBe('object');
		expect(CustomGPTSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CustomGPTSchema.entities))).toBe(true);
		for (const entity of Object.values(CustomGPTSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('CustomGPT Endpoint Input Schemas', () => {
	it('validates listProjects input', () => {
		const schema = CustomGPTEndpointInputSchemas.listProjects;
		expect(schema.safeParse({}).success).toBe(true);
		expect(schema.safeParse({ page: 2 }).success).toBe(true);
		expect(schema.safeParse({ page: 'not-a-number' }).success).toBe(false);
	});

	it('validates createConversation input', () => {
		const schema = CustomGPTEndpointInputSchemas.createConversation;
		expect(schema.safeParse({ projectId: 123 }).success).toBe(true);
		expect(schema.safeParse({ projectId: 123, name: 'My Chat' }).success).toBe(
			true,
		);
		expect(schema.safeParse({}).success).toBe(false);
		expect(schema.safeParse({ name: 'My Chat' }).success).toBe(false);
	});

	it('validates sendMessage input', () => {
		const schema = CustomGPTEndpointInputSchemas.sendMessage;
		expect(
			schema.safeParse({
				projectId: 123,
				sessionId: 'session-abc',
				prompt: 'hello',
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({ projectId: 123, sessionId: 'session-abc' }).success,
		).toBe(false);
		expect(schema.safeParse({ prompt: 'hello' }).success).toBe(false);
	});

	it('validates getMessages input', () => {
		const schema = CustomGPTEndpointInputSchemas.getMessages;
		expect(
			schema.safeParse({ projectId: 123, sessionId: 'session-abc' }).success,
		).toBe(true);
		expect(
			schema.safeParse({ projectId: 123, sessionId: 'session-abc', page: 2 })
				.success,
		).toBe(true);
		expect(schema.safeParse({ projectId: 123 }).success).toBe(false);
	});
});

describe('CustomGPT Endpoint Output Schemas', () => {
	it('validates listProjects output', () => {
		const schema = CustomGPTEndpointOutputSchemas.listProjects;
		const validPayload = {
			status: 'success',
			data: {
				current_page: 1,
				data: [
					{
						id: 123,
						project_name: 'Test Project',
						is_chat_active: true,
					},
				],
			},
		};
		const parsed = schema.safeParse(validPayload);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			const project = parsed.data.data.data[0];
			expect(project).toBeDefined();
			if (project) {
				expect(project.id).toBe(123);
				expect(project.project_name).toBe('Test Project');
			}
		}

		expect(schema.safeParse({ status: 'success', data: {} }).success).toBe(
			false,
		);
	});

	it('validates createConversation output', () => {
		const schema = CustomGPTEndpointOutputSchemas.createConversation;
		const validPayload = {
			status: 'success',
			data: {
				session_id: 'session-123',
				conversation_name: 'Chat Name',
			},
		};
		const parsed = schema.safeParse(validPayload);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.data.session_id).toBe('session-123');
		}
	});

	it('validates sendMessage output', () => {
		const schema = CustomGPTEndpointOutputSchemas.sendMessage;
		const validPayload = {
			status: 'success',
			data: {
				id: 999,
				openai_response: 'This is the answer',
				citations: [],
			},
		};
		const parsed = schema.safeParse(validPayload);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.data.openai_response).toBe('This is the answer');
		}
	});

	it('validates getMessages output (both direct array and paginated formats)', () => {
		const schema = CustomGPTEndpointOutputSchemas.getMessages;
		const paginatedPayload = {
			status: 'success',
			data: {
				current_page: 1,
				data: [
					{
						id: 1,
						user_query: 'hi',
						openai_response: 'hello',
					},
				],
			},
		};
		const directArrayPayload = {
			status: 'success',
			data: [
				{
					id: 1,
					user_query: 'hi',
					openai_response: 'hello',
				},
			],
		};

		expect(schema.safeParse(paginatedPayload).success).toBe(true);
		expect(schema.safeParse(directArrayPayload).success).toBe(true);
	});
});

describe('CustomGPT plugin metadata and config', () => {
	const plugin = customgpt({ key: 'test-key' });

	it('declares the customgpt plugin id', () => {
		expect(plugin.id).toBe('customgpt');
	});

	it('defines endpoints schema map', () => {
		expect(customGPTEndpointSchemas['projects.list']).toBeDefined();
		expect(customGPTEndpointSchemas['conversations.create']).toBeDefined();
		expect(customGPTEndpointSchemas['messages.send']).toBeDefined();
		expect(customGPTEndpointSchemas['messages.get']).toBeDefined();
	});

	it('defines correct endpoint metadata and risk levels', () => {
		const meta = plugin.endpointMeta;
		expect(meta).toBeDefined();
		if (meta) {
			expect(meta['projects.list']?.riskLevel).toBe('read');
			expect(meta['conversations.create']?.riskLevel).toBe('write');
			expect(meta['messages.send']?.riskLevel).toBe('write');
			expect(meta['messages.get']?.riskLevel).toBe('read');
		}
	});

	it('defines authConfig with api_key support', () => {
		expect(customGPTAuthConfig.api_key).toBeDefined();
	});
});

describe('CustomGPT endpoints behavioral tests', () => {
	const requestSpy = jest.spyOn(CorsairHttp, 'request');
	const logSpy = jest.spyOn(CorsairCore, 'logEventFromContext');
	const mockCtx = {
		key: 'customgpt-test-key',
		db: {},
		authType: 'api_key' as const,
		keys: {
			get_api_key: async () => 'customgpt-test-key',
		},
	} as any;

	beforeEach(() => {
		requestSpy.mockReset();
		logSpy.mockReset();
		logSpy.mockResolvedValue(null as any);
		// biome-ignore lint/performance/noDelete: test-only environment cleanup
		delete process.env.LITELLM_API_KEY;
		// biome-ignore lint/performance/noDelete: test-only environment cleanup
		delete process.env.LITELLM_BASE_URL;
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('listProjects builds correct request and returns output', async () => {
		const mockResponse = {
			status: 'success',
			data: { current_page: 1, data: [] },
		};
		requestSpy.mockResolvedValueOnce(mockResponse);

		const result = await listProjects(mockCtx, { page: 2 });

		expect(result).toEqual(mockResponse);
		expect(requestSpy).toHaveBeenCalledTimes(1);
		const call = requestSpy.mock.calls[0];
		expect(call).toBeDefined();
		if (call) {
			const [config, options] = call;
			const headers = config.HEADERS as Record<string, string>;
			expect(config.BASE).toBe('https://app.customgpt.ai/api/v1');
			expect(headers?.Authorization).toBe('Bearer customgpt-test-key');
			expect(options.method).toBe('GET');
			expect(options.url).toBe('/projects');
			expect(options.query).toEqual({ page: 2 });
		}

		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.projects.list',
			{ page: 2 },
			'completed',
		);
	});

	it('createConversation builds correct request', async () => {
		const mockResponse = {
			status: 'success',
			data: { session_id: 'sess-123', conversation_name: 'Chat' },
		};
		requestSpy.mockResolvedValueOnce(mockResponse);

		const result = await createConversation(mockCtx, {
			projectId: 456,
			name: 'My Chat',
		});

		expect(result).toEqual(mockResponse);
		expect(requestSpy).toHaveBeenCalledTimes(1);
		const call = requestSpy.mock.calls[0];
		expect(call).toBeDefined();
		if (call) {
			const [config, options] = call;
			const headers = config.HEADERS as Record<string, string>;
			expect(config.BASE).toBe('https://app.customgpt.ai/api/v1');
			expect(headers?.Authorization).toBe('Bearer customgpt-test-key');
			expect(options.method).toBe('POST');
			expect(options.url).toBe('/projects/456/conversations');
			expect(options.body).toEqual({ name: 'My Chat' });
		}

		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.conversations.create',
			{ projectId: 456, name: 'My Chat' },
			'completed',
		);
	});

	it('sendMessage routes prompt-bearing calls through gateway and redacts prompt in logging', async () => {
		const mockGatewayResponse = {
			choices: [
				{
					message: { role: 'assistant', content: 'hello' },
				},
			],
			citations: [],
		};
		requestSpy.mockResolvedValueOnce(mockGatewayResponse);

		process.env.LITELLM_API_KEY = 'gateway-key';
		process.env.LITELLM_BASE_URL = 'https://custom.gateway.url/v1';

		const result = await sendMessage(mockCtx, {
			projectId: 456,
			sessionId: 'sess-123',
			prompt: 'hi there',
		});

		expect(result).toEqual({
			status: 'success',
			data: {
				openai_response: 'hello',
				citations: [],
			},
		});
		expect(requestSpy).toHaveBeenCalledTimes(1);
		const call = requestSpy.mock.calls[0];
		expect(call).toBeDefined();
		if (call) {
			const [config, options] = call;
			const headers = config.HEADERS as Record<string, string>;
			expect(config.BASE).toBe('https://llm.corsair.dev/v1');
			expect(headers?.Authorization).toBe('Bearer gateway-key');
			expect(options.method).toBe('POST');
			expect(options.url).toBe('/chat/completions');
			expect(options.body).toEqual({
				model: 'gpt-5.4-mini',
				messages: [{ role: 'user', content: 'hi there' }],
			});
		}

		expect(logSpy).toHaveBeenCalledTimes(1);
		const logCall = logSpy.mock.calls[0];
		expect(logCall).toBeDefined();
		if (logCall) {
			expect(logCall[1]).toBe('customgpt.messages.send');
			expect(logCall[2]).toEqual({
				projectId: 456,
				sessionId: 'sess-123',
			});
			expect(logCall[2]).not.toHaveProperty('prompt');
		}
	});

	it('sendMessage ignores LITELLM_BASE_URL override and always uses default gateway URL', async () => {
		const mockGatewayResponse = {
			choices: [
				{
					message: { role: 'assistant', content: 'hello' },
				},
			],
			citations: [],
		};
		requestSpy.mockResolvedValueOnce(mockGatewayResponse);

		process.env.LITELLM_API_KEY = 'gateway-key';
		process.env.LITELLM_BASE_URL = 'https://custom.gateway.url/v1';

		await sendMessage(mockCtx, {
			projectId: 456,
			sessionId: 'sess-123',
			prompt: 'hi there',
		});

		const call = requestSpy.mock.calls[0];
		expect(call).toBeDefined();
		if (call) {
			const [config, options] = call;
			const headers = config.HEADERS as Record<string, string>;
			expect(config.BASE).toBe('https://llm.corsair.dev/v1');
			expect(options.url).toBe('/chat/completions');
			expect(headers?.Authorization).toBe('Bearer gateway-key');
		}
	});

	it('getMessages builds correct request', async () => {
		const mockResponse = {
			status: 'success',
			data: [],
		};
		requestSpy.mockResolvedValueOnce(mockResponse);

		const result = await getMessages(mockCtx, {
			projectId: 456,
			sessionId: 'sess-123',
			page: 3,
		});

		expect(result).toEqual(mockResponse);
		expect(requestSpy).toHaveBeenCalledTimes(1);
		const call = requestSpy.mock.calls[0];
		expect(call).toBeDefined();
		if (call) {
			const [config, options] = call;
			const headers = config.HEADERS as Record<string, string>;
			expect(config.BASE).toBe('https://app.customgpt.ai/api/v1');
			expect(headers?.Authorization).toBe('Bearer customgpt-test-key');
			expect(options.method).toBe('GET');
			expect(options.url).toBe('/projects/456/conversations/sess-123/messages');
			expect(options.query).toEqual({ page: 3 });
		}

		expect(logSpy).toHaveBeenCalledWith(
			mockCtx,
			'customgpt.messages.get',
			{ projectId: 456, sessionId: 'sess-123', page: 3 },
			'completed',
		);
	});
});

describe('CustomGPT error-handlers', () => {
	it('RATE_LIMIT_ERROR matches 429 errors', () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/projects' },
			{
				status: 429,
				statusText: 'Too Many Requests',
				ok: false,
				body: 'rate limit',
				url: 'https://app.customgpt.ai/api/v1/projects',
			},
			'rate limit',
		);

		const wrappedError = new CustomGPTAPIError('wrapped', 429, {
			cause: apiError,
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrappedError)).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate_limited')),
		).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('429'))).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('other'))).toBe(
			false,
		);
	});

	it('RATE_LIMIT_ERROR handler preserves retryAfter', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/projects' },
			{
				status: 429,
				statusText: 'Too Many Requests',
				ok: false,
				body: 'rate limit',
				url: 'https://app.customgpt.ai/api/v1/projects',
			},
			'rate limit',
		);
		Object.defineProperty(apiError, 'retryAfter', {
			value: 3500,
			writable: true,
		});

		const wrappedError = new CustomGPTAPIError('wrapped', 429, {
			cause: apiError,
		});

		const apiResult = await errorHandlers.RATE_LIMIT_ERROR.handler(apiError);
		expect(apiResult).toEqual({ maxRetries: 5, headersRetryAfterMs: 3500 });

		const wrappedResult =
			await errorHandlers.RATE_LIMIT_ERROR.handler(wrappedError);
		expect(wrappedResult).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 3500,
		});
	});
});
