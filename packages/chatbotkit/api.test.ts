import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeChatbotkitRequest } from './client';
import {
	BlueprintSchema,
	BotSchema,
	ConversationSchema,
	DatasetSchema,
	FileSchema,
	SecretSchema,
	SkillsetSchema,
	TaskSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { ChatbotkitContext } from './index';
import { chatbotkit, chatbotkitEndpointSchemas } from './index';

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
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const mockCtx = {
	key: 'sk-test-api-key',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
	keyBuilder: async () => 'sk-test-api-key',
} as unknown as ChatbotkitContext;

const botFixture = {
	id: 'bot_1',
	name: 'Support Bot',
	description: 'A test bot',
	model: 'gpt-4o',
	backstory: 'Helpful support agent',
	privacy: true,
	moderation: false,
	visibility: 'private',
	createdAt: 1787397742217,
	updatedAt: 1787397742217,
};

const datasetFixture = {
	id: 'dataset_1',
	name: 'FAQ Dataset',
	description: 'Knowledge dataset',
	visibility: 'private',
	createdAt: 1787397740293,
	updatedAt: 1787397740293,
};

const skillsetFixture = {
	id: 'skillset_1',
	name: 'Support Tools',
	description: 'Skillset with tools',
	state: 'enabled',
	visibility: 'private',
	createdAt: 1787397739735,
	updatedAt: 1787397739735,
};

const blueprintFixture = {
	id: 'blueprint_1',
	name: 'Template',
	description: 'Blueprint template',
	visibility: 'private',
	createdAt: 1787397739259,
	updatedAt: 1787397739259,
};

const secretFixture = {
	id: 'secret_1',
	name: 'Gmail API Key',
	kind: 'personal',
	type: 'template',
	visibility: 'private',
	createdAt: 1787397890820,
	updatedAt: 1787397890820,
};

const conversationFixture = {
	id: 'conv_1',
	name: 'Test Conversation',
	visibility: 'private',
	createdAt: 1787397890820,
	updatedAt: 1787397890820,
};

const fileFixture = {
	id: 'file_1',
	name: 'document.pdf',
	mimeType: 'application/pdf',
	size: 1024,
	createdAt: 1787397890820,
	updatedAt: 1787397890820,
};

const taskFixture = {
	id: 'task_1',
	name: 'Nightly Sync',
	schedule: '0 0 * * *',
	status: 'active',
	createdAt: 1787397890820,
	updatedAt: 1787397890820,
};

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return name ?? 'none';
}

function httpError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.chatbotkit.com/v1/bot/list' },
		{
			url: 'https://api.chatbotkit.com/v1/bot/list',
			ok: false,
			status,
			statusText: 'Error',
			body: { message },
		},
		message,
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema Unit Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('ChatBotKit Zod Schemas', () => {
	it('validates a complete Bot object and rejects invalid', () => {
		const parsed = BotSchema.safeParse(botFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.id).toBe('bot_1');
			expect(parsed.data.name).toBe('Support Bot');
			expect(parsed.data.privacy).toBe(true);
			expect(parsed.data.moderation).toBe(false);
		}
		expect(BotSchema.safeParse({ id: 123 }).success).toBe(false);
	});

	it('validates a complete Dataset object and rejects invalid', () => {
		const parsed = DatasetSchema.safeParse(datasetFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.id).toBe('dataset_1');
			expect(parsed.data.name).toBe('FAQ Dataset');
			expect(parsed.data.visibility).toBe('private');
		}
		expect(DatasetSchema.safeParse({ id: 123 }).success).toBe(false);
	});

	it('validates a complete Skillset object and rejects invalid', () => {
		const parsed = SkillsetSchema.safeParse(skillsetFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.id).toBe('skillset_1');
			expect(parsed.data.name).toBe('Support Tools');
			expect(parsed.data.state).toBe('enabled');
		}
		expect(SkillsetSchema.safeParse({ id: 123 }).success).toBe(false);
	});

	it('validates a complete Blueprint object and rejects invalid', () => {
		const parsed = BlueprintSchema.safeParse(blueprintFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.id).toBe('blueprint_1');
			expect(parsed.data.name).toBe('Template');
		}
		expect(BlueprintSchema.safeParse({ id: 123 }).success).toBe(false);
	});

	it('validates a complete Secret object and rejects invalid', () => {
		const parsed = SecretSchema.safeParse(secretFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.id).toBe('secret_1');
			expect(parsed.data.name).toBe('Gmail API Key');
			expect(parsed.data.kind).toBe('personal');
		}
		expect(SecretSchema.safeParse({ id: 123 }).success).toBe(false);
	});

	it('validates a complete Conversation object and rejects invalid', () => {
		const parsed = ConversationSchema.safeParse(conversationFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.id).toBe('conv_1');
			expect(parsed.data.name).toBe('Test Conversation');
		}
		expect(ConversationSchema.safeParse({ id: 123 }).success).toBe(false);
	});

	it('validates a complete File object and rejects invalid', () => {
		const parsed = FileSchema.safeParse(fileFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.id).toBe('file_1');
			expect(parsed.data.name).toBe('document.pdf');
			expect(parsed.data.size).toBe(1024);
		}
		expect(FileSchema.safeParse({ id: 123 }).success).toBe(false);
	});

	it('validates a complete Task object and rejects invalid', () => {
		const parsed = TaskSchema.safeParse(taskFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.id).toBe('task_1');
			expect(parsed.data.name).toBe('Nightly Sync');
			expect(parsed.data.schedule).toBe('0 0 * * *');
		}
		expect(TaskSchema.safeParse({ id: 123 }).success).toBe(false);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Structure & Namespace Verification
// ─────────────────────────────────────────────────────────────────────────────

describe('Chatbotkit plugin shape', () => {
	it('exposes all 43 implemented operations with schemas and no webhooks', () => {
		const plugin = chatbotkit();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(43);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(chatbotkitEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(typeof plugin.pluginWebhookMatcher).toBe('function');
	});

	it('supports api key auth configuration', () => {
		const plugin = chatbotkit();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
		});
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Request Client Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Chatbotkit request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(botFixture);
	});

	it('sends a bearer Authorization header and the v1 base URL', async () => {
		await makeChatbotkitRequest('bot/bot_1/fetch', 'sk-test-api-key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.chatbotkit.com/v1',
				TOKEN: 'sk-test-api-key',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer sk-test-api-key',
				}),
			}),
			expect.objectContaining({ method: 'GET', url: 'bot/bot_1/fetch' }),
		);
	});

	it('passes through ApiError directly for error classification', async () => {
		mockRequest.mockRejectedValue(httpError(404, 'Bot not found'));

		await expect(
			makeChatbotkitRequest('bot/missing/fetch', 'sk-test-api-key'),
		).rejects.toBeInstanceOf(ApiError);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Mock Handlers Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Chatbotkit resource endpoints', () => {
	const plugin = chatbotkit({ key: 'sk-test-api-key' });
	const endpoints = plugin.endpoints as any;

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
	});

	// Bots
	it('executes bots.list and bots.get with correct request contract', async () => {
		mockRequest.mockResolvedValueOnce({
			items: [botFixture],
			cursor: 'c_1',
		});
		const listRes = await endpoints.bots.list(mockCtx, { limit: 10 });
		expect(listRes).toEqual({ items: [botFixture], cursor: 'c_1' });
		expect(listRes.items[0].privacy).toBe(true);
		expect(listRes.items[0].moderation).toBe(false);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'bot/list',
				query: { take: 10 },
			}),
		);

		mockRequest.mockResolvedValueOnce(botFixture);
		const getRes = await endpoints.bots.get(mockCtx, { id: 'bot_1' });
		expect(getRes).toEqual(botFixture);
		expect(getRes.privacy).toBe(true);
		expect(getRes.moderation).toBe(false);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'bot/bot_1/fetch',
			}),
		);
	});

	it('executes bots.create, update, delete, upvote, downvote with request contract', async () => {
		mockRequest.mockResolvedValue({ id: 'bot_1' });

		expect(await endpoints.bots.create(mockCtx, { name: 'Bot' })).toEqual({
			id: 'bot_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'bot/create',
				body: { name: 'Bot' },
			}),
		);

		expect(
			await endpoints.bots.update(mockCtx, { id: 'bot_1', name: 'Bot2' }),
		).toEqual({ id: 'bot_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'bot/bot_1/update',
				body: { name: 'Bot2' },
			}),
		);

		expect(await endpoints.bots.delete(mockCtx, { id: 'bot_1' })).toEqual({
			id: 'bot_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'bot/bot_1/delete',
			}),
		);

		expect(await endpoints.bots.upvote(mockCtx, { id: 'bot_1' })).toEqual({
			id: 'bot_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'bot/bot_1/upvote',
			}),
		);

		expect(await endpoints.bots.downvote(mockCtx, { id: 'bot_1' })).toEqual({
			id: 'bot_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'bot/bot_1/downvote',
			}),
		);
	});

	// Datasets
	it('executes datasets.list, get, create, update, delete, search with request contract', async () => {
		mockRequest.mockResolvedValueOnce({ items: [datasetFixture] });
		expect(await endpoints.datasets.list(mockCtx, { limit: 5 })).toEqual({
			items: [datasetFixture],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'dataset/list',
				query: { take: 5 },
			}),
		);

		mockRequest.mockResolvedValueOnce(datasetFixture);
		expect(await endpoints.datasets.get(mockCtx, { id: 'dataset_1' })).toEqual(
			datasetFixture,
		);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'dataset/dataset_1/fetch',
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'dataset_1' });
		expect(
			await endpoints.datasets.create(mockCtx, { name: 'Dataset' }),
		).toEqual({ id: 'dataset_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'dataset/create',
				body: { name: 'Dataset' },
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'dataset_1' });
		expect(
			await endpoints.datasets.update(mockCtx, {
				id: 'dataset_1',
				name: 'Dataset2',
			}),
		).toEqual({ id: 'dataset_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'dataset/dataset_1/update',
				body: { name: 'Dataset2' },
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'dataset_1' });
		expect(
			await endpoints.datasets.delete(mockCtx, { id: 'dataset_1' }),
		).toEqual({ id: 'dataset_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'dataset/dataset_1/delete',
			}),
		);

		mockRequest.mockResolvedValueOnce({
			items: [{ id: 'r_1', text: 'match' }],
		});
		expect(
			await endpoints.datasets.search(mockCtx, {
				id: 'dataset_1',
				query: 'test',
			}),
		).toEqual({ items: [{ id: 'r_1', text: 'match' }] });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'dataset/dataset_1/search',
				body: { query: 'test' },
			}),
		);
	});

	// Skillsets
	it('executes skillsets.list, get, create, update, delete with request contract', async () => {
		mockRequest.mockResolvedValueOnce({ items: [skillsetFixture] });
		expect(await endpoints.skillsets.list(mockCtx, { limit: 10 })).toEqual({
			items: [skillsetFixture],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'skillset/list',
				query: { take: 10 },
			}),
		);

		mockRequest.mockResolvedValueOnce(skillsetFixture);
		expect(
			await endpoints.skillsets.get(mockCtx, { id: 'skillset_1' }),
		).toEqual(skillsetFixture);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'skillset/skillset_1/fetch',
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'skillset_1' });
		expect(
			await endpoints.skillsets.create(mockCtx, { name: 'Skillset' }),
		).toEqual({ id: 'skillset_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'skillset/create',
				body: { name: 'Skillset' },
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'skillset_1' });
		expect(
			await endpoints.skillsets.update(mockCtx, {
				id: 'skillset_1',
				name: 'Skillset2',
			}),
		).toEqual({ id: 'skillset_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'skillset/skillset_1/update',
				body: { name: 'Skillset2' },
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'skillset_1' });
		expect(
			await endpoints.skillsets.delete(mockCtx, { id: 'skillset_1' }),
		).toEqual({ id: 'skillset_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'skillset/skillset_1/delete',
			}),
		);
	});

	// Blueprints
	it('executes blueprints.list, get, create, update, delete with request contract', async () => {
		mockRequest.mockResolvedValueOnce({ items: [blueprintFixture] });
		expect(await endpoints.blueprints.list(mockCtx, { limit: 10 })).toEqual({
			items: [blueprintFixture],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'blueprint/list',
				query: { take: 10 },
			}),
		);

		mockRequest.mockResolvedValueOnce(blueprintFixture);
		expect(
			await endpoints.blueprints.get(mockCtx, { id: 'blueprint_1' }),
		).toEqual(blueprintFixture);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'blueprint/blueprint_1/fetch',
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'blueprint_1' });
		expect(
			await endpoints.blueprints.create(mockCtx, { name: 'Blueprint' }),
		).toEqual({ id: 'blueprint_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'blueprint/create',
				body: { name: 'Blueprint' },
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'blueprint_1' });
		expect(
			await endpoints.blueprints.update(mockCtx, {
				id: 'blueprint_1',
				name: 'Blueprint2',
			}),
		).toEqual({ id: 'blueprint_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'blueprint/blueprint_1/update',
				body: { name: 'Blueprint2' },
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'blueprint_1' });
		expect(
			await endpoints.blueprints.delete(mockCtx, { id: 'blueprint_1' }),
		).toEqual({ id: 'blueprint_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'blueprint/blueprint_1/delete',
			}),
		);
	});

	// Secrets
	it('executes secrets.list, get, create, update, delete with request contract', async () => {
		mockRequest.mockResolvedValueOnce({ items: [secretFixture] });
		expect(await endpoints.secrets.list(mockCtx, { limit: 10 })).toEqual({
			items: [secretFixture],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'secret/list',
				query: { take: 10 },
			}),
		);

		mockRequest.mockResolvedValueOnce(secretFixture);
		expect(await endpoints.secrets.get(mockCtx, { id: 'secret_1' })).toEqual(
			secretFixture,
		);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'secret/secret_1/fetch',
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'secret_1' });
		expect(await endpoints.secrets.create(mockCtx, { name: 'Secret' })).toEqual(
			{ id: 'secret_1' },
		);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'secret/create',
				body: { name: 'Secret' },
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'secret_1' });
		expect(
			await endpoints.secrets.update(mockCtx, {
				id: 'secret_1',
				name: 'Secret2',
			}),
		).toEqual({ id: 'secret_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'secret/secret_1/update',
				body: { name: 'Secret2' },
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'secret_1' });
		expect(await endpoints.secrets.delete(mockCtx, { id: 'secret_1' })).toEqual(
			{ id: 'secret_1' },
		);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'secret/secret_1/delete',
			}),
		);
	});

	// Conversations
	it('executes conversations.list, get, create, update, delete, complete with request contract', async () => {
		mockRequest.mockResolvedValueOnce({ items: [conversationFixture] });
		expect(await endpoints.conversations.list(mockCtx, { limit: 10 })).toEqual({
			items: [conversationFixture],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'conversation/list',
				query: { take: 10 },
			}),
		);

		mockRequest.mockResolvedValueOnce(conversationFixture);
		expect(
			await endpoints.conversations.get(mockCtx, { id: 'conv_1' }),
		).toEqual(conversationFixture);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'conversation/conv_1/fetch',
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'conv_1' });
		expect(await endpoints.conversations.create(mockCtx, {})).toEqual({
			id: 'conv_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'conversation/create',
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'conv_1' });
		expect(
			await endpoints.conversations.update(mockCtx, {
				id: 'conv_1',
				name: 'Conv2',
			}),
		).toEqual({ id: 'conv_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'conversation/conv_1/update',
				body: { name: 'Conv2' },
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'conv_1' });
		expect(
			await endpoints.conversations.delete(mockCtx, { id: 'conv_1' }),
		).toEqual({ id: 'conv_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'conversation/conv_1/delete',
			}),
		);

		mockRequest.mockResolvedValueOnce({ text: 'Hello!' });
		expect(
			await endpoints.conversations.complete(mockCtx, {
				id: 'conv_1',
				text: 'Hi',
			}),
		).toEqual({ text: 'Hello!' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'conversation/conv_1/complete',
				body: { text: 'Hi' },
			}),
		);
	});

	// Files
	it('executes files.list, get, create, delete with request contract', async () => {
		mockRequest.mockResolvedValueOnce({ items: [fileFixture] });
		expect(await endpoints.files.list(mockCtx, { limit: 10 })).toEqual({
			items: [fileFixture],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'file/list',
				query: { take: 10 },
			}),
		);

		mockRequest.mockResolvedValueOnce(fileFixture);
		expect(await endpoints.files.get(mockCtx, { id: 'file_1' })).toEqual(
			fileFixture,
		);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'file/file_1/fetch',
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'file_1' });
		expect(await endpoints.files.create(mockCtx, { name: 'f.pdf' })).toEqual({
			id: 'file_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'file/create',
				body: { name: 'f.pdf' },
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'file_1' });
		expect(await endpoints.files.delete(mockCtx, { id: 'file_1' })).toEqual({
			id: 'file_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'file/file_1/delete',
			}),
		);
	});

	// Tasks
	it('executes tasks.list, get, create, update, delete with request contract', async () => {
		mockRequest.mockResolvedValueOnce({ items: [taskFixture] });
		expect(await endpoints.tasks.list(mockCtx, { limit: 10 })).toEqual({
			items: [taskFixture],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'task/list',
				query: { take: 10 },
			}),
		);

		mockRequest.mockResolvedValueOnce(taskFixture);
		expect(await endpoints.tasks.get(mockCtx, { id: 'task_1' })).toEqual(
			taskFixture,
		);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'task/task_1/fetch',
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'task_1' });
		expect(await endpoints.tasks.create(mockCtx, { name: 'Task' })).toEqual({
			id: 'task_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'task/create',
				body: { name: 'Task' },
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'task_1' });
		expect(
			await endpoints.tasks.update(mockCtx, { id: 'task_1', name: 'Task2' }),
		).toEqual({ id: 'task_1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'task/task_1/update',
				body: { name: 'Task2' },
			}),
		);

		mockRequest.mockResolvedValueOnce({ id: 'task_1' });
		expect(await endpoints.tasks.delete(mockCtx, { id: 'task_1' })).toEqual({
			id: 'task_1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'task/task_1/delete',
			}),
		);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Error Handler Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('error handler classification', () => {
	it('classifies auth, rate-limit, and not-found responses', () => {
		expect(classify(httpError(401, 'Invalid secret key'))).toBe('AUTH_ERROR');
		expect(classify(httpError(429, 'Too many requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(classify(httpError(404, 'Bot not found'))).toBe('NOT_FOUND_ERROR');
	});

	it('does not retry auth or not-found failures, but retries rate limits', async () => {
		expect((await errorHandlers.AUTH_ERROR.handler()).maxRetries).toBe(0);
		expect((await errorHandlers.NOT_FOUND_ERROR.handler()).maxRetries).toBe(0);
		expect(
			(
				await errorHandlers.RATE_LIMIT_ERROR.handler(
					httpError(429, 'slow down'),
				)
			).maxRetries,
		).toBeGreaterThan(0);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration: Live API Tests (gated on CHATBOTKIT_API_KEY)
// ─────────────────────────────────────────────────────────────────────────────

const TEST_API_KEY = process.env.CHATBOTKIT_API_KEY ?? '';
const describeIfKey = TEST_API_KEY ? describe : describe.skip;

describeIfKey('ChatBotKit Live API integration', () => {
	const unmockedHttp = jest.requireActual('corsair/http');
	const liveCtx = {
		...mockCtx,
		key: TEST_API_KEY,
	};

	beforeEach(() => {
		mockRequest.mockImplementation(unmockedHttp.request);
	});

	it('fetches bots, datasets, skillsets, blueprints, secrets from live API', async () => {
		const plugin = chatbotkit({ key: TEST_API_KEY });
		const endpoints = plugin.endpoints as any;

		// 1. Bots list & get
		const botsRes = await endpoints.bots.list(liveCtx, { limit: 5 });
		expect(botsRes).toBeDefined();
		expect(Array.isArray(botsRes.items)).toBe(true);
		if (botsRes.items.length > 0) {
			const bot = await endpoints.bots.get(liveCtx, {
				id: botsRes.items[0].id,
			});
			expect(bot).toBeDefined();
			expect(bot.id).toBe(botsRes.items[0].id);
		}

		// 2. Datasets list & get
		const datasetsRes = await endpoints.datasets.list(liveCtx, { limit: 5 });
		expect(datasetsRes).toBeDefined();
		expect(Array.isArray(datasetsRes.items)).toBe(true);
		if (datasetsRes.items.length > 0) {
			const dataset = await endpoints.datasets.get(liveCtx, {
				id: datasetsRes.items[0].id,
			});
			expect(dataset).toBeDefined();
			expect(dataset.id).toBe(datasetsRes.items[0].id);
		}

		// 3. Skillsets list & get
		const skillsetsRes = await endpoints.skillsets.list(liveCtx, { limit: 5 });
		expect(skillsetsRes).toBeDefined();
		expect(Array.isArray(skillsetsRes.items)).toBe(true);
		if (skillsetsRes.items.length > 0) {
			const skillset = await endpoints.skillsets.get(liveCtx, {
				id: skillsetsRes.items[0].id,
			});
			expect(skillset).toBeDefined();
			expect(skillset.id).toBe(skillsetsRes.items[0].id);
		}

		// 4. Blueprints list & get
		const blueprintsRes = await endpoints.blueprints.list(liveCtx, {
			limit: 5,
		});
		expect(blueprintsRes).toBeDefined();
		expect(Array.isArray(blueprintsRes.items)).toBe(true);
		if (blueprintsRes.items.length > 0) {
			const blueprint = await endpoints.blueprints.get(liveCtx, {
				id: blueprintsRes.items[0].id,
			});
			expect(blueprint).toBeDefined();
			expect(blueprint.id).toBe(blueprintsRes.items[0].id);
		}

		// 5. Secrets list & get
		const secretsRes = await endpoints.secrets.list(liveCtx, { limit: 5 });
		expect(secretsRes).toBeDefined();
		expect(Array.isArray(secretsRes.items)).toBe(true);
		if (secretsRes.items.length > 0) {
			const secret = await endpoints.secrets.get(liveCtx, {
				id: secretsRes.items[0].id,
			});
			expect(secret).toBeDefined();
			expect(secret.id).toBe(secretsRes.items[0].id);
		}
	}, 30000);
});
