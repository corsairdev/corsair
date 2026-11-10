// Fixtures are captured from live Eventbrite responses (event 2000937221092,
// venue 299411783 and that event's ticket classes), trimmed to the fields the
// plugin types. They are deliberately not the docs' examples: several responses
// differ from them, and the wire shape is what the schemas must accept.

/** The event object as `GET /events/2000937221092/` returned it. */
export const eventbriteEvent = {
	name: {
		text: 'Rakuten AI Technology Conference 2026',
		html: 'Rakuten AI Technology Conference 2026',
	},
	description: {
		text: "Rakuten's annual Tech showcase event",
		html: 'Rakuten&#39;s annual Tech showcase event',
	},
	url: 'https://www.eventbrite.com/e/rakuten-ai-technology-conference-2026-tickets-2000937221092',
	start: {
		timezone: 'Asia/Tokyo',
		utc: '2026-11-14T01:00:00Z',
		local: '2026-11-14T10:00:00',
	},
	end: {
		timezone: 'Asia/Tokyo',
		utc: '2026-11-14T11:00:00Z',
		local: '2026-11-14T20:00:00',
	},
	organization_id: '154830740213',
	created: '2026-09-14T03:53:01Z',
	changed: '2026-09-29T01:24:51Z',
	published: '2026-09-25T02:35:14Z',
	capacity: null,
	capacity_is_custom: null,
	status: 'live',
	currency: 'USD',
	listed: true,
	shareable: true,
	online_event: false,
	tx_time_limit: 1800,
	hide_start_date: false,
	hide_end_date: false,
	locale: 'en_US',
	is_locked: false,
	privacy_setting: 'unlocked',
	is_series: false,
	is_series_parent: false,
	inventory_type: 'limited',
	is_reserved_seating: false,
	show_pick_a_seat: false,
	show_seatmap_thumbnail: false,
	show_colors_in_seatmap_thumbnail: false,
	source: 'coyote',
	is_free: true,
	version: null,
	summary: "Rakuten's annual Tech showcase event",
	facebook_event_id: null,
	logo_id: '1193521191',
	organizer_id: '8515431666',
	venue_id: '299411783',
	category_id: '102',
	subcategory_id: '2004',
	format_id: '1',
	id: '2000937221092',
	resource_uri: 'https://www.eventbriteapi.com/v3/events/2000937221092/',
	is_externally_ticketed: false,
};

/**
 * `/events/{id}/ticket_classes/` — the cost fields come back flat
 * (`actual_cost`, `cost`, `fee`, `tax` at the top level), not nested under a
 * `cost` object as the docs' Ticket Class structure suggests, so the fixture
 * follows the wire.
 */
export const ticketClass = {
	actual_cost: null,
	actual_fee: null,
	cost: null,
	fee: null,
	tax: null,
	resource_uri:
		'https://www.eventbriteapi.com/v3/events/2000937221092/ticket_classes/3453243480/',
	display_name: 'General Admissions',
	name: 'General Admissions',
	description: null,
	sorting: null,
	donation: false,
	free: true,
	minimum_quantity: 1,
	maximum_quantity: 2,
	maximum_quantity_per_order: 2,
	on_sale_status: 'AVAILABLE',
	has_pdf_ticket: true,
	order_confirmation_message: null,
	delivery_methods: ['electronic'],
	category: 'admission',
	sales_channels: ['online', 'atd'],
	secondary_assignment_enabled: false,
	event_id: '2000937221092',
	image_id: null,
	id: '3453243480',
	capacity: null,
	sales_end_relative: null,
	hidden_currently: null,
	include_fee: false,
	hide_sale_dates: false,
	early_access_purchase_windows: false,
	ticket_parent_id: null,
	payment_constraints: [],
};

/** `GET /venues/299411783/` — `capacity` and `age_restriction` come back null. */
export const venue = {
	address: {
		address_1: '1-14-1 Tamagawa',
		address_2: '',
		city: 'Setagaya City',
		region: 'Tokyo',
		postal_code: '158-0094',
		country: 'JP',
		latitude: '35.6105515',
		longitude: '139.6300671',
		localized_address_display: '1-14-1 Tamagawa, Setagaya City, Tokyo 158-0094',
		localized_area_display: 'Setagaya City, Tokyo',
		localized_multi_line_address_display: [
			'1-14-1 Tamagawa',
			'Setagaya City, Tokyo 158-0094',
		],
	},
	resource_uri: 'https://www.eventbriteapi.com/v3/venues/299411783/',
	id: '299411783',
	age_restriction: null,
	capacity: null,
	name: 'Rakuten Crimson House',
	latitude: '35.6105515',
	longitude: '139.6300671',
};

/**
 * The webhook object `POST /organizations/{id}/webhooks/` returns, whose
 * `user_id` is the organization id despite the name.
 */
export const webhook = {
	id: '2006536',
	resource_uri: 'https://www.eventbriteapi.com/v3/webhooks/2006536/',
	created: '2026-03-03T18:09:37Z',
	actions: ['event.created', 'order.placed'],
	user_id: '154830740213',
	event_id: null,
};

export const category = {
	resource_uri: 'https://www.eventbriteapi.com/v3/categories/102/',
	id: '102',
	name: 'Science & Technology',
	name_localized: 'Science & Technology',
	short_name: 'Science & Tech',
	short_name_localized: 'Science & Tech',
};

export const format = {
	resource_uri: 'https://www.eventbriteapi.com/v3/formats/1/',
	id: '1',
	name: 'Conference',
	name_localized: 'Conference',
	short_name: 'Conference',
	short_name_localized: 'Conference',
};

export const displaySettings = {
	resource_uri:
		'https://www.eventbriteapi.com/v3/events/2000937221092/display_settings/',
	show_start_date: true,
	show_end_date: true,
	show_start_end_time: true,
	show_timezone: true,
	show_map: true,
	show_remaining: false,
	show_organizer_facebook: false,
	show_organizer_twitter: false,
	show_facebook_friends_going: false,
	terminology: 'tickets_vertical',
};

/** `/events/{id}/questions/` — a waiver, so `waiver` is set and `choices` empty. */
export const question = {
	resource_uri:
		'https://www.eventbriteapi.com/v3/events/2000937221092/questions/323787959/',
	id: '323787959',
	question: {
		text: 'Terms and Conditions to enter',
		html: 'Terms and Conditions to enter',
	},
	type: 'waiver',
	required: true,
	choices: [],
	waiver: 'Welcome to the office!',
	ticket_classes: [],
	sorting: 1,
};

/**
 * `/events/{id}/canned_questions/` — the id `first_name` is Eventbrite's own,
 * and `include` is a bare boolean beside the question.
 */
export const cannedQuestion = {
	resource_uri:
		'https://www.eventbriteapi.com/v3/events/2000937221092/canned_questions/first_name/',
	id: 'first_name',
	question: { text: 'First Name', html: 'First Name' },
	type: 'text',
	required: true,
	choices: [],
	ticket_classes: [],
	include: true,
};

export const attendee = {
	id: '1234567890',
	resource_uri:
		'https://www.eventbriteapi.com/v3/events/2000937221092/attendees/1234567890/',
	event_id: '2000937221092',
	order_id: '9876543210',
	ticket_class_id: '3453243480',
	ticket_class_name: 'General Admissions',
	quantity: 1,
	created: '2026-09-20T08:12:31Z',
	changed: '2026-09-20T08:12:31Z',
	checked_in: false,
	cancelled: false,
	refunded: false,
	status: 'Attending',
	delivery_method: 'electronic',
	profile: {
		name: 'Jordan Lee',
		email: 'jordan@example.com',
		first_name: 'Jordan',
		last_name: 'Lee',
	},
	barcodes: [
		{
			barcode: '1234093511009831492001',
			status: 'unused',
			created: '2026-09-20T08:12:31Z',
			changed: '2026-09-20T08:12:31Z',
			checkin_type: 0,
			is_printed: false,
		},
	],
	costs: {
		base_price: {
			currency: 'USD',
			value: 0,
			major_value: '0.00',
			display: '0.00 USD',
		},
		gross: {
			currency: 'USD',
			value: 0,
			major_value: '0.00',
			display: '0.00 USD',
		},
		eventbrite_fee: {
			currency: 'USD',
			value: 0,
			major_value: '0.00',
			display: '0.00 USD',
		},
		payment_fee: {
			currency: 'USD',
			value: 0,
			major_value: '0.00',
			display: '0.00 USD',
		},
		tax: {
			currency: 'USD',
			value: 0,
			major_value: '0.00',
			display: '0.00 USD',
		},
	},
	answers: [
		{
			question_id: '323787959',
			question: 'Terms and Conditions to enter',
			type: 'waiver',
			answer: 'accepted',
		},
	],
};

export const order = {
	id: '9876543210',
	resource_uri: 'https://www.eventbriteapi.com/v3/orders/9876543210/',
	created: '2026-09-20T08:12:31Z',
	changed: '2026-09-20T08:12:31Z',
	name: 'Jordan Lee',
	first_name: 'Jordan',
	last_name: 'Lee',
	email: 'jordan@example.com',
	event_id: '2000937221092',
	status: 'placed',
	time_remaining: null,
	costs: {
		base_price: {
			currency: 'USD',
			value: 0,
			major_value: '0.00',
			display: '0.00 USD',
		},
		gross: {
			currency: 'USD',
			value: 0,
			major_value: '0.00',
			display: '0.00 USD',
		},
	},
};

export const user = {
	emails: [{ email: 'corsairtest00@gmail.com', verified: true, primary: true }],
	id: '3020861203176',
	name: 'corsair test',
	first_name: 'corsair',
	last_name: 'test',
	is_public: false,
	image_id: null,
};

export const organization = {
	id: '154830740213',
	name: 'Rakuten',
	vertical: 'default',
	image_id: null,
};

export const discount = {
	id: '12345',
	code: 'CORSAIR20',
	type: 'coded',
	percent_off: '20',
	quantity_available: 100,
	quantity_sold: 3,
	event_id: '2000937221092',
	ticket_class_ids: ['3453243480'],
};

/**
 * `/users/me/organizations/` for a token whose user belongs to none: the
 * continuation token is present with `page_count: 0`, so the shape is real
 * while the list is empty.
 */
export const emptyOrganizationsPage = {
	organizations: [],
	pagination: {
		continuation:
			'AGWl1yEwYXtueF_EhfwgDls7oLNYyTf0ZrG3Qh_-5jWlVF1zfET2__hHc_CHv5zPl9N6ypFYPxro',
		has_more_items: false,
		page_size: 50,
		page_number: 1,
		object_count: 0,
		page_count: 0,
	},
};

/** `/organizations/{id}/events/` with one event. */
export const eventsPage = {
	pagination: {
		object_count: 21,
		page_number: 1,
		page_size: 50,
		page_count: 1,
		has_more_items: false,
		continuation: null,
	},
	events: [eventbriteEvent],
};

export const ticketClassesPage = {
	pagination: {
		object_count: 2,
		continuation: null,
		has_more_items: false,
		page_count: 1,
		page_number: 1,
		page_size: 50,
	},
	ticket_classes: [ticketClass],
};

/** What `GET /subcategories/` returns, with a live continuation token. */
export const subcategoriesPage = {
	subcategories: [
		{
			resource_uri: 'https://www.eventbriteapi.com/v3/subcategories/1001/',
			id: '1001',
			name: 'Startups & Small Business',
			name_localized: 'Startups & Small Business',
			parent_category: category,
		},
	],
	pagination: {
		object_count: 216,
		page_number: 1,
		page_size: 50,
		page_count: 5,
		continuation: 'eyJwYWdlIjogMn0',
		has_more_items: true,
	},
};

export const errorEnvelope = {
	error: 'NOT_FOUND',
	error_description: 'The event you requested does not exist.',
	status_code: 404,
};

export const argumentsError = {
	error: 'ARGUMENTS_ERROR',
	error_description:
		'There are errors with your arguments: event.name.html - This field is required.',
	status_code: 400,
	error_detail: {
		ARGUMENTS_ERROR: { 'event.name.html': ['This field is required.'] },
	},
};

export const rateLimitEnvelope = {
	error: 'HIT_RATE_LIMIT',
	error_description: 'Hourly rate limit has been reached for this token.',
	status_code: 429,
};

/** The Spring envelope two routes answer with instead of Eventbrite's own. */
export const springError = {
	timestamp: '2026-11-10T05:54:09.569+00:00',
	status: 401,
	error: 'Unauthorized',
	path: '/api/v1/events/1/orders',
};

export const publishedResult = { published: true };
export const unpublishedResult = { unpublished: true };
export const canceledResult = { canceled: true };
export const deletedResult = { deleted: true };

export const webhooksPage = {
	pagination: {
		object_count: 1,
		page_number: 1,
		page_size: 50,
		page_count: 1,
		has_more_items: false,
	},
	webhooks: [webhook],
};

/** A real-shaped delivery: the notification, never the changed object. */
export const webhookDelivery = {
	api_url: 'https://www.eventbriteapi.com/v3/orders/9876543210/',
	config: {
		action: 'order.placed',
		endpoint_url: 'https://myawesomeapp.com/webhook',
		user_id: '154830740213',
		webhook_id: '9876543',
	},
};

/** The dashboard's "Test" button sends `action: "test"` and no real object. */
export const webhookTestDelivery = {
	api_url: 'https://www.eventbriteapi.com/v3/events/2000937221092/',
	config: {
		action: 'test',
		endpoint_url: 'https://myawesomeapp.com/webhook',
	},
};
