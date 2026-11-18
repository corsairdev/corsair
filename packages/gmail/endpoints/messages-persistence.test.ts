import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { makeAuthenticatedGmailRequest } from '../client';
import { gmail } from '../index';

// Gmail's messages.list returns only { id, threadId } per message. Listing must
// not replace a message that get or the messageChanged webhook already stored
// in full.

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeAuthenticatedGmailRequest: jest.fn(),
}));

const request = jest.mocked(makeAuthenticatedGmailRequest);

const fullMessage = {
	id: 'msg-1',
	threadId: 'thread-1',
	labelIds: ['INBOX', 'UNREAD'],
	snippet: 'Lunch on Friday?',
	internalDate: '1761638400000',
	payload: {
		mimeType: 'text/plain',
		headers: [
			{ name: 'Subject', value: 'Lunch' },
			{ name: 'From', value: 'alice@example.com' },
			{ name: 'To', value: 'bob@example.com' },
		],
		body: { data: Buffer.from('See you at noon').toString('base64') },
	},
};

function respondWith(listed: Array<{ id: string; threadId: string }>) {
	request.mockImplementation(async (path: string) => {
		if (path.endsWith('/messages')) {
			return { messages: listed, resultSizeEstimate: listed.length };
		}
		if (path.endsWith(`/messages/${fullMessage.id}`)) {
			return fullMessage;
		}
		throw new Error(`unexpected request: ${path}`);
	});
}

function createCorsairWithGmail(db: ReturnType<typeof createTestDatabase>) {
	return createCorsair({
		plugins: [gmail({ key: 'test-token' })],
		database: db.db,
		kek: 'test-kek',
	});
}

describe('gmail messages persistence', () => {
	let testDb: ReturnType<typeof createTestDatabase>;
	let corsair: ReturnType<typeof createCorsairWithGmail>;

	beforeEach(async () => {
		testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'gmail', 'default');
		corsair = createCorsairWithGmail(testDb);
		request.mockReset();
		jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		testDb.cleanup();
		jest.restoreAllMocks();
	});

	it('A: list after get keeps the stored subject, sender and snippet', async () => {
		respondWith([{ id: 'msg-1', threadId: 'thread-1' }]);

		await corsair.gmail.api.messages.get({ id: 'msg-1' });
		const afterGet = await corsair.gmail.db.messages.findByEntityId('msg-1');
		expect(afterGet?.data.subject).toBe('Lunch');

		await corsair.gmail.api.messages.list({});

		const stored = await corsair.gmail.db.messages.findByEntityId('msg-1');
		expect(stored?.data.subject).toBe('Lunch');
		expect(stored?.data.from).toBe('alice@example.com');
		expect(stored?.data.snippet).toBe('Lunch on Friday?');
		expect(stored?.data.labelIds).toEqual(['INBOX', 'UNREAD']);
		expect(console.warn).not.toHaveBeenCalled();
	});

	it('B: list on an empty table inserts id and threadId', async () => {
		respondWith([{ id: 'msg-9', threadId: 'thread-9' }]);

		await corsair.gmail.api.messages.list({});

		const stored = await corsair.gmail.db.messages.findByEntityId('msg-9');
		expect(stored?.data.id).toBe('msg-9');
		expect(stored?.data.threadId).toBe('thread-9');
		expect(console.warn).not.toHaveBeenCalled();
	});

	it('C: list keeps a stored message and inserts a new one', async () => {
		respondWith([
			{ id: 'msg-1', threadId: 'thread-1' },
			{ id: 'msg-2', threadId: 'thread-2' },
		]);

		await corsair.gmail.api.messages.get({ id: 'msg-1' });
		await corsair.gmail.api.messages.list({});

		const kept = await corsair.gmail.db.messages.findByEntityId('msg-1');
		expect(kept?.data.subject).toBe('Lunch');
		expect(kept?.data.snippet).toBe('Lunch on Friday?');

		const inserted = await corsair.gmail.db.messages.findByEntityId('msg-2');
		expect(inserted?.data.threadId).toBe('thread-2');
		expect(console.warn).not.toHaveBeenCalled();
	});

	it('D: list keeps a fully stored row (webhook shape)', async () => {
		// Writes the row directly in upsertMessageToDb's shape (webhooks/messages.ts).
		await corsair.gmail.db.messages.upsertByEntityId('msg-1', {
			...fullMessage,
			subject: 'Lunch',
			body: 'See you at noon',
			from: 'alice@example.com',
			to: 'bob@example.com',
			createdAt: new Date(),
		});
		respondWith([{ id: 'msg-1', threadId: 'thread-1' }]);

		await corsair.gmail.api.messages.list({});

		const stored = await corsair.gmail.db.messages.findByEntityId('msg-1');
		expect(stored?.data.subject).toBe('Lunch');
		expect(stored?.data.body).toBe('See you at noon');
		expect(stored?.data.to).toBe('bob@example.com');
		expect(console.warn).not.toHaveBeenCalled();
	});
});
