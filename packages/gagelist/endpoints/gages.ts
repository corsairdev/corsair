import type { GagelistEndpoints } from '..';
import { segment } from '../client';
import { call, listShape } from './call';
import {
	GagelistEndpointInputSchemas as Inputs,
	GagelistEndpointOutputSchemas as Outputs,
} from './types';

const DEFAULT_PAGE = 50;

export const list: GagelistEndpoints['gagesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'gages.list',
			input: Inputs.gagesList,
			output: Outputs.gagesList,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/GageList/api/Gage/List',
			// A read, even though it is a POST.
			replayable: true,
			// The paging travels in the body, which is what this route documents.
			body: {
				start: parsed.start ?? 0,
				record_number: parsed.record_number ?? DEFAULT_PAGE,
			},
		}),
		{
			shape: (raw, parsed) => listShape(raw, parsed, DEFAULT_PAGE),
			log: (_, result) => ({
				count: result.data.length,
				total: result.total ?? undefined,
			}),
		},
	);

export const get: GagelistEndpoints['gagesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'gages.get',
			input: Inputs.gagesGet,
			output: Outputs.gagesGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/GageList/api/Gage/Detail/${segment(id)}`,
		}),
		{ log: (_, result) => ({ gageId: result.data.Id }) },
	);

export const create: GagelistEndpoints['gagesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'gages.create',
			input: Inputs.gagesCreate,
			output: Outputs.gagesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/GageList/api/Gage/Create',
			body: Object.fromEntries(
				Object.entries(parsed).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: (_, result) => ({ gageId: result.data }) },
	);

// The update route takes the whole record with its `Id`, not a partial body.
export const update: GagelistEndpoints['gagesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'gages.update',
			input: Inputs.gagesUpdate,
			output: Outputs.gagesUpdate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/GageList/api/Gage/Update',
			body: Object.fromEntries(
				Object.entries(parsed).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: ({ Id }) => ({ gageId: Id }) },
	);

// GageList deletes with a POST to a `Delete/{id}` path, not with DELETE.
export const remove: GagelistEndpoints['gagesRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'gages.delete',
			input: Inputs.gagesRemove,
			output: Outputs.gagesRemove,
		},
		input,
		({ id }) => ({
			method: 'POST',
			path: `/GageList/api/Gage/Delete/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ gageId: id }) },
	);
