import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { makeAuthenticatedGmailRequest } from '../client';
import { gmail } from '../index';

// Gmail's labels.list returns only id, name, visibility and type per label.
// Listing must not drop the message and thread counts that get stored.

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeAuthenticatedGmailRequest: jest.fn(),
}));

const request = jest.mocked(makeAuthenticatedGmailRequest);

const fullLabel = {
	id: 'Label_1',
	name: 'Receipts',
	type: 'user' as const,
	messageListVisibility: 'show' as const,
	labelListVisibility: 'labelShow' as const,
	messagesTotal: 12,
	messagesUnread: 3,
	threadsTotal: 10,
	threadsUnread: 2,
};

function respondWith(listedName: string) {
	request.mockImplementation(async (path: string) => {
		if (path.endsWith('/labels')) {
			return {
				labels: [
					{
						id: fullLabel.id,
						name: listedName,
						type: fullLabel.type,
						messageListVisibility: fullLabel.messageListVisibility,
						labelListVisibility: fullLabel.labelListVisibility,
					},
				],
			};
		}
		if (path.endsWith(`/labels/${fullLabel.id}`)) {
			return fullLabel;
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

describe('gmail labels persistence', () => {
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

	it('E: list after get keeps the stored message and thread counts', async () => {
		respondWith('Receipts');

		await corsair.gmail.api.labels.get({ id: 'Label_1' });
		const afterGet = await corsair.gmail.db.labels.findByEntityId('Label_1');
		expect(afterGet?.data.messagesUnread).toBe(3);

		await corsair.gmail.api.labels.list({});

		const stored = await corsair.gmail.db.labels.findByEntityId('Label_1');
		expect(stored?.data.messagesUnread).toBe(3);
		expect(stored?.data.messagesTotal).toBe(12);
		expect(stored?.data.threadsUnread).toBe(2);
		expect(console.warn).not.toHaveBeenCalled();
	});

	it('F: list takes the new name and keeps the counts', async () => {
		respondWith('Receipts 2026');

		await corsair.gmail.api.labels.get({ id: 'Label_1' });
		await corsair.gmail.api.labels.list({});

		const stored = await corsair.gmail.db.labels.findByEntityId('Label_1');
		expect(stored?.data.name).toBe('Receipts 2026');
		expect(stored?.data.messagesUnread).toBe(3);
		expect(stored?.data.messagesTotal).toBe(12);
		expect(stored?.data.threadsUnread).toBe(2);
		expect(console.warn).not.toHaveBeenCalled();
	});

	it('G: list on an empty table inserts the label with its name', async () => {
		respondWith('Receipts');

		await corsair.gmail.api.labels.list({});

		const stored = await corsair.gmail.db.labels.findByEntityId('Label_1');
		expect(stored?.data.id).toBe('Label_1');
		expect(stored?.data.name).toBe('Receipts');
		expect(console.warn).not.toHaveBeenCalled();
	});
});
