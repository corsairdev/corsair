// Shapes taken from Kommo's API reference
// (https://developers.kommo.com/reference/kommo-api-reference). Timestamps are
// Unix seconds, not ISO strings, which is the detail most likely to be typed
// wrongly.

export const lead = {
	id: 20024930,
	name: 'Lead 1',
	price: 0,
	responsible_user_id: 11087123,
	group_id: 0,
	status_id: 94386187,
	pipeline_id: 12215168,
	loss_reason_id: null,
	created_by: 11087123,
	updated_by: 11087123,
	created_at: 1760976072,
	updated_at: 1760976072,
	closed_at: null,
	closest_task_at: null,
	is_deleted: false,
	score: null,
	account_id: 35379952,
	labor_cost: null,
	is_price_computed: false,
	custom_fields_values: [
		{
			field_id: 1928052,
			field_name: 'Specialty',
			field_code: null,
			field_type: 'select',
			values: [{ value: 'Diagnostic', enum_id: 1669868, enum_code: null }],
			is_computed: false,
		},
		{
			field_id: 1928056,
			field_name: 'Date and time',
			field_code: null,
			field_type: 'date_time',
			values: [{ value: 1723653000 }],
			is_computed: false,
		},
	],
	_embedded: { tags: [], companies: [] },
};

export const leads = {
	_page: 1,
	_links: {
		self: { href: 'https://acme.kommo.com/api/v4/leads?page=1&limit=250' },
	},
	_embedded: {
		leads: [lead, { ...lead, id: 20026102, name: 'Lead 2' }],
	},
};

/** A page Kommo says has another after it. */
export const leadsWithNext = {
	_page: 1,
	_links: {
		self: { href: 'https://acme.kommo.com/api/v4/leads?page=1&limit=2' },
		next: { href: 'https://acme.kommo.com/api/v4/leads?page=2&limit=2' },
	},
	_embedded: {
		leads: [
			{ ...lead, id: 1 },
			{ ...lead, id: 2 },
		],
	},
};

export const leadsCreated = {
	_embedded: {
		leads: [
			{ ...lead, id: 20030001 },
			{ ...lead, id: 20030002 },
		],
	},
};

export const contact = {
	id: 30012345,
	name: 'Jordan Lee',
	first_name: 'Jordan',
	last_name: 'Lee',
	responsible_user_id: 11087123,
	group_id: 0,
	created_by: 11087123,
	updated_by: 11087123,
	created_at: 1760976072,
	updated_at: 1760976072,
	is_deleted: false,
	account_id: 35379952,
	custom_fields_values: [
		{
			field_id: 1928060,
			field_name: 'Phone',
			field_code: 'PHONE',
			field_type: 'multitext',
			values: [{ value: '+15550100', enum_id: null, enum_code: null }],
			is_computed: false,
		},
	],
};

export const contacts = {
	_page: 1,
	_links: { self: { href: 'https://acme.kommo.com/api/v4/contacts?page=1' } },
	_embedded: { contacts: [contact] },
};

export const contactsCreated = {
	_embedded: { contacts: [{ ...contact, id: 30019999 }] },
};

export const company = {
	id: 29610174,
	name: 'Acme Logistics',
	responsible_user_id: 11087123,
	group_id: 0,
	created_by: 11087123,
	updated_by: 11087123,
	created_at: 1760976072,
	updated_at: 1760976072,
	is_deleted: false,
	account_id: 35379952,
	custom_fields_values: [],
};

export const companies = {
	_page: 1,
	_links: { self: { href: 'https://acme.kommo.com/api/v4/companies?page=1' } },
	_embedded: { companies: [company] },
};

export const task = {
	id: 40012345,
	entity_id: 20024930,
	entity_type: 'leads',
	is_completed: false,
	task_type_id: 1,
	text: 'Call about the quote',
	result: { text: null, id: null },
	responsible_user_id: 11087123,
	created_by: 11087123,
	updated_by: 11087123,
	complete_till: 1762000000,
	created_at: 1760976072,
	updated_at: 1760976072,
	account_id: 35379952,
};

export const tasks = {
	_page: 1,
	_links: { self: { href: 'https://acme.kommo.com/api/v4/tasks?page=1' } },
	_embedded: { tasks: [task] },
};

export const tasksCreated = {
	_embedded: { tasks: [{ ...task, id: 40019999 }] },
};

export const pipelines = {
	_embedded: {
		pipelines: [
			{
				id: 12215168,
				name: 'Sales',
				sort: 1,
				is_main: true,
				is_unsorted_on: true,
				is_archive: false,
				account_id: 35379952,
				_embedded: {
					statuses: [
						{
							id: 94386187,
							name: 'Incoming',
							sort: 10,
							color: '#c1c1c1',
							is_editable: false,
							pipeline_id: 12215168,
						},
						{
							id: 94386188,
							name: 'Closed won',
							sort: 20,
							color: '#8be08b',
							is_editable: true,
							pipeline_id: 12215168,
						},
					],
				},
			},
		],
	},
};

export const users = {
	_page: 1,
	_embedded: {
		users: [
			{
				id: 11087123,
				name: 'Priya Raman',
				email: 'priya@acme.example',
				lang: 'en',
				rights: { leads: { view: 'M', edit: 'M' } },
			},
		],
	},
};

export const account = {
	id: 35379952,
	name: 'Acme',
	subdomain: 'acme',
	currency: 'USD',
	country: 'US',
	created_at: 1700000000,
	_embedded: { custom_fields: [] },
};

/** A problem+json body, which is how Kommo answers a failure. */
export const unauthorized = {
	type: 'https://httpstatus.es/401',
	title: 'Unauthorized',
	status: 401,
	detail: 'The access token is invalid or expired',
};

/** A user whose rights do not cover this entity. */
export const forbidden = {
	type: 'https://httpstatus.es/403',
	title: 'Forbidden',
	status: 403,
	detail: 'The user has no access to leads',
};

/** A payload Kommo refused, usually a custom field. */
export const invalidPayload = {
	type: 'https://httpstatus.es/400',
	title: 'Bad Request',
	status: 400,
	detail: 'Custom field 1928052 is not available for this entity',
};

/** The plan does not include the entity. */
export const paymentRequired = {
	type: 'https://httpstatus.es/402',
	title: 'Payment Required',
	status: 402,
	detail: 'This feature is not available on your plan',
};

/** Too many requests. */
export const rateLimited = {
	type: 'https://httpstatus.es/429',
	title: 'Too Many Requests',
	status: 429,
};
