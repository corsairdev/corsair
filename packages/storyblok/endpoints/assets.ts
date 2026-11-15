import type { StoryblokEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	StoryblokEndpointInputSchemas as Inputs,
	StoryblokEndpointOutputSchemas as Outputs,
} from './types';

export const list: StoryblokEndpoints['assetsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'assets.list',
			input: Inputs.assetsList,
			output: Outputs.assetsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/assets', query }),
		{ log: (_, result) => ({ count: result.assets.length }) },
	);

export const get: StoryblokEndpoints['assetsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'assets.get',
			input: Inputs.assetsGet,
			output: Outputs.assetsGet,
		},
		input,
		({ asset_id }) => ({ method: 'GET', path: `/assets/${segment(asset_id)}` }),
		{ log: ({ asset_id }) => ({ assetId: asset_id }) },
	);

/** Asset metadata only: uploading a new file is a separate signed-upload flow. */
export const update: StoryblokEndpoints['assetsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'assets.update',
			input: Inputs.assetsUpdate,
			output: Outputs.assetsUpdate,
		},
		input,
		({ asset_id, ...asset }) => ({
			method: 'PUT',
			path: `/assets/${segment(asset_id)}`,
			body: { asset },
		}),
		{ log: ({ asset_id }) => ({ assetId: asset_id }) },
	);

export const remove: StoryblokEndpoints['assetsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'assets.delete',
			input: Inputs.assetsDelete,
			output: Outputs.assetsDelete,
		},
		input,
		({ asset_id }) => ({
			method: 'DELETE',
			path: `/assets/${segment(asset_id)}`,
		}),
		{ log: ({ asset_id }) => ({ assetId: asset_id }) },
	);

export const bulkDelete: StoryblokEndpoints['assetsBulkDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'assets.bulkDelete',
			input: Inputs.assetsBulkDelete,
			output: Outputs.assetsBulkDelete,
		},
		input,
		({ ids }) => ({
			method: 'POST',
			path: '/assets/bulk_destroy',
			body: { ids },
		}),
		{
			log: ({ ids }, result) => ({
				requested: ids.length,
				deleted: result.deleted ?? undefined,
			}),
		},
	);
