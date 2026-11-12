import { logEventFromContext } from 'corsair/core';
import {
	Account,
	Contacts,
	Forms,
	Responses,
	Segments,
	Users,
} from './endpoints';
import {
	ACCOUNT,
	BAD_REQUEST,
	CONTACT,
	CONTACTS,
	FORM_DUPLICATED,
	FORM_HISTORY,
	FORM_PUBLISHED,
	FORMS,
	FORMS_WITH_INFO,
	IDENTIFIED,
	OK,
	REPORT_COUNT,
	REPORT_CSAT,
	REPORT_DISTRIBUTION,
	REPORT_DISTRIBUTION_EMPTY_LIVE,
	REPORT_NPS,
	REPORT_RATINGS,
	REPORT_RATINGS_LIVE,
	RESPONSE_STORED,
	RESPONSES,
	SEGMENT_SYNCED,
	SEGMENTS,
} from './test-fixtures';
import { invoke, lastRequest, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account.get', () => {
	it('reads the subscription usage and environments', async () => {
		respond(fetchMock, ACCOUNT);

		const result = await invoke(Account.get, {});

		expect(lastRequest(fetchMock).path).toBe('/v1/account');
		expect(result.subscription?.plan).toBe('Friends & Family');
		expect(result.subscription?.msr_count).toBe(23);
		expect(result.subscription?.msr_limit).toBe(1000);
		expect(result.environments).toHaveLength(2);
	});

	it('logs the plan and the environment count', async () => {
		respond(fetchMock, ACCOUNT);

		await invoke(Account.get, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'refiner.account.get',
			{ plan: 'Friends & Family', environments: 2, responses: 23 },
			'completed',
		);
	});
});

describe('users.identify', () => {
	it('identifies a user by ID', async () => {
		respond(fetchMock, IDENTIFIED, 201);

		const result = await invoke(Users.identify, {
			id: 'user-1',
			email: 'jane@awesome.com',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/identify-user');
		expect(request.method).toBe('POST');
		expect(request.bodyRecord).toMatchObject({
			id: 'user-1',
			email: 'jane@awesome.com',
		});
		expect(result.contact_uuid).toBe('15cce3d0-ed5d-11ea-aaef-e58a2a43e996');
	});

	it('forwards every unrecognised key as a trait', async () => {
		respond(fetchMock, IDENTIFIED, 201);

		await invoke(Users.identify, {
			id: 'user-1',
			some_attribute: 'Manager',
			another_attribute: true,
			created_at: '2020-08-20T14:48:00.000Z',
		});

		// Refiner infers a trait's type from the value, so nothing is coerced here.
		expect(lastRequest(fetchMock).bodyRecord).toMatchObject({
			some_attribute: 'Manager',
			another_attribute: true,
			created_at: '2020-08-20T14:48:00.000Z',
		});
	});

	it('keeps a number a number, so Refiner reads it as numeric', async () => {
		respond(fetchMock, IDENTIFIED, 201);

		await invoke(Users.identify, { id: 'user-1', a_number: 42 });

		expect(lastRequest(fetchMock).bodyRecord?.a_number).toBe(42);
	});

	it('passes the nested account object through', async () => {
		respond(fetchMock, IDENTIFIED, 201);

		await invoke(Users.identify, {
			id: 'user-1',
			account: { id: 'Your-Account-Id', name: 'Awesome Inc.' },
		});

		expect(lastRequest(fetchMock).bodyRecord?.account).toEqual({
			id: 'Your-Account-Id',
			name: 'Awesome Inc.',
		});
	});

	it('rejects an account object without an id before sending', async () => {
		await expect(
			invoke(Users.identify, { id: 'user-1', account: { name: 'Acme' } }),
		).rejects.toThrow(/account/);
		await expect(
			invoke(Responses.store, {
				id: 'u',
				form_uuid: 'FORM_UUID',
				account: { id: '' },
			}),
		).rejects.toThrow(/account/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a call with neither an id nor an email', async () => {
		await expect(
			invoke(Users.identify, { some_attribute: 'Manager' }),
		).rejects.toThrow(/id or an email/i);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts an email alone', async () => {
		respond(fetchMock, IDENTIFIED, 201);

		await invoke(Users.identify, { email: 'jane@awesome.com' });

		expect(lastRequest(fetchMock).bodyRecord?.email).toBe('jane@awesome.com');
	});

	it('declares itself replayable, since identifying twice updates one contact', async () => {
		respond(fetchMock, IDENTIFIED, 201);

		await invoke(Users.identify, { id: 'user-1' });

		expect(lastRequest(fetchMock).method).toBe('POST');
	});
});

describe('users.track', () => {
	it('tracks an event for a user', async () => {
		respond(fetchMock, OK);

		const result = await invoke(Users.track, {
			id: 'user-1',
			event: 'completed_onboarding',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/track-event');
		expect(request.bodyRecord).toEqual({
			id: 'user-1',
			event: 'completed_onboarding',
		});
		expect(result.message).toBe('ok');
	});

	it('rejects a call with no user identifier', async () => {
		await expect(invoke(Users.track, { event: 'x' })).rejects.toThrow();
	});

	it('rejects a call with no event name', async () => {
		await expect(invoke(Users.track, { id: 'user-1' })).rejects.toThrow();
	});

	it('logs the event name, never the user', async () => {
		respond(fetchMock, OK);

		await invoke(Users.track, { id: 'user-1', event: 'signed_up' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'refiner.users.track',
			{ event: 'signed_up' },
			'completed',
		);
	});
});

describe('responses.list', () => {
	it('lists responses with their answers and contact', async () => {
		respond(fetchMock, RESPONSES);

		const result = await invoke(Responses.list, {});

		expect(lastRequest(fetchMock).path).toBe('/v1/responses');
		expect(result.items).toHaveLength(2);
		expect(result.items?.[0]?.data?.first_question).toBe('First Reply');
		expect(result.pagination?.next_page_cursor).toBeDefined();
	});

	it('keeps a survey view whose answers are all null', async () => {
		respond(fetchMock, RESPONSES);

		const result = await invoke(Responses.list, {});

		// A view with no answers has null data values and a null completed_at.
		expect(result.items?.[1]?.data?.first_question).toBeNull();
		expect(result.items?.[1]?.completed_at).toBeNull();
	});

	it('passes the paging cursor', async () => {
		respond(fetchMock, RESPONSES);

		await invoke(Responses.list, { page_cursor: 'abc123', page_length: 50 });

		expect(lastRequest(fetchMock).query).toMatchObject({
			page_cursor: 'abc123',
			page_length: '50',
		});
	});

	it('builds the bracketed filter keys', async () => {
		respond(fetchMock, RESPONSES);

		await invoke(Responses.list, {
			form_uuid: 'FORM_UUID',
			response_data: { nps: 9 },
			contact_data: { country: 'France' },
			account_data: { plan: 'pro' },
		});

		const query = lastRequest(fetchMock).query;
		expect(query['response_data[nps]']).toBe('9');
		expect(query['contact_data[country]']).toBe('France');
		expect(query['account_data[plan]']).toBe('pro');
	});

	it('sends the plural filters as indexed array keys', async () => {
		respond(fetchMock, RESPONSES);

		await invoke(Responses.list, {
			form_uuids: ['a', 'b'],
			segment_uuids: ['c'],
			tag_uuids: ['d', 'e'],
		});

		// Live, a plain or comma-joined form_uuids answers 400 "The form uuids
		// value must be an object."; form_uuids[0]=a&form_uuids[1]=b filters.
		const query = lastRequest(fetchMock).query;
		expect(query.form_uuids).toBeUndefined();
		expect(query['form_uuids[0]']).toBe('a');
		expect(query['form_uuids[1]']).toBe('b');
		expect(query['segment_uuids[0]']).toBe('c');
		expect(query['tag_uuids[0]']).toBe('d');
		expect(query['tag_uuids[1]']).toBe('e');
	});

	it('sends with_attributes as 1 or 0, the form the API reads', async () => {
		respond(fetchMock, RESPONSES);

		await invoke(Responses.list, { with_attributes: true });

		expect(lastRequest(fetchMock).query.with_attributes).toBe('1');
	});

	it('rejects a page length over the documented 1,000', async () => {
		await expect(
			invoke(Responses.list, { page_length: 1001 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an include value Refiner does not document', async () => {
		await expect(
			invoke(Responses.list, { include: 'dismissed' }),
		).rejects.toThrow();
	});

	it('logs the count and whether another page exists', async () => {
		respond(fetchMock, RESPONSES);

		await invoke(Responses.list, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'refiner.responses.list',
			{ count: 2, total: 1100, nextPage: true },
			'completed',
		);
	});
});

describe('responses.store', () => {
	it('stores a response with its answers', async () => {
		respond(fetchMock, RESPONSE_STORED);

		const result = await invoke(Responses.store, {
			id: 'user-1',
			form_uuid: 'FORM_UUID',
			nps_question: 9,
			a_question_identifier: 'Some value',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/responses');
		expect(request.method).toBe('POST');
		expect(request.bodyRecord).toMatchObject({
			id: 'user-1',
			form_uuid: 'FORM_UUID',
			nps_question: 9,
			a_question_identifier: 'Some value',
		});
		expect(result.uuid).toBe('fcbb8b30-3dfe-11f0-a0bf-6b2696a5a3c8');
	});

	it('carries the date, tags and duplicate flag', async () => {
		respond(fetchMock, RESPONSE_STORED);

		await invoke(Responses.store, {
			id: 'user-1',
			form_uuid: 'FORM_UUID',
			date: '2024-01-15T10:30:00Z',
			tags: ['import'],
			prevent_duplicates: false,
			nps: 9,
		});

		expect(lastRequest(fetchMock).bodyRecord).toMatchObject({
			date: '2024-01-15T10:30:00Z',
			tags: ['import'],
			prevent_duplicates: false,
		});
	});

	it('accepts a Refiner uuid instead of an id', async () => {
		respond(fetchMock, RESPONSE_STORED);

		await invoke(Responses.store, {
			uuid: '15cce3d0-ed5d-11ea-aaef-e58a2a43e996',
			form_uuid: 'FORM_UUID',
			nps: 9,
		});

		expect(lastRequest(fetchMock).bodyRecord?.uuid).toBeDefined();
	});

	it('rejects a store with no user identifier', async () => {
		await expect(
			invoke(Responses.store, { form_uuid: 'FORM_UUID', nps: 9 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a store with no form_uuid', async () => {
		await expect(
			invoke(Responses.store, { id: 'user-1', nps: 9 }),
		).rejects.toThrow();
	});

	it('rejects more than the documented 20 tags', async () => {
		const tags = Array.from({ length: 21 }, (_, index) => `tag${index}`);

		await expect(
			invoke(Responses.store, { id: 'u', form_uuid: 'f', tags, nps: 9 }),
		).rejects.toThrow();
	});

	it('logs the new response UUID', async () => {
		respond(fetchMock, RESPONSE_STORED);

		await invoke(Responses.store, { id: 'u', form_uuid: 'f', nps: 9 });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'refiner.responses.store',
			{ responseUuid: 'fcbb8b30-3dfe-11f0-a0bf-6b2696a5a3c8' },
			'completed',
		);
	});
});

describe('responses.tag', () => {
	it('tags a response', async () => {
		respond(fetchMock, OK);

		await invoke(Responses.tag, {
			uuid: 'Survey-Response-UUID',
			tags: ['First tag', 'Second tag'],
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/responses/tags');
		expect(request.bodyRecord).toEqual({
			uuid: 'Survey-Response-UUID',
			tags: ['First tag', 'Second tag'],
		});
	});

	it('rejects an empty tag list', async () => {
		await expect(
			invoke(Responses.tag, { uuid: 'r1', tags: [] }),
		).rejects.toThrow();
	});

	it('rejects more than 20 tags', async () => {
		const tags = Array.from({ length: 21 }, (_, index) => `t${index}`);

		await expect(invoke(Responses.tag, { uuid: 'r1', tags })).rejects.toThrow();
	});
});

describe('reporting.get', () => {
	it('reads an NPS report', async () => {
		respond(fetchMock, REPORT_NPS);

		const result = await invoke(Responses.report, {
			type: 'nps',
			form_uuids: ['FORM_UUID'],
			date_range_start: '2024-12-12',
			date_range_end: '2025-04-18',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/reporting');
		expect(request.query.type).toBe('nps');
		expect(request.query.form_uuids).toBeUndefined();
		expect(request.query['form_uuids[0]']).toBe('FORM_UUID');
		expect(result.nps).toBe(53);
		expect(result.count).toBe(66);
		expect(result.data?.promoters).toBe(40);
	});

	it('reads a CSAT report', async () => {
		respond(fetchMock, REPORT_CSAT);

		const result = await invoke(Responses.report, { type: 'csat' });

		expect(result.csat).toBe(83);
		expect(result.data?.verysatisfied).toBe(23);
	});

	it('reads a ratings report with its average', async () => {
		respond(fetchMock, REPORT_RATINGS);

		const result = await invoke(Responses.report, { type: 'ratings' });

		expect(result.average).toBe(5);
		expect(result.sum).toBe(5);
	});

	it('reads a live ratings report whose buckets arrive as an array', async () => {
		respond(fetchMock, REPORT_RATINGS_LIVE);

		const result = await invoke(Responses.report, {
			type: 'ratings',
		});

		// Index n of the array is the count for rating n.
		expect(result.data?.['9']).toBe(2);
		expect(result.data?.['10']).toBe(1);
		expect(result.data?.['0']).toBe(0);
		expect(result.average).toBe(9.33);
	});

	it('reads an empty distribution report, whose data is []', async () => {
		respond(fetchMock, REPORT_DISTRIBUTION_EMPTY_LIVE);

		const result = await invoke(Responses.report, {
			type: 'distribution',
		});

		expect(result.data).toEqual({});
		expect(result.responses).toBe(0);
	});

	it('reads a distribution report', async () => {
		respond(fetchMock, REPORT_DISTRIBUTION);

		const result = await invoke(Responses.report, {
			type: 'distribution',
		});

		expect(result.responses).toBe(66);
		expect(result.datapoints).toBe(67);
	});

	it('reads a count report', async () => {
		respond(fetchMock, REPORT_COUNT);

		const result = await invoke(Responses.report, { type: 'count' });

		expect(result.views).toBe(148);
		expect(result.responses).toBe(130);
	});

	it('passes the question identifiers and filters', async () => {
		respond(fetchMock, REPORT_NPS);

		await invoke(Responses.report, {
			type: 'nps',
			question_identifiers: ['nps', 'csat'],
			response_data: { nps: 9 },
			contact_data: { country: 'France' },
		});

		const query = lastRequest(fetchMock).query;
		expect(query['question_identifiers[0]']).toBe('nps');
		expect(query['question_identifiers[1]']).toBe('csat');
		expect(query['response_data[nps]']).toBe('9');
		expect(query['contact_data[country]']).toBe('France');
	});

	it('rejects a report type Refiner does not document', async () => {
		await expect(invoke(Responses.report, { type: 'ces' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a report with no type', async () => {
		await expect(invoke(Responses.report, {})).rejects.toThrow();
	});
});

describe('contacts.list', () => {
	it('lists contacts with their traits, segments and account', async () => {
		respond(fetchMock, CONTACTS);

		const result = await invoke(Contacts.list, {});

		expect(lastRequest(fetchMock).path).toBe('/v1/contacts');
		expect(result.items?.[0]?.remote_id).toBe('Your-Contact-ID');
		expect(result.items?.[0]?.segments?.[0]?.name).toBe('Power Users Segment');
		expect(result.items?.[0]?.account?.display_name).toBe('Awesome Inc.');
	});

	it('merges a survey answer into the attributes map as a string', async () => {
		respond(fetchMock, CONTACTS);

		const result = await invoke(Contacts.list, {});

		expect(result.items?.[0]?.attributes?.a_survey_answer).toBe('9');
	});

	it('passes order_by and the filters', async () => {
		respond(fetchMock, CONTACTS);

		await invoke(Contacts.list, {
			order_by: 'last_seen_at',
			search: 'jane',
			segment_uuid: 'seg-1',
		});

		expect(lastRequest(fetchMock).query).toMatchObject({
			order_by: 'last_seen_at',
			search: 'jane',
			segment_uuid: 'seg-1',
		});
	});

	it('rejects an order_by Refiner does not document', async () => {
		await expect(
			invoke(Contacts.list, { order_by: 'created_at' }),
		).rejects.toThrow();
	});
});

describe('contacts.get', () => {
	it('reads one contact by ID', async () => {
		respond(fetchMock, CONTACT);

		const result = await invoke(Contacts.get, { id: 'user-1' });

		expect(lastRequest(fetchMock).path).toBe('/v1/contact');
		expect(lastRequest(fetchMock).query.id).toBe('user-1');
		expect(result.email).toBe('jane@awesome.com');
	});

	it('accepts an email or a UUID instead', async () => {
		respond(fetchMock, CONTACT);

		await invoke(Contacts.get, { email: 'jane@awesome.com' });

		expect(lastRequest(fetchMock).query.email).toBe('jane@awesome.com');
	});

	it('rejects a lookup with no identifier', async () => {
		await expect(invoke(Contacts.get, {})).rejects.toThrow();
	});
});

describe('contacts.delete', () => {
	it('deletes a contact by ID', async () => {
		respond(fetchMock, OK);

		await invoke(Contacts.remove, { id: 'user-1' });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/v1/contact');
		expect(request.query.id).toBe('user-1');
	});

	it('rejects a delete with no identifier', async () => {
		await expect(invoke(Contacts.remove, {})).rejects.toThrow();
	});
});

describe('forms.list', () => {
	it('lists the surveys', async () => {
		respond(fetchMock, FORMS);

		const result = await invoke(Forms.list, {});

		expect(lastRequest(fetchMock).path).toBe('/v1/forms');
		expect(result.items).toHaveLength(2);
		expect(result.pagination?.items_count).toBe(10);
	});

	it('reads the info fields when include_info is set', async () => {
		respond(fetchMock, FORMS_WITH_INFO);

		const result = await invoke(Forms.list, { include_info: true });

		expect(lastRequest(fetchMock).query.include_info).toBe('1');
		expect(result.items?.[0]?.responses_count).toBe(0);
		expect(result.items?.[0]?.page_url).toContain('survey.refiner.io');
	});

	it('sends include_info and include_config false as 0', async () => {
		respond(fetchMock, FORMS);

		await invoke(Forms.list, { include_info: false, include_config: false });

		// Live, include_info=false still returned every info field; only 0 leaves
		// them out.
		const query = lastRequest(fetchMock).query;
		expect(query.include_info).toBe('0');
		expect(query.include_config).toBe('0');
	});

	it('rejects a list value Refiner does not document', async () => {
		await expect(invoke(Forms.list, { list: 'trash' })).rejects.toThrow();
	});
});

describe('forms.publish', () => {
	it('publishes a survey', async () => {
		respond(fetchMock, FORM_PUBLISHED);

		const result = await invoke(Forms.publish, {
			form_uuid: 'FORM_UUID',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/forms/publish');
		expect(request.method).toBe('POST');
		expect(result.message).toContain('published successfully');
	});

	it('unpublishes with published: false', async () => {
		respond(fetchMock, FORM_PUBLISHED);

		await invoke(Forms.publish, { form_uuid: 'FORM_UUID', published: false });

		// The API reads 1 and 0 rather than true and false.
		expect(lastRequest(fetchMock).bodyRecord?.published).toBe(0);
	});

	it('sends published as 1 when true', async () => {
		respond(fetchMock, FORM_PUBLISHED);

		await invoke(Forms.publish, { form_uuid: 'FORM_UUID', published: true });

		expect(lastRequest(fetchMock).bodyRecord?.published).toBe(1);
	});

	it('logs that publishing is the default', async () => {
		respond(fetchMock, FORM_PUBLISHED);

		await invoke(Forms.publish, { form_uuid: 'FORM_UUID' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'refiner.forms.publish',
			{ formUuid: 'FORM_UUID', published: true },
			'completed',
		);
	});
});

describe('forms.archive', () => {
	it('archives rather than deletes, despite the DELETE verb', async () => {
		respond(fetchMock, OK);

		await invoke(Forms.archive, { form_uuid: 'FORM_UUID' });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/v1/forms');
		expect(request.bodyRecord).toEqual({ form_uuid: 'FORM_UUID' });
	});
});

describe('forms.duplicate', () => {
	it('duplicates a survey into a new draft', async () => {
		respond(fetchMock, FORM_DUPLICATED);

		const result = await invoke(Forms.duplicate, {
			form_uuid: 'FORM_UUID',
			name: 'NEW_FORM_NAME',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/forms/duplicate');
		expect(request.bodyRecord).toEqual({
			form_uuid: 'FORM_UUID',
			name: 'NEW_FORM_NAME',
		});
		expect(result.new_form_uuid).toBe('NEW_FORM_UUID');
	});

	it('rejects a duplicate with no name', async () => {
		await expect(
			invoke(Forms.duplicate, { form_uuid: 'FORM_UUID' }),
		).rejects.toThrow();
	});
});

describe('forms.history', () => {
	it('lists the survey versions', async () => {
		respond(fetchMock, FORM_HISTORY);

		const result = await invoke(Forms.history, {
			form_uuid: 'FORM_UUID',
		});

		expect(lastRequest(fetchMock).path).toBe('/v1/forms/history');
		expect(lastRequest(fetchMock).query.form_uuid).toBe('FORM_UUID');
		expect(result.items?.[0]?.action).toBe('update');
		expect(result.items?.[0]?.snapshot?.name).toBe('Net Promoter Score (NPS)');
		expect(result.pagination?.items_count).toBe(18);
	});

	it('logs the version count', async () => {
		respond(fetchMock, FORM_HISTORY);

		await invoke(Forms.history, { form_uuid: 'FORM_UUID' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'refiner.forms.history',
			{ versions: 1, total: 18 },
			'completed',
		);
	});
});

describe('segments.list', () => {
	it('lists segments and their manual flag', async () => {
		respond(fetchMock, SEGMENTS);

		const result = await invoke(Segments.list, {});

		expect(lastRequest(fetchMock).path).toBe('/v1/segments');
		expect(result.items?.[0]?.is_manual).toBe(true);
		expect(result.items?.[1]?.is_manual).toBe(false);
	});
});

describe('segments.sync', () => {
	it('adds a user to a manual segment with POST', async () => {
		respond(fetchMock, SEGMENT_SYNCED);

		const result = await invoke(Segments.sync, {
			id: 'user-1',
			segment_uuid: 'SEGMENT_UUID',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/v1/sync-segment');
		expect(request.bodyRecord).toEqual({
			id: 'user-1',
			segment_uuid: 'SEGMENT_UUID',
		});
		expect(result.segment_uuid).toBe('4f5637d0-3d0d-11ea-b965-614418dec30c');
	});

	it('removes a user with DELETE, since the route distinguishes them only by method', async () => {
		respond(fetchMock, OK);

		await invoke(Segments.sync, {
			id: 'user-1',
			segment_uuid: 'SEGMENT_UUID',
			remove: true,
		});

		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('rejects a sync with no user identifier', async () => {
		await expect(
			invoke(Segments.sync, { segment_uuid: 'SEGMENT_UUID' }),
		).rejects.toThrow();
	});

	it('logs whether the user was removed', async () => {
		respond(fetchMock, OK);

		await invoke(Segments.sync, {
			id: 'u',
			segment_uuid: 's',
			remove: true,
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'refiner.segments.sync',
			{ segmentUuid: 's', removed: true },
			'completed',
		);
	});
});

describe('error propagation', () => {
	it('surfaces a 400 with its message', async () => {
		respond(fetchMock, BAD_REQUEST, 400);

		await expect(
			invoke(Responses.store, { id: 'u', form_uuid: 'FORM_UUID', nps: 9 }),
		).rejects.toThrow('The form_uuid field is required.');
		// The input is valid, so the failure is Refiner's 400, not the schema's.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
