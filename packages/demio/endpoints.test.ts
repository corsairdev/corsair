import { logEventFromContext } from 'corsair/core';
import { DemioAPIError, packDemioCredentials } from './client';
import { Events, Ping, Registrations, Reports } from './endpoints';
import {
	eventDate,
	eventDetail,
	eventNotFound,
	eventSummary,
	onDemandDateDetail,
	onDemandDateInEvent,
	participants,
	pingSandbox,
	pong,
	registrationResult,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const CREDENTIALS = { apiKey: 'demio-key', apiSecret: 'demio-secret' };
const PACKED_KEY = packDemioCredentials(CREDENTIALS);

// unknown: parameters are never, so every concrete endpoint assigns to this
// type by contravariance. The shared return is the raw envelope, and the schema
// under test is what decides each endpoint's real shape.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context carries only what the endpoints read: `key` and the
	// logging helpers the call wrapper touches.
	return endpoint({ key: PACKED_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the body is whatever the endpoint serialised.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.headers.get('api-key')).toBe(CREDENTIALS.apiKey);
	expect(sent.headers.get('api-secret')).toBe(CREDENTIALS.apiSecret);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('events.list', () => {
	it('GETs /events without a type filter and keeps every event', async () => {
		respond([eventSummary, { ...eventSummary, id: 87, date_id: 1576 }]);

		const result = await invoke(Events.list, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v1/events',
			method: 'GET',
			query: {},
		});
		expect(result).toHaveLength(2);
	});

	it('sends the documented type filter', async () => {
		respond([eventSummary]);

		await invoke(Events.list, { type: 'upcoming' });

		expect(lastRequest().query).toEqual({ type: 'upcoming' });
	});

	// The recorded event has `description: null` and `automated: null`, and the
	// list must parse it rather than requiring either to be a string.
	it('accepts an event whose optional fields are null', async () => {
		respond([eventSummary]);

		const result = (await invoke(Events.list, {})) as (typeof eventSummary)[];

		expect(result[0]?.id).toBe(eventSummary.id);
		expect(result[0]?.description).toBeNull();
		expect(result[0]?.automated).toBeNull();
	});

	it('rejects a status value outside the documented filter', async () => {
		await expect(invoke(Events.list, { type: 'cancelled' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('fails when the body is not an array of events', async () => {
		respond({ events: [eventSummary] });

		await expect(invoke(Events.list, {})).rejects.toThrow();
	});
});

describe('events.get', () => {
	it('GETs /event/{id} and returns the event with its dates', async () => {
		respond(eventDetail);

		const result = await invoke(Events.get, { id: 86 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v1/event/86',
			method: 'GET',
			query: {},
		});
		expect(result).toEqual(eventDetail);
	});

	// Demio reads any value other than `false` as `true`, so an unset filter has
	// to be absent rather than sent as `active=false`.
	it('sends active=true only when the caller asked for it', async () => {
		respond(eventDetail);

		await invoke(Events.get, { id: 86, active: true });

		expect(lastRequest().query).toEqual({ active: 'true' });
	});

	it('omits active when it is false rather than sending the string', async () => {
		respond(eventDetail);

		await invoke(Events.get, { id: 86, active: false });

		expect(lastRequest().query).toEqual({});
	});

	// An on-demand date reports nulls inside the event, which is the one shape
	// where three documented fields are legitimately empty.
	it('accepts an on-demand date whose time fields are all null', async () => {
		respond({
			...eventDetail,
			dates: [onDemandDateInEvent],
			next_date_id: null,
		});

		const result = (await invoke(Events.get, { id: 86 })) as {
			dates: (typeof onDemandDateInEvent)[];
		};

		expect(result.dates[0]?.timestamp).toBeNull();
		expect(result.dates[0]?.status).toBe('on-demand');
	});

	// 404 means the event is the caller's but no date matched, e.g. active=true
	// on an event whose dates have all finished.
	it('surfaces a 404 with no date matched as a DemioAPIError', async () => {
		respond(eventNotFound, 404);

		await expect(invoke(Events.get, { id: 86, active: true })).rejects.toThrow(
			DemioAPIError,
		);
	});
});

describe('events.getDate', () => {
	it('GETs /event/{id}/date/{date_id} and returns the date', async () => {
		respond(eventDate);

		const result = await invoke(Events.getDate, { id: 86, date_id: 1575 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v1/event/86/date/1575',
			method: 'GET',
		});
		expect(result).toEqual(eventDate);
	});

	// The detail endpoint reports an on-demand date as running with a live
	// timestamp, unlike the same date inside events.get.
	it('accepts an on-demand date reported as running', async () => {
		respond(onDemandDateDetail);

		const result = (await invoke(Events.getDate, {
			id: 86,
			date_id: 1604,
		})) as typeof onDemandDateDetail;

		expect(result.status).toBe('running');
	});

	it('requires a date id', async () => {
		await expect(invoke(Events.getDate, { id: 86 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('registrations.create', () => {
	it('POSTs /event/register and returns the join link', async () => {
		respond(registrationResult, 201);

		const result = await invoke(Registrations.create, {
			id: 86,
			name: 'Jane Doe',
			email: 'jane@example.com',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v1/event/register',
			method: 'POST',
			body: { id: 86, name: 'Jane Doe', email: 'jane@example.com' },
		});
		expect(result).toEqual(registrationResult);
	});

	it('accepts a registration page link instead of an id', async () => {
		respond(registrationResult, 201);

		await invoke(Registrations.create, {
			ref_url: 'https://my.demio.com/ref/nI7XKRaVfZdj9CyQ',
			name: 'Jane Doe',
			email: 'jane@example.com',
		});

		expect(lastRequest().body).toEqual({
			ref_url: 'https://my.demio.com/ref/nI7XKRaVfZdj9CyQ',
			name: 'Jane Doe',
			email: 'jane@example.com',
		});
	});

	it('sends date_id only when the caller chose one', async () => {
		respond(registrationResult, 201);

		await invoke(Registrations.create, {
			id: 86,
			date_id: 1575,
			name: 'Jane Doe',
			email: 'jane@example.com',
		});

		expect(lastRequest().body).toMatchObject({ id: 86, date_id: 1575 });
	});

	// Demio rejects a body that identifies the event by neither, so the check
	// happens before a request is spent on it.
	it('rejects a body with neither id nor ref_url without calling the API', async () => {
		await expect(
			invoke(Registrations.create, {
				name: 'Jane Doe',
				email: 'jane@example.com',
			}),
		).rejects.toThrow(/id.*ref_url|ref_url.*id/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an address that is not an email', async () => {
		await expect(
			invoke(Registrations.create, { id: 86, name: 'Jane Doe', email: 'nope' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty name', async () => {
		await expect(
			invoke(Registrations.create, {
				id: 86,
				name: '',
				email: 'jane@example.com',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	// The name and address belong to a real person and an event log outlives the
	// call, so neither may reach it.
	it('logs the registration without the name or the email', async () => {
		respond(registrationResult, 201);

		await invoke(Registrations.create, {
			id: 86,
			date_id: 1575,
			name: 'Jane Doe',
			email: 'jane@example.com',
		});

		const logged = JSON.stringify(mockLog.mock.calls.at(-1));
		expect(logged).not.toContain('Jane Doe');
		expect(logged).not.toContain('jane@example.com');
	});
});

describe('reports.participants', () => {
	it('GETs /report/{date_id}/participants and returns every participant', async () => {
		respond(participants);

		const result = await invoke(Reports.participants, { date_id: 1575 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v1/report/1575/participants',
			method: 'GET',
			query: {},
		});
		expect(result).toEqual(participants);
	});

	// The filter is hyphenated and the returned status is not, so a filter value
	// sent verbatim must still leave the response parseable.
	it('sends the hyphenated filter spelling', async () => {
		respond(participants);

		await invoke(Reports.participants, {
			date_id: 1575,
			status: 'did-not-attend',
		});

		expect(lastRequest().query).toEqual({ status: 'did-not-attend' });
	});

	it('accepts the spaced status the response returns', async () => {
		respond({
			participants: [
				{
					...participants.participants[0],
					status: 'did not attend',
					attended: false,
				},
			],
		});

		const result = (await invoke(Reports.participants, {
			date_id: 1575,
		})) as typeof participants;

		expect(result.participants[0]?.status).toBe('did not attend');
	});

	it('rejects the spaced spelling as a filter value', async () => {
		await expect(
			invoke(Reports.participants, { date_id: 1575, status: 'did not attend' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	// A body missing the wrapper would otherwise look like an empty page.
	it('fails when the participants wrapper is absent', async () => {
		respond({ participants: undefined });

		await expect(
			invoke(Reports.participants, { date_id: 1575 }),
		).rejects.toThrow();
	});

	it('fails when the answer is a bare array', async () => {
		respond([participants.participants[0]]);

		await expect(
			invoke(Reports.participants, { date_id: 1575 }),
		).rejects.toThrow();
	});
});

describe('ping.check', () => {
	it('GETs /ping and reports the accepted credentials', async () => {
		respond(pong);

		const result = await invoke(Ping.check, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v1/ping',
			method: 'GET',
		});
		expect(result).toEqual(pong);
	});

	it('keeps the sandbox marker when the account is one', async () => {
		respond(pingSandbox);

		expect(await invoke(Ping.check, {})).toEqual(pingSandbox);
	});

	// /ping reports a rejected credential in its own body as a 401, which the
	// client surfaces like any other failure rather than as pong: false.
	it('throws on a rejected credential instead of returning pong false', async () => {
		respond({ pong: false, messages: ['Authorization failed'] }, 401);

		await expect(invoke(Ping.check, {})).rejects.toThrow(DemioAPIError);
	});
});

describe('logging', () => {
	it('records a completed event naming the operation', async () => {
		respond([eventSummary]);

		await invoke(Events.list, { type: 'upcoming' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'demio.events.list',
			expect.objectContaining({ events: 1 }),
			'completed',
		);
	});
});
