import { ApiError } from 'corsair/http';
import {
	makeAuthenticatedVercelRequest,
	makeVercelRequest,
	resolveTeam,
	teamScopeQuery,
} from './client';
import { errorHandlers } from './error-handlers';

const fetchMock = jest.fn();

beforeEach(() => {
	fetchMock.mockReset();
	global.fetch = fetchMock as unknown as typeof fetch;
});

function jsonResponse(status: number, body: unknown, headers = {}) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

function lastUrl(): URL {
	return new URL(String(fetchMock.mock.calls.at(-1)?.[0]));
}

describe('team scope', () => {
	it('sends a team id as teamId and anything else as slug', () => {
		expect(teamScopeQuery('team_123')).toEqual({ teamId: 'team_123' });
		expect(teamScopeQuery('my-team')).toEqual({ slug: 'my-team' });
		expect(teamScopeQuery('  ')).toEqual({});
		expect(teamScopeQuery(undefined)).toEqual({});
	});

	it('picks the call’s team, then the saved team, then the option', async () => {
		const keys = { get_team_id: async () => 'team_saved' };
		const ctx = { key: 'k', options: { teamId: 'team_option' }, keys };
		await expect(resolveTeam(ctx, 'team_call')).resolves.toBe('team_call');
		await expect(resolveTeam(ctx)).resolves.toBe('team_saved');
		await expect(
			resolveTeam({ ...ctx, keys: { get_team_id: async () => null } }),
		).resolves.toBe('team_option');
		await expect(resolveTeam({ key: 'k', options: {} })).resolves.toBe(
			undefined,
		);
	});
});

describe('requests', () => {
	it('sends the bearer token, the path and the saved team', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(200, { projects: [] }));
		await makeAuthenticatedVercelRequest(
			'/v10/projects',
			{
				key: 'tok',
				options: {},
				keys: { get_team_id: async () => 'team_saved' },
			},
			{ query: { limit: 5, search: undefined } },
		);
		const url = lastUrl();
		expect(url.origin + url.pathname).toBe(
			'https://api.vercel.com/v10/projects',
		);
		expect(url.searchParams.get('limit')).toBe('5');
		expect(url.searchParams.get('teamId')).toBe('team_saved');
		expect(url.searchParams.has('search')).toBe(false);
		const init = fetchMock.mock.calls.at(-1)?.[1] as RequestInit;
		expect(new Headers(init.headers).get('Authorization')).toBe('Bearer tok');
	});

	it('leaves the team out when the route names it itself', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(200, { user: { id: 'u' } }));
		await makeAuthenticatedVercelRequest(
			'/v2/user',
			{
				key: 'tok',
				options: { teamId: 'team_option' },
				keys: { get_team_id: async () => 'team_saved' },
			},
			{ teamScope: false },
		);
		expect(lastUrl().searchParams.has('teamId')).toBe(false);
		expect(lastUrl().searchParams.has('slug')).toBe(false);
	});

	it('sends a JSON body on writes', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(200, { id: 'prj_1' }));
		await makeVercelRequest('/v11/projects', 'tok', {
			method: 'POST',
			body: { name: 'site' },
		});
		const init = fetchMock.mock.calls.at(-1)?.[1] as RequestInit;
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toEqual({ name: 'site' });
		expect(new Headers(init.headers).get('Content-Type')).toContain(
			'application/json',
		);
	});

	it('passes core’s ApiError through with its status', async () => {
		fetchMock.mockResolvedValue(
			jsonResponse(403, {
				error: { code: 'forbidden', message: 'Not authorized' },
			}),
		);
		const error = await makeVercelRequest('/v10/projects', 'tok').catch(
			(e: unknown) => e,
		);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(403);
		expect(JSON.stringify(error)).not.toContain('tok');
	});
});

describe('error handlers', () => {
	const req = { method: 'GET', url: '/v2/user' } as const;
	const res = (status: number) => ({
		url: '',
		ok: false,
		status,
		statusText: '',
		body: {},
	});

	it('does not retry a 429 again after core’s own retries', async () => {
		const error = new ApiError(req, res(429), 'Too Many Requests', {
			retryAfter: 2000,
		});
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: 2000 });
	});

	it('matches 401 and 403 by status and never retries them', async () => {
		const unauthorized = new ApiError(req, res(401), 'Unauthorized');
		const forbidden = new ApiError(req, res(403), 'Forbidden');
		expect(errorHandlers.AUTH_ERROR.match(unauthorized)).toBe(true);
		expect(errorHandlers.PERMISSION_ERROR.match(forbidden)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(forbidden)).toBe(false);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
