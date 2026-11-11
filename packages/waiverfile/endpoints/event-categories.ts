import type { WaiverFileEndpoints } from '..';
import { call } from './call';
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
			log: (parsed, result) => ({
				count: (result.EventCategories ?? result.Categories)?.length ?? 0,
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
			log: (parsed, result) => ({
				id: result.WaiverEventCategoryID ?? undefined,
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
			log: (parsed, result) => ({
				id: result.WaiverEventCategoryID ?? parsed.eventCategoryID,
				name: parsed.name,
			}),
		},
	);

/**
 * Deleting a category is a `POST`, not a `DELETE`, and events in it are left
 * without a category rather than deleted with it.
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
			log: (parsed, result) => ({
				id: parsed.eventCategoryID,
				success: result.Success ?? false,
			}),
		},
	);
