import { logEventFromContext } from 'corsair/core';
import { Validations } from './endpoints';
import {
	batchCompletedFixture,
	batchCreatedFixture,
	batchJobId,
	batchProcessingFixture,
	singleRiskyFixture,
	singleUndeliverableFixture,
} from './test-fixtures';
import { API_KEY, jsonResponse, makeContext } from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
	jest.mocked(logEventFromContext).mockClear();
});

afterEach(() => {
	jest.restoreAllMocks();
});

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url,
		parsed: new URL(url),
		init,
		headers: new Headers(init.headers),
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

function loggedCall() {
	const call = jest.mocked(logEventFromContext).mock.calls[0];
	if (!call) throw new Error('no event was logged');
	const [, event, fields, status] = call;
	return { event, fields, status };
}

describe('validations.single request', () => {
	it('sends GET /v1/validate with the address as the email query parameter', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(singleUndeliverableFixture));

		const result = await Validations.single(makeContext(), {
			email: 'test@example.com',
		});

		const call = lastCall();
		expect(call.init.method).toBe('GET');
		expect(call.parsed.origin).toBe('https://api.mails.so');
		expect(call.parsed.pathname).toBe('/v1/validate');
		expect([...call.parsed.searchParams.keys()]).toEqual(['email']);
		expect(call.parsed.searchParams.get('email')).toBe('test@example.com');
		expect(call.init.body).toBeUndefined();
		expect(fetchMock).toHaveBeenCalledTimes(1);
		// The result is the `data` object, not the envelope.
		expect(result.email).toBe('test@example.com');
		expect(result.result).toBe('undeliverable');
		expect(result).not.toHaveProperty('error');
	});

	it('puts the key in the x-mails-api-key header and nowhere else', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));

		await Validations.single(makeContext(), { email: 'hello@mails.so' });

		const call = lastCall();
		expect(call.headers.get('x-mails-api-key')).toBe(API_KEY);
		expect(call.headers.get('authorization')).toBeNull();
		expect(call.url).not.toContain(API_KEY);
		expect(String(call.init.body ?? '')).not.toContain(API_KEY);
	});

	it('round-trips a plus-addressed email through the query string', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));

		await Validations.single(makeContext(), { email: 'a+tag@example.com' });

		expect(lastCall().parsed.searchParams.get('email')).toBe(
			'a+tag@example.com',
		);
	});

	it('logs the verdict without the email address', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));

		await Validations.single(makeContext(), { email: 'hello@mails.so' });

		const { event, fields, status } = loggedCall();
		expect(event).toBe('mailsso.validations.single');
		expect(fields).toEqual({ result: 'risky', reason: 'catch_all', score: 80 });
		expect(JSON.stringify(fields)).not.toContain('mails.so');
		expect(status).toBe('completed');
	});

	it('sends nothing for an empty email', async () => {
		await expect(
			Validations.single(makeContext(), { email: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('validations.batch request', () => {
	it('sends POST /v1/batch with the emails as a JSON body', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchCreatedFixture));

		const result = await Validations.batch(makeContext(), {
			emails: ['probe-a@example.com', 'probe-b@example.com'],
		});

		const call = lastCall();
		expect(call.init.method).toBe('POST');
		expect(call.parsed.origin).toBe('https://api.mails.so');
		expect(call.parsed.pathname).toBe('/v1/batch');
		expect(call.parsed.search).toBe('');
		expect(call.headers.get('content-type')).toContain('application/json');
		expect(call.body).toEqual({
			emails: ['probe-a@example.com', 'probe-b@example.com'],
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
		// The job comes back at once, with no results.
		expect(result.id).toBe(batchJobId);
		expect(result.status).toBe('pending');
		expect(result.size).toBe(2);
		expect(result).not.toHaveProperty('emails');
	});

	it('puts the key in the x-mails-api-key header and not in the body', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchCreatedFixture));

		await Validations.batch(makeContext(), {
			emails: ['probe-a@example.com', 'probe-b@example.com'],
		});

		const call = lastCall();
		expect(call.headers.get('x-mails-api-key')).toBe(API_KEY);
		expect(call.headers.get('authorization')).toBeNull();
		expect(Object.keys(call.body)).toEqual(['emails']);
		expect(call.url).not.toContain(API_KEY);
	});

	it('logs the job without the addresses', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchCreatedFixture));

		await Validations.batch(makeContext(), {
			emails: ['probe-a@example.com', 'probe-b@example.com'],
		});

		const { event, fields } = loggedCall();
		expect(event).toBe('mailsso.validations.batch');
		expect(fields).toEqual({ batchId: batchJobId, size: 2, status: 'pending' });
		expect(JSON.stringify(fields)).not.toContain('example.com');
	});

	it('sends nothing for fewer than two different emails', async () => {
		await expect(
			Validations.batch(makeContext(), { emails: ['only@example.com'] }),
		).rejects.toThrow();
		await expect(
			Validations.batch(makeContext(), {
				emails: ['same@example.com', 'same@example.com'],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('validations.getBatch request', () => {
	it('sends GET /v1/batch/{id} with no query and no body', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchCompletedFixture));

		const result = await Validations.getBatch(makeContext(), {
			id: batchJobId,
		});

		const call = lastCall();
		expect(call.init.method).toBe('GET');
		expect(call.parsed.origin).toBe('https://api.mails.so');
		expect(call.parsed.pathname).toBe(`/v1/batch/${batchJobId}`);
		expect(call.parsed.search).toBe('');
		expect(call.init.body).toBeUndefined();
		expect(call.headers.get('x-mails-api-key')).toBe(API_KEY);
		expect(call.headers.get('authorization')).toBeNull();
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(result.status).toBe('completed');
		expect(result.emails).toHaveLength(2);
	});

	it('asks for a running job the same way and gets its processing status', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchProcessingFixture, 202));

		const result = await Validations.getBatch(makeContext(), {
			id: batchProcessingFixture.data.id,
		});

		const call = lastCall();
		expect(call.init.method).toBe('GET');
		expect(call.parsed.pathname).toBe(
			`/v1/batch/${batchProcessingFixture.data.id}`,
		);
		expect(call.headers.get('x-mails-api-key')).toBe(API_KEY);
		expect(result.status).toBe('processing');
		expect(loggedCall().fields).toEqual({
			batchId: batchProcessingFixture.data.id,
			status: 'processing',
		});
	});

	it('logs the status and size', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchCompletedFixture));

		await Validations.getBatch(makeContext(), { id: batchJobId });

		const { event, fields } = loggedCall();
		expect(event).toBe('mailsso.validations.getBatch');
		expect(fields).toEqual({
			batchId: batchJobId,
			status: 'completed',
			size: 2,
		});
	});

	it('sends nothing for an id that is not a UUID', async () => {
		await expect(
			Validations.getBatch(makeContext(), { id: '../v1/validate' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
