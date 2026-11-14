import {
	describeRadarError,
	makeRadarRequest,
	RADAR_API_BASE,
	RadarAPIError,
} from './client';
import {
	LEGAL_ERROR,
	NOT_FOUND,
	QUOTA_EXCEEDED,
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
	it('sends the key bare in the Authorization header, with no Bearer prefix', async () => {
		respond(fetchMock, { meta: { code: 200 }, users: [] });

		await makeRadarRequest('prj_live_sk_abc', {
			method: 'GET',
			path: '/users',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://api.radar.io');
		expect(request.path).toBe('/v1/users');
		// Radar takes the raw key: `Bearer …` would be rejected.
		expect(request.headers.get('authorization')).toBe('prj_live_sk_abc');
		expect(RADAR_API_BASE).toBe('https://api.radar.io/v1');
	});

	it('sends a JSON body for a write', async () => {
		respond(fetchMock, { meta: { code: 200 }, geofence: { _id: 'x' } });

		await makeRadarRequest('key', {
			method: 'PUT',
			path: '/geofences/store/store-42',
			body: { description: 'Store', type: 'circle', radius: 100 },
			replayable: false,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.contentType).toContain('application/json');
		expect(request.json()).toEqual({
			description: 'Store',
			type: 'circle',
			radius: 100,
		});
	});

	it('sends no body on a read', async () => {
		respond(fetchMock, {});

		await makeRadarRequest('key', {
			method: 'GET',
			path: '/users',
			query: { limit: 10 },
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.hasBody).toBe(false);
		expect(request.query).toEqual({ limit: '10' });
	});
});

describe('the meta envelope', () => {
	it('reads the live 401 body', async () => {
		respond(fetchMock, UNAUTHORIZED, 401);

		const error = (await captureError(
			makeRadarRequest('bad', {
				method: 'GET',
				path: '/users',
				replayable: true,
			}),
		)) as RadarAPIError;

		expect(error).toBeInstanceOf(RadarAPIError);
		expect(error.status).toBe(401);
		expect(error.code).toBe(401);
		expect(error.isAuthError).toBe(true);
		expect(error.message).toBe(
			'Radar 401: Unauthorized. Publishable API key required.',
		);
	});

	it('keeps the parameter Radar blamed on a 400', async () => {
		respond(fetchMock, VALIDATION_ERROR, 400);

		const error = (await captureError(
			makeRadarRequest('key', {
				method: 'POST',
				path: '/track',
				body: {},
				replayable: false,
			}),
		)) as RadarAPIError;

		expect(error.status).toBe(400);
		expect(error.param).toBe('latitude');
		expect(error.isValidationError).toBe(true);
		expect(error.message).toContain('Invalid latitude');
	});

	it('reports a spent quota as a quota error, not a rate limit', async () => {
		respond(fetchMock, QUOTA_EXCEEDED, 402);

		const error = (await captureError(
			makeRadarRequest('key', {
				method: 'GET',
				path: '/users',
				replayable: true,
			}),
		)) as RadarAPIError;

		expect(error.status).toBe(402);
		expect(error.isQuotaError).toBe(true);
		// A quota problem must not be mistaken for a throughput limit.
		expect(error.isAuthError).toBe(false);
	});

	it('reports a 451 as a legal refusal', async () => {
		respond(fetchMock, LEGAL_ERROR, 451);

		const error = (await captureError(
			makeRadarRequest('key', {
				method: 'GET',
				path: '/geocode/forward',
				query: { query: 'x' },
				replayable: true,
			}),
		)) as RadarAPIError;

		expect(error.isLegalError).toBe(true);
	});

	it('reports a 404 as a missing record', async () => {
		respond(fetchMock, NOT_FOUND, 404);

		const error = (await captureError(
			makeRadarRequest('key', {
				method: 'GET',
				path: '/users/nope',
				replayable: true,
			}),
		)) as RadarAPIError;

		expect(error.isNotFound).toBe(true);
	});

	it('describes a body with no meta from the fallback', () => {
		expect(describeRadarError(500, {}, 'Request failed')).toBe(
			'Radar 500: Request failed',
		);
		expect(describeRadarError(undefined, {}, 'Oops')).toBe('Oops');
	});

	it('adds the parameter when the message does not name it', () => {
		expect(
			describeRadarError(400, { meta: { code: 400, param: 'radius' } }, 'Bad'),
		).toBe('Radar 400: Bad (param: radius)');
	});
});

describe('key hygiene', () => {
	it('does not leak the key through the error', async () => {
		respond(fetchMock, UNAUTHORIZED, 401);

		const error = (await captureError(
			makeRadarRequest('prj_live_sk_super_secret', {
				method: 'GET',
				path: '/users',
				replayable: true,
			}),
		)) as RadarAPIError;

		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('super_secret');
		expect(require('node:util').inspect(error)).not.toContain('super_secret');
	});

	it('keeps the cause for a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeRadarRequest('key', {
				method: 'GET',
				path: '/users',
				replayable: true,
			}),
		)) as RadarAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.replayable).toBe(true);
	});
});
