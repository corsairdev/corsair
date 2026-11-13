import { ApiError } from '../async-core/ApiError';
import type { OpenAPIConfig } from '../async-core/OpenAPI';
import { request } from '../async-core/request';

// A plugin can ask for a response header (RocketReach's RR-Request-ID,
// SendGrid's X-Message-Id) to be returned instead of the body. That swap is
// for a successful call only: a failed one must keep the provider's error body.

const config: OpenAPIConfig = {
	BASE: 'https://api.example.com',
	VERSION: '1',
	WITH_CREDENTIALS: false,
	CREDENTIALS: 'same-origin',
};

function reply(status: number, body: object) {
	jest.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(JSON.stringify(body), {
			status,
			headers: {
				'content-type': 'application/json',
				'RR-Request-ID': 'req-123',
			},
		}),
	);
}

afterEach(() => {
	jest.restoreAllMocks();
});

describe('request with responseHeader', () => {
	it('returns the header on success', async () => {
		reply(200, { ignored: true });

		await expect(
			request(config, {
				method: 'POST',
				url: '/bulkLookup',
				responseHeader: 'RR-Request-ID',
			}),
		).resolves.toBe('req-123');
	});

	it.each([
		[400, 'Bad Request'],
		[422, 'Daily lookup limit reached'],
	])('keeps the error body on a %s', async (status, message) => {
		const body = { message: 'Daily lookup limit reached', code: 'limit' };
		reply(status, body);

		const error = await request(config, {
			method: 'POST',
			url: '/bulkLookup',
			responseHeader: 'RR-Request-ID',
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).body).toEqual(body);
		expect((error as ApiError).message).toBe(message);
	});
});
