import 'dotenv/config';
import { makeInsightoaiRequest } from './client';
import type {
	InsightoaiEndpointInputs,
	InsightoaiEndpointOutputs,
} from './endpoints/types';
import {
	InsightoaiEndpointInputSchemas,
	InsightoaiEndpointOutputSchemas,
} from './endpoints/types';

declare const describe: {
	(name: string, fn: () => void): void;
	skip(name: string, fn: () => void): void;
};
declare const it: (name: string, fn: () => void | Promise<void>) => void;
// Minimal Jest assertion surface used by this file (tsconfig types is node-only)
declare const expect: {
	(
		actual: unknown,
	): {
		toBe(expected: unknown): void;
		toBeDefined(): void;
		toBeGreaterThan(expected: number): void;
		toEqual(expected: unknown): void;
	};
};

const TEST_API_KEY = process.env.INSIGHTOAI_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

// Fixtures paired per operation: a valid input sample and a valid response sample. Every
// fixture is round-tripped through both the input and output Zod schemas below.
const FIXTURES: {
	[K in keyof InsightoaiEndpointInputs]: {
		input: InsightoaiEndpointInputs[K];
		// output shape varies across all test fixtures and is dynamically verified against each operation schema at runtime
		output: unknown;
	};
} = {
	getAssistantById: {
		input: { assistant_id: 'assistant_123' },
		output: { id: 'assistant_123', name: 'My Assistant' },
	},
	deleteAssistantById: {
		input: { assistant_id: 'assistant_123' },
		output: { id: 'assistant_123', deleted: true },
	},
	addIntentToAssistant: {
		input: { assistant_id: 'assistant_123', intent_id: 'intent_123' },
		output: { assistant_id: 'assistant_123', intent_id: 'intent_123' },
	},
	createIntent: {
		input: { name: 'Book Appointment', intent_type: 'custom' },
		output: { id: 'intent_123', name: 'Book Appointment' },
	},
	getIntentById: {
		input: { intent_id: 'intent_123' },
		output: { id: 'intent_123', name: 'Book Appointment' },
	},
	readIntentsList: {
		input: { page: 1, size: 50 },
		output: { items: [{ id: 'intent_123' }], total: 1 },
	},
	createPrompt: {
		input: { name: 'Greeting Prompt', prompt_template: 'Hello {{name}}' },
		output: { id: 'prompt_123', name: 'Greeting Prompt' },
	},
	getPromptById: {
		input: { prompt_id: 'prompt_123' },
		output: { id: 'prompt_123', name: 'Greeting Prompt' },
	},
	deletePromptById: {
		input: { prompt_id: 'prompt_123' },
		output: { id: 'prompt_123', deleted: true },
	},

	createProvider: {
		input: {
			name: 'My OpenAI Key',
			provider_key: 'sk-xxxxx',
			provider_name: 'openai',
		},
		output: { id: 'provider_123', name: 'My OpenAI Key' },
	},
	getProviderById: {
		input: { provider_id: 'provider_123' },
		output: { id: 'provider_123', provider_name: 'openai' },
	},
	deleteProviderById: {
		input: { provider_id: 'provider_123' },
		output: { id: 'provider_123', deleted: true },
	},
	getSpeechtotextList: {
		input: { page: 1, size: 50 },
		output: { items: [{ id: 'stt_123' }], total: 1 },
	},
	retrieveListOfUserCustomVoice: {
		input: { page: 1, size: 50 },
		output: { items: [{ id: 'voice_123' }], total: 1 },
	},

	getContactById: {
		input: { contact_id: 'contact_123' },
		output: { id: 'contact_123' },
	},
	getListOfContacts: {
		input: { page: 1, size: 50 },
		output: { items: [{ id: 'contact_123' }], total: 1 },
	},
	upsertContactByEmailOrPhoneNumber: {
		input: {
			email: 'user@example.com',
			first_name: 'Jane',
			last_name: 'Doe',
			phone_number: '+15550001111',
		},
		output: { id: 'contact_123' },
	},
	deleteContactsInBulk: {
		input: { contact_ids: ['contact_123', 'contact_456'] },
		output: { deleted_count: 2 },
	},
	createContactCustomField: {
		input: { custom_field_name: 'loyalty_tier', custom_field_type: 'string' },
		output: { id: 'custom_field_123' },
	},
	readContactCustomFieldList: {
		input: { page: 1, size: 50 },
		output: { items: [{ id: 'custom_field_123' }], total: 1 },
	},
	readCampaignContactList: {
		input: { campaign_id: 'campaign_123' },
		output: { items: [{ id: 'contact_123' }], total: 1 },
	},
	sendMessagesToContacts: {
		input: {
			widget_id: 'widget_123',
			contact_ids: ['contact_123'],
			start_new_conversation: true,
		},
		output: { sent_count: 1 },
	},
	readContactSyncLogList: {
		input: { page: 1, size: 50 },
		output: { items: [{ id: 'sync_log_123' }], total: 1 },
	},

	createForm: {
		input: {
			name: 'Lead Capture',
			form_type: 'natural',
			trigger_instructions: 'Ask for name and email',
		},
		output: { id: 'form_123', name: 'Lead Capture' },
	},
	getCapturedFormByFormId: {
		input: { form_id: 'form_123' },
		output: { items: [{ id: 'captured_form_123' }], total: 1 },
	},
	deleteFormById: {
		input: { form_id: 'form_123' },
		output: { id: 'form_123', deleted: true },
	},
	deleteBulkFormsByIds: {
		input: { form_ids: ['form_123', 'form_456'] },
		output: { deleted_count: 2 },
	},

	createToolfunction: {
		input: {
			name: 'lookup_order',
			description: 'Look up an order by ID',
			tool_function_type: 'curl',
		},
		output: { id: 'toolfunction_123', name: 'lookup_order' },
	},
	updateToolfunctionById: {
		input: { toolfunction_id: 'toolfunction_123', is_enabled: false },
		output: { id: 'toolfunction_123', is_enabled: false },
	},
	deleteToolfunctionById: {
		input: { toolfunction_id: 'toolfunction_123' },
		output: { id: 'toolfunction_123', deleted: true },
	},
	readToolToolfunctionList: {
		input: { tool_id: 'tool_123', page: 1, size: 50 },
		output: { items: [{ id: 'toolfunction_123' }], total: 1 },
	},
	updateToolById: {
		input: { tool_id: 'tool_123', enabled: true },
		output: { id: 'tool_123', enabled: true },
	},
	deleteToolById: {
		input: { tool_id: 'tool_123' },
		output: { id: 'tool_123', deleted: true },
	},
	readToolFunctionInvokeLogList: {
		input: { page: 1, size: 50 },
		output: { items: [{ id: 'invoke_log_123' }], total: 1 },
	},
	retrieveLinkedToolAndUser: {
		input: { tool_id: 'tool_123', page: 1, size: 50 },
		output: { items: [{ id: 'link_tool_user_123' }], total: 1 },
	},
	updateLinkToolUser: {
		input: { link_tool_user_id: 'link_tool_user_123', name: 'Updated Link' },
		output: { id: 'link_tool_user_123', name: 'Updated Link' },
	},

	createWidget: {
		input: {
			widget_type: 'web_chat',
			action_buttons: [],
			user_opening_messages: ['Hi! How can I help?'],
		},
		output: { id: 'widget_123', widget_type: 'web_chat' },
	},
	getWidgetById: {
		input: { widget_id: 'widget_123' },
		output: { id: 'widget_123', widget_type: 'web_chat' },
	},
	deleteWidgetById: {
		input: { widget_id: 'widget_123' },
		output: { id: 'widget_123', deleted: true },
	},
	// Offline schema fixture only — never used by live smoke tests below.
	getListOfWidgetsLinkedToAssistantId: {
		input: { assistant_id: 'assistant_123', page: 1, size: 50 },
		output: { items: [{ id: 'widget_123' }], total: 1 },
	},
	listChannels: {
		input: { page: 1, size: 50 },
		output: { items: [{ id: 'channel_123' }], total: 1 },
	},
	getListOfConversations: {
		input: { date_to: '2026-07-01', date_from: '2026-06-01' },
		output: { items: [{ id: 'conversation_123' }], total: 1 },
	},

	getDatasourceById: {
		input: { datasource_id: 'datasource_123' },
		output: { id: 'datasource_123' },
	},
	getListOfDatasources: {
		input: { page: 1, size: 50 },
		output: { items: [{ id: 'datasource_123' }], total: 1 },
	},
	getListOfDataSourcesLinkedToAssistantId: {
		input: { assistant_id: 'assistant_123', page: 1, size: 50 },
		output: { items: [{ id: 'datasource_123' }], total: 1 },
	},
	deleteLinkedAssistantDatasource: {
		input: { assistant_id: 'assistant_123', datasource_id: 'datasource_123' },
		output: { deleted: true },
	},
	createTag: {
		input: {
			name: 'VIP',
			color_code: '#FF0000',
			description: 'High-value customer',
		},
		output: { id: 'tag_123', name: 'VIP' },
	},
	readTagList: {
		input: { page: 1, size: 50 },
		output: { items: [{ id: 'tag_123' }], total: 1 },
	},
	deleteTagById: {
		input: { tag_id: 'tag_123' },
		output: { id: 'tag_123', deleted: true },
	},
	deleteLinkTagEntityById: {
		input: { link_tag_entity_id: 'link_tag_entity_123' },
		output: { id: 'link_tag_entity_123', deleted: true },
	},

	createWebhook: {
		input: { name: 'My Webhook', endpoint: 'https://example.com/webhook' },
		output: { id: 'webhook_123', name: 'My Webhook' },
	},
	updateWebhookById: {
		input: { webhook_id: 'webhook_123', enabled: false },
		output: { id: 'webhook_123', enabled: false },
	},
	deleteWebhookById: {
		input: { webhook_id: 'webhook_123' },
		output: { id: 'webhook_123', deleted: true },
	},
	retrieveWebhookLog: {
		input: { webhook_id: 'webhook_123', page: 1, size: 50 },
		output: { items: [{ id: 'webhook_log_123' }], total: 1 },
	},
	readTwilioAuthList: {
		input: { page: 1, size: 50 },
		output: { items: [{ id: 'twilio_auth_123' }], total: 1 },
	},
	updateTwilioAuthById: {
		input: { twilio_auth_id: 'twilio_auth_123', name: 'Main Twilio Account' },
		output: { id: 'twilio_auth_123', name: 'Main Twilio Account' },
	},
	deleteTwilioAuthById: {
		input: { twilio_auth_id: 'twilio_auth_123' },
		output: { id: 'twilio_auth_123', deleted: true },
	},
	updateUserwhatsappById: {
		input: {
			userwhatsapp_id: 'userwhatsapp_123',
			phone_number_id: 'phone_123',
		},
		output: { id: 'userwhatsapp_123' },
	},
	deleteUserwhatsappById: {
		input: { userwhatsapp_id: 'userwhatsapp_123' },
		output: { id: 'userwhatsapp_123', deleted: true },
	},

	createAgency: {
		input: { org_id: 'org_123' },
		output: { id: 'agency_123', org_id: 'org_123' },
	},
	getAgencyBrandingById: {
		input: { agency_id: 'agency_123' },
		output: { agency_id: 'agency_123', logo_url: 'https://x/logo.png' },
	},
	getAgencyBillingPlan: {
		input: { billing_plan_id: 'billing_plan_123' },
		output: { id: 'billing_plan_123' },
	},
	getPricingForUser: {
		input: { llm_model_id: 'llm_model_123' },
		output: { llm_model_id: 'llm_model_123', price_per_query: 0.01 },
	},
	getAgentList: {
		input: { page: 1, size: 50 },
		output: { items: [{ id: 'agent_123' }], total: 1 },
	},
	updateUserProfile: {
		input: { user_id: 'user_123', email: 'user@example.com' },
		output: { id: 'user_123' },
	},
	retrieveUserMonthlyUsagesAggregation: {
		input: { page: 1, size: 50 },
		output: { items: [{ month: '2026-06' }], total: 1 },
	},
};

describe('Insighto.ai endpoint schemas', () => {
	it('defines input and output schemas for every fixture endpoint', () => {
		// Cast needed: Object.keys returns string[], but FIXTURES is keyed by endpoint names
		const keys = Object.keys(FIXTURES) as (keyof InsightoaiEndpointInputs)[];
		expect(keys.length).toBeGreaterThan(0);
		for (const key of keys) {
			expect(InsightoaiEndpointInputSchemas[key]).toBeDefined();
			expect(InsightoaiEndpointOutputSchemas[key]).toBeDefined();
		}
	});

	// Cast needed: Object.keys returns string[], but FIXTURES is keyed by endpoint names
	for (const key of Object.keys(
		FIXTURES,
	) as (keyof InsightoaiEndpointInputs)[]) {
		it(`parses ${key} input and output`, () => {
			const fixture = FIXTURES[key];
			const parsedInput = InsightoaiEndpointInputSchemas[key].safeParse(
				fixture.input,
			);
			const parsedOutput = InsightoaiEndpointOutputSchemas[key].safeParse(
				fixture.output,
			);
			expect(parsedInput.success).toBe(true);
			expect(parsedOutput.success).toBe(true);
			if (parsedInput.success) {
				expect(parsedInput.data).toEqual(fixture.input);
			}
		});
	}

	it('rejects invalid getAssistantById input', () => {
		const result = InsightoaiEndpointInputSchemas.getAssistantById.safeParse(
			{},
		);
		expect(result.success).toBe(false);
	});
});

// LIVE SMOKE TESTS (gated on INSIGHTOAI_API_KEY)
// Intentionally list-only — never call entity-scoped paths with fixture IDs
// (e.g. do NOT call GET /api/v1/assistant/assistant_123/widgets).
// Fixed: replaced the old widgets-by-assistant smoke with listChannels.
describeIfApiKey(
	'Insighto.ai API live smoke tests (list endpoints only)',
	() => {
		it('lists contacts (GET /api/v1/contact)', async () => {
			const response = await makeInsightoaiRequest<
				InsightoaiEndpointOutputs['getListOfContacts']
			>('/api/v1/contact', TEST_API_KEY!, {
				method: 'GET',
				authType: 'api_key',
			});

			const parsed =
				InsightoaiEndpointOutputSchemas.getListOfContacts.safeParse(response);
			expect(parsed.success).toBe(true);
		});

		it('lists tags (GET /api/v1/tag/list)', async () => {
			const response = await makeInsightoaiRequest<
				InsightoaiEndpointOutputs['readTagList']
			>('/api/v1/tag/list', TEST_API_KEY!, {
				method: 'GET',
				authType: 'api_key',
			});

			const parsed =
				InsightoaiEndpointOutputSchemas.readTagList.safeParse(response);
			expect(parsed.success).toBe(true);
		});

		it('lists channels (GET /api/v1/channel/list)', async () => {
			// Matches listChannels in endpoints/widgets.ts — not widgets-by-assistant.
			const response = await makeInsightoaiRequest<
				InsightoaiEndpointOutputs['listChannels']
			>('/api/v1/channel/list', TEST_API_KEY!, {
				method: 'GET',
				authType: 'api_key',
			});

			const parsed =
				InsightoaiEndpointOutputSchemas.listChannels.safeParse(response);
			expect(parsed.success).toBe(true);
		});
	},
);
