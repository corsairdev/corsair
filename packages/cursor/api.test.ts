import 'dotenv/config';
import { makeCursorRequest } from './client';
import type {
	AccountGetMeResponse,
	AgentsGetConversationResponse,
	AgentsListResponse,
	ModelsListResponse,
	RepositoriesListResponse,
} from './endpoints/types';
import { CursorEndpointOutputSchemas } from './endpoints/types';

const CURSOR_API_KEY = process.env.CURSOR_API_KEY!;

describe('Cursor API Type Tests', () => {
	describe('account', () => {
		it('accountGetMe returns correct type', async () => {
			const response = await makeCursorRequest<AccountGetMeResponse>(
				'me',
				CURSOR_API_KEY,
			);

			const result = CursorEndpointOutputSchemas.accountGetMe.parse(response);

			expect(result.apiKeyName).toBeDefined();
			expect(typeof result.apiKeyName).toBe('string');
			expect(result.createdAt).toBeDefined();
			expect(typeof result.createdAt).toBe('string');
		});
	});

	describe('models', () => {
		it('modelsList returns correct type', async () => {
			const response = await makeCursorRequest<ModelsListResponse>(
				'models',
				CURSOR_API_KEY,
			);

			const result = CursorEndpointOutputSchemas.modelsList.parse(response);

			expect(result.models).toBeDefined();
			expect(Array.isArray(result.models)).toBe(true);
			result.models.forEach((model) => {
				expect(typeof model).toBe('string');
			});
		});
	});

	describe('repositories', () => {
		it('repositoriesList returns correct type', async () => {
			const response = await makeCursorRequest<RepositoriesListResponse>(
				'repositories',
				CURSOR_API_KEY,
			);

			const result =
				CursorEndpointOutputSchemas.repositoriesList.parse(response);

			expect(result.repositories).toBeDefined();
			expect(Array.isArray(result.repositories)).toBe(true);
			result.repositories.forEach((repo) => {
				if (repo.name !== undefined) expect(typeof repo.name).toBe('string');
				if (repo.owner !== undefined) expect(typeof repo.owner).toBe('string');
				if (repo.repository !== undefined)
					expect(typeof repo.repository).toBe('string');
			});
		});
	});

	describe('agents', () => {
		it('agentsList returns correct type', async () => {
			const response = await makeCursorRequest<AgentsListResponse>(
				'agents',
				CURSOR_API_KEY,
				{ query: { limit: 10 } },
			);

			const result = CursorEndpointOutputSchemas.agentsList.parse(response);

			expect(result.agents).toBeDefined();
			expect(Array.isArray(result.agents)).toBe(true);
			result.agents.forEach((agent) => {
				if (agent.id !== undefined) expect(typeof agent.id).toBe('string');
				if (agent.status !== undefined) {
					expect([
						'RUNNING',
						'FINISHED',
						'ERROR',
						'CREATING',
						'EXPIRED',
					]).toContain(agent.status);
				}
			});
		});

		it('agentsGetConversation returns correct type', async () => {
			const agentsListResponse = await makeCursorRequest<AgentsListResponse>(
				'agents',
				CURSOR_API_KEY,
				{ query: { limit: 1 } },
			);

			const agentId = agentsListResponse.agents[0]?.id;
			if (!agentId) {
				console.warn('No agents found, skipping agentsGetConversation test');
				return;
			}

			const response = await makeCursorRequest<AgentsGetConversationResponse>(
				`agents/${agentId}/conversation`,
				CURSOR_API_KEY,
			);

			const result =
				CursorEndpointOutputSchemas.agentsGetConversation.parse(response);

			expect(result.id).toBeDefined();
			expect(typeof result.id).toBe('string');
			expect(result.messages).toBeDefined();
			expect(Array.isArray(result.messages)).toBe(true);
			result.messages.forEach((msg) => {
				if (msg.type !== undefined) {
					expect(['user_message', 'assistant_message']).toContain(msg.type);
				}
				if (msg.text !== undefined) expect(typeof msg.text).toBe('string');
			});
		});
	});
});
