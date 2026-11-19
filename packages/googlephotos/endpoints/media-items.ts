import { logEventFromContext } from 'corsair/core';
import type { GooglePhotosEndpoints } from '..';
import { makeGooglePhotosRequest, segment, uploadMediaBytes } from '../client';
import { call, rowCount } from './call';
import {
	GooglePhotosEndpointInputSchemas as Inputs,
	GooglePhotosEndpointOutputSchemas as Outputs,
} from './types';

export const search: GooglePhotosEndpoints['mediaItemsSearch'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'mediaItems.search',
			input: Inputs.mediaItemsSearch,
			output: Outputs.mediaItemsSearch,
		},
		rawInput,
		(input) => ({
			method: 'POST',
			path: '/mediaItems:search',
			// The API documents that filters and albumId cannot be combined, which
			// the input schema has already refused.
			body: {
				...(input.albumId ? { albumId: input.albumId } : {}),
				...(input.filters ? { filters: input.filters } : {}),
				...(input.orderBy ? { orderBy: input.orderBy } : {}),
				...(input.pageSize === undefined || input.pageSize === null
					? {}
					: { pageSize: input.pageSize }),
				...(input.pageToken ? { pageToken: input.pageToken } : {}),
			},
		}),
		(result) => rowCount(result.mediaItems),
	);

export const list: GooglePhotosEndpoints['mediaItemsList'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'mediaItems.list',
			input: Inputs.mediaItemsList,
			output: Outputs.mediaItemsList,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: '/mediaItems',
			query: {
				pageSize: input.pageSize ?? undefined,
				pageToken: input.pageToken ?? undefined,
			},
		}),
		(result) => rowCount(result.mediaItems),
	);

export const get: GooglePhotosEndpoints['mediaItemsGet'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'mediaItems.get',
			input: Inputs.mediaItemsGet,
			output: Outputs.mediaItemsGet,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/mediaItems/${segment(input.mediaItemId)}`,
		}),
	);

/**
 * mediaItems.batchGet answers one result per requested id, and an entry can
 * carry a status instead of an item, so the caller sees which ids failed.
 */
export const batchGet: GooglePhotosEndpoints['mediaItemsBatchGet'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'mediaItems.batchGet',
			input: Inputs.mediaItemsBatchGet,
			output: Outputs.mediaItemsBatchGet,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: '/mediaItems:batchGet',
			// Google reads repeated `mediaItemIds` parameters; core's serializer
			// sends one per array entry. A comma-joined string would be one id.
			query: { mediaItemIds: input.mediaItemIds },
		}),
		(result) => rowCount(result.mediaItemResults),
	);

/**
 * Patches one field: `description`. The method's updateMask documentation
 * states it is the only valid value, so the endpoint sends exactly that.
 */
export const update: GooglePhotosEndpoints['mediaItemsUpdate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'mediaItems.update',
			input: Inputs.mediaItemsUpdate,
			output: Outputs.mediaItemsUpdate,
		},
		rawInput,
		(input) => ({
			method: 'PATCH',
			path: `/mediaItems/${segment(input.mediaItemId)}`,
			query: { updateMask: 'description' },
			body: { description: input.description },
		}),
	);

/**
 * The two-step create. The bytes go to `/uploads` first, which returns a token
 * as plain text; batchCreate then turns up to 50 tokens into media items.
 *
 * One call does both steps, so it either creates the items or reports which
 * upload failed. The upload is deliberately not replayed: a token is spent by
 * the create, so a retry would need a fresh upload.
 */
export const create: GooglePhotosEndpoints['mediaItemsCreate'] = async (
	ctx,
	rawInput,
) => {
	const parsed = Inputs.mediaItemsCreate.parse(rawInput ?? {});

	// Uploads run in sequence: the API guide asks callers not to run write calls
	// for one user in parallel.
	const newMediaItems: Array<{
		description?: string;
		simpleMediaItem: { uploadToken: string; fileName: string };
	}> = [];
	for (const item of parsed.newMediaItems) {
		const uploadToken = await uploadMediaBytes(
			ctx.key,
			Buffer.from(item.bytes, 'base64'),
			item.contentType,
		);
		newMediaItems.push({
			...(item.description ? { description: item.description } : {}),
			simpleMediaItem: { uploadToken, fileName: item.fileName },
		});
	}

	const raw = await makeGooglePhotosRequest(ctx.key, {
		method: 'POST',
		path: '/mediaItems:batchCreate',
		body: {
			newMediaItems,
			...(parsed.albumId ? { albumId: parsed.albumId } : {}),
			...(parsed.albumPosition ? { albumPosition: parsed.albumPosition } : {}),
		},
	});
	const result = Outputs.mediaItemsCreate.parse(raw);

	await logEventFromContext(
		ctx,
		'googlephotos.mediaItems.create',
		{ created: result.newMediaItemResults?.length ?? 0 },
		'completed',
	);
	return result;
};
