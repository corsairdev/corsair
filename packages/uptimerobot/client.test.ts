import { ApiError } from 'corsair/http';
import {
	describeUptimeRobotError,
	isUptimeRobotFailure,
	makeUptimeRobotRequest,
	segment,
	UptimeRobotAPIError,
} from './client';
import {
	invalidToken,
	notFound,
	rateLimited,
	validationFailure,
} from './test-fixtures';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	respond,
} from './test-support';

describe('makeUptimeRobotRequest', () => {
	const fetchMock = installFetchMock();

	it('sends the key as a bearer token against v3', async () => {
		respond(fetchMock, { data: [], nextLink: null });

		await makeUptimeRobotRequest(API_KEY, { method: 'GET', path: '/monitors' });

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://api.uptimerobot.com');
		expect(sent.path).toBe('/v3/monitors');
		expect(sent.method).toBe('GET');
		expect(sent.headers['authorization']).toBe(`Bearer ${API_KEY}`);
		expect(sent.headers['accept']).toBe('application/json');
	});

	it('leaves out the body for a GET', async () => {
		respond(fetchMock, {});

		await makeUptimeRobotRequest(API_KEY, {
			method: 'GET',
			path: '/monitors',
			query: { limit: 10 },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.body).toBeUndefined();
		expect(sent.query.limit).toBe('10');
	});

	it('serializes a PATCH body as JSON', async () => {
		respond(fetchMock, { id: 1 });

		await makeUptimeRobotRequest(API_KEY, {
			method: 'PATCH',
			path: '/monitors/1',
			body: { friendlyName: 'Renamed' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PATCH');
		expect(sent.headers['content-type']).toContain('application/json');
		expect(sent.body).toEqual({ friendlyName: 'Renamed' });
	});

	it('keeps a path segment encoded', () => {
		expect(segment('inc/1 2')).toBe('inc%2F1%202');
	});

	it('throws an UptimeRobotAPIError carrying the status and code', async () => {
		respond(fetchMock, invalidToken, 401);

		const error = await makeUptimeRobotRequest(API_KEY, {
			method: 'GET',
			path: '/monitors',
		}).catch((thrown: unknown) => thrown);

		expect(error).toBeInstanceOf(UptimeRobotAPIError);
		const apiError = error as UptimeRobotAPIError;
		expect(apiError.status).toBe(401);
		expect(apiError.code).toBe('003-005');
		expect(apiError.method).toBe('GET');
		expect(apiError.message).toBe('UptimeRobot 401 003-005: Invalid token.');
	});

	it('joins a validation failure per-field messages', async () => {
		respond(fetchMock, validationFailure, 400);

		const error = (await makeUptimeRobotRequest(API_KEY, {
			method: 'POST',
			path: '/monitors',
			body: {},
		}).catch((thrown: unknown) => thrown)) as UptimeRobotAPIError;

		expect(error.details).toEqual([
			'friendlyName should not be empty',
			'interval must be at least 30',
		]);
		expect(error.message).toContain('friendlyName should not be empty');
		expect(error.message).toContain('interval must be at least 30');
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeUptimeRobotRequest(API_KEY, {
			method: 'POST',
			path: '/monitors/x/pause',
		}).catch((thrown: unknown) => thrown)) as UptimeRobotAPIError;

		expect(error).toBeInstanceOf(UptimeRobotAPIError);
		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('POST');
	});

	it('does not retry a 429 itself, leaving that to the handler', async () => {
		respond(fetchMock, rateLimited, 429);

		await expect(
			makeUptimeRobotRequest(API_KEY, { method: 'GET', path: '/monitors' }),
		).rejects.toBeInstanceOf(UptimeRobotAPIError);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('UptimeRobotAPIError', () => {
	it('treats 401 as an auth error', () => {
		const error = new UptimeRobotAPIError('failed', { status: 401 });
		expect(error.isAuthError).toBe(true);
	});

	it('treats the invalid token code as an auth error even without a status', () => {
		const error = new UptimeRobotAPIError('failed', { body: invalidToken });
		expect(error.status).toBeUndefined();
		expect(error.isAuthError).toBe(true);
	});

	it('treats 404 as not found', () => {
		const error = new UptimeRobotAPIError('failed', {
			status: 404,
			body: notFound,
		});
		expect(error.isNotFound).toBe(true);
	});

	it('is neither when the failure is something else', () => {
		const error = new UptimeRobotAPIError('failed', { status: 500 });
		expect(error.isAuthError).toBe(false);
		expect(error.isNotFound).toBe(false);
	});

	it('reads the status from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/monitors' },
			{
				url: 'https://api.uptimerobot.com/v3/monitors',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: notFound,
			},
			'Not Found',
		);
		const error = new UptimeRobotAPIError('wrapped', { cause });
		expect(error.status).toBe(404);
		expect(error.code).toBe('009-002');
	});

	it('has no details when the message is a plain string', () => {
		const error = new UptimeRobotAPIError('failed', { body: invalidToken });
		expect(error.details).toBeUndefined();
	});
});

describe('describeUptimeRobotError', () => {
	it('labels the status and code', () => {
		expect(describeUptimeRobotError(401, invalidToken, 'fallback')).toBe(
			'UptimeRobot 401 003-005: Invalid token.',
		);
	});

	it('falls back when the body is not an error shape', () => {
		expect(
			describeUptimeRobotError(502, '<html>bad gateway</html>', 'Bad gateway'),
		).toBe('UptimeRobot 502: Bad gateway');
	});

	it('drops the label when there is no status and no code', () => {
		expect(describeUptimeRobotError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});

	it('joins an array message', () => {
		expect(describeUptimeRobotError(400, validationFailure, 'fallback')).toBe(
			'UptimeRobot 400 000-005: friendlyName should not be empty; interval must be at least 30',
		);
	});
});

describe('isUptimeRobotFailure', () => {
	it('narrows a thrown error', () => {
		const error = new UptimeRobotAPIError('failed', { status: 500 });
		expect(isUptimeRobotFailure(error)).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isUptimeRobotFailure(new Error('other'))).toBe(false);
		expect(isUptimeRobotFailure('nope')).toBe(false);
	});
});
