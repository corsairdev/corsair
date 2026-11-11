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
import {
	categoriesPage,
	categoryID,
	categoryMutation,
	dataRows,
	event,
	eventID,
	eventsPage,
	form,
	formID,
	formsPage,
	invalidKey,
	pageCountResponse,
	pingOk,
	searchResults,
	siteDetails,
	successResponse,
	waiver,
	waiverID,
	waiverLite,
	waiversLitePage,
	waiversPage,
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

describe('site and ping', () => {
	it('pings with both credentials on the query', async () => {
		respond(fetchMock, pingOk);

		const result = await invoke(Site.ping, {});

		expect(result).toEqual(pingOk);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v1/Ping');
	});

	it('reads the site details', async () => {
		respond(fetchMock, siteDetails);

		const result = await invoke(Site.get, {});

		expect(result).toEqual(siteDetails);
		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetSiteDetails');
	});

	it('surfaces a bad key, which is a 400 rather than a 401', async () => {
		respond(fetchMock, invalidKey, 400);

		const error = (await invoke(Site.ping, {}).catch(
			(thrown: unknown) => thrown,
		)) as WaiverFileAPIError;

		expect(error).toBeInstanceOf(WaiverFileAPIError);
		expect(error.status).toBe(400);
		// The message is what says it is a credential problem.
		expect(error.isAuthError).toBe(true);
	});

	it('refuses a key that is not the documented pair, before any request', async () => {
		await expect(
			Site.ping({ key: API_KEY } as never, {} as never),
		).rejects.toThrow('must hold the API key and the site ID');
	});
});

describe('waivers', () => {
	it('reads one waiver with its participants', async () => {
		respond(fetchMock, waiver);

		const result = await invoke(Waivers.get, { waiverID });

		expect(result).toEqual(waiver);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v1/GetWaiver');
		expect(sent.query.waiverID).toBe(waiverID);
		expect(sent.query.apiKey).toBe(API_KEY);
	});

	it('keeps WaiverFile own spelling of Participants', async () => {
		respond(fetchMock, waiver);

		const result = (await invoke(Waivers.get, { waiverID })) as {
			Particpants?: unknown[];
		};

		// The API spells it without the second i, and the plugin does not correct
		// it, so a caller reading the docs finds the field.
		expect(result.Particpants).toHaveLength(1);
	});

	it('never logs the email, phone or date of birth', async () => {
		respond(fetchMock, waiver);

		await invoke(Waivers.get, { waiverID });

		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged).not.toHaveProperty('Email');
		expect(logged).not.toHaveProperty('Phone');
		expect(logged).not.toHaveProperty('DOB');
		expect(logged.participants).toBe(1);
	});

	it('reads the lite form without the agreement text', async () => {
		respond(fetchMock, waiverLite);

		await expect(invoke(Waivers.getLite, { waiverID })).resolves.toEqual(
			waiverLite,
		);
		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetWaiverLite');
	});

	it('searches by name, logging only the count', async () => {
		respond(fetchMock, searchResults);

		await invoke(Waivers.search, { terms: 'Jordan Ruiz' });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/SearchWaivers');
		expect(sent.query.terms).toBe('Jordan Ruiz');
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged).not.toHaveProperty('terms');
	});

	it('looks up by reference', async () => {
		respond(fetchMock, searchResults);

		await invoke(Waivers.byReference, { refID1: 'ORDER-42' });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/GetWaiversByReferenceID');
		expect(sent.query.refID1).toBe('ORDER-42');
	});

	it('rejects a reference lookup with no reference at all', async () => {
		await expect(invoke(Waivers.byReference, {})).rejects.toThrow(
			'at least one of refID1, refID2, refID3 or refIDAny',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('pages the full waivers with a zero-based page index', async () => {
		respond(fetchMock, waiversPage);

		await invoke(Waivers.list, {
			startDate: '2024-06-01',
			endDate: '2024-06-30',
			pageIndex: 0,
			pageSize: 50,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/GetAllWaiversByDateRange');
		expect(sent.query.pageIndex).toBe('0');
	});

	it('rejects a waiver page size above 500', async () => {
		await expect(
			invoke(Waivers.list, {
				startDate: '2024-06-01',
				endDate: '2024-06-30',
				pageIndex: 0,
				pageSize: 501,
			}),
		).rejects.toThrow();
	});

	it('pages the lite waivers', async () => {
		respond(fetchMock, waiversLitePage);

		await expect(
			invoke(Waivers.listLite, {
				startDate: '2024-06-01',
				endDate: '2024-06-30',
				pageIndex: 0,
				pageSize: 50,
			}),
		).resolves.toEqual(waiversLitePage);
		expect(lastRequest(fetchMock).path).toBe(
			'/api/v1/GetAllWaiversByDateRangeLite',
		);
	});

	it('counts the waivers to plan the paging', async () => {
		respond(fetchMock, pageCountResponse);

		const result = await invoke(Waivers.pageCount, {
			startDate: '2024-06-01',
			endDate: '2024-06-30',
		});

		expect(result).toEqual(pageCountResponse);
		expect(lastRequest(fetchMock).path).toBe(
			'/api/v1/GetAllWaiversByDateRangePageCount',
		);
	});

	it('reads report rows with a one-based page index', async () => {
		respond(fetchMock, dataRows);

		await invoke(Waivers.data, {
			startDate: '2024-06-01',
			endDate: '2024-06-30',
			includeCustomColumns: true,
			consolidateParticipants: false,
			pageIndex: 1,
			pageSize: 100,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/GetWaiverData');
		expect(sent.query.pageIndex).toBe('1');
		expect(sent.query.includeCustomColumns).toBe('true');
	});

	it('rejects a report page index of 0, which is the other endpoints convention', async () => {
		await expect(
			invoke(Waivers.data, {
				startDate: '2024-06-01',
				endDate: '2024-06-30',
				includeCustomColumns: false,
				consolidateParticipants: false,
				pageIndex: 0,
				pageSize: 100,
			}),
		).rejects.toThrow();
	});

	it('counts the report rows', async () => {
		respond(fetchMock, { Count: 1 });

		await invoke(Waivers.dataCount, {
			startDate: '2024-06-01',
			endDate: '2024-06-30',
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
		// The file itself is recoverable, which it was not before.
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
});

describe('forms', () => {
	it('lists the active forms', async () => {
		respond(fetchMock, formsPage);

		const result = await invoke(Forms.active, {});

		expect(result).toEqual(formsPage);
		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetActiveWaiverForms');
	});

	it('lists every form, including disabled ones', async () => {
		respond(fetchMock, formsPage);

		const result = (await invoke(Forms.all, {})) as { WaiverForms?: unknown[] };

		expect(result.WaiverForms).toHaveLength(1);
		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetAllWaiverForms');
	});

	it('exposes the field flags that explain a waiver answers', async () => {
		respond(fetchMock, formsPage);

		const result = (await invoke(Forms.active, {})) as {
			WaiverForms?: { FieldRequire_Email?: boolean; ID?: string }[];
		};

		expect(result.WaiverForms?.[0]).toMatchObject({
			ID: formID,
			FieldRequire_Email: true,
		});
		expect(form.ID).toBe(formID);
	});
});

describe('events', () => {
	it('lists events in a date range', async () => {
		respond(fetchMock, eventsPage);

		const result = await invoke(Events.byDateRange, {
			startDateUTC: '2024-06-01T00:00:00Z',
			endDateUTC: '2024-06-30T23:59:59Z',
		});

		expect(result).toEqual(eventsPage);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/GetEventsByDateRange');
		expect(sent.query.startDateUTC).toBe('2024-06-01T00:00:00Z');
	});

	it('lists events in one category', async () => {
		respond(fetchMock, eventsPage);

		await invoke(Events.byCategory, {
			eventCategoryID: categoryID,
			startDateUTC: '2024-06-01T00:00:00Z',
			endDateUTC: '2024-06-30T23:59:59Z',
		});

		expect(lastRequest(fetchMock).query.eventCategoryID).toBe(categoryID);
	});

	it('lists upcoming events', async () => {
		respond(fetchMock, eventsPage);

		await invoke(Events.upcoming, {
			startDateUTC: '2024-06-01T00:00:00Z',
			endDateUTC: '2024-06-30T23:59:59Z',
		});

		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetUpcomingEvents');
	});

	it('lists the waivers signed for an event', async () => {
		respond(fetchMock, { Waivers: [waiverLite] });

		await invoke(Events.waivers, { waiverEventID: eventID });

		expect(lastRequest(fetchMock).query.waiverEventID).toBe(eventID);
	});

	it('reads one event', async () => {
		respond(fetchMock, event);

		await expect(invoke(Events.get, { eventID })).resolves.toEqual(event);
		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetEvent');
	});

	it('creates an event with the credentials in the body', async () => {
		respond(fetchMock, event);

		await invoke(Events.create, {
			eventName: 'Saturday open jump',
			dateStart: '2024-06-02T09:00:00Z',
			dateEnd: '2024-06-02T17:00:00Z',
			isAllDay: false,
			eventCategoryID: categoryID,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/InsertEvent');
		// This is the one route that authenticates in the body, spelled APIKey
		// and SiteID — and the credentials are still on the query too.
		expect(sent.body).toMatchObject({
			APIKey: API_KEY,
			SiteID: SITE_ID,
			EventName: 'Saturday open jump',
		});
	});

	it('updates an event, sending the form list as the body', async () => {
		respond(fetchMock, event);

		await invoke(Events.update, {
			eventID,
			eventName: 'Saturday open jump',
			dateStart: '2024-06-02T09:00:00Z',
			dateEnd: '2024-06-02T17:00:00Z',
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

	it('deletes an event with a GET, which is easy to retry by accident', async () => {
		respond(fetchMock, successResponse);

		const result = await invoke(Events.remove, { eventID });

		expect(result).toEqual(successResponse);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v1/DeleteEvent');
	});

	it('invites managers, logging how many addresses', async () => {
		respond(fetchMock, successResponse);

		await invoke(Events.inviteManagers, {
			eventID,
			emailAddresses: 'a@example.com, b@example.com',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/InviteEventManagers');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'waiverfile.events.inviteManagers',
			expect.objectContaining({ addresses: 2 }),
			'completed',
		);
		// The addresses are people, so they are not in the event log.
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged).not.toHaveProperty('emailAddresses');
	});

	it('removes managers', async () => {
		respond(fetchMock, successResponse);

		await invoke(Events.removeManagers, {
			eventID,
			emailAddresses: 'a@example.com',
		});

		expect(lastRequest(fetchMock).path).toBe('/api/v1/RemoveEventManagers');
	});
});

describe('event categories', () => {
	it('lists categories, optionally with disabled ones', async () => {
		respond(fetchMock, categoriesPage);

		await invoke(EventCategories.list, { includeDisabledCategories: true });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/GetEventCategories');
		expect(sent.query.includeDisabledCategories).toBe('true');
	});

	it('creates a category', async () => {
		respond(fetchMock, categoryMutation);

		const result = await invoke(EventCategories.create, {
			name: 'Open jump',
			active: true,
		});

		expect(result).toEqual(categoryMutation);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/InsertEventCategory');
		expect(sent.query.name).toBe('Open jump');
	});

	it('updates a category', async () => {
		respond(fetchMock, categoryMutation);

		await invoke(EventCategories.update, {
			eventCategoryID: categoryID,
			name: 'Open jump (renamed)',
			active: false,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v1/UpdateEventCategory');
		expect(sent.query.active).toBe('false');
	});

	it('deletes a category with a POST, not a DELETE', async () => {
		respond(fetchMock, categoryMutation);

		await invoke(EventCategories.remove, { eventCategoryID: categoryID });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/DeleteEventCategory');
	});
});

describe('subscribers', () => {
	it('lists subscribers added in a range', async () => {
		respond(fetchMock, { Subscribers: [] });

		await invoke(Subscribers.list, {
			startDateUTC: '2024-06-01T00:00:00Z',
			endDateUTC: '2024-06-30T23:59:59Z',
		});

		expect(lastRequest(fetchMock).path).toBe('/api/v1/GetSubscribersByDate');
	});

	it('lists those who opted out', async () => {
		respond(fetchMock, { Subscribers: [] });

		await invoke(Subscribers.optedOut, {
			startDateUTC: '2024-06-01T00:00:00Z',
			endDateUTC: '2024-06-30T23:59:59Z',
		});

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v1/GetOptedOutSubscribersByOptOutDate',
		);
	});
});

describe('webhook subscriptions', () => {
	it('subscribes a URL to a trigger, which is part of the path', async () => {
		respond(fetchMock, successResponse);

		const result = await invoke(Webhooks.subscribe, {
			trigger: 'newwaiver',
			targetUrl: 'https://acme.example/hooks/waiverfile',
		});

		expect(result).toEqual(successResponse);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/subscribe/newwaiver');
		expect(sent.query.targetUrl).toBe('https://acme.example/hooks/waiverfile');
	});

	it('unsubscribes with a DELETE on the deletesubscribe route', async () => {
		respond(fetchMock, successResponse);

		await invoke(Webhooks.unsubscribe, {
			trigger: 'newevent',
			targetUrl: 'https://acme.example/hooks/waiverfile',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe('/api/v1/deletesubscribe/newevent');
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
