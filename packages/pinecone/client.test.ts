import { z } from 'zod';
import {
	makePineconeRequest,
	normalizePineconeHost,
	PINECONE_API_VERSION,
	PineconeAPIError,
} from './client';
import { installFetchHarness } from './test-harness';

describe('Pinecone client', () => {
	let harness: ReturnType<typeof installFetchHarness>;

	beforeEach(() => {
		harness = installFetchHarness();
	});

	afterEach(() => {
		harness.restore();
	});

	it('uses Pinecone API-key auth and the pinned version header', async () => {
		harness.queue({ body: { indexes: [] } });

		await makePineconeRequest('/indexes', 'pcsk_test');

		const request = harness.requestAt(0);
		expect(request.url).toBe('https://api.pinecone.io/indexes');
		expect(request.headers['api-key']).toBe('pcsk_test');
		expect(request.headers['x-pinecone-api-version']).toBe(
			PINECONE_API_VERSION,
		);
		expect(request.headers.authorization).toBeUndefined();
	});

	it('routes index data operations only to validated Pinecone hosts', async () => {
		harness.queue({ body: { matches: [] } });

		await makePineconeRequest('/query', 'pcsk_test', {
			method: 'POST',
			surface: 'index',
			host: 'docs-example.svc.us-east-1-aws.pinecone.io',
			body: { vector: [0.1, 0.2], topK: 2 },
		});

		expect(harness.requestAt(0).url).toBe(
			'https://docs-example.svc.us-east-1-aws.pinecone.io/query',
		);
	});

	it('rejects an arbitrary dynamic host before transmitting the key', async () => {
		await expect(
			makePineconeRequest('/query', 'pcsk_test', {
				surface: 'index',
				host: 'https://attacker.example',
			}),
		).rejects.toBeInstanceOf(PineconeAPIError);

		expect(harness.requests).toHaveLength(0);
	});

	it('requires a dynamic host for data operations', async () => {
		await expect(
			makePineconeRequest('/query', 'pcsk_test', { surface: 'index' }),
		).rejects.toThrow('host is required');
	});

	it('normalizes Pinecone hostnames without weakening the domain boundary', () => {
		expect(normalizePineconeHost('example.svc.pinecone.io/')).toBe(
			'https://example.svc.pinecone.io',
		);
		expect(() => normalizePineconeHost('pinecone.io.attacker.example')).toThrow(
			'end in pinecone.io',
		);
		expect(() => normalizePineconeHost('example.pinecone.io/proxy')).toThrow(
			'must not include',
		);
	});

	it('omits undefined query values', async () => {
		harness.queue({ body: { indexes: [] } });

		await makePineconeRequest('/indexes', 'pcsk_test', {
			query: { limit: 10, paginationToken: undefined },
		});

		expect(harness.requestAt(0).url).toContain('limit=10');
		expect(harness.requestAt(0).url).not.toContain('undefined');
	});

	it('rejects an empty API key before making a request', async () => {
		await expect(makePineconeRequest('/indexes', '')).rejects.toBeInstanceOf(
			PineconeAPIError,
		);
		expect(harness.requests).toHaveLength(0);
	});

	it('validates provider responses against the supplied schema', async () => {
		harness.queue({ body: { indexes: 'not-an-array' } });

		await expect(
			makePineconeRequest('/indexes', 'pcsk_test', {
				schema: z.object({ indexes: z.array(z.object({}).loose()) }),
			}),
		).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
	});

	it('lets the shared transport honor Retry-After on a 429', async () => {
		const rateLimit = {
			status: 429,
			body: { code: 'RESOURCE_EXHAUSTED', message: 'Too many requests' },
			headers: { 'Retry-After': '0' },
		};
		harness.queue(rateLimit, { body: { indexes: [] } });

		await expect(makePineconeRequest('/indexes', 'pcsk_test')).resolves.toEqual(
			{ indexes: [] },
		);
		expect(harness.requests).toHaveLength(2);
	});
});
