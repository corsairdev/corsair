import { randomUUID } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import { makeFinerWorksRequest } from '../client';
import { deleteImages, saveImages } from './save';
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
 * FinerWorks rejects an `image_library` without `site_id` or with a
 * `session_id` shorter than 8 characters. `site_id` is 2 unless FinerWorks
 * says otherwise, and the session only matters for the `temporary` library
 * (uploads tied to a FinerWorks.com browser session), so the inventory
 * library gets a fresh 32-character id when the caller has none.
 * https://v2.api.finerworks.com/Help/ResourceModel?modelName=image_library
 */
function withLibraryDefaults<
	T extends { site_id?: number | null; session_id?: string | null },
>(library: T): T & { site_id: number; session_id: string } {
	return {
		...library,
		site_id: library.site_id ?? 2,
		session_id: library.session_id ?? randomUUID().replaceAll('-', ''),
	};
}

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
			body: { ...validated, library: withLibraryDefaults(validated.library) },
		},
	);

	await logEventFromContext(
		ctx,
		'finerworks.images.add',
		{ count: validated.images.length, library: validated.library.name },
		'completed',
	);
	const result = ImagesAddOutputSchema.parse(res);
	await saveImages(ctx, result.images);
	return result;
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
		{
			method: 'POST',
			body: { ...validated, library: withLibraryDefaults(validated.library) },
		},
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
	const result = ImagesListOutputSchema.parse(res);
	await saveImages(ctx, result.images);
	return result;
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
	const result = ImagesUpdateOutputSchema.parse(res);
	await saveImages(ctx, result.images);
	return result;
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
		{
			method: 'DELETE',
			body: validated.library
				? { ...validated, library: withLibraryDefaults(validated.library) }
				: validated,
		},
	);

	await logEventFromContext(
		ctx,
		'finerworks.images.delete',
		{ count: validated.guids.length },
		'completed',
	);
	const result = ImagesDeleteOutputSchema.parse(res);
	// Drop the local rows only once FinerWorks confirms the delete.
	if (result.status?.success === true) {
		await deleteImages(ctx, validated.guids);
	}
	return result;
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
