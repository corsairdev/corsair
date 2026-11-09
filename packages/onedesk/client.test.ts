import {
	envelopeCode,
	makeOnedeskRequest,
	OnedeskAPIError,
	OnedeskTransportError,
	resolveBase,
	throwIfEnvelopeFailed,
} from './client';
import {
	createdRecord,
	itemResult,
	pagedIds,
	securityAccessError,
	serviceUnavailableError,
	updateCodeString,
} from './test-fixtures';

const API_KEY = 'od-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
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
async function failure(promise: Promise<unknown>): Promise<OnedeskAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(OnedeskAPIError);
	if (!(error instanceof OnedeskAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeOnedeskRequest', () => {
	it('sends the key in OD-Public-API-Key under /rest/public', async () => {
		respond(pagedIds, 200);

		const result = await makeOnedeskRequest(API_KEY, {
			method: 'POST',
			path: '/items/filter',
			body: { itemType: 'Ticket' },
		});

		expect(result).toEqual(pagedIds);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://app.onedesk.com/rest/public/items/filter');
		const headers = new Headers(init.headers);
		expect(headers.get('od-public-api-key')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('content-type')).toContain('application/json');
	});

	it('sends a GET with no body', async () => {
		respond(itemResult, 200);

		await makeOnedeskRequest(API_KEY, {
			method: 'GET',
			path: '/items/externalId/abc',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.method).toBe('GET');
		expect(init.body).toBeUndefined();
	});

	it('sends a multipart upload without a JSON body', async () => {
		respond(createdRecord, 200);

		await makeOnedeskRequest(API_KEY, {
			method: 'POST',
			path: '/attachments/',
			formData: {
				file: new Blob(['hello'], { type: 'text/plain' }),
				fileName: 'note.txt',
			},
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://app.onedesk.com/rest/public/attachments/');
		// With a FormData body the content type is left unset on purpose: the
		// runtime adds the multipart boundary, which a manual value would break.
		const headers = new Headers(init.headers);
		expect(headers.get('content-type')).toBeNull();
		expect(init.body).toBeInstanceOf(FormData);
	});

	it('throws on a 200 envelope that says ERROR_SECURITY_ACCESS', async () => {
		respond(securityAccessError, 200);

		const error = await failure(
			makeOnedeskRequest(API_KEY, {
				method: 'POST',
				path: '/items/filter',
				body: { itemType: 'Ticket' },
			}),
		);

		// The HTTP status is 200, so the status alone would read as success.
		expect(error.status).toBe(200);
		expect(error.code).toBe('ERROR_SECURITY_ACCESS');
		expect(error.isPermissionFailure).toBe(true);
		expect(error.message).toContain('ERROR_SECURITY_ACCESS');
	});

	it('marks ERROR_SERVICE_UNAVAILABLE as transient', async () => {
		respond(serviceUnavailableError, 200);

		const error = await failure(
			makeOnedeskRequest(API_KEY, {
				method: 'POST',
				path: '/items/filter',
				body: { itemType: 'Ticket' },
			}),
		);

		expect(error.isTransient).toBe(true);
	});

	it('accepts a bare code string on an update', async () => {
		respond(updateCodeString, 200);

		const result = await makeOnedeskRequest(API_KEY, {
			method: 'POST',
			path: '/items/externalId/abc',
			body: { name: 'Renamed' },
		});

		expect(result).toBe('SUCCESS');
	});

	it('turns an empty 401 body into a message a caller can act on', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(null, { status: 401, statusText: 'Unauthorized' }),
		);

		const error = await failure(
			makeOnedeskRequest(API_KEY, {
				method: 'GET',
				path: '/organization/itemTypes',
			}),
		);

		expect(error.status).toBe(401);
		expect(error.isAuthFailure).toBe(true);
		expect(error.message).toContain('rejected the API key');
	});

	it('records Retry-After on a 429', async () => {
		respond({ message: 'Rate limit reached' }, 429, { 'Retry-After': '5' });

		const error = await failure(
			makeOnedeskRequest(API_KEY, {
				method: 'POST',
				path: '/items/filter',
				body: { itemType: 'Ticket' },
			}),
		);

		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(5000);
	});

	it('separates a transport failure from a provider error', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeOnedeskRequest(API_KEY, { method: 'GET', path: '/teams/filter' }),
		);

		// Nothing reached OneDesk, so this is replayable for a read.
		expect(error).toBeInstanceOf(OnedeskTransportError);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
	});

	it('marks timer cancellation as destructive so it is never replayed', async () => {
		respond({ message: 'boom' }, 500);

		const error = await failure(
			makeOnedeskRequest(API_KEY, {
				method: 'GET',
				path: '/timers/cancel/tm-1',
			}),
		);

		expect(error.isDestructive).toBe(true);
	});

	it('keeps the key out of the message and out of inspect output', async () => {
		respond({ message: 'Invalid key' }, 401);

		const error = await failure(
			makeOnedeskRequest(API_KEY, { method: 'GET', path: '/items/id/1' }),
		);

		expect(error.message).not.toContain(API_KEY);
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
		expect(error.cause).toBeUndefined();
	});
});

describe('resolveBase', () => {
	it('defaults to the hosted app', () => {
		expect(resolveBase(undefined)).toBe('https://app.onedesk.com');
	});

	it('accepts a white-label origin', () => {
		expect(resolveBase('https://acme.onedesk.example')).toBe(
			'https://acme.onedesk.example',
		);
	});

	it('rejects a value that would send the key somewhere unintended', () => {
		expect(() => resolveBase('acme.onedesk.com')).toThrow(/not a URL/);
		expect(() => resolveBase('ftp://acme.example')).toThrow(/http or https/);
		expect(() => resolveBase('https://user:pw@acme.example')).toThrow(
			/credentials/,
		);
	});
});

describe('envelopeCode', () => {
	it('reads the code from an object envelope', () => {
		expect(envelopeCode(pagedIds)).toBe('SUCCESS');
	});

	it('reads a bare string code', () => {
		expect(envelopeCode('SUCCESS')).toBe('SUCCESS');
	});

	it('returns undefined when there is no code', () => {
		expect(envelopeCode({})).toBeUndefined();
		expect(envelopeCode(null)).toBeUndefined();
		expect(envelopeCode(42)).toBeUndefined();
	});

	it('passes SUCCESS and non-ERROR codes through', () => {
		expect(() =>
			throwIfEnvelopeFailed({ code: 'SUCCESS' }, { method: 'POST' }),
		).not.toThrow();
		expect(() => throwIfEnvelopeFailed({}, { method: 'POST' })).not.toThrow();
	});

	it('throws on every documented ERROR_ code', () => {
		for (const code of [
			'ERROR_INVALID_ID',
			'ERROR_CANNOT_FIND_ITEM',
			'ERROR_USER_ALREADY_EXIST',
			'ERROR_SERVICE_UNAVAILABLE',
		]) {
			expect(() => throwIfEnvelopeFailed({ code }, { method: 'POST' })).toThrow(
				code,
			);
		}
	});

	it('leaves INTERNAL_ERROR alone rather than guessing it is a failure', () => {
		// INTERNAL_ERROR does not carry the ERROR_ prefix the success check
		// keys on, so it is passed through; a caller sees the code in the body.
		expect(() =>
			throwIfEnvelopeFailed({ code: 'INTERNAL_ERROR' }, { method: 'POST' }),
		).not.toThrow();
	});
});
