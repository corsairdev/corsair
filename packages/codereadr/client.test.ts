import { ApiError } from 'corsair/http';
import {
	CODEREADR_API_BASE,
	CodereadrAPIError,
	makeCodereadrRequest,
	parseCodereadrXml,
} from './client';
import {
	API_KEY_ERROR_XML,
	AUTH_ERROR_XML,
	CREATED_XML,
	LIMITS_XML,
	RATE_LIMIT_ERROR_XML,
	SCANS_XML,
	SUCCESS_XML,
} from './test-fixtures';
import { asArray, asRecord, rejection } from './test-helpers';

const API_KEY = 'test-api-key-abcdef123456';

type Captured = {
	url: string;
	init: RequestInit;
};

/** Replaces fetch and records the call the client made. */
function mockFetch(
	body: string,
	options: {
		status?: number;
		contentType?: string;
		retryAfter?: string;
	} = {},
): Captured[] {
	const captured: Captured[] = [];
	// unknown: jest's mock signature takes whatever the caller passes, and the
	// client sends the fetch arguments a real call would.
	global.fetch = jest.fn(async (url: unknown, init: unknown) => {
		captured.push({ url: String(url), init: init as RequestInit });
		const headers: Record<string, string> = {
			'Content-Type': options.contentType ?? 'text/xml; charset=utf-8',
		};
		if (options.retryAfter !== undefined) {
			headers['Retry-After'] = options.retryAfter;
		}
		return new Response(body, { status: options.status ?? 200, headers });
	}) as typeof fetch;
	return captured;
}

function formOf(captured: Captured): URLSearchParams {
	return new URLSearchParams(String(captured.init.body));
}

describe('makeCodereadrRequest', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('posts form-encoded variables to the single API URL', async () => {
		const captured = mockFetch(SUCCESS_XML);
		await makeCodereadrRequest(API_KEY, {
			section: 'scans',
			action: 'retrieve',
			limit: 5,
		});

		expect(captured).toHaveLength(1);
		expect(captured[0]?.url).toBe(CODEREADR_API_BASE);
		expect(captured[0]?.init.method).toBe('POST');
		expect(captured[0]?.url).not.toContain('?');

		const form = formOf(captured[0] as Captured);
		expect(form.get('section')).toBe('scans');
		expect(form.get('action')).toBe('retrieve');
		expect(form.get('limit')).toBe('5');
	});

	it('sends the key in the form body, never in the query string', async () => {
		const captured = mockFetch(SUCCESS_XML);
		await makeCodereadrRequest(API_KEY, {
			section: 'limits',
			action: 'retrieve',
		});

		const call = captured[0] as Captured;
		expect(call.url).not.toContain(API_KEY);
		expect(call.url).not.toContain('api_key');
		expect(formOf(call).get('api_key')).toBe(API_KEY);
	});

	it('declares the form media type the API documents', async () => {
		const captured = mockFetch(SUCCESS_XML);
		await makeCodereadrRequest(API_KEY, {
			section: 'limits',
			action: 'retrieve',
		});

		const headers = (captured[0] as Captured).init.headers as Headers;
		expect(headers.get('Content-Type')).toBe(
			'application/x-www-form-urlencoded',
		);
	});

	it('omits undefined variables instead of sending the string "undefined"', async () => {
		const captured = mockFetch(SUCCESS_XML);
		await makeCodereadrRequest(API_KEY, {
			section: 'users',
			action: 'retrieve',
			user_id: undefined,
		});

		const form = formOf(captured[0] as Captured);
		expect(form.has('user_id')).toBe(false);
		expect(form.toString()).not.toContain('undefined');
	});

	it('returns the parsed payload for a successful call', async () => {
		mockFetch(LIMITS_XML);
		const result = await makeCodereadrRequest(API_KEY, {
			section: 'limits',
			action: 'retrieve',
		});

		expect(result.status).toBe('1');
		expect(typeof result.minute).toBe('object');
	});

	it('throws for HTTP 200 that reports status 0', async () => {
		mockFetch(API_KEY_ERROR_XML);
		await expect(
			makeCodereadrRequest(API_KEY, { section: 'limits', action: 'retrieve' }),
		).rejects.toThrow(CodereadrAPIError);
	});

	it('carries the provider error code and message', async () => {
		mockFetch(AUTH_ERROR_XML);
		const error = await rejection<CodereadrAPIError>(
			makeCodereadrRequest(API_KEY, {
				section: 'limits',
				action: 'retrieve',
			}),
		);

		expect(error).toBeInstanceOf(CodereadrAPIError);
		expect(error.code).toBe(100);
		expect(error.message).toContain('The API key is invalid.');
		expect(error.isRateLimit).toBe(false);
	});

	it('marks the documented limit codes as rate limits', async () => {
		mockFetch(RATE_LIMIT_ERROR_XML);
		const error = await rejection<CodereadrAPIError>(
			makeCodereadrRequest(API_KEY, {
				section: 'limits',
				action: 'retrieve',
			}),
		);

		expect(error.code).toBe(111);
		expect(error.isRateLimit).toBe(true);
	});

	it('wraps a transport failure and keeps the HTTP status', async () => {
		mockFetch('<html>bad gateway</html>', { status: 502 });
		const error = await rejection<CodereadrAPIError>(
			makeCodereadrRequest(API_KEY, {
				section: 'limits',
				action: 'retrieve',
			}),
		);

		expect(error).toBeInstanceOf(CodereadrAPIError);
		expect(error.status).toBe(502);
	});

	it('fails loudly on a body that is not XML', async () => {
		mockFetch('not xml at all', { contentType: 'text/xml' });
		await expect(
			makeCodereadrRequest(API_KEY, { section: 'limits', action: 'retrieve' }),
		).rejects.toThrow(/not XML/);
	});

	it('never leaks the key into the error message or cause', async () => {
		mockFetch(AUTH_ERROR_XML);
		const error = await rejection<CodereadrAPIError>(
			makeCodereadrRequest(API_KEY, {
				section: 'limits',
				action: 'retrieve',
			}),
		);

		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(String(error.cause)).not.toContain(API_KEY);
	});

	it('drops the transport cause so the request body cannot leak the key', async () => {
		// A 500 makes the client wrap an ApiError, which holds the request whose
		// form body carries api_key and, on user writes, the password.
		mockFetch('<html>oops</html>', { status: 500 });
		const error = await rejection<CodereadrAPIError>(
			makeCodereadrRequest(API_KEY, {
				section: 'users',
				action: 'create',
				password: 'user-password',
			}),
		);

		expect(error.cause).toBeUndefined();
		const serialized = `${JSON.stringify(error)}${error.message}${String(error.stack)}`;
		expect(serialized).not.toContain(API_KEY);
		expect(serialized).not.toContain('user-password');
	});

	it('keeps a Retry-After delay on the error it wraps', async () => {
		mockFetch('', { status: 429, retryAfter: '2' });
		const error = await rejection<CodereadrAPIError>(
			makeCodereadrRequest(API_KEY, {
				section: 'limits',
				action: 'retrieve',
			}),
		);

		expect(error.status).toBe(429);
		expect(error.isRateLimit).toBe(true);
		// The header has to survive the request layer, or the handler falls back
		// to a full minute instead of the wait the server asked for.
		expect(error.retryAfter).toBe(2_000);
	});

	it('refuses a 200 whose body has no success status', async () => {
		// A proxy error page parses as XML but never says status 1, so treating
		// the absence of a failure as success would make a delete look applied.
		mockFetch('<html><body>Unavailable</body></html>');
		await expect(
			makeCodereadrRequest(API_KEY, { section: 'scans', action: 'delete' }),
		).rejects.toThrow(/without a status/);
	});

	it('preserves whitespace inside a leaf so a stored value round-trips', async () => {
		mockFetch('<xml><status>1</status><value><id> A1 </id></value></xml>');
		const root = await makeCodereadrRequest(API_KEY, {
			section: 'databases',
			action: 'showvalues',
		});
		const values = asRecord(root.value);
		// A leaf without attributes is returned as its text, untrimmed.
		expect(values.id).toBe(' A1 ');
	});

	it('reports replay safety on the error so a write is not retried blindly', async () => {
		mockFetch(AUTH_ERROR_XML);
		const readError = await rejection<CodereadrAPIError>(
			makeCodereadrRequest(
				API_KEY,
				{ section: 'scans', action: 'retrieve' },
				{ replaySafe: true },
			),
		);
		expect(readError.replaySafe).toBe(true);

		mockFetch(AUTH_ERROR_XML);
		const writeError = await rejection<CodereadrAPIError>(
			makeCodereadrRequest(API_KEY, {
				section: 'scans',
				action: 'delete',
			}),
		);
		expect(writeError.replaySafe).toBe(false);
	});

	it('makes a single attempt so retries stay in error-handlers', async () => {
		const captured = mockFetch(API_KEY_ERROR_XML);
		await makeCodereadrRequest(API_KEY, {
			section: 'limits',
			action: 'retrieve',
		}).catch(() => undefined);

		expect(captured).toHaveLength(1);
	});
});

describe('parseCodereadrXml', () => {
	it('reads repeated nodes as an array and a single node as an object', () => {
		const parsed = parseCodereadrXml(SCANS_XML);
		const scans = asArray(parsed?.scan);
		expect(scans).toHaveLength(2);
	});

	it('keeps a node that appears once as an object', () => {
		const parsed = parseCodereadrXml(SUCCESS_XML);
		expect(parsed?.status).toBe('1');
		expect(Array.isArray(parsed?.status)).toBe(false);
	});

	it('keeps attributes and text on the same node', () => {
		const parsed = parseCodereadrXml(CREATED_XML);
		expect(parsed?.id).toBe('1001');
	});

	it('decodes XML entities in text', () => {
		const parsed = parseCodereadrXml(
			'<xml><status>1</status><note>a &amp; b &lt;c&gt; &quot;d&quot;</note></xml>',
		);
		expect(parsed?.note).toBe('a & b <c> "d"');
	});

	it('decodes a reference only once', () => {
		// The provider escaped an ampersand into its own reference, so the
		// correct value is the literal text `&amp;`, not `&`.
		const parsed = parseCodereadrXml(
			'<xml><status>1</status><note>&#38;amp;</note></xml>',
		);
		expect(parsed?.note).toBe('&amp;');
	});

	it('keeps a property whose name matches an inherited property', () => {
		// `constructor` would otherwise look like a repeat of an inherited value
		// and be dropped.
		const parsed = parseCodereadrXml(
			'<xml><status>1</status><properties><constructor>one</constructor></properties></xml>',
		);
		const properties = asRecord(parsed?.properties);
		expect(properties.constructor).toBe('one');
	});

	it('skips a leading declaration', () => {
		const parsed = parseCodereadrXml(
			'<?xml version="1.0" encoding="UTF-8"?><xml><status>1</status></xml>',
		);
		expect(parsed?.status).toBe('1');
	});

	it('returns undefined for input that is not XML', () => {
		expect(parseCodereadrXml('hello')).toBeUndefined();
		expect(parseCodereadrXml('')).toBeUndefined();
		expect(parseCodereadrXml('<xml><status>1</status>')).toBeUndefined();
	});

	it('does not confuse a nested status with the root status', () => {
		const parsed = parseCodereadrXml(SCANS_XML);
		expect(parsed?.status).toBe('1');
		const scans = asArray(parsed?.scan).map(asRecord);
		expect(scans[1]?.status).toBe('0');
	});
});

describe('CodereadrAPIError', () => {
	it('is not a rate limit for an unrelated code', () => {
		const error = new CodereadrAPIError('boom', { code: 50 });
		expect(error.isRateLimit).toBe(false);
	});

	it('treats the per-day code as a rate limit too', () => {
		expect(new CodereadrAPIError('boom', { code: 113 }).isRateLimit).toBe(true);
	});

	it('is not a rate limit when there is no code', () => {
		expect(new CodereadrAPIError('boom').isRateLimit).toBe(false);
	});

	it('defaults to unsafe for replay', () => {
		expect(new CodereadrAPIError('boom').replaySafe).toBe(false);
	});

	it('is not an ApiError, so the shared retry path does not claim it', () => {
		expect(new CodereadrAPIError('boom')).not.toBeInstanceOf(ApiError);
	});
});
