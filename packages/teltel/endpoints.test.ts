import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { teltelErrorDetails } from './client';
import { Campaigns, Contacts, Numbers, Sms } from './endpoints';
import {
	badRequestResponse,
	balanceResponse,
	callCreateResponse,
	callsListResponse,
	campaignActionResponse,
	campaignCreateResponse,
	campaignResponse,
	campaignsListResponse,
	contactCreateResponse,
	contactGroupResponse,
	contactGroupsListResponse,
	contactResponse,
	contactsBulkResponse,
	contactsListResponse,
	deletedResponse,
	forbiddenResponse,
	inboxListResponse,
	inboxMessageResponse,
	numberCountriesListResponse,
	numberCountryResponse,
	numberResponse,
	numbersListResponse,
	priceGroupsListResponse,
	smsReportResponse,
	smsReportsListResponse,
	smsSendBulkPartial,
	smsSendBulkResponse,
	smsSendResponse,
	unauthenticatedResponse,
	updatedResponse,
	usersListResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'teltel-test-key';

// The fake context only carries what the endpoints read (ctx.key). Typing the
// endpoint generically keeps each call's own output type.
function invoke<E extends (ctx: never, input: never) => Promise<unknown>>(
	endpoint: E,
	// unknown: negative cases pass values no schema accepts.
	input: unknown,
): ReturnType<E> {
	return endpoint({ key: API_KEY } as never, input as never) as ReturnType<E>;
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
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.teltel.io');
	// TelTEL reads the key from X-API-KEY, keeping it out of the URL.
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	expect(sent.query.apikey).toBeUndefined();
}

/**
 * Resolves to the rejection reason, narrowed to the plugin's own error type.
 * A promise can reject with any value, so this is the one place the reason is
 * treated as untyped before it is narrowed.
 */
async function rejection(promise: Promise<unknown>): Promise<ApiError> {
	const caught = await promise.then(
		() => undefined,
		// unknown: a rejection reason has no static type.
		(caught: unknown) => caught,
	);
	expect(caught).toBeInstanceOf(ApiError);
	return caught as ApiError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account.balance', () => {
	it('GETs the balance and parses the float amounts', async () => {
		respond(balanceResponse);

		const result = await invoke(Sms.accountBalance, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v2/account/balance',
			method: 'GET',
		});
		expect(result.data.balance).toBe(190.01);
		// A negative credit means money is owed.
		expect(result.data.credit).toBe(-9.99);
	});

	it('also reads the one-entry list the spec documents', async () => {
		respond({ data: [{ credit: 0, credit_limit: 0, balance: 5 }] });

		const result = await invoke(Sms.accountBalance, {});

		expect(result.data.balance).toBe(5);
	});
});

describe('sms.send', () => {
	it('POSTs /v2/sms/text with the body wrapped in data', async () => {
		respond(smsSendResponse);

		const result = await invoke(Sms.smsSend, {
			from: '37126118199',
			to: '37126118198',
			message: 'Hello from TelTEL',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/sms/text',
			method: 'POST',
		});
		// TelTEL refuses an unwrapped body, so the data key is required.
		expect(lastRequest().body).toEqual({
			data: {
				from: '37126118199',
				to: '37126118198',
				message: 'Hello from TelTEL',
			},
		});
		expect(result.data.id).toBe('1832256');
	});

	it('rejects a sender shorter than three characters', async () => {
		await expect(
			invoke(Sms.smsSend, { from: 'ab', to: '37126118198', message: 'Hi' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a message with no body', async () => {
		await expect(
			invoke(Sms.smsSend, { from: '37126118199', to: '37126118198' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('sms.sendBulk', () => {
	it('POSTs an array of messages as the data value', async () => {
		respond(smsSendBulkResponse);

		const result = await invoke(Sms.smsSendBulk, {
			messages: [
				{ from: '37126118199', to: '37126118198', message: 'One' },
				{ from: '37126118199', to: '37126118197', message: 'Two' },
			],
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/sms/bulk/text',
			method: 'POST',
		});
		// The bulk route takes the array itself as data, not an object.
		expect(Array.isArray((lastRequest().body as { data: unknown }).data)).toBe(
			true,
		);
		expect((lastRequest().body as { data: unknown[] }).data).toHaveLength(2);
		expect(Array.isArray(result.data)).toBe(true);
	});

	it('parses a 207 partial result instead of failing the call', async () => {
		respond(smsSendBulkPartial, 207);

		const result = await invoke(Sms.smsSendBulk, {
			messages: [
				{ from: '37126118199', to: '37126118198', message: 'One' },
				{ from: '37126118199', to: 'not-a-number', message: 'Two' },
			],
		});

		// A partial success must parse: one message went out, one did not.
		expect(Array.isArray(result.data)).toBe(false);
	});

	it('parses the split when it arrives at the top level', async () => {
		respond(
			{
				success: [{ id: '109', index: 0 }],
				errors: [{ index: 1, title: 'Invalid number' }],
			},
			207,
		);

		const result = await invoke(Sms.smsSendBulk, {
			messages: [
				{ from: '37126118199', to: '37126118198', message: 'One' },
				{ from: '37126118199', to: 'not-a-number', message: 'Two' },
			],
		});

		expect(result.errors?.[0]?.index).toBe(1);
		expect(result.success?.[0]?.id).toBe('109');
	});

	it('rejects an empty message list', async () => {
		await expect(invoke(Sms.smsSendBulk, { messages: [] })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('smsReports and inbox', () => {
	it('lists outbound reports with offset paging', async () => {
		respond(smsReportsListResponse);

		const result = await invoke(Sms.smsReportsList, {
			limit: 100,
			offset: 50,
			state: 'DONE',
			'created_at[from]': '2024-03-01T00:00:00',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/sms/reports',
			method: 'GET',
		});
		// TelTEL ignores top-level filters; they all go in one `filter` value.
		expect(lastRequest().query).toEqual({
			limit: '100',
			offset: '50',
			filter: 'state=DONE,created_at>2024-03-01T00:00:00',
		});
		expect(result.data[0]?.id).toBe(1832256);
		expect(result.data[0]?.country?.mcc).toBe(247);
	});

	it('reads one outbound report', async () => {
		respond(smsReportResponse);

		const result = await invoke(Sms.smsReportsGet, { reportId: 1832256 });

		expect(lastRequest().path).toBe('/v2/sms/reports/1832256');
		expect(result.data.state).toBe('delivered');
	});

	it('lists and reads inbound messages', async () => {
		respond(inboxListResponse);
		const listed = await invoke(Sms.inboxList, { limit: 10 });
		expect(lastRequest().path).toBe('/v2/sms/inbox/reports');
		expect(listed.data[0]?.message).toBe('Reply from a customer');

		respond(inboxMessageResponse);
		const one = await invoke(Sms.inboxGet, { inboxMessageId: 991 });
		expect(lastRequest().path).toBe('/v2/sms/inbox/reports/991');
		expect(one.data.id).toBe(991);
	});

	it('rejects a page size above the documented 5000 cap', async () => {
		await expect(invoke(Sms.smsReportsList, { limit: 6000 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('campaigns', () => {
	it('lists campaigns and reads one', async () => {
		respond(campaignsListResponse);
		const listed = await invoke(Campaigns.list, {});
		expect(lastRequest().path).toBe('/v2/sms/campaigns');
		expect(listed.data[0]?.title).toBe('Spring sale');

		respond(campaignResponse);
		await invoke(Campaigns.get, { campaignId: 781 });
		expect(lastRequest().path).toBe('/v2/sms/campaigns/781');
	});

	it('creates a campaign with its groups wrapped in data', async () => {
		respond(campaignCreateResponse);

		const result = await invoke(Campaigns.create, {
			title: 'Spring sale',
			from: '37126118199',
			contact_groups: [5, 6],
			message: 'Spring sale starts now',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/sms/campaigns',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			data: {
				title: 'Spring sale',
				from: '37126118199',
				contact_groups: [5, 6],
				message: 'Spring sale starts now',
			},
		});
		expect(result.data.id).toBe(781);
	});

	it('rejects a campaign with no contact groups', async () => {
		await expect(
			invoke(Campaigns.create, {
				title: 'x',
				from: '37126118199',
				contact_groups: [],
				message: 'y',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('updates a campaign without the id in the body', async () => {
		respond(updatedResponse);

		const result = await invoke(Campaigns.update, {
			campaignId: 781,
			title: 'Spring sale 2',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/sms/campaigns/781',
			method: 'PATCH',
		});
		expect(lastRequest().body).toEqual({ data: { title: 'Spring sale 2' } });
		expect(result).toEqual({ meta: { updated: true } });
	});

	it('starts a campaign through the actions route', async () => {
		respond(campaignActionResponse);

		const result = await invoke(Campaigns.action, {
			campaignId: 781,
			action: 'start',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/sms/campaigns/781/actions',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({ data: { action: 'start' } });
		expect(result.data?.action).toBe('start');
		expect(result.data?.id).toBe(761);
	});

	it('rejects an unknown campaign action', async () => {
		await expect(
			invoke(Campaigns.action, { campaignId: 781, action: 'archive' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('deletes a campaign and keeps the meta envelope', async () => {
		respond(deletedResponse);

		const result = await invoke(Campaigns.remove, { campaignId: 781 });

		expect(lastRequest()).toMatchObject({
			path: '/v2/sms/campaigns/781',
			method: 'DELETE',
		});
		expect(result).toEqual({ meta: { deleted: true } });
	});

	it('fails a delete whose body has no meta envelope', async () => {
		// A success flag the provider never sends must not read as a delete.
		respond({ success: true });

		await expect(
			invoke(Campaigns.remove, { campaignId: 781 }),
		).rejects.toThrow();
	});
});

describe('contacts', () => {
	it('lists contacts filtered by group', async () => {
		respond(contactsListResponse);

		const result = await invoke(Contacts.contactsList, { group_id: 5 });

		expect(lastRequest().path).toBe('/v2/contacts');
		expect(lastRequest().query).toEqual({ filter: 'group_id=5' });
		expect(result.data[0]?.phone).toBe('37121234567');
	});

	it('creates a contact and keeps the create response', async () => {
		respond(contactCreateResponse);

		const result = await invoke(Contacts.contactsCreate, {
			phone: '37121234567',
			group_id: 5,
		});

		expect(lastRequest().body).toEqual({
			data: { phone: '37121234567', group_id: 5 },
		});
		expect(result.data.id).toBe(981);
	});

	it('rejects a contact with no group', async () => {
		await expect(
			invoke(Contacts.contactsCreate, { phone: '37121234567' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates contacts in bulk as a data array', async () => {
		respond(contactsBulkResponse);

		await invoke(Contacts.contactsCreateBulk, {
			contacts: [
				{ phone: '37121234567', group_id: 5 },
				{ phone: '37121234568', group_id: 5 },
			],
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/contacts/bulk',
			method: 'POST',
		});
		expect((lastRequest().body as { data: unknown[] }).data).toHaveLength(2);
	});

	it('gets, updates and deletes a contact', async () => {
		respond(contactResponse);
		await invoke(Contacts.contactsGet, { contactId: 981 });
		expect(lastRequest().path).toBe('/v2/contacts/981');

		respond(updatedResponse);
		const updated = await invoke(Contacts.contactsUpdate, {
			contactId: 981,
			param_1: 'VIP',
		});
		expect(lastRequest()).toMatchObject({ method: 'PATCH' });
		expect(lastRequest().body).toEqual({ data: { param_1: 'VIP' } });
		expect(updated).toEqual({ meta: { updated: true } });

		respond(deletedResponse);
		await invoke(Contacts.contactsRemove, { contactId: 981 });
		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
	});

	it('rejects an update that changes nothing', async () => {
		await expect(
			invoke(Contacts.contactsUpdate, { contactId: 981 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('contactGroups', () => {
	it('lists groups and reads one', async () => {
		respond(contactGroupsListResponse);
		const listed = await invoke(Contacts.groupsList, {});
		expect(lastRequest().path).toBe('/v2/contacts/groups');
		expect(listed.data[0]?.total_contacts).toBe(120);

		respond(contactGroupResponse);
		await invoke(Contacts.groupsGet, { groupId: 5 });
		expect(lastRequest().path).toBe('/v2/contacts/groups/5');
	});

	it('creates, renames and deletes a group', async () => {
		respond(contactGroupResponse);
		await invoke(Contacts.groupsCreate, { name: 'Customers' });
		expect(lastRequest()).toMatchObject({
			path: '/v2/contacts/groups',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({ data: { name: 'Customers' } });

		respond(updatedResponse);
		await invoke(Contacts.groupsUpdate, {
			groupId: 5,
			name: 'Clients',
		});
		expect(lastRequest().body).toEqual({ data: { name: 'Clients' } });

		respond(deletedResponse);
		await invoke(Contacts.groupsRemove, { groupId: 5 });
		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
	});

	it('lists the contacts in a group', async () => {
		respond(contactsListResponse);

		const result = await invoke(Contacts.groupsContacts, { groupId: 5 });

		expect(lastRequest().path).toBe('/v2/contacts/groups/5/contacts');
		expect(result.data).toHaveLength(1);
	});
});

describe('calls', () => {
	it('lists calls with the direction filter', async () => {
		respond(callsListResponse);

		const result = await invoke(Numbers.callsList, {
			direction: 'outbound',
			limit: 50,
		});

		expect(lastRequest().path).toBe('/v2/calls');
		expect(lastRequest().query).toEqual({
			filter: 'direction=outbound',
			limit: '50',
		});
		expect(result.data[0]?.duration_sec).toBe(4);
		expect(result.data[0]?.caller?.user_id).toBe(21312);
	});

	it('places a click-to-call with both display names', async () => {
		respond(callCreateResponse);

		const result = await invoke(Numbers.callsCreate, {
			caller_number: '37126111111',
			destination_number: '37126111112',
			destination_displayname: 'Support',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/calls',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			data: {
				caller_number: '37126111111',
				destination_number: '37126111112',
				destination_displayname: 'Support',
			},
		});
		expect(result.data?.status).toBe(200);
	});

	it('rejects a call with no destination display name', async () => {
		await expect(
			invoke(Numbers.callsCreate, {
				caller_number: '37126111111',
				destination_number: '37126111112',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('numbers, countries and users', () => {
	it('lists and reads DID numbers', async () => {
		respond(numbersListResponse);
		const listed = await invoke(Numbers.numbersList, {});
		expect(lastRequest().path).toBe('/v2/dids/my-numbers');
		expect(listed.data[0]?.did).toBe('37126118199');

		respond(numberResponse);
		await invoke(Numbers.numbersGet, { numberId: 115 });
		expect(lastRequest().path).toBe('/v2/dids/my-numbers/115');
	});

	it('updates a number and parses the number it returns', async () => {
		// The spec answers this PATCH with the updated number, not a meta flag.
		respond(numberResponse);

		const result = await invoke(Numbers.numbersUpdate, {
			numberId: 115,
			auto_renew: false,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/dids/my-numbers/115',
			method: 'PATCH',
		});
		expect(lastRequest().body).toEqual({ data: { auto_renew: false } });
		expect(result.data.id).toBe(115);
	});

	it('lists countries, reads one, and lists its price groups', async () => {
		respond(numberCountriesListResponse);
		const countries = await invoke(Numbers.countriesList, {});
		expect(lastRequest().path).toBe('/v2/dids/new-numbers/countries');
		expect(countries.data[0]?.prefix).toBe('371');

		respond(numberCountryResponse);
		await invoke(Numbers.countryGet, { countryId: 115 });
		expect(lastRequest().path).toBe('/v2/dids/new-numbers/countries/115');

		respond(priceGroupsListResponse);
		const groups = await invoke(Numbers.priceGroupsList, { countryId: 115 });
		expect(lastRequest().path).toBe(
			'/v2/dids/new-numbers/countries/115/price-groups',
		);
		expect(groups.data[0]?.price_group_id).toBe(1525);
	});

	it('lists users', async () => {
		respond(usersListResponse);

		const result = await invoke(Numbers.usersList, {});

		expect(lastRequest().path).toBe('/v2/users');
		expect(result.data[0]?.realname).toBe('John Doe');
		// TelTEL sends each user's API key; it must not reach the caller.
		expect(result.data[0]).not.toHaveProperty('api_key');
		expect(JSON.stringify(result)).not.toContain('user-api-key-must-not-leak');
	});
});

describe('error handling', () => {
	it('separates a missing key from a refused one', async () => {
		respond(unauthenticatedResponse, 401);
		const missing = await rejection(invoke(Sms.accountBalance, {}));
		expect(missing.status).toBe(401);
		expect(teltelErrorDetails(missing)?.errors[0]?.code).toBe('40100');

		respond(forbiddenResponse, 403);
		const refused = await rejection(invoke(Sms.accountBalance, {}));
		expect(refused.status).toBe(403);
		expect(teltelErrorDetails(refused)?.errors[0]?.code).toBe('40300');
	});

	it('parses a 400 with the detail', async () => {
		respond(badRequestResponse, 400);

		const error = await rejection(
			invoke(Sms.smsSend, {
				from: '37126118199',
				to: 'x',
				message: 'Hi',
			}),
		);

		expect(error.status).toBe(400);
		expect(teltelErrorDetails(error)?.errors[0]?.title).toContain(
			'Bad request.',
		);
		// The phone numbers and text in the send body stay off the error.
		expect(error.request.body).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('37126118199');
	});

	it('masks a phone number in the list filter on the error', async () => {
		respond(forbiddenResponse, 403);

		const error = await rejection(
			invoke(Contacts.contactsList, { phone: '37121234567' }),
		);

		expect(error.request.query).toMatchObject({ filter: '[REDACTED]' });
		expect(error.url).not.toContain('37121234567');
		expect(JSON.stringify(error)).not.toContain('37121234567');
		expect(require('node:util').inspect(error)).not.toContain('37121234567');
	});

	it('never leaks the key through the error', async () => {
		respond(forbiddenResponse, 403);

		const error = await rejection(invoke(Sms.accountBalance, {}));

		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});

	it('fails loudly when data is missing from a 200 body', async () => {
		respond({ records: [] });

		await expect(invoke(Numbers.numbersList, {})).rejects.toThrow();
	});
});

describe('logging', () => {
	it('logs the operation without the input', async () => {
		respond(balanceResponse);

		await invoke(Sms.accountBalance, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'teltel.account.balance',
			{},
			'completed',
		);
	});
});
