import { ApiError } from 'corsair/http';
import {
	describeMixpanelError,
	MixpanelAPIError,
	makeMixpanelRequest,
	mixpanelHost,
	resolveProjectId,
} from './client';
import {
	exportUnauthenticatedText,
	ingestionUnauthenticated,
	queryRateLimited,
	queryUnauthenticated,
} from './test-fixtures';

const callContext = (
	overrides: Partial<Parameters<typeof makeMixpanelRequest>[0]> = {},
) => ({
	key: 'sa-user:sa-secret',
	options: { region: 'us' as const, projectId: 3141592 },
	keys: { get_project_id: jest.fn().mockResolvedValue('3141592') },
	...overrides,
});

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or plain text.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	const payload = typeof body === 'string' ? body : JSON.stringify(body);
	fetchMock.mockResolvedValueOnce(
		new Response(payload, {
			status,
			headers: { 'Content-Type': contentType },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

// unknown: a promise can reject with any value, so the rejection reason has
// no static type; each assertion narrows it with toMatchObject.
async function captureError<T>(promise: Promise<T>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}

afterEach(() => {
	fetchMock.mockRestore();
});

describe('mixpanelHost', () => {
	it.each([
		['ingestion', 'us', 'https://api.mixpanel.com'],
		['ingestion', 'eu', 'https://api-eu.mixpanel.com'],
		['ingestion', 'in', 'https://api-in.mixpanel.com'],
		['query', 'us', 'https://mixpanel.com/api/query'],
		['query', 'eu', 'https://eu.mixpanel.com/api/query'],
		['query', 'in', 'https://in.mixpanel.com/api/query'],
		['export', 'us', 'https://data.mixpanel.com/api/2.0'],
		['export', 'eu', 'https://data-eu.mixpanel.com/api/2.0'],
		['export', 'in', 'https://data-in.mixpanel.com/api/2.0'],
	] as const)('%s in %s builds %s', (service, region, expected) => {
		expect(mixpanelHost(service, region)).toBe(expected);
	});
});

describe('makeMixpanelRequest', () => {
	it('sends the service account pair as a Basic header on the regional host', async () => {
		respond({ ok: true });

		await makeMixpanelRequest(callContext(), {
			service: 'ingestion',
			method: 'GET',
			path: '/import',
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.mixpanel.com/import');
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Basic sa-user:sa-secret',
		);
	});

	it('switches the host by region', async () => {
		respond({ ok: true });

		await makeMixpanelRequest(
			callContext({ options: { region: 'eu', projectId: 3141592 } }),
			{ service: 'query', method: 'GET', path: '/cohorts/list' },
		);

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://eu.mixpanel.com/api/query/cohorts/list');
	});

	it('refuses to send without credentials', async () => {
		await expect(
			makeMixpanelRequest(callContext({ key: '' }), {
				service: 'query',
				method: 'GET',
				path: '/insights',
			}),
		).rejects.toThrow('service account credentials are missing');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('wraps a query API error with its error_code', async () => {
		respond(queryRateLimited, 429);

		const error = await captureError(
			makeMixpanelRequest(callContext(), {
				service: 'query',
				method: 'GET',
				path: '/insights',
				replayable: true,
			}),
		);

		expect(error).toBeInstanceOf(MixpanelAPIError);
		expect(error).toMatchObject({
			status: 429,
			code: 'query_api.request.rate_limited',
			replayable: true,
		});
		expect((error as MixpanelAPIError).message).toContain('rate_limited');
	});

	it('reads a Retry-After header into the error', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(queryRateLimited), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '30',
				},
			}),
		);

		const error = await captureError(
			makeMixpanelRequest(callContext(), {
				service: 'query',
				method: 'GET',
				path: '/insights',
			}),
		);

		expect(error).toMatchObject({ retryAfter: 30000 });
	});

	it('parses the plain text export error', async () => {
		respond(exportUnauthenticatedText, 401, 'text/plain');

		const error = await captureError(
			makeMixpanelRequest(callContext(), {
				service: 'export',
				method: 'GET',
				path: '/export',
			}),
		);

		expect(error).toBeInstanceOf(MixpanelAPIError);
		expect((error as MixpanelAPIError).message).toContain('API Secret');
	});

	it('fails a 200 body that still says error', async () => {
		respond({ status: 'error', error: 'Invalid selector' });

		const error = await captureError(
			makeMixpanelRequest(callContext(), {
				service: 'query',
				method: 'POST',
				path: '/engage',
			}),
		);

		expect(error).toBeInstanceOf(MixpanelAPIError);
		expect(error).toMatchObject({ status: 200 });
		expect((error as MixpanelAPIError).message).toContain('Invalid selector');
	});

	it('passes a 200 body that says OK through', async () => {
		respond({ status: 'ok', total: 1 });

		await expect(
			makeMixpanelRequest(callContext(), {
				service: 'query',
				method: 'POST',
				path: '/engage',
			}),
		).resolves.toEqual({ status: 'ok', total: 1 });
	});

	it('keeps an ApiError 401 body with its numeric status field', async () => {
		respond(ingestionUnauthenticated, 401);

		const error = await captureError(
			makeMixpanelRequest(callContext(), {
				service: 'ingestion',
				method: 'POST',
				path: '/import',
			}),
		);

		expect(error).toMatchObject({ status: 401 });
		expect((error as MixpanelAPIError).body).toEqual(ingestionUnauthenticated);
	});

	it('does not put the credential into the error message', async () => {
		respond(queryUnauthenticated, 401);

		const error = await captureError(
			makeMixpanelRequest(callContext(), {
				service: 'query',
				method: 'POST',
				path: '/cohorts/list',
			}),
		);

		const printed = `${(error as Error).message} ${JSON.stringify(error)}`;
		expect(printed).not.toContain('sa-user');
		expect(printed).not.toContain('sa-secret');
	});

	it('wraps a transport failure with the replay flag', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await captureError(
			makeMixpanelRequest(callContext(), {
				service: 'query',
				method: 'GET',
				path: '/insights',
				replayable: true,
			}),
		);

		expect(error).toBeInstanceOf(MixpanelAPIError);
		expect(error).toMatchObject({ replayable: true });
		expect((error as MixpanelAPIError).status).toBeUndefined();
	});
});

describe('resolveProjectId', () => {
	it('prefers the inline option over the stored field', async () => {
		const ctx = callContext({ options: { region: 'us', projectId: 42 } });
		await expect(resolveProjectId(ctx)).resolves.toBe(42);
		expect(ctx.keys.get_project_id).not.toHaveBeenCalled();
	});

	it('parses the stored string field', async () => {
		const ctx = callContext();
		await expect(resolveProjectId(ctx)).resolves.toBe(3141592);
	});

	it.each([null, undefined, ''])(
		'throws when the project id is %p',
		async (stored) => {
			const ctx = callContext({
				options: { region: 'us' },
				keys: { get_project_id: jest.fn().mockResolvedValue(stored) },
			});
			await expect(resolveProjectId(ctx)).rejects.toThrow(
				'project_id is required',
			);
		},
	);

	it('rejects a project id that is not a positive integer', async () => {
		const ctx = callContext({
			options: { region: 'us' },
			keys: { get_project_id: jest.fn().mockResolvedValue('abc') },
		});
		await expect(resolveProjectId(ctx)).rejects.toThrow('positive integer');
	});
});

describe('describeMixpanelError', () => {
	it('uses the query API error field', () => {
		expect(describeMixpanelError(401, queryUnauthenticated, 'fallback')).toBe(
			'Mixpanel 401 query_api.request.unauthenticated: To authenticate your request, you must use your API Secret in the HTTP Authorization header. Please see https://mixpanel.com/docs',
		);
	});

	it('quotes a plain text body verbatim', () => {
		expect(
			describeMixpanelError(401, exportUnauthenticatedText, 'fallback'),
		).toBe(`Mixpanel 401: ${exportUnauthenticatedText}`);
	});

	it('falls back when the body has nothing readable', () => {
		expect(describeMixpanelError(500, { unexpected: true }, 'boom')).toBe(
			'Mixpanel 500: boom',
		);
	});
});

describe('MixpanelAPIError', () => {
	it('copies the ApiError status without re-exposing its request', () => {
		const request = {
			method: 'GET' as const,
			url: '/insights',
			query: { project_id: 1 },
		};
		const cause = new ApiError(
			request as never,
			{
				url: 'https://mixpanel.com/api/query/insights',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: queryRateLimited,
			},
			'too many',
		);
		const error = new MixpanelAPIError('rate limited', { cause });

		expect(error.status).toBe(429);
		expect(error.code).toBe('query_api.request.rate_limited');
		expect(JSON.stringify(error)).not.toContain('project_id');
	});

	it('flags a query error body behind a 2xx', () => {
		const error = new MixpanelAPIError('failed', {
			status: 200,
			body: queryRateLimited,
		});
		expect(error.isQueryError).toBe(true);
	});

	it('does not flag an ok body', () => {
		const error = new MixpanelAPIError('fine', {
			status: 200,
			body: { status: 'ok' },
		});
		expect(error.isQueryError).toBe(false);
	});
});
