jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { ApiError } from 'corsair/http';
import {
	endpoints,
	googleError,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

/** The error a call rejects with. Callers narrow it to the class they assert on. */
async function failure(
	promise: Promise<unknown>, // unknown: a promise can reject with any value.
): Promise<Error> {
	try {
		await promise;
	} catch (error) {
		if (error instanceof Error) return error;
		throw error;
	}
	throw new Error('Expected the call to reject, but it resolved.');
}

describe('response parsing', () => {
	it('keeps a user list with an empty users array as an empty page', async () => {
		mockFetch(jsonResponse({ users: [], nextPageToken: 'more' }));

		const result = await endpoints.users.list(makeCtx(), {
			customer: 'my_customer',
		});

		expect(result.users).toEqual([]);
		expect(result.nextPageToken).toBe('more');
	});

	it('accepts a page with no users key, which Google omits when nothing matches', async () => {
		mockFetch(jsonResponse({ kind: 'admin#directory#users' }));

		const result = await endpoints.users.list(makeCtx(), {
			customer: 'my_customer',
			query: 'email:nobody*',
		});

		expect(result.users).toBeUndefined();
	});

	it('rejects a user with no primaryEmail as a wrongly shaped body', async () => {
		// users.list answers objects with an id; a bare string is not a user and
		// must fail rather than become a blank row.
		mockFetch(jsonResponse({ users: ['ada@example.com'] }));

		const error = await failure(
			endpoints.users.list(makeCtx(), { customer: 'my_customer' }),
		);

		expect(error.name).toBe('ZodError');
	});

	it('rejects a malformed createdAt on a user', async () => {
		mockFetch(
			jsonResponse({
				id: '1',
				primaryEmail: 'ada@example.com',
				// A timestamp Google documents as RFC 3339, sent as a boolean.
				lastLoginTime: false,
			}),
		);

		const error = await failure(
			endpoints.users.get(makeCtx(), { userKey: 'ada@example.com' }),
		);

		expect(error.name).toBe('ZodError');
	});

	it('keeps undocumented extra fields on a group', async () => {
		mockFetch(
			jsonResponse({
				id: '1',
				email: 'eng@example.com',
				// A field this plugin does not model must survive the parse.
				whoCanJoin: 'ANYONE_CAN_JOIN',
			}),
		);

		const result = await endpoints.groups.get(makeCtx(), {
			groupKey: 'eng@example.com',
		});

		expect(result).toMatchObject({ whoCanJoin: 'ANYONE_CAN_JOIN' });
		expect(result.email).toBe('eng@example.com');
	});

	it('rejects a hasMember body with no isMember flag', async () => {
		mockFetch(jsonResponse({}));

		const error = await failure(
			endpoints.members.hasMember(makeCtx(), {
				groupKey: 'eng@example.com',
				memberKey: 'ada@example.com',
			}),
		);

		expect(error.name).toBe('ZodError');
	});

	it('rejects a 202 answer that is not a user', async () => {
		// A create can answer 202 when a conflicting unmanaged account was
		// invited instead. That body is not a User, so it must fail rather than
		// be reported as a created account.
		mockFetch(jsonResponse({ status: 'invited' }, { status: 202 }));

		const error = await failure(
			endpoints.users.insert(makeCtx(), {
				primaryEmail: 'ada@example.com',
				name: { givenName: 'Ada', familyName: 'Lovelace' },
				password: 'correct-horse-battery',
			}),
		);

		expect(error.name).toBe('ZodError');
	});

	it('accepts a bodyless success on delete', async () => {
		mockFetch(new Response(null, { status: 204 }));

		await expect(
			endpoints.users.delete(makeCtx(), { userKey: 'ada@example.com' }),
		).resolves.toBeUndefined();
	});
});

describe('refused input, before any request', () => {
	it('rejects a page size above the documented 500 users maximum', async () => {
		await expect(
			endpoints.users.list(makeCtx(), {
				customer: 'my_customer',
				maxResults: 501,
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('rejects a group page size above the documented 200 maximum', async () => {
		await expect(
			endpoints.groups.list(makeCtx(), {
				customer: 'my_customer',
				maxResults: 201,
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects a member page size above the documented 200 maximum', async () => {
		await expect(
			endpoints.members.list(makeCtx(), {
				groupKey: 'eng@example.com',
				maxResults: 201,
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects an undocumented sort column rather than sending it', async () => {
		await expect(
			endpoints.users.list(makeCtx(), {
				customer: 'my_customer',
				// The enum refuses this at the type level too; the cast is what
				// lets the runtime rejection be the thing under test.
				orderBy: 'lastLoginTime' as never,
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('rejects a member role the API does not take', async () => {
		await expect(
			endpoints.members.insert(makeCtx(), {
				groupKey: 'eng@example.com',
				email: 'nina@example.com',
				role: 'ADMIN' as never,
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects a delivery preference the API does not take', async () => {
		await expect(
			endpoints.members.update(makeCtx(), {
				groupKey: 'eng@example.com',
				memberKey: 'ada@example.com',
				delivery_settings: 'WEEKLY' as never,
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects a password shorter than the documented 8 characters', async () => {
		await expect(
			endpoints.users.insert(makeCtx(), {
				primaryEmail: 'ada@example.com',
				name: { givenName: 'Ada', familyName: 'Lovelace' },
				password: 'short',
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects a read-only field on users.insert instead of letting Google drop it', async () => {
		await expect(
			endpoints.users.insert(
				makeCtx(),
				// A read-only field: the type refuses it, and so must the schema.
				{
					primaryEmail: 'ada@example.com',
					name: { givenName: 'Ada', familyName: 'Lovelace' },
					password: 'correct-horse-battery',
					isAdmin: true,
				} as never,
			),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects an organizational unit with no parent at all', async () => {
		await expect(
			endpoints.orgUnits.insert(makeCtx(), {
				customerId: 'my_customer',
				name: 'apps',
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('accepts an organizational unit placed by parent ID instead of path', async () => {
		mockFetch(jsonResponse({ name: 'apps' }));

		await endpoints.orgUnits.insert(makeCtx(), {
			customerId: 'my_customer',
			name: 'apps',
			parentOrgUnitId: 'id:03ph8a2z',
		});

		expect(globalThis.fetch).toHaveBeenCalledTimes(1);
	});
});

describe('Google error envelopes', () => {
	it('keeps the provider body on the ApiError for the handler to read', async () => {
		mockFetch(
			googleError(403, 'PERMISSION_DENIED', 'forbidden', 'Not authorized'),
		);

		const error = await failure(
			endpoints.users.list(makeCtx(), { customer: 'my_customer' }),
		);
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw error;

		expect(error.status).toBe(403);
		expect(error.body).toMatchObject({
			error: { errors: [{ reason: 'forbidden' }] },
		});
	});

	it('does not put the bearer token in the error url', async () => {
		mockFetch(googleError(401, 'UNAUTHENTICATED', 'authError'));

		const error = await failure(
			endpoints.users.list(makeCtx(), { customer: 'my_customer' }),
		);
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw error;

		expect(error.url).not.toContain('test-token');
		expect(error.message).not.toContain('test-token');
	});
});
