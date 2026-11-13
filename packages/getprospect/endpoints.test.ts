import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { GetProspectOperations } from './endpoints';
import { GetProspectOperationInputSchemas } from './endpoints/types';
import type { GetProspectContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));
jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeGetProspectRequest: jest.fn(),
}));

const mockedRequest = jest.mocked(client.makeGetProspectRequest);
const mockedLog = jest.mocked(logEventFromContext);
type Context = GetProspectContext;

function buildContext(): Context {
	const context: Context = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return context;
}

const context = buildContext();
const fixtures = {
	people_get: {
		input: { path: { id: '64f1a2b3c4d5e6f7a8b9c0d1' } },
		response: {
			success: true,
			data: {
				id: 'x',
				full_name: 'x',
				first_name: 'x',
				last_name: 'x',
				email: {
					status: 'valid',
					address: 'person@samplemail.test',
					domain: 'x',
					domain_status: 'valid',
					provider: 'x',
					verified_at: '2026-01-01T00:00:00Z',
					checked_at: '2026-01-01T00:00:00Z',
					revealed: false,
				},
				mobile_phone: {
					status: 'not_requested',
					number: 'x',
					numbers: ['x'],
					revealed: false,
					checked_at: '2026-01-01T00:00:00Z',
				},
				location: {
					city: 'x',
					state: 'x',
					state_code: 'x',
					country: 'x',
					country_code: 'x',
					time_zone: 'x',
					time_zone_offset: 1.5,
				},
				linkedin_url: 'x',
				linkedin_id: 1,
				followers: 0,
				primary_position: {
					job_title: 'x',
					normalized_job_title: 'x',
					seniority: 'x',
					departments: ['x'],
					start_date: 'x',
					company: {},
					position_index: 0,
					id: 'x',
				},
				saved: {
					id: 'x',
					saved_at: '2026-01-01T00:00:00Z',
					lists: [{ id: 'x', name: 'x', created_at: '2026-01-01T00:00:00Z' }],
				},
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/people/64f1a2b3c4d5e6f7a8b9c0d1',
		options: { method: 'GET', timeout: 20000 },
	},
	people_edits_update: {
		input: { path: { id: 'x' }, body: {} },
		response: {
			success: true,
			data: { id: 'x', edits: {} },
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/people/x/edits',
		options: { method: 'PATCH', body: {}, timeout: 20000 },
	},
	people_bulk_enrich: {
		input: { body: { data: [{}] } },
		response: {
			success: true,
			data: {
				matched: [
					{
						identifier: 'x',
						matched_by: 'id',
						person: {
							id: 'x',
							full_name: 'x',
							first_name: 'x',
							last_name: 'x',
							email: {
								status: 'valid',
								address: 'person@samplemail.test',
								domain: 'x',
								domain_status: 'valid',
								provider: 'x',
								verified_at: '2026-01-01T00:00:00Z',
								checked_at: '2026-01-01T00:00:00Z',
								revealed: false,
							},
							mobile_phone: {
								status: 'not_requested',
								number: 'x',
								numbers: ['x'],
								revealed: false,
								checked_at: '2026-01-01T00:00:00Z',
							},
							location: {
								city: 'x',
								state: 'x',
								state_code: 'x',
								country: 'x',
								country_code: 'x',
								time_zone: 'x',
								time_zone_offset: 1.5,
							},
							linkedin_url: 'x',
							linkedin_id: 1,
							followers: 0,
							primary_position: {
								job_title: 'x',
								normalized_job_title: 'x',
								seniority: 'x',
								departments: ['x'],
								start_date: 'x',
								company: {},
								position_index: 0,
								id: 'x',
							},
							saved: {
								id: 'x',
								saved_at: '2026-01-01T00:00:00Z',
								lists: [
									{ id: 'x', name: 'x', created_at: '2026-01-01T00:00:00Z' },
								],
							},
						},
					},
				],
				not_matched: [{ identifier: 'x', attempted: ['id'] }],
				invalid: [{ identifier: 'x', reason: 'x' }],
			},
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				total: 0,
				matched_count: 0,
				not_matched_count: 0,
				invalid_count: 0,
			},
		},
		path: '/v2/people/bulk-enrich',
		options: { method: 'POST', body: { data: [{}] }, timeout: 20000 },
	},
	people_calculate_credits: {
		input: { body: {} },
		response: {
			success: true,
			data: {
				requested: 0,
				savable: 0,
				not_matched: 0,
				invalid: 0,
				emails: { to_charge: 0, already_owned: 0, without_email: 0, edited: 0 },
				credits_needed: 0,
				credits_available: 0,
				enough_credits: false,
				truncated: false,
				estimate: false,
				sample_size: 1,
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/people/calculate-credits',
		options: { method: 'POST', body: {}, timeout: 20000 },
	},
	people_count: {
		input: { body: { filters: {} } },
		response: {
			success: true,
			data: { total: 0 },
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				counted_at: '2026-01-01T00:00:00Z',
			},
		},
		path: '/v2/people/count',
		options: { method: 'POST', body: { filters: {} }, timeout: 20000 },
	},
	people_enrich: {
		input: { body: { data: {} } },
		response: {
			success: true,
			data: {
				id: 'x',
				full_name: 'x',
				first_name: 'x',
				last_name: 'x',
				email: {
					status: 'valid',
					address: 'person@samplemail.test',
					domain: 'x',
					domain_status: 'valid',
					provider: 'x',
					verified_at: '2026-01-01T00:00:00Z',
					checked_at: '2026-01-01T00:00:00Z',
					revealed: false,
				},
				mobile_phone: {
					status: 'not_requested',
					number: 'x',
					numbers: ['x'],
					revealed: false,
					checked_at: '2026-01-01T00:00:00Z',
				},
				location: {
					city: 'x',
					state: 'x',
					state_code: 'x',
					country: 'x',
					country_code: 'x',
					time_zone: 'x',
					time_zone_offset: 1.5,
				},
				linkedin_url: 'x',
				linkedin_id: 1,
				followers: 0,
				primary_position: {
					job_title: 'x',
					normalized_job_title: 'x',
					seniority: 'x',
					departments: ['x'],
					start_date: 'x',
					company: {},
					position_index: 0,
					id: 'x',
				},
				saved: {
					id: 'x',
					saved_at: '2026-01-01T00:00:00Z',
					lists: [{ id: 'x', name: 'x', created_at: '2026-01-01T00:00:00Z' }],
				},
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/people/enrich',
		options: { method: 'POST', body: { data: {} }, timeout: 95000 },
	},
	people_enrich_search: {
		input: { body: { filters: {} } },
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'people_enrich_search',
				status: 'queued',
				total: 0,
				processed: 0,
				progress_percent: 0,
				error: 'x',
				resource_url: 'x',
				created_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
				result: {
					requested: 0,
					truncated: false,
					found: 0,
					already_not_found: 0,
					stopped_reason: 'x',
				},
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/people/enrich-search',
		options: { method: 'POST', body: { filters: {} }, timeout: 20000 },
	},
	people_save: {
		input: { body: { data: ['x'], list_ids: ['x'] } },
		response: {
			success: true,
			data: {
				saved: [
					{
						identifier: 'x',
						id: 'x',
						matched_by: 'x',
						list_ids: ['x'],
						saved_at: '2026-01-01T00:00:00Z',
						email: {
							status: 'x',
							address: 'person@samplemail.test',
							revealed: true,
						},
					},
				],
				not_matched: [{ identifier: 'x', attempted: ['x'] }],
				invalid: [{ identifier: 'x', reason: 'x' }],
				failed: [{ identifier: 'x', id: 'x', reason: 'x' }],
			},
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				total: 0,
				saved_count: 0,
				not_matched_count: 0,
				invalid_count: 0,
				failed_count: 0,
			},
		},
		path: '/v2/people/save',
		options: {
			method: 'POST',
			body: { data: ['x'], list_ids: ['x'] },
			timeout: 20000,
		},
	},
	people_save_search: {
		input: { body: { filters: {} } },
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'people_save_search',
				status: 'queued',
				total: 0,
				processed: 0,
				progress_percent: 0,
				error: 'x',
				resource_url: 'x',
				created_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
				result: {
					requested: 0,
					saved: 0,
					not_found: 0,
					stopped_reason: 'x',
					truncated: false,
				},
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/people/save-search',
		options: { method: 'POST', body: { filters: {} }, timeout: 20000 },
	},
	people_search: {
		input: { body: { filters: {} } },
		response: {
			success: true,
			data: [
				{
					id: 'x',
					full_name: 'x',
					first_name: 'x',
					last_name: 'x',
					email: {
						status: 'valid',
						address: 'person@samplemail.test',
						domain: 'x',
						domain_status: 'valid',
						provider: 'x',
						verified_at: '2026-01-01T00:00:00Z',
						checked_at: '2026-01-01T00:00:00Z',
						revealed: false,
					},
					mobile_phone: {
						status: 'not_requested',
						number: 'x',
						numbers: ['x'],
						revealed: false,
						checked_at: '2026-01-01T00:00:00Z',
					},
					location: {
						city: 'x',
						state: 'x',
						state_code: 'x',
						country: 'x',
						country_code: 'x',
						time_zone: 'x',
						time_zone_offset: 1.5,
					},
					linkedin_url: 'x',
					linkedin_id: 1,
					followers: 0,
					primary_position: {
						job_title: 'x',
						normalized_job_title: 'x',
						seniority: 'x',
						departments: ['x'],
						start_date: 'x',
						company: {},
						position_index: 0,
						id: 'x',
					},
					saved: {
						id: 'x',
						saved_at: '2026-01-01T00:00:00Z',
						lists: [{ id: 'x', name: 'x', created_at: '2026-01-01T00:00:00Z' }],
					},
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				sort_by: 'x',
				sort_direction: 'asc',
				pagination: {
					page: 1,
					per_page: 1,
					total_pages: 1,
					total_count: 0,
					max_page: 1,
					truncated: false,
					total_is_estimate: false,
				},
			},
		},
		path: '/v2/people/search',
		options: { method: 'POST', body: { filters: {} }, timeout: 20000 },
	},
	companies_get: {
		input: { path: { id: '64f1a2b3c4d5e6f7a8b9c0d1' } },
		response: {
			success: true,
			data: {
				id: '64f1a2b3c4d5e6f7a8b9c0d1',
				name: 'x',
				description: 'x',
				logo: 'https://samplemail.test',
				website: 'x',
				email: { domain: 'x', provider: 'x' },
				linkedin_url: 'https://samplemail.test',
				linkedin_id: 1,
				social_networks: {
					linkedin_url: 'https://samplemail.test',
					facebook_url: 'https://samplemail.test',
					twitter_url: 'https://samplemail.test',
					instagram_url: 'https://samplemail.test',
					youtube_url: 'https://samplemail.test',
					tiktok_url: 'https://samplemail.test',
					crunchbase_url: 'https://samplemail.test',
					github_url: 'https://samplemail.test',
					pinterest_url: 'https://samplemail.test',
				},
				industry: 'x',
				keywords: ['x'],
				naics_codes: [1],
				ai_industries: ['x'],
				type: 'x',
				business_type: 'x',
				revenue_stream: 'x',
				founded: 1,
				employee_count: 1,
				employee_range: 'x',
				location: {
					city: 'x',
					state: 'x',
					state_code: 'x',
					country: 'x',
					country_code: 'x',
					raw_address: 'x',
				},
				other_locations: [
					{
						city: 'x',
						state: 'x',
						state_code: 'x',
						country: 'x',
						country_code: 'x',
						raw_address: 'x',
					},
				],
				saved: { id: 'x', saved_at: '2026-01-01T00:00:00Z', list_ids: ['x'] },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/companies/64f1a2b3c4d5e6f7a8b9c0d1',
		options: { method: 'GET', timeout: 20000 },
	},
	companies_edits_update: {
		input: { path: { id: '64f1a2b3c4d5e6f7a8b9c0d1' }, body: {} },
		response: {
			success: true,
			data: { id: 'x', edits: {} },
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/companies/64f1a2b3c4d5e6f7a8b9c0d1/edits',
		options: { method: 'PATCH', body: {}, timeout: 20000 },
	},
	companies_bulk_enrich: {
		input: { body: { data: [{}] } },
		response: {
			success: true,
			data: {
				matched: [
					{
						identifier: 'x',
						matched_by: 'id',
						company: {
							id: '64f1a2b3c4d5e6f7a8b9c0d1',
							name: 'x',
							description: 'x',
							logo: 'https://samplemail.test',
							website: 'x',
							email: { domain: 'x', provider: 'x' },
							linkedin_url: 'https://samplemail.test',
							linkedin_id: 1,
							social_networks: {
								linkedin_url: 'https://samplemail.test',
								facebook_url: 'https://samplemail.test',
								twitter_url: 'https://samplemail.test',
								instagram_url: 'https://samplemail.test',
								youtube_url: 'https://samplemail.test',
								tiktok_url: 'https://samplemail.test',
								crunchbase_url: 'https://samplemail.test',
								github_url: 'https://samplemail.test',
								pinterest_url: 'https://samplemail.test',
							},
							industry: 'x',
							keywords: ['x'],
							naics_codes: [1],
							ai_industries: ['x'],
							type: 'x',
							business_type: 'x',
							revenue_stream: 'x',
							founded: 1,
							employee_count: 1,
							employee_range: 'x',
							location: {
								city: 'x',
								state: 'x',
								state_code: 'x',
								country: 'x',
								country_code: 'x',
								raw_address: 'x',
							},
							other_locations: [
								{
									city: 'x',
									state: 'x',
									state_code: 'x',
									country: 'x',
									country_code: 'x',
									raw_address: 'x',
								},
							],
							saved: {
								id: 'x',
								saved_at: '2026-01-01T00:00:00Z',
								list_ids: ['x'],
							},
						},
					},
				],
				not_matched: [{ identifier: 'x', attempted: ['id'] }],
				invalid: [{ identifier: 'x', reason: 'x' }],
			},
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				total: 0,
				matched_count: 0,
				not_matched_count: 0,
				invalid_count: 0,
			},
		},
		path: '/v2/companies/bulk-enrich',
		options: { method: 'POST', body: { data: [{}] }, timeout: 20000 },
	},
	companies_enrich: {
		input: { body: { data: {} } },
		response: {
			success: true,
			data: {
				id: '64f1a2b3c4d5e6f7a8b9c0d1',
				name: 'x',
				description: 'x',
				logo: 'https://samplemail.test',
				website: 'x',
				email: { domain: 'x', provider: 'x' },
				linkedin_url: 'https://samplemail.test',
				linkedin_id: 1,
				social_networks: {
					linkedin_url: 'https://samplemail.test',
					facebook_url: 'https://samplemail.test',
					twitter_url: 'https://samplemail.test',
					instagram_url: 'https://samplemail.test',
					youtube_url: 'https://samplemail.test',
					tiktok_url: 'https://samplemail.test',
					crunchbase_url: 'https://samplemail.test',
					github_url: 'https://samplemail.test',
					pinterest_url: 'https://samplemail.test',
				},
				industry: 'x',
				keywords: ['x'],
				naics_codes: [1],
				ai_industries: ['x'],
				type: 'x',
				business_type: 'x',
				revenue_stream: 'x',
				founded: 1,
				employee_count: 1,
				employee_range: 'x',
				location: {
					city: 'x',
					state: 'x',
					state_code: 'x',
					country: 'x',
					country_code: 'x',
					raw_address: 'x',
				},
				other_locations: [
					{
						city: 'x',
						state: 'x',
						state_code: 'x',
						country: 'x',
						country_code: 'x',
						raw_address: 'x',
					},
				],
				saved: { id: 'x', saved_at: '2026-01-01T00:00:00Z', list_ids: ['x'] },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/companies/enrich',
		options: { method: 'POST', body: { data: {} }, timeout: 20000 },
	},
	companies_save: {
		input: { body: { data: ['x'] } },
		response: {
			success: true,
			data: {
				saved: [
					{
						identifier: 'x',
						id: 'x',
						matched_by: 'id',
						list_ids: ['x'],
						saved_at: '2026-01-01T00:00:00Z',
						all_list_ids: ['x'],
					},
				],
				not_matched: [{ identifier: 'x', attempted: ['x'] }],
				invalid: [{ identifier: 'x', reason: 'x' }],
				failed: [{ identifier: 'x', id: 'x', reason: 'x' }],
			},
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				total: 0,
				saved_count: 0,
				not_matched_count: 0,
				invalid_count: 0,
				failed_count: 0,
			},
		},
		path: '/v2/companies/save',
		options: { method: 'POST', body: { data: ['x'] }, timeout: 20000 },
	},
	companies_search: {
		input: { body: { filters: {} } },
		response: {
			success: true,
			data: [
				{
					id: '64f1a2b3c4d5e6f7a8b9c0d1',
					name: 'x',
					description: 'x',
					logo: 'https://samplemail.test',
					website: 'x',
					email: { domain: 'x', provider: 'x' },
					linkedin_url: 'https://samplemail.test',
					linkedin_id: 1,
					social_networks: {
						linkedin_url: 'https://samplemail.test',
						facebook_url: 'https://samplemail.test',
						twitter_url: 'https://samplemail.test',
						instagram_url: 'https://samplemail.test',
						youtube_url: 'https://samplemail.test',
						tiktok_url: 'https://samplemail.test',
						crunchbase_url: 'https://samplemail.test',
						github_url: 'https://samplemail.test',
						pinterest_url: 'https://samplemail.test',
					},
					industry: 'x',
					keywords: ['x'],
					naics_codes: [1],
					ai_industries: ['x'],
					type: 'x',
					business_type: 'x',
					revenue_stream: 'x',
					founded: 1,
					employee_count: 1,
					employee_range: 'x',
					location: {
						city: 'x',
						state: 'x',
						state_code: 'x',
						country: 'x',
						country_code: 'x',
						raw_address: 'x',
					},
					other_locations: [
						{
							city: 'x',
							state: 'x',
							state_code: 'x',
							country: 'x',
							country_code: 'x',
							raw_address: 'x',
						},
					],
					saved: { id: 'x', saved_at: '2026-01-01T00:00:00Z', list_ids: ['x'] },
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				sort_by: 'company_name',
				sort_direction: 'asc',
				pagination: { page: 1, per_page: 1, total_pages: 1, total_count: 0 },
			},
		},
		path: '/v2/companies/search',
		options: { method: 'POST', body: { filters: {} }, timeout: 20000 },
	},
	email_find_get: {
		input: {
			query: {
				full_name: 'x',
				first_name: 'x',
				last_name: 'x',
				domain: 'x',
				company: 'x',
			},
		},
		response: {
			success: true,
			data: {
				email: 'person@samplemail.test',
				status: 'valid',
				account: 'x',
				domain: 'x',
				domain_status: 'valid',
				smtp_provider: 'x',
				free_email: false,
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/email-finder',
		options: {
			method: 'GET',
			query: {
				full_name: 'x',
				first_name: 'x',
				last_name: 'x',
				domain: 'x',
				company: 'x',
			},
			timeout: 20000,
		},
	},
	email_verifications_list: {
		input: { query: { page: 1, per_page: 1, query: 'x', owner: 'x' } },
		response: {
			success: true,
			data: [
				{
					id: 'x',
					name: 'x',
					source: 'api',
					status: 'queued',
					stopped_reason: 'x',
					auto_start_blocked: { at: '2026-01-01T00:00:00Z', reason: 'credits' },
					counts: {
						total_rows: 0,
						parsed_rows: 0,
						billable: 0,
						duplicates: 0,
						invalid_syntax: 0,
						blank: 0,
						verified: 0,
						valid: 0,
						invalid: 0,
						accept_all: 0,
						unknown: 0,
					},
					batches: { total: 0, done: 0 },
					progress_percent: 0,
					result_files: {
						all: { url: 'https://samplemail.test' },
						valid: { url: 'https://samplemail.test' },
						invalid: { url: 'https://samplemail.test' },
					},
					result_expires_at: '2026-01-01T00:00:00Z',
					results_expires_at: '2026-01-01T00:00:00Z',
					results_available: false,
					results_unavailable_reason: 'too_large',
					links: { self: 'x', job: 'x', results: 'x' },
					owner: { id: 'x', first_name: 'x', last_name: 'x', photo_url: 'x' },
					created_by: { id: 'x', name: 'x' },
					error: 'x',
					created_at: '2026-01-01T00:00:00Z',
					updated_at: '2026-01-01T00:00:00Z',
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				pagination: {
					page: 1,
					per_page: 1,
					total_pages: 1,
					total_count: 0,
					page_size: 1,
				},
			},
		},
		path: '/v2/email-verifications',
		options: {
			method: 'GET',
			query: { page: 1, per_page: 1, query: 'x', owner: 'x' },
			timeout: 20000,
		},
	},
	email_verifications_create: {
		input: {
			headers: { idempotencyKey: 'stable-test-key' },
			body: { data: {} },
		},
		response: {
			success: true,
			data: {
				id: 'x',
				name: 'x',
				source: 'api',
				status: 'queued',
				stopped_reason: 'x',
				auto_start_blocked: { at: '2026-01-01T00:00:00Z', reason: 'credits' },
				counts: {
					total_rows: 0,
					parsed_rows: 0,
					billable: 0,
					duplicates: 0,
					invalid_syntax: 0,
					blank: 0,
					verified: 0,
					valid: 0,
					invalid: 0,
					accept_all: 0,
					unknown: 0,
				},
				batches: { total: 0, done: 0 },
				progress_percent: 0,
				result_files: {
					all: { url: 'https://samplemail.test' },
					valid: { url: 'https://samplemail.test' },
					invalid: { url: 'https://samplemail.test' },
				},
				result_expires_at: '2026-01-01T00:00:00Z',
				results_expires_at: '2026-01-01T00:00:00Z',
				results_available: false,
				results_unavailable_reason: 'too_large',
				links: { self: 'x', job: 'x', results: 'x' },
				owner: { id: 'x', first_name: 'x', last_name: 'x', photo_url: 'x' },
				created_by: { id: 'x', name: 'x' },
				error: 'x',
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/email-verifications',
		options: {
			method: 'POST',
			body: { data: {} },
			headers: { 'Idempotency-Key': 'stable-test-key' },
			timeout: 20000,
		},
	},
	email_verifications_get: {
		input: { path: { id: 'x' } },
		response: {
			success: true,
			data: {
				id: 'x',
				name: 'x',
				source: 'api',
				status: 'queued',
				stopped_reason: 'x',
				auto_start_blocked: { at: '2026-01-01T00:00:00Z', reason: 'credits' },
				counts: {
					total_rows: 0,
					parsed_rows: 0,
					billable: 0,
					duplicates: 0,
					invalid_syntax: 0,
					blank: 0,
					verified: 0,
					valid: 0,
					invalid: 0,
					accept_all: 0,
					unknown: 0,
				},
				batches: { total: 0, done: 0 },
				progress_percent: 0,
				result_files: {
					all: { url: 'https://samplemail.test' },
					valid: { url: 'https://samplemail.test' },
					invalid: { url: 'https://samplemail.test' },
				},
				result_expires_at: '2026-01-01T00:00:00Z',
				results_expires_at: '2026-01-01T00:00:00Z',
				results_available: false,
				results_unavailable_reason: 'too_large',
				links: { self: 'x', job: 'x', results: 'x' },
				owner: { id: 'x', first_name: 'x', last_name: 'x', photo_url: 'x' },
				created_by: { id: 'x', name: 'x' },
				error: 'x',
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/email-verifications/x',
		options: { method: 'GET', timeout: 20000 },
	},
	email_verifications_cancel: {
		input: { path: { id: 'x' } },
		response: {
			success: true,
			data: {
				id: 'x',
				name: 'x',
				source: 'api',
				status: 'queued',
				stopped_reason: 'x',
				auto_start_blocked: { at: '2026-01-01T00:00:00Z', reason: 'credits' },
				counts: {
					total_rows: 0,
					parsed_rows: 0,
					billable: 0,
					duplicates: 0,
					invalid_syntax: 0,
					blank: 0,
					verified: 0,
					valid: 0,
					invalid: 0,
					accept_all: 0,
					unknown: 0,
				},
				batches: { total: 0, done: 0 },
				progress_percent: 0,
				result_files: {
					all: { url: 'https://samplemail.test' },
					valid: { url: 'https://samplemail.test' },
					invalid: { url: 'https://samplemail.test' },
				},
				result_expires_at: '2026-01-01T00:00:00Z',
				results_expires_at: '2026-01-01T00:00:00Z',
				results_available: false,
				results_unavailable_reason: 'too_large',
				links: { self: 'x', job: 'x', results: 'x' },
				owner: { id: 'x', first_name: 'x', last_name: 'x', photo_url: 'x' },
				created_by: { id: 'x', name: 'x' },
				error: 'x',
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/email-verifications/x/cancel',
		options: { method: 'POST', timeout: 20000 },
	},
	email_verifications_results: {
		input: {
			path: { id: 'x' },
			query: { cursor: 'x', limit: 1, status: 'valid', q: 'x' },
		},
		response: {
			success: true,
			data: [
				{
					email: 'person@samplemail.test',
					status: 'valid',
					account: 'x',
					domain: 'x',
					domain_status: 'x',
					smtp_provider: 'x',
					provider: 'x',
					free_email: false,
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				pagination: { next_cursor: 'x', limit: 1 },
			},
		},
		path: '/v2/email-verifications/x/results',
		options: {
			method: 'GET',
			query: { cursor: 'x', limit: 1, status: 'valid', q: 'x' },
			timeout: 20000,
		},
	},
	email_verifications_start: {
		input: {
			path: { id: 'x' },
			headers: { idempotencyKey: 'stable-test-key' },
		},
		response: {
			success: true,
			data: {
				id: 'x',
				name: 'x',
				source: 'api',
				status: 'queued',
				stopped_reason: 'x',
				auto_start_blocked: { at: '2026-01-01T00:00:00Z', reason: 'credits' },
				counts: {
					total_rows: 0,
					parsed_rows: 0,
					billable: 0,
					duplicates: 0,
					invalid_syntax: 0,
					blank: 0,
					verified: 0,
					valid: 0,
					invalid: 0,
					accept_all: 0,
					unknown: 0,
				},
				batches: { total: 0, done: 0 },
				progress_percent: 0,
				result_files: {
					all: { url: 'https://samplemail.test' },
					valid: { url: 'https://samplemail.test' },
					invalid: { url: 'https://samplemail.test' },
				},
				result_expires_at: '2026-01-01T00:00:00Z',
				results_expires_at: '2026-01-01T00:00:00Z',
				results_available: false,
				results_unavailable_reason: 'too_large',
				links: { self: 'x', job: 'x', results: 'x' },
				owner: { id: 'x', first_name: 'x', last_name: 'x', photo_url: 'x' },
				created_by: { id: 'x', name: 'x' },
				error: 'x',
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/email-verifications/x/start',
		options: {
			method: 'POST',
			headers: { 'Idempotency-Key': 'stable-test-key' },
			timeout: 20000,
		},
	},
	email_verifications_history_list: {
		input: { query: { page: 1, per_page: 1 } },
		response: {
			success: true,
			data: [
				{
					id: 'x',
					email: 'person@samplemail.test',
					status: 'valid',
					provider: 'x',
					domain: 'x',
					free_email: false,
					owner: { id: 'x', first_name: 'x', last_name: 'x', photo_url: 'x' },
					verified_by: { id: 'x', name: 'x' },
					created_at: '2026-01-01T00:00:00Z',
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				pagination: {
					page: 1,
					per_page: 1,
					total_pages: 1,
					total_count: 0,
					page_size: 1,
				},
			},
		},
		path: '/v2/email-verifications/history',
		options: { method: 'GET', query: { page: 1, per_page: 1 }, timeout: 20000 },
	},
	email_verifications_inspect: {
		input: { body: { data: { file_key: 'x' } } },
		response: {
			success: true,
			data: {
				headers: ['x'],
				preview: [['x']],
				delimiter: 'x',
				encoding: 'x',
				has_header: false,
				email_column_candidates: [{ index: 0, header: 'x', sample: 'x' }],
				suggested_email_column: 0,
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/email-verifications/inspect',
		options: {
			method: 'POST',
			body: { data: { file_key: 'x' } },
			timeout: 20000,
		},
	},
	email_verify_get: {
		input: { query: { email: 'person@samplemail.test' } },
		response: {
			success: true,
			data: {
				email: 'person@samplemail.test',
				status: 'valid',
				account: 'x',
				domain: 'x',
				domain_status: 'x',
				smtp_provider: 'x',
				free_email: false,
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/email-verifier',
		options: {
			method: 'GET',
			query: { email: 'person@samplemail.test' },
			timeout: 20000,
		},
	},
	email_find: {
		input: { body: { data: {} } },
		response: {
			success: true,
			data: {
				email: 'person@samplemail.test',
				status: 'valid',
				account: 'x',
				domain: 'x',
				domain_status: 'valid',
				smtp_provider: 'x',
				free_email: false,
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/email/find',
		options: { method: 'POST', body: { data: {} }, timeout: 95000 },
	},
	email_verify: {
		input: { body: { data: { email: 'person@samplemail.test' } } },
		response: {
			success: true,
			data: {
				email: 'person@samplemail.test',
				status: 'valid',
				account: 'x',
				domain: 'x',
				domain_status: 'x',
				smtp_provider: 'x',
				free_email: false,
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/email/verify',
		options: {
			method: 'POST',
			body: { data: { email: 'person@samplemail.test' } },
			timeout: 80000,
		},
	},
	search_matching_titles: {
		input: { body: { boolean_search: 'xx' } },
		response: {
			success: true,
			data: [{ title: 'x', count: 0 }],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				limit: 1,
				returned: 0,
				cached: false,
			},
		},
		path: '/v2/search/matching-titles',
		options: { method: 'POST', body: { boolean_search: 'xx' }, timeout: 20000 },
	},
	search_smart_job_titles: {
		input: { body: { job_titles: ['x'] } },
		response: {
			success: true,
			data: {
				intent: 'x',
				titles: [{ title: 'x', level: 'SAME_ROLE', new_people: 1 }],
				exclude_titles: [{ title: 'x', removed_people: 0 }],
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z', cached: false },
		},
		path: '/v2/search/smart-job-titles',
		options: { method: 'POST', body: { job_titles: ['x'] }, timeout: 20000 },
	},
	search_suggest: {
		input: { body: { type: 'location' } },
		response: {
			success: true,
			data: [
				{
					type: 'location',
					value: 'x',
					level: 'region',
					city: 'x',
					state: 'x',
					state_code: 'x',
					country: 'x',
					country_code: 'x',
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				type: 'location',
				query: 'x',
			},
		},
		path: '/v2/search/suggest',
		options: { method: 'POST', body: { type: 'location' }, timeout: 20000 },
	},
	enums_list: {
		input: {},
		response: {
			success: true,
			data: {
				industries: {},
				countries: ['x'],
				employee_ranges: ['x'],
				company_types: ['x'],
				business_types: ['x'],
				revenue_streams: ['x'],
				keywords_sources: ['x'],
				departments: {},
				seniorities: ['x'],
				regions: {},
				ai_industries: {},
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/enums',
		options: { method: 'GET', timeout: 20000 },
	},
	enums_get: {
		input: { path: { name: 'industries' } },
		response: {
			success: true,
			data: null,
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/enums/industries',
		options: { method: 'GET', timeout: 20000 },
	},
	api_logs_list: {
		input: {
			query: { per_page: 1, before: 'x', key_id: '64f1a2b3c4d5e6f7a8b9c0d1' },
		},
		response: {
			success: true,
			data: [
				{
					id: 'x',
					time: '2026-01-01T00:00:00Z',
					key_id: 'x',
					key_name: 'x',
					method: 'x',
					path: 'x',
					status_code: 1,
					duration_ms: 0,
					request_body: 'x',
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				pagination: { per_page: 1, has_more: false, next_cursor: 'x' },
			},
		},
		path: '/v2/api-logs',
		options: {
			method: 'GET',
			query: { per_page: 1, before: 'x', key_id: '64f1a2b3c4d5e6f7a8b9c0d1' },
			timeout: 20000,
		},
	},
	rate_limits_get: {
		input: {},
		response: {
			success: true,
			data: {
				tier: 'free',
				plan_name: 'x',
				enforced_channels: ['app'],
				enforced: false,
				buckets: {
					search: {
						limits: { second: 0, minute: 0, day: 0 },
						used: { minute: 0, day: 0 },
						reset: { minute: 0, day: 0 },
					},
					enrich: {
						limits: { second: 0, minute: 0, day: 0 },
						used: { minute: 0, day: 0 },
						reset: { minute: 0, day: 0 },
					},
					jobs: {
						limits: { second: 0, minute: 0, day: 0 },
						used: { minute: 0, day: 0 },
						reset: { minute: 0, day: 0 },
					},
					poll: {
						limits: { second: 0, minute: 0, day: 0 },
						used: { minute: 0, day: 0 },
						reset: { minute: 0, day: 0 },
					},
					email: {
						limits: { second: 0, minute: 0, day: 0 },
						used: { minute: 0, day: 0 },
						reset: { minute: 0, day: 0 },
					},
				},
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/rate-limits',
		options: { method: 'GET', timeout: 20000 },
	},
	companies_lists_remove: {
		input: { body: { list_id: 'x', ids: ['x'] } },
		response: {
			success: true,
			data: { removed: 0 },
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/companies/lists/remove',
		options: {
			method: 'POST',
			body: { list_id: 'x', ids: ['x'] },
			timeout: 20000,
		},
	},
	companies_lists_set: {
		input: {
			headers: { idempotencyKey: 'stable-test-key' },
			body: { list_ids: ['x'] },
		},
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'companies_lists_set',
				status: 'queued',
				total: 0,
				processed: 0,
				progress_percent: 0,
				error: 'x',
				resource_url: 'x',
				created_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
				result: { updated: 0, skipped: 0 },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/companies/lists/set',
		options: {
			method: 'POST',
			body: { list_ids: ['x'] },
			headers: { 'Idempotency-Key': 'stable-test-key' },
			timeout: 20000,
		},
	},
	lists_list: {
		input: {
			query: {
				type: 'people',
				owner: 'x',
				query: 'x',
				sort_by: 'name',
				sort_direction: 'asc',
				include_saved_views: 'true',
				page: 1,
				per_page: 1,
			},
		},
		response: {
			success: true,
			data: [
				{
					id: 'x',
					name: 'x',
					type: 'people',
					records_count: 0,
					last_added_record_at: '2026-01-01T00:00:00Z',
					created_at: '2026-01-01T00:00:00Z',
					updated_at: '2026-01-01T00:00:00Z',
					owner: { id: 'x', first_name: 'x', last_name: 'x', photo_url: 'x' },
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				pagination: { page: 1, per_page: 1, total_pages: 1, total_count: 0 },
				sort_by: 'x',
				sort_direction: 'x',
			},
		},
		path: '/v2/lists',
		options: {
			method: 'GET',
			query: {
				type: 'people',
				owner: 'x',
				query: 'x',
				sort_by: 'name',
				sort_direction: 'asc',
				include_saved_views: 'true',
				page: 1,
				per_page: 1,
			},
			timeout: 20000,
		},
	},
	lists_create: {
		input: { body: { name: 'x', type: 'people' } },
		response: {
			success: true,
			data: {
				id: 'x',
				name: 'x',
				type: 'people',
				records_count: 0,
				last_added_record_at: '2026-01-01T00:00:00Z',
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
				owner: { id: 'x', first_name: 'x', last_name: 'x', photo_url: 'x' },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/lists',
		options: {
			method: 'POST',
			body: { name: 'x', type: 'people' },
			timeout: 20000,
		},
	},
	lists_get: {
		input: { path: { id: 'x' } },
		response: {
			success: true,
			data: {
				id: 'x',
				name: 'x',
				type: 'people',
				records_count: 0,
				last_added_record_at: '2026-01-01T00:00:00Z',
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
				owner: { id: 'x', first_name: 'x', last_name: 'x', photo_url: 'x' },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/lists/x',
		options: { method: 'GET', timeout: 20000 },
	},
	lists_delete: {
		input: {
			path: { id: 'x' },
			query: { with_records: 'true' },
			headers: { idempotencyKey: 'stable-test-key' },
		},
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'list_delete',
				status: 'queued',
				total: 0,
				processed: 0,
				progress_percent: 0,
				error: 'x',
				resource_url: 'x',
				created_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
				result: { list: false, records_deleted: 0 },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/lists/x',
		options: {
			method: 'DELETE',
			query: { with_records: 'true' },
			headers: { 'Idempotency-Key': 'stable-test-key' },
			timeout: 20000,
		},
	},
	lists_update: {
		input: { path: { id: 'x' }, body: { name: 'x' } },
		response: {
			success: true,
			data: {
				id: 'x',
				name: 'x',
				type: 'people',
				records_count: 0,
				last_added_record_at: '2026-01-01T00:00:00Z',
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
				owner: { id: 'x', first_name: 'x', last_name: 'x', photo_url: 'x' },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/lists/x',
		options: { method: 'PATCH', body: { name: 'x' }, timeout: 20000 },
	},
	people_lists_add: {
		input: { body: { list_id: 'x', ids: ['x'] } },
		response: {
			success: true,
			data: { added: 0, items: [{ id: 'x', status: 'added' }] },
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/people/lists/add',
		options: {
			method: 'POST',
			body: { list_id: 'x', ids: ['x'] },
			timeout: 20000,
		},
	},
	people_lists_remove: {
		input: { body: { list_id: 'x', ids: ['x'] } },
		response: {
			success: true,
			data: { removed: 0 },
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/people/lists/remove',
		options: {
			method: 'POST',
			body: { list_id: 'x', ids: ['x'] },
			timeout: 20000,
		},
	},
	people_lists_set: {
		input: {
			headers: { idempotencyKey: 'stable-test-key' },
			body: { list_ids: ['x'] },
		},
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'people_lists_set',
				status: 'queued',
				total: 0,
				processed: 0,
				progress_percent: 0,
				error: 'x',
				resource_url: 'x',
				created_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
				result: { updated: 0, skipped: 0 },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/people/lists/set',
		options: {
			method: 'POST',
			body: { list_ids: ['x'] },
			headers: { 'Idempotency-Key': 'stable-test-key' },
			timeout: 20000,
		},
	},
	companies_export: {
		input: { headers: { idempotencyKey: 'stable-test-key' }, body: {} },
		response: {
			success: true,
			data: { id: 'x', status: 'in_progress', requested: 0 },
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/companies/export',
		options: {
			method: 'POST',
			body: {},
			headers: { 'Idempotency-Key': 'stable-test-key' },
			timeout: 20000,
		},
	},
	exports_get: {
		input: { path: { id: '64f1a2b3c4d5e6f7a8b9c0d1' } },
		response: {
			success: true,
			data: {
				id: 'x',
				name: 'x',
				status: 'in_progress',
				record_type: 'people',
				source: {
					type: 'search',
					list_id: 'x',
					list_name: 'x',
					search_id: 'x',
				},
				scope: 'all',
				file_format: 'csv',
				counts: {
					requested: 0,
					exported: 0,
					with_email: 0,
					withheld_emails: 0,
				},
				total: 0,
				credits: { emails_charged: 0, total: 0 },
				data_file_url: 'https://samplemail.test',
				stopped_reason: 'x',
				created_at: '2026-01-01T00:00:00Z',
				owner: {
					id: 'x',
					first_name: 'x',
					last_name: 'x',
					email: 'person@samplemail.test',
					profile_photo: 'x',
				},
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/exports/64f1a2b3c4d5e6f7a8b9c0d1',
		options: { method: 'GET', timeout: 20000 },
	},
	people_export: {
		input: { headers: { idempotencyKey: 'stable-test-key' }, body: {} },
		response: {
			success: true,
			data: { id: 'x', status: 'in_progress', requested: 0 },
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/people/export',
		options: {
			method: 'POST',
			body: {},
			headers: { 'Idempotency-Key': 'stable-test-key' },
			timeout: 20000,
		},
	},
	jobs_get: {
		input: { path: { id: '64f1a2b3c4d5e6f7a8b9c0d1' } },
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'people_export',
				status: 'queued',
				total: 0,
				processed: 0,
				progress_percent: 0,
				error: 'x',
				resource_url: 'x',
				created_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/jobs/64f1a2b3c4d5e6f7a8b9c0d1',
		options: { method: 'GET', timeout: 20000 },
	},
	companies_enrichments_create: {
		input: {
			headers: { idempotencyKey: 'stable-test-key' },
			body: { data: [{}] },
		},
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'people',
				name: 'x',
				source: 'api',
				status: 'queued',
				stopped_reason: 'x',
				options: { enrich_email: false, enrich_phone: false },
				progress: { percent: 0, done: 0, total: 0 },
				counts: {
					rows: 0,
					matched: 0,
					not_matched: 0,
					invalid: 0,
					emails_found: 0,
					phones_found: 0,
				},
				credits_used: { email: 0, phone: 0 },
				created_at: '2026-01-01T00:00:00Z',
				started_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
				results_expires_at: '2026-01-01T00:00:00Z',
				links: {
					self: 'x',
					job: 'x',
					results: 'x',
					csv: 'https://samplemail.test',
					jsonl: 'https://samplemail.test',
				},
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/companies/enrichments',
		options: {
			method: 'POST',
			body: { data: [{}] },
			headers: { 'Idempotency-Key': 'stable-test-key' },
			timeout: 20000,
		},
	},
	enrichments_list: {
		input: { query: { page: 1, per_page: 1, status: 'queued', source: 'api' } },
		response: {
			success: true,
			data: [
				{
					id: 'x',
					type: 'people',
					name: 'x',
					source: 'api',
					status: 'queued',
					stopped_reason: 'x',
					options: { enrich_email: false, enrich_phone: false },
					progress: { percent: 0, done: 0, total: 0 },
					counts: {
						rows: 0,
						matched: 0,
						not_matched: 0,
						invalid: 0,
						emails_found: 0,
						phones_found: 0,
					},
					credits_used: { email: 0, phone: 0 },
					created_at: '2026-01-01T00:00:00Z',
					started_at: '2026-01-01T00:00:00Z',
					finished_at: '2026-01-01T00:00:00Z',
					results_expires_at: '2026-01-01T00:00:00Z',
					links: {
						self: 'x',
						job: 'x',
						results: 'x',
						csv: 'https://samplemail.test',
						jsonl: 'https://samplemail.test',
					},
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				pagination: { page: 1, per_page: 1, total_pages: 1, total_count: 0 },
			},
		},
		path: '/v2/enrichments',
		options: {
			method: 'GET',
			query: { page: 1, per_page: 1, status: 'queued', source: 'api' },
			timeout: 20000,
		},
	},
	enrichments_get: {
		input: { path: { id: 'x' } },
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'people',
				name: 'x',
				source: 'api',
				status: 'queued',
				stopped_reason: 'x',
				options: { enrich_email: false, enrich_phone: false },
				progress: { percent: 0, done: 0, total: 0 },
				counts: {
					rows: 0,
					matched: 0,
					not_matched: 0,
					invalid: 0,
					emails_found: 0,
					phones_found: 0,
				},
				credits_used: { email: 0, phone: 0 },
				created_at: '2026-01-01T00:00:00Z',
				started_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
				results_expires_at: '2026-01-01T00:00:00Z',
				links: {
					self: 'x',
					job: 'x',
					results: 'x',
					csv: 'https://samplemail.test',
					jsonl: 'https://samplemail.test',
				},
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/enrichments/x',
		options: { method: 'GET', timeout: 20000 },
	},
	enrichments_cancel: {
		input: { path: { id: 'x' } },
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'people',
				name: 'x',
				source: 'api',
				status: 'queued',
				stopped_reason: 'x',
				options: { enrich_email: false, enrich_phone: false },
				progress: { percent: 0, done: 0, total: 0 },
				counts: {
					rows: 0,
					matched: 0,
					not_matched: 0,
					invalid: 0,
					emails_found: 0,
					phones_found: 0,
				},
				credits_used: { email: 0, phone: 0 },
				created_at: '2026-01-01T00:00:00Z',
				started_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
				results_expires_at: '2026-01-01T00:00:00Z',
				links: {
					self: 'x',
					job: 'x',
					results: 'x',
					csv: 'https://samplemail.test',
					jsonl: 'https://samplemail.test',
				},
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/enrichments/x/cancel',
		options: { method: 'POST', timeout: 20000 },
	},
	enrichments_results: {
		input: {
			path: { id: 'x' },
			query: { cursor: 'x', limit: 1, status: 'matched' },
		},
		response: {
			success: true,
			data: [{ identifier: 'x', status: 'matched', input: {} }],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				pagination: { next_cursor: 'x', limit: 1 },
			},
		},
		path: '/v2/enrichments/x/results',
		options: {
			method: 'GET',
			query: { cursor: 'x', limit: 1, status: 'matched' },
			timeout: 20000,
		},
	},
	people_enrichments_create: {
		input: {
			headers: { idempotencyKey: 'stable-test-key' },
			body: { data: [{}] },
		},
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'people',
				name: 'x',
				source: 'api',
				status: 'queued',
				stopped_reason: 'x',
				options: { enrich_email: false, enrich_phone: false },
				progress: { percent: 0, done: 0, total: 0 },
				counts: {
					rows: 0,
					matched: 0,
					not_matched: 0,
					invalid: 0,
					emails_found: 0,
					phones_found: 0,
				},
				credits_used: { email: 0, phone: 0 },
				created_at: '2026-01-01T00:00:00Z',
				started_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
				results_expires_at: '2026-01-01T00:00:00Z',
				links: {
					self: 'x',
					job: 'x',
					results: 'x',
					csv: 'https://samplemail.test',
					jsonl: 'https://samplemail.test',
				},
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/people/enrichments',
		options: {
			method: 'POST',
			body: { data: [{}] },
			headers: { 'Idempotency-Key': 'stable-test-key' },
			timeout: 20000,
		},
	},
	trash_list: {
		input: {
			query: { kind: 'person', search: 'x', since: 'x', page: 1, per_page: 1 },
		},
		response: {
			success: true,
			data: [
				{
					id: 'x',
					kind: 'person',
					name: 'x',
					detail: 'x',
					lists: [{ id: 'x', name: 'x', deleted: false }],
					deleted_by: { id: 'x', name: 'x' },
					deleted_at: '2026-01-01T00:00:00Z',
					expires_at: '2026-01-01T00:00:00Z',
					cascade_of_list: { id: 'x', name: 'x' },
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				pagination: { page: 1, per_page: 1, total_pages: 1, total_count: 0 },
			},
		},
		path: '/v2/trash',
		options: {
			method: 'GET',
			query: { kind: 'person', search: 'x', since: 'x', page: 1, per_page: 1 },
			timeout: 20000,
		},
	},
	trash_companies_add: {
		input: { headers: { idempotencyKey: 'stable-test-key' }, body: {} },
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'companies_delete',
				status: 'queued',
				total: 0,
				processed: 0,
				progress_percent: 0,
				error: 'x',
				resource_url: 'x',
				created_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
				result: { deleted: 0, skipped: 0 },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/trash/companies',
		options: {
			method: 'POST',
			body: {},
			headers: { 'Idempotency-Key': 'stable-test-key' },
			timeout: 20000,
		},
	},
	trash_people_add: {
		input: { headers: { idempotencyKey: 'stable-test-key' }, body: {} },
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'people_delete',
				status: 'queued',
				total: 0,
				processed: 0,
				progress_percent: 0,
				error: 'x',
				resource_url: 'x',
				created_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
				result: { deleted: 0, skipped: 0 },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/trash/people',
		options: {
			method: 'POST',
			body: {},
			headers: { 'Idempotency-Key': 'stable-test-key' },
			timeout: 20000,
		},
	},
	trash_restore: {
		input: {
			headers: { idempotencyKey: 'stable-test-key' },
			body: { kind: 'person' },
		},
		response: {
			success: true,
			data: {
				id: 'x',
				type: 'trash_restore',
				status: 'queued',
				total: 0,
				processed: 0,
				progress_percent: 0,
				error: 'x',
				resource_url: 'x',
				created_at: '2026-01-01T00:00:00Z',
				finished_at: '2026-01-01T00:00:00Z',
				result: { restored: 0, lists_restored: 0, skipped: 0 },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/trash/restore',
		options: {
			method: 'POST',
			body: { kind: 'person' },
			headers: { 'Idempotency-Key': 'stable-test-key' },
			timeout: 20000,
		},
	},
	me_get: {
		input: {},
		response: {
			success: true,
			data: {
				id: 'x',
				email: 'person@samplemail.test',
				pending_email: 'person@samplemail.test',
				first_name: 'x',
				last_name: 'x',
				phone: 'x',
				country: 'x',
				timezone: 'x',
				profile_photo: 'x',
				linkedin_url: 'x',
				email_verified: false,
				phone_verified: false,
				status: 'allowed_payment',
				created_at: '2026-01-01T00:00:00Z',
				workspace: { id: 1, name: 'x', role: 'admin' },
				auth: { channel: 'app', api_key_id: 'x', session_id: 'x' },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/me',
		options: { method: 'GET', timeout: 20000 },
	},
	billing_subscription_get: {
		input: {},
		response: {
			success: true,
			data: {
				status: 'active',
				plan: {
					id: '64f1a2b3c4d5e6f7a8b9c0d1',
					name: 'x',
					price: 1.5,
					currency: 'x',
					is_custom: false,
					credits: { email_search: 1, email_verification: 1, phone_search: 1 },
					wallet_plan_credit: false,
				},
				quantity: 1,
				billing_cycle: {
					id: '64f1a2b3c4d5e6f7a8b9c0d1',
					name: 'x',
					period: 'x',
					discount: 1.5,
				},
				started_at: '2026-01-01T00:00:00Z',
				expires_at: '2026-01-01T00:00:00Z',
				next_plan: {
					id: '64f1a2b3c4d5e6f7a8b9c0d1',
					name: 'x',
					price: 1.5,
					currency: 'x',
					is_custom: false,
					credits: { email_search: 1, email_verification: 1, phone_search: 1 },
					wallet_plan_credit: false,
				},
				phone_addon: {
					status: 'active',
					plan: {
						id: '64f1a2b3c4d5e6f7a8b9c0d1',
						name: 'x',
						price: 1.5,
						currency: 'x',
						is_custom: false,
						credits: {
							email_search: 1,
							email_verification: 1,
							phone_search: 1,
						},
						wallet_plan_credit: false,
					},
					quantity: 1,
				},
				pause: {
					started_at: '2026-01-01T00:00:00Z',
					period_months: 1,
					discount_percent: 1.5,
					resumes_at: '2026-01-01T00:00:00Z',
				},
				discount: { percent: 1.5, status: 'x', months_left: 1 },
				payer: 'individual',
				gateway: 'stripe',
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/billing/subscription',
		options: { method: 'GET', timeout: 20000 },
	},
	credits_get: {
		input: {},
		response: {
			success: true,
			data: {
				email_search: {
					available: 1,
					allowance: 1,
					additional: 1,
					permanent: 1,
				},
				email_verification: {
					available: 1,
					allowance: 1,
					additional: 1,
					permanent: 1,
				},
				phone_search: {
					available: 1,
					allowance: 1,
					additional: 1,
					permanent: 1,
				},
				reset_at: '2026-01-01T00:00:00Z',
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/credits',
		options: { method: 'GET', timeout: 20000 },
	},
	usage_summary_get: {
		input: {
			query: {
				from: '2026-01-01',
				to: '2026-01-01',
				users: '64f1a2b3c4d5e6f7a8b9c0d1',
				channel: 'app',
				action: 'search',
				entity: 'people',
				group_by: 'day',
			},
		},
		response: {
			success: true,
			data: {
				totals: {
					email_search: 0,
					email_verification: 0,
					phone_search: 0,
					email_credits: 0,
					verification_credits: 0,
					phone_credits: 0,
					searches: 0,
					enriches: 0,
					people_searches: 0,
					company_searches: 0,
					people_enriches: 0,
					company_enriches: 0,
					email_finds: 0,
					total_credits: 0,
				},
				series: [
					{
						key: 'x',
						email_search: 0,
						email_verification: 0,
						phone_search: 0,
						email_credits: 0,
						verification_credits: 0,
						phone_credits: 0,
						searches: 0,
						enriches: 0,
						people_searches: 0,
						company_searches: 0,
						people_enriches: 0,
						company_enriches: 0,
						email_finds: 0,
					},
				],
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/usage/summary',
		options: {
			method: 'GET',
			query: {
				from: '2026-01-01',
				to: '2026-01-01',
				users: '64f1a2b3c4d5e6f7a8b9c0d1',
				channel: 'app',
				action: 'search',
				entity: 'people',
				group_by: 'day',
			},
			timeout: 20000,
		},
	},
	blocklist_companies_list: {
		input: { query: { query: 'xx', page: 1, per_page: 1 } },
		response: {
			success: true,
			data: [
				{
					id: '64f1a2b3c4d5e6f7a8b9c0d1',
					domain: 'x',
					created_at: '2026-01-01T00:00:00Z',
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				pagination: { page: 1, per_page: 1, total_pages: 1, total_count: 0 },
			},
		},
		path: '/v2/blocklist/companies',
		options: {
			method: 'GET',
			query: { query: 'xx', page: 1, per_page: 1 },
			timeout: 20000,
		},
	},
	blocklist_companies_delete: {
		input: { path: { id: 'x' } },
		response: {
			success: true,
			data: { deleted_ids: ['64f1a2b3c4d5e6f7a8b9c0d1'] },
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/blocklist/companies/x',
		options: { method: 'DELETE', timeout: 20000 },
	},
	blocklist_companies_add: {
		input: { body: { data: [{ domain: 'x' }] } },
		response: {
			success: true,
			data: {
				added: [
					{
						identifiers: ['x'],
						blocked_company: {
							id: '64f1a2b3c4d5e6f7a8b9c0d1',
							domain: 'x',
							created_at: '2026-01-01T00:00:00Z',
						},
					},
				],
				already_blocked: [
					{
						identifiers: ['x'],
						blocked_company: {
							id: '64f1a2b3c4d5e6f7a8b9c0d1',
							domain: 'x',
							created_at: '2026-01-01T00:00:00Z',
						},
					},
				],
				invalid: [
					{ identifier: 'x', code: 'missing_field', field: 'x', reason: 'x' },
				],
			},
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				total: 1,
				added_count: 0,
				already_blocked_count: 0,
				invalid_count: 0,
			},
		},
		path: '/v2/blocklist/companies/add',
		options: {
			method: 'POST',
			body: { data: [{ domain: 'x' }] },
			timeout: 20000,
		},
	},
	blocklist_people_list: {
		input: { query: { query: 'xx', page: 1, per_page: 1 } },
		response: {
			success: true,
			data: [
				{
					id: '64f1a2b3c4d5e6f7a8b9c0d1',
					first_name: 'x',
					last_name: 'x',
					linkedin_url: 'https://samplemail.test',
					company_domain: 'x',
					created_at: '2026-01-01T00:00:00Z',
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				pagination: { page: 1, per_page: 1, total_pages: 1, total_count: 0 },
			},
		},
		path: '/v2/blocklist/people',
		options: {
			method: 'GET',
			query: { query: 'xx', page: 1, per_page: 1 },
			timeout: 20000,
		},
	},
	blocklist_people_delete: {
		input: { path: { id: 'x' } },
		response: {
			success: true,
			data: { deleted_ids: ['64f1a2b3c4d5e6f7a8b9c0d1'] },
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/blocklist/people/x',
		options: { method: 'DELETE', timeout: 20000 },
	},
	blocklist_people_add: {
		input: { body: { data: [{ first_name: 'x', last_name: 'x' }] } },
		response: {
			success: true,
			data: {
				added: [
					{
						identifiers: ['x'],
						blocked_person: {
							id: '64f1a2b3c4d5e6f7a8b9c0d1',
							first_name: 'x',
							last_name: 'x',
							linkedin_url: 'https://samplemail.test',
							company_domain: 'x',
							created_at: '2026-01-01T00:00:00Z',
						},
					},
				],
				already_blocked: [
					{
						identifiers: ['x'],
						blocked_person: {
							id: '64f1a2b3c4d5e6f7a8b9c0d1',
							first_name: 'x',
							last_name: 'x',
							linkedin_url: 'https://samplemail.test',
							company_domain: 'x',
							created_at: '2026-01-01T00:00:00Z',
						},
					},
				],
				invalid: [
					{ identifier: 'x', code: 'missing_field', field: 'x', reason: 'x' },
				],
			},
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				total: 1,
				added_count: 0,
				already_blocked_count: 0,
				invalid_count: 0,
			},
		},
		path: '/v2/blocklist/people/add',
		options: {
			method: 'POST',
			body: { data: [{ first_name: 'x', last_name: 'x' }] },
			timeout: 20000,
		},
	},
	notifications_list: {
		input: { query: { page: 1, per_page: 1, read: 'true' } },
		response: {
			success: true,
			data: [
				{
					id: '64f1a2b3c4d5e6f7a8b9c0d1',
					workspace_id: 1,
					type: 'x',
					status: 'done',
					title: 'x',
					body: 'x',
					body_format: 'text',
					link: { url: 'x', label: 'x', kind: 'external', file_name: 'x' },
					subject_id: 'x',
					read: false,
					read_at: '2026-01-01T00:00:00Z',
					created_at: '2026-01-01T00:00:00Z',
				},
			],
			metadata: {
				timestamp: '2026-01-01T00:00:00Z',
				pagination: { page: 1, per_page: 1, total_pages: 1, total_count: 0 },
				unread_count: 0,
			},
		},
		path: '/v2/notifications',
		options: {
			method: 'GET',
			query: { page: 1, per_page: 1, read: 'true' },
			timeout: 20000,
		},
	},
	notifications_mark_read: {
		input: { body: {} },
		response: {
			success: true,
			data: { updated_count: 0, unread_count: 0 },
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		},
		path: '/v2/notifications/mark-read',
		options: { method: 'POST', body: {}, timeout: 20000 },
	},
} as const;

// unknown because endpoint outputs differ by operation; every response is parsed before return.
const callers: Record<
	string,
	(ctx: Context, input: object) => Promise<unknown>
> = {
	people_get: (ctx, input) =>
		GetProspectOperations.people.get(
			ctx,
			GetProspectOperationInputSchemas['people_get'].parse(input),
		),
	people_edits_update: (ctx, input) =>
		GetProspectOperations.people.editsUpdate(
			ctx,
			GetProspectOperationInputSchemas['people_edits_update'].parse(input),
		),
	people_bulk_enrich: (ctx, input) =>
		GetProspectOperations.people.bulkEnrich(
			ctx,
			GetProspectOperationInputSchemas['people_bulk_enrich'].parse(input),
		),
	people_calculate_credits: (ctx, input) =>
		GetProspectOperations.people.calculateCredits(
			ctx,
			GetProspectOperationInputSchemas['people_calculate_credits'].parse(input),
		),
	people_count: (ctx, input) =>
		GetProspectOperations.people.count(
			ctx,
			GetProspectOperationInputSchemas['people_count'].parse(input),
		),
	people_enrich: (ctx, input) =>
		GetProspectOperations.people.enrich(
			ctx,
			GetProspectOperationInputSchemas['people_enrich'].parse(input),
		),
	people_enrich_search: (ctx, input) =>
		GetProspectOperations.people.enrichSearch(
			ctx,
			GetProspectOperationInputSchemas['people_enrich_search'].parse(input),
		),
	people_save: (ctx, input) =>
		GetProspectOperations.people.save(
			ctx,
			GetProspectOperationInputSchemas['people_save'].parse(input),
		),
	people_save_search: (ctx, input) =>
		GetProspectOperations.people.saveSearch(
			ctx,
			GetProspectOperationInputSchemas['people_save_search'].parse(input),
		),
	people_search: (ctx, input) =>
		GetProspectOperations.people.search(
			ctx,
			GetProspectOperationInputSchemas['people_search'].parse(input),
		),
	companies_get: (ctx, input) =>
		GetProspectOperations.companies.get(
			ctx,
			GetProspectOperationInputSchemas['companies_get'].parse(input),
		),
	companies_edits_update: (ctx, input) =>
		GetProspectOperations.companies.editsUpdate(
			ctx,
			GetProspectOperationInputSchemas['companies_edits_update'].parse(input),
		),
	companies_bulk_enrich: (ctx, input) =>
		GetProspectOperations.companies.bulkEnrich(
			ctx,
			GetProspectOperationInputSchemas['companies_bulk_enrich'].parse(input),
		),
	companies_enrich: (ctx, input) =>
		GetProspectOperations.companies.enrich(
			ctx,
			GetProspectOperationInputSchemas['companies_enrich'].parse(input),
		),
	companies_save: (ctx, input) =>
		GetProspectOperations.companies.save(
			ctx,
			GetProspectOperationInputSchemas['companies_save'].parse(input),
		),
	companies_search: (ctx, input) =>
		GetProspectOperations.companies.search(
			ctx,
			GetProspectOperationInputSchemas['companies_search'].parse(input),
		),
	email_find_get: (ctx, input) =>
		GetProspectOperations.email.findGet(
			ctx,
			GetProspectOperationInputSchemas['email_find_get'].parse(input),
		),
	email_verifications_list: (ctx, input) =>
		GetProspectOperations.email.verificationsList(
			ctx,
			GetProspectOperationInputSchemas['email_verifications_list'].parse(input),
		),
	email_verifications_create: (ctx, input) =>
		GetProspectOperations.email.verificationsCreate(
			ctx,
			GetProspectOperationInputSchemas['email_verifications_create'].parse(
				input,
			),
		),
	email_verifications_get: (ctx, input) =>
		GetProspectOperations.email.verificationsGet(
			ctx,
			GetProspectOperationInputSchemas['email_verifications_get'].parse(input),
		),
	email_verifications_cancel: (ctx, input) =>
		GetProspectOperations.email.verificationsCancel(
			ctx,
			GetProspectOperationInputSchemas['email_verifications_cancel'].parse(
				input,
			),
		),
	email_verifications_results: (ctx, input) =>
		GetProspectOperations.email.verificationsResults(
			ctx,
			GetProspectOperationInputSchemas['email_verifications_results'].parse(
				input,
			),
		),
	email_verifications_start: (ctx, input) =>
		GetProspectOperations.email.verificationsStart(
			ctx,
			GetProspectOperationInputSchemas['email_verifications_start'].parse(
				input,
			),
		),
	email_verifications_history_list: (ctx, input) =>
		GetProspectOperations.email.verificationsHistoryList(
			ctx,
			GetProspectOperationInputSchemas[
				'email_verifications_history_list'
			].parse(input),
		),
	email_verifications_inspect: (ctx, input) =>
		GetProspectOperations.email.verificationsInspect(
			ctx,
			GetProspectOperationInputSchemas['email_verifications_inspect'].parse(
				input,
			),
		),
	email_verify_get: (ctx, input) =>
		GetProspectOperations.email.verifyGet(
			ctx,
			GetProspectOperationInputSchemas['email_verify_get'].parse(input),
		),
	email_find: (ctx, input) =>
		GetProspectOperations.email.find(
			ctx,
			GetProspectOperationInputSchemas['email_find'].parse(input),
		),
	email_verify: (ctx, input) =>
		GetProspectOperations.email.verify(
			ctx,
			GetProspectOperationInputSchemas['email_verify'].parse(input),
		),
	search_matching_titles: (ctx, input) =>
		GetProspectOperations.search.matchingTitles(
			ctx,
			GetProspectOperationInputSchemas['search_matching_titles'].parse(input),
		),
	search_smart_job_titles: (ctx, input) =>
		GetProspectOperations.search.smartJobTitles(
			ctx,
			GetProspectOperationInputSchemas['search_smart_job_titles'].parse(input),
		),
	search_suggest: (ctx, input) =>
		GetProspectOperations.search.suggest(
			ctx,
			GetProspectOperationInputSchemas['search_suggest'].parse(input),
		),
	enums_list: (ctx, input) =>
		GetProspectOperations.enums.list(
			ctx,
			GetProspectOperationInputSchemas['enums_list'].parse(input),
		),
	enums_get: (ctx, input) =>
		GetProspectOperations.enums.get(
			ctx,
			GetProspectOperationInputSchemas['enums_get'].parse(input),
		),
	api_logs_list: (ctx, input) =>
		GetProspectOperations.developer.apiLogsList(
			ctx,
			GetProspectOperationInputSchemas['api_logs_list'].parse(input),
		),
	rate_limits_get: (ctx, input) =>
		GetProspectOperations.developer.rateLimitsGet(
			ctx,
			GetProspectOperationInputSchemas['rate_limits_get'].parse(input),
		),
	companies_lists_remove: (ctx, input) =>
		GetProspectOperations.lists.companiesListsRemove(
			ctx,
			GetProspectOperationInputSchemas['companies_lists_remove'].parse(input),
		),
	companies_lists_set: (ctx, input) =>
		GetProspectOperations.lists.companiesListsSet(
			ctx,
			GetProspectOperationInputSchemas['companies_lists_set'].parse(input),
		),
	lists_list: (ctx, input) =>
		GetProspectOperations.lists.list(
			ctx,
			GetProspectOperationInputSchemas['lists_list'].parse(input),
		),
	lists_create: (ctx, input) =>
		GetProspectOperations.lists.create(
			ctx,
			GetProspectOperationInputSchemas['lists_create'].parse(input),
		),
	lists_get: (ctx, input) =>
		GetProspectOperations.lists.get(
			ctx,
			GetProspectOperationInputSchemas['lists_get'].parse(input),
		),
	lists_delete: (ctx, input) =>
		GetProspectOperations.lists.delete(
			ctx,
			GetProspectOperationInputSchemas['lists_delete'].parse(input),
		),
	lists_update: (ctx, input) =>
		GetProspectOperations.lists.update(
			ctx,
			GetProspectOperationInputSchemas['lists_update'].parse(input),
		),
	people_lists_add: (ctx, input) =>
		GetProspectOperations.lists.peopleListsAdd(
			ctx,
			GetProspectOperationInputSchemas['people_lists_add'].parse(input),
		),
	people_lists_remove: (ctx, input) =>
		GetProspectOperations.lists.peopleListsRemove(
			ctx,
			GetProspectOperationInputSchemas['people_lists_remove'].parse(input),
		),
	people_lists_set: (ctx, input) =>
		GetProspectOperations.lists.peopleListsSet(
			ctx,
			GetProspectOperationInputSchemas['people_lists_set'].parse(input),
		),
	companies_export: (ctx, input) =>
		GetProspectOperations.exports.companiesExport(
			ctx,
			GetProspectOperationInputSchemas['companies_export'].parse(input),
		),
	exports_get: (ctx, input) =>
		GetProspectOperations.exports.get(
			ctx,
			GetProspectOperationInputSchemas['exports_get'].parse(input),
		),
	people_export: (ctx, input) =>
		GetProspectOperations.exports.peopleExport(
			ctx,
			GetProspectOperationInputSchemas['people_export'].parse(input),
		),
	jobs_get: (ctx, input) =>
		GetProspectOperations.jobs.get(
			ctx,
			GetProspectOperationInputSchemas['jobs_get'].parse(input),
		),
	companies_enrichments_create: (ctx, input) =>
		GetProspectOperations.enrichments.companiesEnrichmentsCreate(
			ctx,
			GetProspectOperationInputSchemas['companies_enrichments_create'].parse(
				input,
			),
		),
	enrichments_list: (ctx, input) =>
		GetProspectOperations.enrichments.list(
			ctx,
			GetProspectOperationInputSchemas['enrichments_list'].parse(input),
		),
	enrichments_get: (ctx, input) =>
		GetProspectOperations.enrichments.get(
			ctx,
			GetProspectOperationInputSchemas['enrichments_get'].parse(input),
		),
	enrichments_cancel: (ctx, input) =>
		GetProspectOperations.enrichments.cancel(
			ctx,
			GetProspectOperationInputSchemas['enrichments_cancel'].parse(input),
		),
	enrichments_results: (ctx, input) =>
		GetProspectOperations.enrichments.results(
			ctx,
			GetProspectOperationInputSchemas['enrichments_results'].parse(input),
		),
	people_enrichments_create: (ctx, input) =>
		GetProspectOperations.enrichments.peopleEnrichmentsCreate(
			ctx,
			GetProspectOperationInputSchemas['people_enrichments_create'].parse(
				input,
			),
		),
	trash_list: (ctx, input) =>
		GetProspectOperations.trash.list(
			ctx,
			GetProspectOperationInputSchemas['trash_list'].parse(input),
		),
	trash_companies_add: (ctx, input) =>
		GetProspectOperations.trash.companiesAdd(
			ctx,
			GetProspectOperationInputSchemas['trash_companies_add'].parse(input),
		),
	trash_people_add: (ctx, input) =>
		GetProspectOperations.trash.peopleAdd(
			ctx,
			GetProspectOperationInputSchemas['trash_people_add'].parse(input),
		),
	trash_restore: (ctx, input) =>
		GetProspectOperations.trash.restore(
			ctx,
			GetProspectOperationInputSchemas['trash_restore'].parse(input),
		),
	me_get: (ctx, input) =>
		GetProspectOperations.account.meGet(
			ctx,
			GetProspectOperationInputSchemas['me_get'].parse(input),
		),
	billing_subscription_get: (ctx, input) =>
		GetProspectOperations.billing.subscriptionGet(
			ctx,
			GetProspectOperationInputSchemas['billing_subscription_get'].parse(input),
		),
	credits_get: (ctx, input) =>
		GetProspectOperations.billing.creditsGet(
			ctx,
			GetProspectOperationInputSchemas['credits_get'].parse(input),
		),
	usage_summary_get: (ctx, input) =>
		GetProspectOperations.billing.usageSummaryGet(
			ctx,
			GetProspectOperationInputSchemas['usage_summary_get'].parse(input),
		),
	blocklist_companies_list: (ctx, input) =>
		GetProspectOperations.blocklist.companiesList(
			ctx,
			GetProspectOperationInputSchemas['blocklist_companies_list'].parse(input),
		),
	blocklist_companies_delete: (ctx, input) =>
		GetProspectOperations.blocklist.companiesDelete(
			ctx,
			GetProspectOperationInputSchemas['blocklist_companies_delete'].parse(
				input,
			),
		),
	blocklist_companies_add: (ctx, input) =>
		GetProspectOperations.blocklist.companiesAdd(
			ctx,
			GetProspectOperationInputSchemas['blocklist_companies_add'].parse(input),
		),
	blocklist_people_list: (ctx, input) =>
		GetProspectOperations.blocklist.peopleList(
			ctx,
			GetProspectOperationInputSchemas['blocklist_people_list'].parse(input),
		),
	blocklist_people_delete: (ctx, input) =>
		GetProspectOperations.blocklist.peopleDelete(
			ctx,
			GetProspectOperationInputSchemas['blocklist_people_delete'].parse(input),
		),
	blocklist_people_add: (ctx, input) =>
		GetProspectOperations.blocklist.peopleAdd(
			ctx,
			GetProspectOperationInputSchemas['blocklist_people_add'].parse(input),
		),
	notifications_list: (ctx, input) =>
		GetProspectOperations.notifications.list(
			ctx,
			GetProspectOperationInputSchemas['notifications_list'].parse(input),
		),
	notifications_mark_read: (ctx, input) =>
		GetProspectOperations.notifications.markRead(
			ctx,
			GetProspectOperationInputSchemas['notifications_mark_read'].parse(input),
		),
};

describe('GetProspect endpoint contract', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
		mockedLog.mockReset();
	});
	it('people_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['people_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_edits_update sends the documented PATCH route and validates the response', async () => {
		const fixture = fixtures['people_edits_update'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_edits_update'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_bulk_enrich sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_bulk_enrich'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_bulk_enrich'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_calculate_credits sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_calculate_credits'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_calculate_credits'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_count sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_count'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_count'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_enrich sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_enrich'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_enrich'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_enrich_search sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_enrich_search'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_enrich_search'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_save sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_save'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_save'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_save_search sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_save_search'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_save_search'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_search sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_search'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_search'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('companies_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['companies_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['companies_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('companies_edits_update sends the documented PATCH route and validates the response', async () => {
		const fixture = fixtures['companies_edits_update'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['companies_edits_update'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('companies_bulk_enrich sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['companies_bulk_enrich'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['companies_bulk_enrich'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('companies_enrich sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['companies_enrich'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['companies_enrich'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('companies_save sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['companies_save'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['companies_save'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('companies_search sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['companies_search'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['companies_search'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('email_find_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['email_find_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['email_find_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('email_verifications_list sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['email_verifications_list'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['email_verifications_list'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('email_verifications_create sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['email_verifications_create'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['email_verifications_create'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('email_verifications_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['email_verifications_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['email_verifications_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('email_verifications_cancel sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['email_verifications_cancel'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['email_verifications_cancel'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('email_verifications_results sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['email_verifications_results'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['email_verifications_results'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('email_verifications_start sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['email_verifications_start'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['email_verifications_start'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('email_verifications_history_list sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['email_verifications_history_list'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['email_verifications_history_list'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('email_verifications_inspect sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['email_verifications_inspect'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['email_verifications_inspect'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('email_verify_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['email_verify_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['email_verify_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('email_find sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['email_find'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['email_find'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('email_verify sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['email_verify'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['email_verify'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('search_matching_titles sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['search_matching_titles'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['search_matching_titles'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('search_smart_job_titles sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['search_smart_job_titles'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['search_smart_job_titles'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('search_suggest sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['search_suggest'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['search_suggest'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('enums_list sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['enums_list'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['enums_list'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('enums_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['enums_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['enums_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('api_logs_list sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['api_logs_list'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['api_logs_list'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('rate_limits_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['rate_limits_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['rate_limits_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('companies_lists_remove sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['companies_lists_remove'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['companies_lists_remove'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('companies_lists_set sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['companies_lists_set'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['companies_lists_set'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('lists_list sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['lists_list'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['lists_list'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('lists_create sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['lists_create'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['lists_create'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('lists_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['lists_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['lists_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('lists_delete sends the documented DELETE route and validates the response', async () => {
		const fixture = fixtures['lists_delete'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['lists_delete'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('lists_update sends the documented PATCH route and validates the response', async () => {
		const fixture = fixtures['lists_update'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['lists_update'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_lists_add sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_lists_add'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_lists_add'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_lists_remove sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_lists_remove'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_lists_remove'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_lists_set sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_lists_set'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_lists_set'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('companies_export sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['companies_export'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['companies_export'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('exports_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['exports_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['exports_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_export sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_export'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_export'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('jobs_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['jobs_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['jobs_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('companies_enrichments_create sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['companies_enrichments_create'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['companies_enrichments_create'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('enrichments_list sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['enrichments_list'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['enrichments_list'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('enrichments_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['enrichments_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['enrichments_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('enrichments_cancel sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['enrichments_cancel'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['enrichments_cancel'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('enrichments_results sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['enrichments_results'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['enrichments_results'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('people_enrichments_create sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['people_enrichments_create'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['people_enrichments_create'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('trash_list sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['trash_list'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['trash_list'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('trash_companies_add sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['trash_companies_add'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['trash_companies_add'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('trash_people_add sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['trash_people_add'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['trash_people_add'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('trash_restore sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['trash_restore'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['trash_restore'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('me_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['me_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['me_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('billing_subscription_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['billing_subscription_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['billing_subscription_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('credits_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['credits_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['credits_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('usage_summary_get sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['usage_summary_get'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['usage_summary_get'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('blocklist_companies_list sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['blocklist_companies_list'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['blocklist_companies_list'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('blocklist_companies_delete sends the documented DELETE route and validates the response', async () => {
		const fixture = fixtures['blocklist_companies_delete'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['blocklist_companies_delete'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('blocklist_companies_add sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['blocklist_companies_add'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['blocklist_companies_add'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('blocklist_people_list sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['blocklist_people_list'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['blocklist_people_list'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('blocklist_people_delete sends the documented DELETE route and validates the response', async () => {
		const fixture = fixtures['blocklist_people_delete'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['blocklist_people_delete'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('blocklist_people_add sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['blocklist_people_add'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['blocklist_people_add'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('notifications_list sends the documented GET route and validates the response', async () => {
		const fixture = fixtures['notifications_list'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['notifications_list'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('notifications_mark_read sends the documented POST route and validates the response', async () => {
		const fixture = fixtures['notifications_mark_read'];
		mockedRequest.mockResolvedValue(fixture.response);
		const caller = callers['notifications_mark_read'];
		if (!caller) throw new Error('Missing endpoint caller');
		const result = await caller(context, fixture.input);
		expect(result).toEqual(fixture.response);
		expect(mockedRequest).toHaveBeenCalledWith(
			fixture.path,
			'test-key',
			fixture.options,
		);
		expect(mockedLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
			'person@samplemail.test',
		);
	});
	it('rejects an undocumented outer field before making a request', () => {
		expect(() =>
			GetProspectOperationInputSchemas.people_get.parse({
				path: { id: '64f1a2b3c4d5e6f7a8b9c0d1' },
				undocumented: true,
			}),
		).toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
