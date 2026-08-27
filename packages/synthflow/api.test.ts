import {
	AgentsCreateInputSchema,
	AgentsCreateResponseSchema,
	AgentsListInputSchema,
	AgentsListResponseSchema,
	CallsCreateInputSchema,
	CallsCreateResponseSchema,
	CallsListInputSchema,
	CallsListResponseSchema,
	ContactsCreateInputSchema,
	ContactsCreateResponseSchema,
	KnowledgeBasesAttachInputSchema,
	KnowledgeBasesAttachResponseSchema,
} from './endpoints/types';
import { synthflow } from './index';

describe('Synthflow Plugin API Unit & Schema Tests', () => {
	describe('Plugin Configuration', () => {
		it('instantiates the synthflow plugin with default options', () => {
			const plugin = synthflow();
			expect(plugin.id).toBe('synthflow');
			expect(plugin.authConfig).toBeDefined();
			expect(plugin.endpoints).toBeDefined();
			expect(plugin.endpointMeta).toBeDefined();
			expect(plugin.endpointSchemas).toBeDefined();
			expect(plugin.schema).toBeDefined();
		});

		it('plugin returns key from keyBuilder when explicit key option is passed', async () => {
			const plugin = synthflow({ key: 'test-api-key-123' });
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
			const plugin = synthflow();
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
			const plugin = synthflow();
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
		describe('agents.create', () => {
			it('validates a valid agents.create input', () => {
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
				const parsed = AgentsCreateInputSchema.parse(input);
				expect(parsed.name).toBe('Test Voice Agent');
				expect(parsed.type).toBe('outbound');
				expect(parsed.agent.llm).toBe('gpt-4.1-Mini');
			});

			it('validates a valid agents.create response', () => {
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
				const parsed = AgentsCreateResponseSchema.parse(response);
				expect(parsed.status).toBe('success');
				expect(parsed.response?.model_id).toBe('agent_12345');
				expect(parsed.details?.phone).toBe('+15555550100');
			});
		});

		describe('agents.list', () => {
			it('validates agents.list input query params', () => {
				const input = { limit: 10, offset: 0 };
				const parsed = AgentsListInputSchema.parse(input);
				expect(parsed?.limit).toBe(10);
				expect(parsed?.offset).toBe(0);
			});

			it('validates empty agents.list input', () => {
				const parsed = AgentsListInputSchema.parse(undefined);
				expect(parsed).toBeUndefined();
			});

			it('validates agents.list response with array of assistants', () => {
				const response = {
					status: 'success',
					response: {
						pagination: {
							total_records: 1,
							limit: 20,
							offset: 0,
						},
						assistants: [
							{
								model_id: 'agent_12345',
								name: 'Support Agent',
								type: 'inbound',
							},
						],
					},
				};
				const parsed = AgentsListResponseSchema.parse(response);
				expect(parsed.status).toBe('success');
				expect(parsed.response?.pagination?.total_records).toBe(1);
				expect(Array.isArray(parsed.response?.assistants)).toBe(true);
			});
		});

		describe('calls.create', () => {
			it('validates calls.create input', () => {
				const input = {
					model_id: 'agent_12345',
					phone: '+15555550199',
					name: 'John Doe',
					from_phone_number: '+15555550100',
					custom_variables: [{ key: 'account_id', value: 'acc_987' }],
					lead_email: 'john@example.com',
				};
				const parsed = CallsCreateInputSchema.parse(input);
				expect(parsed.model_id).toBe('agent_12345');
				expect(parsed.phone).toBe('+15555550199');
				expect(parsed.name).toBe('John Doe');
			});

			it('validates calls.create response', () => {
				const response = {
					status: 'success',
					response: {
						answer: 'Call queued successfully',
						call_id: 'call_998877',
					},
					eta: '2s',
				};
				const parsed = CallsCreateResponseSchema.parse(response);
				expect(parsed.status).toBe('success');
				expect(parsed.response?.call_id).toBe('call_998877');
				expect(parsed.eta).toBe('2s');
			});
		});

		describe('calls.list', () => {
			it('validates calls.list input query params', () => {
				const input = {
					model_id: 'agent_12345',
					limit: 25,
					call_status: 'completed',
				};
				const parsed = CallsListInputSchema.parse(input);
				expect(parsed.model_id).toBe('agent_12345');
				expect(parsed.limit).toBe(25);
				expect(parsed.call_status).toBe('completed');
			});

			it('validates calls.list response', () => {
				const response = {
					status: 'success',
					response: {
						pagination: { total: 1 },
						calls: [
							{
								call_id: 'call_998877',
								status: 'completed',
								duration: 45,
							},
						],
					},
				};
				const parsed = CallsListResponseSchema.parse(response);
				expect(parsed.status).toBe('success');
				expect(Array.isArray(parsed.response?.calls)).toBe(true);
			});
		});

		describe('contacts.create', () => {
			it('validates contacts.create input', () => {
				const input = {
					name: 'Jane Smith',
					phone_number: '+15555550123',
					email: 'jane@example.com',
					contact_metadata: { vip: true },
				};
				const parsed = ContactsCreateInputSchema.parse(input);
				expect(parsed.name).toBe('Jane Smith');
				expect(parsed.phone_number).toBe('+15555550123');
				expect(parsed.email).toBe('jane@example.com');
			});

			it('validates contacts.create response', () => {
				const response = {
					status: 'success',
					response: {
						id: 'contact_456',
					},
				};
				const parsed = ContactsCreateResponseSchema.parse(response);
				expect(parsed.status).toBe('success');
				expect(parsed.response?.id).toBe('contact_456');
			});
		});

		describe('knowledgeBases.attach', () => {
			it('validates knowledgeBases.attach input', () => {
				const input = {
					knowledge_base_id: 'kb_789',
					model_id: 'agent_12345',
				};
				const parsed = KnowledgeBasesAttachInputSchema.parse(input);
				expect(parsed.knowledge_base_id).toBe('kb_789');
				expect(parsed.model_id).toBe('agent_12345');
			});

			it('validates knowledgeBases.attach response', () => {
				const response = {
					status: 'success',
					response: {
						body: 'Knowledge base attached',
						knowledge_base_id: 'kb_789',
						model_id: 'agent_12345',
					},
				};
				const parsed = KnowledgeBasesAttachResponseSchema.parse(response);
				expect(parsed.status).toBe('success');
				expect(parsed.response?.knowledge_base_id).toBe('kb_789');
				expect(parsed.response?.model_id).toBe('agent_12345');
			});
		});
	});
});
