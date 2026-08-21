import {
	CreateContactInputSchema,
	CreateContactResponseSchema,
	GetApiUsageInfoResponseSchema,
	ListContactsResponseSchema,
	ListWebhooksResponseSchema,
} from './endpoints/types';
import { TwoChatSchema } from './schema';

// Fixtures copied from 2Chat's published API docs — not hand-waved shapes.
const CREATE_CONTACT_RESPONSE = {
	success: true,
	contact: {
		uuid: 'CON2226e836-36dc-4103-b2a2-6307749cf390',
		first_name: '2Chat',
		last_name: 'Support',
		channel_uuid: 'WPN66037eca-9ad1-4c96-9eff-526a90a48c77',
		profile_pic_url: null,
		details: [
			{
				id: 1331,
				value: '+17137157533',
				type: 'PH' as const,
				created_at: 1695230471,
				updated_at: 0,
			},
		],
	},
};

const LIST_CONTACTS_RESPONSE = {
	success: true,
	page: 0,
	count: 1,
	contacts: [
		{
			id: 566,
			uuid: 'CON5dbf28a9-44f5-4ca2-9eae-fd33b124097a',
			first_name: 'Augusto',
			last_name: 'Gonzalez',
			channel_uuid: 'WPNc568c832-606c-4d50-8092-fc51b5149d16',
			profile_pic_url:
				'https://2chat-user-data-dev.s3.amazonaws.com/example.jpeg',
			details: [
				{
					id: 566,
					value: '+595981222333',
					type: 'WAPH' as const,
					created_at: '2025-03-03T18:43:51Z',
					updated_at: '2025-03-30T08:30:12Z',
				},
			],
		},
	],
};

const GET_INFO_RESPONSE = {
	success: true,
	account: {
		name: 'Account Name (ACC91be87af-5a29-4034-b599-342f2aeb5d52)',
		uuid: 'ACC91be87af-5a29-4034-b599-342f2aeb5d52',
		on_trial: false,
		blocked: false,
		created_at: '2022-04-21T21:55:37Z',
		expires_at: '2024-08-31T19:11:08Z',
	},
	limits: { requests_per_minute: 80 },
	usage: {
		api_request_count: 77112,
		max_api_request_count: 500000,
		number_check_count: 430542,
		max_number_check_count: 500000,
	},
};

const LIST_WEBHOOKS_RESPONSE = {
	success: true,
	webhooks: [
		{
			uuid: 'WHKdc78c87e-5b18-47c7-9183-5bf527fd6c69',
			event_name: 'whatsapp.message.received',
			channel_uuid: 'WPN95841312-b54d-46e3-b0bc-6414f4a5296b',
			hook_url: 'https://example.com/hook',
			hook_params: { waweb_uuid: 'WPN95841312-b54d-46e3-b0bc-6414f4a5296b' },
			created_at: '2023-04-17T18:50:50Z',
		},
	],
};

describe('TwoChat schema', () => {
	it('declares a semver version', () => {
		expect(TwoChatSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares db schema entities aligned to 2Chat resources', () => {
		expect(Object.keys(TwoChatSchema.entities).sort()).toEqual(
			['accounts', 'contacts', 'webhookSubscriptions'].sort(),
		);
	});

	it('parses the documented POST /open/contacts response', () => {
		const parsed = CreateContactResponseSchema.parse(CREATE_CONTACT_RESPONSE);
		expect(parsed.contact.details?.[0]).toMatchObject({
			type: 'PH',
			value: '+17137157533',
			created_at: 1695230471,
			updated_at: 0,
		});
	});

	it('parses the documented GET /open/contacts response', () => {
		const parsed = ListContactsResponseSchema.parse(LIST_CONTACTS_RESPONSE);
		expect(parsed.contacts[0]?.details?.[0]?.created_at).toBe(
			'2025-03-03T18:43:51Z',
		);
	});

	it('parses the documented GET /open/info billing payload', () => {
		const parsed = GetApiUsageInfoResponseSchema.parse(GET_INFO_RESPONSE);
		expect(parsed.usage).toEqual({
			api_request_count: 77112,
			max_api_request_count: 500000,
			number_check_count: 430542,
			max_number_check_count: 500000,
		});
	});

	it('drops undocumented usage aliases', () => {
		const parsed = GetApiUsageInfoResponseSchema.parse({
			success: true,
			usage: {
				api_request_count: 1,
				api_requests_available: 99,
			},
		});
		expect(parsed.usage).toEqual({ api_request_count: 1 });
	});

	it('parses the documented GET /open/webhooks response', () => {
		const parsed = ListWebhooksResponseSchema.parse(LIST_WEBHOOKS_RESPONSE);
		expect(parsed.webhooks).toHaveLength(1);
		expect(parsed.webhooks[0]?.event_name).toBe('whatsapp.message.received');
	});

	it('createContact input keeps only type and value on details', () => {
		const parsed = CreateContactInputSchema.parse({
			first_name: 'John',
			contact_details: [
				{
					type: 'PH',
					value: '+17137157533',
					id: 99,
					created_at: 1695230471,
				},
			],
		});
		expect(parsed.contact_details).toEqual([
			{ type: 'PH', value: '+17137157533' },
		]);
	});
});
