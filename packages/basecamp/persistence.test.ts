import { evictBasecampResult, mirrorBasecampResult } from './endpoints/persist';

describe('Basecamp reference persistence', () => {
	it('mirrors stable reference collections by id', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		await mirrorBasecampResult(
			{ projects: { upsertByEntityId } },
			'ListProjects',
			[{ id: 42, name: 'Test project' }],
		);
		expect(upsertByEntityId).toHaveBeenCalledWith('42', {
			id: 42,
			name: 'Test project',
		});
	});

	it('mirrors individual people but ignores transactional content', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		await mirrorBasecampResult({ people: { upsertByEntityId } }, 'GetPerson', {
			id: 7,
			name: 'Example Person',
		});
		await mirrorBasecampResult({ people: { upsertByEntityId } }, 'GetMessage', {
			id: 99,
			subject: 'Private',
		});
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('evicts references after destructive operations', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(undefined);
		await evictBasecampResult(
			{ projects: { upsertByEntityId: jest.fn(), deleteByEntityId } },
			'TrashProject',
			{ projectId: 42 },
		);
		expect(deleteByEntityId).toHaveBeenCalledWith('42');
	});

	it('keeps the chatbot key out of the local store', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		// Shaped like the chatbot payload in the docs (sections/chatbots.md), but
		// with a synthetic key so no usable credential sits in source control.
		const chatbotKey = 'test-chatbot-key';
		await mirrorBasecampResult(
			{ chatbots: { upsertByEntityId } },
			'GetChatbot',
			{
				id: 1049715953,
				service_name: 'Capistrano',
				url: 'https://3.basecampapi.com/195539477/buckets/2085958502/chats/1069478958/integrations/1049715953.json',
				command_url: `https://example.invalid/integrations/${chatbotKey}/command`,
				lines_url: `https://example.invalid/integrations/${chatbotKey}/lines`,
			},
		);
		const [entityId, stored] = upsertByEntityId.mock.calls[0];
		expect(entityId).toBe('1049715953');
		// Both key-bearing URLs are gone; the identifying fields survive.
		expect(stored).not.toHaveProperty('lines_url');
		expect(stored).not.toHaveProperty('command_url');
		expect(JSON.stringify(stored)).not.toContain(chatbotKey);
		expect(stored).toMatchObject({
			id: 1049715953,
			service_name: 'Capistrano',
		});
	});

	it('leaves non-chatbot rows untouched', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		await mirrorBasecampResult(
			{ projects: { upsertByEntityId } },
			'GetProject',
			{
				id: 42,
				name: 'Test project',
				url: 'https://3.basecampapi.com/1/projects/42.json',
			},
		);
		expect(upsertByEntityId).toHaveBeenCalledWith('42', {
			id: 42,
			name: 'Test project',
			url: 'https://3.basecampapi.com/1/projects/42.json',
		});
	});
});
