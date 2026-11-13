import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { executeGorgiasOperation } from './endpoints';
import { gorgiasOperationDefinitions } from './endpoints/definitions';
import type { GorgiasContext } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});
jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);
const mockedLogEvent = jest.mocked(logEventFromContext);

// `unknown` because each route has its own generated Zod input and output types.
type OperationFixture = { input: unknown; output: unknown };
const fixtures: Record<string, OperationFixture> = {
	'account.createAccountSetting': {
		input: { body: { type: 'x' } },
		output: {
			data: {
				send_survey_for_chat: true,
				send_survey_for_email: true,
				send_survey_for_contact_form: true,
				send_survey_for_help_center: true,
				survey_email_html: 'x',
				survey_email_text: 'x',
				survey_interval: 1,
			},
			type: 'x',
		},
	},
	'account.getAccount': {
		input: {},
		output: {
			created_datetime: '2025-01-01T00:00:00Z',
			deactivated_datetime: '2025-01-01T00:00:00Z',
			domain: 'x',
			settings: [],
			status: {},
		},
	},
	'account.listAccountSettings': { input: {}, output: { data: [] } },
	'account.updateAccountSetting': {
		input: { path: { id: 1 }, body: { type: 'x' } },
		output: {
			data: {
				send_survey_for_chat: true,
				send_survey_for_email: true,
				send_survey_for_contact_form: true,
				send_survey_for_help_center: true,
				survey_email_html: 'x',
				survey_email_text: 'x',
				survey_interval: 1,
			},
			type: 'x',
		},
	},
	'customFields.createCustomField': {
		input: {
			body: {
				object_type: 'Ticket',
				label: 'x',
				definition: {
					data_type: 'text',
					input_settings: { input_type: 'input' },
				},
			},
		},
		output: {
			id: 1,
			object_type: 'Ticket',
			label: 'x',
			priority: 1,
			required: true,
			requirement_type: 'visible',
			definition: {
				data_type: 'text',
				input_settings: { input_type: 'input' },
			},
			created_datetime: '2025-01-01T00:00:00Z',
			updated_datetime: '2025-01-01T00:00:00Z',
		},
	},
	'customFields.getCustomField': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			object_type: 'Ticket',
			label: 'x',
			priority: 1,
			required: true,
			requirement_type: 'visible',
			definition: {
				data_type: 'text',
				input_settings: { input_type: 'input' },
			},
			created_datetime: '2025-01-01T00:00:00Z',
			updated_datetime: '2025-01-01T00:00:00Z',
		},
	},
	'customFields.listCustomFields': {
		input: { query: { object_type: 'Ticket' } },
		output: {
			object: 'x',
			uri: 'x',
			data: [],
			meta: { prev_cursor: 'x', next_cursor: 'x', total_resources: 1 },
		},
	},
	'customFields.updateCustomField': {
		input: {
			path: { id: 1 },
			body: {
				external_id: 'x',
				object_type: 'Ticket',
				label: 'x',
				description: 'x',
				priority: 1,
				required: true,
				requirement_type: 'visible',
				managed_type: 'contact_reason',
				definition: {
					data_type: 'text',
					input_settings: { input_type: 'input' },
				},
				deactivated_datetime: '2025-01-01T00:00:00Z',
			},
		},
		output: {
			id: 1,
			object_type: 'Ticket',
			label: 'x',
			priority: 1,
			required: true,
			requirement_type: 'visible',
			definition: {
				data_type: 'text',
				input_settings: { input_type: 'input' },
			},
			created_datetime: '2025-01-01T00:00:00Z',
			updated_datetime: '2025-01-01T00:00:00Z',
		},
	},
	'customFields.updateCustomFields': { input: { body: [] }, output: [] },
	'customers.createCustomer': {
		input: { body: { channels: [] } },
		output: {
			id: 1,
			channels: [],
			created_datetime: '2025-01-01T00:00:00Z',
			email: 'agent@acme.test',
			external_id: 'x',
			firstname: 'x',
			integrations: {},
			language: 'aa',
			lastname: 'x',
			name: 'x',
			note: 'x',
			timezone: 'Africa/Abidjan',
			updated_datetime: '2025-01-01T00:00:00Z',
		},
	},
	'customers.deleteCustomer': { input: { path: { id: 1 } }, output: undefined },
	'customers.deleteCustomerCustomFieldValue': {
		input: { path: { customer_id: 1, id: 1 } },
		output: undefined,
	},
	'customers.deleteCustomers': {
		input: { body: { ids: [] } },
		output: undefined,
	},
	'customers.getCustomer': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			channels: [],
			created_datetime: '2025-01-01T00:00:00Z',
			email: 'agent@acme.test',
			external_id: 'x',
			firstname: 'x',
			integrations: {},
			language: 'aa',
			lastname: 'x',
			name: 'x',
			note: 'x',
			timezone: 'Africa/Abidjan',
			updated_datetime: '2025-01-01T00:00:00Z',
			external_data: {},
			ecommerce_data: {},
		},
	},
	'customers.listCustomerCustomFieldsValues': {
		input: { path: { customer_id: 1 } },
		output: [],
	},
	'customers.listCustomers': { input: {}, output: [] },
	'customers.mergeCustomers': {
		input: {
			query: { source_id: 1, target_id: 1 },
			body: {
				channels: [],
				email: 'agent@acme.test',
				external_id: 'x',
				language: 'aa',
				name: 'x',
				timezone: 'Africa/Abidjan',
			},
		},
		output: {
			id: 1,
			channels: [],
			created_datetime: '2025-01-01T00:00:00Z',
			email: 'agent@acme.test',
			external_id: 'x',
			firstname: 'x',
			integrations: {},
			language: 'aa',
			lastname: 'x',
			name: 'x',
			note: 'x',
			timezone: 'Africa/Abidjan',
			updated_datetime: '2025-01-01T00:00:00Z',
			external_data: {},
			ecommerce_data: {},
		},
	},
	'customers.updateCustomer': {
		input: {
			path: { id: 1 },
			body: {
				channels: [],
				email: 'agent@acme.test',
				external_id: 'x',
				language: 'aa',
				name: 'x',
				timezone: 'Africa/Abidjan',
			},
		},
		output: {
			id: 1,
			channels: [],
			created_datetime: '2025-01-01T00:00:00Z',
			email: 'agent@acme.test',
			external_id: 'x',
			firstname: 'x',
			integrations: {},
			language: 'aa',
			lastname: 'x',
			name: 'x',
			note: 'x',
			timezone: 'Africa/Abidjan',
			updated_datetime: '2025-01-01T00:00:00Z',
		},
	},
	'customers.updateCustomerCustomFieldValue': {
		input: { path: { customer_id: 1, id: 1 }, body: 'x' },
		output: {
			field: {
				id: 1,
				external_id: 'x',
				object_type: 'Ticket',
				label: 'x',
				description: 'x',
				priority: 1,
				required: true,
				managed_type: 'customer_type',
				definition: {
					data_type: 'text',
					input_settings: { input_type: 'input' },
				},
				created_datetime: '2025-01-01T00:00:00Z',
				updated_datetime: '2025-01-01T00:00:00Z',
				deactivated_datetime: '2025-01-01T00:00:00Z',
			},
			value: {},
		},
	},
	'customers.updateCustomerCustomFieldValues': {
		input: { path: { customer_id: 1 }, body: [] },
		output: [],
	},
	'customers.updateCustomerData': {
		input: { path: { customer_id: 1 }, body: { data: {} } },
		output: undefined,
	},
	'events.getEvent': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			context: 'x',
			created_datetime: '2025-01-01T00:00:00Z',
			data: {},
			object_id: 1,
			object_type: 'Account',
			type: 'x',
			user_id: 1,
			uri: 'x',
		},
	},
	'events.listEvents': { input: {}, output: [] },
	'files.uploadFiles': {
		input: {
			body: {
				files: [
					{
						filename: 'file.txt',
						contentType: 'text/plain',
						contentBase64: 'SGVsbG8=',
					},
				],
			},
		},
		output: [],
	},
	'files.downloadFile': {
		input: {
			path: {
				file_type: 'attachment',
				domain_hash: 'Hna8kldnmlal',
				resource_name: 'file-resource.png',
			},
		},
		output: {
			kind: 'binary',
			contentType: 'application/octet-stream',
			base64: 'AQ==',
			sizeBytes: 1,
		},
	},
	'integrations.createIntegration': {
		input: { body: { name: 'x', type: 'http' } },
		output: { name: 'x' },
	},
	'integrations.deleteIntegration': {
		input: { path: { id: 1 } },
		output: undefined,
	},
	'integrations.getIntegration': {
		input: { path: { id: 1 } },
		output: { name: 'x' },
	},
	'integrations.listIntegrations': {
		input: {},
		output: {
			data: [],
			meta: { next_cursor: 'x', prev_cursor: 'x' },
			object: {},
			uri: 'https://acme.test/resource',
		},
	},
	'integrations.updateIntegration': {
		input: { path: { id: 1 }, body: { name: 'x' } },
		output: { name: 'x' },
	},
	'jobs.cancelJob': { input: { path: { id: 1 } }, output: undefined },
	'jobs.createJob': {
		input: {
			body: {
				params: {
					apply_and_close: true,
					end_datetime: 'x',
					macro_id: 1,
					start_datetime: 'x',
					ticket_ids: [],
					url: 'x',
					updates: {},
					view: {},
					view_id: 1,
					context: {},
				},
				type: 'applyMacro',
			},
		},
		output: {
			id: 1,
			cancel_requested_datetime: '2025-01-01T00:00:00Z',
			cancelled_datetime: '2025-01-01T00:00:00Z',
			created_datetime: '2025-01-01T00:00:00Z',
			ended_datetime: '2025-01-01T00:00:00Z',
			failed_datetime: '2025-01-01T00:00:00Z',
			info: {},
			locked_datetime: '2025-01-01T00:00:00Z',
			meta: {},
			params: {
				apply_and_close: true,
				end_datetime: 'x',
				macro_id: 1,
				start_datetime: 'x',
				ticket_ids: [],
				url: 'x',
				updates: {},
				view: {},
				view_id: 1,
				context: {},
			},
			scheduled_datetime: '2025-01-01T00:00:00Z',
			started_datetime: '2025-01-01T00:00:00Z',
			status: 'cancel_requested',
			type: 'applyMacro',
			user_id: 1,
			uri: 'x',
		},
	},
	'jobs.getJob': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			cancel_requested_datetime: '2025-01-01T00:00:00Z',
			cancelled_datetime: '2025-01-01T00:00:00Z',
			created_datetime: '2025-01-01T00:00:00Z',
			ended_datetime: '2025-01-01T00:00:00Z',
			failed_datetime: '2025-01-01T00:00:00Z',
			info: {},
			locked_datetime: '2025-01-01T00:00:00Z',
			meta: {},
			params: {
				apply_and_close: true,
				end_datetime: 'x',
				macro_id: 1,
				start_datetime: 'x',
				ticket_ids: [],
				url: 'x',
				updates: {},
				view: {},
				view_id: 1,
				context: {},
			},
			scheduled_datetime: '2025-01-01T00:00:00Z',
			started_datetime: '2025-01-01T00:00:00Z',
			status: 'cancel_requested',
			type: 'applyMacro',
			user_id: 1,
			uri: 'x',
		},
	},
	'jobs.listJobs': {
		input: {},
		output: { data: [], meta: { next_cursor: 'x', prev_cursor: 'x' } },
	},
	'jobs.updateJob': {
		input: {
			path: { id: 1 },
			body: {
				meta: {},
				params: {
					apply_and_close: true,
					end_datetime: 'x',
					macro_id: 1,
					start_datetime: 'x',
					ticket_ids: [],
					url: 'x',
					updates: {},
					view: {},
					view_id: 1,
					context: {},
				},
				scheduled_datetime: '2025-01-01T00:00:00Z',
				status: 'cancel_requested',
			},
		},
		output: {
			id: 1,
			cancel_requested_datetime: '2025-01-01T00:00:00Z',
			cancelled_datetime: '2025-01-01T00:00:00Z',
			created_datetime: '2025-01-01T00:00:00Z',
			ended_datetime: '2025-01-01T00:00:00Z',
			failed_datetime: '2025-01-01T00:00:00Z',
			info: {},
			locked_datetime: '2025-01-01T00:00:00Z',
			meta: {},
			params: {
				apply_and_close: true,
				end_datetime: 'x',
				macro_id: 1,
				start_datetime: 'x',
				ticket_ids: [],
				url: 'x',
				updates: {},
				view: {},
				view_id: 1,
				context: {},
			},
			scheduled_datetime: '2025-01-01T00:00:00Z',
			started_datetime: '2025-01-01T00:00:00Z',
			status: 'cancel_requested',
			type: 'applyMacro',
			user_id: 1,
			uri: 'x',
		},
	},
	'macros.bulkArchiveMacros': {
		input: { body: { ids: [1] } },
		output: { data: [] },
	},
	'macros.bulkUnarchiveMacros': {
		input: { body: { ids: [1] } },
		output: { data: [] },
	},
	'macros.createMacro': {
		input: { body: { name: 'x' } },
		output: {
			id: 1,
			external_id: 'x',
			name: 'x',
			intent: 'discount/request',
			language: 'x',
			usage: 1,
			actions: [],
			created_datetime: '2025-01-01T00:00:00Z',
			updated_datetime: '2025-01-01T00:00:00Z',
			archived_datetime: '2025-01-01T00:00:00Z',
			uri: 'x',
		},
	},
	'macros.deleteMacro': { input: { path: { id: 1 } }, output: undefined },
	'macros.getMacro': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			external_id: 'x',
			name: 'x',
			intent: 'discount/request',
			language: 'x',
			usage: 1,
			actions: [],
			created_datetime: '2025-01-01T00:00:00Z',
			updated_datetime: '2025-01-01T00:00:00Z',
			archived_datetime: '2025-01-01T00:00:00Z',
			uri: 'x',
		},
	},
	'macros.listMacros': { input: {}, output: [] },
	'macros.updateMacro': {
		input: {
			path: { id: 1 },
			body: {
				external_id: 'x',
				name: 'x',
				intent: 'discount/request',
				language: 'x',
				actions: [],
			},
		},
		output: {
			id: 1,
			external_id: 'x',
			name: 'x',
			intent: 'discount/request',
			language: 'x',
			usage: 1,
			actions: [],
			created_datetime: '2025-01-01T00:00:00Z',
			updated_datetime: '2025-01-01T00:00:00Z',
			archived_datetime: '2025-01-01T00:00:00Z',
			uri: 'x',
		},
	},
	'metricCards.createMetricCardFeedback': {
		input: { path: { slug: 'x' } },
		output: { id: 'x' },
	},
	'metricCards.getMetricCard': {
		input: { path: { slug: 'x' } },
		output: {
			slug: 'abandoned-calls',
			category: 'x',
			title: 'x',
			status: 'published',
			definition_revised_at: 'x',
			public: { definition: 'x', formula: 'x', computation_logic: [] },
			aliases: [],
			related: [],
			replaces: [],
			used_in_reports: [],
		},
	},
	'metricCards.searchMetricCards': { input: {}, output: { data: [] } },
	'reportingStatistics.getStatistic': {
		input: {
			body: { query: { scope: 'tickets-closed', filters: [], timezone: 'x' } },
		},
		output: {
			object: 'x',
			uri: 'x',
			data: [],
			meta: {
				scope: 'tickets-closed',
				prev_cursor: 'x',
				next_cursor: 'x',
				total: 1,
				offset: 1,
				limit: 1,
			},
		},
	},
	'rules.createRule': {
		input: { body: { code: 'x', name: 'x' } },
		output: {
			id: 1,
			code: 'x',
			code_ast: {},
			created_datetime: '2025-01-01T00:00:00Z',
			deactivated_datetime: '2025-01-01T00:00:00Z',
			description: 'x',
			event_types: 'ticket-created',
			name: 'x',
			priority: 1,
			updated_datetime: '2025-01-01T00:00:00Z',
			uri: 'x',
		},
	},
	'rules.deleteRule': { input: { path: { id: 1 } }, output: undefined },
	'rules.getRule': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			code: 'x',
			code_ast: {},
			created_datetime: '2025-01-01T00:00:00Z',
			deactivated_datetime: '2025-01-01T00:00:00Z',
			description: 'x',
			event_types: 'ticket-created',
			name: 'x',
			priority: 1,
			updated_datetime: '2025-01-01T00:00:00Z',
			uri: 'x',
		},
	},
	'rules.listRules': { input: {}, output: [] },
	'rules.updateRule': {
		input: {
			path: { id: 1 },
			body: {
				code: 'x',
				code_ast: {},
				deactivated_datetime: '2025-01-01T00:00:00Z',
				description: 'x',
				event_types: 'ticket-created',
				name: 'x',
				priority: 1,
			},
		},
		output: {
			id: 1,
			code: 'x',
			code_ast: {},
			created_datetime: '2025-01-01T00:00:00Z',
			deactivated_datetime: '2025-01-01T00:00:00Z',
			description: 'x',
			event_types: 'ticket-created',
			name: 'x',
			priority: 1,
			updated_datetime: '2025-01-01T00:00:00Z',
			uri: 'x',
		},
	},
	'rules.updateRulesPriorities': {
		input: { body: { priorities: [] } },
		output: [],
	},
	'satisfactionSurveys.createSatisfactionSurvey': {
		input: { body: { customer_id: 1, ticket_id: 1 } },
		output: {
			id: 1,
			body_text: 'x',
			created_datetime: '2025-01-01T00:00:00Z',
			customer_id: 1,
			meta: {},
			score: 1,
			scored_datetime: '2025-01-01T00:00:00Z',
			sent_datetime: '2025-01-01T00:00:00Z',
			should_send_datetime: '2025-01-01T00:00:00Z',
			ticket_id: 1,
			uri: 'x',
		},
	},
	'satisfactionSurveys.getSatisfactionSurvey': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			body_text: 'x',
			created_datetime: '2025-01-01T00:00:00Z',
			customer_id: 1,
			meta: {},
			score: 1,
			scored_datetime: '2025-01-01T00:00:00Z',
			sent_datetime: '2025-01-01T00:00:00Z',
			should_send_datetime: '2025-01-01T00:00:00Z',
			ticket_id: 1,
			uri: 'x',
		},
	},
	'satisfactionSurveys.listSatisfactionSurveys': { input: {}, output: [] },
	'satisfactionSurveys.updateSatisfactionSurvey': {
		input: {
			path: { id: 1 },
			body: {
				body_text: 'x',
				created_datetime: '2025-01-01T00:00:00Z',
				customer_id: 1,
				meta: {},
				score: 1,
				scored_datetime: '2025-01-01T00:00:00Z',
				sent_datetime: '2025-01-01T00:00:00Z',
				should_send_datetime: '2025-01-01T00:00:00Z',
				ticket_id: 1,
			},
		},
		output: {
			id: 1,
			body_text: 'x',
			created_datetime: '2025-01-01T00:00:00Z',
			customer_id: 1,
			meta: {},
			score: 1,
			scored_datetime: '2025-01-01T00:00:00Z',
			sent_datetime: '2025-01-01T00:00:00Z',
			should_send_datetime: '2025-01-01T00:00:00Z',
			ticket_id: 1,
			uri: 'x',
		},
	},
	'search.search': { input: { body: { type: 'agent' } }, output: {} },
	'statistics.downloadLegacyStatistic': {
		input: {
			path: { name: 'overview' },
			body: {
				filters: {
					period: {
						end_datetime: '2025-01-01T00:00:00Z',
						start_datetime: '2025-01-01T00:00:00Z',
					},
					agents: [],
					channels: [],
					campaigns: [],
					tags: [],
					integrations: [],
					score: [],
				},
			},
		},
		output: {
			kind: 'binary',
			contentType: 'text/csv',
			base64: 'AQ==',
			sizeBytes: 1,
		},
	},
	'statistics.getLegacyStatistic': {
		input: {
			path: { name: 'overview' },
			body: {
				filters: {
					period: {
						end_datetime: '2025-01-01T00:00:00Z',
						start_datetime: '2025-01-01T00:00:00Z',
					},
					agents: [],
					channels: [],
					campaigns: [],
					tags: [],
					integrations: [],
					score: [],
				},
			},
		},
		output: {
			data: {},
			meta: {
				end_datetime: '2025-01-01T00:00:00Z',
				start_datetime: '2025-01-01T00:00:00Z',
			},
		},
	},
	'tags.createTag': {
		input: { body: { name: 'x' } },
		output: {
			id: 1,
			decoration: { color: 'x' },
			description: 'x',
			name: 'x',
			usage: 1,
			uri: 'x',
			created_datetime: '2025-01-01T00:00:00Z',
			deleted_datetime: '2025-01-01T00:00:00Z',
		},
	},
	'tags.deleteTag': { input: { path: { id: 1 } }, output: undefined },
	'tags.deleteTags': { input: { body: { ids: [1] } }, output: undefined },
	'tags.getTag': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			decoration: { color: 'x' },
			description: 'x',
			name: 'x',
			usage: 1,
			uri: 'x',
			created_datetime: '2025-01-01T00:00:00Z',
			deleted_datetime: '2025-01-01T00:00:00Z',
		},
	},
	'tags.listTags': {
		input: {},
		output: {
			object: 'x',
			uri: 'x',
			data: [],
			meta: { prev_cursor: 'x', next_cursor: 'x', total_resources: 1 },
		},
	},
	'tags.mergeTags': {
		input: { path: { destination_tag_id: 1 }, body: { source_tags_ids: [] } },
		output: {
			id: 1,
			decoration: { color: 'x' },
			description: 'x',
			name: 'x',
			usage: 1,
			uri: 'x',
			created_datetime: '2025-01-01T00:00:00Z',
			deleted_datetime: '2025-01-01T00:00:00Z',
		},
	},
	'tags.updateTag': {
		input: {
			path: { id: 1 },
			body: { name: 'x', description: 'x', decoration: { color: 'x' } },
		},
		output: {
			id: 1,
			decoration: { color: 'x' },
			description: 'x',
			name: 'x',
			usage: 1,
			uri: 'x',
			created_datetime: '2025-01-01T00:00:00Z',
			deleted_datetime: '2025-01-01T00:00:00Z',
		},
	},
	'teams.createTeam': {
		input: { body: { name: 'x' } },
		output: {
			id: 1,
			uri: 'x',
			name: 'x',
			description: 'x',
			default_email_integration_id: 1,
			decoration: {},
			members: [],
			created_datetime: '2025-01-01T00:00:00Z',
		},
	},
	'teams.deleteTeam': { input: { path: { id: 1 } }, output: undefined },
	'teams.getTeam': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			uri: 'x',
			name: 'x',
			description: 'x',
			default_email_integration_id: 1,
			decoration: {},
			members: [],
			created_datetime: '2025-01-01T00:00:00Z',
		},
	},
	'teams.listTeams': { input: {}, output: [] },
	'teams.updateTeam': {
		input: {
			path: { id: 1 },
			body: {
				name: 'x',
				description: 'x',
				default_email_integration_id: 1,
				decoration: {},
				members: [],
			},
		},
		output: {
			id: 1,
			uri: 'x',
			name: 'x',
			description: 'x',
			default_email_integration_id: 1,
			decoration: {},
			members: [],
			created_datetime: '2025-01-01T00:00:00Z',
		},
	},
	'ticketMessages.createTicketMessage': {
		input: {
			path: { ticket_id: 1 },
			body: { channel: 'aircall', from_agent: true },
		},
		output: {
			id: 1,
			uri: 'x',
			message_id: 'x',
			ticket_id: 1,
			external_id: 'x',
			channel: 'aircall',
			via: 'aircall',
			source: { type: 'x' },
			sender: {
				id: 1,
				email: 'x',
				name: 'x',
				firstname: 'x',
				lastname: 'x',
				meta: {},
			},
			auth_customer_identity: {
				service: { id: 'x', name: 'x' },
				identifier: 'x',
			},
			integration_id: 1,
			intents: [],
			rule_id: 1,
			from_agent: true,
			receiver: {
				id: 1,
				email: 'x',
				name: 'x',
				firstname: 'x',
				lastname: 'x',
				meta: {},
			},
			subject: 'x',
			body_text: 'x',
			body_html: 'x',
			body_url: 'x',
			stripped_text: 'x',
			stripped_html: 'x',
			stripped_signature: 'x',
			attachments: [],
			actions: [],
			imported: true,
			meta: {},
			created_datetime: '2025-01-01T00:00:00Z',
			processed_datetime: '2025-01-01T00:00:00Z',
			sent_datetime: '2025-01-01T00:00:00Z',
			failed_datetime: '2025-01-01T00:00:00Z',
			opened_datetime: '2025-01-01T00:00:00Z',
			last_sending_error: { error: 'x' },
			is_retriable: true,
		},
	},
	'ticketMessages.deleteTicketMessage': {
		input: { path: { ticket_id: 1, id: 1 } },
		output: undefined,
	},
	'ticketMessages.getTicketMessage': {
		input: { path: { ticket_id: 1, id: 1 } },
		output: {
			id: 1,
			uri: 'x',
			message_id: 'x',
			ticket_id: 1,
			external_id: 'x',
			channel: 'aircall',
			via: 'aircall',
			source: { type: 'x' },
			sender: {
				id: 1,
				email: 'x',
				name: 'x',
				firstname: 'x',
				lastname: 'x',
				meta: {},
			},
			auth_customer_identity: {
				service: { id: 'x', name: 'x' },
				identifier: 'x',
			},
			integration_id: 1,
			intents: [],
			rule_id: 1,
			from_agent: true,
			receiver: {
				id: 1,
				email: 'x',
				name: 'x',
				firstname: 'x',
				lastname: 'x',
				meta: {},
			},
			subject: 'x',
			body_text: 'x',
			body_html: 'x',
			body_url: 'x',
			stripped_text: 'x',
			stripped_html: 'x',
			stripped_signature: 'x',
			attachments: [],
			actions: [],
			imported: true,
			meta: {},
			created_datetime: '2025-01-01T00:00:00Z',
			processed_datetime: '2025-01-01T00:00:00Z',
			sent_datetime: '2025-01-01T00:00:00Z',
			failed_datetime: '2025-01-01T00:00:00Z',
			opened_datetime: '2025-01-01T00:00:00Z',
			last_sending_error: { error: 'x' },
			is_retriable: true,
		},
	},
	'ticketMessages.listMessages': {
		input: {},
		output: {
			object: 'x',
			uri: 'x',
			data: [],
			meta: { prev_cursor: 'x', next_cursor: 'x', total_resources: 1 },
		},
	},
	'ticketMessages.listTicketMessages': {
		input: { path: { ticket_id: 1 } },
		output: {
			object: 'x',
			uri: 'x',
			data: [],
			meta: { prev_cursor: 'x', next_cursor: 'x', total_resources: 1 },
		},
	},
	'ticketMessages.updateTicketMessage': {
		input: {
			path: { ticket_id: 1, id: 1 },
			body: { channel: 'aircall', from_agent: true },
		},
		output: {
			id: 1,
			uri: 'x',
			message_id: 'x',
			ticket_id: 1,
			external_id: 'x',
			channel: 'aircall',
			via: 'aircall',
			source: { type: 'x' },
			sender: {
				id: 1,
				email: 'x',
				name: 'x',
				firstname: 'x',
				lastname: 'x',
				meta: {},
			},
			auth_customer_identity: {
				service: { id: 'x', name: 'x' },
				identifier: 'x',
			},
			integration_id: 1,
			intents: [],
			rule_id: 1,
			from_agent: true,
			receiver: {
				id: 1,
				email: 'x',
				name: 'x',
				firstname: 'x',
				lastname: 'x',
				meta: {},
			},
			subject: 'x',
			body_text: 'x',
			body_html: 'x',
			body_url: 'x',
			stripped_text: 'x',
			stripped_html: 'x',
			stripped_signature: 'x',
			attachments: [],
			actions: [],
			imported: true,
			meta: {},
			created_datetime: '2025-01-01T00:00:00Z',
			processed_datetime: '2025-01-01T00:00:00Z',
			sent_datetime: '2025-01-01T00:00:00Z',
			failed_datetime: '2025-01-01T00:00:00Z',
			opened_datetime: '2025-01-01T00:00:00Z',
			last_sending_error: { error: 'x' },
			is_retriable: true,
		},
	},
	'tickets.createTicket': {
		input: { body: { messages: [{ channel: 'aircall', from_agent: true }] } },
		output: {
			id: 1,
			uri: 'x',
			external_id: 'x',
			events: [],
			channel: 'aircall',
			via: 'aircall',
			from_agent: true,
			spam: true,
			imported: true,
			customer: {
				id: 1,
				email: 'x',
				name: 'x',
				firstname: 'x',
				lastname: 'x',
				meta: {},
				channels: [],
				data: {},
				customer: {},
				integrations: {},
				external_id: 'x',
				note: 'x',
			},
			assignee_user: {
				id: 1,
				email: 'x',
				name: 'x',
				firstname: 'x',
				lastname: 'x',
				meta: {},
				bio: 'x',
			},
			language: 'x',
			subject: 'x',
			meta: {},
			tags: [],
			messages: [],
			created_datetime: '2025-01-01T00:00:00Z',
			processed_datetime: '2025-01-01T00:00:00Z',
			opened_datetime: '2025-01-01T00:00:00Z',
			last_received_message_datetime: '2025-01-01T00:00:00Z',
			last_message_datetime: '2025-01-01T00:00:00Z',
			updated_datetime: '2025-01-01T00:00:00Z',
			closed_datetime: '2025-01-01T00:00:00Z',
			trashed_datetime: '2025-01-01T00:00:00Z',
			snooze_datetime: '2025-01-01T00:00:00Z',
			satisfaction_survey: {
				id: 1,
				customer_id: 1,
				ticket_id: 1,
				sent_datetime: '2025-01-01T00:00:00Z',
				scored_datetime: '2025-01-01T00:00:00Z',
				should_send_datetime: '2025-01-01T00:00:00Z',
				created_datetime: '2025-01-01T00:00:00Z',
				score: 1,
				body_text: 'x',
				meta: {},
			},
			reply_options: {},
			is_unread: true,
		},
	},
	'tickets.createTicketTags': {
		input: { path: { ticket_id: 1 }, body: { names: [], ids: [] } },
		output: undefined,
	},
	'tickets.deleteTicket': { input: { path: { id: 1 } }, output: undefined },
	'tickets.deleteTicketCustomField': {
		input: { path: { ticket_id: 1, id: 1 } },
		output: undefined,
	},
	'tickets.deleteTicketTags': {
		input: { path: { ticket_id: 1 }, body: { names: [], ids: [] } },
		output: undefined,
	},
	'tickets.getTicket': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			uri: 'x',
			external_id: 'x',
			events: [],
			channel: 'aircall',
			via: 'aircall',
			from_agent: true,
			spam: true,
			imported: true,
			customer: {
				id: 1,
				email: 'x',
				name: 'x',
				firstname: 'x',
				lastname: 'x',
				meta: {},
				channels: [],
				data: {},
				customer: {},
				integrations: {},
				external_id: 'x',
				note: 'x',
			},
			assignee_user: {
				id: 1,
				email: 'x',
				name: 'x',
				firstname: 'x',
				lastname: 'x',
				meta: {},
				bio: 'x',
			},
			language: 'x',
			subject: 'x',
			meta: {},
			tags: [],
			messages: [],
			created_datetime: '2025-01-01T00:00:00Z',
			processed_datetime: '2025-01-01T00:00:00Z',
			opened_datetime: '2025-01-01T00:00:00Z',
			last_received_message_datetime: '2025-01-01T00:00:00Z',
			last_message_datetime: '2025-01-01T00:00:00Z',
			updated_datetime: '2025-01-01T00:00:00Z',
			closed_datetime: '2025-01-01T00:00:00Z',
			trashed_datetime: '2025-01-01T00:00:00Z',
			snooze_datetime: '2025-01-01T00:00:00Z',
			satisfaction_survey: {
				id: 1,
				customer_id: 1,
				ticket_id: 1,
				sent_datetime: '2025-01-01T00:00:00Z',
				scored_datetime: '2025-01-01T00:00:00Z',
				should_send_datetime: '2025-01-01T00:00:00Z',
				created_datetime: '2025-01-01T00:00:00Z',
				score: 1,
				body_text: 'x',
				meta: {},
			},
			reply_options: {},
			is_unread: true,
		},
	},
	'tickets.listTicketCustomFields': {
		input: { path: { ticket_id: 1 } },
		output: [],
	},
	'tickets.listTicketTags': { input: { path: { ticket_id: 1 } }, output: [] },
	'tickets.listTickets': {
		input: {},
		output: {
			object: 'x',
			uri: 'x',
			data: [],
			meta: { prev_cursor: 'x', next_cursor: 'x', total_resources: 1 },
		},
	},
	'tickets.updateTicket': {
		input: {
			path: { id: 1 },
			body: {
				assignee_team: { id: 1 },
				assignee_user: { id: 1 },
				channel: 'aircall',
				closed_datetime: '2025-01-01T00:00:00Z',
				custom_fields: [],
				customer: { id: 1, email: 'x', name: 'x' },
				external_id: 'x',
				from_agent: true,
				is_unread: true,
				language: 'x',
				last_message_datetime: '2025-01-01T00:00:00Z',
				last_received_message_datetime: '2025-01-01T00:00:00Z',
				meta: {},
				opened_datetime: '2025-01-01T00:00:00Z',
				priority: 'critical',
				snooze_datetime: '2025-01-01T00:00:00Z',
				spam: true,
				status: 'open',
				subject: 'x',
				tags: [],
				trashed_datetime: '2025-01-01T00:00:00Z',
				updated_datetime: '2025-01-01T00:00:00Z',
				via: 'aircall',
			},
		},
		output: {
			id: 1,
			uri: 'x',
			external_id: 'x',
			events: [],
			channel: 'aircall',
			via: 'aircall',
			from_agent: true,
			spam: true,
			imported: true,
			customer: {
				id: 1,
				email: 'x',
				name: 'x',
				firstname: 'x',
				lastname: 'x',
				meta: {},
				channels: [],
				data: {},
				customer: {},
				integrations: {},
				external_id: 'x',
				note: 'x',
			},
			assignee_user: {
				id: 1,
				email: 'x',
				name: 'x',
				firstname: 'x',
				lastname: 'x',
				meta: {},
				bio: 'x',
			},
			language: 'x',
			subject: 'x',
			meta: {},
			tags: [],
			messages: [],
			created_datetime: '2025-01-01T00:00:00Z',
			processed_datetime: '2025-01-01T00:00:00Z',
			opened_datetime: '2025-01-01T00:00:00Z',
			last_received_message_datetime: '2025-01-01T00:00:00Z',
			last_message_datetime: '2025-01-01T00:00:00Z',
			updated_datetime: '2025-01-01T00:00:00Z',
			closed_datetime: '2025-01-01T00:00:00Z',
			trashed_datetime: '2025-01-01T00:00:00Z',
			snooze_datetime: '2025-01-01T00:00:00Z',
			satisfaction_survey: {
				id: 1,
				customer_id: 1,
				ticket_id: 1,
				sent_datetime: '2025-01-01T00:00:00Z',
				scored_datetime: '2025-01-01T00:00:00Z',
				should_send_datetime: '2025-01-01T00:00:00Z',
				created_datetime: '2025-01-01T00:00:00Z',
				score: 1,
				body_text: 'x',
				meta: {},
			},
			reply_options: {},
			is_unread: true,
		},
	},
	'tickets.updateTicketCustomField': {
		input: { path: { ticket_id: 1, id: 1 }, body: 'x' },
		output: { value: {} },
	},
	'tickets.updateTicketCustomFields': {
		input: { path: { ticket_id: 1 }, body: [] },
		output: [],
	},
	'tickets.updateTicketTags': {
		input: { path: { ticket_id: 1 }, body: { names: [], ids: [] } },
		output: undefined,
	},
	'users.createUser': {
		input: {
			body: { email: 'agent@acme.test', name: 'x', role: { name: 'admin' } },
		},
		output: {
			id: 1,
			active: true,
			bio: 'x',
			created_datetime: '2025-01-01T00:00:00Z',
			country: 'x',
			deactivated_datetime: '2025-01-01T00:00:00Z',
			email: 'agent@acme.test',
			external_id: 'x',
			firstname: 'x',
			lastname: 'x',
			language: 'x',
			meta: {
				sso: 'google',
				profile_picture_url: 'https://acme.test/resource',
			},
			name: 'x',
			role: { name: 'admin' },
			timezone: 'x',
			updated_datetime: '2025-01-01T00:00:00Z',
			client_id: 'x',
		},
	},
	'users.deleteUser': { input: { path: { id: 1 } }, output: undefined },
	'users.getUser': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			active: true,
			bio: 'x',
			created_datetime: '2025-01-01T00:00:00Z',
			country: 'x',
			deactivated_datetime: '2025-01-01T00:00:00Z',
			email: 'agent@acme.test',
			external_id: 'x',
			firstname: 'x',
			lastname: 'x',
			language: 'x',
			meta: {
				sso: 'google',
				profile_picture_url: 'https://acme.test/resource',
			},
			name: 'x',
			role: { name: 'admin' },
			timezone: 'x',
			updated_datetime: '2025-01-01T00:00:00Z',
			client_id: 'x',
		},
	},
	'users.listUsers': { input: {}, output: [] },
	'users.updateUser': {
		input: {
			path: { id: 1 },
			body: {
				bio: 'x',
				country: 'x',
				email: 'agent@acme.test',
				external_id: 'x',
				language: 'fr',
				meta: {
					sso: 'google',
					profile_picture_url: 'https://acme.test/resource',
				},
				name: 'x',
				new_password: 'x',
				old_password: 'x',
				password_confirmation: 'x',
				role: { name: 'admin' },
				timezone: 'Africa/Abidjan',
				two_fa_code: 'x',
			},
		},
		output: {
			id: 1,
			active: true,
			bio: 'x',
			created_datetime: '2025-01-01T00:00:00Z',
			country: 'x',
			deactivated_datetime: '2025-01-01T00:00:00Z',
			email: 'agent@acme.test',
			external_id: 'x',
			firstname: 'x',
			lastname: 'x',
			language: 'x',
			meta: {
				sso: 'google',
				profile_picture_url: 'https://acme.test/resource',
			},
			name: 'x',
			role: { name: 'admin' },
			timezone: 'x',
			updated_datetime: '2025-01-01T00:00:00Z',
			client_id: 'x',
		},
	},
	'views.createView': {
		input: { body: { slug: 'x' } },
		output: { id: 1, uri: 'x' },
	},
	'views.deleteView': { input: { path: { id: 1 } }, output: undefined },
	'views.getView': { input: { path: { id: 1 } }, output: { id: 1, uri: 'x' } },
	'views.listViewItems': {
		input: { path: { view_id: 1 } },
		output: {
			data: [],
			meta: {
				current_cursor: 'x',
				next_items: 'https://acme.test/resource',
				prev_items: 'https://acme.test/resource',
			},
		},
	},
	'views.listViews': {
		input: {},
		output: {
			object: 'x',
			uri: 'x',
			data: [],
			meta: { prev_cursor: 'x', next_cursor: 'x', total_resources: 1 },
		},
	},
	'views.updateView': {
		input: {
			path: { id: 1 },
			body: {
				decoration: { emoji: 'x' },
				fields: [],
				filters: 'x',
				name: 'x',
				order_by: 'x',
				order_dir: 'asc',
				shared_with_teams: [],
				shared_with_users: [],
				slug: 'x',
				type: 'ticket-list',
				visibility: 'public',
			},
		},
		output: { id: 1, uri: 'x' },
	},
	'views.updateViewItems': {
		input: {
			path: { view_id: 1 },
			body: {
				view: {
					category: 'x',
					fields: [],
					filters: 'x',
					order_by: 'x',
					order_dir: 'asc',
					search: 'x',
					type: 'ticket-list',
				},
			},
		},
		output: {
			data: [],
			meta: {
				current_cursor: 'x',
				next_items: 'https://acme.test/resource',
				prev_items: 'https://acme.test/resource',
			},
		},
	},
	'voiceCallEvents.getVoiceCallEvent': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			type: 'phone-call-answered',
			account_id: 1,
			call_id: 1,
			user_id: 1,
			customer_id: 1,
			created_datetime: '2025-01-01T00:00:00Z',
			meta: {},
		},
	},
	'voiceCallEvents.listVoiceCallEvents': { input: {}, output: [] },
	'voiceCallRecordings.deleteVoiceCallRecording': {
		input: { path: { id: 1 } },
		output: undefined,
	},
	'voiceCallRecordings.getVoiceCallRecording': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			call_id: 1,
			external_id: 'x',
			url: 'x',
			duration: 1,
			type: 'call-recording',
			created_datetime: '2025-01-01T00:00:00Z',
			deleted_datetime: '2025-01-01T00:00:00Z',
			deleted_by_user_id: 1,
			error_code: 'RECORDING_IS_PRIVATE',
			transcription_status: 'requested',
		},
	},
	'voiceCallRecordings.listVoiceCallRecordings': { input: {}, output: [] },
	'voiceCalls.getVoiceCall': {
		input: { path: { id: 1 } },
		output: {
			created_datetime: '2025-01-01T00:00:00Z',
			direction: 'inbound',
			external_id: 'x',
			id: 1,
			integration_id: 1,
			provider: 'x',
			status: 'answered',
		},
	},
	'voiceCalls.listVoiceCalls': {
		input: {},
		output: {
			data: [],
			meta: { next_cursor: 'x', prev_cursor: 'x' },
			object: {},
			uri: 'https://acme.test/resource',
		},
	},
	'widgets.createWidget': {
		input: { body: { template: {}, type: 'bigcommerce' } },
		output: {
			id: 1,
			context: 'ticket',
			created_datetime: '2025-01-01T00:00:00Z',
			deactivated_datetime: '2025-01-01T00:00:00Z',
			integration_id: 1,
			app_id: 'x',
			order: 1,
			template: {},
			type: 'bigcommerce',
			updated_datetime: '2025-01-01T00:00:00Z',
			uri: 'x',
		},
	},
	'widgets.deleteWidget': { input: { path: { id: 1 } }, output: undefined },
	'widgets.getWidget': {
		input: { path: { id: 1 } },
		output: {
			id: 1,
			context: 'ticket',
			created_datetime: '2025-01-01T00:00:00Z',
			deactivated_datetime: '2025-01-01T00:00:00Z',
			integration_id: 1,
			app_id: 'x',
			order: 1,
			template: {},
			type: 'bigcommerce',
			updated_datetime: '2025-01-01T00:00:00Z',
			uri: 'x',
		},
	},
	'widgets.listWidgets': { input: {}, output: [] },
	'widgets.updateWidget': {
		input: {
			path: { id: 1 },
			body: {
				context: 'ticket',
				deactivated_datetime: '2025-01-01T00:00:00Z',
				integration_id: 1,
				app_id: 'x',
				order: 1,
				template: {},
				type: 'bigcommerce',
			},
		},
		output: {
			id: 1,
			context: 'ticket',
			created_datetime: '2025-01-01T00:00:00Z',
			deactivated_datetime: '2025-01-01T00:00:00Z',
			integration_id: 1,
			app_id: 'x',
			order: 1,
			template: {},
			type: 'bigcommerce',
			updated_datetime: '2025-01-01T00:00:00Z',
			uri: 'x',
		},
	},
};

const ctx: GorgiasContext = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('test-account'),
	key: 'test-api-key',
	options: {},
	keys: {
		get_dek: () => Promise.resolve('test-dek'),
		issue_new_dek: () => Promise.resolve('test-dek'),
		get_api_key: () => Promise.resolve('test-api-key'),
		set_api_key: () => Promise.resolve(),
		get_email: () => Promise.resolve('agent@acme.test'),
		set_email: () => Promise.resolve(),
		get_tenant_external_id: () => Promise.resolve('demo-account'),
		set_tenant_external_id: () => Promise.resolve(),
		get_webhook_signature: () => Promise.resolve(null),
		set_webhook_signature: () => Promise.resolve(),
	},
	db: {},
};

// `unknown` because parsed route sections differ in their generated OpenAPI types.
function readSection(
	value: unknown,
	key: string,
): Record<string, unknown> | undefined {
	if (typeof value !== 'object' || value === null || Array.isArray(value))
		return undefined;
	const entry = Object.entries(value).find(([name]) => name === key)?.[1];
	if (typeof entry !== 'object' || entry === null || Array.isArray(entry))
		return undefined;
	const result: Record<string, unknown> = {};
	for (const [name, item] of Object.entries(entry)) result[name] = item;
	return result;
}

// `unknown` because request bodies may be objects, arrays, or absent by operation.
function readField(value: unknown, key: string): unknown {
	if (typeof value !== 'object' || value === null || Array.isArray(value))
		return undefined;
	return Object.entries(value).find(([name]) => name === key)?.[1];
}

// `unknown` because invalid-input cases mutate the provider-specific fixture at runtime.
function withUnexpectedField(value: unknown): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		for (const [key, entry] of Object.entries(value)) result[key] = entry;
	}
	result.undocumented_field = true;
	return result;
}

describe('Gorgias REST operations', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
		mockedLogEvent.mockReset();
	});

	const definitions = Object.values(gorgiasOperationDefinitions).flatMap(
		(group) => Object.values(group),
	);
	it.each(
		definitions.map((definition) => [definition.key, definition] as const),
	)(
		'%s sends the documented route and rejects extra input',
		async (_key, definition) => {
			const fixture = fixtures[definition.key];
			expect(fixture).toBeDefined();
			if (!fixture) throw new Error(`Missing fixture for ${definition.key}`);
			mockedRequest.mockResolvedValue(fixture.output);
			const path = readSection(fixture.input, 'path') ?? {};
			const query = readSection(fixture.input, 'query') ?? {};
			const expectedContentType =
				definition.key === 'statistics.downloadLegacyStatistic'
					? 'text/csv'
					: 'application/octet-stream';
			const fetchSpy = definition.binary
				? jest.spyOn(globalThis, 'fetch').mockResolvedValue(
						new Response(new Uint8Array([1]), {
							headers: { 'content-type': expectedContentType },
						}),
					)
				: undefined;
			try {
				const result = await executeGorgiasOperation(
					ctx,
					definition,
					fixture.input,
				);
				expect(result).toEqual(fixture.output);
				if (definition.binary) {
					expect(fetchSpy).toHaveBeenCalledTimes(1);
					const fetchCall = fetchSpy?.mock.calls[0];
					const url = new URL(String(fetchCall?.[0]));
					const expectedPath = definition.path.replace(
						/\{([^}]+)\}/g,
						(_match: string, name: string) =>
							encodeURIComponent(String(path[name])),
					);
					expect(url.pathname).toBe(expectedPath);
					expect(fetchCall?.[1]?.method).toBe(definition.method);
					for (const [name, value] of Object.entries(query)) {
						const expected =
							value === undefined
								? []
								: Array.isArray(value)
									? value.map(String)
									: [String(value)];
						expect(url.searchParams.getAll(name)).toEqual(expected);
					}
					expect(
						new Headers(fetchCall?.[1]?.headers).get('authorization'),
					).toMatch(/^Basic /);
					const body = readField(fixture.input, 'body');
					if (body !== undefined)
						expect(JSON.parse(String(fetchCall?.[1]?.body))).toEqual(body);
				} else {
					const config = mockedRequest.mock.calls[0]?.[0];
					const options = mockedRequest.mock.calls[0]?.[1];
					expect(config?.BASE).toBe('https://demo-account.gorgias.com');
					expect(config?.USERNAME).toBe('agent@acme.test');
					expect(config?.PASSWORD).toBe('test-api-key');
					expect(options?.method).toBe(definition.method);
					expect(options?.url).toBe(definition.path);
					expect(options?.path).toEqual(readSection(fixture.input, 'path'));
					expect(options?.query).toEqual(readSection(fixture.input, 'query'));
					expect(options?.headers).toEqual(
						readSection(fixture.input, 'headers'),
					);
					if (definition.multipart)
						expect(options?.body).toBeInstanceOf(FormData);
					else expect(options?.body).toEqual(readField(fixture.input, 'body'));
					if (definition.multipart) expect(options?.mediaType).toBeUndefined();
					else if (readField(fixture.input, 'body') !== undefined)
						expect(options?.mediaType).toBe('application/json; charset=utf-8');
				}
				expect(mockedLogEvent).toHaveBeenCalledWith(
					ctx,
					`gorgias.${definition.key}`,
					{ operation: definition.operationId },
					'completed',
				);
				const eventPayload = mockedLogEvent.mock.calls[0]?.[2];
				expect(JSON.stringify(eventPayload)).not.toContain('agent@acme.test');
				mockedRequest.mockClear();
				fetchSpy?.mockClear();
				await expect(
					executeGorgiasOperation(
						ctx,
						definition,
						withUnexpectedField(fixture.input),
					),
				).rejects.toThrow();
				expect(mockedRequest).not.toHaveBeenCalled();
				if (fetchSpy) expect(fetchSpy).not.toHaveBeenCalled();
			} finally {
				fetchSpy?.mockRestore();
			}
		},
	);
});
