import {
	ActionsAttachInputSchema,
	ActionsCreateInputSchema,
	AssistantsCreateInputSchema,
	AssistantsCreateResponseSchema,
	AssistantsListInputSchema,
	AssistantsListResponseSchema,
	CallsCreateInputSchema,
	CallsCreateResponseSchema,
	CallsListInputSchema,
	CallsListResponseSchema,
	ContactsCreateInputSchema,
	ContactsCreateResponseSchema,
	KnowledgeBasesAttachInputSchema,
	KnowledgeBasesAttachResponseSchema,
	MemoryStoresCreateInputSchema,
	PhoneBooksCreateInputSchema,
	VoicesListInputSchema,
} from './endpoints/types';
import { synthflowai } from './index';

describe('SynthflowAi Plugin API Unit & Schema Tests', () => {
	describe('Plugin Configuration', () => {
		it('instantiates the synthflowai plugin with default options', () => {
			const plugin = synthflowai();
			expect(plugin.id).toBe('synthflowai');
			expect(plugin.authConfig).toBeDefined();
			expect(plugin.endpoints).toBeDefined();
			expect(plugin.endpointMeta).toBeDefined();
			expect(plugin.endpointSchemas).toBeDefined();
			expect(plugin.schema).toBeDefined();
		});

		it('plugin returns key from keyBuilder when explicit key option is passed', async () => {
			const plugin = synthflowai({ key: 'test-api-key-123' });
			const ctx = {
				authType: 'api_key' as const,
				keys: {
					get_api_key: async () => 'key-from-storage',
				},
			};
			const keyBuilder = plugin.keyBuilder as any;
			const builtKey = await keyBuilder(ctx, 'endpoint');
			expect(builtKey).toBe('test-api-key-123');
		});

		it('plugin retrieves key from storage when no explicit key is passed', async () => {
			const plugin = synthflowai();
			const ctx = {
				authType: 'api_key' as const,
				keys: {
					get_api_key: async () => 'stored-synthflow-key',
				},
			};
			const keyBuilder = plugin.keyBuilder as any;
			const builtKey = await keyBuilder(ctx, 'endpoint');
			expect(builtKey).toBe('stored-synthflow-key');
		});

		it('plugin throws AuthMissingError when key is missing in storage', async () => {
			const plugin = synthflowai();
			const ctx = {
				authType: 'api_key' as const,
				keys: {
					get_api_key: async () => undefined,
				},
			};
			const keyBuilder = plugin.keyBuilder as any;
			await expect(keyBuilder(ctx, 'endpoint')).rejects.toThrow();
		});
	});

	describe('Endpoint Input and Output Schemas', () => {
		describe('assistants', () => {
			it('validates a valid assistants.create input', () => {
				const input = {
					type: 'outbound' as const,
					name: 'Test Voice Agent',
					agent: {
						prompt: 'You are a helpful assistant',
						greeting_message: 'Hello, how can I help you today?',
						llm: 'gpt-4.1-Mini',
						language: 'en-US',
						voice_id: 'eleven_turbo_v2',
					},
					description: 'Demo test agent',
					phone_number: '+15555550100',
					is_recording: true,
				};
				const parsed = AssistantsCreateInputSchema.parse(input);
				expect(parsed.name).toBe('Test Voice Agent');
				expect(parsed.type).toBe('outbound');
				expect(parsed.agent.llm).toBe('gpt-4.1-Mini');
			});

			it('validates a valid assistants.create response', () => {
				const response = {
					status: 'success',
					response: {
						model_id: 'agent_12345',
					},
					details: {
						phone: '+15555550100',
						voice: 'eleven_turbo_v2',
					},
				};
				const parsed = AssistantsCreateResponseSchema.parse(response);
				expect(parsed.status).toBe('success');
				expect(parsed.response?.model_id).toBe('agent_12345');
				expect(parsed.details?.phone).toBe('+15555550100');
			});

			it('validates assistants.list query options', () => {
				const parsed = AssistantsListInputSchema.parse({
					limit: 10,
					offset: 0,
				});
				expect(parsed?.limit).toBe(10);
				expect(parsed?.offset).toBe(0);
			});

			it('validates assistants.list response payload', () => {
				const response = {
					status: 'success',
					response: {
						pagination: { total_records: 1, limit: 20, offset: 0 },
						assistants: [{ model_id: 'agent_1', name: 'Agent 1' }],
					},
				};
				const parsed = AssistantsListResponseSchema.parse(response);
				expect(parsed.status).toBe('success');
				expect(parsed.response?.pagination?.total_records).toBe(1);
			});
		});

		describe('calls', () => {
			it('validates calls.create input and response', () => {
				const input = {
					model_id: 'agent_12345',
					phone: '+15555550199',
					name: 'John Doe',
					from_phone_number: '+15555550100',
					custom_variables: [{ key: 'account_id', value: 'acc_987' }],
					lead_email: 'john@example.com',
				};
				const parsedInput = CallsCreateInputSchema.parse(input);
				expect(parsedInput.model_id).toBe('agent_12345');
				expect(parsedInput.phone).toBe('+15555550199');

				const response = {
					status: 'success',
					response: { answer: 'Queued', call_id: 'call_9988' },
					eta: '2s',
				};
				const parsedResp = CallsCreateResponseSchema.parse(response);
				expect(parsedResp.response?.call_id).toBe('call_9988');
			});

			it('validates calls.list input and response', () => {
				const input = { model_id: 'agent_12345', limit: 20 };
				const parsed = CallsListInputSchema.parse(input);
				expect(parsed.model_id).toBe('agent_12345');

				const response = {
					status: 'success',
					response: { calls: [{ call_id: 'call_9988' }] },
				};
				const parsedResp = CallsListResponseSchema.parse(response);
				expect(parsedResp.response?.calls?.length).toBe(1);
			});
		});

		describe('contacts', () => {
			it('validates contacts.create input and response', () => {
				const input = {
					name: 'Jane Smith',
					phone_number: '+15555550123',
					email: 'jane@example.com',
				};
				const parsedInput = ContactsCreateInputSchema.parse(input);
				expect(parsedInput.name).toBe('Jane Smith');

				const response = { status: 'success', response: { id: 'contact_1' } };
				const parsedResp = ContactsCreateResponseSchema.parse(response);
				expect(parsedResp.response?.id).toBe('contact_1');
			});
		});

		describe('knowledgeBases', () => {
			it('validates knowledgeBases.attach input and response', () => {
				const input = {
					knowledge_base_id: 'kb_123',
					model_id: 'agent_12345',
				};
				const parsedInput = KnowledgeBasesAttachInputSchema.parse(input);
				expect(parsedInput.knowledge_base_id).toBe('kb_123');

				const response = {
					status: 'success',
					response: { knowledge_base_id: 'kb_123', model_id: 'agent_12345' },
				};
				const parsedResp = KnowledgeBasesAttachResponseSchema.parse(response);
				expect(parsedResp.response?.knowledge_base_id).toBe('kb_123');
			});
		});

		describe('memoryStores, phoneBooks, actions, voices', () => {
			it('validates memoryStores.create input', () => {
				const input = { title: 'User memory', description: 'Store user info' };
				const parsed = MemoryStoresCreateInputSchema.parse(input);
				expect(parsed.title).toBe('User memory');
			});

			it('validates phoneBooks.create input', () => {
				const input = { name: 'Support Numbers' };
				const parsed = PhoneBooksCreateInputSchema.parse(input);
				expect(parsed.name).toBe('Support Numbers');
			});

			it('validates actions.create and actions.attach input', () => {
				const input = { name: 'Book appointment', type: 'booking' };
				const parsed = ActionsCreateInputSchema.parse(input);
				expect(parsed.type).toBe('booking');

				const attachInput = {
					model_id: 'agent_1',
					action_ids: ['action_1', 'action_2'],
				};
				const parsedAttach = ActionsAttachInputSchema.parse(attachInput);
				expect(parsedAttach.action_ids.length).toBe(2);
			});

			it('validates voices.list input', () => {
				const input = { limit: 50 };
				const parsed = VoicesListInputSchema.parse(input);
				expect(parsed?.limit).toBe(50);
			});
		});
	});
});
