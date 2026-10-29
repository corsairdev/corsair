import { jest } from '@jest/globals';
import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeChMeetingsRequest } from './client';
import {
	Events,
	Families,
	Groups,
	Organizations,
	People,
	Settings,
} from './endpoints';
import {
	PersonCreateInputSchema,
	PersonIdInputSchema,
} from './endpoints/types';
import type { ChMeetingsContext } from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const requestMock = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

/** Endpoint handlers only read `ctx.key` in these tests. */
const ctx = { key: 'chm-test-key' } as ChMeetingsContext;

beforeEach(() => {
	requestMock.mockReset();
	mockLog.mockClear();
});

function lastCall() {
	const call = requestMock.mock.calls.at(-1);
	if (!call) throw new Error('expected request to be called');
	const [config, options] = call;
	const headers = config.HEADERS;
	if (!headers || typeof headers === 'function') {
		throw new Error('expected static request headers');
	}
	return { config: { ...config, HEADERS: headers }, options };
}

describe('client', () => {
	it('sends the official apikey header and keeps ApiError status', async () => {
		requestMock.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: 'people' },
				{
					url: 'https://api.chmeetings.com/api/v1/people',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { errors: ['rate limited'] },
				},
				'Too Many Requests',
				{ retryAfter: 2000 },
			),
		);
		await expect(
			makeChMeetingsRequest('people', 'k', { method: 'GET' }),
		).rejects.toMatchObject({
			name: 'ChMeetingsAPIError',
			status: 429,
		});
		const { config } = lastCall();
		expect(config.BASE).toBe('https://api.chmeetings.com/api/v1');
		expect(config.HEADERS.apikey).toBe('k');
	});
});

describe('people', () => {
	it('validates get input', () => {
		expect(PersonIdInputSchema.parse({ id: 12 })).toEqual({ id: 12 });
		expect(() => PersonCreateInputSchema.parse({ first_name: 'A' })).toThrow();
	});

	it('lists people with official query defaults', async () => {
		requestMock.mockResolvedValue({
			status_code: 200,
			data: [{ id: 1, first_name: 'Ada' }],
			paging: { page: 1, page_size: 100, total_count: 1 },
		});
		const result = await People.list(ctx, {});
		expect(result.data[0]?.first_name).toBe('Ada');
		expect(lastCall().options).toMatchObject({
			method: 'GET',
			url: 'people',
			query: {
				include_family_members: true,
				include_additional_fields: true,
				include_organizations: false,
				page: 1,
				page_size: 100,
			},
		});
	});

	it('gets a person and unwraps data', async () => {
		requestMock.mockResolvedValue({
			data: { id: 9, first_name: 'Ada', last_name: 'Lovelace' },
		});
		const result = await People.get(ctx, { id: '9' });
		expect(result.id).toBe(9);
		expect(lastCall().options.url).toBe('people/9');
	});

	it('creates, updates, and deletes a person', async () => {
		requestMock.mockResolvedValueOnce({
			data: { id: 3, first_name: 'Ada', last_name: 'Lovelace' },
		});
		await People.create(ctx, {
			first_name: 'Ada',
			last_name: 'Lovelace',
		});
		expect(lastCall().options).toMatchObject({
			method: 'POST',
			url: 'people',
			body: { first_name: 'Ada', last_name: 'Lovelace' },
		});

		requestMock.mockReset();
		requestMock.mockResolvedValueOnce(undefined);
		await expect(
			People.update(ctx, {
				id: 3,
				first_name: 'Ada',
				last_name: 'Byron',
			}),
		).resolves.toEqual({ success: true });

		requestMock.mockReset();
		requestMock.mockResolvedValueOnce(undefined);
		await expect(People.remove(ctx, { id: 3 })).resolves.toEqual({
			success: true,
		});
	});

	it('throws when get has no data', async () => {
		requestMock.mockResolvedValue({ status_code: 404, errors: ['gone'] });
		await expect(People.get(ctx, { id: 404 })).rejects.toMatchObject({
			name: 'ChMeetingsAPIError',
			status: 404,
		});
	});

	it('rejects list envelopes with 429 or 5xx and omitted data', async () => {
		requestMock.mockResolvedValue({
			status_code: 429,
			errors: ['Too Many Requests'],
		});
		await expect(People.list(ctx, {})).rejects.toMatchObject({
			name: 'ChMeetingsAPIError',
			status: 429,
		});
		requestMock.mockResolvedValue({
			status_code: 500,
			errors: ['Internal Server Error'],
		});
		await expect(People.list(ctx, {})).rejects.toMatchObject({
			name: 'ChMeetingsAPIError',
			status: 500,
		});
	});

	it('does not log people search filter values', async () => {
		requestMock.mockResolvedValue({ data: [] });
		await People.list(ctx, {
			email: 'ada@example.com',
			mobile: '555',
			name: 'Ada',
		});
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'chmeetings.people.list',
			{
				page: 1,
				page_size: 100,
				has_email: true,
				has_mobile: true,
				has_name: true,
			},
			'completed',
		);
	});
});

describe('settings and orgs', () => {
	it('loads official lookup endpoints', async () => {
		requestMock
			.mockResolvedValueOnce({ data: [{ value: 'Male' }] })
			.mockResolvedValueOnce({ data: [{ value: 'Single' }] })
			.mockResolvedValueOnce({ data: [{ value: '1' }] })
			.mockResolvedValueOnce({ data: [{ value: 'Head' }] })
			.mockResolvedValueOnce({ data: { sections: [] } });
		const result = await Settings.get(ctx, {});
		expect(result.genders[0]?.value).toBe('Male');
		requestMock.mockReset();
		requestMock
			.mockResolvedValueOnce({ data: [{ Value: 'Female' }] })
			.mockResolvedValueOnce({ data: [] })
			.mockResolvedValueOnce({ data: [] })
			.mockResolvedValueOnce({ data: [] })
			.mockResolvedValueOnce({ data: { sections: [] } });
		const live = await Settings.get(ctx, {});
		expect(live.genders[0]?.value).toBe('Female');
		expect(requestMock).toHaveBeenCalledTimes(5);
	});

	it('lists and gets organizations', async () => {
		requestMock.mockResolvedValue({
			data: [{ id: 'org-1', name: 'Main', type: 'church' }],
		});
		const listed = await Organizations.list(ctx, {});
		expect(listed.data[0]?.id).toBe('org-1');
		requestMock.mockResolvedValue({
			data: { id: 'org-1', name: 'Main', type: 'church' },
		});
		const one = await Organizations.get(ctx, {
			organization_id: 'org-1',
		});
		expect(one.name).toBe('Main');
	});
});

describe('events groups families', () => {
	it('lists events in a date range', async () => {
		requestMock.mockResolvedValue({ data: [{ id: 1, title: 'Sunday' }] });
		const result = await Events.list(ctx, {
			from: '2026-01-01',
			to: '2026-01-31',
		});
		expect(result.data[0]?.title).toBe('Sunday');
		expect(lastCall().options.query).toMatchObject({
			from: '2026-01-01',
			to: '2026-01-31',
		});
	});

	it('lists groups and creates one', async () => {
		requestMock.mockResolvedValue({ data: [{ id: 2, name: 'Youth' }] });
		const listed = await Groups.list(ctx, {});
		expect(listed[0]?.name).toBe('Youth');
		requestMock.mockResolvedValue({ data: { id: 3, name: 'Choir' } });
		const created = await Groups.create(ctx, { name: 'Choir' });
		expect(created.name).toBe('Choir');
	});

	it('lists families and notes', async () => {
		requestMock.mockResolvedValue({
			data: [{ family_id: 1, members: [] }],
		});
		const families = await Families.list(ctx, {});
		expect(families.data[0]?.family_id).toBe(1);
		requestMock.mockResolvedValue({ data: [{ id: 8, note: 'hi' }] });
		const notes = await Families.listNotes(ctx, { person_id: 9 });
		expect(notes.data[0]?.note).toBe('hi');
		expect(lastCall().options.url).toBe('people/9/notes');
	});
});

describe('remaining official endpoints', () => {
	it('lists a person organizations', async () => {
		requestMock.mockResolvedValue({
			data: [{ id: 'org-1', name: 'Main', type: 'church' }],
		});
		const result = await People.listOrganizations(ctx, {
			person_id: 9,
		});
		expect(result.data[0]?.id).toBe('org-1');
		expect(lastCall().options.url).toBe('people/9/organizations');
	});

	it('lists people in an organization', async () => {
		requestMock.mockResolvedValue({ data: [{ id: 1, first_name: 'Ada' }] });
		const result = await Organizations.listPeople(ctx, {
			organization_id: 'org-1',
		});
		expect(result.data[0]?.id).toBe(1);
		expect(lastCall().options.url).toBe('organizations/org-1/people');
	});

	it('adds a person to an organization', async () => {
		requestMock.mockResolvedValue(undefined);
		await expect(
			Organizations.addPerson(ctx, {
				organization_id: 'org-1',
				person_id: 9,
			}),
		).resolves.toEqual({ success: true });
		expect(lastCall().options).toMatchObject({
			method: 'POST',
			url: 'organizations/org-1/people',
			body: { person_id: 9 },
		});
	});

	it('removes a person from an organization', async () => {
		requestMock.mockResolvedValue(undefined);
		await expect(
			Organizations.removePerson(ctx, {
				organization_id: 'org-1',
				person_id: 9,
			}),
		).resolves.toEqual({ success: true });
		expect(lastCall().options).toMatchObject({
			method: 'DELETE',
			url: 'organizations/org-1/people/9',
		});
	});

	it('gets an event by id', async () => {
		requestMock.mockResolvedValue({ data: { id: 4, title: 'Sunday' } });
		const result = await Events.get(ctx, { event_id: 4 });
		expect(result.title).toBe('Sunday');
		expect(lastCall().options.url).toBe('events/4');
	});

	it('lists event occurrences', async () => {
		requestMock.mockResolvedValue({
			data: [{ occurrence_id: 'occ-1', event_id: 4 }],
		});
		const result = await Events.listOccurrences(ctx, {
			event_id: 4,
			from: '2026-01-01',
			to: '2026-01-31',
		});
		expect(result.data[0]?.occurrence_id).toBe('occ-1');
		expect(lastCall().options.url).toBe('events/4/occurrences');
	});

	it('lists attendance for an occurrence', async () => {
		requestMock.mockResolvedValue({
			data: [{ status: 'attended', person: { person_id: 9 } }],
		});
		const result = await Events.listAttendance(ctx, {
			occurrence_id: 'occ-1',
		});
		expect(result.data[0]?.status).toBe('attended');
		expect(lastCall().options.url).toBe('occurrences/occ-1/attendance');
	});

	it('gets a group by id', async () => {
		requestMock.mockResolvedValue({ data: { id: 2, name: 'Youth' } });
		const result = await Groups.get(ctx, { group_id: 2 });
		expect(result.name).toBe('Youth');
		expect(lastCall().options.url).toBe('groups/2');
	});

	it('updates a group', async () => {
		requestMock.mockResolvedValue({ data: { id: 2, name: 'Youth 2' } });
		const result = await Groups.update(ctx, {
			group_id: 2,
			name: 'Youth 2',
		});
		expect(result.name).toBe('Youth 2');
		expect(lastCall().options).toMatchObject({
			method: 'PUT',
			url: 'groups/2',
		});
	});

	it('rejects empty-response envelopes that include errors', async () => {
		requestMock.mockResolvedValue({
			status_code: 400,
			errors: ['cannot delete'],
		});
		await expect(Groups.remove(ctx, { group_id: 2 })).rejects.toMatchObject({
			name: 'ChMeetingsAPIError',
			status: 400,
		});
	});

	it('deletes a group', async () => {
		requestMock.mockResolvedValue(undefined);
		await expect(Groups.remove(ctx, { group_id: 2 })).resolves.toEqual({
			success: true,
		});
		expect(lastCall().options).toMatchObject({
			method: 'DELETE',
			url: 'groups/2',
		});
	});

	it('adds a group member', async () => {
		requestMock.mockResolvedValue(undefined);
		await expect(
			Groups.addMember(ctx, { group_id: 2, person_id: 9 }),
		).resolves.toEqual({ success: true });
		expect(lastCall().options).toMatchObject({
			method: 'POST',
			url: 'groups/2/memberships',
			body: { person_id: 9 },
		});
	});

	it('removes a group member', async () => {
		requestMock.mockResolvedValue(undefined);
		await expect(
			Groups.removeMember(ctx, { group_id: 2, person_id: 9 }),
		).resolves.toEqual({ success: true });
		expect(lastCall().options).toMatchObject({
			method: 'DELETE',
			url: 'groups/2/memberships/9',
		});
	});

	it('gets a family by id', async () => {
		requestMock.mockResolvedValue({ data: { family_id: 1, members: [] } });
		const result = await Families.get(ctx, { id: 1 });
		expect(result.family_id).toBe(1);
		expect(lastCall().options.url).toBe('families/1');
	});

	it('creates a family', async () => {
		requestMock.mockResolvedValue({
			data: { family_id: 7, members: [{ person_id: 9, family_role: 'Head' }] },
		});
		const result = await Families.create(ctx, {
			members: [{ person_id: 9, family_role: 'Head' }],
		});
		expect(result.family_id).toBe(7);
		expect(lastCall().options).toMatchObject({
			method: 'POST',
			url: 'families',
		});
	});

	it('deletes a family', async () => {
		requestMock.mockResolvedValue(undefined);
		await expect(Families.remove(ctx, { id: 7 })).resolves.toEqual({
			success: true,
		});
		expect(lastCall().options).toMatchObject({
			method: 'DELETE',
			url: 'families/7',
		});
	});
});
