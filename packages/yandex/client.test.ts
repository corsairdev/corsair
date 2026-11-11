import { ApiError } from 'corsair/http';
import {
	authHeader,
	describeYandexError,
	folderHeader,
	isYandexFailure,
	makeYandexRequest,
	YANDEX_AUTH_SCHEME,
	YANDEX_TRANSLATE_BASE,
	YandexAPIError,
} from './client';
import {
	badArgument,
	invalidToken,
	missingKey,
	permissionDenied,
	resourceExhausted,
	unknownKey,
} from './test-fixtures';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	respond,
} from './test-support';

describe('makeYandexRequest', () => {
	const fetchMock = installFetchMock();

	it('sends the key as Api-Key against the translate host', async () => {
		respond(fetchMock, { translations: [] });

		await makeYandexRequest(API_KEY, {
			method: 'POST',
			path: '/translate/v2/translate',
			body: { texts: ['hi'], targetLanguageCode: 'ru' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://translate.api.cloud.yandex.net');
		expect(sent.path).toBe('/translate/v2/translate');
		expect(sent.method).toBe('POST');
		expect(sent.headers['authorization']).toBe(`Api-Key ${API_KEY}`);
		expect(sent.body).toEqual({ texts: ['hi'], targetLanguageCode: 'ru' });
	});

	it('sends the folder header only when a folder is given', async () => {
		respond(fetchMock, { translations: [] });

		await makeYandexRequest(
			API_KEY,
			{ method: 'POST', path: '/translate/v2/translate', body: {} },
			'b1gabcdef',
		);

		expect(lastRequest(fetchMock).headers['x-folder-id']).toBe('b1gabcdef');
	});

	it('omits the folder header when none is given', async () => {
		respond(fetchMock, { translations: [] });

		await makeYandexRequest(API_KEY, {
			method: 'POST',
			path: '/translate/v2/languages',
			body: {},
		});

		expect(lastRequest(fetchMock).headers['x-folder-id']).toBeUndefined();
	});

	it('throws a YandexAPIError carrying the gRPC code and request id', async () => {
		respond(fetchMock, unknownKey, 401);

		const error = (await makeYandexRequest(API_KEY, {
			method: 'POST',
			path: '/translate/v2/translate',
			body: {},
		}).catch((thrown: unknown) => thrown)) as YandexAPIError;

		expect(error).toBeInstanceOf(YandexAPIError);
		expect(error.status).toBe(401);
		// The code is a gRPC status, not an HTTP one.
		expect(error.grpcCode).toBe(16);
		expect(error.requestId).toBe('c924952c-b657-4746-a75f-7bcb7ce82000');
		expect(error.message).toContain('Yandex grpc 16:');
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeYandexRequest(API_KEY, {
			method: 'POST',
			path: '/translate/v2/translate',
		}).catch((thrown: unknown) => thrown)) as YandexAPIError;

		expect(error.message).toBe('fetch failed');
	});
});

describe('authHeader', () => {
	it('prefixes a bare key with Api-Key', () => {
		expect(authHeader('abc123')).toBe('Api-Key abc123');
	});

	it('keeps a key that already names its scheme', () => {
		// An IAM token is passed as `Bearer`, which the caller writes itself.
		expect(authHeader('Bearer t1.9euel')).toBe('Bearer t1.9euel');
		expect(authHeader('Api-Key abc')).toBe('Api-Key abc');
	});

	it('recognises the scheme case-insensitively', () => {
		expect(authHeader('bearer token')).toBe('bearer token');
	});

	it('trims surrounding whitespace', () => {
		expect(authHeader('  abc  ')).toBe('Api-Key abc');
	});
});

describe('folderHeader', () => {
	it('builds the header when a folder is given', () => {
		expect(folderHeader('b1g')).toEqual({ 'x-folder-id': 'b1g' });
	});

	it('is empty when there is no folder', () => {
		expect(folderHeader(undefined)).toEqual({});
	});
});

describe('YandexAPIError', () => {
	it('treats gRPC 16 as an auth error, whatever the HTTP status', () => {
		// The HTTP status is often 400 even for an auth failure, so the gRPC code
		// is what decides.
		const error = new YandexAPIError('x', { status: 400, body: unknownKey });
		expect(error.isAuthError).toBe(true);
	});

	it('treats a bare 401 as an auth error', () => {
		expect(new YandexAPIError('x', { status: 401 }).isAuthError).toBe(true);
	});

	it.each([
		['an unknown key', unknownKey],
		['a missing key', missingKey],
		['a bad IAM token', invalidToken],
	])('treats %s as an auth error', (_label, body) => {
		expect(new YandexAPIError('x', { body }).isAuthError).toBe(true);
	});

	it('treats gRPC 3 as a validation error', () => {
		const error = new YandexAPIError('x', { body: badArgument });
		expect(error.isValidationError).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('treats gRPC 7 as neither auth nor validation', () => {
		const error = new YandexAPIError('x', { body: permissionDenied });
		expect(error.isAuthError).toBe(false);
		expect(error.isValidationError).toBe(false);
	});

	it('treats gRPC 8 and an HTTP 429 as resource exhaustion', () => {
		expect(
			new YandexAPIError('x', { body: resourceExhausted }).isResourceExhausted,
		).toBe(true);
		expect(new YandexAPIError('x', { status: 429 }).isResourceExhausted).toBe(
			true,
		);
	});

	it('reads the fields from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'POST', url: '/translate/v2/translate' },
			{
				url: 'https://translate.api.cloud.yandex.net/translate/v2/translate',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: unknownKey,
			},
			'Unauthorized',
		);
		const error = new YandexAPIError('wrapped', { cause });
		expect(error.status).toBe(401);
		expect(error.grpcCode).toBe(16);
	});
});

describe('describeYandexError', () => {
	it('labels the gRPC code, not the HTTP status', () => {
		expect(describeYandexError(401, unknownKey, 'fallback')).toBe(
			"Yandex grpc 16: Unknown api key '****'",
		);
	});

	it('falls back to the status when there is no gRPC code', () => {
		expect(describeYandexError(502, '<html>bad</html>', 'Bad gateway')).toBe(
			'Yandex 502: Bad gateway',
		);
	});

	it('drops the label when there is neither', () => {
		expect(describeYandexError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('the exported constants', () => {
	it('uses Api-Key as the scheme', () => {
		expect(YANDEX_AUTH_SCHEME).toBe('Api-Key');
	});

	it('is the documented translate host', () => {
		expect(YANDEX_TRANSLATE_BASE).toBe(
			'https://translate.api.cloud.yandex.net',
		);
	});
});

describe('isYandexFailure', () => {
	it('narrows a thrown error', () => {
		expect(isYandexFailure(new YandexAPIError('x'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isYandexFailure(new Error('other'))).toBe(false);
		expect(isYandexFailure(null)).toBe(false);
	});
});
