import { ApiError } from 'corsair/http';
import {
	describeUserlistError,
	isUserlistFailure,
	makeUserlistRequest,
	USERLIST_AUTH_SCHEME,
	USERLIST_PUSH_API_BASE,
	UserlistAPIError,
} from './client';
import {
	rateLimited,
	tooLarge,
	unauthorized,
	unprocessable,
} from './test-fixtures';
import {
	installFetchMock,
	lastRequest,
	PUSH_KEY,
	respond,
	respondEmpty,
} from './test-support';

describe('makeUserlistRequest', () => {
	const fetchMock = installFetchMock();

	it('sends the Push scheme against the push host', async () => {
		respondEmpty(fetchMock);

		await makeUserlistRequest(PUSH_KEY, {
			method: 'POST',
			path: '/users',
			body: { identifier: 'user-1' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://push.userlist.com');
		expect(sent.path).toBe('/users');
		expect(sent.headers['authorization']).toBe(`Push ${PUSH_KEY}`);
		expect(sent.headers['accept']).toBe('application/json');
	});

	it('resolves undefined, since a 202 carries no body', async () => {
		respondEmpty(fetchMock);

		await expect(
			makeUserlistRequest(PUSH_KEY, {
				method: 'POST',
				path: '/events',
				body: { name: 'x' },
			}),
		).resolves.toBeUndefined();
	});

	it('sends a DELETE with a body, which is how an object is removed', async () => {
		respondEmpty(fetchMock);

		await makeUserlistRequest(PUSH_KEY, {
			method: 'DELETE',
			path: '/users',
			body: { identifier: 'user-1' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('DELETE');
		expect(sent.body).toEqual({ identifier: 'user-1' });
	});

	it('throws a UserlistAPIError carrying the code and every message', async () => {
		respond(fetchMock, unprocessable, 422);

		const error = (await makeUserlistRequest(PUSH_KEY, {
			method: 'POST',
			path: '/users',
			body: {},
		}).catch((thrown: unknown) => thrown)) as UserlistAPIError;

		expect(error).toBeInstanceOf(UserlistAPIError);
		expect(error.status).toBe(422);
		expect(error.code).toBe('unprocessable_content');
		expect(error.errors).toEqual(['User must exist', 'Email is invalid']);
		expect(error.message).toBe(
			'Userlist 422 unprocessable_content: User must exist; Email is invalid',
		);
		expect(error.isValidationError).toBe(true);
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeUserlistRequest(PUSH_KEY, {
			method: 'POST',
			path: '/messages',
		}).catch((thrown: unknown) => thrown)) as UserlistAPIError;

		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('POST');
	});

	it('does not retry a 429 itself, leaving that to the handler', async () => {
		respond(fetchMock, rateLimited, 429);

		await expect(
			makeUserlistRequest(PUSH_KEY, { method: 'POST', path: '/events' }),
		).rejects.toBeInstanceOf(UserlistAPIError);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('UserlistAPIError', () => {
	it('treats 401 as an auth error', () => {
		expect(new UserlistAPIError('failed', { status: 401 }).isAuthError).toBe(
			true,
		);
	});

	it('treats the unauthorized code as an auth error without a status', () => {
		const error = new UserlistAPIError('failed', { body: unauthorized });
		expect(error.isAuthError).toBe(true);
		expect(error.code).toBe('unauthorized');
		expect(error.errors).toEqual(['You are not authorized to do this.']);
	});

	it('treats 413 as too large', () => {
		const error = new UserlistAPIError('failed', { body: tooLarge });
		expect(error.isTooLarge).toBe(true);
		expect(error.isValidationError).toBe(false);
	});

	it('treats the unprocessable code as a validation error', () => {
		const error = new UserlistAPIError('failed', { body: unprocessable });
		expect(error.isValidationError).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('has no errors array when the body is not the documented shape', () => {
		const error = new UserlistAPIError('failed', {
			status: 502,
			body: '<html>bad gateway</html>',
		});
		expect(error.errors).toBeUndefined();
		expect(error.code).toBeUndefined();
	});

	it('reads the fields from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'POST', url: '/users' },
			{
				url: 'https://push.userlist.com/users',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: unauthorized,
			},
			'Unauthorized',
		);
		const error = new UserlistAPIError('wrapped', { cause });
		expect(error.status).toBe(401);
		expect(error.code).toBe('unauthorized');
	});
});

describe('describeUserlistError', () => {
	it('joins every message and labels the status and code', () => {
		expect(describeUserlistError(422, unprocessable, 'fallback')).toBe(
			'Userlist 422 unprocessable_content: User must exist; Email is invalid',
		);
	});

	it('falls back when the body is not an error shape', () => {
		expect(describeUserlistError(502, 'bad gateway', 'Bad gateway')).toBe(
			'Userlist 502: Bad gateway',
		);
	});

	it('drops the label when there is neither status nor code', () => {
		expect(describeUserlistError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('the exported constants', () => {
	it('uses the Push scheme, not Bearer', () => {
		expect(USERLIST_AUTH_SCHEME).toBe('Push');
	});

	it('writes to the push host, which is not the api host', () => {
		expect(USERLIST_PUSH_API_BASE).toBe('https://push.userlist.com');
		expect(USERLIST_PUSH_API_BASE).not.toContain('api.userlist.com');
	});
});

describe('isUserlistFailure', () => {
	it('narrows a thrown error', () => {
		expect(isUserlistFailure(new UserlistAPIError('failed'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isUserlistFailure(new Error('other'))).toBe(false);
		expect(isUserlistFailure('nope')).toBe(false);
	});
});
