import { createCorsair } from 'corsair/core';
import { langbase } from './index';

const api = createCorsair({
	plugins: [langbase({ key: 'bound-test-key' })],
}).langbase.api;

const pipeResource = {
	name: 'support-agent',
	description: 'Support agent',
	status: 'private',
	owner_login: 'owner-login',
	url: 'https://langbase.com/owner-login/support-agent',
	type: 'run',
	api_key: 'pipe-test-key',
};

const memoryResource = {
	name: 'company-faq',
	description: 'Company knowledge base',
	owner_login: 'owner-login',
	url: 'https://langbase.com/memorysets/owner-login/company-faq',
	chunk_size: 10_000,
	chunk_overlap: 2_048,
	embedding_model: 'openai:text-embedding-3-large',
};

const threadResource = {
	id: 'thread-123',
	object: 'thread',
	created_at: 1_714_322_048,
	metadata: { topic: 'support' },
};

const threadMessage = {
	id: 'message-123',
	thread_id: 'thread-123',
	created_at: 1_714_322_048,
	role: 'user',
	content: 'Hello',
	tool_call_id: null,
	tool_calls: [],
	name: null,
	attachments: [],
	metadata: {},
};

describe('Langbase bound endpoints', () => {
	const originalFetch = globalThis.fetch;
	let capturedMethod = '';
	let capturedUrl = '';
	// `unknown` because parsed JSON can contain any JSON value before assertions.
	let capturedBody: unknown = null;

	beforeEach(() => {
		capturedMethod = '';
		capturedUrl = '';
		capturedBody = null;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		jest.restoreAllMocks();
	});

	// `unknown` because mocked provider payloads are runtime data validated by Zod.
	function mockFetchResponse(body: unknown, status = 200): void {
		globalThis.fetch = jest.fn(
			async (input: string | URL | Request, init?: RequestInit) => {
				const request = new Request(input, init);
				capturedMethod = request.method;
				capturedUrl = request.url;
				const text = await request.text();
				// `unknown` because JSON.parse returns untrusted provider JSON.
				capturedBody = text ? JSON.parse(text) : null;
				return new Response(JSON.stringify(body), {
					status,
					headers: { 'Content-Type': 'application/json' },
				});
			},
		);
	}

	it('uses ctx.key through a bound Corsair client for pipe execution', async () => {
		mockFetchResponse({ completion: 'Answer', raw: { id: 'run-1' } });

		const result = await api.pipes.run({
			messages: [
				{ role: 'user', content: 'Hello' },
				{
					role: 'user',
					content: [
						{
							type: 'image_url',
							image_url: { url: 'https://cdn.langbase.test/image.jpg' },
						},
					],
				},
				{ role: 'tool', content: null, tool_call_id: 'call-123' },
			],
		});

		expect(capturedMethod).toBe('POST');
		expect(capturedUrl).toContain('/v1/pipes/run');
		expect(capturedBody).toEqual({
			messages: [
				{ role: 'user', content: 'Hello' },
				{
					role: 'user',
					content: [
						{
							type: 'image_url',
							image_url: { url: 'https://cdn.langbase.test/image.jpg' },
						},
					],
				},
				{ role: 'tool', content: null, tool_call_id: 'call-123' },
			],
			stream: false,
		});
		expect(result.completion).toBe('Answer');
		expect(result.raw).toEqual({ id: 'run-1' });
	});

	it('lists pipes from the documented flat response array', async () => {
		mockFetchResponse([pipeResource]);

		const result = await api.pipes.list({});

		expect(capturedMethod).toBe('GET');
		expect(capturedUrl).toContain('/v1/pipes');
		expect(result[0]?.name).toBe('support-agent');
	});

	it('gets a pipe using both owner login and pipe name', async () => {
		mockFetchResponse(pipeResource);

		const result = await api.pipes.get({
			ownerLogin: 'owner-login',
			pipeName: 'support-agent',
		});

		expect(capturedMethod).toBe('GET');
		expect(capturedUrl).toContain('/v1/pipes/owner-login/support-agent');
		expect(result.name).toBe('support-agent');
	});

	it('creates a pipe and parses the flat resource response', async () => {
		mockFetchResponse(pipeResource);

		const result = await api.pipes.create({
			name: 'support-agent',
			model: 'openai:gpt-4o-mini',
			messages: [{ role: 'system', content: 'Be helpful.' }],
		});

		expect(capturedMethod).toBe('POST');
		expect(capturedUrl).toContain('/v1/pipes');
		expect(capturedBody).toMatchObject({ name: 'support-agent' });
		expect(result.name).toBe('support-agent');
	});

	it('updates a pipe with POST and retains name in the body', async () => {
		mockFetchResponse(pipeResource);

		const result = await api.pipes.update({
			name: 'support-agent',
			description: 'Updated description',
		});

		expect(capturedMethod).toBe('POST');
		expect(capturedUrl).toContain('/v1/pipes/support-agent');
		expect(capturedBody).toEqual({
			name: 'support-agent',
			description: 'Updated description',
		});
		expect(result.name).toBe('support-agent');
	});

	it('lists memories from the documented flat response array', async () => {
		mockFetchResponse([memoryResource]);

		const result = await api.memory.list({});

		expect(capturedMethod).toBe('GET');
		expect(capturedUrl).toContain('/v1/memory');
		expect(result[0]?.name).toBe('company-faq');
	});

	it('creates a memory and parses the flat resource response', async () => {
		mockFetchResponse(memoryResource);

		const result = await api.memory.create({
			name: 'company-faq',
			description: 'Company knowledge base',
			chunk_size: 10_000,
			chunk_overlap: 2_048,
		});

		expect(capturedMethod).toBe('POST');
		expect(capturedUrl).toContain('/v1/memory');
		expect(capturedBody).toMatchObject({ name: 'company-faq' });
		expect(result.name).toBe('company-faq');
	});

	it('deletes a memory using the documented route', async () => {
		mockFetchResponse({ success: true });

		const result = await api.memory.delete({ name: 'company-faq' });

		expect(capturedMethod).toBe('DELETE');
		expect(capturedUrl).toContain('/v1/memory/company-faq');
		expect(result.success).toBe(true);
	});

	it('retrieves memory chunks with a flat array response', async () => {
		mockFetchResponse([
			{
				text: 'Support details',
				similarity: 0.87,
				meta: { source: 'guide.md' },
			},
		]);

		const result = await api.memory.retrieve({
			query: 'How do I get support?',
			memory: [{ name: 'company-faq' }],
			topK: 5,
		});

		expect(capturedMethod).toBe('POST');
		expect(capturedUrl).toContain('/v1/memory/retrieve');
		expect(capturedBody).toEqual({
			query: 'How do I get support?',
			memory: [{ name: 'company-faq' }],
			topK: 5,
		});
		expect(result[0]?.similarity).toBe(0.87);
	});

	it('lists documents in a memory from a flat response array', async () => {
		mockFetchResponse([
			{
				name: 'guide.pdf',
				status: 'completed',
				status_message: null,
				metadata: { size: 120, type: 'application/pdf' },
				enabled: true,
				chunk_size: 10_000,
				chunk_overlap: 2_048,
				owner_login: 'owner-login',
			},
		]);

		const result = await api.documents.list({ memoryName: 'company-faq' });

		expect(capturedMethod).toBe('GET');
		expect(capturedUrl).toContain('/v1/memory/company-faq/documents');
		expect(result[0]?.name).toBe('guide.pdf');
	});

	it('uploads documents through the signed URL without forwarding the API key', async () => {
		const requests: Request[] = [];
		globalThis.fetch = jest.fn(
			async (input: string | URL | Request, init?: RequestInit) => {
				const request = new Request(input, init);
				requests.push(request);
				if (requests.length === 1) {
					return new Response(
						JSON.stringify({
							signedUrl: 'https://upload.langbase.com/signed?token=temporary',
						}),
						{
							status: 200,
							headers: { 'Content-Type': 'application/json' },
						},
					);
				}
				return new Response(null, { status: 200, statusText: 'OK' });
			},
		);

		const result = await api.documents.upload({
			memoryName: 'company-faq',
			documentName: 'guide.pdf',
			contentBase64: 'SGVsbG8=',
			contentType: 'application/pdf',
			meta: { category: 'support' },
		});

		const signedUrlRequest = requests[0];
		const fileRequest = requests[1];
		if (!signedUrlRequest || !fileRequest) {
			throw new Error('Expected both signed URL and file upload requests');
		}
		expect(requests).toHaveLength(2);
		expect(signedUrlRequest.method).toBe('POST');
		expect(signedUrlRequest.url).toContain('/v1/memory/documents');
		expect(signedUrlRequest.headers.get('authorization')).toBe(
			'Bearer bound-test-key',
		);
		expect(fileRequest.method).toBe('PUT');
		expect(fileRequest.url).toContain('upload.langbase.com/signed');
		expect(fileRequest.headers.get('authorization')).toBeNull();
		expect(fileRequest.headers.get('content-type')).toBe('application/pdf');
		expect(new TextDecoder().decode(await fileRequest.arrayBuffer())).toBe(
			'Hello',
		);
		expect(result).toEqual({ ok: true, status: 200, statusText: 'OK' });
	});

	it('surfaces upload 429 and Retry-After without retrying the signed PUT', async () => {
		const requests: Request[] = [];
		globalThis.fetch = jest.fn(
			async (input: string | URL | Request, init?: RequestInit) => {
				const request = new Request(input, init);
				requests.push(request);
				if (requests.length === 1) {
					return new Response(
						JSON.stringify({
							signedUrl: 'https://upload.langbase.com/signed?token=temporary',
						}),
						{
							status: 200,
							headers: { 'Content-Type': 'application/json' },
						},
					);
				}
				return new Response(null, {
					status: 429,
					statusText: 'Too Many Requests',
					headers: { 'Retry-After': '5' },
				});
			},
		);

		await expect(
			api.documents.upload({
				memoryName: 'company-faq',
				documentName: 'guide.pdf',
				contentBase64: 'SGVsbG8=',
				contentType: 'application/pdf',
			}),
		).rejects.toMatchObject({ status: 429, retryAfter: 5_000 });
		expect(requests).toHaveLength(2);
	});

	it('deletes a document and validates the confirmation response', async () => {
		mockFetchResponse({ success: true });

		const result = await api.documents.delete({
			memoryName: 'company-faq',
			documentName: 'guide.pdf',
		});

		expect(capturedMethod).toBe('DELETE');
		expect(capturedUrl).toContain('/v1/memory/company-faq/documents/guide.pdf');
		expect(result.success).toBe(true);
	});

	it('retries document embeddings with the documented GET route', async () => {
		mockFetchResponse({ success: true });

		const result = await api.documents.retryEmbeddings({
			memoryName: 'company-faq',
			documentName: 'guide.pdf',
		});

		expect(capturedMethod).toBe('GET');
		expect(capturedUrl).toContain(
			'/v1/memory/company-faq/documents/guide.pdf/embeddings/retry',
		);
		expect(result.success).toBe(true);
	});

	it('creates a thread with metadata and initial messages', async () => {
		mockFetchResponse(threadResource);

		const result = await api.threads.create({
			metadata: { topic: 'support' },
			messages: [{ role: 'user', content: 'Hello' }],
		});

		expect(capturedMethod).toBe('POST');
		expect(capturedUrl).toContain('/v1/threads');
		expect(capturedBody).toEqual({
			metadata: { topic: 'support' },
			messages: [{ role: 'user', content: 'Hello' }],
		});
		expect(result.id).toBe('thread-123');
	});

	it('gets a thread by ID', async () => {
		mockFetchResponse(threadResource);

		const result = await api.threads.get({ threadId: 'thread-123' });

		expect(capturedMethod).toBe('GET');
		expect(capturedUrl).toContain('/v1/threads/thread-123');
		expect(result.metadata).toEqual({ topic: 'support' });
	});

	it('updates thread metadata with POST', async () => {
		mockFetchResponse({ ...threadResource, metadata: { topic: 'resolved' } });

		const result = await api.threads.update({
			threadId: 'thread-123',
			metadata: { topic: 'resolved' },
		});

		expect(capturedMethod).toBe('POST');
		expect(capturedUrl).toContain('/v1/threads/thread-123');
		expect(capturedBody).toEqual({ metadata: { topic: 'resolved' } });
		expect(result.metadata).toEqual({ topic: 'resolved' });
	});

	it('deletes a thread and validates success', async () => {
		mockFetchResponse({ success: true });

		const result = await api.threads.delete({ threadId: 'thread-123' });

		expect(capturedMethod).toBe('DELETE');
		expect(capturedUrl).toContain('/v1/threads/thread-123');
		expect(result.success).toBe(true);
	});

	it('appends message arrays and retains tool-call fields', async () => {
		mockFetchResponse([threadMessage]);

		const result = await api.threads.appendMessages({
			threadId: 'thread-123',
			messages: [
				{
					role: 'tool',
					content: null,
					tool_call_id: 'call-123',
					tool_calls: [
						{
							id: 'call-123',
							type: 'function',
							function: { name: 'lookup', arguments: '{"id":"1"}' },
						},
					],
				},
			],
		});

		expect(capturedMethod).toBe('POST');
		expect(capturedUrl).toContain('/v1/threads/thread-123/messages');
		expect(capturedBody).toEqual([
			{
				role: 'tool',
				content: null,
				tool_call_id: 'call-123',
				tool_calls: [
					{
						id: 'call-123',
						type: 'function',
						function: { name: 'lookup', arguments: '{"id":"1"}' },
					},
				],
			},
		]);
		expect(result[0]?.tool_call_id).toBeNull();
	});

	it('lists thread messages from the documented flat response array', async () => {
		mockFetchResponse([threadMessage]);

		const result = await api.threads.listMessages({ threadId: 'thread-123' });

		expect(capturedMethod).toBe('GET');
		expect(capturedUrl).toContain('/v1/threads/thread-123/messages');
		expect(result[0]?.thread_id).toBe('thread-123');
	});

	it('rejects invalid input before making a request', async () => {
		mockFetchResponse({});

		// `unknown` because these calls exercise endpoint rejection paths, not outputs.
		const invalidCalls: Array<() => Promise<unknown>> = [
			() => api.pipes.run({ messages: [] }),
			() => api.pipes.get({ ownerLogin: '', pipeName: 'pipe' }),
			() => api.pipes.create({ name: '' }),
			() => api.pipes.update({ name: '' }),
			() => api.memory.create({ name: '' }),
			() => api.memory.delete({ name: '' }),
			() => api.memory.retrieve({ query: '', memory: [{ name: 'memory' }] }),
			() => api.documents.list({ memoryName: '' }),
			() =>
				api.documents.upload({
					memoryName: 'memory',
					documentName: 'doc.pdf',
					contentBase64: 'not base64!',
					contentType: 'application/pdf',
				}),
			() => api.documents.delete({ memoryName: '', documentName: 'doc.pdf' }),
			() =>
				api.documents.retryEmbeddings({
					memoryName: 'memory',
					documentName: '',
				}),
			() => api.threads.create({ threadId: '' }),
			() => api.threads.get({ threadId: '' }),
			() => api.threads.update({ threadId: '', metadata: {} }),
			() => api.threads.delete({ threadId: '' }),
			() => api.threads.appendMessages({ threadId: 'thread', messages: [] }),
			() => api.threads.listMessages({ threadId: '' }),
		];

		for (const invalidCall of invalidCalls) {
			await expect(invalidCall()).rejects.toThrow();
		}
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('does not expose a documented pipe or single-memory delete/read route', () => {
		expect('delete' in api.pipes).toBe(false);
		expect('get' in api.memory).toBe(false);
	});
});
