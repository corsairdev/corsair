import { logEventFromContext } from 'corsair/core';
import { makeFinerWorksRequest } from '../client';
import type { FinerWorksEndpoint } from './shared';
import { resolveCredentials } from './shared';
import {
	ImagesAddInputSchema,
	ImagesAddOutputSchema,
	ImagesDeleteInputSchema,
	ImagesDeleteOutputSchema,
	ImagesListFileSelectionInputSchema,
	ImagesListFileSelectionOutputSchema,
	ImagesListInputSchema,
	ImagesListOutputSchema,
	ImagesUpdateFileSelectionInputSchema,
	ImagesUpdateFileSelectionOutputSchema,
	ImagesUpdateInputSchema,
	ImagesUpdateOutputSchema,
} from './types';

/**
 * Add up to five prepared image files to a FinerWorks library.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-add_images
 */
export const add: FinerWorksEndpoint<'images.add'> = async (ctx, input) => {
	const validated = ImagesAddInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/add_images',
		credentials,
		{
			method: 'POST',
			body: validated,
		},
	);

	await logEventFromContext(
		ctx,
		'finerworks.images.add',
		{ count: validated.images.length, library: validated.library.name },
		'completed',
	);
	return ImagesAddOutputSchema.parse(res);
};

/**
 * Paginated list of uploaded image files, optionally with the virtual
 * inventory products assigned to them.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_images
 */
export const list: FinerWorksEndpoint<'images.list'> = async (ctx, input) => {
	const validated = ImagesListInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_images',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.images.list',
		{
			library: validated.library.name,
			page_number: validated.page_number ?? null,
			per_page: validated.per_page ?? null,
		},
		'completed',
	);
	return ImagesListOutputSchema.parse(res);
};

/**
 * Update image metadata by GUID.
 * https://v2.api.finerworks.com/Help/Api/PUT-v3-update_images
 */
export const update: FinerWorksEndpoint<'images.update'> = async (
	ctx,
	input,
) => {
	const validated = ImagesUpdateInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/update_images',
		credentials,
		{ method: 'PUT', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.images.update',
		{ count: validated.images.length },
		'completed',
	);
	return ImagesUpdateOutputSchema.parse(res);
};

/**
 * Delete image files by GUID. Any virtual inventory products assigned to
 * those images are removed along with them.
 * https://v2.api.finerworks.com/Help/Api/DELETE-v3-delete_images
 */
export const remove: FinerWorksEndpoint<'images.delete'> = async (
	ctx,
	input,
) => {
	const validated = ImagesDeleteInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/delete_images',
		credentials,
		{ method: 'DELETE', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.images.delete',
		{ count: validated.guids.length },
		'completed',
	);
	return ImagesDeleteOutputSchema.parse(res);
};

/**
 * The image GUIDs grouped under a file-selection key.
 * https://v2.api.finerworks.com/Help/Api/GET-v3-list_file_selection_guid
 */
export const listFileSelection: FinerWorksEndpoint<
	'images.listFileSelection'
> = async (ctx, input) => {
	const validated = ImagesListFileSelectionInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_file_selection',
		credentials,
		{ method: 'GET', query: { guid: validated.guid } },
	);

	await logEventFromContext(
		ctx,
		'finerworks.images.listFileSelection',
		{ guid: validated.guid },
		'completed',
	);
	return ImagesListFileSelectionOutputSchema.parse(res);
};

/**
 * Replace the image files currently held under a selection GUID.
 * https://v2.api.finerworks.com/Help/Api/PUT-v3-update_file_selection
 */
export const updateFileSelection: FinerWorksEndpoint<
	'images.updateFileSelection'
> = async (ctx, input) => {
	const validated = ImagesUpdateFileSelectionInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/update_file_selection',
		credentials,
		{ method: 'PUT', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.images.updateFileSelection',
		{ guid: validated.guid, count: validated.guids.length },
		'completed',
	);
	return ImagesUpdateFileSelectionOutputSchema.parse(res);
};

export const ImagesEndpoints = {
	add,
	list,
	update,
	delete: remove,
	listFileSelection,
	updateFileSelection,
} as const;
