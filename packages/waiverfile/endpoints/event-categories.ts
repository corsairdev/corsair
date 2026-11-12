import type { WaiverFileEndpoints } from '..';
import { call } from './call';
import { dotNetList, fromDotNet } from './shape';
import {
	WaiverFileEndpointInputSchemas as Inputs,
	WaiverFileEndpointOutputSchemas as Outputs,
} from './types';

export const list: WaiverFileEndpoints['eventCategoriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'eventCategories.list',
			input: Inputs.eventCategoriesList,
			output: Outputs.eventCategoriesList,
		},
		input,
		({ includeDisabledCategories }) => ({
			method: 'GET',
			path: '/api/v1/GetEventCategories',
			query: { includeDisabledCategories },
		}),
		{
			shape: (raw) =>
				dotNetList(raw, 'EventCategories', '/api/v1/GetEventCategories'),
			log: (parsed, result) => ({
				count: result.EventCategories?.length ?? 0,
				disabled: parsed.includeDisabledCategories,
			}),
		},
	);

export const create: WaiverFileEndpoints['eventCategoriesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'eventCategories.create',
			input: Inputs.eventCategoriesCreate,
			output: Outputs.eventCategoriesCreate,
		},
		input,
		({ name, active }) => ({
			method: 'POST',
			path: '/api/v1/InsertEventCategory',
			query: { name, active },
		}),
		{
			shape: fromDotNet,
			log: (parsed, result) => ({
				id: result.ID ?? undefined,
				name: parsed.name,
			}),
		},
	);

export const update: WaiverFileEndpoints['eventCategoriesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'eventCategories.update',
			input: Inputs.eventCategoriesUpdate,
			output: Outputs.eventCategoriesUpdate,
		},
		input,
		({ eventCategoryID, name, active }) => ({
			method: 'POST',
			path: '/api/v1/UpdateEventCategory',
			query: { eventCategoryID, name, active },
		}),
		{
			shape: fromDotNet,
			log: (parsed, result) => ({
				id: result.ID ?? parsed.eventCategoryID,
				name: parsed.name,
			}),
		},
	);

/**
 * Deleting a category is a `POST`, not a `DELETE`. Events in it are not changed,
 * and the answer is the category with `Status` 2 (deleted).
 */
export const remove: WaiverFileEndpoints['eventCategoriesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'eventCategories.delete',
			input: Inputs.eventCategoriesDelete,
			output: Outputs.eventCategoriesDelete,
		},
		input,
		({ eventCategoryID }) => ({
			method: 'POST',
			path: '/api/v1/DeleteEventCategory',
			query: { eventCategoryID },
		}),
		{
			shape: fromDotNet,
			log: (parsed, result) => ({
				id: parsed.eventCategoryID,
				status: result.Status ?? undefined,
			}),
		},
	);
