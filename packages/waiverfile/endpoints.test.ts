import { logEventFromContext } from 'corsair/core';
import { WaiverFileAPIError } from './client';
import {
	EventCategories,
	Events,
	Forms,
	Site,
	Subscribers,
	Waivers,
	Webhooks,
} from './endpoints';
import type {
	CategoriesResponse,
	EventResponse,
	EventsResponse,
	EventsWaiversResponse,
	FormsResponse,
	SiteGetResponse,
	WaiverResponse,
	WaiversListResponse,
} from './endpoints/types';
import {
	categoriesResponse,
	categoryID,
	categoryResponse,
	dataRows,
	emptyWaiverList,
	eventID,
	eventResponse,
	eventsResponse,
	eventWaiversResponse,
	formID,
	formsResponse,
	invalidKey,
	invalidKeyOnRoute,
	oneWaiverList,
	routeNotFound,
	secondWaiverID,
	siteID,
	siteResponse,
	twoWaiverList,
	upcomingResponse,
	waiverID,
	waiverResponse,
} from './test-fixtures';
import {
	API_KEY,
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	respond,
	respondText,
	SITE_ID,
} from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const fetchMock = installFetchMock();

beforeEach(() => {
	mockLog.mockClear();
});

function lastLog() {
	return mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
}

const range = {
	startDate: '2026-11-01T00:00:00',
	endDate: '2026-11-30T23:59:59',
};
const utcRange = {
	startDateUTC: '2026-11-01T00:00:00',
	endDateUTC: '2026-11-30T23:59:59',
};

describe('site and ping', () => {
	it('pings with both credentials on the query and returns the bare string as Message', async () => {
		// The live body is the JSON string "Service online", not an object.
		respond(fetchMock, 'Service online');

		const result = await invoke(Site.ping, {});

		expect(result).toEqual({ Message: 'Service online' });
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v1/Ping');
	});

	it('flattens the site and drops its megabyte of labels', async () => {
		respond(fetchMock, siteResponse);

		const result = (await invoke(Site.get, {})) as SiteGetResponse;

		expect(result).toMatchObject({
			ID: siteID,
			Name: 'Twin Harbor Adventures',
			Url: 'TwinHarbor',
			DefaultTimezone: 'America/New_York',
		});
		expect(result).not.toHaveProperty('Labels');
		expect(result).not.toHaveProperty('LabelData');
		expect(result).not.toHaveProperty('me');
		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetSiteDetails');
		expect(lastLog()).toMatchObject({ id: siteID });
	});

	it('surfaces a bad key on Ping, which is a 400 rather than a 401', async () => {
		respond(fetchMock, invalidKey, 400);

		const error = (await invoke(Site.ping, {}).catch(
			(thrown: unknown) => thrown,
		)) as WaiverFileAPIError;

		expect(error).toBeInstanceOf(WaiverFileAPIError);
		expect(error.status).toBe(400);
		expect(error.isAuthError).toBe(true);
	});

	it('treats the bare Invalid every other route sends as an auth failure', async () => {
		respond(fetchMock, invalidKeyOnRoute, 400);

		const error = (await invoke(Forms.active, {}).catch(
			(thrown: unknown) => thrown,
		)) as WaiverFileAPIError;

		expect(error.isAuthError).toBe(true);
	});

	it('refuses a key that is not the documented pair, before any request', async () => {
		await expect(
			Site.ping({ key: API_KEY } as never, {} as never),
		).rejects.toThrow('must hold the API key and the site ID');
	});
});

describe('waivers', () => {
	it('unwraps one waiver from its top-level Waiver property', async () => {
		respond(fetchMock, waiverResponse);

		const result = (await invoke(Waivers.get, { waiverID })) as WaiverResponse;

		expect(result.WaiverID).toBe(waiverID);
		expect(result.SignedNameFirst).toBe('Jordan');
		// XML converted to JSON: booleans arrive as strings.
		expect(result.HasSignature).toBe('true');
		expect(result.CustomFields).toEqual({ 'T-shirt size': 'M' });
		expect(result).not.toHaveProperty('@xmlns:xsd');
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v1/GetWaiver');
		expect(sent.query.waiverID).toBe(waiverID);
		expect(sent.query.apiKey).toBe(API_KEY);
	});

	it('returns a single participant as an array, keeping the Particpants spelling', async () => {
		// One participant converts from XML as an object, not an array.
		respond(fetchMock, waiverResponse);

		const result = (await invoke(Waivers.get, { waiverID })) as WaiverResponse;

		expect(result.Particpants).toHaveLength(1);
		expect(result.Particpants?.[0]?.ParticipantNameFirst).toBe('Jordan');
	});

	it('never logs the email, phone or date of birth', async () => {
		respond(fetchMock, waiverResponse);

		await invoke(Waivers.get, { waiverID });

		const logged = lastLog();
		expect(logged).not.toHaveProperty('Email');
		expect(logged).not.toHaveProperty('Phone');
		expect(logged).not.toHaveProperty('DOB');
		expect(logged).toMatchObject({ participants: 1, signed: true });
	});

	it('reads the lite form from GetWaiverLite', async () => {
		respond(fetchMock, waiverResponse);

		const result = (await invoke(Waivers.getLite, {
			waiverID,
		})) as WaiverResponse;

		expect(result.WaiverID).toBe(waiverID);
		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetWaiverLite');
	});

	it('turns a single search match, sent as an object, into a one-item list', async () => {
		respond(fetchMock, oneWaiverList);

		const result = (await invoke(Waivers.search, {
			terms: 'Ruiz',
		})) as WaiversListResponse;

		expect(result.Waivers?.map((waiver) => waiver.WaiverID)).toEqual([
			waiverID,
		]);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/SearchWaivers');
		expect(sent.query.terms).toBe('Ruiz');
		expect(lastLog()).toEqual({ count: 1 });
	});

	it('returns an empty list when ArrayOfWaiver holds only its namespaces', async () => {
		respond(fetchMock, emptyWaiverList);

		await expect(
			invoke(Waivers.byReference, { refIDAny: 'ORDER-42' }),
		).resolves.toEqual({ Waivers: [] });
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/GetWaiversByReferenceID');
		expect(sent.query.refIDAny).toBe('ORDER-42');
	});

	it('reports a search that failed with a 200 text body as an error', async () => {
		respond(fetchMock, 'Error running waiver search');

		await expect(invoke(Waivers.search, { terms: 'x' })).rejects.toThrow(
			'Error running waiver search',
		);
	});

	it('rejects a reference lookup with no reference at all', async () => {
		await expect(invoke(Waivers.byReference, {})).rejects.toThrow(
			'at least one of refID1, refID2, refID3 or refIDAny',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('pages the full waivers with a zero-based page index, as an array', async () => {
		respond(fetchMock, twoWaiverList);

		const result = (await invoke(Waivers.list, {
			...range,
			pageIndex: 0,
			pageSize: 50,
		})) as WaiversListResponse;

		expect(result.Waivers?.map((waiver) => waiver.WaiverID)).toEqual([
			waiverID,
			secondWaiverID,
		]);
		// Two participants arrive as an array already.
		expect(result.Waivers?.[1]?.Particpants).toHaveLength(2);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/GetAllWaiversByDateRange');
		expect(sent.query.pageIndex).toBe('0');
	});

	it('rejects a waiver page size above 500', async () => {
		await expect(
			invoke(Waivers.list, { ...range, pageIndex: 0, pageSize: 501 }),
		).rejects.toThrow();
	});

	it('pages the lite waivers', async () => {
		respond(fetchMock, oneWaiverList);

		const result = (await invoke(Waivers.listLite, {
			...range,
			pageIndex: 0,
			pageSize: 50,
		})) as WaiversListResponse;

		expect(result.Waivers).toHaveLength(1);
		expect(lastRequest(fetchMock).path).toBe(
			'/api/v1/GetAllWaiversByDateRangeLite',
		);
	});

	it('returns the bare number GetAllWaiversByDateRangePageCount answers as Count', async () => {
		respond(fetchMock, 2);

		await expect(invoke(Waivers.pageCount, range)).resolves.toEqual({
			Count: 2,
		});
		expect(lastRequest(fetchMock).path).toBe(
			'/api/v1/GetAllWaiversByDateRangePageCount',
		);
	});

	it('reads report rows from Table with a one-based page index', async () => {
		respond(fetchMock, dataRows);

		const result = (await invoke(Waivers.data, {
			...range,
			includeCustomColumns: true,
			consolidateParticipants: false,
			pageIndex: 1,
			pageSize: 100,
		})) as { Table?: Record<string, unknown>[] };

		expect(result.Table?.[0]).toMatchObject({ RowNum: 1, WaiverID: waiverID });
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/GetWaiverData');
		expect(sent.query.pageIndex).toBe('1');
		expect(sent.query.includeCustomColumns).toBe('true');
		expect(lastLog()).toMatchObject({ rows: 1 });
	});

	it('rejects a report page index of 0, which is the other endpoints convention', async () => {
		await expect(
			invoke(Waivers.data, {
				...range,
				includeCustomColumns: false,
				consolidateParticipants: false,
				pageIndex: 0,
				pageSize: 100,
			}),
		).rejects.toThrow();
	});

	it('counts the report rows from a bare number', async () => {
		respond(fetchMock, 1);

		await expect(invoke(Waivers.dataCount, range)).resolves.toEqual({
			Count: 1,
		});
		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetWaiverDataCount');
	});

	it('returns the PDF bytes, base64-encoded, with their real length', async () => {
		const pdf = '%PDF-1.4 fake waiver bytes';
		respondText(fetchMock, pdf, 'application/pdf');

		const result = (await invoke(Waivers.pdf, { waiverID })) as {
			waiverID: string;
			contentType: string;
			bytes: number;
			content: string;
		};

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/GetWaiverPDF');
		expect(result.waiverID).toBe(waiverID);
		expect(result.contentType).toBe('application/pdf');
		expect(result.bytes).toBe(Buffer.byteLength(pdf, 'utf8'));
		expect(Buffer.from(result.content, 'base64').toString('utf8')).toBe(pdf);
	});

	it('preserves binary bytes that are not valid UTF-8', async () => {
		// A byte sequence that UTF-8 decoding would replace, which is why the shared
		// transport could not be used for this endpoint.
		const binary = Buffer.from([0x25, 0x50, 0x44, 0x46, 0xff, 0xfe, 0x00]);
		fetchMock.mockResolvedValueOnce(
			new Response(binary, {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			}),
		);

		const result = (await invoke(Waivers.pdf, { waiverID })) as {
			bytes: number;
			content: string;
		};

		expect(result.bytes).toBe(binary.byteLength);
		expect(Buffer.from(result.content, 'base64').equals(binary)).toBe(true);
	});

	it('gives the PDF download a deadline', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('%PDF-', {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			}),
		);

		await invoke(Waivers.pdf, { waiverID });

		const init = fetchMock.mock.calls.at(-1)?.[1] as RequestInit;
		expect(init.signal).toBeInstanceOf(AbortSignal);
	});

	it('keeps a bad key on the PDF route recognisable as an auth error', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(invalidKeyOnRoute), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		const error = (await invoke(Waivers.pdf, { waiverID }).catch(
			(thrown: unknown) => thrown,
		)) as WaiverFileAPIError;

		expect(error).toBeInstanceOf(WaiverFileAPIError);
		expect(error.body).toEqual(invalidKeyOnRoute);
		expect(error.isAuthError).toBe(true);
	});
});

describe('forms', () => {
	it('flattens each form out of its .NET me block', async () => {
		respond(fetchMock, formsResponse);

		const result = (await invoke(Forms.active, {})) as FormsResponse;

		expect(result.WaiverForms?.[0]).toMatchObject({
			ID: formID,
			Name: 'Waiver Form',
			FieldRequire_Email: true,
			FieldInclude_Phone: false,
			Status: 0,
		});
		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetActiveWaiverForms');
		expect(lastLog()).toEqual({ count: 1 });
	});

	it('lists every form, including disabled ones', async () => {
		respond(fetchMock, formsResponse);

		const result = (await invoke(Forms.all, {})) as FormsResponse;

		expect(result.WaiverForms).toHaveLength(1);
		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetAllWaiverForms');
	});
});

describe('events', () => {
	it('flattens events from a bare array of .NET objects', async () => {
		respond(fetchMock, eventsResponse);

		const result = (await invoke(
			Events.byDateRange,
			utcRange,
		)) as EventsResponse;

		expect(result.Events?.[0]).toMatchObject({
			WaiverEventID: eventID,
			Name: 'Saturday open jump',
			CategoryID: categoryID,
			IsAllDay: false,
			ManagerIDs: ['a596a7fa-3d6a-40a4-b22b-e52635d4f371'],
			NumSignedWaivers: 0,
			TimeLabel: '12/01/2026 9:00 AM-12:00 PM',
			WaiverEventFormIDs: [{ WaiverEventID: eventID, WaiverFormID: formID }],
		});
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/GetEventsByDateRange');
		expect(sent.query.startDateUTC).toBe(utcRange.startDateUTC);
	});

	it('lists events in one category', async () => {
		respond(fetchMock, eventsResponse);

		const result = (await invoke(Events.byCategory, {
			eventCategoryID: categoryID,
			...utcRange,
		})) as EventsResponse;

		expect(result.Events).toHaveLength(1);
		expect(lastRequest(fetchMock).query.eventCategoryID).toBe(categoryID);
	});

	it('parses the twice-serialised upcoming events', async () => {
		// The body is a JSON string whose value is the JSON array.
		respond(fetchMock, upcomingResponse);

		const result = (await invoke(Events.upcoming, utcRange)) as EventsResponse;

		expect(result.Events?.[0]).toMatchObject({
			WaiverEventID: eventID,
			Name: 'Saturday open jump',
		});
		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetUpcomingEvents');
	});

	it('lists the waivers signed for an event, with typed values', async () => {
		respond(fetchMock, eventWaiversResponse);

		const result = (await invoke(Events.waivers, {
			waiverEventID: eventID,
		})) as EventsWaiversResponse;

		expect(result.Waivers?.[0]).toMatchObject({
			WaiverID: waiverID,
			WaiverEventID: eventID,
			HasSignature: true,
			Age: 41,
			DOB: '2/20/1985',
		});
		expect(result.Waivers?.[0]?.Participants).toHaveLength(1);
		expect(lastRequest(fetchMock).query.waiverEventID).toBe(eventID);
	});

	it('has no single-event read, because WaiverFile has no GetEvent route', () => {
		expect(Object.keys(Events)).not.toContain('get');
	});

	it('creates an event with the credentials in the body and returns it flattened', async () => {
		respond(fetchMock, eventResponse);

		const result = (await invoke(Events.create, {
			eventName: 'Saturday open jump',
			dateStart: '2026-12-01T14:00:00Z',
			dateEnd: '2026-12-01T17:00:00Z',
			isAllDay: false,
			eventCategoryID: categoryID,
		})) as EventResponse;

		expect(result.WaiverEventID).toBe(eventID);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/InsertEvent');
		// This is the one route that authenticates in the body, spelled APIKey
		// and SiteID.
		expect(sent.body).toMatchObject({
			APIKey: API_KEY,
			SiteID: SITE_ID,
			EventName: 'Saturday open jump',
		});
		expect(lastLog()).toMatchObject({ id: eventID });
	});

	it('updates an event, sending the form list as the body', async () => {
		respond(fetchMock, eventResponse);

		await invoke(Events.update, {
			eventID,
			eventName: 'Saturday open jump',
			dateStart: '2026-12-01T14:00:00Z',
			dateEnd: '2026-12-01T17:00:00Z',
			isAllDay: false,
			eventCategoryID: categoryID,
			waiverFormIDs: [formID],
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/UpdateEvent');
		expect(sent.body).toEqual([formID]);
		expect(sent.query.eventID).toBe(eventID);
	});

	it('sends no body when the form list is omitted', async () => {
		respond(fetchMock, eventResponse);

		await invoke(Events.update, {
			eventID,
			eventName: 'Saturday open jump',
			dateStart: '2026-12-01T14:00:00Z',
			dateEnd: '2026-12-01T17:00:00Z',
			isAllDay: false,
			eventCategoryID: categoryID,
		});

		expect(lastRequest(fetchMock).body).toBeUndefined();
	});

	it('deletes an event with a GET and reports IsDeleted from the returned event', async () => {
		respond(fetchMock, {
			...eventResponse,
			me: { ...eventResponse.me, isDeleted: true },
		});

		const result = (await invoke(Events.remove, { eventID })) as EventResponse;

		expect(result).toMatchObject({ WaiverEventID: eventID, IsDeleted: true });
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v1/DeleteEvent');
		expect(lastLog()).toEqual({ id: eventID, deleted: true });
	});

	it('invites managers, logging how many addresses and none of them', async () => {
		respond(fetchMock, eventResponse);

		const result = (await invoke(Events.inviteManagers, {
			eventID,
			emailAddresses: 'a@example.com, b@example.com',
			skipSendingEmailIfAccountExists: true,
		})) as EventResponse;

		expect(result.ManagerIDs).toHaveLength(1);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/InviteEventManagers');
		expect(sent.query.skipSendingEmailIfAccountExists).toBe('true');
		expect(lastLog()).toEqual({ event: eventID, addresses: 2, managers: 1 });
	});

	it('always sends managerEmailMessage and skipSendingEmailIfAccountExists, which the route needs', async () => {
		// Live: without both parameters WaiverFile's router answers 404.
		respond(fetchMock, eventResponse);

		await invoke(Events.inviteManagers, {
			eventID,
			emailAddresses: 'a@example.com',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.query.managerEmailMessage).toBe('');
		expect(sent.query.skipSendingEmailIfAccountExists).toBe('false');
	});

	it('removes managers and returns the event', async () => {
		respond(fetchMock, { ...eventResponse, _managerIDs: [] });

		const result = (await invoke(Events.removeManagers, {
			eventID,
			emailAddresses: 'a@example.com',
		})) as EventResponse;

		expect(result.ManagerIDs).toEqual([]);
		expect(lastRequest(fetchMock).path).toBe('/api/v1/RemoveEventManagers');
	});
});

describe('event categories', () => {
	it('lists categories from a bare array', async () => {
		respond(fetchMock, categoriesResponse);

		const result = (await invoke(EventCategories.list, {
			includeDisabledCategories: true,
		})) as CategoriesResponse;

		expect(result.EventCategories?.[0]).toEqual({
			ID: categoryID,
			SiteID: siteID,
			Status: 0,
			OrderNum: 1,
			Name: 'Open jump',
			WPObjectStatus: 0,
		});
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/GetEventCategories');
		expect(sent.query.includeDisabledCategories).toBe('true');
	});

	it('creates a category and returns it with its new ID', async () => {
		respond(fetchMock, categoryResponse);

		const result = await invoke(EventCategories.create, {
			name: 'Open jump',
			active: true,
		});

		expect(result).toMatchObject({ ID: categoryID, Name: 'Open jump' });
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/InsertEventCategory');
		expect(sent.query.name).toBe('Open jump');
		expect(lastLog()).toMatchObject({ id: categoryID });
	});

	it('updates a category', async () => {
		respond(fetchMock, {
			...categoryResponse,
			me: { ...categoryResponse.me, status: 1 },
		});

		const result = await invoke(EventCategories.update, {
			eventCategoryID: categoryID,
			name: 'Open jump (renamed)',
			active: false,
		});

		expect(result).toMatchObject({ Status: 1 });
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/UpdateEventCategory');
		expect(sent.query.active).toBe('false');
	});

	it('deletes a category with a POST and returns it with status 2', async () => {
		respond(fetchMock, {
			...categoryResponse,
			me: { ...categoryResponse.me, status: 2 },
		});

		const result = await invoke(EventCategories.remove, {
			eventCategoryID: categoryID,
		});

		expect(result).toMatchObject({ Status: 2 });
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/DeleteEventCategory');
	});
});

describe('subscribers', () => {
	it('lists subscribers added in a range from a bare array', async () => {
		respond(fetchMock, []);

		await expect(invoke(Subscribers.list, utcRange)).resolves.toEqual({
			Subscribers: [],
		});
		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetSubscribersByDate');
	});

	it('lists those who opted out', async () => {
		respond(fetchMock, []);

		await invoke(Subscribers.optedOut, utcRange);

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v1/GetOptedOutSubscribersByOptOutDate',
		);
	});
});

describe('webhook subscriptions', () => {
	it('subscribes a URL to a trigger and reads the bare "OK" as success', async () => {
		respond(fetchMock, 'OK');

		const result = await invoke(Webhooks.subscribe, {
			trigger: 'newwaiver',
			targetUrl: 'https://acme.example/hooks/waiverfile?token=secret',
		});

		expect(result).toEqual({ Success: true, Message: 'OK' });
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/subscribe/newwaiver');
		expect(sent.query.targetUrl).toBe(
			'https://acme.example/hooks/waiverfile?token=secret',
		);
		// The receiver's query string can be its only secret, so it is not logged.
		expect(lastLog()).toEqual({
			trigger: 'newwaiver',
			url: 'https://acme.example/hooks/waiverfile',
			success: true,
		});
	});

	it('unsubscribes with a DELETE on the deletesubscribe route', async () => {
		respond(fetchMock, 'OK');

		await invoke(Webhooks.unsubscribe, {
			trigger: 'newevent',
			targetUrl: 'https://acme.example/hooks/waiverfile',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe('/api/v1/deletesubscribe/newevent');
	});

	it('raises the 400 an unknown subscription gets', async () => {
		respond(
			fetchMock,
			{ Message: 'Subscription not found or already deleted.' },
			400,
		);

		await expect(
			invoke(Webhooks.unsubscribe, {
				trigger: 'newevent',
				targetUrl: 'https://acme.example/hooks/waiverfile',
			}),
		).rejects.toThrow('Subscription not found or already deleted.');
	});

	it('rejects an unknown trigger', async () => {
		await expect(
			invoke(Webhooks.subscribe, {
				trigger: 'notatrigger',
				targetUrl: 'https://x',
			}),
		).rejects.toThrow();
	});
});

describe('errors', () => {
	it('removes the API key WaiverFile echoes in a 404 body', async () => {
		respond(fetchMock, routeNotFound, 404);

		const error = (await invoke(Forms.active, {}).catch(
			(thrown: unknown) => thrown,
		)) as WaiverFileAPIError;

		expect(error.status).toBe(404);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error.body)).not.toContain(API_KEY);
		expect(error.message).toContain('apiKey=[REDACTED]');
		// The ApiError, whose request still holds the key, is not kept.
		expect(error.cause).toBeUndefined();
	});
});

describe('a 200 without the container the route promises', () => {
	// The shared transport hands back undefined when a 200 body cannot be read
	// (no Content-Type, or JSON that will not parse).
	const listInput = { ...range, pageIndex: 0, pageSize: 10 };

	function respondUnreadable() {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));
	}

	it.each([
		['waivers.list', () => invoke(Waivers.list, listInput)],
		['waivers.get', () => invoke(Waivers.get, { waiverID })],
		['forms.active', () => invoke(Forms.active, {})],
		['site.get', () => invoke(Site.get, {})],
	])('rejects %s with an unreadable body', async (_name, run) => {
		respondUnreadable();

		await expect(run()).rejects.toThrow(WaiverFileAPIError);
	});

	it.each([
		['waivers.list', () => invoke(Waivers.list, listInput)],
		['waivers.get', () => invoke(Waivers.get, { waiverID })],
		['forms.active', () => invoke(Forms.active, {})],
		['site.get', () => invoke(Site.get, {})],
		[
			'waivers.data',
			() =>
				invoke(Waivers.data, {
					...range,
					includeCustomColumns: false,
					consolidateParticipants: false,
					pageIndex: 1,
					pageSize: 10,
				}),
		],
	])('rejects %s answered with an empty object', async (_name, run) => {
		respond(fetchMock, {});

		await expect(run()).rejects.toThrow();
	});

	it('still reads an empty report page as an empty Table', async () => {
		respond(fetchMock, { Table: [] });

		await expect(
			invoke(Waivers.data, {
				...range,
				includeCustomColumns: false,
				consolidateParticipants: false,
				pageIndex: 1,
				pageSize: 10,
			}),
		).resolves.toMatchObject({ Table: [] });
	});

	it('still reads an empty event list as an empty list', async () => {
		respond(fetchMock, []);

		await expect(invoke(Forms.active, {})).resolves.toEqual({
			WaiverForms: [],
		});
	});
});

describe('webhook errors', () => {
	const targetUrl =
		'https://acme.example/hooks/waiverfile?token=receiver-secret';

	it.each([
		['subscribe', Webhooks.subscribe],
		['unsubscribe', Webhooks.unsubscribe],
	])(
		'keeps the target URL out of a %s error that echoes the request',
		async (_name, endpoint) => {
			respond(
				fetchMock,
				{
					Message: `No HTTP resource was found that matches the request URI 'https://api.waiverfile.com/api/v1/subscribe/newevent?targetUrl=${encodeURIComponent(targetUrl)}&apiKey=${API_KEY}'.`,
				},
				404,
			);

			const error = (await invoke(endpoint, {
				trigger: 'newevent',
				targetUrl,
			}).catch((thrown: unknown) => thrown)) as WaiverFileAPIError;

			expect(error).toBeInstanceOf(WaiverFileAPIError);
			const text = `${error.message} ${JSON.stringify(error.body)}`;
			expect(text.includes('receiver-secret')).toBe(false);
			expect(text.includes(API_KEY)).toBe(false);
		},
	);
});
