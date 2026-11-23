import {
	describeMoceanError,
	MOCEAN_RESP_FORMAT,
	MoceanAPIError,
	makeMoceanRequest,
	moceanForm,
} from './client';
import {
	authFailedBody,
	authFailedXml,
	maintenanceBody,
	throttledBody,
	verifyAuthFailedBody,
} from './test-fixtures';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or plain text.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	const payload = typeof body === 'string' ? body : JSON.stringify(body);
	fetchMock.mockResolvedValueOnce(
		new Response(payload, {
			status,
			headers: { 'Content-Type': contentType },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

// unknown: a promise can reject with any value, so the rejection reason has
// no static type; each assertion narrows it with toMatchObject.
async function captureError<T>(promise: Promise<T>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}

describe('moceanForm', () => {
	it('drops undefined fields and always sets the response format', () => {
		expect(
			moceanForm({
				'mocean-from': 'MOC',
				'mocean-to': '60123456789',
				'mocean-udh': undefined,
			}),
		).toBe(
			`mocean-from=MOC&mocean-to=60123456789&mocean-resp-format=${MOCEAN_RESP_FORMAT}`,
		);
	});
});

describe('makeMoceanRequest', () => {
	it('sends the token as a Bearer header on the rest host', async () => {
		respond(balance());

		await makeMoceanRequest('token-123', {
			family: 'query',
			method: 'GET',
			path: '/account/balance',
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://rest.moceanapi.com/rest/2/account/balance');
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Bearer token-123',
		);
	});

	it('throws with the body status when a 2xx body says error', async () => {
		respond(authFailedBody);

		const error = await captureError(
			makeMoceanRequest('token-123', {
				family: 'sms',
				method: 'GET',
				path: '/account/balance',
				replayable: true,
			}),
		);

		expect(error).toBeInstanceOf(MoceanAPIError);
		expect(error).toMatchObject({
			bodyStatus: 1,
			family: 'sms',
			replayable: true,
		});
		expect((error as MoceanAPIError).message).toContain('Authorization failed');
	});

	it('wraps an ApiError 401 and keeps its XML body', async () => {
		respond(authFailedXml, 401, 'text/xml');

		const error = await captureError(
			makeMoceanRequest('token-123', {
				family: 'query',
				method: 'GET',
				path: '/account/balance',
			}),
		);

		expect(error).toBeInstanceOf(MoceanAPIError);
		// The XML body is kept as text: no numeric bodyStatus is derived from
		// it, and the 401 alone marks it as an auth error.
		expect(error).toMatchObject({ status: 401, bodyStatus: undefined });
		expect((error as MoceanAPIError).isAuthError).toBe(true);
		// The XML err_msg is URL-decoded into the message.
		expect((error as MoceanAPIError).message).toContain('Authorization failed');
	});

	it('never prints the token in the error message or JSON', async () => {
		respond(authFailedXml, 401, 'text/xml');

		const error = await captureError(
			makeMoceanRequest('secret-token', {
				family: 'query',
				method: 'GET',
				path: '/account/balance',
			}),
		);

		const printed = `${(error as Error).message} ${JSON.stringify(error)}`;
		expect(printed).not.toContain('secret-token');
	});

	it('wraps a transport failure with the replay flag', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await captureError(
			makeMoceanRequest('token-123', {
				family: 'query',
				method: 'GET',
				path: '/account/balance',
				replayable: true,
			}),
		);

		expect(error).toBeInstanceOf(MoceanAPIError);
		expect(error).toMatchObject({ replayable: true });
		expect((error as MoceanAPIError).status).toBeUndefined();
	});
});

describe('MoceanAPIError predicates', () => {
	it('reads auth per family: 1 on sms, 2 on verify', () => {
		const sms = new MoceanAPIError('auth', {
			bodyStatus: 1,
			family: 'sms',
		});
		const verify = new MoceanAPIError('auth', {
			bodyStatus: 2,
			family: 'verify',
		});
		const plainStatus = new MoceanAPIError('unauthorized', { status: 401 });
		expect(sms.isAuthError).toBe(true);
		expect(verify.isAuthError).toBe(true);
		expect(plainStatus.isAuthError).toBe(true);
	});

	it('does not call a verify throttling code an auth error on sms', () => {
		const sms = new MoceanAPIError('x', { bodyStatus: 1, family: 'sms' });
		expect(sms.isThrottled).toBe(false);
		const verify = new MoceanAPIError('x', { bodyStatus: 1, family: 'verify' });
		expect(verify.isThrottled).toBe(true);
	});

	it('reads balance per family: 2 on sms, 18 on verify', () => {
		const sms = new MoceanAPIError('x', { bodyStatus: 2, family: 'sms' });
		const verify = new MoceanAPIError('x', {
			bodyStatus: 18,
			family: 'verify',
		});
		const wrong = new MoceanAPIError('x', { bodyStatus: 2, family: 'verify' });
		expect(sms.isBalanceError).toBe(true);
		expect(verify.isBalanceError).toBe(true);
		expect(wrong.isBalanceError).toBe(false);
	});

	it('recognises the documented try-again statuses per family', () => {
		const maintenance = new MoceanAPIError('x', {
			bodyStatus: 40,
			family: 'sms',
		});
		const verifySystem = new MoceanAPIError('x', {
			bodyStatus: 21,
			family: 'verify',
		});
		const smsSystem = new MoceanAPIError('x', {
			bodyStatus: 21,
			family: 'sms',
		});
		expect(maintenance.isRetryableServerSide).toBe(true);
		expect(verifySystem.isRetryableServerSide).toBe(true);
		expect(smsSystem.isRetryableServerSide).toBe(false);
	});
});

describe('describeMoceanError', () => {
	it('uses err_msg from a JSON body', () => {
		expect(describeMoceanError(undefined, authFailedBody, 'fallback')).toBe(
			'Mocean: Authorization failed',
		);
	});

	it('URL-decodes err_msg out of the XML 401 body', () => {
		expect(describeMoceanError(401, authFailedXml, 'fallback')).toBe(
			'Mocean 401: Authorization failed',
		);
	});

	it('falls back when nothing is readable', () => {
		expect(describeMoceanError(500, { unexpected: true }, 'boom')).toBe(
			'Mocean 500: boom',
		);
	});
});

describe('family tables drive the handler inputs', () => {
	it('keeps a verify auth failure distinct from a sms one', () => {
		const verify = new MoceanAPIError('x', {
			body: verifyAuthFailedBody,
			bodyStatus: 2,
			family: 'verify',
		});
		const sms = new MoceanAPIError('x', {
			body: throttledBody,
			bodyStatus: 32,
			family: 'sms',
		});
		const maintenance = new MoceanAPIError('x', {
			body: maintenanceBody,
			bodyStatus: 40,
			family: 'query',
		});
		expect(verify.isAuthError).toBe(true);
		expect(sms.isThrottled).toBe(true);
		expect(maintenance.isRetryableServerSide).toBe(true);
	});
});

function balance() {
	return { status: 0, value: 100 };
}
