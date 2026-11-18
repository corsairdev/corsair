import {
	describeEmailOctopusError,
	EmailOctopusAPIError,
	makeEmailOctopusRequest,
	segment,
} from './client';
import { list, problem } from './test-fixtures';

const API_KEY = 'eo-test-key';

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

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(
	promise: Promise<unknown>,
): Promise<EmailOctopusAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(EmailOctopusAPIError);
	if (!(error instanceof EmailOctopusAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeEmailOctopusRequest', () => {
	it('sends a bearer token and a JSON body', async () => {
		respond(list, 201);

		await makeEmailOctopusRequest(API_KEY, {
			method: 'POST',
			path: '/lists',
			body: { name: 'New clients list' },
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.emailoctopus.com/lists');
		expect(init.method).toBe('POST');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(headers.get('content-type')).toBe('application/json');
		expect(JSON.parse(String(init.body))).toEqual({ name: 'New clients list' });
	});

	it('encodes query parameters and omits empty ones', async () => {
		respond({ data: [list] }, 200);

		await makeEmailOctopusRequest(API_KEY, {
			method: 'GET',
			path: '/lists',
			query: { limit: 10, starting_after: undefined, tag: 'vip' },
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.emailoctopus.com/lists?limit=10&tag=vip');
		expect(init.method).toBe('GET');
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('returns undefined for a 204', async () => {
		respondEmpty(204);

		await expect(
			makeEmailOctopusRequest(API_KEY, {
				method: 'DELETE',
				path: `/lists/${segment('list-1')}`,
			}),
		).resolves.toBeUndefined();
	});

	it('reads the problem+json detail and makes one attempt on 429', async () => {
		respond(problem, 429, { 'x-ratelimit-retry-after': '2' });

		const error = await failure(
			makeEmailOctopusRequest(API_KEY, { method: 'GET', path: '/lists' }),
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.status).toBe(429);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(2000);
		expect(error.message).toBe('EmailOctopus 429: Bad request.');
		expect(describeEmailOctopusError(429, problem, 'fallback')).toBe(
			'EmailOctopus 429: Bad request.',
		);
	});

	it('puts the 422 field errors in the message', async () => {
		// Body as the live API returned it for a decimal in a number field.
		const unprocessable = {
			title: 'An error occurred.',
			detail: 'Unprocessable content.',
			status: 422,
			errors: [
				{
					detail: 'This field must be of type "integer"',
					pointer: '/fields/seats',
				},
				{ detail: 'This value is not a valid email address.' },
				{ pointer: '/status' },
			],
			type: 'https://emailoctopus.com/api-documentation/v2#unprocessable-content',
		};
		respond(unprocessable, 422);

		const error = await failure(
			makeEmailOctopusRequest(API_KEY, {
				method: 'POST',
				path: '/lists/list-1/contacts',
				body: { email_address: 'a@example.com', fields: { seats: 2.5 } },
			}),
		);

		expect(error.status).toBe(422);
		expect(error.message).toBe(
			'EmailOctopus 422: Unprocessable content. /fields/seats: This field must be of type "integer"; This value is not a valid email address.',
		);
		expect(error.body).toEqual(unprocessable);
	});

	it('keeps a non-JSON body on the error', async () => {
		respond('nope', 502);

		const error = await failure(
			makeEmailOctopusRequest(API_KEY, { method: 'GET', path: '/lists' }),
		);

		expect(error.status).toBe(502);
		expect(error.body).toBe('nope');
		expect(error.method).toBe('GET');
	});
});
