import type { StorerocketEndpoints } from '..';
import type { StorerocketQuery } from '../client';
import { call, includeFlag } from './call';
import {
	StorerocketEndpointInputSchemas as Inputs,
	isSupportedFilter,
	StorerocketEndpointOutputSchemas as Outputs,
} from './types';

type Includes = {
	includeHours?: boolean;
	includeSpecialHours?: boolean;
	includeFilters?: boolean;
	includeFields?: boolean;
	includeCallsToAction?: boolean;
};

/** Encodes the include flags and bracket-notation filters onto the wire. */
function listQuery(
	parsed: {
		page?: number;
		limit?: number;
		filters?: Array<{ field: string; op: string; value: string }>;
	} & Includes,
): StorerocketQuery {
	const query: StorerocketQuery = {
		page: parsed.page,
		limit: parsed.limit,
		includeHours: includeFlag(parsed.includeHours),
		includeSpecialHours: includeFlag(parsed.includeSpecialHours),
		includeFilters: includeFlag(parsed.includeFilters),
		includeFields: includeFlag(parsed.includeFields),
		includeCallsToAction: includeFlag(parsed.includeCallsToAction),
	};
	if (parsed.filters) {
		for (const filter of parsed.filters) {
			// Validated against the documented operator table by the schema.
			if (!isSupportedFilter(filter.field, filter.op)) continue;
			query[`${filter.field}[${filter.op}]`] = filter.value;
		}
	}
	return query;
}

export const list: StorerocketEndpoints['locationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'locations.list',
			input: Inputs.locationsList,
			output: Outputs.locationsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/projects/${encodeURIComponent(parsed.projectId)}/locations`,
			query: listQuery(parsed),
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				page: result.meta?.current_page ?? undefined,
				lastPage: result.meta?.last_page ?? undefined,
			}),
		},
	);

export const get: StorerocketEndpoints['locationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'locations.get',
			input: Inputs.locationsGet,
			output: Outputs.locationsGet,
		},
		input,
		({ projectId, locationId, ...includes }) => ({
			method: 'GET',
			path: `/projects/${encodeURIComponent(projectId)}/locations/${encodeURIComponent(locationId)}`,
			query: listQuery(includes),
		}),
		{
			log: (_, result) => ({ locationId: result.data.id ?? undefined }),
		},
	);

export const create: StorerocketEndpoints['locationsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'locations.create',
			input: Inputs.locationsCreate,
			output: Outputs.locationsCreate,
		},
		input,
		({ projectId, ...body }) => ({
			method: 'POST',
			path: `/projects/${encodeURIComponent(projectId)}/locations`,
			body,
		}),
		{
			log: (_, result) => ({ locationId: result.data.id ?? undefined }),
		},
	);

export const update: StorerocketEndpoints['locationsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'locations.update',
			input: Inputs.locationsUpdate,
			output: Outputs.locationsUpdate,
		},
		input,
		({ projectId, locationId, ...body }) => ({
			method: 'PATCH',
			path: `/projects/${encodeURIComponent(projectId)}/locations/${encodeURIComponent(locationId)}`,
			body,
		}),
		{
			log: (_, result) => ({ locationId: result.data.id ?? undefined }),
		},
	);

export const replace: StorerocketEndpoints['locationsReplace'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'locations.replace',
			input: Inputs.locationsReplace,
			output: Outputs.locationsReplace,
		},
		input,
		({ projectId, locationId, ...body }) => ({
			method: 'PUT',
			path: `/projects/${encodeURIComponent(projectId)}/locations/${encodeURIComponent(locationId)}`,
			body,
		}),
		{
			log: (_, result) => ({ locationId: result.data.id ?? undefined }),
		},
	);

export const remove: StorerocketEndpoints['locationsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'locations.delete',
			input: Inputs.locationsDelete,
			output: Outputs.locationsDelete,
		},
		input,
		({ projectId, locationId }) => ({
			method: 'DELETE',
			path: `/projects/${encodeURIComponent(projectId)}/locations/${encodeURIComponent(locationId)}`,
		}),
		{
			log: () => ({ deleted: true }),
		},
	);
