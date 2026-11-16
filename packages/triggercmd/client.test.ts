import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	makeTriggerCmdRequest,
	TRIGGERCMD_API_BASE,
	triggerCmdErrorMessage,
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

		// Core's ApiError goes through unchanged (plugin rules R8).
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
		expect(triggerCmdErrorMessage(error)).toBe('Invalid Token!');
	});

	it('treats a missing header the same way', async () => {
		respond(noAuthHeader, 401);

		const error = await makeTriggerCmdRequest(TOKEN, {
			method: 'GET',
			path: 'api/computer/list',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).status).toBe(401);
		expect(triggerCmdErrorMessage(error)).toContain('No Authorization header');
	});

	it('reads a 404 as an unknown route, not an auth failure', async () => {
		// The provider answers a route that does not exist with an empty 404.
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));

		const error = await makeTriggerCmdRequest(TOKEN, {
			method: 'POST',
			path: 'api/command/run',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).status).toBe(404);
		expect(triggerCmdErrorMessage(error)).toBeUndefined();
	});

	it('lets core retry a 429 three times, then passes it through', async () => {
		jest.useFakeTimers();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ err: 'slow down' }, 429, { 'Retry-After': '15' });
			}
			const pending = makeTriggerCmdRequest(TOKEN, {
				method: 'GET',
				path: 'api/computer/list',
			}).catch((caught: unknown) => caught);
			await jest.advanceTimersByTimeAsync(50_000);
			const error = await pending;

			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect((error as ApiError).status).toBe(429);
			expect((error as ApiError).retryAfter).toBe(15000);
		} finally {
			jest.useRealTimers();
		}
	});

	it('records the method so a command run is not replayed', async () => {
		respond({}, 500);

		const error = await makeTriggerCmdRequest(TOKEN, {
			method: 'POST',
			path: 'api/run/trigger',
			body: {},
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).request.method).toBe('POST');
	});

	it("keeps command params out of a failed run's error", async () => {
		respond({ err: 'boom' }, 400);

		const error = await makeTriggerCmdRequest(TOKEN, {
			method: 'POST',
			path: 'api/run/trigger',
			body: { computer: 'laptop', trigger: 'x', params: 'secret-sentinel-77' },
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(400);
		expect((error as ApiError).request.body).toBeUndefined();
		expect(inspect(error, { depth: 10 })).not.toContain('secret-sentinel-77');
	});

	it('keeps panel button params out of the error query and URL', async () => {
		respond({ err: 'boom' }, 400);

		const error = await makeTriggerCmdRequest(TOKEN, {
			method: 'GET',
			path: 'api/panel/trigger',
			query: { panel: 'p', button: 'b', params: 'secret-sentinel-78' },
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).request.query).toMatchObject({
			panel: 'p',
			params: '[REDACTED]',
		});
		expect(inspect(error, { depth: 10 })).not.toContain('secret-sentinel-78');
		// The request that went out still carried the params.
		expect(String(fetchMock.mock.calls.at(-1)?.[0])).toContain(
			'params=secret-sentinel-78',
		);
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
