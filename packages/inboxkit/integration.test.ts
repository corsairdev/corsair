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

describe('a root error handler that asks for retries', () => {
	const retryEverything = {
		DEFAULT: {
			match: () => true,
			handler: async () => ({ maxRetries: 2, headersRetryAfterMs: 1 }),
		},
	};

	async function createRetryingClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'inboxkit', 'default');
		const corsair = createCorsair({
			plugins: [inboxkit({ key: API_KEY, workspaceId: WORKSPACE })],
			database: testDb.db,
			kek: KEK,
			errorHandlers: retryEverything,
		});
		await corsair.inboxkit.keys.issue_new_dek();
		return { corsair, testDb };
	}

	it.each([
		['a 500', () => jsonResponse({ message: 'broken' }, 500)],
		[
			'a timeout',
			() =>
				Promise.reject(
					Object.assign(new Error('aborted'), { name: 'TimeoutError' }),
				),
		],
	])('cannot buy twice after %s', async (_label, answer) => {
		const { corsair, testDb } = await createRetryingClient();
		try {
			fetchMock.mockImplementation(answer);
			await expect(
				corsair.inboxkit.api.mailboxes.buy({ ...purchase }),
			).rejects.toThrow('may still have gone through');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('can retry a refusal, since nothing was done', async () => {
		// The retry is asked for at plugin level, which comes before every other
		// handler; a root handler only runs when no plugin handler matches.
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'inboxkit', 'default');
		const corsair = createCorsair({
			plugins: [
				inboxkit({
					key: API_KEY,
					workspaceId: WORKSPACE,
					errorHandlers: {
						RATE_LIMIT_ERROR: retryEverything.DEFAULT,
					},
				}),
			],
			database: testDb.db,
			kek: KEK,
		});
		await corsair.inboxkit.keys.issue_new_dek();
		try {
			fetchMock
				.mockResolvedValueOnce(jsonResponse({ message: 'slow down' }, 429))
				.mockResolvedValueOnce(jsonResponse({ order_uid: 'order-1' }));
			await expect(
				corsair.inboxkit.api.mailboxes.buy({ ...purchase }),
			).resolves.toMatchObject({ order_uid: 'order-1' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('still lets a deliberate repeat through, even with the same arguments object', async () => {
		const { corsair, testDb } = await createRetryingClient();
		const args = { ...purchase };
		try {
			fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'broken' }, 500));
			await expect(corsair.inboxkit.api.mailboxes.buy(args)).rejects.toThrow();
			expect(fetchMock).toHaveBeenCalledTimes(1);
			fetchMock.mockResolvedValueOnce(jsonResponse({ order_uid: 'order-1' }));
			await expect(
				corsair.inboxkit.api.mailboxes.buy(args),
			).resolves.toMatchObject({ order_uid: 'order-1' });
		} finally {
			testDb.cleanup();
		}
	});

	it('does not let one account block another that shares the arguments object', async () => {
		const first = await createRetryingClient();
		const second = await createRetryingClient();
		const args = { ...purchase };
		try {
			fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'broken' }, 500));
			await expect(
				first.corsair.inboxkit.api.mailboxes.buy(args),
			).rejects.toThrow();
			fetchMock.mockResolvedValueOnce(jsonResponse({ order_uid: 'order-2' }));
			await expect(
				second.corsair.inboxkit.api.mailboxes.buy(args),
			).resolves.toMatchObject({ order_uid: 'order-2' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			first.testDb.cleanup();
			second.testDb.cleanup();
		}
	});

	it('covers a call with no fields in its arguments too', async () => {
		const { corsair, testDb } = await createRetryingClient();
		try {
			fetchMock.mockImplementation(() =>
				jsonResponse({ message: 'broken' }, 500),
			);
			await expect(
				corsair.inboxkit.api.billing.cancelSubscription({}),
			).rejects.toThrow('may still have gone through');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('still sends another operation that shares the arguments object', async () => {
		const { corsair, testDb } = await createRetryingClient();
		const args = { uids: [MAILBOX_UID] };
		try {
			fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'broken' }, 500));
			await expect(
				corsair.inboxkit.api.mailboxes.cancel(args),
			).rejects.toThrow();
			fetchMock.mockResolvedValueOnce(jsonResponse({ error: false }));
			await expect(
				corsair.inboxkit.api.mailboxes.uncancel(args),
			).resolves.toBeTruthy();
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('leaves reads to retry as usual', async () => {
		const { corsair, testDb } = await createRetryingClient();
		try {
			fetchMock
				.mockResolvedValueOnce(jsonResponse({ message: 'broken' }, 500))
				.mockResolvedValueOnce(jsonResponse({ uid: 'team' }));
			await expect(corsair.inboxkit.api.account.get({})).resolves.toMatchObject(
				{ uid: 'team' },
			);
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

	it('keeps what a list saved when a status event arrives', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(
				jsonResponse({
					mailboxes: [{ ...mailboxRow, forwarding_email: 'fwd@example.com' }],
				}),
			);
			await corsair.inboxkit.api.mailboxes.list({});
			await processWebhook(
				corsair,
				signedHeaders('mailbox.status_changed'),
				JSON.stringify({
					...mailboxDelivery,
					data: {
						...mailboxDelivery.data,
						mailbox: { ...mailboxDelivery.data.mailbox, status: 'suspended' },
					},
				}),
			);
			const mailbox =
				await corsair.inboxkit.db.mailboxes.findByEntityId(MAILBOX_UID);
			expect(mailbox?.data).toMatchObject({
				status: 'suspended',
				domain_name: 'example.com',
				sequencer_status: 'connected',
				forwarding_email: 'fwd@example.com',
			});

			fetchMock.mockResolvedValueOnce(jsonResponse({ domains: [domainRow] }));
			await corsair.inboxkit.api.domains.list({});
			await processWebhook(
				corsair,
				signedHeaders('domain.status_changed'),
				JSON.stringify(domainDelivery),
			);
			const domain =
				await corsair.inboxkit.db.domains.findByEntityId(DOMAIN_UID);
			expect(domain?.data).toMatchObject({
				assigned_mailboxes: 2,
				nameserver_match_status: 'matched',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it("saves the domain from a mailbox event's metadata when no list has run", async () => {
		const { corsair, testDb } = await createClient();
		try {
			await processWebhook(
				corsair,
				signedHeaders('mailbox.status_changed'),
				JSON.stringify(mailboxDelivery),
			);
			const mailbox =
				await corsair.inboxkit.db.mailboxes.findByEntityId(MAILBOX_UID);
			expect(mailbox?.data).toMatchObject({ domain_name: 'example.com' });
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
