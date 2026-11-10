import type { Route4meEndpoints } from '..';
import { call, queryOf } from './call';
import { bareArrayShape, pagedShape, singleShape } from './shape';
import {
	Route4MeEndpointInputSchemas as Inputs,
	Route4MeEndpointOutputSchemas as Outputs,
} from './types';

export const ordersList: Route4meEndpoints['ordersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.list',
			input: Inputs.ordersList,
			output: Outputs.ordersList,
		},
		input,
		(parsed) => ({
			host: 'v5',
			method: 'POST',
			path: '/api/v5.0/orders/list',
			replayable: true,
			body: {
				page: parsed.page,
				per_page: parsed.per_page,
				search_query: parsed.search_query,
				order_by: parsed.order_by
					? [[parsed.order_by.field, parsed.order_by.direction]]
					: undefined,
				filters: queryOf({
					search_query: parsed.search_query,
					group: parsed.group,
					barcode: parsed.barcode,
				}),
				day_scheduled_for_YYMMDD: parsed.day_scheduled_for,
				day_added_YYMMDD: parsed.day_added,
				statuses: parsed.statuses,
			},
		}),
		{
			shape: pagedShape('orders'),
			log: (_, result) => ({
				count: result.orders.length,
				hasNext: result.next_page !== null,
			}),
		},
	);

export const ordersCreate: Route4meEndpoints['ordersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.create',
			input: Inputs.ordersCreate,
			output: Outputs.ordersCreate,
		},
		input,
		(parsed) => ({
			host: 'v5',
			method: 'POST',
			path: '/api/v5.0/orders',
			replayable: false,
			body: queryOf({
				address_1: parsed.address_1,
				address_2: parsed.address_2,
				address_alias: parsed.address_alias,
				address_city: parsed.address_city,
				address_state_id: parsed.address_state_id,
				address_zip: parsed.address_zip,
				address_country_id: parsed.address_country_id,
				cached_lat: parsed.cached_lat,
				cached_lng: parsed.cached_lng,
				curbside_lat: parsed.curbside_lat,
				curbside_lng: parsed.curbside_lng,
				EXT_FIELD_first_name: parsed.first_name,
				EXT_FIELD_last_name: parsed.last_name,
				EXT_FIELD_email: parsed.email,
				EXT_FIELD_phone: parsed.phone,
				group: parsed.group,
				priority: parsed.priority,
				address_stop_type: parsed.address_stop_type,
				local_time_window_start: parsed.local_time_window_start,
				local_time_window_end: parsed.local_time_window_end,
				local_timezone_string: parsed.local_timezone_string,
				service_time: parsed.service_time,
				weight: parsed.weight,
				cube: parsed.cube,
				pieces: parsed.pieces,
				revenue: parsed.revenue,
				custom_user_fields: parsed.custom_user_fields,
				required_skills: parsed.required_skills,
				facility_ids: parsed.facility_ids,
			}),
		}),
		{
			shape: singleShape('order'),
			log: (_, result) => ({ orderId: result.order.order_id ?? 0 }),
		},
	);

export const vehiclesList: Route4meEndpoints['vehiclesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vehicles.list',
			input: Inputs.vehiclesList,
			output: Outputs.vehiclesList,
		},
		input,
		(parsed) => ({
			host: 'v5',
			method: 'GET',
			path: '/api/v5.0/vehicles',
			replayable: true,
			query: {
				...queryOf({
					show: parsed.show,
					search_query: parsed.search_query,
					query: parsed.query,
					is_operational: parsed.is_operational,
					only_with_profile: parsed.only_with_profile,
					with_multi_unit_fields: parsed.with_multi_unit_fields,
				}),
				// Repeated parameters; corsair/http repeats an array value.
				telematics_connection_ids: parsed.telematics_connection_ids,
				facility_ids: parsed.facility_ids,
			},
		}),
		{
			shape: bareArrayShape('vehicles'),
			log: (_, result) => ({ count: result.vehicles.length }),
		},
	);

export const vehiclesCreate: Route4meEndpoints['vehiclesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'vehicles.create',
			input: Inputs.vehiclesCreate,
			output: Outputs.vehiclesCreate,
		},
		input,
		(parsed) => ({
			host: 'v5',
			method: 'POST',
			path: '/api/v5.0/vehicles',
			replayable: false,
			body: queryOf({
				vehicle_alias: parsed.vehicle_alias,
				vehicle_vin: parsed.vehicle_vin,
				vehicle_license_plate: parsed.vehicle_license_plate,
				vehicle_make: parsed.vehicle_make,
				vehicle_model: parsed.vehicle_model,
				vehicle_model_year: parsed.vehicle_model_year,
				vehicle_reg_state_id: parsed.vehicle_reg_state_id,
				vehicle_reg_country_id: parsed.vehicle_reg_country_id,
				vehicle_type_id: parsed.vehicle_type_id,
				color_id: parsed.color_id,
				fuel_type: parsed.fuel_type,
				vehicle_profile_id: parsed.vehicle_profile_id,
				vehicle_capacity_profile_id: parsed.vehicle_capacity_profile_id,
				is_operational: parsed.is_operational,
				license_start_date: parsed.license_start_date,
				license_end_date: parsed.license_end_date,
				max_height: parsed.max_height,
				max_width: parsed.max_width,
				max_length: parsed.max_length,
				total_weight: parsed.total_weight,
				max_weight_per_axle: parsed.max_weight_per_axle,
				required_skills: parsed.required_skills,
			}),
		}),
		{
			shape: singleShape('vehicle'),
			log: (_, result) => ({ vehicleId: result.vehicle.vehicle_id ?? '' }),
		},
	);
