import { asRecord } from 'corsair/core';
import type { Route4meEndpoints } from '..';
import { call, queryOf } from './call';
import { singleShape } from './shape';
import {
	Route4MeEndpointInputSchemas as Inputs,
	Route4MeEndpointOutputSchemas as Outputs,
} from './types';

/**
 * v4 answers **two different shapes on the same route**: a single object when
 * `optimization_problem_id` is passed, and `{ optimizations, totalRecords }`
 * when it is not. Both are read here so a caller does not have to know which
 * form they asked for.
 */
function readsOneOptimization(
	// unknown: this host's body, narrowed by the reads below.
	raw: unknown,
	// unknown: the operation input, narrowed by the caller's parsed type.
	parsed: {
		optimization_problem_id?: string | undefined;
		offset?: number;
		limit?: number;
	},
) {
	const record = asRecord(raw);
	const single = record?.optimization_problem_id !== undefined;

	if (single) {
		return {
			optimizations: [record],
			total_records: 1,
			next_offset: null,
		};
	}

	const optimizations = record?.optimizations;
	const total = record?.totalRecords;
	const returned = Array.isArray(optimizations) ? optimizations.length : 0;
	const offset = parsed.offset ?? 0;
	const limit = parsed.limit;
	const hasNext =
		// With no limit Route4Me applies its own default page size, so any
		// non-empty page short of the total may have more behind it.
		(limit === undefined ? returned > 0 : returned >= limit) &&
		typeof total === 'number' &&
		offset + returned < total;

	return {
		// Passed through unset: a body without the list fails the output parse
		// instead of reading as "no optimizations".
		optimizations,
		total_records: typeof total === 'number' ? total : null,
		next_offset: hasNext ? offset + returned : null,
	};
}

export const list: Route4meEndpoints['optimizationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'optimizations.list',
			input: Inputs.optimizationsList,
			output: Outputs.optimizationsList,
		},
		input,
		(parsed) => ({
			host: 'v4',
			method: 'GET',
			path: '/optimization_problem.php',
			replayable: true,
			query: queryOf({
				optimization_problem_id: parsed.optimization_problem_id,
				state: parsed.state,
				limit: parsed.limit,
				offset: parsed.offset,
				start_date: parsed.start_date,
				end_date: parsed.end_date,
			}),
		}),
		{
			shape: (raw, parsed) => readsOneOptimization(raw, parsed),
			log: (_, result) => ({
				count: result.optimizations.length,
				total: result.total_records ?? 0,
			}),
		},
	);

export const get: Route4meEndpoints['optimizationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'optimizations.get',
			input: Inputs.optimizationsGet,
			output: Outputs.optimizationsGet,
		},
		input,
		(parsed) => ({
			host: 'v4',
			method: 'GET',
			path: '/optimization_problem.php',
			replayable: true,
			query: { optimization_problem_id: parsed.optimization_problem_id },
		}),
		{
			shape: singleShape('optimization'),
			log: (_, result) => ({
				optimizationId: result.optimization.optimization_problem_id ?? '',
				state: result.optimization.state ?? -1,
			}),
		},
	);

export const create: Route4meEndpoints['optimizationsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'optimizations.create',
			input: Inputs.optimizationsCreate,
			output: Outputs.optimizationsCreate,
		},
		input,
		(parsed) => ({
			host: 'v4',
			method: 'POST',
			path: '/optimization_problem.php',
			replayable: false,
			body: {
				addresses: parsed.addresses,
				parameters: queryOf({
					route_max_duration: parsed.route_max_duration,
					route_max_distance: parsed.route_max_distance,
					vehicle_capacity: parsed.vehicle_capacity,
					route_name: parsed.route_name,
					algorithm_type: parsed.algorithm_type,
					distance_unit: parsed.distance_unit,
					optimize: parsed.optimize,
					travel_mode: parsed.travel_mode,
					shared_publicly: parsed.shared_publicly,
				}),
			},
		}),
		{
			shape: singleShape('optimization'),
			// The optimizer runs asynchronously, so a created problem answers with
			// its id and a state rather than with routes.
			log: (parsed, result) => ({
				addresses: parsed.addresses.length,
				optimizationId: result.optimization.optimization_problem_id ?? '',
				state: result.optimization.state ?? -1,
			}),
		},
	);
