// Response bodies copied from the examples in the official OpenAPI spec at
// https://docs.mocoapp.com/api/docs/v1, with made-up people and companies.

export const sessionVerify = {
	id: 933590696,
	uuid: '7a60719d-912d-43e4-a1dc-7480effb4db0',
};

export const activity = {
	id: 654321,
	date: '2026-04-09',
	hours: 1.5,
	description: 'Kickoff call',
	billed: false,
	billable: true,
	invoice_id: null,
	tag: 'support',
	project: {
		id: 1234567,
		identifier: 'P-100',
		name: 'Website Relaunch',
		billable: true,
	},
	task: { id: 7536, name: 'Project Management', billable: true },
	customer: { id: 889, name: 'Beachy' },
	user: { id: 933590696, firstname: 'Michael', lastname: 'Mustermann' },
	seconds: 5400,
	worked_seconds: 5400,
	created_at: '2026-04-09T15:00:00Z',
	updated_at: '2026-04-09T15:00:00Z',
};

export const project = {
	id: 1234567,
	identifier: 'P-100',
	name: 'Website Relaunch',
	active: true,
	billable: true,
	currency: 'EUR',
	budget: 50000,
	info: '',
	tags: ['web'],
	leader: { id: 933590696, firstname: 'Michael', lastname: 'Mustermann' },
	customer: { id: 889, name: 'Beachy' },
	created_at: '2026-01-15T08:00:00Z',
	updated_at: '2026-04-01T12:30:00Z',
};

export const projectReport = {
	budget_total: 50000,
	budget_progress_in_percentage: 50,
	budget_remaining: 25000,
	invoiced_total: 27885,
	currency: 'EUR',
	hours_total: 1500,
	hours_billable: 1340,
	costs_by_task: [
		{
			id: 7536,
			name: 'Project Management',
			hours_total: 12.5,
			total_costs: 725,
		},
	],
};

export const company = {
	id: 889,
	type: 'customer',
	identifier: 'BEA',
	name: 'Beachy',
	email: 'info@beachy.example',
	country_code: 'DE',
	tags: [],
	custom_properties: {},
	active: true,
	currency: 'EUR',
	created_at: '2025-11-02T10:00:00Z',
	updated_at: '2026-03-20T09:00:00Z',
};

export const contact = {
	id: 4471,
	gender: 'F',
	firstname: 'Jana',
	lastname: 'Berger',
	work_email: 'jana.berger@beachy.example',
	work_phone: '+49 30 111 22 33',
	tags: [],
	custom_properties: {},
	company: { id: 889, name: 'Beachy' },
	created_at: '2025-12-01T10:00:00Z',
	updated_at: '2026-02-10T09:00:00Z',
};

export const deal = {
	id: 991,
	name: 'Website Relaunch',
	status: 'pending',
	money: 50000,
	currency: 'EUR',
	tags: [],
	custom_properties: {},
	user: { id: 933590696, firstname: 'Michael', lastname: 'Mustermann' },
	category: { id: 12, name: 'Web projects' },
	created_at: '2026-01-10T10:00:00Z',
	updated_at: '2026-01-15T10:00:00Z',
};

export const invoice = {
	id: 777001,
	customer_id: 889,
	project_id: 1234567,
	identifier: '2026-0042',
	date: '2026-04-01',
	due_date: '2026-05-01',
	status: 'created',
	title: 'Website Relaunch',
	currency: 'EUR',
	net_total: 10000,
	tax: 1900,
	gross_total: 11900,
	locked: false,
	tags: [],
	created_at: '2026-04-01T08:00:00Z',
	updated_at: '2026-04-01T08:00:00Z',
};

export const invoiceDetail = {
	...invoice,
	salutation: '',
	footer: '',
	items: [
		{
			id: 555001,
			position: 1,
			unit: null,
			quantity: 10,
			description: 'Project management',
			rate: 1000,
			total: 10000,
			tax: 19,
			type: 'Expenses/Services',
		},
	],
	payments: [],
	reminders: [],
	activity_hours_modified: false,
};

export const mocoUser = {
	id: 933590696,
	firstname: 'Michael',
	lastname: 'Mustermann',
	active: true,
	extern: false,
	email: 'michael@example.com',
	tags: ['Lead'],
	custom_properties: { CostCenter: 100 },
	created_at: '2024-06-01T08:00:00Z',
	updated_at: '2026-03-01T08:00:00Z',
};

export const profile = {
	id: 933590696,
	uuid: '7a60719d-912d-43e4-a1dc-7480effb4db0',
	firstname: 'Michael',
	lastname: 'Mustermann',
	email: 'michael@example.com',
	language: 'de',
	created_at: '2024-06-01T08:00:00Z',
	updated_at: '2026-03-01T08:00:00Z',
};

/** A 422 validation body, per the spec's ErrorList. */
export const validationErrors = {
	errors: {
		name: ["can't be blank"],
	},
};

/** The probed 401 body for a bad key or unknown subdomain. */
export const unauthorized = { message: 'Subdomain does not exist.' };
