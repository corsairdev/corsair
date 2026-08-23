import {
	CustomGPTEndpointInputSchemas,
	CustomGPTEndpointOutputSchemas,
} from './endpoints/types';
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
