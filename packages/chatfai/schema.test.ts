import { ChatfaiCharacter, ChatfaiConversation, ChatfaiSchema } from './schema';

const officialCharacter = {
	id: 'u9L8cPOYsVf9Ky7hTCqc',
	uid: 'hv3cU8Ditrcsa5CZ7lrsXcTWpAE3',
	name: 'Gandalf the Grey',
	nickname: 'Ólorin',
	publicDescription: 'A wizard.',
	image: 'https://cdn.chatfai.com/public_characters/example.jpg',
	visibility: 'public',
	categories: ['book'],
	featured: false,
	firstMessage: null,
	voiceEnabled: false,
	likes: 1,
	installs: 40,
	createdAt: '2023-10-24T11:42:54.183Z',
	updatedAt: '2023-10-24T11:42:54.183Z',
};

describe('Chatfai schema', () => {
	it('declares a semver version', () => {
		expect(ChatfaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official character and conversation entities', () => {
		expect(ChatfaiSchema.entities.characters).toBe(ChatfaiCharacter);
		expect(ChatfaiSchema.entities.conversations).toBe(ChatfaiConversation);
	});

	it('parses official GET /v1/characters/{id} fields', () => {
		expect(ChatfaiCharacter.parse(officialCharacter).id).toBe(
			'u9L8cPOYsVf9Ky7hTCqc',
		);
	});

	it('parses a conversation row with a stable id', () => {
		expect(ChatfaiConversation.parse({ id: 'conv_1' }).id).toBe('conv_1');
	});
});
