/**
 * Shapes taken from SuiteDash's published OpenAPI document and from responses
 * its documented dummy credentials return, which is the only way to see a real
 * body before an account exists.
 */

export const company = {
	uid: 'e2c43cd3-eb1c-4269-a184-ffd9d26d6ef8',
	role: 'Lead',
	name: 'Schowalter-Parisian',
	phone: '(800) 786-6327',
	// An empty object, not null, when a company has no category.
	category: { name: 'velit', color: '#c05b50', isDefault: false },
	home_phone: null,
	work_phone: null,
	shop_phone: null,
	website: 'http://schoen.com/',
	full_address:
		'35831 Herminia Villages Suite 360\nNorth Annalisemouth, OK 73958-1655',
	address: {},
	primaryContact: {
		uid: '1fe2b1a8-eb42-3557-8380-01552c9ab6ef',
		first_name: 'Columbus',
		last_name: 'Bode',
		name_prefix: 'Mr.',
		email: 'angelina82@keeling.com',
		role: 'Prospect',
	},
	tags: [],
	background_info: null,
	created: '2026-01-30T03:42:05+00:00',
	public_custom_fields: [],
	private_custom_fields: [],
	target_custom_fields: [],
	quizzes: [],
};

export const contact = {
	uid: 'aa454efd-4074-3926-a370-e96cda162aa0',
	role: 'Prospect',
	name_prefix: 'Mr.',
	first_name: 'Matilda',
	last_name: 'Walker',
	email: 'rhoda47@tromp.net',
	active: true,
	full_address: '1654 Corkery Inlet\nBuddyberg, MO 91345-5869',
	address: {
		address_line_1: '497 Jackie Crossing Apt. 190',
		city: 'Chadberg',
		state: 'Rhode Island',
		country: 'United States of America',
		zip: '12458',
	},
	company: null,
	companies: [],
	tags: [],
	created: '2026-01-16T13:06:18+00:00',
	public_custom_fields: [],
};

export const project = {
	uid: '2ff558c3-3eb0-48e1-a3bc-4c7f59dfb02f',
	name: 'Digital Marketing Bundle Project',
	status: 'Active',
	start_date: '2026-02-01',
	end_date: '2026-04-01',
	created: '2026-01-15T10:00:00+00:00',
	info_title_client: 'Your project',
	info_description_client: '<b>Welcome</b>',
	info_description: 'Internal notes',
	client: {
		uid: 'a1',
		full_name: 'Matilda Walker',
		email: 'rhoda47@tromp.net',
	},
	secondary_clients: [],
	teammates: [],
	team: { uid: 't1', name: 'Support' },
	project_custom_fields: [],
};

/** The list meta: paging plus the account's custom field definitions. */
export const pagination = {
	pageSize: 10,
	totalPages: 2,
	totalItems: 15,
	currentPageNumber: 1,
	previousPage: null,
	nextPage: 'https://app.suitedash.com/secure-api/companies?page=2',
};

export const metaAttribute = {
	type: 'string',
	format: null,
	required: false,
	nullable: true,
	allowed_on_action: ['create', 'update'],
	allowed_values: null,
	field_name: 'Project code',
	field_description: 'The internal project code',
};

/** The live 401 body, which names the missing header. */
export const authProblem = {
	success: false,
	message: 'Authorization: required X-Public-ID header is missing or is empty.',
	data: [],
};

/** A 2xx that still reports failure, which SuiteDash does for business errors. */
export const businessFailure = {
	success: false,
	message: 'The company was not found',
	data: [],
};

/** `GET /company/meta`, live 11-16 (trial): a bare attribute map, no envelope. */
export const companyMetaLive = {
	uid: {
		type: 'string',
		format: 'uuid',
		required: false,
		nullable: false,
		allowed_on_action: ['read'],
	},
	role: {
		type: 'string',
		required: true,
		nullable: false,
		allowed_on_action: ['read', 'create'],
		allowed_values: ['Lead', 'Prospect', 'Client'],
		field_name: 'Role',
	},
	name: {
		type: 'string',
		required: true,
		nullable: false,
		allowed_on_action: ['read', 'create', 'update'],
		field_name: 'Name',
	},
};
