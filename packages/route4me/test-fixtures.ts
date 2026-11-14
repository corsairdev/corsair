// Fixtures are built from the OpenAPI definitions Route4Me publishes inside
// each reference page (https://integrate.route4me.com/llms.txt), and from the
// live error envelopes both generations answer with.

export const ROUTE_ID = '9F86D081884C7D659A2FEAA0C55AD015';
export const OPTIMIZATION_ID = 'B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5';
export const VEHICLE_ID = 'AA11BB22CC33DD44EE55FF6677889900';
export const ADDRESS_ID = 123456789;
export const ORDER_ID = 445566;

/** v4's envelope, verbatim from a live call with a bad key. */
export const V4_AUTH_ERROR = {
	errors: ['Invalid API key'],
	timestamp: 1794344670,
	error_code: 401,
};

/** v5's envelope, verbatim from a live call with a bad key. */
export const V5_AUTH_ERROR = {
	status: false,
	exit_code: 1,
	error: 'Unauthenticated',
	code: 401,
	messages: ['Unauthenticated'],
};

/** v5's 404 envelope, which is a different shape again: no `status` field. */
export const V5_NOT_FOUND = {
	status: false,
	exit_code: 1,
	error:
		"Sorry, we can't find this page, this URL does not exist or is no longer available.",
	code: 404,
	messages: [
		"Sorry, we can't find this page, this URL does not exist or is no longer available.",
	],
};

/** v5's 406 validation envelope. */
export const V5_VALIDATION_ERROR = {
	status: false,
	exit_code: 1,
	error: 'The given data was invalid.',
	code: 406,
	messages: ['The display field must be one of all, routed, unrouted.'],
};

export const ROUTE = {
	route_id: ROUTE_ID,
	route_name: 'Amsterdam deliveries',
	route_created_unix: 1794344670,
	optimization_problem_id: OPTIMIZATION_ID,
	updated_timestamp: 1794344770,
	approved_to_execute: true,
	destination_count: 15,
	visited_count: 3,
	vehicle_id: VEHICLE_ID,
	vehicle_alias: 'Van 1',
	driver_alias: 'Sam',
	member_id: 424242,
	owner_email: 'owner@example.com',
	trip_distance: 42.7,
	actual_travel_distance: 12.5,
	actual_travel_time: 1800,
	route_progress: 20,
	route_status: 'started',
	route_status_id: 2,
	weight: 120.5,
	cube: 2.5,
	pieces: 30,
	revenue: 980,
	cost: 240.25,
	planned_destinations: 15,
	done_destinations: 3,
	failed_destinations: 0,
	skipped_destinations: 1,
	destinations_arrived_on_time: 2,
	destinations_arrived_early: 1,
	destinations_arrived_late: 0,
	planned_total_route_duration: 7200,
	planned_total_service_time: 3600,
	has_directions: true,
	is_unrouted: false,
	facility_ids: ['facility-1'],
	depot_timezone: 'Europe/Amsterdam',
};

export const ROUTE_PAGE = {
	data: [ROUTE],
	links: { first: null, last: null, prev: null, next: null },
	meta: {
		current_page: 1,
		from: 1,
		last_page: 1,
		per_page: 50,
		to: 1,
		total: 1,
	},
};

export const ROUTE_PAGE_MORE = {
	data: [ROUTE],
	links: { first: null, last: null, prev: null, next: 'x' },
	meta: {
		current_page: 1,
		from: 1,
		last_page: 3,
		per_page: 1,
		to: 1,
		total: 3,
	},
};

export const ROUTE_DETAIL = {
	route_id: ROUTE_ID,
	route_name: 'Amsterdam deliveries',
	optimization_problem_id: OPTIMIZATION_ID,
	route_status: 'started',
	approved_to_execute: true,
	driver_alias: 'Sam',
	vehicle_alias: 'Van 1',
	member_id: 424242,
	destination_count: 2,
	visited_count: 1,
	trip_distance: 15.2,
	actual_travel_distance: 8.4,
	route_created_unix: 1794344670,
	total_weight: 42.5,
	total_cube: 1.2,
	total_pieces: 8,
	total_revenue: 320,
	addresses: [
		{
			address_id: ADDRESS_ID,
			route_destination_id: 98765,
			address: 'Damrak 1, Amsterdam',
			alias: 'Depot',
			cached_lat: 52.373066,
			cached_lng: 4.856445,
			sequence_no: 0,
			is_depot: true,
			visited: 1,
			status: 'done',
			// A per-stop custom map is caller-defined, so it stays open.
			custom_fields: { door_code: '1234' },
		},
		{
			address_id: ADDRESS_ID + 1,
			route_destination_id: 98766,
			address: 'Prinsengracht 100, Amsterdam',
			cached_lat: 52.373066,
			cached_lng: 4.886445,
			sequence_no: 1,
			is_depot: false,
			visited: 0,
			status: 'pending',
			time_window_start: 1794348000,
			time_window_end: 1794351600,
			service_time: 300,
		},
	],
	directions: [
		{
			distance: 1.2,
			duration: 180,
			direction: 'Head north on Damrak',
			maneuver_type: 'depart',
		},
	],
	route_custom_data: { shift: 'morning' },
};

export const ORDER = {
	order_id: ORDER_ID,
	order_uuid: '0f1e2d3c-4b5a-6978-8796-a5b4c3d2e1f0',
	member_id: 424242,
	root_member_id: 424242,
	address_1: 'Prinsengracht 100',
	address_alias: 'Canal stop',
	address_city: 'Amsterdam',
	address_state_id: 'NH',
	address_zip: '1015 EA',
	cached_lat: 52.373066,
	cached_lng: 4.886445,
	first_name: 'Jordan',
	last_name: 'Lee',
	email: 'jordan@example.com',
	phone: '+31 20 555 0100',
	tracking_number: 'TRACK-1',
	group: 'north',
	priority: 1,
	last_status: 0,
	address_stop_type: 'DELIVERY',
	weight: 12.5,
	pieces: 2,
	revenue: 89.9,
	in_route_count: 0,
	visited_count: 0,
	created_timestamp: 1794344670,
	updated_timestamp: 1794344670,
	created_date: '2026-11-10',
	territory_ids: ['territory-1'],
	// OrderResource declares this as an array of strings, not of objects.
	custom_data: ['pallet:A'],
	workflow_uuid: ['B97C1D2E3F4A5B6C7D8E9F0A1B2C3D4E'],
};

export const ORDER_PAGE = {
	data: [ORDER],
	links: { first: null, last: null, prev: null, next: null },
	meta: {
		current_page: 0,
		from: 0,
		last_page: 0,
		per_page: 50,
		to: 0,
		total: 1,
	},
};

export const CREATED_ORDER = {
	order_id: ORDER_ID,
	order_uuid: '0f1e2d3c-4b5a-6978-8796-a5b4c3d2e1f0',
	address_1: 'Prinsengracht 100',
	address_alias: 'Canal stop',
	created_timestamp: 1794344670,
};

export const VEHICLE = {
	vehicle_id: VEHICLE_ID,
	member_id: 424242,
	root_member_id: 424242,
	is_deleted: false,
	vehicle_alias: 'Van 1',
	vehicle_vin: '1HGCM82633A004352',
	vehicle_license_plate: 'AB-123-CD',
	vehicle_make: 'Ford',
	vehicle_model: 'Transit',
	vehicle_model_year: 2022,
	vehicle_reg_state_id: 1,
	vehicle_reg_country_id: 1,
	vehicle_type_id: 1,
	color_id: 1,
	color_name: 'White',
	fuel_type: 'unleaded',
	fuel_type_name: 'Unleaded 87',
	is_operational: true,
	status: 'active',
	status_label: 'Active',
	timestamp_added: 1794344670,
	vehicle_profile_id: 7,
	vehicle_profile_name: 'Van profile',
	vehicle_capacity_profile_id: 3,
	vehicle_capacity_profile_name: 'Standard capacity',
	max_height: 2.4,
	max_width: 2.0,
	max_length: 5.5,
	total_weight: 3500,
	max_weight_per_axle: 1750,
	skills: ['refrigerated'],
	// Provider-shaped key/value rows stay open.
	vehicle_tags: [{ tag: 'fleet-a' }],
	metadata: [{ key: 'radio', value: 'VHF' }],
};

/** This host answers a bare array, not a collection envelope. */
export const VEHICLE_ARRAY = [VEHICLE];

export const CREATED_VEHICLE = {
	vehicle_id: VEHICLE_ID,
	vehicle_alias: 'Van 1',
	vehicle_license_plate: 'AB-123-CD',
	timestamp_added: 1794344670,
};

export const ADDRESS = {
	address_id: ADDRESS_ID,
	address_alias: 'Canal stop',
	address_1: 'Prinsengracht 100',
	address_city: 'Amsterdam',
	address_state_id: 'NH',
	address_country_id: 'NL',
	address_zip: '1015 EA',
	cached_lat: 52.373066,
	cached_lng: 4.886445,
	address_email: 'jordan@example.com',
	address_phone_number: '+31 20 555 0100',
	first_name: 'Jordan',
	last_name: 'Lee',
	in_route_count: 0,
	visited_count: 2,
	service_time: 300,
	address_stop_type: 'DELIVERY',
	address_weight: 12.5,
	address_pieces: 2,
	address_revenue: 89.9,
	address_priority: 1,
	eligible_pickup: false,
	eligible_depot: false,
	// A caller-defined custom map stays open.
	address_custom_data: { pallet: 'A' },
	facility_ids: ['facility-1'],
};

/** The address book's own envelope: `results`, not `data`. */
export const ADDRESS_PAGE = {
	results: [ADDRESS],
	total: 1,
	fields: ['address_id', 'address_1'],
};

export const CREATED_ADDRESS = {
	address_id: ADDRESS_ID,
	address_alias: 'Canal stop',
	address_1: 'Prinsengracht 100',
	created_timestamp: 1794344670,
};

export const MEMBER = {
	member_id: 424242,
	member_first_name: 'Sam',
	member_last_name: 'Rivera',
	member_email: 'sam@example.com',
	member_company: 'Example Logistics',
	member_phone: '+31 20 555 0199',
	member_type: 'PRIMARY_ACCOUNT',
	member_type_title: 'Primary account',
	OWNER_MEMBER_ID: 424242,
	owner_member_name: 'Sam Rivera',
	timezone: 'Europe/Amsterdam',
	timestamp_added: 1794300000,
	timestamp_last_active: 1794344670,
	optimization_profile_id: 7,
	optimization_profile_name: 'Default',
	READONLY_USER: false,
	can_edit: true,
	can_delete: false,
	facility_ids: ['facility-1'],
	// Provider-shaped collections stay open.
	permissions: [{ name: 'routes', level: 'write' }],
	custom_data: { department: 'ops' },
};

export const MEMBER_ARRAY = [MEMBER];

export const OPTIMIZATION = {
	optimization_problem_id: OPTIMIZATION_ID,
	state: 4,
	created_timestamp: 1794344670,
	scheduled_for: 1794348000,
	optimization_completed_timestamp: 1794344770,
	sent_to_background: true,
	user_errors: [],
	optimization_errors: [],
	// Provider-shaped, read through `routes.get` instead.
	parameters: { route_max_duration: 1800, algorithm_type: 'TSP' },
	addresses: [{ address_id: ADDRESS_ID }],
	routes: [{ route_id: ROUTE_ID }],
};

/** v4 answers a list as `{ optimizations, totalRecords }`. */
export const OPTIMIZATION_LIST = {
	optimizations: [OPTIMIZATION],
	totalRecords: 1,
};

/** The same route answers a bare optimization object when given an id. */
export const CREATED_OPTIMIZATION = {
	optimization_problem_id: OPTIMIZATION_ID,
	state: 0,
	created_timestamp: 1794344670,
	sent_to_background: true,
	user_errors: [],
	optimization_errors: [],
};
