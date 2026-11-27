import { inspect } from 'node:util';
import { readEnvelopeError, SMTP2GO_API_BASE, Smtp2goAPIError } from './client';
import {
	missingKeyError,
	statsCycleOk,
	unknownKeyError,
} from './test-fixtures';
import {
	API_KEY,
	BASE,
	captureError,
	endpoints,
	errorResponse,
	installFetchMock,
	lastCall,
	makeCtx,
	mockFetch,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('client request shape', () => {
	it('sends the key in the X-Smtp2go-Api-Key header, never in the body', async () => {
		mockFetch(
			new Response(JSON.stringify(statsCycleOk), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await endpoints.stats.cycle(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/stats/email_cycle`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentHeader('X-Smtp2go-Api-Key')).toBe(API_KEY);
		expect(sentHeader('Authorization')).toBeNull();
		const body = sentBody();
		expect(body).toEqual({});
		expect(JSON.stringify(body)).not.toContain(API_KEY);
		expect(lastCall().init.headers).toBeInstanceOf(Headers);
		expect(new Headers(lastCall().init.headers).get('Content-Type')).toBe(
			'application/json',
		);
	});

	it('targets the regionless /v3 base', () => {
		expect(SMTP2GO_API_BASE).toBe('https://api.smtp2go.com/v3');
	});
});

describe('error parsing', () => {
	it('maps a 400 envelope onto Smtp2goAPIError with status and code', async () => {
		mockFetch(errorResponse(400, unknownKeyError));

		const error = await captureError(endpoints.stats.cycle(makeCtx(), {}));

		expect(error).toBeInstanceOf(Smtp2goAPIError);
		const apiError = error as Smtp2goAPIError;
		expect(apiError.status).toBe(400);
		expect(apiError.code).toBe('E_ApiResponseCodes.API_EXCEPTION');
		expect(apiError.message).toContain('API User');
		expect(apiError.replayable).toBe(true);
	});

	it('never carries the key in message, inspect or JSON output', async () => {
		// The request would echo the key in its body if the plugin ever sent
		// body auth; the transport error path keeps no body at all.
		mockFetch(errorResponse(403, missingKeyError));

		const error = await captureError(endpoints.stats.cycle(makeCtx(), {}));

		expect(error).toBeInstanceOf(Smtp2goAPIError);
		const apiError = error as Smtp2goAPIError;
		const rendered = `${apiError.message}\n${inspect(apiError)}\n${JSON.stringify(apiError)}`;
		expect(rendered).not.toContain(API_KEY);
		expect(apiError).not.toHaveProperty('body');
		expect(apiError).not.toHaveProperty('cause');
	});

	it('marks auth failures by text for 403 and by status for 401', async () => {
		const text403 = new Smtp2goAPIError(
			"SMTP2GO 403: The 'api_key' parameter was not found",
			{ status: 403 },
		);
		const text400 = new Smtp2goAPIError(
			"SMTP2GO 400: An API User matching the passed 'api_key' was not found",
			{ status: 400 },
		);
		const validation400 = new Smtp2goAPIError(
			'SMTP2GO 400 E_ApiResponseCodes.NON_VALIDATING_IN_PAYLOAD: field to is missing',
			{ status: 400, code: 'E_ApiResponseCodes.NON_VALIDATING_IN_PAYLOAD' },
		);
		const status401 = new Smtp2goAPIError('SMTP2GO 401: denied', {
			status: 401,
		});

		expect(text403.isAuthError).toBe(true);
		expect(text400.isAuthError).toBe(true);
		expect(status401.isAuthError).toBe(true);
		expect(validation400.isAuthError).toBe(false);
	});

	it('marks rate limits and keeps a Retry-After value', () => {
		const limited = new Smtp2goAPIError('SMTP2GO 429: slow down', {
			status: 429,
			retryAfter: 90_000,
		});
		expect(limited.isRateLimit).toBe(true);
		expect(limited.retryAfter).toBe(90_000);

		const notLimited = new Smtp2goAPIError('SMTP2GO 400: bad', {
			status: 400,
		});
		expect(notLimited.isRateLimit).toBe(false);
	});

	it('flags transport failures and carries their replayability', () => {
		const readFailure = new Smtp2goAPIError('fetch failed', {
			transport: true,
			replayable: true,
		});
		const writeFailure = new Smtp2goAPIError('fetch failed', {
			transport: true,
			replayable: false,
		});
		expect(readFailure.transport).toBe(true);
		expect(readFailure.replayable).toBe(true);
		expect(writeFailure.replayable).toBe(false);
	});
});

describe('readEnvelopeError', () => {
	it('reads the wrapped data.error shape', () => {
		expect(readEnvelopeError(missingKeyError)).toEqual({
			message: expect.stringContaining('api_key'),
			code: 'E_ApiResponseCodes.INVALID_IN_PAYLOAD',
		});
	});

	it('reads the bare error shape without data', () => {
		expect(
			readEnvelopeError({ error: 'Bare failure', error_code: 'X' }),
		).toEqual({ message: 'Bare failure', code: 'X' });
	});

	it('returns undefined for a success body', () => {
		expect(readEnvelopeError(statsCycleOk)).toBeUndefined();
	});
});
