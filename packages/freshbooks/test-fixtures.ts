// Response bodies from the FreshBooks doc examples (freshbooks.com/api) and
// the identity model page, with FreshBooks' own sample accounts and people.
// The probes could not capture authenticated bodies (the accounting family
// resolves the account before auth), so these are the documented shapes.

export const ACCOUNT_ID = 'LJArJ4';
export const BUSINESS_ID = 77128;

export const clientRecord = {
	accounting_systemid: 'LJArJ4',
	allow_email_include_pdf: false,
	allow_late_fees: true,
	allow_late_notifications: true,
	bus_phone: '',
	company_industry: null,
	company_size: null,
	currency_code: 'USD',
	direct_link_token: null,
	email: 'email1@freshbooks.com',
	exceeds_client_limit: 0,
	fax: '',
	fname: 'first1',
	has_retainer: null,
	home_phone: null,
	id: 238951,
	language: 'en',
	last_activity: null,
	last_login: null,
	level: 0,
	lname: 'last1',
	mob_phone: '',
	note: null,
	notified: false,
	num_logins: 0,
	organization: 'Company 1',
	p_city: '',
	p_code: '',
	p_country: '',
	p_province: '',
	p_street: '',
	p_street2: '',
	vat_name: null,
	vat_number: null,
};

export const invoiceRecord = {
	accountid: 'LJArJ4',
	accounting_systemid: 'LJArJ4',
	address: '',
	amount: { amount: '104.50', code: 'CAD' },
	auto_bill: false,
	autobill_status: null,
	create_date: '2019-01-28',
	create_source: 'App',
	created_at: '2019-01-28T15:15:45Z',
	currency_code: 'CAD',
	current_organization: 'Rocket Player Inc.',
	customerid: 960771,
	due_date: '2019-02-27',
	deposit_percentage: null,
	deposit_status: 'none',
	discount_total: { amount: '0.00', code: 'CAD' },
	dispute_status: null,
	due_offset_days: 30,
	generation_date: null,
	id: 152429,
	invoice_number: '0000003',
	invoice_profile: false,
	language: 'en',
	last_notified: null,
	lines: [],
	notes: '',
	ownerid: 1,
	outstanding: { amount: '104.50', code: 'CAD' },
	payment_status: 'none',
	po_number: null,
	province: 'Kansas',
	status: 1,
	terms: '',
	total: { amount: '104.50', code: 'CAD' },
	unpaid: { amount: '104.50', code: 'CAD' },
	v3_status: 'new',
	vat_name: null,
	vat_number: '',
	vis_state: 0,
};

export const estimateRecord = {
	accounting_systemid: 'LJArJ4',
	create_date: '2019-01-28',
	created_at: '2019-01-28T15:20:12Z',
	current_organization: 'Rocket Player Inc.',
	customerid: 960771,
	description: '',
	discount_total: { amount: '0.00', code: 'CAD' },
	display_status: 'draft',
	estimate_number: '0000002',
	id: 152430,
	invoiced: false,
	notes: '',
	ownerid: 1,
	reply_status: null,
	sent: '2019-01-28',
	status: 1,
	terms: null,
	ui_status: 'sent',
	updated: '2019-01-28T15:22:04Z',
	vat_name: null,
	vat_number: null,
	vis_state: 0,
};

export const expenseRecord = {
	account_name: '',
	accountid: 'LJArJ4',
	accounting_systemid: 'LJArJ4',
	amount: { amount: '39.991', code: 'USD' },
	bank_name: null,
	categoryid: 50104404,
	clientid: null,
	date: '2009-11-24',
	expenseid: 123456,
	ext_systemid: 'HELPDESK',
	has_receipt: false,
	id: 123456,
	invoiceid: null,
	isduplicate: false,
	markup_percent: 0,
	notes: 'Internet service bill',
	profileid: null,
	projectid: 0,
	staffid: 1,
	status: 0,
	transactionid: null,
	updated: '2009-11-24T00:00:00Z',
	vendor: 'Internet Co.',
	vis_state: 0,
};

export const taskRecord = {
	billable: true,
	description: 'Piloting based on expectations of the executive',
	id: 159361,
	name: 'Piloting',
	rate: { amount: '100.00', code: 'CAD' },
	taskid: 159361,
	tax1: 0,
	tax2: 0,
	tdesc: 'Piloting based on expectations of the executive',
	tname: 'Piloting',
	updated: '2017-07-24 09:39:21',
	vis_state: 0,
};

export const projectRecord = {
	active: true,
	budget: '500.00',
	business_id: 77128,
	complete: false,
	description: '',
	due_date: null,
	fixed_price: '500',
	group: {
		id: 439081,
		members: [
			{
				company: 'BillSpring',
				identity_id: 712052,
				role: 'owner',
			},
		],
		pending_invitations: null,
	},
	id: 779803,
	internal_budget: null,
	links: {
		self: '/service/comments/projects/779803',
		threads: '/service/comments/projects/779803/threads',
	},
	project_type: 'fixed_price',
	services: [
		{
			id: 34912,
			name: 'Consulting',
			billable: true,
			rate: '100.00',
		},
	],
	title: 'My Cool Project',
	updated_at: '2016-08-16T18:03:28Z',
};

export const timeEntryRecord = {
	active: true,
	client_id: 2227125,
	duration: 30,
	id: 5095,
	identity_id: 8804571,
	is_logged: true,
	note: 'Things',
	project_id: 153125,
	started_at: '2016-08-16T18:03:28Z',
	timer: { id: 2936, is_running: false },
};

export const identity = {
	id: 712052,
	first_name: 'Bruce',
	last_name: 'Wayne',
	email: 'b@example.com',
	confirmed_at: '2016-01-26T16:01:23Z',
	created_at: '2016-01-26T16:00:41Z',
	setup_complete: true,
	business_memberships: [
		{
			id: 168372,
			role: 'owner',
			business: {
				id: 77128,
				name: 'BillSpring',
				account_id: 'zDmNq',
				phone_number: null,
			},
		},
		{
			id: 1570108,
			role: 'manager',
			business: {
				id: 311394,
				name: 'another_bruce',
				account_id: 'e6Wmk',
				phone_number: null,
			},
		},
	],
	roles: [],
};

/** The auth family wraps the identity in `response`, with no result key. */
export const usersMeResponse = { response: identity };

export function accountingList(
	resource: string,
	records: unknown[],
	page = 1,
	pages = 1,
	perPage = 15,
	total = records.length,
) {
	return {
		response: {
			result: {
				[resource]: records,
				page,
				pages,
				per_page: perPage,
				total,
			},
		},
	};
}

export const clientsListResponse = accountingList('clients', [clientRecord]);
export const invoicesListResponse = accountingList('invoices', [invoiceRecord]);
export const estimatesListResponse = accountingList('estimates', [
	estimateRecord,
]);
export const expensesListResponse = accountingList('expenses', [expenseRecord]);
export const tasksListResponse = accountingList('tasks', [taskRecord]);

export const projectsListResponse = {
	projects: [projectRecord],
	meta: { per_page: 15, total: 7, page: 0, pages: 1 },
};

export const timeEntriesListResponse = {
	time_entries: [timeEntryRecord],
	meta: {
		pages: 1,
		total_logged: 30,
		total_unbilled: 30,
		per_page: 15,
		total: 1,
		page: 1,
	},
};

/** The projects and timetracking families answer bare. */
export const projectResponse = { project: projectRecord };
export const timeEntryResponse = { time_entry: timeEntryRecord };

/** projects.delete answers an empty response wrapper (docs). */
export const projectsDeleteResponse = { response: {} };

/** Accounting errors: `{ response: { errors: [{ errno, message }] } }`. */
export function accountingError(errno: number, message: string) {
	return { response: { errors: [{ errno, message }] } };
}

/** Probe 01: the wall every unauthenticated accounting probe hits. */
export const accountNotFound = accountingError(404, 'Account not found');

/** Probe (projects family, 401). */
export const bareAuthError = {
	error: 'Authentication is required to complete this request.',
};

/** Probe 09 (projects family, 404 with a non-numeric business id). */
export const bareRouteMiss = {
	message: 'The requested URL was not found on the server.',
};

/** The auth family's OAuth2 error body (probe 27). */
export const oauthError = {
	error: 'unauthenticated',
	error_description:
		'This action requires authentication to continue.',
};
