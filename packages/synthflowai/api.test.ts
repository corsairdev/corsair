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
	it.each([
		[
			'assistants.create',
			() =>
				Assistants.create(ctx, {
					type: 'outbound',
					name: 'Sales',
					agent: {
						prompt: 'p',
						greeting_message: 'hi',
						llm: 'gpt-4.1',
						language: 'en-US',
						voice_id: 'v1',
					},
				}),
			'POST',
			'assistants',
		],
		[
			'assistants.list',
			() => Assistants.list(ctx, { limit: 10, offset: 0 }),
			'GET',
			'assistants/',
		],
		[
			'assistants.get',
			() => Assistants.get(ctx, { model_id: 'a1' }),
			'GET',
			'assistants/a1',
		],
		[
			'assistants.update',
			() => Assistants.update(ctx, { assistant_id: 'a1', name: 'N' }),
			'PUT',
			'assistants/a1',
		],
		[
			'assistants.delete',
			() => Assistants.deleteAssistant(ctx, { model_id: 'a1' }),
			'DELETE',
			'assistants/a1',
		],
		[
			'calls.create',
			() =>
				Calls.create(ctx, {
					model_id: 'a1',
					phone: '+15555550100',
					name: 'Pat',
				}),
			'POST',
			'calls',
		],
		[
			'calls.list',
			() => Calls.list(ctx, { model_id: 'a1', limit: 20 }),
			'GET',
			'calls',
		],
		['calls.get', () => Calls.get(ctx, { call_id: 'c1' }), 'GET', 'calls/c1'],
		[
			'contacts.create',
			() =>
				Contacts.create(ctx, {
					name: 'Pat',
					phone_number: '+15555550100',
				}),
			'POST',
			'contacts',
		],
		[
			'contacts.list',
			() => Contacts.list(ctx, { search: '+1555' }),
			'GET',
			'contacts',
		],
		[
			'contacts.get',
			() => Contacts.get(ctx, { contact_id: 'ct1' }),
			'GET',
			'contacts/ct1',
		],
		[
			'contacts.update',
			() => Contacts.update(ctx, { contact_id: 'ct1', name: 'Pat' }),
			'PATCH',
			'contacts/ct1',
		],
		[
			'contacts.delete',
			() => Contacts.deleteContact(ctx, { contact_id: 'ct1' }),
			'DELETE',
			'contacts/ct1',
		],
		[
			'knowledgeBases.create',
			() =>
				KnowledgeBases.create(ctx, {
					name: 'Docs',
					rag_use_condition: 'product questions',
				}),
			'POST',
			'knowledge_base',
		],
		[
			'knowledgeBases.get',
			() => KnowledgeBases.get(ctx, { knowledge_base_id: 'kb1' }),
			'GET',
			'knowledge_base/kb1',
		],
		[
			'knowledgeBases.update',
			() =>
				KnowledgeBases.update(ctx, {
					knowledge_base_id: 'kb1',
					name: 'Docs',
				}),
			'PUT',
			'knowledge_base/kb1',
		],
		[
			'knowledgeBases.delete',
			() =>
				KnowledgeBases.deleteKnowledgeBase(ctx, {
					knowledge_base_id: 'kb1',
				}),
			'DELETE',
			'knowledge_base/kb1',
		],
		[
			'knowledgeBases.attach',
			() =>
				KnowledgeBases.attach(ctx, {
					knowledge_base_id: 'kb1',
					model_id: 'a1',
				}),
			'POST',
			'knowledge_base/kb1/attach',
		],
		[
			'knowledgeBases.detach',
			() =>
				KnowledgeBases.detach(ctx, {
					knowledge_base_id: 'kb1',
					model_id: 'a1',
				}),
			'POST',
			'knowledge_base/kb1/detach',
		],
		[
			'memoryStores.create',
			() => MemoryStores.create(ctx, { title: 'Store' }),
			'POST',
			'memory_stores',
		],
		[
			'memoryStores.get',
			() => MemoryStores.get(ctx, { memory_store_id: 'ms1' }),
			'GET',
			'memory_stores/ms1',
		],
		[
			'memoryStores.list',
			() => MemoryStores.list(ctx, { title: 'Store' }),
			'GET',
			'memory_stores',
		],
		[
			'memoryStores.update',
			() =>
				MemoryStores.update(ctx, {
					memory_store_id: 'ms1',
					title: 'Updated',
				}),
			'PATCH',
			'memory_stores/ms1',
		],
		[
			'memoryStores.delete',
			() => MemoryStores.deleteMemoryStore(ctx, { memory_store_id: 'ms1' }),
			'DELETE',
			'memory_stores/ms1',
		],
		[
			'memoryStores.attachToAgent',
			() =>
				MemoryStores.attachToAgent(ctx, {
					memory_store_id: 'ms1',
					model_id: 'a1',
				}),
			'POST',
			'memory_stores/ms1/attach',
		],
		[
			'memoryStores.detachFromAgent',
			() =>
				MemoryStores.detachFromAgent(ctx, {
					memory_store_id: 'ms1',
					model_id: 'a1',
				}),
			'POST',
			'memory_stores/ms1/detach',
		],
		[
			'phoneBooks.create',
			() => PhoneBooks.create(ctx, { name: 'Sales' }),
			'POST',
			'phonebooks',
		],
		[
			'phoneBooks.list',
			() => PhoneBooks.list(ctx, undefined),
			'GET',
			'phonebooks',
		],
		[
			'phoneBooks.delete',
			() => PhoneBooks.deletePhoneBook(ctx, { phone_book_id: 'pb1' }),
			'DELETE',
			'phonebooks/pb1',
		],
		[
			'actions.create',
			() =>
				Actions.create(ctx, {
					SEND_SMS: { content: 'hi', instructions: 'send after booking' },
				}),
			'POST',
			'actions',
		],
		['actions.list', () => Actions.list(ctx, { limit: 20 }), 'GET', 'actions'],
		[
			'actions.get',
			() => Actions.get(ctx, { action_id: 'ac1' }),
			'GET',
			'actions/ac1',
		],
		[
			'actions.update',
			() =>
				Actions.update(ctx, {
					action_id: 'ac1',
					SEND_SMS: { content: 'hi', instructions: 'send' },
				}),
			'PUT',
			'actions/ac1',
		],
		[
			'actions.delete',
			() => Actions.deleteAction(ctx, { action_id: 'ac1' }),
			'DELETE',
			'actions/ac1',
		],
		[
			'actions.attach',
			() => Actions.attach(ctx, { model_id: 'a1', actions: ['ac1'] }),
			'POST',
			'actions/attach',
		],
		[
			'actions.detach',
			() => Actions.detach(ctx, { model_id: 'a1', action_ids: ['ac1'] }),
			'POST',
			'actions/detach',
		],
		[
			'voices.list',
			() => Voices.list(ctx, { workspace: 'ws1', provider: 'elevenlabs' }),
			'GET',
			'voices',
		],
	] as const)('%s %s %s', async (_name, call, method, path) => {
		await call();
		const options = lastCall();
		expect(options?.method).toBe(method);
		expect(options?.url).toBe(path);
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
