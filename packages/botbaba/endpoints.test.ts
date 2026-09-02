import { BotbabaEndpointInputSchemas, BotbabaEndpointOutputSchemas } from './endpoints/types';
import { botbabaEndpointSchemas } from './index';

describe('BotbabaEndpointInputSchemas', () => {
	describe('botsCreate', () => {
		it('accepts valid input', () => {
			const result = BotbabaEndpointInputSchemas.botsCreate.safeParse({
				name: 'My Bot',
				description: 'A test bot',
				channel: 'whatsapp',
			});
			expect(result.success).toBe(true);
		});

		it('requires name', () => {
			const result = BotbabaEndpointInputSchemas.botsCreate.safeParse({
				description: 'missing name',
			});
			expect(result.success).toBe(false);
		});

		it('accepts minimal input (name only)', () => {
			const result = BotbabaEndpointInputSchemas.botsCreate.safeParse({
				name: 'Minimal Bot',
			});
			expect(result.success).toBe(true);
		});
	});

	describe('botsGet', () => {
		it('requires botId', () => {
			const result = BotbabaEndpointInputSchemas.botsGet.safeParse({
				botId: 'bot-123',
			});
			expect(result.success).toBe(true);
		});

		it('rejects missing botId', () => {
			const result = BotbabaEndpointInputSchemas.botsGet.safeParse({});
			expect(result.success).toBe(false);
		});
	});

	describe('botsList', () => {
		it('accepts empty input', () => {
			const result = BotbabaEndpointInputSchemas.botsList.safeParse({});
			expect(result.success).toBe(true);
		});

		it('accepts pagination params', () => {
			const result = BotbabaEndpointInputSchemas.botsList.safeParse({
				page: 1,
				limit: 20,
				status: 'active',
			});
			expect(result.success).toBe(true);
		});
	});

	describe('botsUpdate', () => {
		it('requires botId', () => {
			const result = BotbabaEndpointInputSchemas.botsUpdate.safeParse({
				botId: 'bot-123',
				name: 'Updated Bot',
			});
			expect(result.success).toBe(true);
		});

		it('rejects missing botId', () => {
			const result = BotbabaEndpointInputSchemas.botsUpdate.safeParse({
				name: 'No ID',
			});
			expect(result.success).toBe(false);
		});
	});

	describe('messagesSend', () => {
		it('requires botId, conversationId, and content', () => {
			const result = BotbabaEndpointInputSchemas.messagesSend.safeParse({
				botId: 'bot-1',
				conversationId: 'conv-1',
				content: 'Hello!',
			});
			expect(result.success).toBe(true);
		});

		it('rejects missing content', () => {
			const result = BotbabaEndpointInputSchemas.messagesSend.safeParse({
				botId: 'bot-1',
				conversationId: 'conv-1',
			});
			expect(result.success).toBe(false);
		});
	});

	describe('deploymentsDeploy', () => {
		it('requires botId and channel', () => {
			const result = BotbabaEndpointInputSchemas.deploymentsDeploy.safeParse({
				botId: 'bot-1',
				channel: 'whatsapp',
			});
			expect(result.success).toBe(true);
		});
	});

	describe('analyticsGetSummary', () => {
		it('requires botId', () => {
			const result = BotbabaEndpointInputSchemas.analyticsGetSummary.safeParse({
				botId: 'bot-1',
				period: '7d',
			});
			expect(result.success).toBe(true);
		});
	});
});

describe('botbabaEndpointSchemas', () => {
	it('has schemas for all 12 endpoints', () => {
		const expectedKeys = [
			'bots.create',
			'bots.get',
			'bots.list',
			'bots.update',
			'bots.delete',
			'conversations.list',
			'conversations.get',
			'messages.send',
			'messages.list',
			'deployments.deploy',
			'deployments.getStatus',
			'analytics.getSummary',
		];

		for (const key of expectedKeys) {
			const schema =
				botbabaEndpointSchemas[
					key as keyof typeof botbabaEndpointSchemas
				];
			expect(schema).toBeDefined();
			expect(schema.input).toBeDefined();
			expect(schema.output).toBeDefined();
		}
	});
});

describe('BotbabaEndpointOutputSchemas', () => {
	describe('botsList', () => {
		it('parses a list response', () => {
			const result = BotbabaEndpointOutputSchemas.botsList.safeParse({
				bots: [
					{ id: 'bot-1', name: 'Bot One', status: 'active' },
					{ id: 'bot-2', name: 'Bot Two', status: 'inactive' },
				],
				total: 2,
				page: 1,
				limit: 10,
			});
			expect(result.success).toBe(true);
		});
	});

	describe('messagesSend', () => {
		it('parses a message response', () => {
			const result = BotbabaEndpointOutputSchemas.messagesSend.safeParse({
				id: 'msg-1',
				conversationId: 'conv-1',
				content: 'Hello!',
				sender: 'bot',
				type: 'text',
			});
			expect(result.success).toBe(true);
		});
	});
});
