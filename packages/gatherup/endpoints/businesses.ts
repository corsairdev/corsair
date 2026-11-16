import { asRecord } from 'corsair/core';
import type { GatherupEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call, listShape } from './call';
import {
	GatherupEndpointInputSchemas as Inputs,
	GatherupEndpointOutputSchemas as Outputs,
} from './types';

// GatherUp's default `limit` for a business list.
const BUSINESSES_PAGE_SIZE = 100;

export const list: GatherupEndpoints['businessesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'businesses.list',
			input: Inputs.businessesList,
			output: Outputs.businessesList,
		},
		input,
		// GatherUp names the page size `limit` on this route.
		({ page, perPage }) => ({
			method: 'GET',
			path: '/api/v2/businesses/get',
			query: definedQuery({ page, limit: perPage }),
		}),
		{
			shape: (raw, parsed) => listShape(raw, parsed, BUSINESSES_PAGE_SIZE),
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
		({ by, search: term }) => ({
			method: 'GET',
			path: '/api/v2/business/search',
			query: definedQuery({ by, search: term }),
		}),
		{
			log: (_, result) => ({
				businessId:
					result.businessId == null ? undefined : String(result.businessId),
			}),
		},
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
		{
			shape: typesShape,
			log: (_, result) => ({ count: result.data.length }),
		},
	);

/**
 * GatherUp answers the types as numbered keys beside `errorCode`:
 * `{ "0": "Bar", "1": "Pub", "errorCode": 0 }`. They are gathered, in order,
 * into `data`.
 */
// unknown: the raw body is an untyped object until the output schema runs.
// A body that is not an object, or a numbered entry that is not a string, is
// passed on as is so the output schema refuses it instead of shrinking it.
export function typesShape(raw: unknown) {
	const record = asRecord(raw);
	if (!record) return raw;
	const data = Object.keys(record)
		.filter((key) => /^\d+$/.test(key))
		.sort((a, b) => Number(a) - Number(b))
		.map((key) => record[key]);
	return {
		data,
		errorCode: record.errorCode,
		errorMessage: record.errorMessage,
	};
}

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
		{
			log: (_, result) => ({
				businessId:
					result.businessId == null ? undefined : String(result.businessId),
			}),
		},
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
