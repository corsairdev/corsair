import {
	describeRaiselyError,
	makeRaiselyRequest,
	RAISELY_API_BASE,
	RaiselyAPIError,
} from './client';
import { FORBIDDEN, NOT_FOUND, VALIDATION_ERROR } from './test-fixtures';
import { captureError, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('request construction', () => {
	it('sends the token as a bearer header and keeps it out of the URL', async () => {
		respond(fetchMock, { data: [], pagination: {} });

		await makeRaiselyRequest('secret-token', {
			method: 'GET',
			path: '/campaigns',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://api.raisely.com');
		expect(request.path).toBe('/v3/campaigns');
		expect(RAISELY_API_BASE).toBe('https://api.raisely.com/v3');
		expect(request.headers.get('authorization')).toBe('Bearer secret-token');
		expect(request.headers.get('accept')).toBe('application/json');
		expect(Object.values(request.query)).not.toContain('secret-token');
	});

	it('sends a JSON body for a write', async () => {
		respond(fetchMock, { data: { uuid: 'x' } }, 201);

		await makeRaiselyRequest('key', {
			method: 'POST',
			path: '/donations',
			body: { data: { amount: 2500 } },
			replayable: false,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.contentType).toContain('application/json');
		expect(request.json()).toEqual({ data: { amount: 2500 } });
	});

	it('sends no body on a read', async () => {
		respond(fetchMock, {});

		await makeRaiselyRequest('key', {
			method: 'GET',
			path: '/designations',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.hasBody).toBe(false);
		expect(request.contentType).toBe('');
	});
});

describe('the problem document', () => {
	it('reads detail, code and instance out of the live 403 body', async () => {
		respond(fetchMock, FORBIDDEN, 403);

		const error = (await captureError(
			makeRaiselyRequest('bad', {
				method: 'GET',
				path: '/campaigns',
				replayable: true,
			}),
		)) as RaiselyAPIError;

		expect(error).toBeInstanceOf(RaiselyAPIError);
		expect(error.status).toBe(403);
		expect(error.code).toBe('forbidden');
		expect(error.instance).toBe('/errors/occurance/3AuL:BU1dG');
		expect(error.isAuthError).toBe(true);
		expect(error.message).toBe(
			'Raisely 403 forbidden: You are not authorized to do that',
		);
	});

	it('keeps every field message from a validation body', async () => {
		respond(fetchMock, VALIDATION_ERROR, 422);

		const error = (await captureError(
			makeRaiselyRequest('key', {
				method: 'POST',
				path: '/donations',
				body: { data: {} },
				replayable: false,
			}),
		)) as RaiselyAPIError;

		expect(error.status).toBe(422);
		expect(error.isValidationError).toBe(true);
		expect(error.errors).toEqual([
			'The donation could not be created',
			'amount is required',
			'currency must be a 3-letter code',
		]);
		expect(error.message).toContain('amount is required');
		// The per-field messages add to the summary rather than replacing it.
		expect(error.message).toContain('currency must be a 3-letter code');
	});

	it('reports a 404 body as a missing record', async () => {
		respond(fetchMock, NOT_FOUND, 404);

		const error = (await captureError(
			makeRaiselyRequest('key', {
				method: 'GET',
				path: '/donations/x',
				replayable: true,
			}),
		)) as RaiselyAPIError;

		expect(error.isNotFound).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('treats 410 as gone, which is also not found', () => {
		const error = new RaiselyAPIError('gone', { status: 410 });

		expect(error.isNotFound).toBe(true);
	});

	it('describes a body with no problem keys from the fallback', () => {
		expect(describeRaiselyError(500, {}, 'Request failed')).toBe(
			'Raisely 500: Request failed',
		);
		expect(describeRaiselyError(undefined, {}, 'Oops')).toBe('Oops');
	});
});

describe('key hygiene', () => {
	it('does not leak the token through the error', async () => {
		respond(fetchMock, FORBIDDEN, 403);

		const error = (await captureError(
			makeRaiselyRequest('super-secret-token', {
				method: 'GET',
				path: '/campaigns',
				replayable: true,
			}),
		)) as RaiselyAPIError;

		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('super-secret-token');
		expect(require('node:util').inspect(error)).not.toContain(
			'super-secret-token',
		);
	});

	it('keeps the cause for a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeRaiselyRequest('key', {
				method: 'GET',
				path: '/campaigns',
				replayable: true,
			}),
		)) as RaiselyAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.replayable).toBe(true);
		expect(error.method).toBe('GET');
	});
});
