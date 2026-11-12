import { SquareAPIError } from './client';
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

describe('Square retry safety through createCorsair', () => {
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

	it('does not resend a keyless customers.create after a 500: it may have run', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock.mockResolvedValue(jsonResponse(serverError, 500));

			const pending = corsair.square.api.customers.create({
				given_name: 'Ada',
			});
			const settled = expect(pending).rejects.toMatchObject({
				name: 'SquareAPIError',
				status: 500,
			});
			await jest.advanceTimersByTimeAsync(10_000);
			await settled;

			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

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

	it('gives up on a 429 after 3 retries: 4 requests in all, not 4 per try', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock.mockImplementation(async () => jsonResponse(rateLimited, 429));

			const pending = corsair.square.api.customers.list({});
			const settled = expect(pending).rejects.toMatchObject({ status: 429 });
			await jest.advanceTimersByTimeAsync(30_000);
			await settled;

			expect(fetchMock).toHaveBeenCalledTimes(4);
		});
	});

	it('does not retry a declined card, and says why', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockResolvedValueOnce(jsonResponse(declined, 402));

			const error = await corsair.square.api.payments
				.create(charge)
				// unknown: a rejection can carry any value; the checks below narrow it.
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(SquareAPIError);
			expect(error).toMatchObject({ status: 402 });
			expect(error instanceof Error ? error.message : '').toBe(
				'CARD_DECLINED: Card declined. (source_id)',
			);
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
			await expect(corsair.square.api.locations.list({})).rejects.toMatchObject(
				{
					name: 'SquareAPIError',
					status,
				},
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
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

	it('resends a keyless DELETE after a 500', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock
				.mockResolvedValueOnce(jsonResponse(serverError, 500))
				.mockResolvedValueOnce(jsonResponse({}));
			const pending = corsair.square.api.customers.delete({
				customer_id: 'C1',
			});
			await jest.advanceTimersByTimeAsync(10_000);
			await expect(pending).resolves.toEqual({});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		});
	});
});
