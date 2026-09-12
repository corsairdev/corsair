import { makeSemanticScholarRequest, SemanticScholarAPIError } from './client';

let captured:
	| {
			url: string;
			method: string;
			headers: Headers;
			body?: string;
	  }
	| undefined;

afterEach(() => {
	jest.restoreAllMocks();
});

function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	jest.spyOn(global, 'fetch').mockImplementation((input, init) => {
		captured = {
			url: String(input),
			method: init?.method ?? 'GET',
			headers: new Headers(init?.headers),
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return Promise.resolve(
			new Response(JSON.stringify(payload), {
				status,
				statusText: status < 400 ? 'OK' : 'Error',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': status === 429 ? '2' : '',
				},
			}),
		);
	});
}

describe('makeSemanticScholarRequest', () => {
	it('uses the official API host and x-api-key header', async () => {
		mockFetch({ paperId: 'p1', title: 'Paper' });

		await makeSemanticScholarRequest('/graph/v1/paper/p1', ' demo-key ', {
			query: { fields: 'title,authors', openAccessPdf: '' },
		});

		expect(captured?.url).toBe(
			'https://api.semanticscholar.org/graph/v1/paper/p1?fields=title%2Cauthors&openAccessPdf=',
		);
		expect(captured?.method).toBe('GET');
		expect(captured?.headers.get('x-api-key')).toBe('demo-key');
		expect(captured?.headers.get('Accept')).toBe('application/json');
	});

	it('sends POST bodies while keeping documented query parameters', async () => {
		mockFetch([{ paperId: 'p1', title: 'Paper' }]);

		await makeSemanticScholarRequest('/graph/v1/paper/batch', 'demo-key', {
			method: 'POST',
			query: { fields: 'title,url' },
			body: { ids: ['p1'] },
		});

		expect(captured?.url).toBe(
			'https://api.semanticscholar.org/graph/v1/paper/batch?fields=title%2Curl',
		);
		expect(captured?.method).toBe('POST');
		expect(captured?.body).toBe(JSON.stringify({ ids: ['p1'] }));
	});

	it('rejects a blank API key before calling the network', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch');

		await expect(
			makeSemanticScholarRequest('/graph/v1/paper/p1', '  '),
		).rejects.toThrow(SemanticScholarAPIError);
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('wraps API errors with status and retry-after metadata', async () => {
		mockFetch({ message: 'Too Many Requests' }, 429);

		await expect(
			makeSemanticScholarRequest('/graph/v1/paper/p1', 'demo-key'),
		).rejects.toMatchObject({
			name: 'SemanticScholarAPIError',
			status: 429,
			retryAfter: 2000,
		});
	});
});
