jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	campaign,
	campaignsListResponse,
	field,
	fieldsListResponse,
	group,
	groupsListResponse,
	subscriber,
	subscriberActivityResponse,
	subscribersListResponse,
} from './test-fixtures';
import {
	BASE,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	noContent,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

// One test per operation: the URL, the method, where the auth went and every
// query or body field. Routing through a shared client means a wrong selector
// is a silent wrong result, not an error.

describe('subscribers requests', () => {
	it('lists subscribers with cursor pagination params', async () => {
		mockFetch(jsonResponse(subscribersListResponse));

		await endpoints.subscribers.list(makeCtx(), {
			filterStatus: 'active,unconfirmed',
			filterGroup: '42',
			limit: 50,
			cursor: 'eyJuZXh0',
			sort: '-id',
			include: 'groups',
		});

		expect(lastCall().url).toBe(
			`${BASE}/subscribers?filter%5Bstatus%5D=active%2Cunconfirmed&filter%5Bgroup%5D=42&limit=50&cursor=eyJuZXh0&sort=-id&include=groups`,
		);
		expect(lastCall().init.method).toBe('GET');
	});

	it('lists subscribers with every param omitted', async () => {
		mockFetch(jsonResponse(subscribersListResponse));

		await endpoints.subscribers.list(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/subscribers`);
	});

	it('fetches a subscriber by id', async () => {
		mockFetch(jsonResponse({ data: subscriber }));

		await endpoints.subscribers.get(makeCtx(), {
			subscriberId: '31986843064993537',
		});

		expect(lastCall().url).toBe(`${BASE}/subscribers/31986843064993537`);
		expect(lastCall().init.method).toBe('GET');
	});

	it('fetches a subscriber by email address, url-encoded', async () => {
		mockFetch(jsonResponse({ data: subscriber }));

		await endpoints.subscribers.get(makeCtx(), {
			subscriberId: 'dummy@example.com',
		});

		expect(lastCall().url).toBe(`${BASE}/subscribers/dummy%40example.com`);
	});

	it('upserts a subscriber with the documented body fields', async () => {
		mockFetch(jsonResponse({ data: subscriber }));

		await endpoints.subscribers.upsert(makeCtx(), {
			email: 'dummy@example.com',
			fields: { name: 'Dummy', last_name: 'Testerson' },
			groups: ['4243829086487936'],
			resubscribe: true,
		});

		expect(lastCall().url).toBe(`${BASE}/subscribers`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			email: 'dummy@example.com',
			fields: { name: 'Dummy', last_name: 'Testerson' },
			groups: ['4243829086487936'],
			resubscribe: true,
		});
	});

	it('updates a subscriber, omitting unset body fields', async () => {
		mockFetch(jsonResponse({ data: subscriber }));

		await endpoints.subscribers.update(makeCtx(), {
			subscriberId: '31986843064993537',
			fields: { name: null },
			groups: [],
		});

		expect(lastCall().url).toBe(`${BASE}/subscribers/31986843064993537`);
		expect(lastCall().init.method).toBe('PUT');
		expect(sentBody()).toEqual({ fields: { name: null }, groups: [] });
	});

	it('deletes a subscriber with no body', async () => {
		mockFetch(noContent());

		await endpoints.subscribers.delete(makeCtx(), {
			subscriberId: '31986843064993537',
		});

		expect(lastCall().url).toBe(`${BASE}/subscribers/31986843064993537`);
		expect(lastCall().init.method).toBe('DELETE');
		expect(lastCall().init.body).toBeUndefined();
	});

	it('adds a subscriber to a group', async () => {
		mockFetch(jsonResponse({ data: group }));

		await endpoints.subscribers.addToGroup(makeCtx(), {
			subscriberId: '31986843064993537',
			groupId: '14133878422767533',
		});

		expect(lastCall().url).toBe(
			`${BASE}/subscribers/31986843064993537/groups/14133878422767533`,
		);
		expect(lastCall().init.method).toBe('POST');
	});

	it('removes a subscriber from a group', async () => {
		mockFetch(noContent());

		await endpoints.subscribers.removeFromGroup(makeCtx(), {
			subscriberId: '31986843064993537',
			groupId: '14133878422767533',
		});

		expect(lastCall().url).toBe(
			`${BASE}/subscribers/31986843064993537/groups/14133878422767533`,
		);
		expect(lastCall().init.method).toBe('DELETE');
	});
});

describe('groups and fields requests', () => {
	it('lists groups with page pagination params', async () => {
		mockFetch(jsonResponse(groupsListResponse));

		await endpoints.groups.list(makeCtx(), {
			filterName: 'dummy',
			sort: '-active_count',
			limit: 100,
			page: 2,
		});

		expect(lastCall().url).toBe(
			`${BASE}/groups?filter%5Bname%5D=dummy&sort=-active_count&limit=100&page=2`,
		);
		expect(lastCall().init.method).toBe('GET');
	});

	it('creates a group with its name', async () => {
		mockFetch(jsonResponse({ data: group }));

		await endpoints.groups.create(makeCtx(), { name: 'dummy group' });

		expect(lastCall().url).toBe(`${BASE}/groups`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ name: 'dummy group' });
	});

	it('deletes a group', async () => {
		mockFetch(noContent());

		await endpoints.groups.delete(makeCtx(), { groupId: '14133878422767533' });

		expect(lastCall().url).toBe(`${BASE}/groups/14133878422767533`);
		expect(lastCall().init.method).toBe('DELETE');
	});

	it('lists fields with the comma-separated type filter', async () => {
		mockFetch(jsonResponse(fieldsListResponse));

		await endpoints.fields.list(makeCtx(), {
			filterKeyword: 'city',
			filterType: 'text,number',
			limit: 200,
			page: 1,
			sort: 'name',
		});

		expect(lastCall().url).toBe(
			`${BASE}/fields?filter%5Bkeyword%5D=city&filter%5Btype%5D=text%2Cnumber&sort=name&limit=200&page=1`,
		);
		expect(lastCall().init.method).toBe('GET');
	});
});

describe('campaigns requests', () => {
	it('lists campaigns with page pagination params', async () => {
		mockFetch(jsonResponse(campaignsListResponse));

		await endpoints.campaigns.list(makeCtx(), {
			filterStatus: 'sent',
			filterType: 'regular',
			filterDateFrom: '2026-01-01',
			filterSubject: 'update',
			limit: 25,
			page: 1,
		});

		expect(lastCall().url).toBe(
			`${BASE}/campaigns?filter%5Bstatus%5D=sent&filter%5Btype%5D=regular&filter%5Bdate_from%5D=2026-01-01&filter%5Bsubject%5D=update&limit=25&page=1`,
		);
		expect(lastCall().init.method).toBe('GET');
	});

	it('creates a draft campaign with one email and its recipients', async () => {
		mockFetch(jsonResponse({ data: { ...campaign, status: 'draft' } }));

		await endpoints.campaigns.create(makeCtx(), {
			name: 'October update',
			type: 'regular',
			emails: [
				{
					subject: 'Our October update',
					from_name: 'Dummy Testerson',
					from: 'dummy@mailerlite.io',
				},
			],
			groups: ['42'],
			settings: { ecommerce_tracking: true },
		});

		expect(lastCall().url).toBe(`${BASE}/campaigns`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			name: 'October update',
			type: 'regular',
			emails: [
				{
					subject: 'Our October update',
					from_name: 'Dummy Testerson',
					from: 'dummy@mailerlite.io',
				},
			],
			groups: ['42'],
			settings: { ecommerce_tracking: true },
		});
	});

	it('schedules an instant send with only the delivery field', async () => {
		mockFetch(jsonResponse({ data: campaign }));

		await endpoints.campaigns.schedule(makeCtx(), {
			campaignId: '1',
			delivery: 'instant',
		});

		expect(lastCall().url).toBe(`${BASE}/campaigns/1/schedule`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ delivery: 'instant' });
	});

	it('schedules a timed send with date, hour and minute', async () => {
		mockFetch(jsonResponse({ data: { ...campaign, status: 'ready' } }));

		await endpoints.campaigns.schedule(makeCtx(), {
			campaignId: '1',
			delivery: 'scheduled',
			schedule: {
				date: '2026-12-01',
				hours: '09',
				minutes: '30',
				timezone_id: 4,
			},
		});

		expect(sentBody()).toEqual({
			delivery: 'scheduled',
			schedule: { date: '2026-12-01', hours: '09', minutes: '30', timezone_id: 4 },
		});
	});

	it('cancels a ready campaign', async () => {
		mockFetch(jsonResponse({ data: { ...campaign, status: 'draft' } }));

		await endpoints.campaigns.cancel(makeCtx(), { campaignId: '1' });

		expect(lastCall().url).toBe(`${BASE}/campaigns/1/cancel`);
		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().init.body).toBeUndefined();
	});

	it('reads subscriber activity with the activity filters', async () => {
		mockFetch(jsonResponse(subscriberActivityResponse));

		await endpoints.campaigns.activity(makeCtx(), {
			campaignId: '66200823885989563',
			filterType: 'opened',
			filterSearch: 'dummy@mailerlite.com',
			limit: 50,
			sort: '-opens_count',
			page: 1,
			include: 'subscriber',
		});

		// Docs specify GET here; the official SDK's POST would be a silent method mismatch.
		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().url).toBe(
			`${BASE}/campaigns/66200823885989563/reports/subscriber-activity?filter%5Btype%5D=opened&filter%5Bsearch%5D=dummy%40mailerlite.com&limit=50&sort=-opens_count&page=1&include=subscriber`,
		);
	});
});

describe('auth placement on every request', () => {
	it('sends the bearer token from the resolved key', async () => {
		mockFetch(jsonResponse(groupsListResponse));

		await endpoints.groups.list(makeCtx(), {});

		expect(sentHeader('Authorization')).toBe('Bearer test-token');
	});
});
