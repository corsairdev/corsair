import { inspect } from 'node:util';
import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { jsonPath, segment } from './client';
import { Bookings, Schedules, Slots, Users } from './endpoints';
import type {
	BookingsListResponse,
	SupersaasScheduleRead,
	SupersaasUser,
} from './endpoints/types';
import type { UnknownJson } from './json';
import {
	booking,
	bookingsEnvelope,
	resourceBooking,
	slot,
	slotsEnvelope,
	user,
} from './test-fixtures';
import { lastRequest, respond, respondEmpty } from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'supersaas-api-key';
const ACCOUNT = 'acme';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return type is the widest one.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: per endpoint

/** The account name is a stored account field, read like the key. */
function invoke(endpoint: AnyEndpoint, input: UnknownJson) {
	return endpoint(
		{
			key: API_KEY,
			options: {},
			keys: { get_account_name: jest.fn().mockResolvedValue(ACCOUNT) },
		} as never,
		input as never,
	);
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

/** A 201 with an empty body and the new record's URL in Location. */
function respondCreated(location: string) {
	fetchMock.mockResolvedValueOnce(
		new Response(null, { status: 201, headers: { Location: location } }),
	);
}

function expectBasicAuthAndJson() {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://www.supersaas.com');
	const decoded = Buffer.from(
		(sent.headers.get('authorization') ?? '').replace('Basic ', ''),
		'base64',
	).toString();
	expect(decoded).toBe(`${ACCOUNT}:${API_KEY}`);
	// Without `.json` SuperSaaS answers XML.
	expect(sent.path.endsWith('.json')).toBe(true);
}

// unknown: a rejection reason has no static type.
const caught = (promise: Promise<unknown>) => promise.catch((e: unknown) => e);

describe('client', () => {
	it('appends the json suffix once', () => {
		expect(jsonPath('/users')).toBe('/users.json');
		expect(jsonPath('/users.json')).toBe('/users.json');
	});

	it('encodes a path segment', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});
});

describe('users', () => {
	it('lists with the paging query and parses numeric ids', async () => {
		respond(fetchMock, [user]);

		const result = (await invoke(Users.list, { limit: 10, offset: 20 })) as {
			id: number;
		}[];

		expectBasicAuthAndJson();
		expect(lastRequest(fetchMock).query).toEqual({ limit: '10', offset: '20' });
		expect(result[0]?.id).toBe(15294233);
	});

	it('reads the new id from the Location header of a 201', async () => {
		respondCreated('https://www.supersaas.com/api/users/15294233.json');

		const result = await invoke(Users.create, {
			name: 'jane@example.com',
			full_name: 'Jane Smith',
		});

		expect(lastRequest(fetchMock).body).toEqual({
			user: { name: 'jane@example.com', full_name: 'Jane Smith' },
		});
		expect(result).toEqual({
			created: true,
			id: '15294233',
			location: 'https://www.supersaas.com/api/users/15294233.json',
		});
		// The login name is an email here, so the event carries the id only.
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'supersaas.users.create',
			{ userId: '15294233' },
			'completed',
		);
	});

	it('gets one user by id with Basic auth', async () => {
		respond(fetchMock, user);

		const result = (await invoke(Users.get, {
			id: '15294233',
		})) as SupersaasUser;

		expectBasicAuthAndJson();
		expect(lastRequest(fetchMock).path).toBe('/api/users/15294233.json');
		expect(result.id).toBe(15294233);
	});

	it('refuses a 201 without a Location header instead of inventing success', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 201 }));

		await expect(
			invoke(Users.create, { name: 'jane@example.com' }),
		).rejects.toThrow(/Location/);
	});

	it.each([
		['an HTML page', '<html><body>failed</body></html>', 'text/html'],
		['a relative path', '/slots/123', 'text/plain'],
	])(
		'refuses a 201 whose body (%s) stands in for a missing Location',
		async (_label, body, type) => {
			fetchMock.mockResolvedValueOnce(
				new Response(body, { status: 201, headers: { 'Content-Type': type } }),
			);

			await expect(
				invoke(Users.create, { name: 'jane@example.com' }),
			).rejects.toThrow(/Location/);
		},
	);

	it('creates under a caller-supplied key', async () => {
		respondCreated('https://www.supersaas.com/api/users/15294241.json');

		const result = await invoke(Users.createWithKey, {
			key: '9001fk',
			name: 'jane@example.com',
		});

		expect(lastRequest(fetchMock).path).toBe('/api/users/9001fk.json');
		expect(result).toMatchObject({ created: true, id: '15294241' });
	});

	it('reads a reused key as an update: an empty 200 without Location', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Users.createWithKey, {
			key: '9001fk',
			name: 'jane@example.com',
		});

		expect(result).toEqual({ id: '9001fk', updated: true });
	});

	it('masks the user id in the path of a failed user read', async () => {
		respond(
			fetchMock,
			{ errors: [{ status: '404', title: 'Not found' }] },
			404,
		);

		const error = (await caught(
			invoke(Users.get, { id: 'jane@example.com' }),
		)) as ApiError;

		expect(error.status).toBe(404);
		expect(error.url).toContain('/api/users/[REDACTED].json');
		expect(JSON.stringify(error)).not.toContain('jane');
	});

	it('accepts the empty 200 an update answers', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Users.update, {
			id: '15294233',
			name: 'jane@example.com',
			notfound: 'error',
		});

		expect(lastRequest(fetchMock)).toMatchObject({
			method: 'PUT',
			path: '/api/users/15294233.json',
			query: { notfound: 'error' },
		});
		expect(result).toEqual({ id: '15294233', updated: true });
	});

	it('rejects a notfound value the API does not accept', async () => {
		await expect(
			invoke(Users.update, { id: '1', name: 'x', notfound: 'create' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('deletes a user and refuses a delete that answers a body', async () => {
		respondEmpty(fetchMock);
		await expect(invoke(Users.remove, { id: '15294233' })).resolves.toEqual({
			id: '15294233',
			deleted: true,
		});

		fetchMock.mockResolvedValueOnce(
			new Response('<html>error</html>', {
				status: 200,
				headers: { 'Content-Type': 'text/html' },
			}),
		);
		await expect(invoke(Users.remove, { id: '1' })).rejects.toThrow(
			/unexpected body/,
		);
	});
});

describe('bookings', () => {
	it('lists with schedule_id, window and limit in the query', async () => {
		respond(fetchMock, [resourceBooking]);

		const result = (await invoke(Bookings.list, {
			schedule_id: 858435,
			start: '2026-12-01 00:00',
			finish: '2026-12-03 00:00',
			limit: 10,
		})) as BookingsListResponse;

		expect(lastRequest(fetchMock)).toMatchObject({
			path: '/api/bookings.json',
			query: {
				schedule_id: '858435',
				start: '2026-12-01 00:00',
				finish: '2026-12-03 00:00',
				limit: '10',
			},
		});
		expect(result).toHaveLength(1);
	});

	it('gets one booking with schedule_id in the query', async () => {
		respond(fetchMock, booking);

		const result = (await invoke(Bookings.get, {
			schedule_id: 858436,
			booking_id: 153818785,
		})) as { slot_id: number };

		expect(lastRequest(fetchMock)).toMatchObject({
			path: '/api/bookings/153818785.json',
			query: { schedule_id: '858436' },
		});
		expect(result.slot_id).toBe(74660627);
	});

	it('creates with schedule_id, user_id and webhook in the query, not the document', async () => {
		respondCreated('https://www.supersaas.com/api/bookings/153818785.json');

		const result = await invoke(Bookings.create, {
			schedule_id: 858436,
			slot_id: 74660627,
			user_id: 15294233,
			webhook: true,
			full_name: 'Jane Smith',
			email: 'jane@example.com',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.query).toEqual({
			schedule_id: '858436',
			user_id: '15294233',
			webhook: 'true',
		});
		expect(sent.body).toEqual({
			booking: {
				slot_id: '74660627',
				full_name: 'Jane Smith',
				email: 'jane@example.com',
			},
		});
		expect(result).toMatchObject({ created: true, id: '153818785' });
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('jane@');
	});

	it('creates a resource booking with start and finish', async () => {
		respondCreated('https://www.supersaas.com/api/bookings/121573357.json');

		await invoke(Bookings.create, {
			schedule_id: 858435,
			start: '2026-12-01 10:00',
			finish: '2026-12-01 11:00',
		});

		expect(lastRequest(fetchMock).body).toEqual({
			booking: { start: '2026-12-01 10:00', finish: '2026-12-01 11:00' },
		});
	});

	it('rejects a booking that names neither times nor a slot, or both', async () => {
		await expect(invoke(Bookings.create, { schedule_id: 1 })).rejects.toThrow();
		await expect(
			invoke(Bookings.create, {
				schedule_id: 1,
				slot_id: 2,
				start: '2026-12-01 10:00',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('updates and deletes with schedule_id and accepts the empty answers', async () => {
		respondEmpty(fetchMock);
		await expect(
			invoke(Bookings.update, {
				schedule_id: 858436,
				booking_id: '153818785',
				full_name: 'Jane Q',
			}),
		).resolves.toEqual({ id: '153818785', updated: true });
		expect(lastRequest(fetchMock)).toMatchObject({
			method: 'PUT',
			query: { schedule_id: '858436' },
			body: { booking: { full_name: 'Jane Q' } },
		});

		respondEmpty(fetchMock);
		await expect(
			invoke(Bookings.remove, { schedule_id: 858436, booking_id: '153818785' }),
		).resolves.toEqual({ id: '153818785', deleted: true });
		expect(lastRequest(fetchMock)).toMatchObject({
			method: 'DELETE',
			query: { schedule_id: '858436' },
		});
	});
});

describe('slots', () => {
	it('lists with the window as start and finish, and paging', async () => {
		respond(fetchMock, [slot]);

		await invoke(Slots.list, {
			schedule_id: 858436,
			from: '2026-12-02 00:00',
			to: '2026-12-03 00:00',
			limit: 10,
			offset: 10,
		});

		expect(lastRequest(fetchMock).query).toEqual({
			schedule_id: '858436',
			start: '2026-12-02 00:00',
			finish: '2026-12-03 00:00',
			limit: '10',
			offset: '10',
		});
	});

	it('creates with schedule_id in the query and reads the Location id', async () => {
		respondCreated('https://www.supersaas.com/api/slots/74660627.json');

		const result = await invoke(Slots.create, {
			schedule_id: 858436,
			start: '2026-12-02 10:00',
			finish: '2026-12-02 11:00',
			capacity: 2,
		});

		expect(lastRequest(fetchMock).query).toEqual({ schedule_id: '858436' });
		expect(lastRequest(fetchMock).body).toEqual({
			slot: {
				start: '2026-12-02 10:00',
				finish: '2026-12-02 11:00',
				capacity: 2,
			},
		});
		expect(result).toMatchObject({ id: '74660627' });
	});

	it('gets, updates to capacity 0 and deletes with schedule_id', async () => {
		respond(fetchMock, slot);
		await invoke(Slots.get, { schedule_id: 858436, slot_id: 74660627 });
		expect(lastRequest(fetchMock).query).toEqual({ schedule_id: '858436' });

		respondEmpty(fetchMock);
		await expect(
			invoke(Slots.update, {
				schedule_id: 858436,
				slot_id: 74660627,
				capacity: 0,
			}),
		).resolves.toEqual({ id: '74660627', updated: true });
		expect(lastRequest(fetchMock).body).toEqual({ slot: { capacity: 0 } });

		respondEmpty(fetchMock);
		await expect(
			invoke(Slots.remove, { schedule_id: 858436, slot_id: 74660627 }),
		).resolves.toEqual({ id: '74660627', deleted: true });
	});
});

describe('schedules', () => {
	it('reads changes in the bookings envelope with paging', async () => {
		respond(fetchMock, bookingsEnvelope);

		const result = (await invoke(Schedules.changes, {
			schedule_id: 858436,
			limit: 5,
			offset: 5,
		})) as SupersaasScheduleRead;

		expect(lastRequest(fetchMock)).toMatchObject({
			path: '/api/changes/858436.json',
			query: { limit: '5', offset: '5' },
		});
		expect(result.bookings).toHaveLength(1);
	});

	it('accepts the documented waitlist marker "W"', async () => {
		respond(fetchMock, { bookings: [{ ...booking, waitlisted: 'W' }] });

		const result = (await invoke(Schedules.changes, {
			schedule_id: 858436,
		})) as SupersaasScheduleRead;

		expect(result.bookings?.[0]?.waitlisted).toBe('W');
	});

	it('reads a capacity range in the slots envelope', async () => {
		respond(fetchMock, slotsEnvelope);

		const result = (await invoke(Schedules.range, {
			schedule_id: 858436,
			from: '2026-12-01 00:00',
		})) as SupersaasScheduleRead;

		expect(lastRequest(fetchMock).path).toBe('/api/range/858436.json');
		expect(result.slots).toHaveLength(1);
	});

	it('sends the stored account name on a cross-schedule agenda and logs no user', async () => {
		respond(fetchMock, bookingsEnvelope);

		await invoke(Schedules.agenda, { user: 'jane@example.com' });

		expect(lastRequest(fetchMock)).toMatchObject({
			path: '/api/agenda.json',
			query: { user: 'jane@example.com', account: ACCOUNT },
		});
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('jane@');
	});

	it('reads free spaces with maxresults', async () => {
		respond(fetchMock, slotsEnvelope);

		await invoke(Schedules.free, {
			schedule_id: 858435,
			from: '2026-12-02 08:00',
			maxresults: 3,
		});

		expect(lastRequest(fetchMock)).toMatchObject({
			path: '/api/free/858435.json',
			query: { from: '2026-12-02 08:00', maxresults: '3' },
		});
	});
});

describe('client error handling', () => {
	it('lets core ApiError through without the sent body', async () => {
		respond(
			fetchMock,
			{ errors: [{ status: '422', title: 'Name has already been taken' }] },
			422,
		);

		const error = await caught(
			invoke(Users.create, {
				name: 'jane@example.com',
				password: 'hunter2-secret',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(422);
		expect((error as ApiError).request.method).toBe('POST');
		const text = `${inspect(error, { depth: 6 })} ${JSON.stringify(error)}`;
		expect(text).not.toContain('hunter2-secret');
		expect(text).not.toContain('jane@example.com');
		expect(text).not.toContain(API_KEY);
	});
});

describe('agenda errors', () => {
	it('masks the user login name on a failed agenda read', async () => {
		respond(
			fetchMock,
			{ errors: [{ status: '404', title: 'Not found' }] },
			404,
		);

		const error = (await caught(
			invoke(Schedules.agenda, { schedule_id: 1, user: 'jane@example.com' }),
		)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(404);
		const text = `${JSON.stringify(error)} ${error.url} ${error.request.url}`;
		expect(text).not.toContain('jane');
	});

	it('passes a read error with no personal data through unchanged', async () => {
		respond(
			fetchMock,
			{ errors: [{ status: '404', title: 'Not found' }] },
			404,
		);

		const error = (await caught(
			invoke(Bookings.get, { schedule_id: 1, booking_id: 2 }),
		)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.message).toBe('Not Found');
	});
});

describe('credentials', () => {
	it('throws AuthMissingError when no account name is stored', async () => {
		const { AuthMissingError } = jest.requireActual('corsair/core');

		await expect(
			Users.list(
				{
					key: API_KEY,
					options: {},
					keys: { get_account_name: jest.fn().mockResolvedValue(null) },
				} as never,
				{} as never,
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
