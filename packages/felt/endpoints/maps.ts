import { logEventFromContext } from 'corsair/core';
import { FELT_SYNC_EXPORT_TIMEOUT_MS, makeFeltRequest } from '../client';
import type { FeltEndpoints } from '../index';
import type { EmbedToken, FeltMap, MapImageExport } from './types';
import { FeltEndpointInputSchemas, FeltEndpointOutputSchemas } from './types';

export const Maps = {
	create: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.mapsCreate.parse(rawInput);
		const response = await makeFeltRequest<FeltMap>('/maps', ctx.key, {
			method: 'POST',
			body: input,
		});
		const parsed = FeltEndpointOutputSchemas.mapsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'felt.maps.create',
			{ id: parsed.id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['mapsCreate'],

	get: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.mapsGet.parse(rawInput);
		const response = await makeFeltRequest<FeltMap>(
			`/maps/${encodeURIComponent(input.map_id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = FeltEndpointOutputSchemas.mapsGet.parse(response);
		await logEventFromContext(
			ctx,
			'felt.maps.get',
			{ id: input.map_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['mapsGet'],

	update: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.mapsUpdate.parse(rawInput);
		const { map_id, ...body } = input;
		const response = await makeFeltRequest<FeltMap>(
			`/maps/${encodeURIComponent(map_id)}/update`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed = FeltEndpointOutputSchemas.mapsUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'felt.maps.update',
			{ id: map_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['mapsUpdate'],

	delete: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.mapsDelete.parse(rawInput);
		await makeFeltRequest<void>(
			`/maps/${encodeURIComponent(input.map_id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = FeltEndpointOutputSchemas.mapsDelete.parse({
			success: true,
			id: input.map_id,
		});
		await logEventFromContext(
			ctx,
			'felt.maps.delete',
			{ id: input.map_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['mapsDelete'],

	duplicate: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.mapsDuplicate.parse(rawInput);
		const { map_id, ...body } = input;
		const response = await makeFeltRequest<FeltMap>(
			`/maps/${encodeURIComponent(map_id)}/duplicate`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed = FeltEndpointOutputSchemas.mapsDuplicate.parse(response);
		await logEventFromContext(
			ctx,
			'felt.maps.duplicate',
			{ id: map_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['mapsDuplicate'],

	move: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.mapsMove.parse(rawInput);
		const { map_id, ...body } = input;
		const response = await makeFeltRequest<FeltMap>(
			`/maps/${encodeURIComponent(map_id)}/move`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed = FeltEndpointOutputSchemas.mapsMove.parse(response);
		await logEventFromContext(
			ctx,
			'felt.maps.move',
			{ id: map_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['mapsMove'],

	exportImage: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.mapsExportImage.parse(rawInput);
		const { map_id, ...body } = input;
		const response = await makeFeltRequest<MapImageExport>(
			`/maps/${encodeURIComponent(map_id)}/image_exports`,
			ctx.key,
			{
				method: 'POST',
				body,
				timeoutMs: FELT_SYNC_EXPORT_TIMEOUT_MS,
			},
		);
		const parsed = FeltEndpointOutputSchemas.mapsExportImage.parse(response);
		await logEventFromContext(
			ctx,
			'felt.maps.exportImage',
			{ map_id, export_id: parsed.id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['mapsExportImage'],

	createEmbedToken: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.mapsCreateEmbedToken.parse(rawInput);
		const response = await makeFeltRequest<EmbedToken>(
			`/maps/${encodeURIComponent(input.map_id)}/embed_token`,
			ctx.key,
			{
				method: 'POST',
				query: { user_email: input.user_email },
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.mapsCreateEmbedToken.parse(response);
		await logEventFromContext(
			ctx,
			'felt.maps.createEmbedToken',
			{ map_id: input.map_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['mapsCreateEmbedToken'],
};
