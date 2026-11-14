import { ApiError } from 'corsair/http';
import {
	kanbanizeBaseUrl,
	kanbanizeErrorCode,
	makeKanbanizeRequest,
	queryFor,
} from './client';

const API_KEY = 'bm-test-key';
const SUBDOMAIN = 'acme';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(status === 204 ? null : JSON.stringify(body), {
			status,
			headers: status === 204 ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		host: parsed.host,
		path: parsed.pathname,
		query: parsed.searchParams.toString(),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('kanbanizeBaseUrl', () => {
	it('builds the per-account host', () => {
		expect(kanbanizeBaseUrl('acme')).toBe('https://acme.kanbanize.com/api/v2');
	});
});

describe('queryFor', () => {
	it('joins a list into one comma-separated value', () => {
		expect(queryFor({ board_ids: [1, 2, 3] })).toEqual({
			board_ids: '1,2,3',
		});
	});

	it('keeps a single value as it is, including 0 and false', () => {
		expect(queryFor({ is_archived: 0, per_page: 50, state: 'active' })).toEqual(
			{
				is_archived: 0,
				per_page: 50,
				state: 'active',
			},
		);
	});

	it('drops an undefined value', () => {
		expect(queryFor({ page: undefined, per_page: 10 })).toEqual({
			per_page: 10,
		});
	});
});

describe('makeKanbanizeRequest', () => {
	it('sends the key in apikey and no Authorization header', async () => {
		respond({ data: [] });

		await makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
			method: 'GET',
			path: '/boards',
		});

		const sent = lastRequest();
		expect(sent.headers.get('apikey')).toBe(API_KEY);
		expect(sent.headers.get('authorization')).toBeNull();
	});

	it('addresses the account subdomain', async () => {
		respond({ data: [] });

		await makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
			method: 'GET',
			path: '/boards',
		});

		expect(lastRequest().host).toBe('acme.kanbanize.com');
		expect(lastRequest().path).toBe('/api/v2/boards');
	});

	it('sends a body as JSON and sets the content type', async () => {
		respond({ data: {} });

		await makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
			method: 'POST',
			path: '/cards',
			body: { title: 'A card' },
		});

		const sent = lastRequest();
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toBe('{"title":"A card"}');
	});

	it('sends no body and no content type for a request with none', async () => {
		respond({ data: {} });

		await makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
			method: 'DELETE',
			path: '/cards/1',
		});

		const sent = lastRequest();
		expect(sent.body).toBeUndefined();
		expect(sent.headers.get('content-type')).toBeNull();
	});

	it('returns undefined for a 204', async () => {
		respond(undefined, 204);

		await expect(
			makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
				method: 'DELETE',
				path: '/cards/1',
			}),
		).resolves.toBeUndefined();
	});

	it('refuses a request with no subdomain before it is sent', async () => {
		await expect(
			makeKanbanizeRequest(API_KEY, '', { method: 'GET', path: '/boards' }),
		).rejects.toMatchObject({
			name: 'KanbanizeAPIError',
			message: expect.stringContaining('subdomain'),
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('turns a Businessmap error into one error with code and reference', async () => {
		respond(
			{
				error: {
					code: 'B001',
					message: 'Board not found',
					reference: 'GE-B001',
				},
			},
			404,
		);

		await expect(
			makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
				method: 'GET',
				path: '/boards/1',
			}),
		).rejects.toMatchObject({
			name: 'ApiError',
			status: 404,
			body: { error: { code: 'B001', reference: 'GE-B001' } },
			message: 'Businessmap 404 B001: Board not found (reference GE-B001)',
			request: { method: 'GET' },
		});
	});

	it('uses a fixed message when the body has none, not the raw body', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('upstream said: card secret-description', {
				status: 504,
				headers: { 'Content-Type': 'text/plain' },
			}),
		);

		const error = await makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
			method: 'GET',
			path: '/boards/1',
		}).catch((caught: unknown) => caught);

		expect(error).toMatchObject({
			status: 504,
			message: 'Businessmap 504: Businessmap request failed',
		});
	});

	it('prefers a Retry-After header over the body’s countdown', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					error: {
						code: 'RL02',
						message: 'Too many',
						details: { retry_after: 58 },
					},
				}),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '2',
					},
				},
			),
		);

		await expect(
			makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
				method: 'GET',
				path: '/cards',
			}),
		).rejects.toMatchObject({ retryAfter: 2000 });
	});

	it('reads the body’s countdown when there is no header', async () => {
		respond(
			{
				error: {
					code: 'RL01',
					message: 'Too many',
					details: { retry_after: 58 },
				},
			},
			429,
		);

		await expect(
			makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
				method: 'GET',
				path: '/cards',
			}),
		).rejects.toMatchObject({ retryAfter: 58_000 });
	});

	it('keeps the key out of the error', async () => {
		respond({ error: { code: 'A001', message: 'Invalid API Key.' } }, 401);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
			method: 'GET',
			path: '/boards',
		}).catch((caught: unknown) => caught)) as Error;

		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});

	it('stays core ApiError without the sent body or the echoed details', async () => {
		respond(
			{
				error: {
					code: 'V001',
					message: 'Bad',
					details: { description: 'secret-description' },
				},
			},
			400,
		);

		const error = await makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
			method: 'POST',
			path: '/cards',
			body: { title: 'x', description: 'secret-description' },
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect(kanbanizeErrorCode(error)).toBe('V001');
		expect(require('node:util').inspect(error, { depth: 10 })).not.toContain(
			'secret-description',
		);
	});

	it('marks a transport failure and keeps the method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(
			makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
				method: 'PATCH',
				path: '/cards/1',
			}),
		).rejects.toMatchObject({
			name: 'KanbanizeAPIError',
			transport: true,
			method: 'PATCH',
			message: 'fetch failed',
		});
	});

	it('separates a timeout from a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out.', 'TimeoutError'),
		);

		await expect(
			makeKanbanizeRequest(API_KEY, SUBDOMAIN, {
				method: 'GET',
				path: '/boards',
			}),
		).rejects.toMatchObject({ timedOut: true, transport: true });
	});
});
