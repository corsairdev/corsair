import { asRecord } from 'corsair/core';
import type { Route4meEndpoints } from '..';
import { call, queryOf } from './call';
import { singleShape } from './shape';
import {
	Route4MeEndpointInputSchemas as Inputs,
	Route4MeEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The address book answers `{ results, total, fields }`, and it pages by
 * `limit`/`offset` rather than by page number. `next_offset` is derived here
 * rather than in a zod transform, because the docs generator reads a
 * transform's input side and would omit the field from the reference.
 */
export const addressesList: Route4meEndpoints['addressesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'addresses.list',
			input: Inputs.addressesList,
			output: Outputs.addressesList,
		},
		input,
		(parsed) => ({
			host: 'v5',
			method: 'GET',
			path: '/api/v5.0/address-book/addresses/index/all',
			replayable: true,
			query: {
				...queryOf({
					display: parsed.display,
					query: parsed.query,
					limit: parsed.limit,
					offset: parsed.offset,
				}),
				// Repeated parameters; corsair/http repeats an array value.
				display_list: parsed.display_list,
				fields: parsed.fields,
			},
		}),
		{
			shape: (raw, parsed) => {
				const record = asRecord(raw);
				const results = record?.results;
				const total = record?.total;
				const returned = Array.isArray(results) ? results.length : 0;
				const offset = parsed.offset ?? 0;
				const limit = parsed.limit;
				// A full page means there may be more; a short one is the last.
				const hasNext =
					// With no limit Route4Me applies its own default page size (10,000
					// for the address book), so a non-empty page short of the total
					// may have more behind it.
					(limit === undefined ? returned > 0 : returned >= limit) &&
					typeof total === 'number' &&
					offset + returned < total;
				return {
					addresses: results,
					total,
					offset,
					limit: limit ?? null,
					next_offset: hasNext ? offset + returned : null,
				};
			},
			log: (_, result) => ({
				count: result.addresses.length,
				total: result.total ?? 0,
			}),
		},
	);

export const addressesCreate: Route4meEndpoints['addressesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'addresses.create',
			input: Inputs.addressesCreate,
			output: Outputs.addressesCreate,
		},
		input,
		(parsed) => ({
			host: 'v5',
			method: 'POST',
			path: '/api/v5.0/address-book/addresses',
			replayable: false,
			body: queryOf({
				address_1: parsed.address_1,
				address_2: parsed.address_2,
				address_alias: parsed.address_alias,
				address_city: parsed.address_city,
				address_state_id: parsed.address_state_id,
				address_country_id: parsed.address_country_id,
				address_zip: parsed.address_zip,
				cached_lat: parsed.cached_lat,
				cached_lng: parsed.cached_lng,
				curbside_lat: parsed.curbside_lat,
				curbside_lng: parsed.curbside_lng,
				address_group: parsed.address_group,
				first_name: parsed.first_name,
				last_name: parsed.last_name,
				address_email: parsed.address_email,
				address_phone_number: parsed.address_phone_number,
				service_time: parsed.service_time,
				address_weight: parsed.address_weight,
				address_cube: parsed.address_cube,
				address_pieces: parsed.address_pieces,
				address_revenue: parsed.address_revenue,
				address_priority: parsed.address_priority,
				address_reference_no: parsed.address_reference_no,
				address_stop_type: parsed.address_stop_type,
				eligible_pickup: parsed.eligible_pickup,
				eligible_depot: parsed.eligible_depot,
				customer_id: parsed.customer_id,
				address_custom_data: parsed.address_custom_data,
			}),
		}),
		{
			shape: singleShape('address'),
			log: (_, result) => ({ addressId: result.address.address_id ?? 0 }),
		},
	);

export const teamMe: Route4meEndpoints['teamMe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'team.me',
			input: Inputs.teamMe,
			output: Outputs.teamMe,
		},
		input,
		() => ({
			host: 'v5',
			method: 'GET',
			path: '/api/v5.0/team/users/me',
			replayable: true,
		}),
		{
			shape: singleShape('member'),
			log: (_, result) => ({ memberId: result.member.member_id ?? 0 }),
		},
	);

export const teamList: Route4meEndpoints['teamList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'team.list',
			input: Inputs.teamList,
			output: Outputs.teamList,
		},
		input,
		(parsed) => ({
			host: 'v5',
			method: 'GET',
			path: '/api/v5.0/team/users',
			replayable: true,
			query: {
				...queryOf({
					query: parsed.query,
					drivers_only: parsed.drivers_only,
					optimization_problem_id: parsed.optimization_problem_id,
				}),
				facility_ids: parsed.facility_ids,
			},
		}),
		{
			// This host answers a bare array rather than a page envelope.
			shape: (raw) => ({ members: raw }),
			log: (_, result) => ({ count: result.members.length }),
		},
	);
