import { memory, pipes, tools } from './endpoints';

describe('Langbase endpoints', () => {
	const originalFetch = globalThis.fetch;
	let capturedMethod = '';
	let capturedUrl = '';
	// `unknown` because payload is arbitrary json in mocked requests.
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

	function mockFetchResponse(body: unknown, status = 200) {
		globalThis.fetch = jest.fn(
			async (input: string | URL | Request, init?: RequestInit) => {
				const req = new Request(input, init);
				capturedMethod = req.method;
				capturedUrl = req.url;
				const text = await req.text();
				capturedBody = text ? JSON.parse(text) : null;
				return new Response(JSON.stringify(body), {
					status,
					headers: { 'Content-Type': 'application/json' },
				});
			},
		);
	}

	describe('pipes endpoints', () => {
		it('pipes.run calls POST /pipes/run with messages', async () => {
			mockFetchResponse({ completion: 'Answer from AI agent' });
			const res = await pipes.run(
				{ messages: [{ role: 'user', content: 'What is 2+2?' }] },
				'test-key',
			);
			expect(capturedMethod).toBe('POST');
			expect(capturedUrl).toContain('/v1/pipes/run');
			expect(capturedBody).toEqual({
				messages: [{ role: 'user', content: 'What is 2+2?' }],
			});
			expect(res.completion).toBe('Answer from AI agent');
		});

		it('pipes.list calls GET /pipes', async () => {
			mockFetchResponse({ pipes: [{ name: 'support-agent' }] });
			const res = await pipes.list({}, 'test-key');
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v1/pipes');
			expect(res.pipes.length).toBe(1);
		});

		it('pipes.get calls GET /pipes/:name', async () => {
			mockFetchResponse({
				pipe: { name: 'support-agent', model: 'openai:gpt-4o' },
			});
			const res = await pipes.get({ name: 'support-agent' }, 'test-key');
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v1/pipes/support-agent');
			expect(res.pipe.name).toBe('support-agent');
		});

		it('pipes.create calls POST /pipes with pipe definition', async () => {
			mockFetchResponse({
				pipe: { name: 'sales-agent', model: 'openai:gpt-4o' },
			});
			const res = await pipes.create(
				{ name: 'sales-agent', model: 'openai:gpt-4o' },
				'test-key',
			);
			expect(capturedMethod).toBe('POST');
			expect(capturedUrl).toContain('/v1/pipes');
			expect(capturedBody).toEqual({
				name: 'sales-agent',
				model: 'openai:gpt-4o',
			});
			expect(res.pipe.name).toBe('sales-agent');
		});

		it('pipes.update calls PATCH /pipes/:name with body', async () => {
			mockFetchResponse({
				pipe: { name: 'sales-agent', description: 'Updated' },
			});
			const res = await pipes.update(
				{ name: 'sales-agent', description: 'Updated' },
				'test-key',
			);
			expect(capturedMethod).toBe('PATCH');
			expect(capturedUrl).toContain('/v1/pipes/sales-agent');
			expect(capturedBody).toEqual({ description: 'Updated' });
			expect(res.pipe.description).toBe('Updated');
		});

		it('pipes.delete calls DELETE /pipes/:name', async () => {
			mockFetchResponse({ success: true });
			const res = await pipes.delete({ name: 'sales-agent' }, 'test-key');
			expect(capturedMethod).toBe('DELETE');
			expect(capturedUrl).toContain('/v1/pipes/sales-agent');
			expect(res.success).toBe(true);
		});
	});

	describe('memory endpoints', () => {
		it('memory.list calls GET /memory', async () => {
			mockFetchResponse({ memories: [{ name: 'company-faq' }] });
			const res = await memory.list({}, 'test-key');
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v1/memory');
			expect(res.memories.length).toBe(1);
		});

		it('memory.get calls GET /memory/:name', async () => {
			mockFetchResponse({ memory: { name: 'company-faq', documents: 100 } });
			const res = await memory.get({ name: 'company-faq' }, 'test-key');
			expect(capturedMethod).toBe('GET');
			expect(capturedUrl).toContain('/v1/memory/company-faq');
			expect(res.memory.name).toBe('company-faq');
		});

		it('memory.create calls POST /memory with memory definition', async () => {
			mockFetchResponse({ memory: { name: 'kb-docs' } });
			const res = await memory.create(
				{ name: 'kb-docs', description: 'Knowledge base' },
				'test-key',
			);
			expect(capturedMethod).toBe('POST');
			expect(capturedUrl).toContain('/v1/memory');
			expect(capturedBody).toEqual({
				name: 'kb-docs',
				description: 'Knowledge base',
			});
			expect(res.memory.name).toBe('kb-docs');
		});

		it('memory.delete calls DELETE /memory/:name', async () => {
			mockFetchResponse({ success: true });
			const res = await memory.delete({ name: 'kb-docs' }, 'test-key');
			expect(capturedMethod).toBe('DELETE');
			expect(capturedUrl).toContain('/v1/memory/kb-docs');
			expect(res.success).toBe(true);
		});
	});

	describe('tools endpoints', () => {
		it('tools.webSearch calls POST /tools/web-search with query', async () => {
			mockFetchResponse({
				results: [{ title: 'Langbase Docs', url: 'https://langbase.com' }],
			});
			const res = await tools.webSearch(
				{ query: 'Langbase AI', totalResults: 3 },
				'test-key',
			);
			expect(capturedMethod).toBe('POST');
			expect(capturedUrl).toContain('/v1/tools/web-search');
			expect(capturedBody).toEqual({
				query: 'Langbase AI',
				totalResults: 3,
			});
			expect(res.results.length).toBe(1);
		});
	});
});
