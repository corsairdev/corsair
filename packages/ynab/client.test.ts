import { ApiError } from 'corsair/http';
import {
	describeYnabError,
	isYnabFailure,
	makeYnabRequest,
	segment,
	YNAB_API_BASE,
	YNAB_DATE_PATTERN,
	YnabAPIError,
} from './client';
import {
	badRequest,
	notFound,
	rateLimited,
	subscriptionLapsed,
	unauthorized,
} from './test-fixtures';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	respond,
} from './test-support';

describe('makeYnabRequest', () => {
	const fetchMock = installFetchMock();

	it('sends the token as a bearer against v1', async () => {
		respond(fetchMock, { data: {} });

		await makeYnabRequest(API_KEY, { method: 'GET', path: '/budgets' });

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://api.ynab.com');
		expect(sent.path).toBe('/v1/budgets');
		expect(sent.headers['authorization']).toBe(`Bearer ${API_KEY}`);
	});

	it('serializes a POST body as JSON', async () => {
		respond(fetchMock, { data: {} });

		await makeYnabRequest(API_KEY, {
			method: 'POST',
			path: '/budgets/b1/transactions',
			body: { transactions: [{ amount: -1000 }] },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.headers['content-type']).toContain('application/json');
		expect(sent.body).toEqual({ transactions: [{ amount: -1000 }] });
	});

	it('keeps a path segment encoded', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});

	it('throws a YnabAPIError carrying the name and detail', async () => {
		respond(fetchMock, unauthorized, 401);

		const error = (await makeYnabRequest(API_KEY, {
			method: 'GET',
			path: '/budgets',
		}).catch((thrown: unknown) => thrown)) as YnabAPIError;

		expect(error).toBeInstanceOf(YnabAPIError);
		expect(error.status).toBe(401);
		expect(error.code).toBe('unauthorized');
		expect(error.message).toBe('YNAB 401 unauthorized: Unauthorized');
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeYnabRequest(API_KEY, {
			method: 'POST',
			path: '/budgets/b1/transactions',
		}).catch((thrown: unknown) => thrown)) as YnabAPIError;

		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('POST');
	});
});

describe('YnabAPIError', () => {
	it('treats 401 as an auth error', () => {
		expect(new YnabAPIError('x', { status: 401 }).isAuthError).toBe(true);
	});

	it('treats the unauthorized name as an auth error without a status', () => {
		const error = new YnabAPIError('x', { body: unauthorized });
		expect(error.isAuthError).toBe(true);
		expect(error.code).toBe('unauthorized');
	});

	it('treats a 403 as a lapsed subscription, not a bad key', () => {
		const error = new YnabAPIError('x', {
			status: 403,
			body: subscriptionLapsed,
		});
		// A 403 means the account is read-only until it is renewed.
		expect(error.isSubscriptionLapsed).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('treats 404 and resource_not_found as not found', () => {
		expect(new YnabAPIError('x', { status: 404 }).isNotFound).toBe(true);
		expect(new YnabAPIError('x', { body: notFound }).isNotFound).toBe(true);
	});

	it('reads the fields from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/v1/budgets/b1' },
			{
				url: 'https://api.ynab.com/v1/budgets/b1',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: notFound,
			},
			'Not Found',
		);
		const error = new YnabAPIError('wrapped', { cause });
		expect(error.status).toBe(404);
		expect(error.code).toBe('resource_not_found');
	});
});

describe('describeYnabError', () => {
	it('prefers the detail and labels the status and name', () => {
		expect(describeYnabError(404, notFound, 'fallback')).toBe(
			'YNAB 404 resource_not_found: Resource not found',
		);
	});

	it('falls back when the body is not an error shape', () => {
		expect(describeYnabError(502, '<html>bad</html>', 'Bad gateway')).toBe(
			'YNAB 502: Bad gateway',
		);
	});

	it('drops the label when there is no status', () => {
		expect(describeYnabError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('the date pattern', () => {
	it('accepts the documented yyyy-MM-dd form', () => {
		expect(YNAB_DATE_PATTERN.test('2024-06-01')).toBe(true);
		expect(YNAB_DATE_PATTERN.test('2024-12-31')).toBe(true);
	});

	it('rejects a full timestamp, which YNAB does not use', () => {
		expect(YNAB_DATE_PATTERN.test('2024-06-01T09:00:00Z')).toBe(false);
		expect(YNAB_DATE_PATTERN.test('06/01/2024')).toBe(false);
	});
});

describe('the exported base', () => {
	it('is the documented v1 base', () => {
		expect(YNAB_API_BASE).toBe('https://api.ynab.com/v1');
	});
});

describe('isYnabFailure', () => {
	it('narrows a thrown error', () => {
		expect(isYnabFailure(new YnabAPIError('x'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isYnabFailure(new Error('other'))).toBe(false);
		expect(isYnabFailure(null)).toBe(false);
	});
});

describe('the error bodies', () => {
	it('keeps the detail for a bad request', () => {
		expect(describeYnabError(400, badRequest, 'fallback')).toContain(
			'could not be understood',
		);
	});

	it('keeps the detail for a rate limit', () => {
		expect(describeYnabError(429, rateLimited, 'fallback')).toContain(
			'Too many requests',
		);
	});
});
