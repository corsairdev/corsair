/**
 * Response bodies for the tests, from
 * https://www.remoteretrieval.com/api-integration and the live refusals captured
 * from https://www.remoteretrieval.com/api/v1.
 */

export const VALIDATED = {
	message: 'Valid Key!',
	email: 'abc@example.com',
	status: 'Success',
	response_code: 200,
};

export const ORDER_CREATED = {
	// A string, not a number, as the docs sample shows.
	order: '212',
	message: 'Order has created!',
	status: 'Success',
	response_code: 200,
};

/** A list row: the employee and company use the short address field names. */
export const ORDER_VIEW = {
	order_id: 209,
	employee_info: {
		email: 'kennethdavis@example.com',
		name: 'Kenneth Davis',
		address_line_1: '1734 Steele Street',
		address_line_2: '1734 Steele Street',
		city: 'Arlington Heights',
		state: 'IL',
		zip: '60005',
	},
	company_info: {
		email: 'it-team@example.com',
		name: 'Dorothy Buchanan',
		address_line_1: '4522 Hanover Street',
		address_line_2: '',
		city: 'New York',
		state: 'NY',
		zip: '10016',
	},
	shipments: {
		device_type: 'Laptop',
		send_status: '---',
		return_status: '---',
	},
};

export const ORDERS_PENDING = [ORDER_VIEW];

export const ORDERS_INPROGRESS = [
	{
		...ORDER_VIEW,
		shipments: {
			device_type: 'Laptop',
			send_status: 'TRANSIT',
			return_status: 'TRANSIT',
		},
	},
];

/** `/orders` is the one list route with a pagination envelope. */
export const ORDERS_ALL = {
	next: null,
	previous: null,
	results: [
		{
			order_id: 220,
			payment_status: 'Completed',
			order_status: 'Ship to Company: DELIVERED ',
			employee_info: {
				email: 'jycypa@example.com',
				name: 'Fay Mooney',
				address_line_1: '1734 Steele Street',
				address_line_2: '',
				city: 'Arlington Heights',
				state: 'IL',
				zip: '60005',
			},
			company_info: {
				email: 'it-team@example.com',
				name: 'Dorothy Buchanan',
				address_line_1: '4522 Hanover Street',
				address_line_2: '',
				city: 'New York',
				state: 'NY',
				zip: '10016',
			},
			shipments: {
				device_type: 'Laptop',
				send_status: 'DELIVERED',
				return_status: 'DELIVERED',
			},
		},
	],
};

export const ORDERS_ALL_WITH_NEXT = {
	...ORDERS_ALL,
	next: 'https://www.remoteretrieval.com/api/v1/orders?cursor=abc',
};

export const ORDERS_PENDING_PAYMENT = {
	next: null,
	previous: null,
	results: [
		{
			...ORDERS_ALL.results[0],
			payment_status: 'Pending',
			order_status: 'Ship to Employee: Pending',
		},
	],
};

/** `device_returns` answers an array even for a single id. */
export const ORDER_DETAIL = [
	{
		order_id: 148,
		employee_info: {
			email: 'rakygotoh@example.com',
			name: 'Nora Navarro',
			address_line_1: '668 Stony Hill Road',
			address_line_2: 'Suite 11',
			city: 'Yardley',
			state: 'PA',
			zip: '19067',
		},
		company_info: {
			email: 'support@example.com',
			name: 'Remote Retrieval',
			address_line_1: '668 Stony Hill Road',
			address_line_2: 'Suite 11',
			city: 'Yardley',
			state: 'PA',
			zip: '19067',
		},
		shipments: {
			device_type: 'Laptop',
			send_status: 'TRANSIT',
			return_status: 'TRANSIT',
		},
	},
];

export const COMPANY = {
	company_name: 'company HB',
	company_email: 'abc@example.com',
	address_1: 'abc address 123',
	address_2: null,
	city: 'East Brunswick',
	state: 'NJ',
	zip: '08816',
	// Not ISO 8601, which is what the API sends.
	created_date: '24-Jun-2024',
};

export const PRICES = [
	{ equipment_type: 'Laptop', order_amount: 77, option_lbl: 'Laptop($77)' },
	{ equipment_type: 'Monitor', order_amount: 99, option_lbl: 'Monitor($99)' },
	{
		equipment_type: 'Monitor_27',
		order_amount: 149,
		option_lbl: 'Monitor_27($149)',
	},
	{ equipment_type: 'Tablet', order_amount: 59, option_lbl: 'Tablet($59)' },
	{
		equipment_type: 'Cell Phone',
		order_amount: 59,
		option_lbl: 'Cell Phone($59)',
	},
];

/** The documented create request, used as a fixture for the input side. */
export const EMPLOYEE = {
	email: 'kennethdavis@example.com',
	name: 'Kenneth Davis',
	address_line_1: '1734 Steele Street',
	address_line_2: 'Apt 10A',
	address_city: 'Houston',
	address_state: 'TX',
	address_country: 'United States',
	address_zip: '77001',
	phone: '1231231234',
};

export const COMPANY_INFO = {
	return_person_name: 'Dorothy Buchanan',
	return_company_name: 'BigCo',
	return_address_line_1: '4522 Hanover Street',
	return_address_line_2: 'Ste 120',
	return_address_city: 'San Antonio',
	return_address_state: 'TX',
	return_address_country: 'United States',
	return_address_zip: '78015',
	email: 'it-team@example.com',
	phone: '1231231234',
};

export const NEW_EMPLOYEE = {
	first_name: 'Jane',
	last_name: 'Roe',
	phone: '1231231234',
	email: 'jane@example.com',
	address_line_1: '1 New Street',
	address_city: 'Austin',
	address_state: 'TX',
	address_zip: '73301',
	address_country: 'United States',
	newemp_msg: 'Your new laptop is on its way.',
};

export const ORDER = {
	type_of_equipment: 'Laptop',
	order_type: 'Return To Company',
	employee_info: EMPLOYEE,
	company_info: COMPANY_INFO,
};

// Live: a missing key and a wrong key both answer this.
export const INVALID_KEY = {
	message: 'Invalid Key!',
	status: 'Fail',
	code: 401,
	custom_code: 401,
};

// A failure that arrives with a 200, which the client must still throw.
export const FAILED_IN_BODY = {
	message: 'Order could not be created.',
	status: 'Fail',
	code: 422,
	custom_code: 422,
};

export const NOT_FOUND = {
	message: 'Order not found.',
	status: 'Fail',
	code: 404,
	custom_code: 404,
};

export const SERVER_ERROR = {
	message: 'Server error.',
	status: 'Fail',
	code: 500,
	custom_code: 500,
};
