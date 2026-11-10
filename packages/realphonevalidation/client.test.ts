import {
	assertNotRefused,
	describeRealPhoneValidationError,
	makeRealPhoneValidationRequest,
	REALPHONEVALIDATION_API_BASE,
	RealPhoneValidationAPIError,
	readServiceRefusal,
} from './client';
import {
	REFUSED_INVALID_PHONE,
	REFUSED_MISSING_TOKEN,
	REFUSED_NO_BALANCE,
	REFUSED_UNAUTHORIZED_CODE,
	REFUSED_UNAUTHORIZED_STATUS,
	THROTTLED,
	TURBO_V3_CONNECTED,
} from './test-fixtures';

const TOKEN = 'rpv-secret-test-token';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

function respond(
	// unknown: response bodies are arbitrary JSON or text.
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(
	promise: Promise<unknown>,
): Promise<RealPhoneValidationAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RealPhoneValidationAPIError);
	if (!(error instanceof RealPhoneValidationAPIError)) throw error;
	return error;
}

describe('RealPhoneValidation client', () => {
	it('points at the documented /rpvWebService host', () => {
		expect(REALPHONEVALIDATION_API_BASE).toBe(
			'https://api.realvalidation.com/rpvWebService',
		);
	});

	it('builds the script URL and sends the token', async () => {
		respond(TURBO_V3_CONNECTED, 200);

		await makeRealPhoneValidationRequest(TOKEN, 'TurboV3.php', {
			method: 'GET',
			query: { phone: '7275555555' },
			replayable: true,
		});

		const request = fetchMock.mock.calls[0][0] as string;
		const parsed = new URL(request);
		expect(parsed.pathname).toBe('/rpvWebService/TurboV3.php');
		expect(parsed.searchParams.get('token')).toBe(TOKEN);
		expect(parsed.searchParams.get('phone')).toBe('7275555555');
	});

	it('always asks for JSON, since omitting output returns XML', async () => {
		respond(TURBO_V3_CONNECTED, 200);

		await makeRealPhoneValidationRequest(TOKEN, 'TurboV3.php', {
			method: 'GET',
			query: { phone: '7275555555' },
			replayable: true,
		});

		expect(
			new URL(fetchMock.mock.calls[0][0] as string).searchParams.get('output'),
		).toBe('json');
	});

	it('lets the caller not override the JSON output', async () => {
		respond(TURBO_V3_CONNECTED, 200);

		await makeRealPhoneValidationRequest(TOKEN, 'TurboV3.php', {
			method: 'GET',
			// The service reads output=json, and an input cannot turn it back to XML.
			query: { phone: '7275555555', output: 'xml' },
			replayable: true,
		});

		expect(
			new URL(fetchMock.mock.calls[0][0] as string).searchParams.get('output'),
		).toBe('json');
	});

	it('reads a refusal that arrives inside a 200', async () => {
		respond(REFUSED_MISSING_TOKEN, 200);

		// unknown: the body is narrowed by assertNotRefused.
		const body = (await makeRealPhoneValidationRequest(TOKEN, 'Turbo.php', {
			method: 'GET',
			query: { phone: '7275555555' },
			replayable: true,
		})) as unknown;

		expect(readServiceRefusal(body).refused).toBe(true);
		expect(() =>
			assertNotRefused(body, 'Turbo.php', { method: 'GET', replayable: true }),
		).toThrow(RealPhoneValidationAPIError);
	});

	it('rejects a request after 403 with an empty body', async () => {
		respond(THROTTLED, 403);

		const error = await failure(
			makeRealPhoneValidationRequest(TOKEN, 'Turbo.php', {
				method: 'GET',
				query: { phone: '7275555555' },
				replayable: true,
			}),
		);

		expect(error.status).toBe(403);
		expect(error.isRateLimit).toBe(true);
		// Not an auth error: the documented 403 is the throttle.
		expect(error.isAuthError).toBe(false);
		expect(error.service).toBe('Turbo.php');
	});

	it('drops the cause of an HTTP error, which would retain the token', async () => {
		respond(THROTTLED, 403);

		const error = await failure(
			makeRealPhoneValidationRequest(TOKEN, 'Turbo.php', {
				method: 'GET',
				query: { phone: '7275555555' },
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});

	it('wraps a transport failure and keeps its cause', async () => {
		const cause = new Error('socket hang up');
		fetchMock.mockRejectedValueOnce(cause);

		const error = await failure(
			makeRealPhoneValidationRequest(TOKEN, 'TurboV3.php', {
				method: 'GET',
				query: { phone: '7275555555' },
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
		expect(error.isServerError).toBe(false);
	});

	it('treats a 5xx as a server error worth one retry', async () => {
		respond('<html>oops</html>', 500);

		const error = await failure(
			makeRealPhoneValidationRequest(TOKEN, 'TurboV3.php', {
				method: 'GET',
				query: { phone: '7275555555' },
				replayable: true,
			}),
		);

		expect(error.isServerError).toBe(true);
	});
});

describe('readServiceRefusal', () => {
	it('recognises ERROR with a missing token', () => {
		expect(readServiceRefusal(REFUSED_MISSING_TOKEN)).toMatchObject({
			refused: true,
			status: 'ERROR',
			detail: 'missing token',
		});
	});

	it('recognises unauthorized on the lowercase routes', () => {
		expect(readServiceRefusal(REFUSED_UNAUTHORIZED_STATUS)).toMatchObject({
			refused: true,
			status: 'unauthorized',
		});
	});

	it('recognises -1 on the uppercase routes', () => {
		expect(readServiceRefusal(REFUSED_UNAUTHORIZED_CODE)).toMatchObject({
			refused: true,
			status: '-1',
			detail: 'unauthorized',
		});
	});

	it('recognises an exhausted balance', () => {
		expect(readServiceRefusal(REFUSED_NO_BALANCE)).toMatchObject({
			refused: true,
			status: '102',
		});
	});

	it('recognises a malformed phone number', () => {
		expect(readServiceRefusal(REFUSED_INVALID_PHONE)).toMatchObject({
			refused: true,
			status: 'invalid phone',
		});
	});

	it('does not treat a connection status as a refusal', () => {
		expect(readServiceRefusal(TURBO_V3_CONNECTED).refused).toBe(false);
	});

	it('does not treat a disconnect as a refusal', () => {
		expect(readServiceRefusal({ status: 'disconnected' }).refused).toBe(false);
	});

	it('does not treat a DNC result as a refusal', () => {
		expect(readServiceRefusal({ RESPONSECODE: 'OK' }).refused).toBe(false);
	});

	it('does not treat a line-type answer as a refusal', () => {
		expect(readServiceRefusal({ RESPONSECODE: 'Landline' }).refused).toBe(
			false,
		);
		expect(readServiceRefusal({ RESPONSECODE: 'cell' }).refused).toBe(false);
	});

	it('returns not-refused for a body with no status', () => {
		expect(readServiceRefusal({}).refused).toBe(false);
		expect(readServiceRefusal(null).refused).toBe(false);
	});
});

describe('describeRealPhoneValidationError', () => {
	it('names the service status and the detail', () => {
		expect(
			describeRealPhoneValidationError(200, REFUSED_MISSING_TOKEN, 'x'),
		).toBe('RealPhoneValidation ERROR: missing token');
	});

	it('uses the status when there is no detail', () => {
		expect(
			describeRealPhoneValidationError(200, REFUSED_INVALID_PHONE, 'x'),
		).toBe('RealPhoneValidation invalid phone: invalid phone');
	});

	it('falls back to the HTTP status when the body has no status', () => {
		expect(describeRealPhoneValidationError(403, '', 'Forbidden')).toBe(
			'RealPhoneValidation 403: Forbidden',
		);
	});

	it('ignores the empty-object error_text', () => {
		// error_text is {} when there is nothing to report.
		expect(
			describeRealPhoneValidationError(
				500,
				{ status: 'ERROR', error_text: {} },
				'x',
			),
		).toBe('RealPhoneValidation ERROR: ERROR');
	});
});

describe('assertNotRefused', () => {
	it('throws for a body that is really a refusal', () => {
		expect(() =>
			assertNotRefused(REFUSED_UNAUTHORIZED_STATUS, 'Turbo.php', {
				method: 'GET',
				replayable: true,
			}),
		).toThrow(RealPhoneValidationAPIError);
	});

	it('marks an unrecognised token as an auth error', () => {
		// unknown: the thrown error is narrowed below.
		let thrown: unknown;
		try {
			assertNotRefused(REFUSED_UNAUTHORIZED_STATUS, 'Turbo.php', {
				method: 'GET',
				replayable: true,
			});
		} catch (error) {
			thrown = error;
		}

		expect(thrown).toBeInstanceOf(RealPhoneValidationAPIError);
		expect((thrown as RealPhoneValidationAPIError).isAuthError).toBe(true);
	});

	it('marks a missing token as an auth error', () => {
		// unknown: the thrown error is narrowed below.
		let thrown: unknown;
		try {
			assertNotRefused(REFUSED_MISSING_TOKEN, 'Turbo.php', {
				method: 'GET',
				replayable: true,
			});
		} catch (error) {
			thrown = error;
		}

		expect((thrown as RealPhoneValidationAPIError).isAuthError).toBe(true);
	});

	it('marks an exhausted balance as a quota error, not an auth error', () => {
		// unknown: the thrown error is narrowed below.
		let thrown: unknown;
		try {
			assertNotRefused(REFUSED_NO_BALANCE, 'DNCLookup.php', {
				method: 'GET',
				replayable: true,
			});
		} catch (error) {
			thrown = error;
		}

		const error = thrown as RealPhoneValidationAPIError;
		expect(error.isQuotaError).toBe(true);
		expect(error.isValidationError).toBe(false);
	});

	it('marks a bad phone number as a validation error', () => {
		// unknown: the thrown error is narrowed below.
		let thrown: unknown;
		try {
			assertNotRefused(REFUSED_INVALID_PHONE, 'Turbo.php', {
				method: 'GET',
				replayable: true,
			});
		} catch (error) {
			thrown = error;
		}

		expect((thrown as RealPhoneValidationAPIError).isValidationError).toBe(
			true,
		);
	});

	it('does nothing for a real result', () => {
		expect(() =>
			assertNotRefused(TURBO_V3_CONNECTED, 'TurboV3.php', {
				method: 'GET',
				replayable: true,
			}),
		).not.toThrow();
	});
});
