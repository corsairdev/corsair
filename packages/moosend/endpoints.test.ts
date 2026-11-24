import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	Campaigns,
	Lists,
	Segments,
	Senders,
	Subscribers,
	Transactional,
} from './endpoints';
import { moosendEndpointSchemas } from './index';
import {
	CAMPAIGN_ID,
	campaign,
	campaignListItem,
	campaignSummary,
	emptyAnalytics,
	LIST_ID,
	mailingList,
	openedRow,
	paging,
	SEGMENT_ID,
	SUBSCRIBER_ID,
	segment,
	sender,
	subscriber,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'moosend-key-123';
const ctx = { key: API_KEY, options: {}, keys: {} };

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant; each returns its own output type.
// unknown: each endpoint resolves to its own output type; the cases compare
// results with toEqual, so the shared return type stays open.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON envelopes.
function respond(envelope: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(envelope), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

// unknown: a Context can be any JSON value.
const ok = (context: unknown, error: string | null = null) => ({
	Code: 0,
	Error: error,
	Context: context,
});

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		host: parsed.host,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

type Case = {
	op: string;
	fn: AnyEndpoint;
	// unknown: each case passes its own operation's input.
	input: unknown;
	method: string;
	path: string;
	query?: Record<string, string>;
	// unknown: the expected JSON body of that operation.
	body?: unknown;
	// unknown: the Context Moosend answers with.
	context: unknown;
	notice?: string;
	// unknown: the expected parsed output.
	expected: unknown;
};

const done = { success: true };
const L = `/v3/lists/${LIST_ID}`;
const S = `/v3/subscribers/${LIST_ID}`;
const C = `/v3/campaigns/${CAMPAIGN_ID}`;

const cases: Case[] = [
	{
		op: 'lists.list',
		fn: Lists.list,
		input: { withStatistics: false, sortBy: 'Name', sortMethod: 'ASC' },
		method: 'GET',
		path: '/v3/lists.json',
		query: { WithStatistics: 'false', SortBy: 'Name', SortMethod: 'ASC' },
		context: { Paging: paging, MailingLists: [mailingList] },
		expected: { Paging: paging, MailingLists: [mailingList] },
	},
	{
		op: 'lists.listPaged',
		fn: Lists.listPaged,
		input: { page: 2, pageSize: 5 },
		method: 'GET',
		path: '/v3/lists/2/5.json',
		context: { Paging: paging, MailingLists: [] },
		expected: { Paging: paging, MailingLists: [] },
	},
	{
		op: 'lists.get',
		fn: Lists.get,
		input: { mailingListId: LIST_ID },
		method: 'GET',
		path: `${L}/details.json`,
		context: mailingList,
		expected: mailingList,
	},
	{
		op: 'lists.create',
		fn: Lists.create,
		input: {
			name: 'Newsletter',
			confirmationPage: 'https://example.com/thanks',
			preferences: { selectType: 'SingleSelect', options: ['a', 'b'] },
		},
		method: 'POST',
		path: '/v3/lists/create.json',
		body: {
			Name: 'Newsletter',
			ConfirmationPage: 'https://example.com/thanks',
			Preferences: { SelectType: 'SingleSelect', Options: ['a', 'b'] },
		},
		context: LIST_ID,
		expected: { mailingListId: LIST_ID },
	},
	{
		op: 'lists.update',
		fn: Lists.update,
		input: {
			mailingListId: LIST_ID,
			name: 'Newsletter 2',
			redirectAfterUnsubscribePage: 'https://example.com/bye',
		},
		method: 'POST',
		path: `${L}/update.json`,
		body: {
			Name: 'Newsletter 2',
			RedirectAfterUnsubscribePage: 'https://example.com/bye',
		},
		context: LIST_ID,
		expected: { mailingListId: LIST_ID },
	},
	{
		op: 'lists.delete',
		fn: Lists.remove,
		input: { mailingListId: LIST_ID },
		method: 'DELETE',
		path: `${L}/delete.json`,
		context: null,
		expected: done,
	},
	{
		op: 'customFields.create',
		fn: Lists.createCustomField,
		input: {
			mailingListId: LIST_ID,
			name: 'Town',
			type: 'SingleSelectDropdown',
			options: ['Athens', 'London'],
		},
		method: 'POST',
		path: `${L}/customfields/create.json`,
		body: {
			Name: 'Town',
			CustomFieldType: 'SingleSelectDropdown',
			Options: 'Athens,London',
		},
		context: 'cf-1',
		expected: { customFieldId: 'cf-1' },
	},
	{
		op: 'customFields.update',
		fn: Lists.updateCustomField,
		input: {
			mailingListId: LIST_ID,
			customFieldId: 'cf-1',
			name: 'Country',
			isHidden: true,
		},
		method: 'POST',
		path: `${L}/customfields/cf-1/update.json`,
		body: { Name: 'Country', IsHidden: true },
		context: null,
		expected: done,
	},
	{
		op: 'customFields.delete',
		fn: Lists.removeCustomField,
		input: { mailingListId: LIST_ID, customFieldId: 'cf-1' },
		method: 'DELETE',
		path: `${L}/customfields/cf-1/delete.json`,
		context: null,
		expected: done,
	},
	{
		op: 'subscribers.list',
		fn: Subscribers.list,
		input: { mailingListId: LIST_ID, status: 'Bounced', page: 1, pageSize: 10 },
		method: 'GET',
		path: `${L}/subscribers/Bounced.json`,
		query: { Page: '1', PageSize: '10' },
		context: { Paging: paging, Subscribers: [subscriber] },
		expected: { Paging: paging, Subscribers: [subscriber] },
	},
	{
		op: 'subscribers.getByEmail',
		fn: Subscribers.getByEmail,
		input: { mailingListId: LIST_ID, email: 'a@example.com' },
		method: 'GET',
		path: `${S}/view.json`,
		query: { Email: 'a@example.com' },
		context: subscriber,
		expected: subscriber,
	},
	{
		op: 'subscribers.getById',
		fn: Subscribers.getById,
		input: { mailingListId: LIST_ID, subscriberId: SUBSCRIBER_ID },
		method: 'GET',
		path: `${S}/find/${SUBSCRIBER_ID}.json`,
		context: subscriber,
		expected: subscriber,
	},
	{
		op: 'subscribers.getByIdAnyList',
		fn: Subscribers.getByIdAnyList,
		input: { subscriberId: SUBSCRIBER_ID },
		method: 'GET',
		path: `/v3/subscribers/${SUBSCRIBER_ID}.json`,
		context: subscriber,
		expected: subscriber,
	},
	{
		op: 'subscribers.subscribe',
		fn: Subscribers.subscribe,
		input: {
			mailingListId: LIST_ID,
			email: 'a@example.com',
			name: 'A',
			customFields: { Country: 'NL', Age: 25 },
			tags: ['vip-test'],
			hasExternalDoubleOptIn: true,
		},
		method: 'POST',
		path: `${S}/subscribe.json`,
		body: {
			Email: 'a@example.com',
			Name: 'A',
			CustomFields: ['Country=NL', 'Age=25'],
			Tags: ['vip-test'],
			HasExternalDoubleOptIn: true,
		},
		context: subscriber,
		expected: subscriber,
	},
	{
		op: 'subscribers.subscribeMany',
		fn: Subscribers.subscribeMany,
		input: {
			mailingListId: LIST_ID,
			subscribers: [
				{ email: 'a@example.com', customFields: { Country: 'UK' } },
			],
		},
		method: 'POST',
		path: `${S}/subscribe_many.json`,
		body: {
			Subscribers: [{ Email: 'a@example.com', CustomFields: ['Country=UK'] }],
		},
		context: [subscriber],
		notice:
			'1 items were ignored because Email is not valid for recipients bad',
		expected: {
			subscribers: [subscriber],
			notice:
				'1 items were ignored because Email is not valid for recipients bad',
		},
	},
	{
		op: 'subscribers.update',
		fn: Subscribers.update,
		input: {
			mailingListId: LIST_ID,
			subscriberId: SUBSCRIBER_ID,
			email: 'a@example.com',
			name: 'A2',
		},
		method: 'POST',
		path: `${S}/update/${SUBSCRIBER_ID}.json`,
		body: { Email: 'a@example.com', Name: 'A2' },
		context: subscriber,
		expected: subscriber,
	},
	{
		op: 'subscribers.unsubscribe',
		fn: Subscribers.unsubscribe,
		input: { mailingListId: LIST_ID, email: 'a@example.com' },
		method: 'POST',
		path: `${S}/unsubscribe.json`,
		body: { Email: 'a@example.com' },
		context: null,
		expected: done,
	},
	{
		op: 'subscribers.unsubscribeFromCampaign',
		fn: Subscribers.unsubscribeFromCampaign,
		input: {
			mailingListId: LIST_ID,
			campaignId: CAMPAIGN_ID,
			email: 'a@example.com',
		},
		method: 'POST',
		path: `${S}/${CAMPAIGN_ID}/unsubscribe.json`,
		body: { Email: 'a@example.com' },
		context: null,
		expected: done,
	},
	{
		op: 'subscribers.unsubscribeFromAccount',
		fn: Subscribers.unsubscribeFromAccount,
		input: { email: 'a@example.com' },
		method: 'POST',
		path: '/v3/subscribers/unsubscribe.json',
		body: { Email: 'a@example.com' },
		context: null,
		expected: done,
	},
	{
		op: 'subscribers.remove',
		fn: Subscribers.remove,
		input: { mailingListId: LIST_ID, email: 'a@example.com' },
		method: 'POST',
		path: `${S}/remove.json`,
		body: { Email: 'a@example.com' },
		context: null,
		expected: done,
	},
	{
		op: 'subscribers.removeMany',
		fn: Subscribers.removeMany,
		input: {
			mailingListId: LIST_ID,
			emails: ['a@example.com', 'b@example.com'],
		},
		method: 'POST',
		path: `${S}/remove_many.json`,
		body: { Emails: 'a@example.com,b@example.com' },
		context: { EmailsIgnored: 0, EmailsProcessed: 2 },
		expected: { EmailsIgnored: 0, EmailsProcessed: 2 },
	},
	{
		op: 'subscribers.delete',
		fn: Subscribers.deleteOne,
		input: { mailingListId: LIST_ID, email: 'a@example.com' },
		method: 'POST',
		path: `${S}/delete.json`,
		body: { Email: 'a@example.com' },
		context: null,
		expected: done,
	},
	{
		op: 'subscribers.deleteMany',
		fn: Subscribers.deleteMany,
		input: { mailingListId: LIST_ID, emails: ['a@example.com'] },
		method: 'POST',
		path: `${S}/delete_many.json`,
		body: { Emails: ['a@example.com'] },
		context: { EmailsIgnored: 0, EmailsProcessed: 1 },
		expected: { EmailsIgnored: 0, EmailsProcessed: 1 },
	},
	{
		op: 'subscribers.deleteFromAccount',
		fn: Subscribers.deleteFromAccount,
		input: { email: 'a@example.com', includeAllSubAccounts: false },
		method: 'POST',
		path: '/v3/subscribers/delete.json',
		body: { Email: 'a@example.com', IncludeAllSubAccounts: false },
		context: null,
		expected: done,
	},
	{
		op: 'subscribers.addTags',
		fn: Subscribers.addTags,
		input: {
			mailingListId: LIST_ID,
			members: [{ subscriberId: SUBSCRIBER_ID, tags: ['vip-test'] }],
		},
		method: 'POST',
		path: `${S}/add_tags.json`,
		body: { MembersTags: [{ MemberId: SUBSCRIBER_ID, Tags: ['vip-test'] }] },
		context: null,
		expected: done,
	},
	{
		op: 'subscribers.removeTags',
		fn: Subscribers.removeTags,
		input: {
			mailingListId: LIST_ID,
			members: [{ subscriberId: SUBSCRIBER_ID, tags: ['vip-test'] }],
		},
		method: 'POST',
		path: `${S}/delete_tags.json`,
		body: { MembersTags: [{ MemberId: SUBSCRIBER_ID, Tags: ['vip-test'] }] },
		context: null,
		expected: done,
	},
	{
		op: 'segments.list',
		fn: Segments.list,
		input: { mailingListId: LIST_ID },
		method: 'GET',
		path: `${L}/segments.json`,
		context: { Paging: paging, Segments: [segment] },
		expected: { Paging: paging, Segments: [segment] },
	},
	{
		op: 'segments.get',
		fn: Segments.get,
		input: { mailingListId: LIST_ID, segmentId: SEGMENT_ID },
		method: 'GET',
		path: `${L}/segments/${SEGMENT_ID}/details.json`,
		context: segment,
		expected: segment,
	},
	{
		op: 'segments.members',
		fn: Segments.members,
		input: {
			mailingListId: LIST_ID,
			segmentId: SEGMENT_ID,
			page: 1,
			pageSize: 2,
		},
		method: 'GET',
		path: `${L}/segments/${SEGMENT_ID}/members.json`,
		query: { Page: '1', PageSize: '2' },
		context: { Paging: paging, Subscribers: [subscriber] },
		expected: { Paging: paging, Subscribers: [subscriber] },
	},
	{
		op: 'segments.create',
		fn: Segments.create,
		input: {
			mailingListId: LIST_ID,
			name: 'corsair-seg',
			matchType: 'All',
			criteria: [
				{ field: 'RecipientEmail', comparer: 'EndsWith', value: 'example.com' },
			],
		},
		method: 'POST',
		path: `${L}/segments/create.json`,
		body: {
			Name: 'corsair-seg',
			MatchType: 'All',
			Criteria: [
				{ Field: 'RecipientEmail', Comparer: 'EndsWith', Value: 'example.com' },
			],
		},
		context: SEGMENT_ID,
		expected: { segmentId: SEGMENT_ID },
	},
	{
		op: 'segments.update',
		fn: Segments.update,
		input: {
			mailingListId: LIST_ID,
			segmentId: SEGMENT_ID,
			name: 'corsair-seg-2',
			matchType: 'Any',
		},
		method: 'POST',
		path: `${L}/segments/${SEGMENT_ID}/update.json`,
		body: { Name: 'corsair-seg-2', MatchType: 'Any' },
		context: null,
		expected: done,
	},
	{
		op: 'segments.addCriteria',
		fn: Segments.addCriteria,
		input: {
			mailingListId: LIST_ID,
			segmentId: SEGMENT_ID,
			field: 'DateAdded',
			dateFunction: 'Year',
			comparer: 'Is',
			value: '2026',
		},
		method: 'POST',
		path: `${L}/segments/${SEGMENT_ID}/criteria/add.json`,
		body: {
			Field: 'DateAdded',
			DateFunction: 'Year',
			Comparer: 'Is',
			Value: '2026',
		},
		context: 2,
		expected: { criterionNumber: 2 },
	},
	{
		op: 'segments.updateCriteria',
		fn: Segments.updateCriteria,
		input: {
			mailingListId: LIST_ID,
			segmentId: SEGMENT_ID,
			criterionNumber: 1,
			field: 'RecipientName',
			comparer: 'Contains',
			value: 'Plugin',
		},
		method: 'POST',
		path: `${L}/segments/${SEGMENT_ID}/criteria/1/update.json`,
		body: { Field: 'RecipientName', Comparer: 'Contains', Value: 'Plugin' },
		context: null,
		expected: done,
	},
	{
		op: 'segments.delete',
		fn: Segments.remove,
		input: { mailingListId: LIST_ID, segmentId: SEGMENT_ID },
		method: 'DELETE',
		path: `${L}/segments/${SEGMENT_ID}/delete.json`,
		context: null,
		expected: done,
	},
	{
		op: 'campaigns.list',
		fn: Campaigns.list,
		input: { page: 1, pageSize: 5, sortBy: 'Name', sortMethod: 'ASC' },
		method: 'GET',
		path: '/v3/campaigns/1/5.json',
		query: { SortBy: 'Name', SortMethod: 'ASC' },
		context: { Paging: paging, Campaigns: [campaignListItem] },
		expected: { Paging: paging, Campaigns: [campaignListItem] },
	},
	{
		op: 'campaigns.get',
		fn: Campaigns.get,
		input: { campaignId: CAMPAIGN_ID },
		method: 'GET',
		path: `${C}/view.json`,
		context: campaign,
		expected: campaign,
	},
	{
		op: 'campaigns.create',
		fn: Campaigns.create,
		input: {
			name: 'corsair-plugin-test',
			subject: 'Hello',
			senderEmail: 'sender@example.com',
			htmlContent: '<p>hi</p>',
			mailingLists: [{ mailingListId: LIST_ID, segmentId: SEGMENT_ID }],
		},
		method: 'POST',
		path: '/v3/campaigns/create.json',
		body: {
			Name: 'corsair-plugin-test',
			Subject: 'Hello',
			SenderEmail: 'sender@example.com',
			ReplyToEmail: 'sender@example.com',
			HTMLContent: '<p>hi</p>',
			MailingLists: [{ MailingListID: LIST_ID, SegmentID: SEGMENT_ID }],
			IsAB: false,
		},
		context: CAMPAIGN_ID,
		expected: { campaignId: CAMPAIGN_ID },
	},
	{
		op: 'campaigns.update',
		fn: Campaigns.update,
		input: {
			campaignId: CAMPAIGN_ID,
			name: 'n',
			subject: 's',
			senderEmail: 'sender@example.com',
			replyToEmail: 'reply@example.com',
		},
		method: 'POST',
		path: `${C}/update.json`,
		body: {
			Name: 'n',
			Subject: 's',
			SenderEmail: 'sender@example.com',
			ReplyToEmail: 'reply@example.com',
			IsAB: false,
		},
		context: null,
		expected: done,
	},
	{
		op: 'campaigns.clone',
		fn: Campaigns.clone,
		input: { campaignId: CAMPAIGN_ID },
		method: 'POST',
		path: `${C}/clone.json`,
		context: campaign,
		expected: campaign,
	},
	{
		op: 'campaigns.delete',
		fn: Campaigns.remove,
		input: { campaignId: CAMPAIGN_ID },
		method: 'DELETE',
		path: `${C}/delete.json`,
		context: null,
		expected: done,
	},
	{
		op: 'campaigns.send',
		fn: Campaigns.send,
		input: { campaignId: CAMPAIGN_ID },
		method: 'POST',
		path: `${C}/send.json`,
		context: null,
		expected: done,
	},
	{
		op: 'campaigns.sendTest',
		fn: Campaigns.sendTest,
		input: { campaignId: CAMPAIGN_ID, testEmails: ['qa@example.com'] },
		method: 'POST',
		path: `${C}/send_test.json`,
		body: { TestEmails: ['qa@example.com'] },
		context: null,
		expected: done,
	},
	{
		op: 'campaigns.schedule',
		fn: Campaigns.schedule,
		input: {
			campaignId: CAMPAIGN_ID,
			dateTime: '24-12-2026 13:17',
			timezone: 'UTC',
		},
		method: 'POST',
		path: `${C}/schedule.json`,
		body: { DateTime: '24-12-2026 13:17', Timezone: 'UTC' },
		context: null,
		expected: done,
	},
	{
		op: 'campaigns.unschedule',
		fn: Campaigns.unschedule,
		input: { campaignId: CAMPAIGN_ID },
		method: 'POST',
		path: `${C}/unschedule.json`,
		context: null,
		expected: done,
	},
	{
		op: 'campaigns.summary',
		fn: Campaigns.summary,
		input: { campaignId: CAMPAIGN_ID },
		method: 'GET',
		path: `${C}/view_summary.json`,
		context: campaignSummary,
		expected: campaignSummary,
	},
	{
		op: 'campaigns.abSummary',
		fn: Campaigns.abSummary,
		input: { campaignId: CAMPAIGN_ID },
		method: 'GET',
		path: `${C}/view_ab_summary.json`,
		context: { A: { Sent: 10 }, B: { Sent: 10 } },
		expected: { A: { Sent: 10 }, B: { Sent: 10 } },
	},
	{
		op: 'campaigns.stats',
		fn: Campaigns.stats,
		input: {
			campaignId: CAMPAIGN_ID,
			type: 'Opened',
			page: 1,
			pageSize: 50,
			from: '2026-11-01',
		},
		method: 'GET',
		path: `${C}/stats/Opened.json`,
		query: { Page: '1', PageSize: '50', From: '2026-11-01' },
		context: emptyAnalytics,
		expected: emptyAnalytics,
	},
	{
		op: 'campaigns.activityByLocation',
		fn: Campaigns.activityByLocation,
		input: { campaignId: CAMPAIGN_ID },
		method: 'GET',
		path: `${C}/stats/countries.json`,
		context: { Paging: paging, Analytics: [openedRow] },
		expected: { Paging: paging, Analytics: [openedRow] },
	},
	{
		op: 'campaigns.linkActivity',
		fn: Campaigns.linkActivity,
		input: { campaignId: CAMPAIGN_ID },
		method: 'GET',
		path: `${C}/stats/links.json`,
		context: emptyAnalytics,
		expected: emptyAnalytics,
	},
	{
		op: 'senders.list',
		fn: Senders.list,
		input: {},
		method: 'GET',
		path: '/v3/senders/find_all.json',
		context: [sender],
		expected: { senders: [sender] },
	},
	{
		op: 'senders.get',
		fn: Senders.get,
		input: { email: 'sender@example.com' },
		method: 'GET',
		path: '/v3/senders/find_one.json',
		query: { Email: 'sender@example.com' },
		context: sender,
		expected: sender,
	},
	{
		op: 'transactional.send',
		fn: Transactional.send,
		input: {
			templateName: 'receipt',
			from: { email: 'sender@example.com', name: 'Shop' },
			personalizations: [
				{
					to: [{ email: 'a@example.com', name: 'A' }],
					substitutions: { order: { id: 7 } },
				},
			],
			mailSettings: { bypassUnsubscribeManagement: false },
		},
		method: 'POST',
		path: '/v3/campaigns/transactional/send.json',
		body: {
			TemplateName: 'receipt',
			From: { Email: 'sender@example.com', Name: 'Shop' },
			Personalizations: [
				{
					To: [{ Email: 'a@example.com', Name: 'A' }],
					Substitutions: { order: { id: 7 } },
				},
			],
			MailSettings: { BypassUnsubscribeManagement: { Enable: false } },
		},
		context: null,
		expected: { result: null },
	},
];

describe('every operation', () => {
	it('has a request-mapping case', () => {
		expect(cases.map((c) => c.op).sort()).toEqual(
			Object.keys(moosendEndpointSchemas).sort(),
		);
	});

	it.each(cases)(
		'$op sends the documented request and parses the answer',
		async (c) => {
			respond(ok(c.context, c.notice ?? null));

			const result = await invoke(c.fn, c.input);

			const sent = lastRequest();
			expect(sent.host).toBe('api.moosend.com');
			expect(sent.method).toBe(c.method);
			expect(sent.path).toBe(c.path);
			const { apikey, ...query } = sent.query;
			expect(apikey).toBe(API_KEY);
			expect(query).toEqual(c.query ?? {});
			expect(sent.body).toEqual(c.body);
			expect(result).toEqual(c.expected);
			expect(mockLog).toHaveBeenCalledWith(
				expect.anything(),
				`moosend.${c.op}`,
				expect.anything(),
				'completed',
			);
		},
	);
});

describe('request details', () => {
	it('lists subscribed members when no status is given', async () => {
		respond(ok({ Paging: paging, Subscribers: [] }));
		await invoke(Subscribers.list, { mailingListId: LIST_ID });
		expect(lastRequest().path).toBe(`${L}/subscribers/Subscribed.json`);
	});

	it('uses the plain campaigns route without paging and the page route with only a page', async () => {
		respond(ok({ Paging: paging, Campaigns: [] }));
		await invoke(Campaigns.list, {});
		expect(lastRequest().path).toBe('/v3/campaigns.json');

		respond(ok({ Paging: paging, Campaigns: [] }));
		await invoke(Campaigns.list, { page: 3 });
		expect(lastRequest().path).toBe('/v3/campaigns/3.json');
	});

	it('reads Sent activity when no stats type is given', async () => {
		respond(ok(emptyAnalytics));
		await invoke(Campaigns.stats, { campaignId: CAMPAIGN_ID });
		expect(lastRequest().path).toBe(`${C}/stats/Sent.json`);
	});

	it('encodes ids in the path', async () => {
		respond(ok(mailingList));
		await invoke(Lists.get, { mailingListId: 'a/../b' });
		expect(lastRequest().path).toBe('/v3/lists/a%2F..%2Fb/details.json');
	});

	it('does not log subscriber emails', async () => {
		respond(ok(subscriber));
		await invoke(Subscribers.subscribe, {
			mailingListId: LIST_ID,
			email: 'secret@example.com',
		});
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('secret@');
	});
});

describe('campaigns.list on an account with no campaigns', () => {
	it('returns an empty list for CAMPAIGN_NOT_FOUND', async () => {
		respond({ Code: 400, Error: 'CAMPAIGN_NOT_FOUND', Context: null });
		await expect(invoke(Campaigns.list, {})).resolves.toEqual({
			Paging: null,
			Campaigns: [],
		});
	});

	it('still throws other failures', async () => {
		respond({ Code: 104, Error: 'API_KEY_NOT_VALID', Context: null });
		await expect(invoke(Campaigns.list, {})).rejects.toMatchObject({
			status: 401,
		});
	});

	it('still throws CAMPAIGN_NOT_FOUND on a single campaign', async () => {
		respond({ Code: 400, Error: 'CAMPAIGN_NOT_FOUND', Context: null });
		await expect(
			invoke(Campaigns.get, { campaignId: CAMPAIGN_ID }),
		).rejects.toBeInstanceOf(ApiError);
	});
});

describe('input validation', () => {
	it.each([
		[
			'a short tag',
			Subscribers.addTags,
			{
				mailingListId: LIST_ID,
				members: [{ subscriberId: SUBSCRIBER_ID, tags: ['x'] }],
			},
		],
		[
			'a dropdown option with a comma',
			Lists.createCustomField,
			{
				mailingListId: LIST_ID,
				name: 'Town',
				options: ['a,b'],
			},
		],
		[
			'a string segment id',
			Segments.get,
			{
				mailingListId: LIST_ID,
				segmentId: 'abc',
			},
		],
		[
			'criterion number 0',
			Segments.updateCriteria,
			{
				mailingListId: LIST_ID,
				segmentId: SEGMENT_ID,
				criterionNumber: 0,
				field: 'RecipientName',
				comparer: 'Is',
			},
		],
		[
			'no test recipients',
			Campaigns.sendTest,
			{
				campaignId: CAMPAIGN_ID,
				testEmails: [],
			},
		],
		[
			'an invalid email',
			Subscribers.subscribe,
			{
				mailingListId: LIST_ID,
				email: 'not-an-email',
			},
		],
	] as const)('rejects %s before calling Moosend', async (_, fn, input) => {
		await expect(invoke(fn, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('output validation', () => {
	it('rejects a list answer without its MailingLists array', async () => {
		respond(ok({ Paging: paging }));
		await expect(invoke(Lists.list, {})).rejects.toThrow();
	});

	it('rejects a create answer without an id', async () => {
		respond(ok(null));
		await expect(invoke(Lists.create, { name: 'x' })).rejects.toThrow();
	});

	it('keeps fields Moosend adds later', async () => {
		respond(ok({ ...subscriber, NewField: 'kept' }));
		await expect(
			invoke(Subscribers.getById, {
				mailingListId: LIST_ID,
				subscriberId: SUBSCRIBER_ID,
			}),
		).resolves.toMatchObject({ NewField: 'kept' });
	});
});
