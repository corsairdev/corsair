import type { TeamcampAPIError } from './client';
import {
	describeTeamcampError,
	makeTeamcampRequest,
	readTeamcampError,
	segment,
	TEAMCAMP_API_BASE,
	TEAMCAMP_KEY_HEADER,
} from './client';
import { captureError } from './test-errors';
import { invalidKeyBody, missingProjectId } from './test-fixtures';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

// unknown: response bodies are one of the three shapes Teamcamp uses: an
// array, an object, or a bare JSON string.
function respond(raw: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof raw === 'string' ? raw : JSON.stringify(raw), {
			status,
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		rawBody: init.body as string | undefined,
	};
}

const KEY = 'tc-test-key';

describe('auth transport', () => {
	it('sends the key in the apiKey header, never as a Bearer token', async () => {
		respond([]);

		await makeTeamcampRequest(KEY, { method: 'GET', path: '/project' });

		const sent = lastRequest();
		// The base carries the /v1.0 prefix, so the URL starts with it whole.
		expect(
			`${sent.origin}${sent.path.startsWith('/v1.0') ? '/v1.0' : ''}`,
		).toBe(TEAMCAMP_API_BASE);
		expect(TEAMCAMP_KEY_HEADER).toBe('apiKey');
		expect(sent.headers.get('apikey')).toBe(KEY);
		// The spec's scheme is named bearerAuth but is an apiKey header; the live
		// API answers 403 to a Bearer token.
		expect(sent.headers.get('authorization')).toBeNull();
	});

	it('carries the /v1.0 prefix on every path', async () => {
		respond([]);

		await makeTeamcampRequest(KEY, { method: 'GET', path: '/task' });

		expect(lastRequest().path).toBe('/v1.0/task');
	});
});

describe('request building', () => {
	it('sends a JSON body with its media type', async () => {
		respond({});

		await makeTeamcampRequest(KEY, {
			method: 'POST',
			path: '/project',
			body: { projectName: 'x' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(JSON.parse(String(sent.rawBody))).toEqual({ projectName: 'x' });
	});

	it('sends query parameters for the task list', async () => {
		respond([]);

		await makeTeamcampRequest(KEY, {
			method: 'GET',
			path: '/task',
			query: { projectId: 'p1', complete: false },
		});

		expect(lastRequest().query).toEqual({
			projectId: 'p1',
			complete: 'false',
		});
	});
});

describe('response reading', () => {
	it('returns a bare array as-is', async () => {
		const rows = [{ projectId: 'p1', projectName: 'One' }];
		respond(rows);

		const result = await makeTeamcampRequest<typeof rows>(KEY, {
			method: 'GET',
			path: '/project',
		});

		expect(result).toEqual(rows);
	});

	it('returns the bare string a delete answers', async () => {
		respond('"The project has been deleted successfully."');

		const result = await makeTeamcampRequest<string>(KEY, {
			method: 'DELETE',
			path: '/project/p1',
		});

		expect(result).toBe('The project has been deleted successfully.');
	});
});

describe('the 403 that is not an auth failure', () => {
	it('reports a resource-scoped 403 as a missing resource, not a bad key', async () => {
		respond(invalidKeyBody, 403);

		const error = (await captureError(
			makeTeamcampRequest(KEY, {
				method: 'GET',
				path: '/task',
				query: { projectId: 'nope' },
				resourceScoped: true,
			}),
		)) as TeamcampAPIError;

		expect(error.status).toBe(403);
		// The point of the flag: a caller is not sent to re-enter a working key.
		expect(error.resourceNotFound).toBe(true);
		expect(error.isAuthError).toBe(false);
		expect(error.message).toContain('does not exist');
		expect(error.message).not.toBe('Teamcamp 403: Invalid API key!!!');
	});

	it('still reports a real bad key on a call without a resource id', async () => {
		respond(invalidKeyBody, 403);

		const error = (await captureError(
			makeTeamcampRequest('bogus', {
				method: 'GET',
				path: '/project',
			}),
		)) as TeamcampAPIError;

		expect(error.status).toBe(403);
		expect(error.resourceNotFound).toBe(false);
		expect(error.isAuthError).toBe(true);
		expect(error.message).toContain('Invalid API key');
	});

	it('reads a 401 as an auth failure', async () => {
		respond({ error: 'nope' }, 401);

		const error = (await captureError(
			makeTeamcampRequest(KEY, {
				method: 'GET',
				path: '/project',
			}),
		)) as TeamcampAPIError;

		expect(error.isAuthError).toBe(true);
	});
});

describe('error translation', () => {
	it('reads the { error } body a bad parameter answers', async () => {
		respond(missingProjectId, 400);

		const error = (await captureError(
			makeTeamcampRequest(KEY, {
				method: 'GET',
				path: '/task',
			}),
		)) as TeamcampAPIError;

		expect(error.status).toBe(400);
		expect(error.detail).toBe('ProjectId is required');
		expect(error.message).toContain('ProjectId is required');
	});

	it('reads the bare JSON string a 403 answers', () => {
		expect(readTeamcampError(invalidKeyBody)).toBe('Invalid API key!!!');
		expect(readTeamcampError({ error: 'ProjectId is required' })).toBe(
			'ProjectId is required',
		);
		expect(readTeamcampError('')).toBeUndefined();
		expect(readTeamcampError(null)).toBeUndefined();
	});

	it('falls back to the status line when the body says nothing', () => {
		expect(describeTeamcampError(500, 'Server Error', null, false)).toBe(
			'Teamcamp request failed (Server Error)',
		);
	});

	it('records the method so a write is never replayed on a 5xx', async () => {
		respond({ error: 'boom' }, 500);

		const error = (await captureError(
			makeTeamcampRequest(KEY, {
				method: 'POST',
				path: '/project',
				body: {},
			}),
		)) as TeamcampAPIError;

		expect(error.method).toBe('POST');
	});

	it('never puts the key in the message or the inspected error', async () => {
		respond(invalidKeyBody, 403);

		const error = (await captureError(
			makeTeamcampRequest(KEY, {
				method: 'GET',
				path: '/project',
			}),
		)) as TeamcampAPIError;

		expect(error.message).not.toContain(KEY);
		expect(JSON.stringify(error)).not.toContain(KEY);
		expect(require('node:util').inspect(error)).not.toContain(KEY);
	});

	it('encodes path segments', () => {
		expect(segment('iPSOnKVs4zSOR5-vQTK_3')).toBe('iPSOnKVs4zSOR5-vQTK_3');
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});
});
