import { ApiError } from '../async-core/ApiError';
import type { ApiRequestOptions } from '../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../async-core/OpenAPI';
import { request } from '../async-core/request';

const originalFetch = global.fetch;

const config: OpenAPIConfig = {
	BASE: 'https://api.example.com',
	VERSION: '1',
	WITH_CREDENTIALS: false,
	CREDENTIALS: 'same-origin',
};

const options: ApiRequestOptions = {
	method: 'POST',
	url: '/things',
	body: { name: 'thing' },
};

// `body` is `unknown` on purpose: these tests send error bodies of different
// shapes (nested objects, arrays), and Response.json accepts any value.
function respondWith(status: number, body: unknown) {
	// The jest mock only implements the call signature, so it is not assignable
	// to `typeof fetch` without the assertion. request() only ever calls it.
	global.fetch = jest.fn(async () =>
		Response.json(body, { status }),
	) as typeof fetch;
}

async function captureError(): Promise<ApiError> {
	try {
		await request(config, options);
	} catch (error) {
		if (error instanceof ApiError) return error;
		throw error;
	}
	throw new Error('expected request to reject');
}

afterEach(() => {
	global.fetch = originalFetch;
});

describe('request error messages for unmapped statuses', () => {
	it('uses error.message when the error field is an object', async () => {
		// Google, OpenAI and Stripe style: { error: { message, ... } }
		respondWith(409, {
			error: {
				code: 409,
				message: 'Requested entity already exists',
				status: 'ALREADY_EXISTS',
			},
		});

		const error = await captureError();

		expect(error.status).toBe(409);
		expect(error.message).toBe('Requested entity already exists');
	});

	it('falls back to the generic message when detail is not a string', async () => {
		// FastAPI style validation error: detail is an array of objects
		respondWith(422, {
			detail: [{ loc: ['body', 'name'], msg: 'field required' }],
		});

		const error = await captureError();

		expect(error.status).toBe(422);
		expect(error.message).not.toContain('[object Object]');
		expect(error.message).toContain('status: 422');
		expect(error.message).toContain('field required');
	});

	it('keeps using string message, error and detail fields as before', async () => {
		respondWith(409, { message: 'from message', error: 'from error' });
		expect((await captureError()).message).toBe('from message');

		respondWith(409, { error: 'from error' });
		expect((await captureError()).message).toBe('from error');

		respondWith(409, { detail: 'from detail' });
		expect((await captureError()).message).toBe('from detail');
	});
});
