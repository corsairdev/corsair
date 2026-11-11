import {
	describeHappyScribeError,
	HappyScribeAPIError,
	makeHappyScribeRequest,
	segment,
} from './client';
import { badKey, rateLimited, transcription } from './test-fixtures';

const API_KEY = 'hs-secret-test-key';

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
async function failure(
	promise: Promise<unknown>,
): Promise<HappyScribeAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(HappyScribeAPIError);
	if (!(error instanceof HappyScribeAPIError)) throw error;
	return error;
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeHappyScribeRequest', () => {
	it('authenticates with a Bearer token and no other credential', async () => {
		respond(transcription, 200);

		const result = await makeHappyScribeRequest(API_KEY, {
			method: 'GET',
			path: '/transcriptions/abc',
		});

		expect(result).toEqual(transcription);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://www.happyscribe.com/api/v1/transcriptions/abc');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	});

	it('POSTs a JSON body with the snake_case keys the API takes', async () => {
		respond(transcription, 200);

		await makeHappyScribeRequest(API_KEY, {
			method: 'POST',
			path: '/transcriptions',
			body: {
				transcription: {
					name: 'Interview',
					language: 'en-GB',
					tmp_url: 'https://example.com/media.mp3',
					organization_id: 123,
				},
			},
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toMatchObject({
			transcription: { organization_id: 123 },
		});
	});

	it('captures retry_in_seconds from a 429 body', async () => {
		respond(rateLimited, 429);

		const error = await failure(
			makeHappyScribeRequest(API_KEY, {
				method: 'POST',
				path: '/transcriptions',
				body: { transcription: { name: 'x' } },
			}),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryInSeconds).toBe(30);
	});

	it('reads message and status from an error body', async () => {
		respond(badKey, 401);

		const error = await failure(
			makeHappyScribeRequest(API_KEY, { method: 'GET', path: '/me' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('HappyScribe 401');
	});

	it('does not leak the key through any error surface', async () => {
		respond(badKey, 401);

		const error = await failure(
			makeHappyScribeRequest(API_KEY, { method: 'GET', path: '/me' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.cause)).not.toContain(API_KEY);
	});

	it('flags replaySafe onto the thrown error', async () => {
		respond({ message: 'boom' }, 503);
		const read = await failure(
			makeHappyScribeRequest(API_KEY, {
				method: 'GET',
				path: '/transcriptions',
				replaySafe: true,
			}),
		);
		expect(read.replaySafe).toBe(true);

		respond({ message: 'boom' }, 503);
		const write = await failure(
			makeHappyScribeRequest(API_KEY, {
				method: 'POST',
				path: '/transcriptions',
				body: { transcription: { name: 'x' } },
			}),
		);
		expect(write.replaySafe).toBe(false);
	});

	it('describes errors with message and retry hint', () => {
		const text = describeHappyScribeError(429, rateLimited, 'fallback');
		expect(text).toContain('HappyScribe 429');
		expect(text).toContain('Slow down');
		expect(text).toContain('retry_in_seconds: 30');
		expect(describeHappyScribeError(undefined, {}, 'fallback')).toBe(
			'fallback',
		);
	});

	it('describes a 422 by its errors array', () => {
		// Shape from the Create a Meeting error reference.
		expect(
			describeHappyScribeError(
				422,
				{ errors: ['Meeting url must be a valid URL'] },
				'Unprocessable Entity',
			),
		).toBe('HappyScribe 422: Meeting url must be a valid URL');
	});

	it('describes the live errors array of objects, with the field', () => {
		// Bodies the live API sent on 11-11 (meetings, memberships, Intelligence).
		expect(
			describeHappyScribeError(
				422,
				{
					errors: [
						{
							code: 'invalid',
							field: 'meeting_url',
							message: "isn't a meeting link we recognize.",
						},
					],
				},
				'Unprocessable Entity',
			),
		).toBe("HappyScribe 422: meeting_url isn't a meeting link we recognize.");
		expect(
			describeHappyScribeError(
				422,
				{
					errors: [
						{
							code: 'role_not_allowed',
							message: 'Role not allowed on current plan',
						},
					],
				},
				'Unprocessable Entity',
			),
		).toBe('HappyScribe 422: Role not allowed on current plan');
	});

	it('percent-encodes path segments', () => {
		expect(segment('a b/c')).toBe('a%20b%2Fc');
	});
});
