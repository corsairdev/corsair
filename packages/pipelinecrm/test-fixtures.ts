/**
 * Response fixtures shaped after the Pipeline CRM API docs
 * (app.pipelinecrm.com/llms/*.md).
 */

export const unknownApiKey = { error: 'Unknown api_key' };
export const rateLimited = { error: 'Rate limit exceeded' };

export const pagination = { page: 1, per_page: 1, total: 1 };

export const deal = {
	id: 4521,
	name: 'Acme renewal',
	summary: 'Q4 renewal',
	user_id: 13,
	status: 1,
	expected_close_date: '2026-12-31',
	closed_time: null,
	is_archived: false,
	value: '12000.0',
	primary_contact_id: 900,
	person_ids: [900],
	shared_user_ids: [],
	company_id: 77,
	company_name: 'Acme Corporation',
	probability: 60,
	deal_stage_id: 3,
	deal_stage_name: 'Negotiation',
	deal_loss_reason_id: null,
	deal_won_reason_id: null,
	deal_source: null,
	tag_ids: [],
	custom_fields: { custom_label_4821: 'VIP' },
	owner: { id: 13, name: 'Jane Doe' },
	created_at: '2026-10-01 09:00:00',
	updated_at: '2026-11-01 10:00:00',
};

export const dealsList = { entries: [deal], pagination };

export const person = {
	id: 900,
	first_name: 'John',
	last_name: 'Doe',
	full_name: 'John Doe',
	summary: null,
	phone: '+1 555 0100',
	email: 'john@acme.com',
	position: 'CTO',
	website: 'https://acme.com',
	company_id: 77,
	company_name: 'Acme Corporation',
	user_id: 13,
	lead_status_id: 1,
	lead_source_id: 2,
	custom_fields: {},
	created_at: '2026-10-01 09:00:00',
	updated_at: '2026-11-01 10:00:00',
};

export const peopleList = { entries: [person], pagination };

export const company = {
	id: 77,
	name: 'Acme Corporation',
	description: 'The customer',
	email: 'info@acme.com',
	web: 'https://acme.com',
	address_1: '1 Main St',
	city: 'Austin',
	state: 'TX',
	postal_code: '78701',
	country: 'USA',
	phone1: '+1 555 0111',
	custom_fields: {},
	user_id: 13,
	created_at: '2026-10-01 09:00:00',
	updated_at: '2026-11-01 10:00:00',
};

export const companiesList = { entries: [company], pagination };

export const note = {
	id: 5001,
	title: 'Call summary',
	content: 'Discussed renewal terms.',
	user_id: 13,
	deal_id: 4521,
	company_id: null,
	person_id: null,
	note_category_id: null,
	notify_user_ids: [],
	created_at: '2026-11-01 10:00:00',
	updated_at: '2026-11-01 10:00:00',
};

export const notesList = { entries: [note], pagination };

export const stageTotal = {
	deal_stage_id: 3,
	deal_stage_name: 'Negotiation',
	count: 12,
	total: '48000.0',
};

export const pipelineUser = {
	id: 13,
	email: 'jane@acme.com',
	name: 'Jane Doe',
	first_name: 'Jane',
	last_name: 'Doe',
	work_phone: '+1 555 0122',
	mobile: null,
	admin: true,
	created_at: '2025-01-01 08:00:00',
	updated_at: '2026-11-01 08:00:00',
};

export const usersList = { entries: [pipelineUser], pagination };
