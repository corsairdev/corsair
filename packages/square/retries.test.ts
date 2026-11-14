import { ApiError } from 'corsair/http';
import { SquareNetworkError, squareErrors } from './client';
import {
	createClient,
	jsonBody,
	jsonResponse,
	mockFetch,
	sentRequest,
} from './test-fixtures';

// Square's documented error bodies.
const serverError = {
	errors: [{ category: 'API_ERROR', code: 'INTERNAL_SERVER_ERROR' }],
};
const rateLimited = {
	errors: [
		{
			category: 'RATE_LIMIT_ERROR',
			code: 'RATE_LIMITED',
			detail: 'Too many requests.',
		},
	],
};
const declined = {
	errors: [
		{
			category: 'PAYMENT_METHOD_ERROR',
			code: 'CARD_DECLINED',
			detail: 'Card declined.',
			field: 'source_id',
		},
	],
};

const KEY = 'order-1042-charge';
const charge = {
	source_id: 'cnon:card-nonce-ok',
	idempotency_key: KEY,
	amount_money: { amount: 1000, currency: 'USD' as const },
};
const hello = Buffer.from('hello, world\n').toString('base64');

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = mockFetch();
	// Core logs each retry.
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

async function withClient(
	run: (client: Awaited<ReturnType<typeof createClient>>) => Promise<void>,
) {
	const client = await createClient();
	try {
		await run(client);
	} finally {
		client.testDb.cleanup();
	}
}

/** Every request body fetch saw, in order. */
// unknown: bodies are whatever JSON each test sent; the assertions compare them.
function bodies(): unknown[] {
	return fetchMock.mock.calls.map((_, i) =>
		jsonBody(sentRequest(fetchMock, i)),
	);
}

/** The JSON `request` part of each multipart upload fetch saw, in order. */
// unknown: the parsed JSON of each part; the assertions compare it.
function uploadRequests(): unknown[] {
	return fetchMock.mock.calls.map((_, i) => {
		const { body } = sentRequest(fetchMock, i);
		if (!(body instanceof FormData)) throw new Error('expected FormData');
		return JSON.parse(String(body.get('request')));
	});
}

/** Runs `call` to the end with fake timers and returns what it rejected with. */
// unknown: a rejection can carry any value; each test narrows it.
async function failure(call: () => Promise<unknown>): Promise<unknown> {
	jest.useFakeTimers();
	const settled = call().then(
		() => {
			throw new Error('expected the call to fail');
		},
		// unknown: as above, whatever the call rejected with.
		(error: unknown) => error,
	);
	await jest.advanceTimersByTimeAsync(30_000);
	return settled;
}

describe('Square errors reach the caller as core’s ApiError', () => {
	it('keeps the status and Square’s errors[] of a declined card, and does not retry it', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockResolvedValueOnce(jsonResponse(declined, 402));

			const error = await corsair.square.api.payments
				.create(charge)
				// unknown: a rejection can carry any value; the checks below narrow it.
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({ status: 402, body: declined });
			expect(squareErrors(error)).toEqual(declined.errors);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	it.each([401, 403])('does not retry a %i', async (status) => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockResolvedValueOnce(
				jsonResponse(
					{
						errors: [
							{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED' },
						],
					},
					status,
				),
			);
			const error = await corsair.square.api.locations
				.list({})
				// unknown: a rejection can carry any value; the checks below narrow it.
				.catch((e: unknown) => e);
			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({ status });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	it('names a dropped connection by its error name and system code only', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockRejectedValue(
				new TypeError('fetch failed', { cause: { code: 'ECONNRESET' } }),
			);

			const error = await failure(() =>
				corsair.square.api.customers.create({ given_name: 'Ada' }),
			);

			expect(error).toBeInstanceOf(SquareNetworkError);
			expect(error).toMatchObject({
				message: 'Square request got no response (TypeError ECONNRESET)',
				cause: { name: 'TypeError', code: 'ECONNRESET' },
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});
});

describe('Square access tokens stay out of error messages', () => {
	const SECRET = 'EAAAsecret-part-of-the-token';

	/** Every message along an error's cause chain, joined. */
	// unknown: a rejection and its causes can be any value.
	function messages(error: unknown): string {
		const seen: string[] = [];
		let current: unknown = error;
		while (current instanceof Error) {
			seen.push(current.message, String(Object.values(current)));
			current = current.cause;
		}
		if (current !== undefined) seen.push(JSON.stringify(current));
		return seen.join('\n');
	}

	it('refuses a token with a line break before sending, without quoting it', async () => {
		await withClient(async ({ corsair }) => {
			await corsair.square.keys.set_api_key(`${SECRET}\nX-Injected: 1`);

			const error = await failure(() => corsair.square.api.locations.list({}));

			expect(error).toBeInstanceOf(Error);
			expect(error).not.toBeInstanceOf(SquareNetworkError);
			expect(error).toMatchObject({
				message:
					'The Square access token contains a line break or control character; check how it was stored.',
			});
			expect(messages(error)).not.toContain('secret-part');
			expect(fetchMock).not.toHaveBeenCalled();
		});
	});

	it('does not copy a failure’s message, which can quote the Authorization header', () => {
		// Node's Headers rejects a bad value with a message that includes it.
		const error = new SquareNetworkError(
			new TypeError(
				`Headers.append: "Bearer ${SECRET}" is an invalid header value.`,
			),
		);

		expect(error.message).toBe('Square request got no response (TypeError)');
		expect(messages(error)).not.toContain('secret-part');
	});

	it('reads the system code from a nested cause, as undici reports it', () => {
		const error = new SquareNetworkError(
			new TypeError('fetch failed', {
				cause: Object.assign(new Error(`connect to ${SECRET}`), {
					code: 'UND_ERR_CONNECT_TIMEOUT',
				}),
			}),
		);

		expect(error.message).toBe(
			'Square request got no response (TypeError UND_ERR_CONNECT_TIMEOUT)',
		);
		expect(messages(error)).not.toContain('secret-part');
	});
});

describe('Square 429: core’s request() retries it, the plugin does not', () => {
	it('resends a keyless POST after a 429: Square rejected it, it did not run', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock
				.mockResolvedValueOnce(jsonResponse(rateLimited, 429))
				.mockResolvedValueOnce(jsonResponse({ customer: { id: 'C1' } }));

			const pending = corsair.square.api.customers.create({
				given_name: 'Ada',
			});
			await jest.advanceTimersByTimeAsync(10_000);

			await expect(pending).resolves.toEqual({ customer: { id: 'C1' } });
			expect(bodies()).toEqual([{ given_name: 'Ada' }, { given_name: 'Ada' }]);
		});
	});

	it('gives up after core’s 3 retries: 4 requests in all, not 4 per handler retry', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockImplementation(async () => jsonResponse(rateLimited, 429));

			const error = await failure(() => corsair.square.api.customers.list({}));

			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		});
	});

	it('waits for Retry-After when Square sends one', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock
				.mockResolvedValueOnce(
					jsonResponse(rateLimited, 429, { 'Retry-After': '5' }),
				)
				.mockResolvedValueOnce(jsonResponse({ locations: [] }));

			const pending = corsair.square.api.locations.list({});
			await jest.advanceTimersByTimeAsync(4_900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);

			await expect(pending).resolves.toEqual({ locations: [] });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		});
	});
});

describe('Square 5xx and network failures: replayed only for reads and required-key operations', () => {
	it('resends payments.create with the same idempotency_key after a 500', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock
				.mockResolvedValueOnce(jsonResponse(serverError, 500))
				.mockResolvedValueOnce(jsonResponse({ payment: { id: 'P1' } }));

			const pending = corsair.square.api.payments.create(charge);
			await jest.advanceTimersByTimeAsync(10_000);

			await expect(pending).resolves.toEqual({ payment: { id: 'P1' } });
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(bodies()).toEqual([charge, charge]);
		});
	});

	it('resends the same key after the connection drops, too', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock
				.mockRejectedValueOnce(new TypeError('fetch failed'))
				.mockResolvedValueOnce(jsonResponse({ payment: { id: 'P1' } }));

			const pending = corsair.square.api.payments.create(charge);
			await jest.advanceTimersByTimeAsync(10_000);

			await expect(pending).resolves.toEqual({ payment: { id: 'P1' } });
			expect(bodies()).toEqual([charge, charge]);
		});
	});

	it('resends a dispute evidence upload with the same key in its request part', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock
				.mockResolvedValueOnce(jsonResponse(serverError, 500))
				.mockResolvedValueOnce(jsonResponse({ evidence: { id: 'E1' } }));

			const pending = corsair.square.api.disputes.createEvidenceFile({
				dispute_id: 'D1',
				idempotency_key: 'evidence-1',
				content_type: 'image/png',
				file_base64: hello,
				filename: 'receipt.png',
			});
			await jest.advanceTimersByTimeAsync(10_000);

			await expect(pending).resolves.toEqual({ evidence: { id: 'E1' } });
			const expected = {
				idempotency_key: 'evidence-1',
				content_type: 'image/png',
			};
			expect(uploadRequests()).toEqual([expected, expected]);
		});
	});

	it('does not resend an invoice attachment after a 500: its key is optional', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockResolvedValue(jsonResponse(serverError, 500));

			const error = await failure(() =>
				corsair.square.api.invoices.createAttachment({
					invoice_id: 'INV1',
					idempotency_key: 'attachment-1',
					content_type: 'image/png',
					file_base64: hello,
					filename: 'receipt.png',
				}),
			);

			expect(error).toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	it('does not resend a keyless customers.create after a 500: it may have run', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockResolvedValue(jsonResponse(serverError, 500));

			const error = await failure(() =>
				corsair.square.api.customers.create({ given_name: 'Ada' }),
			);

			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({ status: 500, body: serverError });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	it('does not resend a write whose optional key the caller passed', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockResolvedValue(jsonResponse(serverError, 503));

			await failure(() =>
				corsair.square.api.customers.create({
					given_name: 'Ada',
					idempotency_key: 'customer-ada',
				}),
			);

			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	it('does not resend a DELETE after a 500', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockResolvedValue(jsonResponse(serverError, 500));

			await failure(() =>
				corsair.square.api.customers.delete({ customer_id: 'C1' }),
			);

			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	it('does not resend a PUT after a 500', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockResolvedValue(jsonResponse(serverError, 500));

			await failure(() =>
				corsair.square.api.customers.update({
					customer_id: 'C1',
					given_name: 'Ada',
				}),
			);

			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	it('does not resend a keyless write after the connection drops', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockRejectedValue(new TypeError('fetch failed'));

			await failure(() =>
				corsair.square.api.orders.create({
					order: { location_id: 'L1' },
				}),
			);

			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	it('resends a GET after the connection drops', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock
				.mockRejectedValueOnce(
					new TypeError('fetch failed', { cause: { code: 'ECONNRESET' } }),
				)
				.mockResolvedValueOnce(jsonResponse({ locations: [] }));

			const pending = corsair.square.api.locations.list({});
			await jest.advanceTimersByTimeAsync(10_000);

			await expect(pending).resolves.toEqual({ locations: [] });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		});
	});

	it('resends a GET after a 503', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock
				.mockResolvedValueOnce(jsonResponse(serverError, 503))
				.mockResolvedValueOnce(jsonResponse({ locations: [] }));

			const pending = corsair.square.api.locations.list({});
			await jest.advanceTimersByTimeAsync(10_000);

			await expect(pending).resolves.toEqual({ locations: [] });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		});
	});

	it('resends a read-only POST after a 500', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock
				.mockResolvedValueOnce(jsonResponse(serverError, 500))
				.mockResolvedValueOnce(jsonResponse({ orders: [] }));

			const pending = corsair.square.api.orders.search({
				location_ids: ['L1'],
			});
			await jest.advanceTimersByTimeAsync(10_000);

			await expect(pending).resolves.toEqual({ orders: [] });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		});
	});

	it('gives a read 3 attempts in all after repeated 500s', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockImplementation(async () => jsonResponse(serverError, 500));

			await failure(() => corsair.square.api.locations.list({}));

			expect(fetchMock).toHaveBeenCalledTimes(3);
		});
	});
});
