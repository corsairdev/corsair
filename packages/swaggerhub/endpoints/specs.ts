import type { SwaggerhubEndpoints } from '..';
import { call, queryOf } from './call';
import {
	SwaggerhubEndpointInputSchemas as Inputs,
	SwaggerhubEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The registry's own listing route. `GET /apis` and `GET /domains` answer a 303
 * that points here, so this is the documented way to enumerate specs.
 */
export const list: SwaggerhubEndpoints['specsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'specs.list',
			input: Inputs.specsList,
			output: Outputs.specsList,
		},
		input,
		({
			specType,
			visibility,
			state,
			owner,
			project,
			specification,
			oas,
			filter,
			query,
			page,
			limit,
			sort,
			order,
			ignoreCount,
		}) => ({
			method: 'GET',
			path: '/specs',
			query: queryOf({
				specType,
				visibility,
				state,
				owner,
				project,
				specification,
				oas,
				filter,
				query,
				page,
				limit,
				sort,
				order,
				ignoreCount,
			}),
		}),
		{
			log: (_, result) => ({
				count: result.apis.length,
				total: result.totalCount ?? undefined,
			}),
		},
	);

/**
 * Structural validation of a definition, independent of any organisation
 * standardization rules. Nothing is saved, so this is the check to run before
 * `apis.save`.
 */
export const validate: SwaggerhubEndpoints['specsValidate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'specs.validate',
			input: Inputs.specsValidate,
			output: Outputs.specsValidate,
		},
		input,
		({ definition, maxProblems, uri }) => ({
			method: 'POST',
			path: '/specs/validate',
			query: queryOf({ maxProblems, uri }),
			body: { definition },
		}),
		{
			log: (_, result) => ({
				valid: result.valid ?? false,
				recognized: result.recognized ?? false,
				errors: result.summary?.errors ?? 0,
			}),
		},
	);
