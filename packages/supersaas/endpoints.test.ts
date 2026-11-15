import { logEventFromContext } from 'corsair/core';
import { jsonPath, SupersaasAPIError, segment } from './client';
import { Bookings, Schedules, Slots, Users } from './endpoints';
import type { UnknownJson } from './json';
import { booking, change, freeSpace, slot, user } from './test-fixtures';
import {
	lastRequest,
	respond,
	respondCreated,
	respondEmpty,
} from './test-helpers';

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

function invoke(endpoint: AnyEndpoint, input: UnknownJson) {
	return endpoint(
		{ key: API_KEY, options: { accountName: ACCOUNT } } as never,
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

/**
 * SuperSaaS authenticates with HTTP Basic: the account name is the username and
 * the API key the password. Every route also carries `.json`.
 */
function expectBasicAuthAndJson() {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://www.supersaas.com');
	expect(sent.headers.get('authorization')).toMatch(/^Basic /);
	const decoded = Buffer.from(
		(sent.headers.get('authorization') ?? '').replace('Basic ', ''),
		'base64',
	).toString();
	expect(decoded).toBe(`${ACCOUNT}:${API_KEY}`);
	// Without `.json` SuperSaaS answers XML.
	expect(sent.path.endsWith('.json')).toBe(true);
}

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
	it('lists with the paging query', async () => {
		respond(fetchMock, [user]);

		const result = await invoke(Users.list, { limit: 50, offset: 100 });

		expectBasicAuthAndJson();
		expect(lastRequest(fetchMock).path).toBe('/api/users.json');
		expect(lastRequest(fetchMock).query).toEqual({
			limit: '50',
			offset: '100',
		});
		expect(result).toEqual([user]);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'supersaas.users.list',
			{ count: 1 },
			'completed',
		);
	});

	it('gets one user by id or foreign key', async () => {
		respond(fetchMock, user);

		expect(await invoke(Users.get, { id: '567fk' })).toEqual(user);
		expect(lastRequest(fetchMock).path).toBe('/api/users/567fk.json');
	});

	it('creates a user and reports the key, because 201 carries no body', async () => {
		respondCreated(fetchMock);

		const result = await invoke(Users.create, {
			name: 'jane@example.com',
			full_name: 'Jane Smith',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/users.json');
		// SuperSaaS wraps the document in a `user` key.
		expect(sent.body).toEqual({
			user: { name: 'jane@example.com', full_name: 'Jane Smith' },
		});
		expect(result).toEqual({
			created: true,
			key: 'jane@example.com',
			id: undefined,
		});
	});

	it('rejects a user with no name, the only required field', async () => {
		await expect(invoke(Users.create, { email: 'a@b.c' })).rejects.toThrow(
			/name/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates under a caller-supplied key', async () => {
		respondCreated(fetchMock);

		const result = await invoke(Users.createWithKey, {
			key: '567fk',
			name: 'jane@example.com',
		});

		expect(lastRequest(fetchMock).path).toBe('/api/users/567fk.json');
		expect(result).toMatchObject({ created: true, key: '567fk' });
	});

	it('updates with the notfound policy as a query parameter', async () => {
		respond(fetchMock, user);

		await invoke(Users.update, {
			id: '123456',
			name: 'jane@example.com',
			notfound: 'error',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.query).toEqual({ notfound: 'error' });
		expect(sent.body).toEqual({ user: { name: 'jane@example.com' } });
	});

	it('rejects a notfound value the API does not accept', async () => {
		await expect(
			invoke(Users.update, {
				id: '123456',
				name: 'jane@example.com',
				notfound: 'create',
			}),
		).rejects.toThrow(/notfound/);
	});

	it('rejects a role outside 3, 4 and -1', async () => {
		await expect(
			invoke(Users.create, { name: 'jane@example.com', role: 1 }),
		).rejects.toThrow(/role/);
	});

	it('deletes a user and reports the id', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Users.remove, { id: '123456' });

		expect(lastRequest(fetchMock)).toMatchObject({
			method: 'DELETE',
			path: '/api/users/123456.json',
		});
		expect(result).toEqual({ id: '123456', deleted: true });
	});

	it('throws when a delete answers a body, so an error page is not read as success', async () => {
		respond(fetchMock, { error: 'nope' });

		await expect(invoke(Users.remove, { id: '123456' })).rejects.toThrow(
			/answered a delete with a body/,
		);
	});
});

describe('bookings', () => {
	it('lists for a schedule with the user filter', async () => {
		respond(fetchMock, [booking]);

		await invoke(Bookings.list, { schedule_id: 42, user_id: '123456' });

		expect(lastRequest(fetchMock).path).toBe('/api/bookings.json');
		expect(lastRequest(fetchMock).query).toEqual({
			schedule_id: '42',
			user_id: '123456',
		});
	});

	it('gets one booking', async () => {
		respond(fetchMock, booking);

		expect(await invoke(Bookings.get, { booking_id: '987654' })).toEqual(
			booking,
		);
		expect(lastRequest(fetchMock).path).toBe('/api/bookings/987654.json');
	});

	it('creates a resource booking with start and finish', async () => {
		respondCreated(fetchMock);

		const result = await invoke(Bookings.create, {
			schedule_id: 42,
			start: '2026-03-10 09:00:00',
			finish: '2026-03-10 09:30:00',
			full_name: 'Jane Smith',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		// SuperSaaS wraps the document in a `booking` key.
		expect(sent.body).toEqual({
			booking: {
				schedule_id: 42,
				start: '2026-03-10 09:00:00',
				finish: '2026-03-10 09:30:00',
				full_name: 'Jane Smith',
			},
		});
		expect(result).toMatchObject({ created: true, key: '42' });
	});

	it('creates a capacity booking from a slot id instead of times', async () => {
		respondCreated(fetchMock);

		await invoke(Bookings.create, { schedule_id: 42, slot_id: '555' });

		expect(lastRequest(fetchMock).body).toEqual({
			booking: { schedule_id: 42, slot_id: '555' },
		});
	});

	it('rejects a booking that names neither times nor a slot', async () => {
		await expect(invoke(Bookings.create, { schedule_id: 42 })).rejects.toThrow(
			/start and finish for a resource schedule, or slot_id/,
		);
	});

	it('rejects a booking that names both a slot and times', async () => {
		await expect(
			invoke(Bookings.create, {
				schedule_id: 42,
				slot_id: '555',
				start: '2026-03-10 09:00:00',
			}),
		).rejects.toThrow(/slot_id instead of start and finish/);
	});

	it('passes user_id as a query parameter, since it is not part of the document', async () => {
		respondCreated(fetchMock);

		await invoke(Bookings.create, {
			schedule_id: 42,
			slot_id: '555',
			user_id: '123456',
		});

		expect(lastRequest(fetchMock).query).toEqual({ user_id: '123456' });
	});

	it('updates and deletes', async () => {
		respond(fetchMock, booking);
		await invoke(Bookings.update, {
			booking_id: '987654',
			schedule_id: 42,
			start: '2026-03-10 10:00:00',
		});
		expect(lastRequest(fetchMock)).toMatchObject({ method: 'PUT' });

		respondEmpty(fetchMock);
		expect(await invoke(Bookings.remove, { booking_id: '987654' })).toEqual({
			id: '987654',
			deleted: true,
		});
	});
});

describe('slots', () => {
	it('lists slots in a window', async () => {
		respond(fetchMock, [slot]);

		await invoke(Slots.list, {
			schedule_id: 42,
			from: '2026-03-10',
			to: '2026-03-11',
		});

		expect(lastRequest(fetchMock).query).toEqual({
			schedule_id: '42',
			from: '2026-03-10',
			to: '2026-03-11',
		});
	});

	it('gets, creates, updates and deletes', async () => {
		respond(fetchMock, slot);
		await invoke(Slots.get, { slot_id: '555' });
		expect(lastRequest(fetchMock).path).toBe('/api/slots/555.json');

		respondCreated(fetchMock);
		await invoke(Slots.create, {
			schedule_id: 42,
			start: '2026-03-10 09:00:00',
			finish: '2026-03-10 10:00:00',
			capacity: 10,
		});
		expect(lastRequest(fetchMock).body).toEqual({
			slot: {
				schedule_id: 42,
				start: '2026-03-10 09:00:00',
				finish: '2026-03-10 10:00:00',
				capacity: 10,
			},
		});

		respond(fetchMock, slot);
		await invoke(Slots.update, {
			slot_id: '555',
			schedule_id: 42,
			start: '2026-03-10 09:00:00',
			finish: '2026-03-10 10:00:00',
		});
		expect(lastRequest(fetchMock).method).toBe('PUT');

		respondEmpty(fetchMock);
		await invoke(Slots.remove, { slot_id: '555' });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('rejects a slot with no capacity floor below one', async () => {
		await expect(
			invoke(Slots.create, {
				schedule_id: 42,
				start: '2026-03-10 09:00:00',
				finish: '2026-03-10 10:00:00',
				capacity: 0,
			}),
		).rejects.toThrow(/capacity/);
	});
});

describe('schedules', () => {
	it('reads changes since a time', async () => {
		respond(fetchMock, [change]);

		const result = await invoke(Schedules.changes, {
			schedule_id: 42,
			from: '2026-03-01',
		});

		expect(lastRequest(fetchMock).path).toBe('/api/changes/42.json');
		expect(lastRequest(fetchMock).query).toEqual({ from: '2026-03-01' });
		expect(result).toEqual([change]);
	});

	it('reads appointments in a range', async () => {
		respond(fetchMock, [booking]);

		await invoke(Schedules.range, {
			schedule_id: 42,
			from: '2026-03-01',
			to: '2026-03-31',
		});

		expect(lastRequest(fetchMock).path).toBe('/api/range/42.json');
	});

	it('reads one user agenda with the schedule in the path', async () => {
		respond(fetchMock, [booking]);

		await invoke(Schedules.agenda, { schedule_id: 42, user: '123456' });

		expect(lastRequest(fetchMock).path).toBe('/api/agenda/42.json');
		expect(lastRequest(fetchMock).query).toEqual({ user: '123456' });
	});

	it('reads a cross-schedule agenda with the account in the query', async () => {
		respond(fetchMock, [booking]);

		await invoke(Schedules.agenda, { user: '0' });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/agenda.json');
		// Without a schedule SuperSaaS needs the account instead.
		expect(sent.query).toEqual({ user: '0', account: ACCOUNT });
	});

	it('reads free spaces', async () => {
		respond(fetchMock, [freeSpace]);

		const result = await invoke(Schedules.free, {
			schedule_id: 42,
			from: '2026-03-10',
		});

		expect(lastRequest(fetchMock).path).toBe('/api/free/42.json');
		expect(lastRequest(fetchMock).query).toEqual({ from: '2026-03-10' });
		expect(result).toEqual([freeSpace]);
	});
});

describe('client error handling', () => {
	it('reads a plain-text 401 and keeps the credentials out of util.inspect', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('HTTP Basic: Access denied.', {
				status: 401,
				headers: { 'Content-Type': 'text/html' },
			}),
		);
		const util = await import('node:util');

		const error = await invoke(Users.list, {}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(SupersaasAPIError);
		const failure = error as SupersaasAPIError;
		expect(failure.status).toBe(401);
		expect(failure.reason).toBe('HTTP Basic: Access denied.');
		expect(failure.isAuthError).toBe(true);
		expect(failure.message).toContain('HTTP Basic: Access denied.');
		const inspected = util.inspect(error);
		expect(inspected).not.toContain(API_KEY);
		expect(inspected).not.toContain(ACCOUNT);
		expect(failure.message).not.toContain(API_KEY);
	});

	it('reads a 404 as not found', () => {
		expect(new SupersaasAPIError('x', { status: 404 }).isNotFound).toBe(true);
	});
});

describe('credentials', () => {
	it('reads the account name from the account when the option is absent', async () => {
		respond(fetchMock, [user]);

		await Users.list(
			{
				key: API_KEY,
				options: {},
				keys: {
					get_account_name: jest.fn().mockResolvedValue('stored-account'),
				},
			} as never,
			{} as never,
		);

		const decoded = Buffer.from(
			(lastRequest(fetchMock).headers.get('authorization') ?? '').replace(
				'Basic ',
				'',
			),
			'base64',
		).toString();
		expect(decoded).toBe(`stored-account:${API_KEY}`);
	});

	it('throws a clear error when no account name is configured', async () => {
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
