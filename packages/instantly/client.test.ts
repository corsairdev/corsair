import {
	describeInstantlyError,
	INSTANTLY_API_BASE,
	InstantlyAPIError,
	makeInstantlyRequest,
	segment,
} from './client';
import { errorBody, workspace } from './test-fixtures';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/html' : 'application/json',
				...headers,
			},
		}),
	);
}

function sent() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url: new URL(url), init, headers: new Headers(init.headers) };
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<InstantlyAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(InstantlyAPIError);
	return error as InstantlyAPIError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeInstantlyRequest', () => {
	it('calls API v2 with a bearer key and returns the JSON body', async () => {
		respond(workspace, 200);

		const result = await makeInstantlyRequest('in-key', {
			method: 'GET',
			path: '/workspaces/current',
		});

		expect(result).toEqual(workspace);
		const { url, init, headers } = sent();
		expect(url.toString()).toBe(`${INSTANTLY_API_BASE}/workspaces/current`);
		expect(init.method).toBe('GET');
		expect(headers.get('authorization')).toBe('Bearer in-key');
		expect(headers.get('accept')).toBe('application/json');
	});

	it('sends a JSON body with its content type', async () => {
		respond({ items: [] }, 200);

		await makeInstantlyRequest('in-key', {
			method: 'POST',
			path: '/leads/list',
			body: { campaign: 'c-1', limit: 10 },
		});

		const { init, headers } = sent();
		expect(headers.get('content-type')).toBe('application/json');
		expect(JSON.parse(String(init.body))).toEqual({
			campaign: 'c-1',
			limit: 10,
		});
	});

	it('sends a bodiless POST with no body and no content type', async () => {
		respond({ id: 'c-1', status: 1 }, 200);

		await makeInstantlyRequest('in-key', {
			method: 'POST',
			path: '/campaigns/c-1/activate',
		});

		const { init, headers } = sent();
		expect(init.body).toBeUndefined();
		expect(headers.get('content-type')).toBeNull();
	});

	it('repeats array query params and drops undefined ones', async () => {
		respond([], 200);

		await makeInstantlyRequest('in-key', {
			method: 'GET',
			path: '/campaigns/analytics',
			query: { ids: ['a', 'b'], start_date: '2026-10-01', end_date: undefined },
		});

		const { url } = sent();
		expect(url.searchParams.getAll('ids')).toEqual(['a', 'b']);
		expect(url.searchParams.get('start_date')).toBe('2026-10-01');
		expect(url.searchParams.has('end_date')).toBe(false);
	});

	it('wraps a 404 with the status and Instantly message', async () => {
		respond(errorBody(404, 'Campaign not found'), 404);

		const error = await failure(
			makeInstantlyRequest('in-key', { method: 'GET', path: '/campaigns/x' }),
		);

		expect(error.status).toBe(404);
		expect(error.reason).toBe('Not Found');
		expect(error.message).toBe('Instantly 404: Campaign not found');
	});

	it('keeps the Fastify code of a validation error', async () => {
		respond(
			errorBody(400, 'querystring/limit must be <= 100', {
				code: 'FST_ERR_VALIDATION',
			}),
			400,
		);

		const error = await failure(
			makeInstantlyRequest('in-key', { method: 'GET', path: '/campaigns' }),
		);

		expect(error.status).toBe(400);
		expect(error.code).toBe('FST_ERR_VALIDATION');
		expect(error.message).toContain('limit must be <= 100');
	});

	it('explains a 402 and a 403 as plan or scope problems', async () => {
		respond(errorBody(402, 'Workspace does not have an active paid plan'), 402);
		const plan = await failure(
			makeInstantlyRequest('in-key', {
				method: 'POST',
				path: '/webhooks',
				body: {},
			}),
		);
		expect(plan.message).toContain('no active paid plan');

		respond(errorBody(403, 'Forbidden'), 403);
		const scope = await failure(
			makeInstantlyRequest('in-key', {
				method: 'POST',
				path: '/webhooks',
				body: {},
			}),
		);
		expect(scope.status).toBe(403);
		expect(scope.message).toContain('Hypergrowth');
	});

	it('makes one attempt on a 429 and records Retry-After', async () => {
		respond(errorBody(429, 'Rate limit exceeded'), 429, { 'Retry-After': '7' });

		const error = await failure(
			makeInstantlyRequest('in-key', {
				method: 'POST',
				path: '/emails/reply',
				body: { reply_to_uuid: 'e-1' },
			}),
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(7000);
	});

	it('wraps a non-JSON error page', async () => {
		respond('<html>error code: 1010</html>', 403);

		const error = await failure(
			makeInstantlyRequest('in-key', { method: 'GET', path: '/accounts' }),
		);

		expect(error.status).toBe(403);
		expect(error.body).toContain('1010');
	});

	it('wraps a network failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeInstantlyRequest('in-key', { method: 'GET', path: '/accounts' }),
		);

		expect(error.status).toBeUndefined();
		expect(error.message).toBe('fetch failed');
		expect((error.cause as Error).name).toBe('TypeError');
	});
});

describe('describeInstantlyError', () => {
	it('falls back to the error text, then to the given message', () => {
		expect(describeInstantlyError(500, { error: 'Internal' }, 'x')).toBe(
			'Instantly 500: Internal',
		);
		expect(describeInstantlyError(undefined, undefined, 'timeout')).toBe(
			'timeout',
		);
	});
});

describe('segment', () => {
	it('encodes an account email for the path', () => {
		expect(segment('sam+1@fieldkit-mail.com')).toBe(
			'sam%2B1%40fieldkit-mail.com',
		);
	});
});
