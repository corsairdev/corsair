import type { GooglePhotosEndpoints } from '..';
import { segment } from '../client';
import { call, rowCount } from './call';
import {
	GooglePhotosEndpointInputSchemas as Inputs,
	GooglePhotosEndpointOutputSchemas as Outputs,
} from './types';

export const list: GooglePhotosEndpoints['albumsList'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'albums.list',
			input: Inputs.albumsList,
			output: Outputs.albumsList,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: '/albums',
			query: {
				pageSize: input.pageSize ?? undefined,
				pageToken: input.pageToken ?? undefined,
				excludeNonAppCreatedData: input.excludeNonAppCreatedData ?? undefined,
			},
		}),
		(result) => rowCount(result.albums),
	);

export const get: GooglePhotosEndpoints['albumsGet'] = async (ctx, rawInput) =>
	call(
		ctx,
		{
			event: 'albums.get',
			input: Inputs.albumsGet,
			output: Outputs.albumsGet,
		},
		rawInput,
		(input) => ({ method: 'GET', path: `/albums/${segment(input.albumId)}` }),
	);

export const create: GooglePhotosEndpoints['albumsCreate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'albums.create',
			input: Inputs.albumsCreate,
			output: Outputs.albumsCreate,
		},
		rawInput,
		(input) => ({ method: 'POST', path: '/albums', body: { album: input } }),
	);

/**
 * albums.patch takes the Album and an `updateMask`. The only field this plugin
 * sends is `title`, which both the method's description and the resource mark
 * as writable.
 */
export const update: GooglePhotosEndpoints['albumsUpdate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'albums.update',
			input: Inputs.albumsUpdate,
			output: Outputs.albumsUpdate,
		},
		rawInput,
		(input) => ({
			method: 'PATCH',
			path: `/albums/${segment(input.albumId)}`,
			query: { updateMask: 'title' },
			body: { title: input.title },
		}),
	);

/**
 * Adds one text or location note to an app-created album. The position is
 * required by the API, so LAST_IN_ALBUM is sent when the caller names none.
 */
export const addEnrichment: GooglePhotosEndpoints['albumsAddEnrichment'] =
	async (ctx, rawInput) =>
		call(
			ctx,
			{
				event: 'albums.addEnrichment',
				input: Inputs.albumsAddEnrichment,
				output: Outputs.albumsAddEnrichment,
			},
			rawInput,
			(input) => ({
				method: 'POST',
				path: `/albums/${segment(input.albumId)}:addEnrichment`,
				body: {
					newEnrichmentItem: input.text
						? { textEnrichment: { text: input.text } }
						: { locationEnrichment: { location: input.location } },
					albumPosition: input.position ?? { position: 'LAST_IN_ALBUM' },
				},
			}),
			(result) => ({ enriched: result.enrichmentItem?.id ? 1 : 0 }),
		);

export const batchAddMediaItems: GooglePhotosEndpoints['albumsBatchAddMediaItems'] =
	async (ctx, rawInput) =>
		call(
			ctx,
			{
				event: 'albums.batchAddMediaItems',
				input: Inputs.albumsBatchAddMediaItems,
				output: Outputs.albumsBatchAddMediaItems,
			},
			rawInput,
			(input) => ({
				method: 'POST',
				path: `/albums/${segment(input.albumId)}:batchAddMediaItems`,
				body: { mediaItemIds: input.mediaItemIds },
			}),
			() => ({ added: true }),
		);

export const batchRemoveMediaItems: GooglePhotosEndpoints['albumsBatchRemoveMediaItems'] =
	async (ctx, rawInput) =>
		call(
			ctx,
			{
				event: 'albums.batchRemoveMediaItems',
				input: Inputs.albumsBatchRemoveMediaItems,
				output: Outputs.albumsBatchRemoveMediaItems,
			},
			rawInput,
			(input) => ({
				method: 'POST',
				path: `/albums/${segment(input.albumId)}:batchRemoveMediaItems`,
				body: { mediaItemIds: input.mediaItemIds },
			}),
			() => ({ removed: true }),
		);
