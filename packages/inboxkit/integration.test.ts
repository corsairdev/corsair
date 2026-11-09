import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { inboxkit } from './index';
import {
	API_KEY,
	DOMAIN_UID,
	domainDelivery,
	domainRow,
	jsonResponse,
	MAILBOX_UID,
	mailboxDelivery,
	mailboxRow,
	PLAINTEXT_PASSWORD,
	signedHeaders,
	WORKSPACE,
} from './test-fixtures';

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

async function createClient(options: Parameters<typeof inboxkit>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'inboxkit', 'default');
	const corsair = createCorsair({
		plugins: [inboxkit({ key: API_KEY, workspaceId: WORKSPACE, ...options })],
		database: testDb.db,
		kek: KEK,
	});
	await corsair.inboxkit.keys.issue_new_dek();
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

const purchase = {
	mailboxes: [
		{
			first_name: 'Jane',
			last_name: 'Doe',
			domain_name: 'example.com',
			username: 'jane',
			platform: 'GOOGLE' as const,
		},
	],
};

describe('through createCorsair', () => {
	it('stores what list operations return, for search', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(jsonResponse({ domains: [domainRow] }));
			await corsair.inboxkit.api.domains.list({});
			const domain =
				await corsair.inboxkit.db.domains.findByEntityId(DOMAIN_UID);
			expect(domain?.data).toMatchObject({
				name: 'example.com',
				status: 'active',
				workspace_uid: WORKSPACE,
				assigned_mailboxes: 2,
			});
			expect(domain?.data).not.toHaveProperty('dns');

			fetchMock.mockResolvedValueOnce(
				jsonResponse({ mailboxes: [mailboxRow] }),
			);
			await corsair.inboxkit.api.mailboxes.list({});
			const mailbox =
				await corsair.inboxkit.db.mailboxes.findByEntityId(MAILBOX_UID);
			expect(mailbox?.data).toMatchObject({
				email: 'jane@example.com',
				status: 'active',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('drops a deleted workspace from local data', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(
				jsonResponse({ workspaces: [{ uid: WORKSPACE, name: 'Main' }] }),
			);
			await corsair.inboxkit.api.workspaces.list({});
			expect(
				await corsair.inboxkit.db.workspaces.findByEntityId(WORKSPACE),
			).toBeTruthy();

			fetchMock.mockResolvedValueOnce(jsonResponse({ error: false }));
			await corsair.inboxkit.api.workspaces.delete({ uid: WORKSPACE });
			expect(
				await corsair.inboxkit.db.workspaces.findByEntityId(WORKSPACE),
			).toBeFalsy();
		} finally {
			testDb.cleanup();
		}
	});

	it('does not fail a call when the answer has rows without a uid', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(
				jsonResponse({ domains: [{ name: 'no-uid.example' }] }),
			);
			await expect(corsair.inboxkit.api.domains.list({})).resolves.toBeTruthy();
		} finally {
			testDb.cleanup();
		}
	});

	it('never logs a password passed to changePassword, even when the call fails', async () => {
		const { corsair, testDb } = await createClient();
		const log = jest.spyOn(console, 'error');
		try {
			fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'broken' }, 500));
			await expect(
				corsair.inboxkit.api.mailboxes.changePassword({
					uid: MAILBOX_UID,
					password: PLAINTEXT_PASSWORD,
				}),
			).rejects.toThrow('InboxKit 500');
			expect(JSON.stringify(log.mock.calls)).not.toContain(PLAINTEXT_PASSWORD);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('permissions', () => {
	it.each(['strict', 'readonly'] as const)(
		'%s mode stops a purchase before anything is sent',
		async (mode) => {
			const { corsair, testDb } = await createClient({
				permissions: { mode },
			});
			try {
				await expect(
					corsair.inboxkit.api.mailboxes.buy(purchase),
				).rejects.toThrow();
				expect(fetchMock).not.toHaveBeenCalled();
			} finally {
				testDb.cleanup();
			}
		},
	);

	it('readonly mode still allows a read', async () => {
		const { corsair, testDb } = await createClient({
			permissions: { mode: 'readonly' },
		});
		try {
			fetchMock.mockResolvedValueOnce(jsonResponse({ domains: [] }));
			await expect(corsair.inboxkit.api.domains.list({})).resolves.toBeTruthy();
		} finally {
			testDb.cleanup();
		}
	});

	it('readonly mode stops a credential read', async () => {
		const { corsair, testDb } = await createClient({
			permissions: { mode: 'readonly' },
		});
		try {
			await expect(
				corsair.inboxkit.api.mailboxes.showCredentials({ uid: MAILBOX_UID }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});

describe('through processWebhook', () => {
	it('verifies, routes and stores a domain event', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await processWebhook(
				corsair,
				signedHeaders('domain.status_changed'),
				JSON.stringify(domainDelivery),
			);
			expect(result.plugin).toBe('inboxkit');
			expect(result.action).toBe('domains.statusChanged');
			expect(result.response?.success).toBe(true);
			const row = await corsair.inboxkit.db.domains.findByEntityId(DOMAIN_UID);
			expect(row?.data).toMatchObject({
				status: 'active',
				workspace_uid: WORKSPACE,
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('keeps a mailbox event’s password out of the answer and the database', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await processWebhook(
				corsair,
				signedHeaders('mailbox.status_changed'),
				JSON.stringify(mailboxDelivery),
			);
			expect(result.action).toBe('mailboxes.statusChanged');
			expect(JSON.stringify(result)).not.toContain(PLAINTEXT_PASSWORD);
			const row =
				await corsair.inboxkit.db.mailboxes.findByEntityId(MAILBOX_UID);
			expect(row?.data).toMatchObject({ email: 'jane@example.com' });
			expect(JSON.stringify(row)).not.toContain(PLAINTEXT_PASSWORD);
		} finally {
			testDb.cleanup();
		}
	});

	it('keeps the password out of the answer when a real delivery is refused', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await processWebhook(
				corsair,
				signedHeaders('mailbox.status_changed', 'sha256=key-just-rotated'),
				JSON.stringify(mailboxDelivery),
			);
			expect(result.response?.success).toBe(false);
			expect(JSON.stringify(result)).not.toContain(PLAINTEXT_PASSWORD);
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a forged delivery as a failure, and stores nothing', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await processWebhook(
				corsair,
				signedHeaders('domain.status_changed', 'sha256=forged'),
				JSON.stringify(domainDelivery),
			);
			expect(result.response?.success).toBe(false);
			expect(
				await corsair.inboxkit.db.domains.findByEntityId(DOMAIN_UID),
			).toBeFalsy();
		} finally {
			testDb.cleanup();
		}
	});
});
