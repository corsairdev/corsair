import { ApiError } from 'corsair/http';
import { z } from 'zod';
import { makeQdrantRequest, normalizeQdrantBaseUrl } from './client';
import { mockFetch } from './test-harness';

afterEach(() => jest.restoreAllMocks());

const baseUrl = 'https://qdrant.test:6333';
const schema = z.object({ count: z.number() });
const send = (apiKey = 'secret', timeout?: number) =>
	makeQdrantRequest('/count', apiKey, {
		baseUrl,
		method: 'POST',
		body: { exact: true },
		timeout,
		schema,
	}).catch((e: unknown) => e);

describe('normalizeQdrantBaseUrl', () => {
	it.each([
		['https://xyz.cloud.qdrant.io:6333/', 'https://xyz.cloud.qdrant.io:6333'],
		['https://proxy.example.com/qdrant/', 'https://proxy.example.com/qdrant'],
		['http://localhost:6333', 'http://localhost:6333'],
		['http://10.0.0.5:6333', 'http://10.0.0.5:6333'],
		[
			'http://qdrant.default.svc.cluster.local:6333',
			'http://qdrant.default.svc.cluster.local:6333',
		],
	])('accepts %s', (input, expected) => {
		expect(normalizeQdrantBaseUrl(input)).toBe(expected);
	});

	it.each([
		[undefined, 'MISSING_BASE_URL'],
		['localhost:6333', 'INVALID_BASE_URL'],
		['https://user:pass@qdrant.example.com', 'INVALID_BASE_URL'],
		['https://qdrant.example.com?api-key=secret', 'INVALID_BASE_URL'],
		['http://xyz.cloud.qdrant.io:6333', 'INSECURE_BASE_URL'],
		['http://127.example.com', 'INSECURE_BASE_URL'],
	])('rejects %s', (input, code) => {
		expect(() => normalizeQdrantBaseUrl(input)).toThrow(
			expect.objectContaining({ code }),
		);
	});
});

describe('makeQdrantRequest', () => {
	it('sends the key as api-key and returns the validated result', async () => {
		const requests = mockFetch({ body: { result: { count: 3 } } });
		await expect(send()).resolves.toEqual({ count: 3 });
		expect(requests[0]?.headers['api-key']).toBe('secret');
		expect(requests[0]?.headers.authorization).toBeUndefined();
		expect(requests[0]?.body).toEqual({ exact: true });
	});

	it('sends no api-key header without a key', async () => {
		const requests = mockFetch({ body: { result: { count: 0 } } });
		await send('');
		expect(requests[0]?.headers['api-key']).toBeUndefined();
	});

	it('uses Qdrant’s reason as the message and keeps the status', async () => {
		mockFetch({
			status: 409,
			body: { status: { error: 'Collection `docs` already exists!' } },
		});
		const error = await send();
		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({
			status: 409,
			message: 'Collection `docs` already exists!',
		});
	});

	it('rejects a result that does not match the schema', async () => {
		mockFetch({ body: { result: { count: 'three' } } });
		await expect(send()).resolves.toMatchObject({ code: 'INVALID_RESPONSE' });
	});

	it('waits 5 minutes by default, or the timeout plus 5 seconds', async () => {
		const timeout = jest.spyOn(AbortSignal, 'timeout');
		mockFetch(
			{ body: { result: { count: 0 } } },
			{ body: { result: { count: 0 } } },
		);
		await send();
		await send('secret', 60);
		expect(timeout.mock.calls.map(([ms]) => ms)).toEqual([300_000, 65_000]);
	});
});
