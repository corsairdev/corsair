import { inspect } from 'node:util';
import {
	describeTwoCaptchaError,
	isNotReady,
	makeTwoCaptchaRequest,
	readEnvelope,
	TWOCAPTCHA_API_BASE,
	TwoCaptchaAPIError,
} from './client';
import {
	balance,
	keyDoesNotExist,
	noSlot,
	reported,
	taskCreated,
	taskNotReady,
	taskSolved,
	wrongKeyFormat,
} from './test-fixtures';

const KEY = 'a'.repeat(32);

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
	const body = init.body instanceof FormData ? init.body : undefined;
	return {
		url: String(url),
		path: parsed.pathname,
		params: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		form: body
			? Object.fromEntries(
					Array.from(body.entries()).map(([k, v]) => [k, String(v)]),
				)
			: undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('readEnvelope', () => {
	it('reads a success envelope', () => {
		expect(readEnvelope(taskCreated)).toEqual({ ok: true, value: '734920165' });
	});

	it('reads a failure envelope with its code and text', () => {
		expect(readEnvelope(wrongKeyFormat)).toEqual({
			ok: false,
			code: 'ERROR_WRONG_USER_KEY',
			errorText:
				"You've provided key parameter value in incorrect format, it should contain 32 symbols.",
		});
	});

	it('reads a balance answer whose request is a number', () => {
		expect(readEnvelope(balance)).toEqual({ ok: true, value: '12.3456' });
	});

	it('reads the older bare-string form', () => {
		expect(readEnvelope('OK|734920165')).toEqual({
			ok: true,
			value: '734920165',
		});
		expect(readEnvelope('ERROR_WRONG_USER_KEY')).toEqual({
			ok: false,
			code: 'ERROR_WRONG_USER_KEY',
			errorText: undefined,
		});
	});

	it('treats a non-envelope body as a failure', () => {
		expect(readEnvelope(null).ok).toBe(false);
		expect(readEnvelope('<html>').ok).toBe(false);
	});
});

describe('isNotReady', () => {
	it('recognises the still-solving answer', () => {
		expect(isNotReady(readEnvelope(taskNotReady))).toBe(true);
	});

	it('does not treat a solved answer as not ready', () => {
		expect(isNotReady(readEnvelope(taskSolved))).toBe(false);
	});

	it('does not treat an error as not ready', () => {
		expect(isNotReady(readEnvelope(wrongKeyFormat))).toBe(false);
	});
});

describe('makeTwoCaptchaRequest', () => {
	it('sends the key and json flag in the query for a read', async () => {
		respond(balance);

		await makeTwoCaptchaRequest(KEY, { method: 'GET', path: 'getBalance' });

		const sent = lastRequest();
		expect(sent.url).toContain(`${TWOCAPTCHA_API_BASE}/getBalance`);
		expect(sent.params.key).toBe(KEY);
		expect(sent.params.json).toBe('1');
	});

	it('sends the key in the form on a write, not the URL', async () => {
		respond(taskCreated);

		await makeTwoCaptchaRequest(KEY, {
			method: 'POST',
			path: 'createTask',
			formData: { type: 'RecaptchaV2TaskProxyless' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.form?.key).toBe(KEY);
		expect(sent.form?.type).toBe('RecaptchaV2TaskProxyless');
	});

	it('keeps the route query alongside the key', async () => {
		respond(taskSolved);

		await makeTwoCaptchaRequest(KEY, {
			method: 'GET',
			path: 'getTaskResult',
			query: { taskId: '734920165' },
		});

		expect(lastRequest().params).toEqual({
			taskId: '734920165',
			key: KEY,
			json: '1',
		});
	});

	it('throws a typed error on a 429', async () => {
		respond(noSlot, 429);

		const error = await makeTwoCaptchaRequest(KEY, {
			method: 'GET',
			path: 'getBalance',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(TwoCaptchaAPIError);
		expect((error as TwoCaptchaAPIError).code).toBe('ERROR_NO_SLOT_AVAILABLE');
	});

	it('never puts the key in the message or its inspection', async () => {
		// The key travels in the form body on a write, which ApiError does not
		// redact, so the error must not keep the cause.
		respond(wrongKeyFormat);

		const error = await makeTwoCaptchaRequest(KEY, {
			method: 'POST',
			path: 'createTask',
			formData: { type: 'RecaptchaV2TaskProxyless', websiteURL: 'https://x' },
		}).catch((caught: unknown) => caught);

		for (const text of [
			(error as Error).message,
			inspect(error),
			JSON.stringify(error),
		]) {
			// `inspect` can return undefined for an object with no enumerable
			// fields; the check only cares that whatever it returned has no key.
			expect(text ?? '').not.toContain(KEY);
		}
		expect((error as { cause?: unknown }).cause).toBeUndefined();
	});
});

describe('describeTwoCaptchaError', () => {
	it('includes the code and the provider text', () => {
		expect(describeTwoCaptchaError(200, wrongKeyFormat, 'x')).toEqual({
			message: expect.stringContaining('2Captcha 200 ERROR_WRONG_USER_KEY'),
			code: 'ERROR_WRONG_USER_KEY',
			providerMessage: expect.stringContaining('incorrect format'),
		});
	});

	it('handles a bare-string body', () => {
		const described = describeTwoCaptchaError(200, keyDoesNotExist, 'x');
		expect(described.code).toBe('ERROR_KEY_DOES_NOT_EXIST');
	});

	it('handles an acknowledgement, which is not an error shape', () => {
		expect(describeTwoCaptchaError(200, reported, 'x').code).toBeUndefined();
	});

	it('falls back for a non-JSON body', () => {
		expect(
			describeTwoCaptchaError(500, '<html>', 'Server Error').message,
		).toContain('Server Error');
	});
});
