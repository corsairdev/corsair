import {
	describeTypeSafeError,
	makeTypeSafeRequest,
	TypeSafeAPIError,
} from './client';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<TypeSafeAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(TypeSafeAPIError);
	return error as TypeSafeAPIError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeTypeSafeRequest', () => {
	it('POSTs JSON with the bearer key and extra headers', async () => {
		const body = { model: 'jev-1.14.0', answers: {}, usage: {} };
		respond(body, 200);

		const result = await makeTypeSafeRequest('ts-key', {
			method: 'POST',
			path: '/v1/systemone',
			body: { model: 'jev-latest', state: 'hi', questions: {} },
			headers: { 'TypeSafe-Danger-Zone-Long-Context': 'true' },
		});

		expect(result).toEqual(body);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.typesafe.ai/v1/systemone');
		expect(init.method).toBe('POST');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe('Bearer ts-key');
		expect(headers.get('content-type')).toBe('application/json');
		expect(headers.get('typesafe-danger-zone-long-context')).toBe('true');
		expect(JSON.parse(String(init.body))).toEqual({
			model: 'jev-latest',
			state: 'hi',
			questions: {},
		});
	});

	it('sends a GET without a body', async () => {
		respond({ models: [] }, 200);

		await makeTypeSafeRequest('ts-key', { method: 'GET', path: '/v1/models' });

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.typesafe.ai/v1/models');
		expect(init.method).toBe('GET');
		expect(init.body).toBeUndefined();
	});

	it('turns an error body into a TypeSafeAPIError with status and type', async () => {
		respond(
			{
				detail: {
					error_type: 'authentication_error',
					message: 'Cannot authenticate with the server.',
				},
			},
			401,
		);

		const error = await failure(
			makeTypeSafeRequest('bad', { method: 'GET', path: '/v1/models' }),
		);
		expect(error.status).toBe(401);
		expect(error.errorType).toBe('authentication_error');
		expect(error.message).toBe(
			'TypeSafe 401: Cannot authenticate with the server.',
		);
	});

	it('reads Retry-After from a 529 overloaded response', async () => {
		respond({ detail: { message: 'Overloaded' } }, 529, {
			'Retry-After': '2',
		});

		const error = await failure(
			makeTypeSafeRequest('ts-key', { method: 'GET', path: '/v1/models' }),
		);
		expect(error.status).toBe(529);
		expect(error.retryAfter).toBeGreaterThan(0);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeTypeSafeRequest('ts-key', { method: 'GET', path: '/v1/models' }),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
	});
});

describe('describeTypeSafeError', () => {
	it('lists 422 field errors by path without the body prefix', () => {
		const body = {
			detail: [
				{
					type: 'missing',
					loc: ['body', 'questions', 'a', 'choice', 'criteria'],
					msg: 'Field required',
				},
				{ type: 'missing', loc: ['body', 'state'], msg: 'Field required' },
			],
		};
		expect(describeTypeSafeError(422, body, 'Unprocessable')).toBe(
			'TypeSafe 422: questions.a.choice.criteria: Field required; state: Field required',
		);
	});

	it('uses a string detail as is', () => {
		expect(describeTypeSafeError(400, { detail: 'Bad JSON' }, 'x')).toBe(
			'TypeSafe 400: Bad JSON',
		);
	});

	it('falls back when the body has no message', () => {
		expect(describeTypeSafeError(502, '<html>bad gateway</html>', 'Bad')).toBe(
			'TypeSafe 502: Bad',
		);
		expect(describeTypeSafeError(undefined, undefined, 'timeout')).toBe(
			'timeout',
		);
	});
});
