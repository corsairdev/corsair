import { logEventFromContext } from 'corsair/core';
import { makeFinerWorksRequest } from '../client';
import type { FinerWorksEndpoint } from './shared';
import { resolveCredentials } from './shared';
import {
	GalleriesAddOrUpdateCollectionInputSchema,
	GalleriesAddOrUpdateCollectionOutputSchema,
	GalleriesListInputSchema,
	GalleriesListOutputSchema,
	GalleriesListThemesInputSchema,
	GalleriesListThemesOutputSchema,
} from './types';

/**
 * Create a personal gallery collection, or update one by supplying its id.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-add_update_gallery_collection
 */
export const addOrUpdateCollection: FinerWorksEndpoint<
	'galleries.addOrUpdateCollection'
> = async (ctx, input) => {
	const validated = GalleriesAddOrUpdateCollectionInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/add_update_gallery_collection',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.galleries.addOrUpdateCollection',
		{ id: validated.id ?? null, name: validated.name },
		'completed',
	);
	return GalleriesAddOrUpdateCollectionOutputSchema.parse(res);
};

/**
 * List GeoGalleries.com galleries, optionally filtered to personal galleries
 * or to specific gallery ids.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_galleries
 */
export const list: FinerWorksEndpoint<'galleries.list'> = async (
	ctx,
	input = {},
) => {
	const validated = GalleriesListInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_galleries',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.galleries.list',
		{ personal: validated.personal ?? null },
		'completed',
	);
	return GalleriesListOutputSchema.parse(res);
};

/**
 * The theme options a gallery can be customised with.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_gallery_themes
 */
export const listThemes: FinerWorksEndpoint<'galleries.listThemes'> = async (
	ctx,
	input = {},
) => {
	const validated = GalleriesListThemesInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_gallery_themes',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.galleries.listThemes',
		{},
		'completed',
	);
	return GalleriesListThemesOutputSchema.parse(res);
};

export const GalleriesEndpoints = {
	addOrUpdateCollection,
	list,
	listThemes,
} as const;
