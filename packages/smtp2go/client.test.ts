import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	isReplayablePath,
	isSmtp2goAuthError,
	readEnvelopeError,
	SMTP2GO_API_BASE,
	SMTP2GO_REGION_HOSTS,
	Smtp2goTransportError,
	smtp2goErrorCode,
} from './client';
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

function apiError(status: number, message: string, code?: string): ApiError {
	return new ApiError(
		{ method: 'POST', url: '/stats/email_cycle' },
		{
			url: `${SMTP2GO_API_BASE}/stats/email_cycle`,
			ok: false,
			status,
			statusText: 'x',
			body: { data: { error: message, error_code: code } },
		},
		`SMTP2GO ${status}: ${message}`,
	);
}

describe('error parsing', () => {
	it('maps a 400 envelope onto core ApiError with status and code', async () => {
		mockFetch(errorResponse(400, unknownKeyError));

		const error = await captureError(endpoints.stats.cycle(makeCtx(), {}));

		expect(error).toBeInstanceOf(ApiError);
		const apiErr = error as ApiError;
		expect(apiErr.status).toBe(400);
		expect(smtp2goErrorCode(apiErr)).toBe('E_ApiResponseCodes.API_EXCEPTION');
		expect(apiErr.message).toContain('API User');
		expect(apiErr.request.url).toBe('/stats/email_cycle');
	});

	it('never carries the key or the request body in message, inspect or JSON output', async () => {
		mockFetch(errorResponse(403, missingKeyError));

		const error = await captureError(
			endpoints.email.send(makeCtx(), {
				sender: 'a@example.com',
				to: ['secret-recipient@example.com'],
				text_body: 'hi',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		const apiErr = error as ApiError;
		const rendered = `${apiErr.message}\n${inspect(apiErr, { depth: 10 })}\n${JSON.stringify(apiErr)}`;
		expect(rendered).not.toContain(API_KEY);
		expect(rendered).not.toContain('secret-recipient@example.com');
		expect(apiErr.request.body).toBe('[REDACTED]');
		expect(apiErr.request.headers).toBeUndefined();
	});

	it('marks auth failures by text for 403/400 and by status for 401', () => {
		expect(
			isSmtp2goAuthError(
				apiError(403, "The 'api_key' parameter was not found"),
			),
		).toBe(true);
		expect(
			isSmtp2goAuthError(
				apiError(
					400,
					"An API User matching the passed 'api_key' was not found",
				),
			),
		).toBe(true);
		expect(isSmtp2goAuthError(apiError(401, 'denied'))).toBe(true);
		expect(
			isSmtp2goAuthError(
				apiError(
					400,
					'field to is missing',
					'E_ApiResponseCodes.NON_VALIDATING_IN_PAYLOAD',
				),
			),
		).toBe(false);
	});

	it('replays reads only, by route', () => {
		expect(isReplayablePath('/stats/email_cycle')).toBe(true);
		expect(isReplayablePath('/api_keys/view')).toBe(true);
		expect(isReplayablePath('/email/search')).toBe(true);
		expect(isReplayablePath('/sms/view-sent')).toBe(true);
		expect(isReplayablePath('/email/send')).toBe(false);
		expect(isReplayablePath('/suppression/remove')).toBe(false);
		expect(isReplayablePath('/sms/send')).toBe(false);
	});

	it('wraps transport failures with the method and route', async () => {
		(globalThis.fetch as unknown as jest.Mock).mockRejectedValueOnce(
			new TypeError('fetch failed'),
		);
		const error = await captureError(endpoints.stats.cycle(makeCtx(), {}));
		expect(error).toBeInstanceOf(Smtp2goTransportError);
		expect((error as Smtp2goTransportError).path).toBe('/stats/email_cycle');
	});

	it('redacts email addresses SMTP2GO echoes in an error', async () => {
		mockFetch(
			errorResponse(400, {
				request_id: 'r',
				data: { error: 'Recipient bob@example.com is suppressed' },
			}),
		);
		const error = await captureError(endpoints.stats.cycle(makeCtx(), {}));
		expect((error as Error).message).toContain('[email]');
		expect((error as Error).message).not.toContain('bob@example.com');
	});

	it('sends to a regional host when region is set', async () => {
		mockFetch(
			new Response(JSON.stringify(statsCycleOk), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await endpoints.stats.cycle(
			{ ...makeCtx(), options: { region: 'eu' } } as never,
			{},
		);
		expect(lastCall().url).toBe(`${SMTP2GO_REGION_HOSTS.eu}/stats/email_cycle`);
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
