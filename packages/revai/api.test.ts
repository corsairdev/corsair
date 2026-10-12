import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { getJob, getTranscript, submitJob } from './endpoints/jobs';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

type Ctx = Parameters<typeof submitJob>[0];

// Safe: holds whatever the endpoint wrote so the tests can assert it exactly.
// A narrower type is not practical because the entity store accepts the generated entity type.
const upserts: Array<[string, unknown]> = [];

const fakeCtx = {
	key: 'test_token',
	db: {
		job: {
			// Safe: the stub records whatever entity the endpoint writes and the tests assert its exact value.
			// A narrower type is not practical because the store accepts the generated entity type, which this stub only forwards.
			upsertByEntityId: async (id: string, data: unknown): Promise<unknown> => {
				upserts.push([id, data]);
				return null;
			},
		},
	},
};

// Safe: the endpoints read only `key` and `db.job`, and every other context member is unused here.
// A narrower type is not practical because the full context is built by the Corsair runtime from a live database.
const ctx = fakeCtx as Ctx;

const BASE = 'https://api.rev.ai/speechtotext/v1';

const JOB = {
	id: 'Umx5c6F7pH7r',
	status: 'in_progress',
	created_on: '2026-10-12T23:00:00.29Z',
	type: 'async',
	language: 'en',
	metadata: 'demo',
};

function respond(
	status: number,
	body: string,
	headers: Record<string, string>,
) {
	return new Response(body, { status, headers });
}

describe('Rev AI endpoints', () => {
	const originalFetch = global.fetch;
	let fetchMock: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		upserts.length = 0;
		fetchMock = jest.fn();
		global.fetch = fetchMock;
	});

	afterAll(() => {
		global.fetch = originalFetch;
	});

	function lastCall() {
		const [url, init] = fetchMock.mock.calls[0];
		return {
			url: String(url),
			method: init.method,
			body: init.body,
			headers: new Headers(init.headers),
		};
	}

	it('submitJob POSTs /jobs with source_config and persists the job', async () => {
		fetchMock.mockResolvedValue(
			respond(200, JSON.stringify(JOB), { 'Content-Type': 'application/json' }),
		);

		const result = await submitJob(ctx, {
			media_url: 'https://test.com/audio.mp3',
			metadata: 'demo',
			language: 'en',
			notification_config: {
				url: 'https://example.com/webhooks/revai',
				auth_headers: { Authorization: 'Bearer webhook-secret' },
			},
		});

		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.url).toBe(`${BASE}/jobs`);
		expect(call.headers.get('Authorization')).toBe('Bearer test_token');
		expect(JSON.parse(call.body)).toEqual({
			source_config: { url: 'https://test.com/audio.mp3' },
			metadata: 'demo',
			language: 'en',
			notification_config: {
				url: 'https://example.com/webhooks/revai',
				auth_headers: { Authorization: 'Bearer webhook-secret' },
			},
		});
		expect(result).toEqual(JOB);
		expect(upserts).toEqual([
			[
				'Umx5c6F7pH7r',
				{ ...JOB, created_on: new Date('2026-10-12T23:00:00.29Z') },
			],
		]);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'revai.jobs.submit',
			{
				metadata: 'demo',
				language: 'en',
				notification_config: { url: 'https://example.com/webhooks/revai' },
			},
			'completed',
		);
	});

	it('submitJob rejects an invalid URL and an id-less response', async () => {
		await expect(submitJob(ctx, { media_url: 'not-a-url' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();

		fetchMock.mockResolvedValue(
			respond(200, JSON.stringify({ status: 'in_progress' }), {
				'Content-Type': 'application/json',
			}),
		);
		await expect(
			submitJob(ctx, { media_url: 'https://test.com/audio.mp3' }),
		).rejects.toThrow();
		expect(upserts).toEqual([]);
	});

	it('getJob GETs /jobs/{id} with an encoded id and persists the job', async () => {
		const done = {
			...JOB,
			status: 'transcribed',
			completed_on: '2026-10-12T23:01:00Z',
			duration_seconds: 12.5,
		};
		fetchMock.mockResolvedValue(
			respond(200, JSON.stringify(done), {
				'Content-Type': 'application/json',
			}),
		);

		const result = await getJob(ctx, { id: 'some/id?x=1' });

		const call = lastCall();
		expect(call.method).toBe('GET');
		expect(call.url).toBe(`${BASE}/jobs/some%2Fid%3Fx%3D1`);
		expect(result).toEqual(done);
		expect(upserts).toEqual([
			[
				'Umx5c6F7pH7r',
				{
					...done,
					created_on: new Date('2026-10-12T23:00:00.29Z'),
					completed_on: new Date('2026-10-12T23:01:00Z'),
				},
			],
		]);
	});

	it('getTranscript requests plain text with the Accept header', async () => {
		fetchMock.mockResolvedValue(
			respond(200, 'hello world', { 'Content-Type': 'text/plain' }),
		);

		const result = await getTranscript(ctx, {
			id: 'job1',
			accept: 'text/plain',
		});

		const call = lastCall();
		expect(call.method).toBe('GET');
		expect(call.url).toBe(`${BASE}/jobs/job1/transcript`);
		expect(call.headers.get('Accept')).toBe('text/plain');
		expect(result).toBe('hello world');
		expect(upserts).toEqual([]);
	});

	it('getTranscript parses the vendor JSON transcript', async () => {
		const transcript = {
			monologues: [
				{
					speaker: 0,
					elements: [{ type: 'text', value: 'Hello', ts: 0.1, end_ts: 0.5 }],
				},
			],
		};
		fetchMock.mockResolvedValue(
			respond(200, JSON.stringify(transcript), {
				'Content-Type': 'application/vnd.rev.transcript.v1.0+json',
			}),
		);

		const result = await getTranscript(ctx, {
			id: 'job1',
			accept: 'application/vnd.rev.transcript.v1.0+json',
		});

		expect(lastCall().headers.get('Accept')).toBe(
			'application/vnd.rev.transcript.v1.0+json',
		);
		expect(result).toEqual(transcript);
	});

	it('surfaces a 401 as an ApiError routed to the auth handler', async () => {
		fetchMock.mockResolvedValue(
			respond(401, JSON.stringify({ title: 'Unauthorized', status: 401 }), {
				'Content-Type': 'application/problem+json',
			}),
		);

		const error = await getJob(ctx, { id: 'job1' }).catch((e) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(upserts).toEqual([]);
	});

	it('retries a 429 honouring Retry-After, then succeeds', async () => {
		fetchMock
			.mockResolvedValueOnce(
				respond(429, '{}', {
					'Content-Type': 'application/problem+json',
					'Retry-After': '0',
				}),
			)
			.mockResolvedValueOnce(
				respond(200, JSON.stringify(JOB), {
					'Content-Type': 'application/json',
				}),
			);

		const result = await getJob(ctx, { id: 'job1' });

		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(result).toEqual(JOB);
	});

	it('maps a 429 with Retry-After to the rate limit handler delay', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/jobs/job1' },
			{
				url: '/jobs/job1',
				ok: false,
				status: 429,
				statusText: 'Too Many',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 7000 },
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 7000,
		});
	});
});
