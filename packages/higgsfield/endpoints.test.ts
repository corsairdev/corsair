import { logEventFromContext } from 'corsair/core';
import { HiggsfieldAPIError, HiggsfieldError } from './client';
import {
	createUploadUrl as filesCreateUploadUrl,
	upload as filesUpload,
} from './endpoints/files';
import {
	estimate as generationsEstimate,
	run as generationsRun,
	submit as generationsSubmit,
} from './endpoints/generations';
import { get as modelsGet, list as modelsList } from './endpoints/models';
import {
	cancel as requestsCancel,
	deleteRequest as requestsDelete,
	status as requestsStatus,
} from './endpoints/requests';
import { get as usageGet } from './endpoints/usage';
import {
	API_KEY,
	acceptedBody,
	completedStatusBody,
	jsonResponse,
	REQUEST_ID,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = logEventFromContext as jest.Mock;

// unknown: endpoints read only ctx.key; the rest of the context is the runtime's.
const ctx = { key: API_KEY } as unknown as Parameters<
	typeof generationsSubmit
>[0];

const MODEL = 'higgsfield-ai/soul/v2/standard';
const INPUT = { prompt: 'A paper boat on a calm pond' };
const API = 'https://api.higgsfield.ai';

let fetchMock: jest.SpyInstance;

const callOf = (index: number) => {
	const [url, init] = fetchMock.mock.calls[index];
	return { url: String(url), init };
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
	mockLog.mockResolvedValue(null);
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('generations.submit', () => {
	it('posts the input to the model path with a generated key it returns', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(acceptedBody));
		const response = await generationsSubmit(ctx, {
			modelPath: MODEL,
			input: INPUT,
		});

		const { url, init } = callOf(0);
		expect(url).toBe(`${API}/${MODEL}`);
		expect(init.method).toBe('POST');
		expect(JSON.parse(init.body)).toEqual(INPUT);
		expect(init.headers.Authorization).toBe(`Key ${API_KEY}`);
		const key = init.headers['Idempotency-Key'];
		expect(key).toMatch(/^[0-9a-f-]{36}$/);
		expect(response).toMatchObject({
			status: 'queued',
			request_id: REQUEST_ID,
			expires_after: 604800,
			idempotency_key: key,
		});
	});

	it('passes the caller’s key, webhook and retention', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(acceptedBody));
		const response = await generationsSubmit(ctx, {
			modelPath: MODEL,
			input: INPUT,
			idempotencyKey: 'my-key-1',
			webhookUrl: 'https://example.com/hook?tenantId=t1',
			expiresAfter: 3600,
		});
		const { url, init } = callOf(0);
		expect(new URL(url).searchParams.get('hf_webhook')).toBe(
			'https://example.com/hook?tenantId=t1',
		);
		expect(init.headers['Idempotency-Key']).toBe('my-key-1');
		expect(init.headers['Hf-Expires-After']).toBe('3600');
		expect(response.idempotency_key).toBe('my-key-1');
	});

	it('makes a new key for each argument object', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse(acceptedBody))
			.mockResolvedValueOnce(jsonResponse(acceptedBody));
		await generationsSubmit(ctx, { modelPath: MODEL, input: INPUT });
		await generationsSubmit(ctx, { modelPath: MODEL, input: INPUT });
		expect(callOf(0).init.headers['Idempotency-Key']).not.toBe(
			callOf(1).init.headers['Idempotency-Key'],
		);
	});

	it('keeps the key when the same arguments come back after a failure', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse({ detail: 'boom' }, 500))
			.mockRejectedValueOnce(new TypeError('fetch failed'))
			.mockResolvedValueOnce(jsonResponse(acceptedBody));
		const args = { modelPath: MODEL, input: INPUT };
		await expect(generationsSubmit(ctx, args)).rejects.toThrow('boom');
		await expect(generationsSubmit(ctx, args)).rejects.toThrow(
			'Could not reach',
		);
		const response = await generationsSubmit(ctx, args);
		const keys = [0, 1, 2].map(
			(i) => callOf(i).init.headers['Idempotency-Key'],
		);
		expect(new Set(keys).size).toBe(1);
		expect(response.idempotency_key).toBe(keys[0]);
	});

	it('sends different keys for two concurrent calls with one object', async () => {
		fetchMock.mockImplementation(async () => jsonResponse(acceptedBody));
		const args = { modelPath: MODEL, input: INPUT };
		const [one, two] = await Promise.all([
			generationsSubmit(ctx, args),
			generationsSubmit(ctx, args),
		]);
		expect(callOf(0).init.headers['Idempotency-Key']).not.toBe(
			callOf(1).init.headers['Idempotency-Key'],
		);
		expect(one.idempotency_key).not.toBe(two.idempotency_key);
	});

	it('lets a failed call keep its own key when its twin is accepted', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse(acceptedBody))
			.mockRejectedValueOnce(new TypeError('fetch failed'))
			.mockResolvedValueOnce(jsonResponse(acceptedBody));
		const args = { modelPath: MODEL, input: INPUT };
		const [won, lost] = await Promise.allSettled([
			generationsSubmit(ctx, args),
			generationsSubmit(ctx, args),
		]);
		expect(won.status).toBe('fulfilled');
		expect(lost.status).toBe('rejected');
		const acceptedKey = callOf(0).init.headers['Idempotency-Key'];
		const failedKey = callOf(1).init.headers['Idempotency-Key'];
		expect(failedKey).not.toBe(acceptedKey);

		const retried = await generationsSubmit(ctx, args);
		expect(callOf(2).init.headers['Idempotency-Key']).toBe(failedKey);
		expect(retried.idempotency_key).toBe(failedKey);
	});

	it('gives two failed concurrent calls one key each to retry with', async () => {
		fetchMock
			.mockRejectedValueOnce(new TypeError('fetch failed'))
			.mockRejectedValueOnce(new TypeError('fetch failed'))
			.mockResolvedValueOnce(jsonResponse(acceptedBody))
			.mockResolvedValueOnce(jsonResponse(acceptedBody));
		const args = { modelPath: MODEL, input: INPUT };
		await Promise.allSettled([
			generationsSubmit(ctx, args),
			generationsSubmit(ctx, args),
		]);
		await Promise.all([
			generationsSubmit(ctx, args),
			generationsSubmit(ctx, args),
		]);
		const firstTwo = [0, 1].map(
			(i) => callOf(i).init.headers['Idempotency-Key'],
		);
		const retries = [2, 3].map(
			(i) => callOf(i).init.headers['Idempotency-Key'],
		);
		expect(new Set(firstTwo).size).toBe(2);
		expect([...retries].sort()).toEqual([...firstTwo].sort());
	});

	it('does not pool a key the caller passed', async () => {
		fetchMock
			.mockRejectedValueOnce(new TypeError('fetch failed'))
			.mockResolvedValueOnce(jsonResponse(acceptedBody));
		const args: {
			modelPath: string;
			input: typeof INPUT;
			idempotencyKey?: string;
		} = { modelPath: MODEL, input: INPUT, idempotencyKey: 'mine' };
		await expect(generationsSubmit(ctx, args)).rejects.toThrow(
			'Could not reach',
		);
		args.idempotencyKey = undefined;
		await generationsSubmit(ctx, args);
		expect(callOf(0).init.headers['Idempotency-Key']).toBe('mine');
		expect(callOf(1).init.headers['Idempotency-Key']).not.toBe('mine');
	});

	it('takes the same arguments passed again after acceptance as a new generation', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse(acceptedBody))
			.mockResolvedValueOnce(jsonResponse(acceptedBody));
		const args = { modelPath: MODEL, input: INPUT };
		await generationsSubmit(ctx, args);
		await generationsSubmit(ctx, args);
		expect(callOf(0).init.headers['Idempotency-Key']).not.toBe(
			callOf(1).init.headers['Idempotency-Key'],
		);
	});

	it('tells the caller the key when the request may have been accepted', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'boom' }, 502));
		const error = (await generationsSubmit(ctx, {
			modelPath: MODEL,
			input: INPUT,
			idempotencyKey: 'keep-me',
		}).catch((caught: Error) => caught)) as HiggsfieldAPIError;
		expect(error.idempotencyKey).toBe('keep-me');
		expect(error.message).toContain('idempotencyKey keep-me');
		expect(error.message).toContain('no second charge');
	});

	it('sets the key but makes no promise on a plain rejection', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ detail: 'Not enough credits' }, 403),
		);
		const error = (await generationsSubmit(ctx, {
			modelPath: MODEL,
			input: INPUT,
			idempotencyKey: 'keep-me',
		}).catch((caught: Error) => caught)) as HiggsfieldAPIError;
		expect(error.idempotencyKey).toBe('keep-me');
		expect(error.message).not.toContain('may have accepted');
		expect(error.message).toContain('balance');
	});

	it('surfaces a key reused with different parameters as the API words it', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					detail:
						'Idempotency-Key was already used with different request parameters',
				},
				422,
			),
		);
		await expect(
			generationsSubmit(ctx, {
				modelPath: MODEL,
				input: INPUT,
				idempotencyKey: 'used',
			}),
		).rejects.toThrow('already used with different request parameters');
	});

	it('treats an answer without a request_id as possibly accepted', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ status: 'queued' }));
		const error = (await generationsSubmit(ctx, {
			modelPath: MODEL,
			input: INPUT,
		}).catch((caught: Error) => caught)) as HiggsfieldError;
		expect(error.code).toBe('bad_response');
		expect(error.idempotencyKey).toBeDefined();
		expect(error.message).toContain('may have accepted');
	});

	it.each(['', '../keys', 'a/b', 'has space'])(
		'treats the unusable request_id %p as possibly accepted, and keeps the key',
		async (requestId) => {
			fetchMock
				.mockResolvedValueOnce(
					jsonResponse({ status: 'queued', request_id: requestId }),
				)
				.mockResolvedValueOnce(jsonResponse(acceptedBody));
			const args = { modelPath: MODEL, input: INPUT };
			const error = (await generationsSubmit(ctx, args).catch(
				(caught: Error) => caught,
			)) as HiggsfieldError;
			expect(error.code).toBe('bad_response');
			expect(error.message).toContain('usable request_id');
			expect(error.message).toContain('may have accepted');
			const key = callOf(0).init.headers['Idempotency-Key'];
			expect(error.idempotencyKey).toBe(key);

			const repeat = await generationsSubmit(ctx, args);
			expect(callOf(1).init.headers['Idempotency-Key']).toBe(key);
			expect(repeat.request_id).toBe(REQUEST_ID);
		},
	);

	it('reports input it cannot serialize as invalid, sending nothing', async () => {
		const error = (await generationsSubmit(ctx, {
			modelPath: MODEL,
			input: { seed: BigInt(1) },
		}).catch((caught: Error) => caught)) as HiggsfieldError;
		expect(error.code).toBe('invalid_input');
		expect(error.message).not.toContain('may have accepted');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('does not lose a request over a field it did not expect', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ request_id: REQUEST_ID, expires_after: 'one week' }),
		);
		const response = await generationsSubmit(ctx, {
			modelPath: MODEL,
			input: INPUT,
		});
		expect(response).toMatchObject({
			status: 'queued',
			request_id: REQUEST_ID,
		});
	});

	it('still answers when the log write fails, and warns', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		fetchMock.mockResolvedValueOnce(jsonResponse(acceptedBody));
		mockLog.mockRejectedValueOnce(new Error('db down'));
		try {
			const response = await generationsSubmit(ctx, {
				modelPath: MODEL,
				input: INPUT,
			});
			expect(response.request_id).toBe(REQUEST_ID);
			expect(warn).toHaveBeenCalledWith(
				'Failed to log event:',
				expect.objectContaining({ message: 'db down' }),
			);
		} finally {
			warn.mockRestore();
		}
	});

	it('never logs the prompt', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(acceptedBody));
		await generationsSubmit(ctx, { modelPath: MODEL, input: INPUT });
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('paper boat');
	});

	it.each(['https://evil.example/x', 'a/../b', 'requests/x/cancel'])(
		'refuses %s before any network call',
		async (modelPath) => {
			await expect(
				generationsSubmit(ctx, { modelPath, input: INPUT }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('refuses an http webhook URL before any network call', async () => {
		await expect(
			generationsSubmit(ctx, {
				modelPath: MODEL,
				input: INPUT,
				webhookUrl: 'http://example.com/hook',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('generations.run', () => {
	it('answers with the output once the request completes', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse(acceptedBody))
			.mockResolvedValueOnce(jsonResponse(completedStatusBody));
		const response = await generationsRun(ctx, {
			modelPath: MODEL,
			input: INPUT,
			waitSeconds: 1,
		});
		expect(response.status).toBe('completed');
		expect(response.images?.[0]?.url).toBe('https://cdn.example.com/boat.png');
		expect(response.expires_at).toBe(completedStatusBody.expires_at);
		expect(response.expires_after).toBe(604800);
		expect(response.idempotency_key).toBe(
			callOf(0).init.headers['Idempotency-Key'],
		);
		expect(callOf(1).url).toBe(`${API}/requests/${REQUEST_ID}/status`);
	});

	it.each(['failed', 'nsfw', 'canceled'])(
		'stops at %s and keeps that status',
		async (status) => {
			fetchMock
				.mockResolvedValueOnce(jsonResponse(acceptedBody))
				.mockResolvedValueOnce(
					jsonResponse({ ...acceptedBody, status, error: 'Generation failed' }),
				);
			const response = await generationsRun(ctx, {
				modelPath: MODEL,
				input: INPUT,
				waitSeconds: 1,
			});
			expect(response.status).toBe(status);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		},
	);

	it('polls with backoff, then answers the job when time runs out', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse(acceptedBody))
			.mockImplementation(async () =>
				jsonResponse({ ...acceptedBody, status: 'in_progress' }),
			);
		const started = Date.now();
		const response = await generationsRun(ctx, {
			modelPath: MODEL,
			input: INPUT,
			waitSeconds: 6,
		});
		const elapsed = Date.now() - started;
		expect(response.status).toBe('in_progress');
		expect(response.request_id).toBe(REQUEST_ID);
		expect(elapsed).toBeLessThanOrEqual(6500);
		const reads = fetchMock.mock.calls.length - 1;
		expect(reads).toBeGreaterThanOrEqual(2);
		expect(reads).toBeLessThanOrEqual(4);
	});

	it('does not read at all with waitSeconds 0', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(acceptedBody));
		const response = await generationsRun(ctx, {
			modelPath: MODEL,
			input: INPUT,
			waitSeconds: 0,
		});
		expect(response.status).toBe('queued');
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it.each([
		[
			'a 429',
			() => jsonResponse({ detail: 'slow down' }, 429, { 'Retry-After': '1' }),
		],
		['a 500', () => jsonResponse({ detail: 'boom' }, 500)],
		['a 404', () => jsonResponse({ detail: 'Not found' }, 404)],
		['an unreadable body', () => new Response('<html>', { status: 200 })],
	])(
		'never throws after acceptance when the status read gets %s',
		async (_label, answer) => {
			fetchMock
				.mockResolvedValueOnce(jsonResponse(acceptedBody))
				.mockImplementation(async () => answer());
			const response = await generationsRun(ctx, {
				modelPath: MODEL,
				input: INPUT,
				waitSeconds: 1,
			});
			expect(response).toMatchObject({
				status: 'queued',
				request_id: REQUEST_ID,
			});
			expect(response.idempotency_key).toBeDefined();
		},
	);

	it('never throws after acceptance when the network dies or a log fails', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse(acceptedBody))
			.mockRejectedValue(new TypeError('fetch failed'));
		mockLog.mockRejectedValue(new Error('db down'));
		const response = await generationsRun(ctx, {
			modelPath: MODEL,
			input: INPUT,
			waitSeconds: 1,
		});
		expect(response.request_id).toBe(REQUEST_ID);
	});

	it('does submit only once, whatever the reads do', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse(acceptedBody))
			.mockResolvedValue(jsonResponse({ detail: 'boom' }, 500));
		await generationsRun(ctx, {
			modelPath: MODEL,
			input: INPUT,
			waitSeconds: 1,
		});
		const posts = fetchMock.mock.calls.filter(
			([, init]) => init.method === 'POST',
		);
		expect(posts).toHaveLength(1);
	});

	it('throws when the submit itself is refused, since nothing ran', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ detail: 'Not enough credits' }, 403),
		);
		await expect(
			generationsRun(ctx, { modelPath: MODEL, input: INPUT }),
		).rejects.toThrow('Not enough credits');
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('keeps a completed output when the status read carries an odd field', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse(acceptedBody))
			.mockResolvedValueOnce(
				jsonResponse({
					...completedStatusBody,
					expires_after: 'not a number',
				}),
			);
		const response = await generationsRun(ctx, {
			modelPath: MODEL,
			input: INPUT,
			waitSeconds: 1,
		});
		expect(response.status).toBe('completed');
		expect(response.images?.[0]?.url).toBe('https://cdn.example.com/boat.png');
		expect(response.expires_after).toBe(604800);
	});

	it('keeps a completed output when the receipt carries an odd field', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse({ ...acceptedBody, video: 'soon' }))
			.mockResolvedValueOnce(jsonResponse(completedStatusBody));
		const response = await generationsRun(ctx, {
			modelPath: MODEL,
			input: INPUT,
			waitSeconds: 1,
		});
		expect(response.status).toBe('completed');
		expect(response.images?.[0]?.url).toBe('https://cdn.example.com/boat.png');
		expect(response.idempotency_key).toBeDefined();
	});

	it('reads the status with a fractional waitSeconds', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse(acceptedBody))
			.mockResolvedValueOnce(jsonResponse(completedStatusBody));
		const response = await generationsRun(ctx, {
			modelPath: MODEL,
			input: INPUT,
			waitSeconds: 0.5678,
		});
		expect(response.status).toBe('completed');
	});
});

describe('generations.estimate', () => {
	it('posts the input to the estimate route and sends no idempotency key', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				type: 'estimate',
				credits: '0.050',
				usd: '0.004',
				discount: null,
			}),
		);
		const response = await generationsEstimate(ctx, {
			modelPath: MODEL,
			input: INPUT,
		});
		const { url, init } = callOf(0);
		expect(url).toBe(`${API}/estimate/${MODEL}`);
		expect(JSON.parse(init.body)).toEqual(INPUT);
		expect(init.headers).not.toHaveProperty('Idempotency-Key');
		expect(response.usd).toBe('0.004');
	});

	it('keeps a discount object', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				type: 'estimate',
				usd: '0.536',
				discount: { percentage: '15.00' },
			}),
		);
		const response = await generationsEstimate(ctx, {
			modelPath: MODEL,
			input: INPUT,
		});
		expect(response.discount).toEqual({ percentage: '15.00' });
	});

	it('surfaces model_not_found', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ detail: 'model_not_found' }, 404),
		);
		await expect(
			generationsEstimate(ctx, { modelPath: 'no/model', input: INPUT }),
		).rejects.toThrow('model_not_found');
	});
});

describe('requests.status', () => {
	it('reads a completed request with its output', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(completedStatusBody));
		const response = await requestsStatus(ctx, { requestId: REQUEST_ID });
		expect(callOf(0).url).toBe(`${API}/requests/${REQUEST_ID}/status`);
		expect(response.status).toBe('completed');
		expect(response.images?.[0]?.url).toContain('boat.png');
	});

	it('keeps video, audio and unknown artifacts', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				status: 'completed',
				request_id: REQUEST_ID,
				video: { url: 'https://cdn.example.com/v.mp4' },
				audio: { url: 'https://cdn.example.com/a.mp3' },
				audios: [{ url: 'https://cdn.example.com/a.mp3' }],
				fbx: { url: 'https://cdn.example.com/m.fbx' },
			}),
		);
		const response = await requestsStatus(ctx, { requestId: REQUEST_ID });
		expect(response.video?.url).toContain('v.mp4');
		expect(response.audios).toHaveLength(1);
		expect(response).toHaveProperty('fbx');
	});

	it.each(['failed', 'nsfw', 'canceled', 'queued', 'in_progress'])(
		'keeps the status %s as it came',
		async (status) => {
			fetchMock.mockResolvedValueOnce(
				jsonResponse({ status, request_id: REQUEST_ID, error: null }),
			);
			const response = await requestsStatus(ctx, { requestId: REQUEST_ID });
			expect(response.status).toBe(status);
		},
	);

	it('throws on an unknown request', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ detail: 'Not found' }, 404, {
				'X-Correlation-ID': 'corr-1',
			}),
		);
		await expect(
			requestsStatus(ctx, { requestId: REQUEST_ID }),
		).rejects.toThrow(/404: Not found.*corr-1/);
	});

	it('refuses a path-shaped id before any network call', async () => {
		await expect(
			requestsStatus(ctx, { requestId: '../../models' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('requests.cancel', () => {
	it('answers canceled on the empty 202', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 202 }));
		const response = await requestsCancel(ctx, { requestId: REQUEST_ID });
		const { url, init } = callOf(0);
		expect(url).toBe(`${API}/requests/${REQUEST_ID}/cancel`);
		expect(init.method).toBe('POST');
		expect(response).toEqual({ request_id: REQUEST_ID, status: 'canceled' });
	});

	it('explains the 400 once the request has started', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ detail: 'Request is in progress' }, 400),
		);
		await expect(
			requestsCancel(ctx, { requestId: REQUEST_ID }),
		).rejects.toThrow(/Request is in progress.*Only a queued request/);
	});
});

describe('requests.delete', () => {
	it('deletes a finished request', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ request_id: REQUEST_ID, status: 'deleted' }),
		);
		const response = await requestsDelete(ctx, { requestId: REQUEST_ID });
		const { url, init } = callOf(0);
		expect(url).toBe(`${API}/requests/${REQUEST_ID}`);
		expect(init.method).toBe('DELETE');
		expect(response.status).toBe('deleted');
	});

	it('says why a running request is refused', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ detail: 'Request is still running' }, 409),
		);
		await expect(
			requestsDelete(ctx, { requestId: REQUEST_ID }),
		).rejects.toThrow(/409.*still running/);
	});
});

describe('files', () => {
	const created = {
		public_url: 'https://cdn.example.com/input/x.png',
		upload_url: 'https://bucket.s3.amazonaws.com/x.png?X-Amz-Signature=sig',
		content_type: 'image/png',
		upload_headers: {
			'Content-Type': 'image/png',
			'x-amz-tagging': 'retention=temporary',
		},
	};

	it('files.createUploadUrl asks for the type', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(created));
		const response = await filesCreateUploadUrl(ctx, {
			contentType: 'image/png',
		});
		const { url, init } = callOf(0);
		expect(url).toBe(`${API}/files/generate-upload-url`);
		expect(JSON.parse(init.body)).toEqual({ content_type: 'image/png' });
		expect(response.upload_headers?.['x-amz-tagging']).toBe(
			'retention=temporary',
		);
	});

	it('files.createUploadUrl refuses a type outside the list', async () => {
		await expect(
			filesCreateUploadUrl(ctx, {
				contentType: 'application/pdf' as 'image/png',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	describe('files.upload from base64', () => {
		it('decodes, PUTs with the returned headers and no key, and answers the public URL', async () => {
			fetchMock
				.mockResolvedValueOnce(jsonResponse(created))
				.mockResolvedValueOnce(new Response(null, { status: 200 }));
			const response = await filesUpload(ctx, {
				contentBase64: Buffer.from('hello').toString('base64'),
				contentType: 'image/png',
			});
			const put = callOf(1);
			expect(put.url).toBe(created.upload_url);
			expect(put.init.method).toBe('PUT');
			expect(Buffer.from(put.init.body).toString()).toBe('hello');
			expect(put.init.headers).toEqual(created.upload_headers);
			expect(JSON.stringify(put.init.headers)).not.toContain('test-key');
			expect(response).toEqual({
				public_url: created.public_url,
				content_type: 'image/png',
				size: 5,
			});
		});

		it('takes a data: URL and URL-safe, unpadded base64', async () => {
			fetchMock
				.mockResolvedValueOnce(jsonResponse(created))
				.mockResolvedValueOnce(new Response(null, { status: 200 }));
			const response = await filesUpload(ctx, {
				contentBase64: 'data:image/png;base64,_-8',
				contentType: 'image/png',
			});
			expect(response.size).toBe(2);
		});

		it.each(['not base64!', 'YWJjA', 'YWJj=', 'A', '===='])(
			'refuses %p before asking for a URL',
			async (contentBase64) => {
				await expect(
					filesUpload(ctx, { contentBase64, contentType: 'image/png' }),
				).rejects.toBeInstanceOf(HiggsfieldError);
				expect(fetchMock).not.toHaveBeenCalled();
			},
		);

		it('checks the size before decoding', async () => {
			const fromSpy = jest.spyOn(Buffer, 'from');
			const size = 100 * 1024 * 1024 + 3;
			await expect(
				filesUpload(ctx, {
					contentBase64: 'A'.repeat(Math.ceil((size * 4) / 3)),
					contentType: 'image/png',
				}),
			).rejects.toThrow('files.upload takes up to');
			expect(fromSpy).not.toHaveBeenCalled();
			expect(fetchMock).not.toHaveBeenCalled();
			fromSpy.mockRestore();
		});

		it('reports a refused PUT without the signed URL', async () => {
			fetchMock
				.mockResolvedValueOnce(jsonResponse(created))
				.mockResolvedValueOnce(new Response('no', { status: 403 }));
			const error = await filesUpload(ctx, {
				contentBase64: 'YWJj',
				contentType: 'image/png',
			}).catch((caught: Error) => caught);
			expect(error).toMatchObject({ code: 'upload_failed' });
			expect((error as Error).message).not.toContain('X-Amz');
		});
	});
});

describe('models', () => {
	const listing = {
		total: 2,
		items: [
			{
				slug: MODEL,
				title: 'Soul 2',
				operation_type: ['text2image'],
				output_type: 'image',
				base_credits: '0.0000',
				is_workflow: false,
				fnf_job_set_type: null,
				input_schema: {
					type: 'object',
					required: ['prompt'],
					properties: { prompt: { type: 'string' } },
				},
			},
			{ slug: `${MODEL}-extra`, input_schema: null },
		],
	};

	it('models.list passes its filters', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(listing));
		const response = await modelsList(ctx, {
			search: 'soul',
			outputType: 'image',
			operationType: 'text2image',
			includeSchema: true,
		});
		const url = new URL(callOf(0).url);
		expect(url.pathname).toBe('/models');
		expect(Object.fromEntries(url.searchParams)).toEqual({
			search: 'soul',
			output_type: 'image',
			operation_type: 'text2image',
			include_schema: 'true',
		});
		expect(response.total).toBe(2);
		expect(response.items[0]).toHaveProperty('fnf_job_set_type');
	});

	it('models.list sends nothing extra by default', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ total: 0, items: [] }));
		await modelsList(ctx, {});
		expect(callOf(0).url).toBe(`${API}/models`);
	});

	it('models.get picks the exact path, with its schema', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(listing));
		const response = await modelsGet(ctx, { modelPath: `/${MODEL}/` });
		expect(new URL(callOf(0).url).searchParams.get('include_schema')).toBe(
			'true',
		);
		expect(response.slug).toBe(MODEL);
		expect(response.input_schema).toMatchObject({ required: ['prompt'] });
	});

	it('models.get says so when the path is not listed', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(listing));
		const error = await modelsGet(ctx, { modelPath: 'no/model' }).catch(
			(caught: Error) => caught,
		);
		expect(error).toMatchObject({ code: 'not_found' });
		expect((error as Error).message).toContain('"no/model"');
	});

	it.each([404, 405, 410])(
		'points at the docs if the undocumented route answers %i',
		async (status) => {
			fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'x' }, status));
			await expect(modelsList(ctx, {})).rejects.toThrow(
				'docs.higgsfield.ai/docs/models',
			);
		},
	);

	it('points at the docs if the route answers another shape', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ models: [] }));
		await expect(modelsList(ctx, {})).rejects.toThrow(
			'docs.higgsfield.ai/docs/models',
		);
	});

	it('passes a credentials or server problem through as it is', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ detail: 'Invalid credentials' }, 401),
		);
		await expect(modelsList(ctx, {})).rejects.toThrow('Invalid credentials');
		fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'boom' }, 500));
		await expect(modelsList(ctx, {})).rejects.toThrow('boom');
	});
});

describe('usage.get', () => {
	it('passes its filters and repeats list params', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				time_series: [
					{
						bucket: '2026-10-23T00:00:00Z',
						results: [
							{
								model: MODEL,
								unit: 'generation',
								quantity: '120',
								unit_price: '0.0940',
								cost: '11.2800',
								currency: 'USD',
								auth_method: 'key-id',
							},
						],
					},
				],
				total: 1,
				page: 1,
				limit: 50,
			}),
		);
		const response = await usageGet(ctx, {
			start: '2026-10-01T00:00:00Z',
			end: '2026-10-24T00:00:00Z',
			timeframe: 'day',
			boundToTimeframe: false,
			models: [MODEL, 'z-image/turbo'],
			byApiKey: true,
			page: 2,
			limit: 10,
		});
		const url = new URL(callOf(0).url);
		expect(url.pathname).toBe('/models/usage');
		expect(url.searchParams.getAll('model')).toEqual([MODEL, 'z-image/turbo']);
		expect(url.searchParams.getAll('expand')).toEqual([
			'time_series',
			'auth_method',
		]);
		expect(url.searchParams.get('bound_to_timeframe')).toBe('false');
		expect(url.searchParams.get('timeframe')).toBe('day');
		expect(url.searchParams.get('page')).toBe('2');
		expect(response.time_series?.[0]?.results[0]?.cost).toBe('11.2800');
	});

	it('sends nothing extra by default, and answers an empty range', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ time_series: [], total: 0, page: 1, limit: 50 }),
		);
		const response = await usageGet(ctx, {});
		expect(callOf(0).url).toBe(`${API}/models/usage`);
		expect(response.total).toBe(0);
	});
});

describe('error classes', () => {
	it('exports API errors that are also core ApiErrors', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'x' }, 404));
		const error = await requestsStatus(ctx, { requestId: REQUEST_ID }).catch(
			(caught: Error) => caught,
		);
		expect(error).toBeInstanceOf(HiggsfieldAPIError);
		expect((error as HiggsfieldAPIError).status).toBe(404);
	});
});
