import { MistralAiAPIError } from './client';
import { createClient, jsonResponse, mockFetch, model } from './test-fixtures';

// Mistral's documented 422 body (HTTPValidationError).
const validationError = {
	detail: [
		{
			loc: ['body', 'messages', 0, 'content'],
			msg: 'Field required',
			type: 'missing',
		},
		{
			loc: ['body', 'temperature'],
			msg: 'Input should be less than or equal to 1.5',
			type: 'less_than_equal',
		},
	],
};

const modelList = { object: 'list', data: [model] };

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
	options: Parameters<typeof createClient>[0] = {},
) {
	const client = await createClient(options);
	try {
		await run(client);
	} finally {
		client.testDb.cleanup();
	}
}

describe('Mistral AI error handling through createCorsair', () => {
	it('retries a 429 after the Retry-After it carries, then succeeds', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock
				.mockResolvedValueOnce(
					jsonResponse({ message: 'Requests rate limit exceeded' }, 429, {
						'Retry-After': '7',
					}),
				)
				.mockResolvedValueOnce(jsonResponse(modelList));

			const pending = corsair.mistralai.api.models.list({});
			await jest.advanceTimersByTimeAsync(6_999);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(1);
			await expect(pending).resolves.toEqual(modelList);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		});
	});

	it('gives up on a 429 after 3 retries: 4 requests in all, not 4 per try', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock.mockImplementation(async () =>
				jsonResponse({ message: 'Requests rate limit exceeded' }, 429),
			);

			const pending = corsair.mistralai.api.models.list({});
			const settled = expect(pending).rejects.toMatchObject({ status: 429 });
			// Backoff 1s, 2s, 4s.
			await jest.advanceTimersByTimeAsync(7_000);
			await settled;
			expect(fetchMock).toHaveBeenCalledTimes(4);
		});
	});

	it.each([401, 403])('does not retry a %i', async (status) => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockResolvedValueOnce(
				jsonResponse({ message: 'Unauthorized' }, status),
			);
			await expect(corsair.mistralai.api.models.list({})).rejects.toMatchObject(
				{ name: 'MistralAiAPIError', status },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	it('names every rejected field of a 422 and does not retry it', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockResolvedValueOnce(jsonResponse(validationError, 422));
			const error = await corsair.mistralai.api.chat
				.complete({
					model: 'mistral-small-latest',
					messages: [{ role: 'user', content: 'hi' }],
				})
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(MistralAiAPIError);
			expect(error).toMatchObject({ status: 422, body: validationError });
			expect(String((error as Error).message)).toBe(
				'Mistral AI rejected the request: body.messages.0.content: Field required; body.temperature: Input should be less than or equal to 1.5',
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	it('retries a 503 on a write: the service did not take the request', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock
				.mockResolvedValueOnce(jsonResponse({ message: 'overloaded' }, 503))
				.mockResolvedValueOnce(
					jsonResponse({ id: 'x', model: 'm', choices: [] }),
				);

			const pending = corsair.mistralai.api.chat.complete({
				model: 'mistral-small-latest',
				messages: [{ role: 'user', content: 'hi' }],
			});
			await jest.advanceTimersByTimeAsync(1_000);
			await expect(pending).resolves.toMatchObject({ id: 'x' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		});
	});

	it('retries a 408 on a read', async () => {
		await withClient(async ({ corsair }) => {
			jest.useFakeTimers();
			fetchMock
				.mockResolvedValueOnce(jsonResponse({ message: 'timeout' }, 408))
				.mockResolvedValueOnce(jsonResponse(modelList));

			const pending = corsair.mistralai.api.models.list({});
			await jest.advanceTimersByTimeAsync(1_000);
			await expect(pending).resolves.toEqual(modelList);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		});
	});

	it('does not retry a 408 on a write, which may already have run and billed', async () => {
		await withClient(async ({ corsair }) => {
			fetchMock.mockResolvedValueOnce(
				jsonResponse({ message: 'timeout' }, 408),
			);
			await expect(
				corsair.mistralai.api.chat.complete({
					model: 'mistral-small-latest',
					messages: [{ role: 'user', content: 'hi' }],
				}),
			).rejects.toMatchObject({ status: 408 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	it('runs a handler the caller adds under a new name, ahead of DEFAULT', async () => {
		const match = jest.fn(
			(error: Error) =>
				error instanceof MistralAiAPIError && error.status === 404,
		);
		await withClient(
			async ({ corsair }) => {
				jest.useFakeTimers();
				fetchMock
					.mockResolvedValueOnce(jsonResponse({ message: 'not yet' }, 404))
					.mockResolvedValueOnce(jsonResponse(modelList));

				const pending = corsair.mistralai.api.models.list({});
				await jest.advanceTimersByTimeAsync(1_000);
				await expect(pending).resolves.toEqual(modelList);
				expect(match).toHaveBeenCalled();
				expect(fetchMock).toHaveBeenCalledTimes(2);
			},
			{
				errorHandlers: {
					NOT_FOUND_ERROR: {
						match,
						handler: async () => ({
							maxRetries: 1,
							retryStrategy: 'linear_1s',
						}),
					},
				},
			},
		);
	});
});
