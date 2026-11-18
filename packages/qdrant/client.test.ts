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
		// unknown: returns the rejection so each test can assert on it.
	}).catch((e: unknown) => e);

describe('normalizeQdrantBaseUrl', () => {
	const stored = (url: string | undefined) => () => normalizeQdrantBaseUrl(url);
	const pinned = (url: string | undefined) => () =>
		normalizeQdrantBaseUrl(url, { pinned: true });

	it.each([
		['https://xyz.cloud.qdrant.io:6333/', 'https://xyz.cloud.qdrant.io:6333'],
		[
			'https://abc123.eu-central-1-0.aws.cloud.qdrant.io',
			'https://abc123.eu-central-1-0.aws.cloud.qdrant.io',
		],
		['https://proxy.example.com/qdrant/', 'https://proxy.example.com/qdrant'],
		['https://203.0.113.7:6333', 'https://203.0.113.7:6333'],
		['https://10.example.com', 'https://10.example.com'],
	])('accepts %s stored or pinned', (input, expected) => {
		expect(stored(input)()).toBe(expected);
		expect(pinned(input)()).toBe(expected);
	});

	it.each([
		'http://localhost:6333',
		'http://127.0.0.1:6333',
		'http://[::1]:6333',
		'http://10.0.0.5:6333',
		'http://192.168.1.20:6333',
		'http://qdrant:6333',
		'http://qdrant.default.svc.cluster.local:6333',
		'http://[fd00::5]:6333',
	])('accepts %s over http only when pinned', (input) => {
		expect(pinned(input)()).toBe(input);
		expect(stored(input)).toThrow(
			expect.objectContaining({ code: 'INSECURE_BASE_URL' }),
		);
	});

	it.each([
		'https://localhost:6333',
		'https://app.localhost',
		'https://127.0.0.1:6333',
		'https://2130706433:6333',
		'https://0.0.0.0',
		'https://10.0.0.5:6333',
		'https://100.64.0.1',
		'https://169.254.169.254',
		'https://172.16.0.1',
		'https://192.168.1.20',
		'https://[::1]:6333',
		'https://[::ffff:127.0.0.1]',
		'https://[fd00::5]',
		'https://[fe80::1]',
		'https://qdrant:6333',
		'https://qdrant.:6333',
		'https://api.internal',
		'https://qdrant.default.svc.cluster.local',
	])('rejects stored %s as private, accepts it pinned', (input) => {
		expect(stored(input)).toThrow(
			expect.objectContaining({ code: 'PRIVATE_BASE_URL' }),
		);
		expect(pinned(input)).not.toThrow();
	});

	it.each([
		[undefined, 'MISSING_BASE_URL'],
		['localhost:6333', 'INVALID_BASE_URL'],
		['https://user:pass@qdrant.example.com', 'INVALID_BASE_URL'],
		['https://qdrant.example.com?api-key=secret', 'INVALID_BASE_URL'],
		['http://xyz.cloud.qdrant.io:6333', 'INSECURE_BASE_URL'],
		['http://127.example.com', 'INSECURE_BASE_URL'],
		['http://qdrant.example.com:6333', 'INSECURE_BASE_URL'],
	])('rejects %s, stored or pinned', (input, code) => {
		expect(stored(input)).toThrow(expect.objectContaining({ code }));
		expect(pinned(input)).toThrow(expect.objectContaining({ code }));
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
