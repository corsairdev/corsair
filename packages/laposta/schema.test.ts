import {
	LapostaEndpointInputSchemas,
	LapostaEndpointOutputSchemas,
} from './endpoints/types';
import { lapostaEndpointSchemas } from './index';
import { LapostaSchema } from './schema';
import { lapostaEntities } from './schema/database';

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
	custom_fields: { preferences: ['news', 'events'] },
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
	url: 'https://example.net/hook',
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

const inputExamples: Record<string, object> = {
	'lists.list': {},
	'lists.get': { list_id: 'list-1' },
	'lists.create': { name: 'Newsletter' },
	'lists.update': { list_id: 'list-1', name: 'Newsletter' },
	'lists.delete': { list_id: 'list-1' },
	'lists.purge_members': { list_id: 'list-1' },
	'lists.sync_members': {
		list_id: 'list-1',
		actions: ['add'],
		members: [{ email: 'person@example.net' }],
	},
	'members.list': { list_id: 'list-1', limit: 100, cursor: 'opaque-cursor' },
	'members.get': { list_id: 'list-1', member_id: 'member-1' },
	'members.create': {
		list_id: 'list-1',
		email: 'person@example.net',
		ip: '198.51.100.10',
	},
	'members.update': {
		list_id: 'list-1',
		member_id: 'member-1',
		state: 'unsubscribed',
	},
	'members.delete': { list_id: 'list-1', member_id: 'member-1' },
	'members.history': { list_id: 'list-1', member_id: 'member-1', limit: 100 },
	'fields.list': { list_id: 'list-1' },
	'fields.get': { list_id: 'list-1', field_id: 'field-1' },
	'fields.create': {
		list_id: 'list-1',
		name: 'City',
		datatype: 'text',
		required: false,
		in_form: true,
		in_list: true,
	},
	'fields.update': {
		list_id: 'list-1',
		field_id: 'field-1',
		name: 'City name',
	},
	'fields.delete': { list_id: 'list-1', field_id: 'field-1' },
	'segments.list': { list_id: 'list-1' },
	'segments.get': { list_id: 'list-1', segment_id: 'segment-1' },
	'segments.create': {
		list_id: 'list-1',
		name: 'Local members',
		definition: '"city" = \'Utrecht\'',
	},
	'segments.update': {
		list_id: 'list-1',
		segment_id: 'segment-1',
		name: 'Local members',
	},
	'segments.delete': { list_id: 'list-1', segment_id: 'segment-1' },
	'webhooks.list': { list_id: 'list-1' },
	'webhooks.get': { list_id: 'list-1', webhook_id: 'webhook-1' },
	'webhooks.create': {
		list_id: 'list-1',
		event: 'modified',
		url: 'https://example.net/hook',
		blocked: false,
	},
	'webhooks.update': {
		list_id: 'list-1',
		webhook_id: 'webhook-1',
		blocked: true,
	},
	'webhooks.delete': { list_id: 'list-1', webhook_id: 'webhook-1' },
	'campaigns.list': { status: 'draft', limit: 100 },
	'campaigns.create': {
		type: 'regular',
		name: 'Monthly news',
		subject: 'Updates',
		from: { name: 'Example', email: 'sender@example.net' },
		list_ids: ['list-1'],
	},
	'campaigns.get': { campaign_id: 'campaign-1' },
	'campaigns.update': { campaign_id: 'campaign-1', subject: 'Updated' },
	'campaigns.delete': { campaign_id: 'campaign-1' },
	'campaigns.history': { campaign_id: 'campaign-1', limit: 100 },
	'campaigns.get_content': { campaign_id: 'campaign-1' },
	'campaigns.update_content': {
		campaign_id: 'campaign-1',
		import_url: 'https://example.net/newsletter',
	},
	'campaigns.send': { campaign_id: 'campaign-1' },
	'campaigns.schedule': {
		campaign_id: 'campaign-1',
		delivery_requested: '2026-12-01 09:00:00',
	},
	'campaigns.send_test': {
		campaign_id: 'campaign-1',
		email: 'test@example.net',
	},
	'reports.list': { limit: 100, cursor: 'opaque-cursor' },
	'reports.get': { campaign_id: 'campaign-1' },
};

const outputExamples: Record<string, object> = {
	'lists.list': { data: [{ list }] },
	'lists.get': { list },
	'lists.create': { list },
	'lists.update': { list },
	'lists.delete': { list: { ...list, state: 'deleted' } },
	'lists.purge_members': { list },
	'lists.sync_members': memberSync,
	'members.list': { data: [{ member }], pagination: history.pagination },
	'members.get': { member },
	'members.create': { member },
	'members.update': { member },
	'members.delete': { member: { ...member, state: 'deleted' } },
	'members.history': history,
	'fields.list': { data: [{ field }] },
	'fields.get': { field },
	'fields.create': { field },
	'fields.update': { field },
	'fields.delete': { field: { ...field, state: 'deleted' } },
	'segments.list': { data: [{ segment }] },
	'segments.get': { segment },
	'segments.create': { segment },
	'segments.update': { segment },
	'segments.delete': { segment: { ...segment, state: 'deleted' } },
	'webhooks.list': { data: [{ webhook }] },
	'webhooks.get': { webhook },
	'webhooks.create': { webhook },
	'webhooks.update': { webhook },
	'webhooks.delete': { webhook: { ...webhook, state: 'deleted' } },
	'campaigns.list': { data: [{ campaign }], pagination: history.pagination },
	'campaigns.create': { campaign },
	'campaigns.get': { campaign },
	'campaigns.update': { campaign },
	'campaigns.delete': { campaign: { ...campaign, state: 'deleted' } },
	'campaigns.history': history,
	'campaigns.get_content': {
		campaign: { campaign_id: 'campaign-1', html: '<p>Hello</p>' },
	},
	'campaigns.update_content': {
		campaign: {
			campaign_id: 'campaign-1',
			import_url: 'https://example.net/newsletter',
		},
	},
	'campaigns.send': { campaign },
	'campaigns.schedule': { campaign },
	'campaigns.send_test': { campaign },
	'reports.list': { data: [{ report }], pagination: history.pagination },
	'reports.get': { report },
};

describe('Laposta database schema', () => {
	it('declares a semver version and no persisted entities', () => {
		expect(LapostaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(LapostaSchema.entities).toBe(lapostaEntities);
		expect(LapostaSchema.entities).toEqual({});
	});
});

describe('Laposta endpoint schemas', () => {
	it('registers input and output schemas for all 41 operations', () => {
		const inputKeys = Object.keys(LapostaEndpointInputSchemas).sort();
		const outputKeys = Object.keys(LapostaEndpointOutputSchemas).sort();
		const registeredKeys = Object.keys(lapostaEndpointSchemas).sort();

		expect(inputKeys).toHaveLength(41);
		expect(outputKeys).toEqual(inputKeys);
		expect(registeredKeys).toEqual(inputKeys);
	});

	it('accepts a contract-based input and response for every operation', () => {
		for (const [operation, schema] of Object.entries(
			LapostaEndpointInputSchemas,
		)) {
			expect(schema.safeParse(inputExamples[operation]).success).toBe(true);
		}
		for (const [operation, schema] of Object.entries(
			LapostaEndpointOutputSchemas,
		)) {
			expect(schema.safeParse(outputExamples[operation]).success).toBe(true);
		}
	});

	it('requires member IP and all required field booleans', () => {
		expect(
			LapostaEndpointInputSchemas['members.create'].safeParse({
				list_id: 'list-1',
				email: 'person@example.net',
			}).success,
		).toBe(false);
		expect(
			LapostaEndpointInputSchemas['members.create'].safeParse({
				list_id: 'list-1',
				email: 'person@example.net',
				ip: 'not-an-ip-address',
			}).success,
		).toBe(false);
		expect(
			LapostaEndpointInputSchemas['fields.create'].safeParse({
				list_id: 'list-1',
				name: 'City',
				datatype: 'text',
			}).success,
		).toBe(false);
	});

	it('rejects unknown request properties and invalid pagination', () => {
		expect(
			LapostaEndpointInputSchemas['lists.create'].safeParse({
				name: 'Newsletter',
				callback_url: 'https://example.net/callback',
			}).success,
		).toBe(false);
		expect(
			LapostaEndpointInputSchemas['members.list'].safeParse({
				list_id: 'list-1',
				limit: 1001,
			}).success,
		).toBe(false);
	});

	it('validates bulk member-sync and campaign-content constraints', () => {
		expect(
			LapostaEndpointInputSchemas['lists.sync_members'].safeParse({
				list_id: 'list-1',
				actions: ['add'],
				mode: 'add',
				members: [{ email: 'person@example.net' }],
			}).success,
		).toBe(false);
		expect(
			LapostaEndpointInputSchemas['campaigns.update_content'].safeParse({
				campaign_id: 'campaign-1',
			}).success,
		).toBe(false);
	});

	it('rejects malformed documented output while accepting dynamic custom-field values', () => {
		expect(
			LapostaEndpointOutputSchemas['members.get'].safeParse({
				member: { ...member, custom_fields: { score: 2, choices: ['a', 'b'] } },
			}).success,
		).toBe(true);
		expect(
			LapostaEndpointOutputSchemas['lists.get'].safeParse({
				list: { list_id: 'list-1', name: 7 },
			}).success,
		).toBe(false);
		expect(
			LapostaEndpointOutputSchemas['reports.get'].safeParse({
				report: { campaign_id: 'campaign-1' },
			}).success,
		).toBe(false);
	});
});
