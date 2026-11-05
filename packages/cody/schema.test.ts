import { CodySchema } from './schema';
import {
	CodyBot,
	CodyConversation,
	CodyDocument,
	CodyFolder,
	CodyMessage,
	CodyUsage,
} from './schema/database';

describe('Cody schema', () => {
	it('declares semver version 1.0.0', () => {
		expect(CodySchema.version).toBe('1.0.0');
	});

	it('declares an entities map with all labeled database models', () => {
		expect(Object.keys(CodySchema.entities).sort()).toEqual([
			'bots',
			'conversations',
			'documents',
			'folders',
			'messages',
			'usage',
		]);
		expect(CodySchema.entities.bots).toBe(CodyBot);
		expect(CodySchema.entities.conversations).toBe(CodyConversation);
		expect(CodySchema.entities.documents).toBe(CodyDocument);
		expect(CodySchema.entities.folders).toBe(CodyFolder);
		expect(CodySchema.entities.messages).toBe(CodyMessage);
		expect(CodySchema.entities.usage).toBe(CodyUsage);
	});

	it('parses valid entity fixtures through Zod models', () => {
		const bot = CodyBot.parse({
			id: 'bot_123',
			name: 'Creative Cody',
			model: 'gpt-4',
			created_at: 1700000000,
		});
		expect(bot.id).toBe('bot_123');
		expect(bot.name).toBe('Creative Cody');
		expect(bot.model).toBe('gpt-4');
		expect(bot.created_at).toBe(1700000000);

		const conversation = CodyConversation.parse({
			id: 'conv_123',
			name: 'Support Chat',
			bot_id: 'bot_123',
			created_at: 1700000001,
		});
		expect(conversation.id).toBe('conv_123');
		expect(conversation.name).toBe('Support Chat');
		expect(conversation.bot_id).toBe('bot_123');

		const document = CodyDocument.parse({
			id: 'doc_123',
			name: 'API Guide',
			status: 'synced',
			content_url: 'https://getcody.ai/docs/1',
			folder_id: 'folder_123',
			created_at: 1700000002,
		});
		expect(document.id).toBe('doc_123');
		expect(document.status).toBe('synced');

		const folder = CodyFolder.parse({
			id: 'folder_123',
			name: 'Engineering',
			created_at: 1700000003,
		});
		expect(folder.id).toBe('folder_123');
		expect(folder.name).toBe('Engineering');

		const message = CodyMessage.parse({
			id: 'msg_123',
			content: 'Hello world',
			conversation_id: 'conv_123',
			machine: true,
			failed_responding: false,
			flagged: false,
			created_at: 1700000004,
		});
		expect(message.id).toBe('msg_123');
		expect(message.machine).toBe(true);

		const usage = CodyUsage.parse({
			tokens: 8000,
			credits: 0.5,
		});
		expect(usage.tokens).toBe(8000);
		expect(usage.credits).toBe(0.5);
	});
});
