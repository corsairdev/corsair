import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	isKickboxAuthError,
	isKickboxQuotaError,
	KickboxAPIError,
} from './client';
import { Verify } from './endpoints';
import {
	badRequest,
	deliverable,
	disposableHost,
	insufficientBalance,
	invalidKey,
	notDisposableHost,
	refusedKeyOn200,
	risky,
	undeliverable,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'kb-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown, region?: 'us' | 'eu') {
	// The fake context only carries what the endpoints read.
	return endpoint(
		{ key: API_KEY, options: region ? { region } : {} } as never,
		input as never,
	);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
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
	};
}

/** The caught rejection, without a cast at each call site. */
// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller asserts only on the fields it checks.
async function caught(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((error: unknown) => error);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('verify.verify', () => {
	it('GETs the address with the key in the query string', async () => {
		respond(deliverable);

		await expect(
			invoke(Verify.verify, { email: 'test@example.com' }),
		).resolves.toMatchObject({
			result: 'deliverable',
			reason: 'accepted_email',
			sendex: 0.85,
		});
		expect(lastRequest()).toMatchObject({
			origin: 'https://api.kickbox.com',
			method: 'GET',
			path: '/v2/verify',
		});
		expect(lastRequest().query).toEqual({
			email: 'test@example.com',
			apikey: API_KEY,
		});
	});

	it('URL-encodes an address with a plus and an @', async () => {
		respond(deliverable);

		await invoke(Verify.verify, { email: 'first+tag@example.com' });

		const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(url).toContain('email=first%2Btag%40example.com');
	});

	it('sends the timeout when one is given', async () => {
		respond(deliverable);

		await invoke(Verify.verify, { email: 'test@example.com', timeout: 10_000 });

		expect(lastRequest().query.timeout).toBe('10000');
	});

	it('keeps the typo suggestion and the flags', async () => {
		respond(undeliverable);

		await expect(
			invoke(Verify.verify, { email: 'bill.lumbergh@gamil.com' }),
		).resolves.toMatchObject({
			result: 'undeliverable',
			did_you_mean: 'bill.lumbergh@gmail.com',
			free: false,
			disposable: false,
			accept_all: false,
		});
	});

	it('keeps an accept-all result as risky', async () => {
		respond(risky);

		await expect(
			invoke(Verify.verify, { email: 'info@acceptall.example' }),
		).resolves.toMatchObject({ result: 'risky', accept_all: true });
	});

	it('logs the domain and verdict, never the address', async () => {
		respond(deliverable);

		await invoke(Verify.verify, { email: 'test@example.com' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kickbox.verify.verify',
			{
				domain: 'example.com',
				result: 'deliverable',
				reason: 'accepted_email',
			},
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('test@');
	});

	it('sends verification to the EU host for an EU-only account', async () => {
		respond(deliverable);

		await invoke(Verify.verify, { email: 'test@example.com' }, 'eu');

		expect(lastRequest().origin).toBe('https://api.eu.kickbox.com');
	});

	it('throws on a 200 that says the key was refused', async () => {
		respond(refusedKeyOn200);

		const error = await caught(
			invoke(Verify.verify, { email: 'test@example.com' }),
		);

		expect(error).toBeInstanceOf(KickboxAPIError);
		expect(error).toMatchObject({
			status: 200,
			code: 'FORBIDDEN',
			isAuthError: true,
		});
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('reads a spent balance on a 403 as a quota error, not a refused key', async () => {
		respond(insufficientBalance, 403);

		const error = await invoke(Verify.verify, {
			email: 'test@example.com',
			// unknown: a rejected request can carry any thrown value.
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({
			status: 403,
			body: { code: 'INSUFFICIENT_BALANCE' },
		});
		expect(isKickboxQuotaError(error)).toBe(true);
		expect(isKickboxAuthError(error)).toBe(false);
	});

	it('surfaces a refused key that arrives as a 403', async () => {
		respond(invalidKey, 403);

		await expect(
			invoke(Verify.verify, { email: 'test@example.com' }),
		).rejects.toMatchObject({
			status: 403,
			body: { code: 'FORBIDDEN' },
			message: 'Kickbox 403 FORBIDDEN: request failed',
		});
	});

	it('surfaces a missing parameter', async () => {
		respond(badRequest, 400);

		await expect(
			invoke(Verify.verify, { email: 'test@example.com' }),
		).rejects.toMatchObject({ status: 400 });
	});

	it('keeps a result value Kickbox adds later instead of failing', async () => {
		respond({ ...deliverable, result: 'suspicious' });

		await expect(
			invoke(Verify.verify, { email: 'test@example.com' }),
		).resolves.toMatchObject({ result: 'suspicious' });
	});

	it('rejects a body with no result before reporting an answer', async () => {
		respond({ success: true });

		await expect(
			invoke(Verify.verify, { email: 'test@example.com' }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it.each([
		[{}],
		[{ email: '' }],
		[{ email: 'ab' }],
		[{ email: 'test@example.com', timeout: 0 }],
		[{ email: 'test@example.com', timeout: 30_001 }],
	])('rejects %j before calling Kickbox', async (input) => {
		await expect(invoke(Verify.verify, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('verify.disposable', () => {
	it('GETs the open host with no key', async () => {
		respond(disposableHost);

		await expect(
			invoke(Verify.disposable, { address: 'mailinator.com' }),
		).resolves.toEqual({ disposable: true });
		expect(lastRequest()).toMatchObject({
			origin: 'https://open.kickbox.com',
			method: 'GET',
			path: '/v1/disposable/mailinator.com',
		});
		// The key belongs to the verification service, so it never travels here.
		expect(lastRequest().query).toEqual({});
	});

	it('answers false for a domain that is not disposable', async () => {
		respond(notDisposableHost);

		await expect(
			invoke(Verify.disposable, { address: 'google.com' }),
		).resolves.toEqual({ disposable: false });
	});

	it('accepts a full address', async () => {
		respond(disposableHost);

		await invoke(Verify.disposable, { address: 'someone@mailinator.com' });

		expect(lastRequest().path).toBe('/v1/disposable/someone%40mailinator.com');
	});

	it('logs the domain, never the local part', async () => {
		respond(disposableHost);

		await invoke(Verify.disposable, { address: 'someone@mailinator.com' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kickbox.verify.disposable',
			{ domain: 'mailinator.com' },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('someone@');
	});

	it('logs no domain for text that is not a hostname', async () => {
		respond({ disposable: false });

		await invoke(Verify.disposable, { address: 'jane_doe_private' });

		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('jane_doe');
	});

	it('logs a bare domain as the domain', async () => {
		respond(disposableHost);

		await invoke(Verify.disposable, { address: 'Mailinator.com' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kickbox.verify.disposable',
			{ domain: 'mailinator.com' },
			'completed',
		);
	});

	it('rejects an address too short to be one', async () => {
		await expect(
			invoke(Verify.disposable, { address: 'ab' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('the API key', () => {
	it('keeps the key out of the error', async () => {
		respond(invalidKey, 403);

		const error = await caught(
			invoke(Verify.verify, { email: 't@example.com' }),
		);

		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(API_KEY);
		// ApiError redacts `apikey` in a URL, so the cause chain is safe here.
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});
});
