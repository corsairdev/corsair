import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	makeSynthflowAiRequest,
	SynthflowAiAPIError,
	SynthflowAiRateLimitError,
} from './client';
import * as Actions from './endpoints/actions';
import * as Assistants from './endpoints/assistants';
import * as Calls from './endpoints/calls';
import * as Contacts from './endpoints/contacts';
import * as KnowledgeBases from './endpoints/knowledge-bases';
import * as MemoryStores from './endpoints/memory-stores';
import * as PhoneBooks from './endpoints/phone-books';
import {
	ActionsAttachInputSchema,
	ActionsCreateInputSchema,
	AssistantsCreateInputSchema,
	CallsCreateResponseSchema,
	SynthflowAiEndpointInputSchemas,
	SynthflowAiEndpointOutputSchemas,
	VoicesListInputSchema,
} from './endpoints/types';
import * as Voices from './endpoints/voices';
import { errorHandlers } from './error-handlers';
import { synthflowai } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

beforeEach(() => {
	mockRequest.mockReset();
	jest.mocked(logEventFromContext).mockReset();
	mockRequest.mockResolvedValue({ status: 'ok' } as never);
});

const ctx = {
	key: 'test-api-key',
	$getAccountId: async () => 'test-account',
} as never;

function lastCall() {
	expect(mockRequest).toHaveBeenCalled();
	const call = mockRequest.mock.calls[0];
	expect(call).toBeDefined();
	return call?.[1];
}

describe('SynthflowAi plugin', () => {
	it('instantiates with api_key auth and 37 endpoints', () => {
		const plugin = synthflowai();
		expect(plugin.id).toBe('synthflowai');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(37);
	});

	it('returns an explicit key from keyBuilder', async () => {
		const plugin = synthflowai({ key: 'explicit-key' });
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('explicit-key');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const plugin = synthflowai();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('official Platform API v2 request mapping', () => {
	const agent = {
		prompt: 'p',
		greeting_message: 'hi',
		llm: 'gpt-4.1',
		language: 'en-US',
		voice_id: 'v1',
	};

	it.each([
		[
			'assistants.create',
			'POST',
			'assistants',
			() =>
				Assistants.create(ctx, {
					type: 'outbound',
					name: 'Sales',
					agent,
				}),
			{ body: { type: 'outbound', name: 'Sales', agent } },
		],
		[
			'assistants.list',
			'GET',
			'assistants/',
			() => Assistants.list(ctx, { limit: 10, offset: 0 }),
			{ query: { limit: 10, offset: 0 } },
		],
		[
			'assistants.get',
			'GET',
			'assistants/a1',
			() => Assistants.get(ctx, { model_id: 'a1' }),
			{},
		],
		[
			'assistants.update',
			'PUT',
			'assistants/a1',
			() => Assistants.update(ctx, { assistant_id: 'a1', name: 'N' }),
			{ body: { name: 'N' } },
		],
		[
			'assistants.delete',
			'DELETE',
			'assistants/a1',
			() => Assistants.deleteAssistant(ctx, { model_id: 'a1' }),
			{},
		],
		[
			'calls.create',
			'POST',
			'calls',
			() =>
				Calls.create(ctx, {
					model_id: 'a1',
					phone: '+15555550100',
					name: 'Pat',
				}),
			{
				body: { model_id: 'a1', phone: '+15555550100', name: 'Pat' },
			},
		],
		[
			'calls.list',
			'GET',
			'calls',
			() => Calls.list(ctx, { model_id: 'a1', limit: 20 }),
			{ query: { model_id: 'a1', limit: 20 } },
		],
		[
			'calls.get',
			'GET',
			'calls/c1',
			() => Calls.get(ctx, { call_id: 'c1' }),
			{},
		],
		[
			'contacts.create',
			'POST',
			'contacts',
			() =>
				Contacts.create(ctx, {
					name: 'Pat',
					phone_number: '+15555550100',
				}),
			{ body: { name: 'Pat', phone_number: '+15555550100' } },
		],
		[
			'contacts.list',
			'GET',
			'contacts',
			() => Contacts.list(ctx, { search: '+1555' }),
			{ query: { search: '+1555' } },
		],
		[
			'contacts.get',
			'GET',
			'contacts/ct1',
			() => Contacts.get(ctx, { contact_id: 'ct1' }),
			{},
		],
		[
			'contacts.update',
			'PATCH',
			'contacts/ct1',
			() => Contacts.update(ctx, { contact_id: 'ct1', name: 'Pat' }),
			{ body: { name: 'Pat' } },
		],
		[
			'contacts.delete',
			'DELETE',
			'contacts/ct1',
			() => Contacts.deleteContact(ctx, { contact_id: 'ct1' }),
			{},
		],
		[
			'knowledgeBases.create',
			'POST',
			'knowledge_base',
			() =>
				KnowledgeBases.create(ctx, {
					name: 'Docs',
					rag_use_condition: 'product questions',
				}),
			{ body: { name: 'Docs', rag_use_condition: 'product questions' } },
		],
		[
			'knowledgeBases.get',
			'GET',
			'knowledge_base/kb1',
			() => KnowledgeBases.get(ctx, { knowledge_base_id: 'kb1' }),
			{},
		],
		[
			'knowledgeBases.update',
			'PUT',
			'knowledge_base/kb1',
			() =>
				KnowledgeBases.update(ctx, {
					knowledge_base_id: 'kb1',
					name: 'Docs',
				}),
			{ body: { name: 'Docs' } },
		],
		[
			'knowledgeBases.delete',
			'DELETE',
			'knowledge_base/kb1',
			() =>
				KnowledgeBases.deleteKnowledgeBase(ctx, {
					knowledge_base_id: 'kb1',
				}),
			{},
		],
		[
			'knowledgeBases.attach',
			'POST',
			'knowledge_base/kb1/attach',
			() =>
				KnowledgeBases.attach(ctx, {
					knowledge_base_id: 'kb1',
					model_id: 'a1',
				}),
			{ query: { model_id: 'a1' } },
		],
		[
			'knowledgeBases.detach',
			'POST',
			'knowledge_base/kb1/detach',
			() =>
				KnowledgeBases.detach(ctx, {
					knowledge_base_id: 'kb1',
					model_id: 'a1',
				}),
			{ query: { model_id: 'a1' } },
		],
		[
			'memoryStores.create',
			'POST',
			'memory_stores',
			() => MemoryStores.create(ctx, { title: 'Store' }),
			{ body: { title: 'Store' } },
		],
		[
			'memoryStores.get',
			'GET',
			'memory_stores/ms1',
			() => MemoryStores.get(ctx, { memory_store_id: 'ms1' }),
			{},
		],
		[
			'memoryStores.list',
			'GET',
			'memory_stores',
			() => MemoryStores.list(ctx, { title: 'Store' }),
			{ query: { title: 'Store' } },
		],
		[
			'memoryStores.update',
			'PATCH',
			'memory_stores/ms1',
			() =>
				MemoryStores.update(ctx, {
					memory_store_id: 'ms1',
					title: 'Updated',
				}),
			{ body: { title: 'Updated' } },
		],
		[
			'memoryStores.delete',
			'DELETE',
			'memory_stores/ms1',
			() => MemoryStores.deleteMemoryStore(ctx, { memory_store_id: 'ms1' }),
			{},
		],
		[
			'memoryStores.attachToAgent',
			'POST',
			'memory_stores/ms1/attach',
			() =>
				MemoryStores.attachToAgent(ctx, {
					memory_store_id: 'ms1',
					model_id: 'a1',
				}),
			{ query: { model_id: 'a1' } },
		],
		[
			'memoryStores.detachFromAgent',
			'POST',
			'memory_stores/ms1/detach',
			() =>
				MemoryStores.detachFromAgent(ctx, {
					memory_store_id: 'ms1',
					model_id: 'a1',
				}),
			{ query: { model_id: 'a1' } },
		],
		[
			'phoneBooks.create',
			'POST',
			'phonebooks',
			() => PhoneBooks.create(ctx, { name: 'Sales' }),
			{ body: { name: 'Sales' } },
		],
		[
			'phoneBooks.list',
			'GET',
			'phonebooks',
			() => PhoneBooks.list(ctx, undefined),
			{ query: {} },
		],
		[
			'phoneBooks.delete',
			'DELETE',
			'phonebooks/pb1',
			() => PhoneBooks.deletePhoneBook(ctx, { phone_book_id: 'pb1' }),
			{},
		],
		[
			'actions.create',
			'POST',
			'actions',
			() =>
				Actions.create(ctx, {
					SEND_SMS: { content: 'hi', instructions: 'send after booking' },
				}),
			{
				body: {
					SEND_SMS: { content: 'hi', instructions: 'send after booking' },
				},
			},
		],
		[
			'actions.list',
			'GET',
			'actions',
			() => Actions.list(ctx, { limit: 20 }),
			{ query: { limit: 20 } },
		],
		[
			'actions.get',
			'GET',
			'actions/ac1',
			() => Actions.get(ctx, { action_id: 'ac1' }),
			{},
		],
		[
			'actions.update',
			'PUT',
			'actions/ac1',
			() =>
				Actions.update(ctx, {
					action_id: 'ac1',
					SEND_SMS: { content: 'hi', instructions: 'send' },
				}),
			{ body: { SEND_SMS: { content: 'hi', instructions: 'send' } } },
		],
		[
			'actions.delete',
			'DELETE',
			'actions/ac1',
			() => Actions.deleteAction(ctx, { action_id: 'ac1' }),
			{},
		],
		[
			'actions.attach',
			'POST',
			'actions/attach',
			() => Actions.attach(ctx, { model_id: 'a1', actions: ['ac1'] }),
			{ body: { model_id: 'a1', actions: ['ac1'] } },
		],
		[
			'actions.detach',
			'POST',
			'actions/detach',
			() => Actions.detach(ctx, { model_id: 'a1', action_ids: ['ac1'] }),
			{ body: { model_id: 'a1', actions: ['ac1'] } },
		],
		[
			'voices.list',
			'GET',
			'voices',
			() => Voices.list(ctx, { workspace: 'ws1', provider: 'elevenlabs' }),
			{ query: { workspace: 'ws1', provider: 'elevenlabs' } },
		],
	])('%s %s %s', async (_name, method, path, call, extra) => {
		await (call as () => Promise<unknown>)();
		const options = lastCall();
		expect(options?.method).toBe(method);
		expect(options?.url).toBe(path);
		const mapped = extra as { query?: unknown; body?: unknown };
		if (mapped.query !== undefined) {
			expect(options?.query).toEqual(mapped.query);
		}
		if (mapped.body !== undefined) {
			expect(options?.body).toEqual(mapped.body);
		}
	});

	it('maps action_ids alias to official actions body', async () => {
		await Actions.attach(ctx, { model_id: 'a1', action_ids: ['ac1', 'ac2'] });
		expect(lastCall()?.body).toEqual({
			model_id: 'a1',
			actions: ['ac1', 'ac2'],
		});
	});

	it('sends workspace on GET /voices', async () => {
		await Voices.list(ctx, { workspace: 'ws1' });
		expect(lastCall()?.query).toMatchObject({ workspace: 'ws1' });
	});

	it('sends model_id on GET /calls', async () => {
		await Calls.list(ctx, { model_id: 'a1' });
		expect(lastCall()?.query).toMatchObject({ model_id: 'a1' });
	});
});

describe('schemas', () => {
	it('accepts official assistants.create input', () => {
		const parsed = AssistantsCreateInputSchema.parse({
			type: 'outbound',
			name: 'Sales Assistant',
			agent: {
				prompt: 'You are helpful',
				greeting_message: 'Hello',
				llm: 'gpt-4.1-Mini',
				language: 'en-US',
				voice_id: 'eleven_turbo_v2',
			},
		});
		expect(parsed.name).toBe('Sales Assistant');
	});

	it('parses official POST /calls eta as integer seconds', () => {
		const parsed = CallsCreateResponseSchema.parse({
			status: 'ok',
			response: { call_id: 'c1', answer: 'queued' },
			eta: 2,
		});
		expect(parsed.eta).toBe(2);
	});

	it('accepts official create-action SEND_SMS body', () => {
		const parsed = ActionsCreateInputSchema.parse({
			SEND_SMS: { content: 'Thanks', instructions: 'after booking' },
		});
		expect(parsed.SEND_SMS?.content).toBe('Thanks');
	});

	it('requires workspace on voices.list', () => {
		expect(() => VoicesListInputSchema.parse({})).toThrow();
		expect(VoicesListInputSchema.parse({ workspace: 'ws1' }).workspace).toBe(
			'ws1',
		);
	});

	it('accepts official attach-action actions array', () => {
		const parsed = ActionsAttachInputSchema.parse({
			model_id: 'a1',
			actions: ['ac1'],
		});
		expect(parsed.actions).toEqual(['ac1']);
	});

	it('registers input and output schemas for every endpoint', () => {
		const keys = Object.keys(SynthflowAiEndpointInputSchemas);
		expect(keys).toHaveLength(37);
		for (const key of keys) {
			expect(
				SynthflowAiEndpointOutputSchemas[
					key as keyof typeof SynthflowAiEndpointOutputSchemas
				],
			).toBeDefined();
		}
	});
});

describe('rate-limit and auth errors', () => {
	it('preserves Retry-After on HTTP 429', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: 'assistants/' },
				{
					url: 'https://api.synthflow.ai/v2/assistants/',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { message: 'Too Many Requests' },
				},
				'Too Many Requests',
				{ retryAfter: 1500 },
			),
		);

		const err = await makeSynthflowAiRequest('assistants/', 'k').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(SynthflowAiRateLimitError);
		expect((err as SynthflowAiRateLimitError).retryAfterMs).toBe(1500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err as Error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(err as Error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 1500 });
	});

	it('maps 401 to AUTH_ERROR with no retry', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: 'assistants/' },
				{
					url: 'https://api.synthflow.ai/v2/assistants/',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { message: 'unauthorized' },
				},
				'Unauthorized',
			),
		);
		const err = await makeSynthflowAiRequest('assistants/', 'bad').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(SynthflowAiAPIError);
		expect((err as SynthflowAiAPIError).status).toBe(401);
		expect(errorHandlers.AUTH_ERROR.match(err as Error)).toBe(true);
	});
});
