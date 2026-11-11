import { ApiError } from 'corsair/http';
import {
	basicAuthHeader,
	describeWorksnapsError,
	isWorksnapsFailure,
	makeWorksnapsRequest,
	segment,
	WORKSNAPS_BASE,
	WorksnapsAPIError,
} from './client';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	respondText,
} from './test-support';

describe('makeWorksnapsRequest', () => {
	const fetchMock = installFetchMock();

	it('sends the token as a basic-auth username against /api', async () => {
		respondText(fetchMock, '<projects type="array"></projects>');

		await makeWorksnapsRequest(API_KEY, {
			method: 'GET',
			path: '/projects.xml',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://api.worksnaps.com');
		expect(sent.path).toBe('/api/projects.xml');
		expect(sent.headers['accept']).toBe('application/xml');
		// Basic auth, with the token as the username and an empty password.
		expect(sent.headers['authorization']).toBe(basicAuthHeader(API_KEY));
	});

	it('sends an XML body with the XML content type', async () => {
		respondText(fetchMock, '<project><id>1</id></project>');

		await makeWorksnapsRequest(API_KEY, {
			method: 'POST',
			path: '/projects.xml',
			body: '<project><name>Acme</name></project>',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.headers['content-type']).toContain('application/xml');
		expect(sent.rawBody).toBe('<project><name>Acme</name></project>');
	});

	it('keeps a path segment encoded', () => {
		expect(segment('a/b')).toBe('a%2Fb');
		expect(segment(3456)).toBe('3456');
	});

	it('throws a WorksnapsAPIError from a bare 401, which has no body', async () => {
		// The API sends no error body at all, so the status is the whole
		// diagnosis and the message is the fallback.
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));

		const error = (await makeWorksnapsRequest(API_KEY, {
			method: 'GET',
			path: '/projects.xml',
			// unknown: a promise can reject with any value; the cast narrows it to the
			// plugin's error type for the assertions.
		}).catch((thrown: unknown) => thrown)) as WorksnapsAPIError;

		expect(error).toBeInstanceOf(WorksnapsAPIError);
		expect(error.status).toBe(401);
		expect(error.isAuthError).toBe(true);
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeWorksnapsRequest(API_KEY, {
			method: 'GET',
			path: '/me.xml',
			// unknown: a promise can reject with any value; the cast narrows it to the
			// plugin's error type for the assertions.
		}).catch((thrown: unknown) => thrown)) as WorksnapsAPIError;

		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('GET');
	});
});

describe('basicAuthHeader', () => {
	it('encodes the token with an empty password', () => {
		// The password is ignored by the API, but Basic auth needs the colon.
		expect(basicAuthHeader('abc123')).toBe(
			`Basic ${Buffer.from('abc123:').toString('base64')}`,
		);
	});

	it('decodes back to `token:`', () => {
		const header = basicAuthHeader('tok');
		const encoded = header.slice('Basic '.length);
		expect(Buffer.from(encoded, 'base64').toString('utf8')).toBe('tok:');
	});
});

describe('WorksnapsAPIError', () => {
	it('treats 401 as an auth error', () => {
		expect(new WorksnapsAPIError('x', { status: 401 }).isAuthError).toBe(true);
	});

	it('treats 403 as a partner-token problem, not a bad key', () => {
		const error = new WorksnapsAPIError('x', { status: 403 });
		// The docs' privileged calls need the partner token.
		expect(error.isPartnerOnly).toBe(true);
		expect(error.isAuthError).toBe(true);
	});

	it('is not partner-only for a 401', () => {
		expect(new WorksnapsAPIError('x', { status: 401 }).isPartnerOnly).toBe(
			false,
		);
	});

	it('treats 404 as not found', () => {
		expect(new WorksnapsAPIError('x', { status: 404 }).isNotFound).toBe(true);
	});

	it('carries the operation that failed', () => {
		const error = new WorksnapsAPIError('x', { operation: 'projects.list' });
		expect(error.operation).toBe('projects.list');
	});

	it('reads the status from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/api/projects.xml' },
			{
				url: 'https://api.worksnaps.com/api/projects.xml',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: '',
			},
			'Unauthorized',
		);
		const error = new WorksnapsAPIError('wrapped', { cause });
		expect(error.status).toBe(401);
	});
});

describe('describeWorksnapsError', () => {
	it('labels the status with the fallback, since there is no body', () => {
		expect(describeWorksnapsError(401, '', 'Unauthorized')).toBe(
			'Worksnaps 401: Unauthorized',
		);
	});

	it('uses a body when a proxy supplies one', () => {
		expect(describeWorksnapsError(502, 'bad gateway', 'fallback')).toBe(
			'Worksnaps 502: bad gateway',
		);
	});

	it('drops the label when there is no status', () => {
		expect(describeWorksnapsError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('the exported base', () => {
	it('is the documented /api entry point', () => {
		expect(WORKSNAPS_BASE).toBe('https://api.worksnaps.com/api');
	});
});

describe('isWorksnapsFailure', () => {
	it('narrows a thrown error', () => {
		expect(isWorksnapsFailure(new WorksnapsAPIError('x'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isWorksnapsFailure(new Error('other'))).toBe(false);
		expect(isWorksnapsFailure(null)).toBe(false);
	});
});
