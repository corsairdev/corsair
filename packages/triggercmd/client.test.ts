import { inspect } from 'node:util';
import {
	describeTriggerCmdError,
	makeTriggerCmdRequest,
	TRIGGERCMD_API_BASE,
	TriggerCmdAPIError,
} from './client';
import { invalidToken, noAuthHeader } from './test-fixtures';

const TOKEN = 'tc-live-token-1234567890';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		url: String(url),
		path: parsed.pathname,
		params: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the parsed request body, when there is one.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeTriggerCmdRequest', () => {
	it('sends the token as a Bearer header, not in the URL', async () => {
		respond({ records: [] });

		await makeTriggerCmdRequest(TOKEN, {
			method: 'GET',
			path: 'api/computer/list',
		});

		const sent = lastRequest();
		expect(sent.url).toBe(`${TRIGGERCMD_API_BASE}/api/computer/list`);
		expect(sent.headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
		expect(sent.url).not.toContain(TOKEN);
	});

	it('sends query values as strings', async () => {
		respond({ records: [] });

		await makeTriggerCmdRequest(TOKEN, {
			method: 'GET',
			path: 'api/run/list',
			query: { command_id: 101 },
		});

		expect(lastRequest().params).toEqual({ command_id: '101' });
	});

	it('sends a JSON body for a command run', async () => {
		respond({ result: 'success' });

		await makeTriggerCmdRequest(TOKEN, {
			method: 'POST',
			path: 'api/run/trigger',
			body: { computer: 'laptop', trigger: 'notepad' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toEqual({ computer: 'laptop', trigger: 'notepad' });
	});

	it('reads the 401 Invalid Token body', async () => {
		respond(invalidToken, 401);

		const error = await makeTriggerCmdRequest(TOKEN, {
			method: 'POST',
			path: 'api/command/list',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(TriggerCmdAPIError);
		expect((error as TriggerCmdAPIError).status).toBe(401);
		expect((error as TriggerCmdAPIError).providerMessage).toBe(
			'Invalid Token!',
		);
		expect((error as TriggerCmdAPIError).isAuthError).toBe(true);
	});

	it('treats a missing header the same way', async () => {
		respond(noAuthHeader, 401);

		const error = await makeTriggerCmdRequest(TOKEN, {
			method: 'GET',
			path: 'api/computer/list',
		}).catch((caught: unknown) => caught);

		expect((error as TriggerCmdAPIError).isAuthError).toBe(true);
		expect((error as Error).message).toContain('No Authorization header');
	});

	it('reads a 404 as an unknown route, not an auth failure', async () => {
		// The provider answers a route that does not exist with an empty 404.
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));

		const error = await makeTriggerCmdRequest(TOKEN, {
			method: 'POST',
			path: 'api/command/run',
		}).catch((caught: unknown) => caught);

		expect((error as TriggerCmdAPIError).status).toBe(404);
		expect((error as TriggerCmdAPIError).isUnknownRoute).toBe(true);
		expect((error as TriggerCmdAPIError).isAuthError).toBe(false);
	});

	it('keeps Retry-After so the rate-limit handler can honour it', async () => {
		respond({ err: 'slow down' }, 429, { 'Retry-After': '15' });

		const error = await makeTriggerCmdRequest(TOKEN, {
			method: 'GET',
			path: 'api/computer/list',
		}).catch((caught: unknown) => caught);

		expect((error as TriggerCmdAPIError).retryAfter).toBe(15000);
		expect((error as TriggerCmdAPIError).isRateLimit).toBe(true);
	});

	it('records the method so a command run is not replayed', async () => {
		respond({}, 500);

		const error = await makeTriggerCmdRequest(TOKEN, {
			method: 'POST',
			path: 'api/run/trigger',
			body: {},
		}).catch((caught: unknown) => caught);

		expect((error as TriggerCmdAPIError).method).toBe('POST');
	});

	it('never puts the token in the message or its inspection', async () => {
		respond(invalidToken, 401);

		const error = await makeTriggerCmdRequest(TOKEN, {
			method: 'GET',
			path: 'api/computer/list',
		}).catch((caught: unknown) => caught);

		for (const text of [
			(error as Error).message,
			inspect(error),
			JSON.stringify(error),
		]) {
			expect(text).not.toContain(TOKEN);
		}
	});
});

describe('describeTriggerCmdError', () => {
	it('reads the `err` field', () => {
		expect(describeTriggerCmdError(401, invalidToken, 'x')).toEqual({
			message: 'TRIGGERcmd 401: Invalid Token!',
			providerMessage: 'Invalid Token!',
		});
	});

	it('falls back for a body with no err field', () => {
		expect(describeTriggerCmdError(500, {}, 'Server Error')).toEqual({
			message: 'TRIGGERcmd 500: Server Error',
			providerMessage: undefined,
		});
	});

	it('reads a message field when there is one', () => {
		expect(
			describeTriggerCmdError(400, { message: 'bad request' }, 'x').message,
		).toBe('TRIGGERcmd 400: bad request');
	});

	it('handles an empty 404 body', () => {
		expect(describeTriggerCmdError(404, undefined, 'Not Found')).toEqual({
			message: 'TRIGGERcmd 404: Not Found',
			providerMessage: undefined,
		});
	});
});
