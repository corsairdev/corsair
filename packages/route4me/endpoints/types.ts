import { z } from 'zod';

/** v5 caps a page at 500 items; the address book caps a query at 10,000. */
export const ROUTE4ME_DEFAULT_PER_PAGE = 50;
export const ROUTE4ME_MAX_PER_PAGE = 500;
export const ROUTE4ME_ADDRESS_MAX_LIMIT = 10_000;

const PageSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('1-based page number.');

const PerPageSchema = z
	.number()
	.int()
	.min(1)
	.max(ROUTE4ME_MAX_PER_PAGE)
	.optional()
	.describe(
		`Items per page, 1 to ${ROUTE4ME_MAX_PER_PAGE}. Route4Me's own default applies when omitted.`,
	);

/** A vehicle tag row. */
export const VehicleTagSchema = z.object({ tag: z.string().nullish() }).loose();

/** A vehicle metadata row, carrying a string value. */
export const VehicleMetadataSchema = z
	.object({ key: z.string().nullish(), value: z.string().nullish() })
	.loose();

/** A vehicle metadata row, carrying a numeric value. */
export const VehicleMetadataNumericSchema = z
	.object({ key: z.string().nullish(), value: z.number().nullish() })
	.loose();

/** A member territory grant. */
export const TerritorySchema = z
	.object({ id: z.string().nullish(), permission: z.boolean().nullish() })
	.loose();

/** One permission on a member, as Route4Me reports it. */
export const PermissionSchema = z
	.object({ id: z.string().nullish(), title: z.string().nullish() })
	.loose();

/** A note attached to a stop. */
export const NoteSchema = z
	.object({ note_id: z.number().nullish(), note: z.string().nullish() })
	.loose();

/** The facility summary a route or order carries. */
export const FacilitySchema = z
	.object({
		facility_id: z.string().nullish(),
		facility_alias: z.string().nullish(),
		status: z.string().nullish(),
	})
	.loose();

/**
 * A caller-defined custom data field on a response. The reference types
 * `route_custom_data` as an array of objects and the others as string maps,
 * and this PHP API serialises an empty map as `[]`, so a read accepts either
 * form rather than failing on a route or contact that has no custom data.
 */
// unknown: the keys and values are whatever the account's users stored.
const CustomDataOutputSchema = z.union([
	z.record(z.string(), z.unknown()),
	z.array(z.unknown()),
]);

/** A caller-named custom field row on an order. */
export const CustomUserFieldSchema = z
	.object({ key: z.string().nullish(), value: z.string().nullish() })
	.loose();

/** v5's Laravel-style page envelope: `data` plus `meta` and `links`. */
export const CollectionMetaSchema = z
	.object({
		current_page: z.number().nullish(),
		from: z.number().nullish(),
		last_page: z.number().nullish(),
		per_page: z.number().nullish(),
		to: z.number().nullish(),
		total: z.number().nullish(),
		path: z.string().nullish(),
	})
	.loose();

export const CollectionLinksSchema = z
	.object({
		first: z.string().nullish(),
		last: z.string().nullish(),
		prev: z.string().nullish(),
		next: z.string().nullish(),
	})
	.loose();

/**
 * v5 answers a list as `{ data, links, meta }`. `next_page` is derived from
 * `meta.current_page` and `meta.last_page` rather than from `links.next`,
 * because a filtered query can leave `links.next` null on a page that is not
 * the last one.
 */
const pagingFields = {
	next_page: z
		.number()
		.nullable()
		.describe('The page to request next, or null on the last page.'),
	current_page: z.number().nullish(),
	last_page: z.number().nullish(),
	total: z.number().nullish(),
};

// ── routes.list ───────────────────────────────────────────────────────────

/**
 * `order_by` is an array of `[field, direction]` pairs on the wire. A
 * single-pair object is modelled instead, because Route4Me documents one sort
 * per call and a malformed pair is rejected as a whole.
 */
const OrderBySchema = z
	.object({
		field: z
			.string()
			.describe('The field to sort on, e.g. route_created_unix.'),
		direction: z.enum(['asc', 'desc']),
	})
	.optional();

const RoutesListInputSchema = z.object({
	query: z.string().optional().describe('A free-text search phrase.'),
	search_query: z.string().optional().describe('A second search field.'),
	exclude_ids: z
		.array(z.string())
		.optional()
		.describe('Route ids to leave out of the result.'),
	facility_ids: z.array(z.string()).optional(),
	route_id: z
		.union([z.string(), z.array(z.string())])
		.optional()
		.describe('One route id, or several, to read instead of listing all.'),
	timezone: z
		.string()
		.optional()
		.describe('An IANA timezone, used for the date fields in the result.'),
	group_by: z.string().optional(),
	page: PageSchema,
	per_page: PerPageSchema,
	order_by: OrderBySchema,
});

export type RoutesListInput = z.input<typeof RoutesListInputSchema>;

/** One stop on a route. Route4Me calls these addresses or destinations. */
const RouteDestinationSchema = z
	.object({
		address_id: z.number().nullish(),
		route_destination_id: z.number().nullish(),
		address: z.string().nullish(),
		address_1: z.string().nullish(),
		address_2: z.string().nullish(),
		alias: z.string().nullish(),
		cached_lat: z.number().nullish(),
		cached_lng: z.number().nullish(),
		curbside_lat: z.number().nullish(),
		curbside_lng: z.number().nullish(),
		sequence_no: z.number().nullish(),
		is_depot: z.boolean().nullish(),
		time_window_start: z.number().nullish(),
		time_window_end: z.number().nullish(),
		service_time: z.number().nullish(),
		priority: z.number().nullish(),
		weight: z.number().nullish(),
		cube: z.number().nullish(),
		pieces: z.number().nullish(),
		revenue: z.number().nullish(),
		cost: z.number().nullish(),
		// `0` has not been visited, `1` visited.
		visited: z.number().nullish(),
		// `0` pending, `1` done, `2` failed, `3` skipped.
		status: z.string().nullish(),
		timestamp_last_visited: z.number().nullish(),
		notes: z.array(NoteSchema).nullish(),
		custom_fields: CustomDataOutputSchema.nullish(),
	})
	.loose();

export type Route4MeDestination = z.infer<typeof RouteDestinationSchema>;

const RouteScoutSchema = z
	.object({
		route_id: z.string().nullish(),
		route_name: z.string().nullish(),
		route_created_unix: z.number().nullish(),
		optimization_problem_id: z.string().nullish(),
		updated_timestamp: z.number().nullish(),
		route_scheduled_start_unix: z.number().nullish(),
		approved_to_execute: z.boolean().nullish(),
		destination_count: z.number().nullish(),
		visited_count: z.number().nullish(),
		notes_count: z.number().nullish(),
		vehicle_id: z.string().nullish(),
		vehicle_alias: z.string().nullish(),
		driver_alias: z.string().nullish(),
		member_id: z.number().nullish(),
		owner_email: z.string().nullish(),
		trip_distance: z.number().nullish(),
		actual_travel_distance: z.number().nullish(),
		actual_travel_time: z.number().nullish(),
		route_progress: z.number().nullish(),
		route_status: z.string().nullish(),
		route_status_id: z.number().nullish(),
		weight: z.number().nullish(),
		cube: z.number().nullish(),
		pieces: z.number().nullish(),
		revenue: z.number().nullish(),
		cost: z.number().nullish(),
		planned_destinations: z.number().nullish(),
		done_destinations: z.number().nullish(),
		failed_destinations: z.number().nullish(),
		skipped_destinations: z.number().nullish(),
		destinations_arrived_on_time: z.number().nullish(),
		destinations_arrived_early: z.number().nullish(),
		destinations_arrived_late: z.number().nullish(),
		planned_total_route_duration: z.number().nullish(),
		planned_total_service_time: z.number().nullish(),
		planned_total_travel_time: z.number().nullish(),
		planned_total_wait_time: z.number().nullish(),
		planned_total_break_time: z.number().nullish(),
		actual_route_duration: z.number().nullish(),
		actual_start_timestamp: z.number().nullish(),
		actual_end_timestamp: z.number().nullish(),
		planned_end_timestamp: z.number().nullish(),
		driver_open_timestamp: z.number().nullish(),
		has_directions: z.boolean().nullish(),
		is_unrouted: z.boolean().nullish(),
		// Ramp keeps a handful of load-percentage fields, all the same shape.
		planned_weight_load_percent: z.number().nullish(),
		planned_cube_load_percent: z.number().nullish(),
		planned_revenue_load_percent: z.number().nullish(),
		planned_pieces_load_percent: z.number().nullish(),
		actual_weight_load_percent: z.number().nullish(),
		actual_cube_load_percent: z.number().nullish(),
		actual_revenue_load_percent: z.number().nullish(),
		actual_pieces_load_percent: z.number().nullish(),
		// Distances arrive as strings on the mobile and telematics variants.
		mobile_actual_travel_distance: z.string().nullish(),
		telematics_actual_travel_distance: z.string().nullish(),
		merged_actual_travel_distance: z.number().nullish(),
		mobile_visited_distance_percent: z.number().nullish(),
		telematics_visited_distance_percent: z.number().nullish(),
		merged_visited_distance_percent: z.number().nullish(),
		facility_ids: z.array(z.string()).nullish(),
		depot_timezone: z.string().nullish(),
		path: z.string().nullish(),
		// The route's stops, as a partial form of the rows `routes.get` returns.
		route_data: z.array(RouteDestinationSchema).nullish(),
		facilities: z.array(FacilitySchema).nullish(),
	})
	.loose();

export type Route4MeRouteScout = z.infer<typeof RouteScoutSchema>;

const RoutesListResponseSchema = z.object({
	routes: z.array(RouteScoutSchema),
	...pagingFields,
});

export type RoutesListResponse = z.infer<typeof RoutesListResponseSchema>;

// ── routes.get ────────────────────────────────────────────────────────────

const RoutesGetInputSchema = z.object({
	route_id: z
		.string()
		.length(32)
		.describe('The 32-character route id, from `routes.list`.'),
	page: PageSchema,
	per_page: PerPageSchema,
});

export type RoutesGetInput = z.input<typeof RoutesGetInputSchema>;

const RouteDirectionSchema = z
	.object({
		distance: z.number().nullish(),
		duration: z.number().nullish(),
		direction: z.string().nullish(),
		maneuver_type: z.string().nullish(),
	})
	.loose();

const RoutesGetResponseSchema = z.object({
	route_id: z.string().nullish(),
	route_name: z.string().nullish(),
	optimization_problem_id: z.string().nullish(),
	route_status: z.string().nullish(),
	approved_to_execute: z.boolean().nullish(),
	driver_alias: z.string().nullish(),
	vehicle_alias: z.string().nullish(),
	member_id: z.number().nullish(),
	destination_count: z.number().nullish(),
	visited_count: z.number().nullish(),
	trip_distance: z.number().nullish(),
	actual_travel_distance: z.number().nullish(),
	actual_travel_time: z.number().nullish(),
	route_created_unix: z.number().nullish(),
	route_scheduled_start_unix: z.number().nullish(),
	total_weight: z.number().nullish(),
	total_cube: z.number().nullish(),
	total_pieces: z.number().nullish(),
	total_revenue: z.number().nullish(),
	addresses: z
		.array(RouteDestinationSchema)
		.nullish()
		.describe('The route stops, in the order Route4Me sequenced them.'),
	directions: z.array(RouteDirectionSchema).nullish(),
	notes: z.array(NoteSchema).nullish(),
	route_custom_data: CustomDataOutputSchema.nullish(),
	next_page: z
		.number()
		.nullable()
		.describe(
			'When the stop list is paged, the page to request next; null otherwise.',
		),
});

export type RoutesGetResponse = z.infer<typeof RoutesGetResponseSchema>;

// ── orders.list ───────────────────────────────────────────────────────────

const OrdersListInputSchema = z.object({
	page: z.number().int().min(0).optional().describe('0-based page number.'),
	per_page: z.number().int().min(1).optional(),
	search_query: z.string().optional(),
	order_by: OrderBySchema,
	day_scheduled_for: z
		.array(z.string())
		.optional()
		.describe('Scheduled days in YYYYMMDD form.'),
	day_added: z
		.array(z.string())
		.optional()
		.describe('Added days in YYYYMMDD form.'),
	statuses: z.array(z.string()).optional(),
	group: z.string().optional(),
	barcode: z.string().optional(),
});

export type OrdersListInput = z.input<typeof OrdersListInputSchema>;

const OrderSchema = z
	.object({
		order_id: z.number().nullish(),
		order_uuid: z.string().nullish(),
		member_id: z.number().nullish(),
		root_member_id: z.number().nullish(),
		address_1: z.string().nullish(),
		address_2: z.string().nullish(),
		address_alias: z.string().nullish(),
		address_city: z.string().nullish(),
		address_state_id: z.string().nullish(),
		address_zip: z.string().nullish(),
		cached_lat: z.number().nullish(),
		cached_lng: z.number().nullish(),
		curbside_lat: z.number().nullish(),
		curbside_lng: z.number().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		tracking_number: z.string().nullish(),
		group: z.string().nullish(),
		priority: z.number().nullish(),
		last_status: z.number().nullish(),
		address_stop_type: z.string().nullish(),
		weight: z.number().nullish(),
		cube: z.number().nullish(),
		pieces: z.number().nullish(),
		revenue: z.number().nullish(),
		cost: z.number().nullish(),
		in_route_count: z.number().nullish(),
		visited_count: z.number().nullish(),
		created_timestamp: z.number().nullish(),
		updated_timestamp: z.number().nullish(),
		visited_timestamp: z.number().nullish(),
		routed_timestamp: z.number().nullish(),
		scheduled_date: z.string().nullish(),
		done_date: z.string().nullish(),
		created_date: z.string().nullish(),
		local_time_window_start: z.number().nullish(),
		local_time_window_end: z.number().nullish(),
		local_timezone_string: z.string().nullish(),
		territory_ids: z.array(z.string()).nullish(),
		// A caller-defined list of `key: value` strings.
		custom_data: z.array(z.string()).nullish(),
		workflow_uuid: z.array(z.string()).nullish(),
	})
	.loose();

export type Route4MeOrder = z.infer<typeof OrderSchema>;

const OrdersListResponseSchema = z.object({
	orders: z.array(OrderSchema),
	...pagingFields,
});

export type OrdersListResponse = z.infer<typeof OrdersListResponseSchema>;

// ── orders.create ─────────────────────────────────────────────────────────

const OrdersCreateInputSchema = z.object({
	address_1: z.string().min(1).describe('The delivery street address.'),
	address_2: z.string().optional(),
	address_alias: z.string().optional(),
	address_city: z.string().optional(),
	address_state_id: z.string().optional(),
	address_zip: z.string().optional(),
	address_country_id: z.number().int().optional(),
	cached_lat: z.number().min(-90).max(90).optional(),
	cached_lng: z.number().min(-180).max(180).optional(),
	curbside_lat: z.number().min(-90).max(90).optional(),
	curbside_lng: z.number().min(-180).max(180).optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	group: z.string().optional(),
	priority: z.number().int().optional(),
	address_stop_type: z
		.enum(['DELIVERY', 'PICKUP', 'BREAK', 'MEETUP', 'SERVICE', 'VISIT'])
		.optional(),
	local_time_window_start: z.number().int().optional(),
	local_time_window_end: z.number().int().optional(),
	local_timezone_string: z.string().optional(),
	service_time: z.number().int().optional(),
	weight: z.number().optional(),
	cube: z.number().optional(),
	pieces: z.number().int().optional(),
	revenue: z.number().optional(),
	custom_user_fields: z.array(CustomUserFieldSchema).optional(),
	required_skills: z.array(z.string()).optional(),
	facility_ids: z.array(z.string()).optional(),
});

export type OrdersCreateInput = z.input<typeof OrdersCreateInputSchema>;

const CreatedOrderSchema = z
	.object({
		order_id: z.number().nullish(),
		order_uuid: z.string().nullish(),
		address_1: z.string().nullish(),
		address_alias: z.string().nullish(),
		created_timestamp: z.number().nullish(),
	})
	.loose();

/** Wrapped under `order` so a create and a list return the same outer shape. */
const OrdersCreateResponseSchema = z.object({ order: CreatedOrderSchema });

export type OrdersCreateResponse = z.infer<typeof OrdersCreateResponseSchema>;

// ── vehicles.list ─────────────────────────────────────────────────────────

const VehiclesListInputSchema = z.object({
	show: z.string().optional().describe('A field projection.'),
	search_query: z.string().optional(),
	query: z.string().optional(),
	is_operational: z.boolean().optional(),
	only_with_profile: z.boolean().optional(),
	with_multi_unit_fields: z.boolean().optional(),
	telematics_connection_ids: z.array(z.number().int()).optional(),
	facility_ids: z.array(z.string()).optional(),
});

export type VehiclesListInput = z.input<typeof VehiclesListInputSchema>;

const VehicleSchema = z
	.object({
		vehicle_id: z.string().nullish(),
		member_id: z.number().nullish(),
		root_member_id: z.number().nullish(),
		is_deleted: z.boolean().nullish(),
		vehicle_alias: z.string().nullish(),
		vehicle_vin: z.string().nullish(),
		vehicle_license_plate: z.string().nullish(),
		vehicle_reg_state_id: z.number().nullish(),
		vehicle_reg_state_label: z.string().nullish(),
		vehicle_reg_country_id: z.number().nullish(),
		vehicle_reg_country_label: z.string().nullish(),
		vehicle_type_id: z.number().nullish(),
		vehicle_make: z.string().nullish(),
		vehicle_model: z.string().nullish(),
		vehicle_model_year: z.number().nullish(),
		vehicle_cost_new: z.number().nullish(),
		purchased_new: z.boolean().nullish(),
		vehicle_year_acquired: z.number().nullish(),
		color_id: z.number().nullish(),
		color_name: z.string().nullish(),
		fuel_type: z.string().nullish(),
		fuel_type_name: z.string().nullish(),
		license_start_date: z.string().nullish(),
		license_end_date: z.string().nullish(),
		is_operational: z.boolean().nullish(),
		status: z.string().nullish(),
		status_label: z.string().nullish(),
		timestamp_added: z.number().nullish(),
		timestamp_removed: z.number().nullish(),
		vehicle_profile_id: z.number().nullish(),
		vehicle_profile_name: z.string().nullish(),
		vehicle_capacity_profile_id: z.number().nullish(),
		vehicle_capacity_profile_name: z.string().nullish(),
		external_telematics_vehicle_id: z.number().nullish(),
		max_height: z.number().nullish(),
		max_width: z.number().nullish(),
		max_length: z.number().nullish(),
		total_weight: z.number().nullish(),
		max_weight_per_axle: z.number().nullish(),
		skills: z.array(z.string()).nullish(),
		vehicle_tags: z.array(VehicleTagSchema).nullish(),
		metadata: z.array(VehicleMetadataSchema).nullish(),
		metadata_numeric: z.array(VehicleMetadataNumericSchema).nullish(),
	})
	.loose();

export type Route4MeVehicle = z.infer<typeof VehicleSchema>;

/** This host answers a bare array rather than a page envelope. */
const VehiclesListResponseSchema = z.object({
	vehicles: z.array(VehicleSchema),
});

export type VehiclesListResponse = z.infer<typeof VehiclesListResponseSchema>;

// ── vehicles.create ───────────────────────────────────────────────────────

const VehiclesCreateInputSchema = z.object({
	vehicle_alias: z.string().min(1).describe('The name shown in the app.'),
	vehicle_vin: z.string().optional(),
	vehicle_license_plate: z.string().optional(),
	vehicle_make: z.string().optional(),
	vehicle_model: z.string().optional(),
	vehicle_model_year: z.number().int().optional(),
	vehicle_reg_state_id: z.number().int().optional(),
	vehicle_reg_country_id: z.number().int().optional(),
	vehicle_type_id: z.number().int().optional(),
	color_id: z.number().int().optional(),
	fuel_type: z.string().optional(),
	vehicle_profile_id: z.number().int().optional(),
	vehicle_capacity_profile_id: z.number().int().optional(),
	is_operational: z.boolean().optional(),
	license_start_date: z.string().optional(),
	license_end_date: z.string().optional(),
	max_height: z.number().optional(),
	max_width: z.number().optional(),
	max_length: z.number().optional(),
	total_weight: z.number().optional(),
	max_weight_per_axle: z.number().optional(),
	// The vehicle endpoints call this `skills`, unlike orders and contacts.
	skills: z
		.array(z.string().min(1).max(64))
		.optional()
		.describe('Skills this vehicle offers, matched against required skills.'),
});

export type VehiclesCreateInput = z.input<typeof VehiclesCreateInputSchema>;

const CreatedVehicleSchema = z
	.object({
		vehicle_id: z.string().nullish(),
		vehicle_alias: z.string().nullish(),
		vehicle_license_plate: z.string().nullish(),
		timestamp_added: z.number().nullish(),
	})
	.loose();

const VehiclesCreateResponseSchema = z.object({
	vehicle: CreatedVehicleSchema,
});

export type VehiclesCreateResponse = z.infer<
	typeof VehiclesCreateResponseSchema
>;

// ── addresses.list / addresses.create ─────────────────────────────────────

const AddressesListInputSchema = z.object({
	display: z
		.enum(['all', 'routed', 'unrouted'])
		.optional()
		.describe('Which contacts to return. Route4Me defaults to `all`.'),
	display_list: z
		.array(z.enum(['routed', 'unrouted']))
		.optional()
		.describe('Sent as a repeated parameter.'),
	query: z.string().optional(),
	fields: z
		.array(z.string())
		.optional()
		.describe('A projection: only these fields come back.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(ROUTE4ME_ADDRESS_MAX_LIMIT)
		.optional()
		.describe(
			`Records to return, up to ${ROUTE4ME_ADDRESS_MAX_LIMIT}. Route4Me defaults to the maximum.`,
		),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Records to skip, for offset paging.'),
});

export type AddressesListInput = z.input<typeof AddressesListInputSchema>;

const AddressSchema = z
	.object({
		address_id: z.number().nullish(),
		address_group: z.string().nullish(),
		address_alias: z.string().nullish(),
		address_1: z.string().nullish(),
		address_2: z.string().nullish(),
		member_id: z.number().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		address_email: z.string().nullish(),
		address_phone_number: z.string().nullish(),
		address_city: z.string().nullish(),
		address_state_id: z.string().nullish(),
		address_country_id: z.string().nullish(),
		address_zip: z.string().nullish(),
		cached_lat: z.number().nullish(),
		cached_lng: z.number().nullish(),
		curbside_lat: z.number().nullish(),
		curbside_lng: z.number().nullish(),
		in_route_count: z.number().nullish(),
		visited_count: z.number().nullish(),
		last_visited_timestamp: z.number().nullish(),
		last_routed_timestamp: z.number().nullish(),
		created_timestamp: z.number().nullish(),
		local_time_window_start: z.number().nullish(),
		local_time_window_end: z.number().nullish(),
		service_time: z.number().nullish(),
		local_timezone_string: z.string().nullish(),
		color: z.string().nullish(),
		address_icon: z.string().nullish(),
		address_stop_type: z.string().nullish(),
		address_cube: z.number().nullish(),
		address_pieces: z.number().nullish(),
		address_reference_no: z.string().nullish(),
		address_revenue: z.number().nullish(),
		address_weight: z.number().nullish(),
		address_priority: z.number().nullish(),
		address_customer_po: z.string().nullish(),
		eligible_pickup: z.boolean().nullish(),
		eligible_depot: z.boolean().nullish(),
		customer_id: z.string().nullish(),
		customer_name: z.string().nullish(),
		parent_location_id: z.number().nullish(),
		required_skills: z.array(z.string()).nullish(),
		facility_ids: z.array(z.string()).nullish(),
		address_custom_data: CustomDataOutputSchema.nullish(),
	})
	.loose();

export type Route4MeAddress = z.infer<typeof AddressSchema>;

const AddressesListResponseSchema = z.object({
	addresses: z.array(AddressSchema),
	total: z
		.number()
		.nullish()
		.describe('Total matching contacts, before `limit` and `offset`.'),
	offset: z.number().nullable(),
	limit: z.number().nullable(),
	/** Offset paging: present while a full page came back. */
	next_offset: z.number().nullable(),
});

export type AddressesListResponse = z.infer<typeof AddressesListResponseSchema>;

const AddressesCreateInputSchema = z.object({
	address_1: z.string().min(1).describe('The street address.'),
	address_2: z.string().optional(),
	address_alias: z.string().optional(),
	address_city: z.string().optional(),
	address_state_id: z.string().optional(),
	address_country_id: z.string().optional(),
	address_zip: z.string().optional(),
	/** Ramp requires coordinates, so they are required here too. */
	cached_lat: z.number().min(-90).max(90),
	cached_lng: z.number().min(-180).max(180),
	curbside_lat: z.number().min(-90).max(90).optional(),
	curbside_lng: z.number().min(-180).max(180).optional(),
	address_group: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	address_email: z
		.string()
		.optional()
		.describe(
			'The contact email. Route4Me names it `address_email`, not `email`.',
		),
	address_phone_number: z.string().optional(),
	service_time: z.number().int().optional(),
	address_weight: z.number().optional(),
	address_cube: z.number().optional(),
	address_pieces: z.number().int().optional(),
	address_revenue: z.number().optional(),
	address_priority: z.number().int().optional(),
	address_reference_no: z.string().optional(),
	address_stop_type: z
		.enum(['DELIVERY', 'PICKUP', 'BREAK', 'MEETUP', 'SERVICE', 'VISIT'])
		.optional(),
	eligible_pickup: z.boolean().optional(),
	eligible_depot: z.boolean().optional(),
	customer_id: z.string().optional(),
	address_custom_data: z.record(z.string(), z.string()).optional(),
});

export type AddressesCreateInput = z.input<typeof AddressesCreateInputSchema>;

const CreatedAddressSchema = z
	.object({
		address_id: z.number().nullish(),
		address_alias: z.string().nullish(),
		address_1: z.string().nullish(),
		created_timestamp: z.number().nullish(),
	})
	.loose();

const AddressesCreateResponseSchema = z.object({
	address: CreatedAddressSchema,
});

export type AddressesCreateResponse = z.infer<
	typeof AddressesCreateResponseSchema
>;

// ── team.me ───────────────────────────────────────────────────────────────

const TeamMeInputSchema = z.object({});

export type TeamMeInput = z.input<typeof TeamMeInputSchema>;

const MemberSchema = z
	.object({
		member_id: z.number().nullish(),
		member_first_name: z.string().nullish(),
		member_last_name: z.string().nullish(),
		member_email: z.string().nullish(),
		member_company: z.string().nullish(),
		member_phone: z.string().nullish(),
		member_type: z.string().nullish(),
		member_type_title: z.string().nullish(),
		member_picture: z.string().nullish(),
		OWNER_MEMBER_ID: z.number().nullish(),
		owner_member_name: z.string().nullish(),
		timezone: z.string().nullish(),
		timestamp_added: z.number().nullish(),
		timestamp_last_active: z.number().nullish(),
		authentication_count: z.number().nullish(),
		last_login_device: z.string().nullish(),
		optimization_profile_id: z.number().nullish(),
		optimization_profile_name: z.string().nullish(),
		READONLY_USER: z.boolean().nullish(),
		allowed_submember_types: z.array(z.string()).nullish(),
		can_edit: z.boolean().nullish(),
		can_delete: z.boolean().nullish(),
		facility_ids: z.array(z.string()).nullish(),
		permissions: z.array(PermissionSchema).nullish(),
		territories: z.array(TerritorySchema).nullish(),
		custom_data: CustomDataOutputSchema.nullish(),
	})
	.loose();

export type Route4MeMember = z.infer<typeof MemberSchema>;

const TeamMeResponseSchema = z.object({
	member: MemberSchema,
});

export type TeamMeResponse = z.infer<typeof TeamMeResponseSchema>;

// ── team.list ─────────────────────────────────────────────────────────────

const TeamListInputSchema = z.object({
	query: z.string().optional(),
	drivers_only: z.boolean().optional(),
	optimization_problem_id: z.string().optional(),
	facility_ids: z.array(z.string()).optional(),
});

export type TeamListInput = z.input<typeof TeamListInputSchema>;

const TeamListResponseSchema = z.object({
	members: z.array(MemberSchema),
});

export type TeamListResponse = z.infer<typeof TeamListResponseSchema>;

// ── optimizations.list ────────────────────────────────────────────────────

const OptimizationsListInputSchema = z.object({
	optimization_problem_id: z
		.string()
		.optional()
		.describe(
			'Read this optimization instead of listing; v4 then answers a single object rather than a list.',
		),
	state: z
		.number()
		.int()
		.optional()
		.describe(
			'0 New, 1 Initial, 2 MatrixProcessing, 3 Optimizing, 4 Optimized, 5 Error, 6 ComputingDirections.',
		),
	limit: z.number().int().min(1).optional(),
	offset: z.number().int().min(0).optional(),
	start_date: z
		.string()
		.optional()
		.describe('Only optimizations created on or after this date.'),
	end_date: z
		.string()
		.optional()
		.describe('Only optimizations created on or before this date.'),
});

export type OptimizationsListInput = z.input<
	typeof OptimizationsListInputSchema
>;

/** v4 reports its own progress as a numeric state, not a status string. */
export const OPTIMIZATION_STATE = {
	NEW: 0,
	INITIAL: 1,
	MATRIX_PROCESSING: 2,
	OPTIMIZING: 3,
	OPTIMIZED: 4,
	ERROR: 5,
	COMPUTING_DIRECTIONS: 6,
} as const;

/** A solved route as the optimization response lists it. */
const RouteSummarySchema = z
	.object({
		route_id: z.string().nullish(),
		route_name: z.string().nullish(),
		driver_alias: z.string().nullish(),
		vehicle_alias: z.string().nullish(),
		route_cost: z.number().nullish(),
		route_revenue: z.number().nullish(),
		trip_distance: z.number().nullish(),
		destination_count: z.number().nullish(),
	})
	.loose();

const OptimizationSchema = z
	.object({
		optimization_problem_id: z.string().nullish(),
		state: z.number().nullish(),
		created_timestamp: z.number().nullish(),
		scheduled_for: z.number().nullish(),
		optimization_completed_timestamp: z.number().nullish(),
		sent_to_background: z.boolean().nullish(),
		user_errors: z.array(z.string()).nullish(),
		optimization_errors: z.array(z.string()).nullish(),
		// The solver's settings, keyed by name with scalar values.
		parameters: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.nullish(),
		addresses: z.array(RouteDestinationSchema).nullish(),
		routes: z.array(RouteSummarySchema).nullish(),
	})
	.loose();

export type Route4MeOptimization = z.infer<typeof OptimizationSchema>;

const OptimizationsListResponseSchema = z.object({
	optimizations: z.array(OptimizationSchema),
	total_records: z
		.number()
		.nullable()
		.describe("Route4Me's `totalRecords`, renamed to snake case."),
	next_offset: z
		.number()
		.nullable()
		.describe('The offset to request next, or null on the last page.'),
});

export type OptimizationsListResponse = z.infer<
	typeof OptimizationsListResponseSchema
>;

// ── optimizations.get ─────────────────────────────────────────────────────

const OptimizationsGetInputSchema = z.object({
	optimization_problem_id: z
		.string()
		.min(1)
		.describe('The optimization id, from `optimizations.list`.'),
});

export type OptimizationsGetInput = z.input<typeof OptimizationsGetInputSchema>;

const OptimizationsGetResponseSchema = z.object({
	optimization: OptimizationSchema,
});

export type OptimizationsGetResponse = z.infer<
	typeof OptimizationsGetResponseSchema
>;

// ── optimizations.create ──────────────────────────────────────────────────

const OptimizationAddressInputSchema = z
	.object({
		address: z.string().optional().describe('A street address, if no lat/lng.'),
		lat: z.number().min(-90).max(90).optional(),
		lng: z.number().min(-180).max(180).optional(),
		alias: z.string().optional(),
		address_1: z.string().optional(),
		address_2: z.string().optional(),
		city: z.string().optional(),
		state_id: z.string().optional(),
		zip: z.string().optional(),
		service_time: z.number().int().optional(),
		time_window_start: z.number().int().optional(),
		time_window_end: z.number().int().optional(),
		priority: z.number().int().optional(),
		weight: z.number().optional(),
		cube: z.number().optional(),
		pieces: z.number().int().optional(),
		revenue: z.number().optional(),
		required_skills: z.array(z.string()).optional(),
	})
	.superRefine((value, ctx) => {
		const hasCoordinates = value.lat !== undefined && value.lng !== undefined;
		const hasAddress = value.address !== undefined;
		if (!hasCoordinates && !hasAddress) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide either `address` or both `lat` and `lng`.',
				path: ['address'],
			});
		}
		// One coordinate without the other is silently rejected by the optimizer.
		if ((value.lat === undefined) !== (value.lng === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: '`lat` and `lng` go together.',
				path: ['lat'],
			});
		}
	});

const OptimizationsCreateInputSchema = z.object({
	addresses: z
		.array(OptimizationAddressInputSchema)
		.min(1)
		.describe('The stops to sequence into routes.'),
	route_max_duration: z
		.number()
		.int()
		.optional()
		.describe('The longest a single route may take, in seconds.'),
	route_max_distance: z.number().optional(),
	vehicle_capacity: z.number().optional(),
	route_name: z.string().optional(),
	algorithm_type: z
		.enum(['TSP', 'VRP', 'CVRP', 'MDVRP'])
		.optional()
		.describe(
			'TSP for one vehicle, VRP for several, CVRP with capacity, MDVRP with multiple depots.',
		),
	distance_unit: z.enum(['mi', 'km']).optional(),
	optimize: z
		.enum(['Distance', 'Time', 'time', 'distance'])
		.optional()
		.describe('What the optimizer minimises.'),
	travel_mode: z.enum(['Driving', 'Walking', 'Trucking', 'Cycling']).optional(),
	shared_publicly: z.boolean().optional(),
});

export type OptimizationsCreateInput = z.input<
	typeof OptimizationsCreateInputSchema
>;

const CreatedOptimizationSchema = z
	.object({
		optimization_problem_id: z.string().nullish(),
		state: z.number().nullish(),
		created_timestamp: z.number().nullish(),
		sent_to_background: z.boolean().nullish(),
		user_errors: z.array(z.string()).nullish(),
		optimization_errors: z.array(z.string()).nullish(),
	})
	.loose();

const OptimizationsCreateResponseSchema = z.object({
	optimization: CreatedOptimizationSchema,
});

export type OptimizationsCreateResponse = z.infer<
	typeof OptimizationsCreateResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type Route4MeEndpointInputs = {
	routesList: RoutesListInput;
	routesGet: RoutesGetInput;
	ordersList: OrdersListInput;
	ordersCreate: OrdersCreateInput;
	vehiclesList: VehiclesListInput;
	vehiclesCreate: VehiclesCreateInput;
	addressesList: AddressesListInput;
	addressesCreate: AddressesCreateInput;
	teamMe: TeamMeInput;
	teamList: TeamListInput;
	optimizationsList: OptimizationsListInput;
	optimizationsGet: OptimizationsGetInput;
	optimizationsCreate: OptimizationsCreateInput;
};

export type Route4MeEndpointOutputs = {
	routesList: RoutesListResponse;
	routesGet: RoutesGetResponse;
	ordersList: OrdersListResponse;
	ordersCreate: OrdersCreateResponse;
	vehiclesList: VehiclesListResponse;
	vehiclesCreate: VehiclesCreateResponse;
	addressesList: AddressesListResponse;
	addressesCreate: AddressesCreateResponse;
	teamMe: TeamMeResponse;
	teamList: TeamListResponse;
	optimizationsList: OptimizationsListResponse;
	optimizationsGet: OptimizationsGetResponse;
	optimizationsCreate: OptimizationsCreateResponse;
};

export const Route4MeEndpointInputSchemas = {
	routesList: RoutesListInputSchema,
	routesGet: RoutesGetInputSchema,
	ordersList: OrdersListInputSchema,
	ordersCreate: OrdersCreateInputSchema,
	vehiclesList: VehiclesListInputSchema,
	vehiclesCreate: VehiclesCreateInputSchema,
	addressesList: AddressesListInputSchema,
	addressesCreate: AddressesCreateInputSchema,
	teamMe: TeamMeInputSchema,
	teamList: TeamListInputSchema,
	optimizationsList: OptimizationsListInputSchema,
	optimizationsGet: OptimizationsGetInputSchema,
	optimizationsCreate: OptimizationsCreateInputSchema,
} as const;

export const Route4MeEndpointOutputSchemas = {
	routesList: RoutesListResponseSchema,
	routesGet: RoutesGetResponseSchema,
	ordersList: OrdersListResponseSchema,
	ordersCreate: OrdersCreateResponseSchema,
	vehiclesList: VehiclesListResponseSchema,
	vehiclesCreate: VehiclesCreateResponseSchema,
	addressesList: AddressesListResponseSchema,
	addressesCreate: AddressesCreateResponseSchema,
	teamMe: TeamMeResponseSchema,
	teamList: TeamListResponseSchema,
	optimizationsList: OptimizationsListResponseSchema,
	optimizationsGet: OptimizationsGetResponseSchema,
	optimizationsCreate: OptimizationsCreateResponseSchema,
} as const;
