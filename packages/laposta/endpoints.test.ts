import { createCorsair } from 'corsair';
import { laposta } from './index';

const API_KEY = 'test-laposta-key';
const corsair = createCorsair({ plugins: [laposta({ key: API_KEY })] });
const api = corsair.laposta.api;

const list = {
	list_id: 'list-1',
	name: 'Newsletter',
	state: 'active',
	locked: false,
	members: { active: 12, unsubscribed: 1, cleaned: 0 },
};
const member = {
	member_id: 'member-1',
	list_id: 'list-1',
	email: 'person@example.net',
	state: 'active',
	custom_fields: { interests: ['news', 'events'] },
};
const field = {
	field_id: 'field-1',
	list_id: 'list-1',
	name: 'City',
	datatype: 'text',
	required: false,
	in_form: true,
	in_list: true,
};
const segment = {
	segment_id: 'segment-1',
	list_id: 'list-1',
	name: 'Local members',
	definition: '"city" = \'Utrecht\'',
};
const webhook = {
	webhook_id: 'webhook-1',
	list_id: 'list-1',
	state: 'active',
	event: 'modified',
	url: 'https://example.net/laposta-hook',
	blocked: false,
	secret: 'webhook-signing-secret',
};
const campaign = { campaign_id: 'campaign-1', name: 'Monthly news' };
const report = {
	account_id: 'account-1',
	campaign_id: 'campaign-1',
	sent: 100,
	accepted: 98,
	cleaned: 2,
	complained: 0,
	hardbounced: 2,
	unsubscribed: 1,
	opened_unique: 40,
	clicked_unique: 8,
	webversion_unique: 1,
	accepted_ratio: 0.98,
	opened_ratio: 0.4,
	clicked_ratio: 0.08,
};
const history = {
	pagination: { limit: 100, has_more: false, next_cursor: null },
	order: { order_by: 'event_date', order: 'desc' },
	filters: { timezone: 'Europe/Amsterdam' },
	data: [],
};
const memberSync = {
	report: {
		provided_count: 1,
		errors_count: 0,
		skipped_count: 0,
		edited_count: 0,
		added_count: 1,
	},
	errors: [],
	skipped: [],
	edited: [],
	added: [],
};

type EndpointCase = {
	name: string;
	method: string;
	path: string;
	// unknown because each operation has a distinct raw JSON response fixture.
	response: Record<string, unknown>;
	// unknown because the operation-specific response types differ across test cases.
	run: () => Promise<unknown>;
	query?: Record<string, string>;
	form?: Record<string, string>;
	formRepeated?: Record<string, string[]>;
	// unknown because request body fixtures have different documented shapes.
	jsonBody?: Record<string, unknown>;
};

const endpointCases: EndpointCase[] = [
	{
		name: 'lists.list',
		method: 'GET',
		path: '/v2/list',
		response: { data: [{ list }] },
		run: () => api.lists.list({}),
	},
	{
		name: 'lists.get',
		method: 'GET',
		path: '/v2/list/list-1',
		response: { list },
		run: () => api.lists.get({ list_id: 'list-1' }),
	},
	{
		name: 'lists.create',
		method: 'POST',
		path: '/v2/list',
		response: { list },
		run: () => api.lists.create({ name: 'Newsletter' }),
		form: { name: 'Newsletter' },
	},
	{
		name: 'lists.update',
		method: 'POST',
		path: '/v2/list/list-1',
		response: { list },
		run: () => api.lists.update({ list_id: 'list-1', name: 'Newsletter' }),
		form: { name: 'Newsletter' },
	},
	{
		name: 'lists.delete',
		method: 'DELETE',
		path: '/v2/list/list-1',
		response: { list: { ...list, state: 'deleted' } },
		run: () => api.lists.delete({ list_id: 'list-1' }),
	},
	{
		name: 'lists.purge_members',
		method: 'DELETE',
		path: '/v2/list/list-1/members',
		response: { list },
		run: () => api.lists.purge_members({ list_id: 'list-1' }),
	},
	{
		name: 'lists.sync_members',
		method: 'POST',
		path: '/v2/list/list-1/members',
		response: memberSync,
		run: () =>
			api.lists.sync_members({
				actions: ['add'],
				list_id: 'list-1',
				members: [{ email: 'person@example.net' }],
			}),
		jsonBody: { actions: ['add'], members: [{ email: 'person@example.net' }] },
	},
	{
		name: 'members.list with cursor pagination',
		method: 'GET',
		path: '/v2/member',
		response: {
			data: [{ member }],
			pagination: { limit: 25, has_more: true, next_cursor: 'cursor-2' },
		},
		run: () =>
			api.members.list({
				list_id: 'list-1',
				state: 'active',
				limit: 25,
				cursor: 'cursor-1',
			}),
		query: {
			list_id: 'list-1',
			state: 'active',
			limit: '25',
			cursor: 'cursor-1',
		},
	},
	{
		name: 'members.get',
		method: 'GET',
		path: '/v2/member/member-1',
		response: { member },
		run: () => api.members.get({ list_id: 'list-1', member_id: 'member-1' }),
		query: { list_id: 'list-1' },
	},
	{
		name: 'members.get encodes plus-addressed IDs as documented',
		method: 'GET',
		path: '/v2/member/name%252Btag%40example.net',
		response: { member },
		run: () =>
			api.members.get({ list_id: 'list-1', member_id: 'name+tag@example.net' }),
		query: { list_id: 'list-1' },
	},
	{
		name: 'members.create includes required IP and nested custom fields',
		method: 'POST',
		path: '/v2/member',
		response: { member },
		run: () =>
			api.members.create({
				list_id: 'list-1',
				email: 'person@example.net',
				ip: '198.51.100.10',
				custom_fields: { interests: ['news', 'events'] },
			}),
		form: {
			list_id: 'list-1',
			email: 'person@example.net',
			ip: '198.51.100.10',
			'custom_fields[interests][]': 'news',
		},
		formRepeated: { 'custom_fields[interests][]': ['news', 'events'] },
	},
	{
		name: 'members.update',
		method: 'POST',
		path: '/v2/member/member-1',
		response: { member },
		run: () =>
			api.members.update({
				list_id: 'list-1',
				member_id: 'member-1',
				state: 'unsubscribed',
				custom_fields: { city: 'Utrecht' },
			}),
		query: { list_id: 'list-1' },
		form: { state: 'unsubscribed', 'custom_fields[city]': 'Utrecht' },
	},
	{
		name: 'members.delete',
		method: 'DELETE',
		path: '/v2/member/member-1',
		response: { member: { ...member, state: 'deleted' } },
		run: () => api.members.delete({ list_id: 'list-1', member_id: 'member-1' }),
		query: { list_id: 'list-1' },
	},
	{
		name: 'members.history',
		method: 'GET',
		path: '/v2/member/member-1/history',
		response: history,
		run: () =>
			api.members.history({
				list_id: 'list-1',
				member_id: 'member-1',
				limit: 100,
				order: 'desc',
			}),
		query: { list_id: 'list-1', limit: '100', order: 'desc' },
	},
	{
		name: 'fields.list',
		method: 'GET',
		path: '/v2/field',
		response: { data: [{ field }] },
		run: () => api.fields.list({ list_id: 'list-1' }),
		query: { list_id: 'list-1' },
	},
	{
		name: 'fields.get',
		method: 'GET',
		path: '/v2/field/field-1',
		response: { field },
		run: () => api.fields.get({ list_id: 'list-1', field_id: 'field-1' }),
		query: { list_id: 'list-1' },
	},
	{
		name: 'fields.create requires all field booleans and encodes option arrays',
		method: 'POST',
		path: '/v2/field',
		response: {
			field: { ...field, datatype: 'select_single', options: ['Red', 'Blue'] },
		},
		run: () =>
			api.fields.create({
				list_id: 'list-1',
				name: 'Color',
				datatype: 'select_single',
				options: ['Red', 'Blue'],
				required: false,
				in_form: true,
				in_list: true,
			}),
		form: {
			list_id: 'list-1',
			name: 'Color',
			datatype: 'select_single',
			'options[]': 'Red',
			required: 'false',
			in_form: 'true',
			in_list: 'true',
		},
		formRepeated: { 'options[]': ['Red', 'Blue'] },
	},
	{
		name: 'fields.update uses JSON for documented options_full',
		method: 'POST',
		path: '/v2/field/field-1',
		response: { field },
		run: () =>
			api.fields.update({
				list_id: 'list-1',
				field_id: 'field-1',
				options_full: { '1': 'Red', 'new-0': 'Blue' },
			}),
		jsonBody: {
			list_id: 'list-1',
			options_full: { '1': 'Red', 'new-0': 'Blue' },
		},
	},
	{
		name: 'fields.delete',
		method: 'DELETE',
		path: '/v2/field/field-1',
		response: { field: { ...field, state: 'deleted' } },
		run: () => api.fields.delete({ list_id: 'list-1', field_id: 'field-1' }),
		query: { list_id: 'list-1' },
	},
	{
		name: 'segments.list',
		method: 'GET',
		path: '/v2/segment',
		response: { data: [{ segment }] },
		run: () => api.segments.list({ list_id: 'list-1' }),
		query: { list_id: 'list-1' },
	},
	{
		name: 'segments.get',
		method: 'GET',
		path: '/v2/segment/segment-1',
		response: { segment },
		run: () => api.segments.get({ list_id: 'list-1', segment_id: 'segment-1' }),
		query: { list_id: 'list-1' },
	},
	{
		name: 'segments.create',
		method: 'POST',
		path: '/v2/segment',
		response: { segment },
		run: () =>
			api.segments.create({
				list_id: 'list-1',
				name: 'Local members',
				definition: '"city" = \'Utrecht\'',
			}),
		form: {
			list_id: 'list-1',
			name: 'Local members',
			definition: '"city" = \'Utrecht\'',
		},
	},
	{
		name: 'segments.update',
		method: 'POST',
		path: '/v2/segment/segment-1',
		response: { segment },
		run: () =>
			api.segments.update({
				list_id: 'list-1',
				segment_id: 'segment-1',
				name: 'Local members',
			}),
		form: { list_id: 'list-1', name: 'Local members' },
	},
	{
		name: 'segments.delete',
		method: 'DELETE',
		path: '/v2/segment/segment-1',
		response: { segment: { ...segment, state: 'deleted' } },
		run: () =>
			api.segments.delete({ list_id: 'list-1', segment_id: 'segment-1' }),
		query: { list_id: 'list-1' },
	},
	{
		name: 'webhooks.list',
		method: 'GET',
		path: '/v2/webhook',
		response: { data: [{ webhook }] },
		run: () => api.webhooks.list({ list_id: 'list-1' }),
		query: { list_id: 'list-1' },
	},
	{
		name: 'webhooks.get',
		method: 'GET',
		path: '/v2/webhook/webhook-1',
		response: { webhook },
		run: () => api.webhooks.get({ list_id: 'list-1', webhook_id: 'webhook-1' }),
		query: { list_id: 'list-1' },
	},
	{
		name: 'webhooks.create',
		method: 'POST',
		path: '/v2/webhook',
		response: { webhook },
		run: () =>
			api.webhooks.create({
				list_id: 'list-1',
				event: 'modified',
				url: 'https://example.net/laposta-hook',
				blocked: false,
			}),
		form: {
			list_id: 'list-1',
			event: 'modified',
			url: 'https://example.net/laposta-hook',
			blocked: 'false',
		},
	},
	{
		name: 'webhooks.update',
		method: 'POST',
		path: '/v2/webhook/webhook-1',
		response: { webhook },
		run: () =>
			api.webhooks.update({
				list_id: 'list-1',
				webhook_id: 'webhook-1',
				blocked: true,
			}),
		form: { list_id: 'list-1', blocked: 'true' },
	},
	{
		name: 'webhooks.delete',
		method: 'DELETE',
		path: '/v2/webhook/webhook-1',
		response: { webhook: { ...webhook, state: 'deleted' } },
		run: () =>
			api.webhooks.delete({ list_id: 'list-1', webhook_id: 'webhook-1' }),
		query: { list_id: 'list-1' },
	},
	{
		name: 'campaigns.list supports cursor pagination',
		method: 'GET',
		path: '/v2/campaign',
		response: {
			data: [{ campaign }],
			pagination: { limit: 100, has_more: false, next_cursor: null },
		},
		run: () => api.campaigns.list({ status: 'draft', limit: 100 }),
		query: { status: 'draft', limit: '100' },
	},
	{
		name: 'campaigns.create encodes nested recipient and sender data',
		method: 'POST',
		path: '/v2/campaign',
		response: { campaign },
		run: () =>
			api.campaigns.create({
				type: 'regular',
				name: 'Monthly news',
				subject: 'Updates',
				from: { name: 'Example', email: 'sender@example.net' },
				list_ids: ['list-1'],
				stats: { ga: true },
			}),
		form: {
			type: 'regular',
			name: 'Monthly news',
			subject: 'Updates',
			'from[name]': 'Example',
			'from[email]': 'sender@example.net',
			'list_ids[]': 'list-1',
			'stats[ga]': 'true',
		},
	},
	{
		name: 'campaigns.get',
		method: 'GET',
		path: '/v2/campaign/campaign-1',
		response: { campaign },
		run: () => api.campaigns.get({ campaign_id: 'campaign-1' }),
	},
	{
		name: 'campaigns.update',
		method: 'POST',
		path: '/v2/campaign/campaign-1',
		response: { campaign },
		run: () =>
			api.campaigns.update({ campaign_id: 'campaign-1', subject: 'Updated' }),
		form: { subject: 'Updated' },
	},
	{
		name: 'campaigns.delete',
		method: 'DELETE',
		path: '/v2/campaign/campaign-1',
		response: { campaign: { ...campaign, state: 'deleted' } },
		run: () => api.campaigns.delete({ campaign_id: 'campaign-1' }),
	},
	{
		name: 'campaigns.history',
		method: 'GET',
		path: '/v2/campaign/campaign-1/history',
		response: history,
		run: () =>
			api.campaigns.history({
				campaign_id: 'campaign-1',
				limit: 100,
				order: 'desc',
			}),
		query: { limit: '100', order: 'desc' },
	},
	{
		name: 'campaigns.get_content',
		method: 'GET',
		path: '/v2/campaign/campaign-1/content',
		response: {
			campaign: {
				campaign_id: 'campaign-1',
				plaintext: 'Hello',
				html: '<p>Hello</p>',
			},
		},
		run: () => api.campaigns.get_content({ campaign_id: 'campaign-1' }),
	},
	{
		name: 'campaigns.update_content',
		method: 'POST',
		path: '/v2/campaign/campaign-1/content',
		response: {
			campaign: {
				campaign_id: 'campaign-1',
				import_url: 'https://example.net/newsletter',
			},
		},
		run: () =>
			api.campaigns.update_content({
				campaign_id: 'campaign-1',
				import_url: 'https://example.net/newsletter',
			}),
		form: { import_url: 'https://example.net/newsletter' },
	},
	{
		name: 'campaigns.send',
		method: 'POST',
		path: '/v2/campaign/campaign-1/action/send',
		response: { campaign },
		run: () => api.campaigns.send({ campaign_id: 'campaign-1' }),
	},
	{
		name: 'campaigns.schedule',
		method: 'POST',
		path: '/v2/campaign/campaign-1/action/schedule',
		response: { campaign },
		run: () =>
			api.campaigns.schedule({
				campaign_id: 'campaign-1',
				delivery_requested: '2026-12-01 09:00:00',
			}),
		form: { delivery_requested: '2026-12-01 09:00:00' },
	},
	{
		name: 'campaigns.send_test',
		method: 'POST',
		path: '/v2/campaign/campaign-1/action/testmail',
		response: { campaign },
		run: () =>
			api.campaigns.send_test({
				campaign_id: 'campaign-1',
				email: 'test@example.net',
			}),
		form: { email: 'test@example.net' },
	},
	{
		name: 'reports.list supports cursor pagination',
		method: 'GET',
		path: '/v2/report',
		response: {
			data: [{ report }],
			pagination: { limit: 100, has_more: false, next_cursor: null },
		},
		run: () => api.reports.list({ limit: 100, cursor: 'report-cursor' }),
		query: { limit: '100', cursor: 'report-cursor' },
	},
	{
		name: 'reports.get',
		method: 'GET',
		path: '/v2/report/campaign-1',
		response: { report },
		run: () => api.reports.get({ campaign_id: 'campaign-1' }),
	},
];

describe('Laposta bound endpoints', () => {
	const originalFetch = globalThis.fetch;
	// unknown because the bound route under test selects the response shape.
	let responseBody: Record<string, unknown> = {};
	let capturedUrl = '';
	let capturedInit: RequestInit = {};

	beforeEach(() => {
		capturedUrl = '';
		capturedInit = {};
		responseBody = {};
		globalThis.fetch = async (input, init) => {
			capturedUrl = String(input);
			capturedInit = init ?? {};
			return new Response(JSON.stringify(responseBody), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		};
	});

	afterAll(() => {
		globalThis.fetch = originalFetch;
		jest.restoreAllMocks();
	});

	for (const endpointCase of endpointCases) {
		it(`${endpointCase.name} calls ${endpointCase.method} ${endpointCase.path}`, async () => {
			responseBody = endpointCase.response;
			const result = await endpointCase.run();
			const requestHeaders = new Headers(capturedInit.headers);

			expect(result).toBeDefined();
			expect(capturedInit.method).toBe(endpointCase.method);
			expect(capturedUrl).toContain(endpointCase.path);
			expect(requestHeaders.get('authorization')).toBe(
				`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
			);

			const requestUrl = new URL(capturedUrl);
			for (const [key, value] of Object.entries(endpointCase.query ?? {})) {
				expect(requestUrl.searchParams.get(key)).toBe(value);
			}
			if (endpointCase.form) {
				expect(requestHeaders.get('content-type')).toContain(
					'application/x-www-form-urlencoded',
				);
				const form = new URLSearchParams(String(capturedInit.body));
				for (const [key, value] of Object.entries(endpointCase.form)) {
					expect(form.get(key)).toBe(value);
				}
				for (const [key, values] of Object.entries(
					endpointCase.formRepeated ?? {},
				)) {
					expect(form.getAll(key)).toEqual(values);
				}
			}
			if (endpointCase.jsonBody) {
				expect(requestHeaders.get('content-type')).toContain(
					'application/json',
				);
				expect(JSON.parse(String(capturedInit.body))).toEqual(
					endpointCase.jsonBody,
				);
			}
		});
	}

	it('rejects invalid input through the bound plugin before network I/O', async () => {
		await expect(api.lists.create({ name: '' })).rejects.toThrow();
		expect(capturedUrl).toBe('');
	});

	it('rejects malformed provider output through the bound plugin', async () => {
		responseBody = { list: { ...list, name: 42 } };
		await expect(api.lists.get({ list_id: 'list-1' })).rejects.toThrow();
		expect(capturedUrl).toContain('/v2/list/list-1');
	});
});
