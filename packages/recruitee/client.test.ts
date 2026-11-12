import {
	companyPath,
	describeRecruiteeError,
	makeRecruiteeRequest,
	RECRUITEE_API_BASE,
	RecruiteeAPIError,
} from './client';
import {
	LEGACY_UNAUTHORIZED,
	NOT_FOUND,
	PAGE_NOT_FOUND,
	UNAUTHORIZED,
	VALIDATION_ERROR,
} from './test-fixtures';
import { captureError, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('request construction', () => {
	it('sends the token as a bearer and puts the company in the path', async () => {
		respond(fetchMock, { offers: [] });

		await makeRecruiteeRequest('secret-token', {
			method: 'GET',
			path: companyPath('1111', '/offers'),
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://api.recruitee.com');
		expect(request.path).toBe('/c/1111/offers');
		expect(request.headers.get('authorization')).toBe('Bearer secret-token');
		expect(RECRUITEE_API_BASE).toBe('https://api.recruitee.com');
	});

	it('encodes a company subdomain used in place of the id', () => {
		// The docs allow a company subdomain as well as the numeric id.
		expect(companyPath('acme', '/offers')).toBe('/c/acme/offers');
	});

	it('sends a JSON body for a write', async () => {
		respond(fetchMock, { candidate: {} });

		await makeRecruiteeRequest('key', {
			method: 'POST',
			path: '/c/1111/candidates',
			body: { candidate: { name: 'John' } },
			replayable: false,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.contentType).toContain('application/json');
		expect(request.json()).toEqual({ candidate: { name: 'John' } });
	});
});

describe('the three error shapes', () => {
	it('reads the live current 401 body', async () => {
		respond(fetchMock, UNAUTHORIZED, 401);

		const error = (await captureError(
			makeRecruiteeRequest('bad', {
				method: 'GET',
				path: '/c/1111/offers',
				replayable: true,
			}),
		)) as RecruiteeAPIError;

		expect(error).toBeInstanceOf(RecruiteeAPIError);
		expect(error.status).toBe(401);
		expect(error.code).toBe('unauthorized');
		expect(error.isAuthError).toBe(true);
		expect(error.message).toBe('Recruitee 401 unauthorized: Unauthorized');
	});

	it('reads the older ATS error body', async () => {
		respond(fetchMock, LEGACY_UNAUTHORIZED, 401);

		const error = (await captureError(
			makeRecruiteeRequest('key', {
				method: 'GET',
				path: '/c/1111/offers',
				replayable: true,
			}),
		)) as RecruiteeAPIError;

		// This shape has no `code`, so the status alone labels it.
		expect(error.code).toBeUndefined();
		expect(error.isAuthError).toBe(true);
		expect(error.message).toBe(
			'Recruitee 401: Resource access requires authentication!',
		);
	});

	it('reads a 422 with its per-field messages', async () => {
		respond(fetchMock, VALIDATION_ERROR, 422);

		const error = (await captureError(
			makeRecruiteeRequest('key', {
				method: 'POST',
				path: '/c/1111/candidates',
				body: {},
				replayable: false,
			}),
		)) as RecruiteeAPIError;

		expect(error.status).toBe(422);
		expect(error.isValidationError).toBe(true);
		expect(error.code).toBe('unprocessable_entity');
		expect(error.message).toContain("Name can't be blank");
	});

	it('reads the live 404, whose error is an array of strings', async () => {
		respond(fetchMock, PAGE_NOT_FOUND, 404);

		const error = (await captureError(
			makeRecruiteeRequest('key', {
				method: 'GET',
				path: '/c/1111/candidates/1',
				replayable: true,
			}),
		)) as RecruiteeAPIError;

		expect(error.isNotFound).toBe(true);
		expect(error.errors).toEqual(['Page not found']);
		expect(error.message).toBe('Recruitee 404: Page not found');
	});

	it('reads a 404 body', async () => {
		respond(fetchMock, NOT_FOUND, 404);

		const error = (await captureError(
			makeRecruiteeRequest('key', {
				method: 'GET',
				path: '/c/1111/offers/999',
				replayable: true,
			}),
		)) as RecruiteeAPIError;

		expect(error.isNotFound).toBe(true);
	});

	it('describes a body with no recognised key from the fallback', () => {
		expect(describeRecruiteeError(500, {}, 'Request failed')).toBe(
			'Recruitee 500: Request failed',
		);
	});
});

describe('key hygiene', () => {
	it('does not leak the token through the error', async () => {
		respond(fetchMock, UNAUTHORIZED, 401);

		const error = (await captureError(
			makeRecruiteeRequest('super-secret-token', {
				method: 'GET',
				path: '/c/1111/offers',
				replayable: true,
			}),
		)) as RecruiteeAPIError;

		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('super-secret-token');
	});

	it('keeps the cause for a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeRecruiteeRequest('key', {
				method: 'GET',
				path: '/c/1111/offers',
				replayable: true,
			}),
		)) as RecruiteeAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.replayable).toBe(true);
	});
});
