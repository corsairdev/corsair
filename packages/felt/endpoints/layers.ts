import { logEventFromContext } from 'corsair/core';
import { makeFeltRequest } from '../client';
import type { FeltEndpoints } from '../index';
import type {
	AddSourceLayerAccepted,
	CustomExportRequestStatus,
	CustomExportResponse,
	DuplicateLayersResponse,
	ExportLink,
	FeltLayer,
	LayerLibrary,
	UploadResponse,
} from './types';
import { FeltEndpointInputSchemas, FeltEndpointOutputSchemas } from './types';

export const Layers = {
	list: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layersList.parse(rawInput);
		const response = await makeFeltRequest<FeltLayer[]>(
			`/maps/${encodeURIComponent(input.map_id)}/layers`,
			ctx.key,
			{
				method: 'GET',
				query:
					input.include_uploading !== undefined
						? { include_uploading: input.include_uploading }
						: undefined,
			},
		);
		const parsed = FeltEndpointOutputSchemas.layersList.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layers.list',
			{ map_id: input.map_id, count: parsed.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersList'],

	get: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layersGet.parse(rawInput);
		const response = await makeFeltRequest<FeltLayer>(
			`/maps/${encodeURIComponent(input.map_id)}/layers/${encodeURIComponent(input.layer_id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = FeltEndpointOutputSchemas.layersGet.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layers.get',
			{ map_id: input.map_id, layer_id: input.layer_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersGet'],

	update: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layersUpdate.parse(rawInput);
		const response = await makeFeltRequest<FeltLayer[]>(
			`/maps/${encodeURIComponent(input.map_id)}/layers`,
			ctx.key,
			{
				method: 'POST',
				body: input.layers,
			},
		);
		const parsed = FeltEndpointOutputSchemas.layersUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layers.update',
			{ map_id: input.map_id, count: parsed.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersUpdate'],

	delete: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layersDelete.parse(rawInput);
		await makeFeltRequest<void>(
			`/maps/${encodeURIComponent(input.map_id)}/layers/${encodeURIComponent(input.layer_id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = FeltEndpointOutputSchemas.layersDelete.parse({
			success: true,
			id: input.layer_id,
		});
		await logEventFromContext(
			ctx,
			'felt.layers.delete',
			{ map_id: input.map_id, layer_id: input.layer_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersDelete'],

	upload: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layersUpload.parse(rawInput);
		const { map_id, ...body } = input;
		const response = await makeFeltRequest<UploadResponse>(
			`/maps/${encodeURIComponent(map_id)}/upload`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed = FeltEndpointOutputSchemas.layersUpload.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layers.upload',
			{ map_id, layer_id: parsed.layer_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersUpload'],

	addFromSource: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layersAddFromSource.parse(rawInput);
		const { map_id, ...body } = input;
		const response = await makeFeltRequest<AddSourceLayerAccepted>(
			`/maps/${encodeURIComponent(map_id)}/add_source_layer`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.layersAddFromSource.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layers.addFromSource',
			{ map_id, from: input.from },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersAddFromSource'],

	refresh: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layersRefresh.parse(rawInput);
		const response = await makeFeltRequest<UploadResponse>(
			`/maps/${encodeURIComponent(input.map_id)}/layers/${encodeURIComponent(input.layer_id)}/refresh`,
			ctx.key,
			{
				method: 'POST',
			},
		);
		const parsed = FeltEndpointOutputSchemas.layersRefresh.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layers.refresh',
			{ map_id: input.map_id, layer_id: input.layer_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersRefresh'],

	updateStyle: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layersUpdateStyle.parse(rawInput);
		const response = await makeFeltRequest<FeltLayer>(
			`/maps/${encodeURIComponent(input.map_id)}/layers/${encodeURIComponent(input.layer_id)}/update_style`,
			ctx.key,
			{
				method: 'POST',
				body: { style: input.style },
			},
		);
		const parsed = FeltEndpointOutputSchemas.layersUpdateStyle.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layers.updateStyle',
			{ map_id: input.map_id, layer_id: input.layer_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersUpdateStyle'],

	publish: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layersPublish.parse(rawInput);
		const { map_id, layer_id, ...body } = input;
		const response = await makeFeltRequest<FeltLayer>(
			`/maps/${encodeURIComponent(map_id)}/layers/${encodeURIComponent(layer_id)}/publish`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed = FeltEndpointOutputSchemas.layersPublish.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layers.publish',
			{ map_id, layer_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersPublish'],

	createCustomExport: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.layersCreateCustomExport.parse(rawInput);
		const { map_id, layer_id, ...body } = input;
		const response = await makeFeltRequest<CustomExportResponse>(
			`/maps/${encodeURIComponent(map_id)}/layers/${encodeURIComponent(layer_id)}/custom_export`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.layersCreateCustomExport.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layers.createCustomExport',
			{ map_id, layer_id, export_id: parsed.export_request_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersCreateCustomExport'],

	pollCustomExport: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.layersPollCustomExport.parse(rawInput);
		const response = await makeFeltRequest<CustomExportRequestStatus>(
			`/maps/${encodeURIComponent(input.map_id)}/layers/${encodeURIComponent(input.layer_id)}/custom_exports/${encodeURIComponent(input.export_id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.layersPollCustomExport.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layers.pollCustomExport',
			{
				map_id: input.map_id,
				layer_id: input.layer_id,
				export_id: input.export_id,
			},
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersPollCustomExport'],

	getExportLink: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layersGetExportLink.parse(rawInput);
		const response = await makeFeltRequest<ExportLink>(
			`/maps/${encodeURIComponent(input.map_id)}/layers/${encodeURIComponent(input.layer_id)}/get_export_link`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.layersGetExportLink.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layers.getExportLink',
			{ map_id: input.map_id, layer_id: input.layer_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersGetExportLink'],

	duplicate: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layersDuplicate.parse(rawInput);
		const response = await makeFeltRequest<DuplicateLayersResponse>(
			'/duplicate_layers',
			ctx.key,
			{
				method: 'POST',
				body: input.layers,
			},
		);
		const parsed = FeltEndpointOutputSchemas.layersDuplicate.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layers.duplicate',
			{ count: input.layers.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layersDuplicate'],

	listLibrary: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layersListLibrary.parse(rawInput);
		const response = await makeFeltRequest<LayerLibrary>('/library', ctx.key, {
			method: 'GET',
			query: input.source ? { source: input.source } : undefined,
		});
		const parsed = FeltEndpointOutputSchemas.layersListLibrary.parse(response);
		await logEventFromContext(ctx, 'felt.layers.listLibrary', {}, 'completed');
		return parsed;
	}) as FeltEndpoints['layersListLibrary'],
};
