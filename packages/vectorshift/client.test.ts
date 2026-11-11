import { ApiError } from 'corsair/http';
import {
	describeVectorshiftError,
	isVectorshiftFailure,
	makeVectorshiftRequest,
	segment,
	VECTORSHIFT_API_BASE,
	VectorshiftAPIError,
} from './client';
import {
	badHeaderFormat,
	badRequest,
	invalidKey,
	missingHeader,
	rateLimited,
} from './test-fixtures';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	respond,
} from './test-support';

describe('makeVectorshiftRequest', () => {
	const fetchMock = installFetchMock();

	it('sends the key as a bearer token against v1', async () => {
		respond(fetchMock, { status: 'success' });

		await makeVectorshiftRequest(API_KEY, {
			method: 'GET',
			path: '/pipelines',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://api.vectorshift.ai');
		expect(sent.path).toBe('/v1/pipelines');
		expect(sent.headers['authorization']).toBe(`Bearer ${API_KEY}`);
		expect(sent.headers['accept']).toBe('application/json');
	});

	it('serializes a POST body as JSON', async () => {
		respond(fetchMock, { status: 'success' });

		await makeVectorshiftRequest(API_KEY, {
			method: 'POST',
			path: '/pipeline/abc/run',
			body: { inputs: { question: 'hi' } },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.headers['content-type']).toContain('application/json');
		expect(sent.body).toEqual({ inputs: { question: 'hi' } });
	});

	it('keeps a path segment encoded', () => {
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});

	it('throws a VectorshiftAPIError carrying the message', async () => {
		respond(fetchMock, invalidKey, 401);

		const error = (await makeVectorshiftRequest(API_KEY, {
			method: 'GET',
			path: '/pipelines',
			// unknown: a promise can reject with any value; the cast below narrows it to
			// the plugin's error type, which the assertions rely on.
		}).catch((thrown: unknown) => thrown)) as VectorshiftAPIError;

		expect(error).toBeInstanceOf(VectorshiftAPIError);
		expect(error.status).toBe(401);
		expect(error.message).toBe(
			'VectorShift 401: Invalid API key: failed to parse API key: invalid API key format',
		);
		expect(error.isAuthError).toBe(true);
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeVectorshiftRequest(API_KEY, {
			method: 'POST',
			path: '/pipeline/abc/run',
			// unknown: a promise can reject with any value; the cast below narrows it to
			// the plugin's error type, which the assertions rely on.
		}).catch((thrown: unknown) => thrown)) as VectorshiftAPIError;

		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('POST');
	});

	it('does not retry a 429 itself, leaving that to the handler', async () => {
		respond(fetchMock, rateLimited, 429);

		await expect(
			makeVectorshiftRequest(API_KEY, { method: 'GET', path: '/pipelines' }),
		).rejects.toBeInstanceOf(VectorshiftAPIError);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('VectorshiftAPIError', () => {
	it('treats 401 as an auth error', () => {
		expect(new VectorshiftAPIError('failed', { status: 401 }).isAuthError).toBe(
			true,
		);
	});

	it.each([missingHeader, badHeaderFormat, invalidKey])(
		'treats the documented message %# as an auth error',
		(body) => {
			const error = new VectorshiftAPIError('failed', { body });
			expect(error.isAuthError).toBe(true);
		},
	);

	it('is not an auth error for an unrelated failure', () => {
		const error = new VectorshiftAPIError('failed', { body: badRequest });
		expect(error.isAuthError).toBe(false);
		expect(error.status).toBeUndefined();
	});

	it.each([400, 422])('treats %i as a validation error', (status) => {
		expect(
			new VectorshiftAPIError('failed', { status }).isValidationError,
		).toBe(true);
	});

	it('is not a validation error for a 500', () => {
		expect(
			new VectorshiftAPIError('failed', { status: 500 }).isValidationError,
		).toBe(false);
	});

	it('reads the fields from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/pipelines' },
			{
				url: 'https://api.vectorshift.ai/v1/pipelines',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: badRequest,
			},
			'Bad Request',
		);
		const error = new VectorshiftAPIError('wrapped', { cause });
		expect(error.status).toBe(400);
		expect(error.method).toBe('GET');
	});
});

describe('describeVectorshiftError', () => {
	it('labels the status', () => {
		expect(describeVectorshiftError(400, badRequest, 'fallback')).toBe(
			'VectorShift 400: Pipeline not found',
		);
	});

	it('falls back when the body is not an error shape', () => {
		expect(
			describeVectorshiftError(502, '<html>bad</html>', 'Bad gateway'),
		).toBe('VectorShift 502: Bad gateway');
	});

	it('drops the label when there is no status', () => {
		expect(describeVectorshiftError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('the exported base', () => {
	it('is the documented v1 server', () => {
		expect(VECTORSHIFT_API_BASE).toBe('https://api.vectorshift.ai/v1');
	});
});

describe('isVectorshiftFailure', () => {
	it('narrows a thrown error', () => {
		expect(isVectorshiftFailure(new VectorshiftAPIError('failed'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isVectorshiftFailure(new Error('other'))).toBe(false);
		expect(isVectorshiftFailure('nope')).toBe(false);
	});
});
