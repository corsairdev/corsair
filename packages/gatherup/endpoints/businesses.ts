import type { GatherupEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call, listShape } from './call';
import {
	GatherupEndpointInputSchemas as Inputs,
	GatherupEndpointOutputSchemas as Outputs,
} from './types';

export const list: GatherupEndpoints['businessesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'businesses.list',
			input: Inputs.businessesList,
			output: Outputs.businessesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/v2/businesses/get',
			query: definedQuery({ ...parsed }),
		}),
		{
			shape: (raw, parsed) => listShape(raw, parsed),
			log: (_, result) => ({
				count: result.data.length,
				total: result.count ?? undefined,
			}),
		},
	);

export const get: GatherupEndpoints['businessesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'businesses.get',
			input: Inputs.businessesGet,
			output: Outputs.businessesGet,
		},
		input,
		({ businessId }) => ({
			method: 'GET',
			path: '/api/v2/business/get',
			query: definedQuery({ businessId }),
		}),
		{ log: (_, result) => ({ businessId: result.id }) },
	);

export const search: GatherupEndpoints['businessesSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'businesses.search',
			input: Inputs.businessesSearch,
			output: Outputs.businessesSearch,
		},
		input,
		({ search: term }) => ({
			method: 'GET',
			path: '/api/v2/business/search',
			query: definedQuery({ search: term }),
		}),
		{ log: (_, result) => ({ hits: result.data?.length ?? 0 }) },
	);

export const types: GatherupEndpoints['businessesTypes'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'businesses.types',
			input: Inputs.businessesTypes,
			output: Outputs.businessesTypes,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/v2/business/types',
			query: definedQuery({ search: parsed.search }),
		}),
		{ log: (_, result) => ({ count: result.data?.length ?? 0 }) },
	);

export const create: GatherupEndpoints['businessesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'businesses.create',
			input: Inputs.businessesCreate,
			output: Outputs.businessesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/v2/business/create',
			body: Object.fromEntries(
				Object.entries(parsed).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: (_, result) => ({ businessId: result.data?.id ?? undefined }) },
	);

export const update: GatherupEndpoints['businessesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'businesses.update',
			input: Inputs.businessesUpdate,
			output: Outputs.businessesUpdate,
		},
		input,
		({ businessId, ...changes }) => ({
			method: 'PUT',
			path: '/api/v2/business/update',
			body: {
				businessId,
				...Object.fromEntries(
					Object.entries(changes).filter(([, value]) => value !== undefined),
				),
			},
		}),
		{ log: ({ businessId }) => ({ businessId }) },
	);

// Deactivating suspends feedback requests without deleting anything, so it is a
// write rather than a destructive call.
export const deactivate: GatherupEndpoints['businessesDeactivate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'businesses.deactivate',
			input: Inputs.businessesDeactivate,
			output: Outputs.businessesDeactivate,
		},
		input,
		({ businessId }) => ({
			method: 'PUT',
			path: '/api/v2/business/deactivate',
			body: { businessId },
		}),
		{ log: ({ businessId }) => ({ businessId }) },
	);

export const reactivate: GatherupEndpoints['businessesReactivate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'businesses.reactivate',
			input: Inputs.businessesReactivate,
			output: Outputs.businessesReactivate,
		},
		input,
		({ businessId }) => ({
			method: 'PUT',
			path: '/api/v2/business/reactivate',
			body: { businessId },
		}),
		{ log: ({ businessId }) => ({ businessId }) },
	);

// The route is a DELETE whose body still carries the ID, which is unusual
// enough to state.
export const remove: GatherupEndpoints['businessesRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'businesses.delete',
			input: Inputs.businessesRemove,
			output: Outputs.businessesRemove,
		},
		input,
		({ businessId }) => ({
			method: 'DELETE',
			path: '/api/v2/business/delete',
			body: { businessId },
		}),
		{ log: ({ businessId }) => ({ businessId }) },
	);

/** A customer ID is accepted as a string or a number, so it is encoded once. */
export function customerSegment(id: string | number): string {
	return segment(id);
}
