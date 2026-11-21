import {
	describePilvioError,
	makePilvioRequest,
	PilvioAPIError,
} from './client';
import { invalidCredentials, vmNotFound } from './test-fixtures';

const KEY = 'pv-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(body: unknown, status: number) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<PilvioAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(PilvioAPIError);
	if (!(error instanceof PilvioAPIError)) throw error;
	return error;
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url, init, headers: new Headers(init.headers) };
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makePilvioRequest', () => {
	it('authenticates with the raw apikey header, no scheme word', async () => {
		respond(userAnswer(), 200);

		await makePilvioRequest(KEY, {
			method: 'GET',
			path: '/v1/user-resource/user',
		});

		const sent = lastCall();
		expect(sent.url).toBe('https://api.pilvio.com/v1/user-resource/user');
		expect(sent.headers.get('apikey')).toBe(KEY);
		expect(sent.headers.get('apikey')).not.toContain('Bearer');
	});

	it('sends form-encoded bodies by default', async () => {
		respond({ data: {} }, 200);

		await makePilvioRequest(KEY, {
			method: 'POST',
			path: '/v1/user-resource/vm/start',
			body: { uuid: 'u-1' },
		});

		const sent = lastCall();
		expect(sent.init.method).toBe('POST');
		expect(sent.init.body).toBe('uuid=u-1');
		expect(sent.headers.get('content-type')).toContain(
			'application/x-www-form-urlencoded',
		);
	});

	it('sends JSON bodies when json is set', async () => {
		respond({ data: {} }, 200);

		await makePilvioRequest(KEY, {
			method: 'POST',
			path: '/v1/user-resource/ssh_keys',
			json: true,
			body: { name: 'laptop', public_key: 'ssh-ed25519 AAA' },
		});

		const sent = lastCall();
		expect(sent.init.body).toBe(
			JSON.stringify({ name: 'laptop', public_key: 'ssh-ed25519 AAA' }),
		);
		expect(sent.headers.get('content-type')).toContain('application/json');
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(invalidCredentials, 403);

		const error = await failure(
			makePilvioRequest(KEY, { method: 'GET', path: '/v1/user-resource/user' }),
		);
		expect(error.status).toBe(403);
		expect(error.message).toBe(
			'Pilvio 403: Invalid authentication credentials',
		);
		expect(error.method).toBe('GET');
	});

	it('extracts the business error message from the errors envelope', async () => {
		respond(vmNotFound, 400);

		const error = await failure(
			makePilvioRequest(KEY, {
				method: 'POST',
				path: '/v1/user-resource/vm/start',
				body: { uuid: 'x' },
			}),
		);
		expect(error.status).toBe(400);
		expect(error.message).toContain('No such virtual machine exists');
	});

	it('drops the request body from the rebuilt error', async () => {
		respond(invalidCredentials, 403);

		const error = await failure(
			makePilvioRequest(KEY, {
				method: 'POST',
				path: '/v1/user-resource/vm',
				body: { password: 'secret-pass-1' },
			}),
		);
		const printed = JSON.stringify(error.request);
		expect(printed).not.toContain('secret-pass-1');
	});
});

function userAnswer() {
	return {
		cookie_id: 'x',
		id: 8,
		name: 'user@example.com',
		profile: null,
		state: {},
	};
}

describe('describePilvioError', () => {
	it('prefers message over the errors envelope', () => {
		expect(describePilvioError(invalidCredentials, 'fallback')).toBe(
			'Invalid authentication credentials',
		);
	});

	it('reads the Error field of the business envelope', () => {
		expect(describePilvioError(vmNotFound, 'fallback')).toBe(
			'No such virtual machine exists. aaaaaaaa-0000-bbbb-1111-cccccccccccc',
		);
	});

	it('falls back on unknown bodies', () => {
		expect(describePilvioError(null, 'fallback')).toBe('fallback');
	});
});
