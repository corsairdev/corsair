import { asRecord } from 'corsair/core';
import type { Route4meEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { pagedShape } from './shape';
import {
	Route4MeEndpointInputSchemas as Inputs,
	Route4MeEndpointOutputSchemas as Outputs,
} from './types';

export const list: Route4meEndpoints['routesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'routes.list',
			input: Inputs.routesList,
			output: Outputs.routesList,
		},
		input,
		(parsed) => ({
			host: 'v5',
			method: 'POST',
			path: '/api/v5.0/routes/list',
			replayable: true,
			body: {
				query: parsed.query,
				search_query: parsed.search_query,
				exclude_ids: parsed.exclude_ids,
				// The reference renders these as `filtersroute_id` and
				// `filtersfacility_ids`; they are `filters.route_id` and
				// `filters.facility_ids`, which is how Route4Me's own SDK sends them.
				filters:
					parsed.route_id !== undefined || parsed.facility_ids !== undefined
						? queryOf({
								route_id: parsed.route_id,
								facility_ids: parsed.facility_ids,
							})
						: undefined,
				timezone: parsed.timezone,
				group_by: parsed.group_by,
				page: parsed.page,
				per_page: parsed.per_page,
				// Route4Me takes an array of [field, direction] pairs.
				order_by: parsed.order_by
					? [[parsed.order_by.field, parsed.order_by.direction]]
					: undefined,
			},
		}),
		{
			shape: pagedShape('routes'),
			log: (_, result) => ({
				count: result.routes.length,
				hasNext: result.next_page !== null,
			}),
		},
	);

export const get: Route4meEndpoints['routesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'routes.get',
			input: Inputs.routesGet,
			output: Outputs.routesGet,
		},
		input,
		(parsed) => ({
			host: 'v5',
			method: 'GET',
			path: `/api/v5.0/routes/${segment(parsed.route_id)}`,
			replayable: true,
			query: queryOf({
				page: parsed.page,
				per_page: parsed.per_page,
			}),
		}),
		{
			shape: (raw) => {
				const record = asRecord(raw);
				// A non-object 200 (the login page, an empty body) is passed on as is
				// so the output parse rejects it rather than reading an empty route.
				if (!record) return raw;
				const meta = asRecord(record.meta);
				const current = meta?.current_page;
				const last = meta?.last_page;
				const hasNext =
					typeof current === 'number' && typeof last === 'number'
						? current < last
						: false;
				return {
					...record,
					next_page:
						hasNext && typeof current === 'number' ? current + 1 : null,
				};
			},
			log: (_, result) => ({
				routeId: result.route_id ?? '',
				destinations: result.destination_count ?? 0,
			}),
		},
	);
