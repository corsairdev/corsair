import {
	describeRocketlaneError,
	makeRocketlaneRequest,
	ROCKETLANE_API_BASE,
	RocketlaneAPIError,
} from './client';
import {
	AUTH_ERROR,
	NOT_FOUND_ERROR,
	TASK_ID,
	VALIDATION_ERROR,
} from './test-fixtures';
import {
	captureError,
	lastRequest,
	respond,
	respondRaw,
	spyOnFetch,
} from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('request construction', () => {
	it('sends the key in the api-key header, not the URL', async () => {
		respond(fetchMock, { data: [], pagination: {} });

		await makeRocketlaneRequest('secret-key', {
			method: 'GET',
			path: '/1.0/tasks',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://api.rocketlane.com');
		expect(request.path).toBe('/api/1.0/tasks');
		expect(ROCKETLANE_API_BASE).toBe('https://api.rocketlane.com/api');
		expect(request.headers.get('api-key')).toBe('secret-key');
		expect(request.headers.get('accept')).toBe('application/json');
		expect(request.headers.get('authorization')).toBeNull();
		expect(Object.values(request.query)).not.toContain('secret-key');
	});

	it('sends a JSON body and content type for a write', async () => {
		respond(fetchMock, { taskId: TASK_ID }, 201);

		await makeRocketlaneRequest('key', {
			method: 'POST',
			path: '/1.0/tasks',
			body: { taskName: 'Kickoff' },
			replayable: false,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.contentType).toContain('application/json');
		expect(request.json()).toEqual({ taskName: 'Kickoff' });
	});

	it('sends no body and no content type on a read', async () => {
		respond(fetchMock, {});

		await makeRocketlaneRequest('key', {
			method: 'GET',
			path: '/1.0/users',
			query: { pageSize: 5 },
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('GET');
		expect(request.hasBody).toBe(false);
		expect(request.contentType).toBe('');
		expect(request.query).toEqual({ pageSize: '5' });
	});

	it('repeats an array query parameter rather than joining it', async () => {
		respond(fetchMock, {});

		await makeRocketlaneRequest('key', {
			method: 'GET',
			path: '/1.0/tasks',
			query: { includeFields: ['taskName', 'dueDate'] },
			replayable: true,
		});

		expect(lastRequest(fetchMock).allQuery('includeFields')).toEqual([
			'taskName',
			'dueDate',
		]);
	});
});

describe('error envelope', () => {
	it('reads the first errorCode and every message', async () => {
		respond(fetchMock, VALIDATION_ERROR, 400);

		const error = (await captureError(
			makeRocketlaneRequest('key', {
				method: 'POST',
				path: '/1.0/projects',
				body: {},
				replayable: false,
			}),
		)) as RocketlaneAPIError;

		expect(error).toBeInstanceOf(RocketlaneAPIError);
		expect(error.status).toBe(400);
		expect(error.code).toBe('BAD_REQUEST');
		expect(error.errors).toEqual([
			'projectName must not be blank',
			'dueDate must be on or after startDate',
		]);
		expect(error.isValidationError).toBe(true);
		expect(error.message).toContain('projectName must not be blank');
		// The second message is kept rather than dropped.
		expect(error.message).toContain('dueDate must be on or after startDate');
	});

	it('reports the live 401 body as an auth failure', async () => {
		respond(fetchMock, AUTH_ERROR, 401);

		const error = (await captureError(
			makeRocketlaneRequest('bad', {
				method: 'GET',
				path: '/1.0/tasks',
				replayable: true,
			}),
		)) as RocketlaneAPIError;

		expect(error.status).toBe(401);
		expect(error.code).toBe('NOT_AUTHORIZED');
		expect(error.isAuthError).toBe(true);
		expect(error.message).toBe(
			'Rocketlane 401 NOT_AUTHORIZED: Not Authorized: User not authorized',
		);
	});

	it('reports a 404 body as a missing record', async () => {
		respond(fetchMock, NOT_FOUND_ERROR, 404);

		const error = (await captureError(
			makeRocketlaneRequest('key', {
				method: 'GET',
				path: `/1.0/tasks/${TASK_ID}`,
				replayable: true,
			}),
		)) as RocketlaneAPIError;

		expect(error.isNotFound).toBe(true);
		expect(error.isAuthError).toBe(false);
	});
});

describe('key hygiene', () => {
	it('does not leak the key through the error', async () => {
		respond(fetchMock, AUTH_ERROR, 401);

		const error = (await captureError(
			makeRocketlaneRequest('super-secret-key', {
				method: 'GET',
				path: '/1.0/tasks',
				replayable: true,
			}),
		)) as RocketlaneAPIError;

		// The cause holds the request, and with it the api-key header.
		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('super-secret-key');
		expect(require('node:util').inspect(error)).not.toContain(
			'super-secret-key',
		);
	});

	it('keeps the cause for a transport failure, which never carried the key', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeRocketlaneRequest('key', {
				method: 'GET',
				path: '/1.0/tasks',
				replayable: true,
			}),
		)) as RocketlaneAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.replayable).toBe(true);
		expect(error.method).toBe('GET');
	});

	it('describes a bare 401 text body from the fallback', async () => {
		respondRaw(fetchMock, '401 Unauthorized', 401);

		const error = (await captureError(
			makeRocketlaneRequest('key', {
				method: 'GET',
				path: '/1.0/tasks',
				replayable: true,
			}),
		)) as RocketlaneAPIError;

		// A keyless request is rejected before the app layer, so there is no
		// errorCode and the fallback text is used.
		expect(error.status).toBe(401);
		expect(error.code).toBeUndefined();
		expect(error.isAuthError).toBe(true);
		expect(error.message).toContain('401');
	});

	it('describes a body with no errors array', () => {
		expect(describeRocketlaneError(500, {}, 'Server error')).toBe(
			'Rocketlane 500: Server error',
		);
		expect(describeRocketlaneError(undefined, {}, 'Oops')).toBe('Oops');
	});
});

describe('replay safety', () => {
	it('records that a create is not replayable', async () => {
		respond(fetchMock, { errors: [{ errorCode: 'SERVER_ERROR' }] }, 500);

		const error = (await captureError(
			makeRocketlaneRequest('key', {
				method: 'POST',
				path: '/1.0/tasks',
				body: { taskName: 'x' },
				replayable: false,
			}),
		)) as RocketlaneAPIError;

		expect(error.replayable).toBe(false);
	});

	it('records that a read is replayable', async () => {
		respond(fetchMock, { errors: [{ errorCode: 'SERVER_ERROR' }] }, 500);

		const error = (await captureError(
			makeRocketlaneRequest('key', {
				method: 'GET',
				path: '/1.0/tasks',
				replayable: true,
			}),
		)) as RocketlaneAPIError;

		expect(error.replayable).toBe(true);
	});
});
