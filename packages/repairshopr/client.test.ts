import {
	apiBase,
	describeRepairshoprError,
	isValidSubdomain,
	makeRepairshoprRequest,
	RepairshoprAPIError,
} from './client';
import { AUTH_ERROR, VALIDATION_ERROR } from './test-fixtures';
import { captureError, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('subdomain handling', () => {
	it('builds the tenant host from the subdomain', () => {
		expect(apiBase('acme')).toBe('https://acme.repairshopr.com/api/v1');
	});

	it('accepts a normal subdomain', () => {
		expect(isValidSubdomain('acme')).toBe(true);
		expect(isValidSubdomain('acme-repair-2')).toBe(true);
	});

	it('rejects a value that is not a DNS label', () => {
		// Anything with a dot or a slash would change the host entirely.
		expect(isValidSubdomain('acme.evil.com')).toBe(false);
		expect(isValidSubdomain('acme/../x')).toBe(false);
		expect(isValidSubdomain('')).toBe(false);
		expect(isValidSubdomain('-acme')).toBe(false);
		expect(isValidSubdomain('acme-')).toBe(false);
		expect(isValidSubdomain('a b')).toBe(false);
	});
});

describe('request construction', () => {
	it('targets the tenant host and sends the key as a query parameter', async () => {
		respond(fetchMock, { customers: [], meta: {} });

		await makeRepairshoprRequest('acme', 'secret-key', {
			method: 'GET',
			path: '/customers',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://acme.repairshopr.com');
		expect(request.path).toBe('/api/v1/customers');
		expect(request.query).toEqual({ api_key: 'secret-key' });
		expect(request.headers.get('accept')).toBe('application/json');
	});

	it('sends a JSON body for a write', async () => {
		respond(fetchMock, { customer: { id: 1 } });

		await makeRepairshoprRequest('acme', 'key', {
			method: 'POST',
			path: '/customers',
			body: { firstname: 'Walkin' },
			replayable: false,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.contentType).toContain('application/json');
		expect(request.json()).toEqual({ firstname: 'Walkin' });
	});

	it('sends no body on a read', async () => {
		respond(fetchMock, {});

		await makeRepairshoprRequest('acme', 'key', {
			method: 'GET',
			path: '/tickets',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.hasBody).toBe(false);
		expect(request.contentType).toBe('');
	});
});

describe('error envelopes', () => {
	it('reads the live 401 body', async () => {
		respond(fetchMock, AUTH_ERROR, 401);

		const error = (await captureError(
			makeRepairshoprRequest('acme', 'bad', {
				method: 'GET',
				path: '/customers',
				replayable: true,
			}),
		)) as RepairshoprAPIError;

		expect(error).toBeInstanceOf(RepairshoprAPIError);
		expect(error.status).toBe(401);
		expect(error.errors).toEqual(['Failed to authenticate account']);
		expect(error.isAuthError).toBe(true);
		expect(error.message).toBe(
			'RepairShopr 401: Failed to authenticate account',
		);
	});

	it('reads every message and the echoed params from a 422', async () => {
		respond(fetchMock, VALIDATION_ERROR, 422);

		const error = (await captureError(
			makeRepairshoprRequest('acme', 'key', {
				method: 'POST',
				path: '/customers',
				body: { email: 'it is not an email' },
				replayable: false,
			}),
		)) as RepairshoprAPIError;

		expect(error.status).toBe(422);
		expect(error.isValidationError).toBe(true);
		expect(error.errors).toHaveLength(2);
		expect(error.params).toEqual({ email: 'it is not an email' });
		// The first message leads and the rest are kept rather than dropped.
		expect(error.message).toContain('Email is not an email');
		expect(error.message).toContain('Only able to parse up to');
	});

	it('describes a body with no recognised key from the fallback', () => {
		expect(describeRepairshoprError(500, {}, 'Request failed')).toBe(
			'RepairShopr 500: Request failed',
		);
		expect(describeRepairshoprError(undefined, {}, 'Oops')).toBe('Oops');
	});
});

describe('key hygiene', () => {
	it('does not leak the key through the error', async () => {
		respond(fetchMock, AUTH_ERROR, 401);

		const error = (await captureError(
			makeRepairshoprRequest('acme', 'super-secret-key', {
				method: 'GET',
				path: '/customers',
				replayable: true,
			}),
		)) as RepairshoprAPIError;

		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('super-secret-key');
		expect(require('node:util').inspect(error)).not.toContain(
			'super-secret-key',
		);
	});

	it('keeps the cause for a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeRepairshoprRequest('acme', 'key', {
				method: 'GET',
				path: '/customers',
				replayable: true,
			}),
		)) as RepairshoprAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.replayable).toBe(true);
		expect(error.method).toBe('GET');
	});
});
