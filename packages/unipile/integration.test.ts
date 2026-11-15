import { processWebhook } from 'corsair';
import type { CorsairErrorHandler } from 'corsair/core';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { UnipileAPIError } from './client';
import { unipile } from './index';
import {
	ACCOUNT_ID,
	accountsPage,
	chat,
	events,
	MEMBER_ID,
	problem,
	signedHeaders,
	WEBHOOK_SECRET,
} from './test-fixtures';

async function createClient(
	options: Parameters<typeof unipile>[0],
	rootErrorHandlers?: CorsairErrorHandler,
) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'unipile', 'default');
	const corsair = createCorsair({
		plugins: [unipile(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		...(rootErrorHandlers ? { errorHandlers: rootErrorHandlers } : {}),
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Unipile plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.unipile.keys.issue_new_dek();
			await expect(corsair.unipile.api.accounts.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored API key as X-API-KEY', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.unipile.keys.issue_new_dek();
			await corsair.unipile.keys.set_api_key('uk-stored-key');
			respond(accountsPage);

			const result = await corsair.unipile.api.accounts.list({
				provider: 'linkedin',
			});

			expect(result.data[0]?.id).toBe(ACCOUNT_ID);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(
				'https://api.unipile.com/v2/accounts/?provider=linkedin',
			);
			expect(new Headers(init.headers).get('x-api-key')).toBe('uk-stored-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('does not resend a message after a 502', async () => {
		const { corsair, testDb } = await createClient({ key: 'uk-test-key' });
		try {
			respond(problem(502, 'provider/server_error', 'Bad Gateway'), 502);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.unipile.api.messages
				.send({ account_id: ACCOUNT_ID, chat_id: chat.id, text: 'Hi' })
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(UnipileAPIError);
			expect(error).toMatchObject({ status: 502 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not resend an invitation after a timeout', async () => {
		const { corsair, testDb } = await createClient({ key: 'uk-test-key' });
		try {
			const timeout = new Error('The operation was aborted due to timeout');
			timeout.name = 'TimeoutError';
			fetchMock.mockRejectedValueOnce(timeout);

			await expect(
				corsair.unipile.api.relationRequests.create({
					account_id: ACCOUNT_ID,
					user_id: MEMBER_ID,
				}),
			).rejects.toBeInstanceOf(UnipileAPIError);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read after a 502 and returns the next response', async () => {
		const { corsair, testDb } = await createClient({ key: 'uk-test-key' });
		try {
			jest.spyOn(Math, 'random').mockReturnValue(0);
			respond(problem(502, 'provider/server_error', 'Bad Gateway'), 502);
			respond({ data: [chat], next_cursor: null });

			const result = await corsair.unipile.api.chats.list({
				account_id: ACCOUNT_ID,
			});

			expect(result.data[0]?.id).toBe(chat.id);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a send that Unipile rate-limited, after Retry-After', async () => {
		const { corsair, testDb } = await createClient({ key: 'uk-test-key' });
		try {
			respond(problem(429, 'api/too_many_requests', 'Too Many Requests'), 429, {
				'retry-after': '1',
			});
			respond({ object: 'MessageSent', message_id: 'msg_9' });

			const result = await corsair.unipile.api.messages.send({
				account_id: ACCOUNT_ID,
				chat_id: chat.id,
				text: 'Hi',
			});

			// A write can return { parse_warning, raw }; narrow before reading fields.
			if (result.parse_warning !== undefined)
				throw new Error(result.parse_warning);
			expect(result.message_id).toBe('msg_9');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a LinkedIn 429 on an invitation', async () => {
		const { corsair, testDb } = await createClient({ key: 'uk-test-key' });
		try {
			respond(
				problem(429, 'provider/too_many_requests', 'Too Many Requests'),
				429,
				{ 'retry-after': '1' },
			);

			await expect(
				corsair.unipile.api.relationRequests.create({
					account_id: ACCOUNT_ID,
					user_id: MEMBER_ID,
				}),
			).rejects.toMatchObject({ type: 'provider/too_many_requests' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Unipile retries with a root-level DEFAULT handler', () => {
	// The documented root catch-all; corsair puts root keys first.
	const rootDefault = jest.fn(async () => ({ maxRetries: 0 }));
	const root: CorsairErrorHandler = {
		DEFAULT: { match: () => true, handler: rootDefault },
	};

	beforeEach(() => {
		rootDefault.mockClear();
	});

	it('still retries a read after a 502', async () => {
		const { corsair, testDb } = await createClient(
			{ key: 'uk-test-key' },
			root,
		);
		try {
			jest.spyOn(Math, 'random').mockReturnValue(0);
			respond(problem(502, 'provider/server_error', 'Bad Gateway'), 502);
			respond({ data: [chat], next_cursor: null });

			const result = await corsair.unipile.api.chats.list({
				account_id: ACCOUNT_ID,
			});

			expect(result.data[0]?.id).toBe(chat.id);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('still never replays a LinkedIn 429 or a send after a 502', async () => {
		const { corsair, testDb } = await createClient(
			{ key: 'uk-test-key' },
			root,
		);
		try {
			respond(
				problem(429, 'provider/too_many_requests', 'Too Many Requests'),
				429,
				{ 'retry-after': '1' },
			);
			await expect(
				corsair.unipile.api.chats.list({ account_id: ACCOUNT_ID }),
			).rejects.toMatchObject({ type: 'provider/too_many_requests' });
			expect(fetchMock).toHaveBeenCalledTimes(1);

			respond(problem(502, 'provider/server_error', 'Bad Gateway'), 502);
			await expect(
				corsair.unipile.api.messages.send({
					account_id: ACCOUNT_ID,
					chat_id: chat.id,
					text: 'Hi',
				}),
			).rejects.toMatchObject({ status: 502 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Unipile webhooks through processWebhook', () => {
	async function deliver(
		headersFor: (rawBody: string) => Record<string, string>,
	) {
		const after = jest.fn();
		const { corsair, testDb } = await createClient({
			key: 'uk-test-key',
			webhookSecret: WEBHOOK_SECRET,
			webhookHooks: { relations: { new: { after } } },
		});
		const rawBody = JSON.stringify(events['relation.new']);
		try {
			const result = await processWebhook(
				corsair,
				headersFor(rawBody),
				rawBody,
			);
			return { result, after };
		} finally {
			testDb.cleanup();
		}
	}

	it('routes a signed relation.new to relations.new', async () => {
		const { result, after } = await deliver((raw) => signedHeaders(raw));

		expect(result.plugin).toBe('unipile');
		expect(result.action).toBe('relations.new');
		expect(after).toHaveBeenCalledTimes(1);
		const [, response] = after.mock.calls[0] as [
			unknown,
			{ data: { payload: { user: { id: string } } } },
		];
		expect(response.data.payload.user.id).toBe(MEMBER_ID);
	});

	it('does not run hooks for a delivery signed with the wrong secret', async () => {
		const { result, after } = await deliver((raw) =>
			signedHeaders(raw, 'not-the-secret'),
		);

		expect(result.plugin).toBe('unipile');
		expect(after).not.toHaveBeenCalled();
	});

	it('leaves an unsigned delivery to other plugins', async () => {
		const { result, after } = await deliver(() => ({
			'content-type': 'application/json',
		}));

		expect(result.plugin).not.toBe('unipile');
		expect(after).not.toHaveBeenCalled();
	});
});
