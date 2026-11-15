import { logEventFromContext } from 'corsair/core';
import { makeFeltRequest } from '../client';
import type { FeltEndpoints } from '../index';
import type { LayerComponent } from './types';
import { FeltEndpointInputSchemas, FeltEndpointOutputSchemas } from './types';

export const LayerComponents = {
	list: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layerComponentsList.parse(rawInput);
		const response = await makeFeltRequest<LayerComponent[]>(
			`/maps/${encodeURIComponent(input.map_id)}/layers/${encodeURIComponent(input.layer_id)}/components`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.layerComponentsList.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layerComponents.list',
			{ map_id: input.map_id, layer_id: input.layer_id, count: parsed.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layerComponentsList'],

	create: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.layerComponentsCreate.parse(rawInput);
		const response = await makeFeltRequest<LayerComponent>(
			`/maps/${encodeURIComponent(input.map_id)}/layers/${encodeURIComponent(input.layer_id)}/components`,
			ctx.key,
			{
				method: 'POST',
				body: input.component,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.layerComponentsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layerComponents.create',
			{ map_id: input.map_id, layer_id: input.layer_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layerComponentsCreate'],

	get: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layerComponentsGet.parse(rawInput);
		const response = await makeFeltRequest<LayerComponent>(
			`/maps/${encodeURIComponent(input.map_id)}/layers/${encodeURIComponent(input.layer_id)}/components/${encodeURIComponent(input.component_id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = FeltEndpointOutputSchemas.layerComponentsGet.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layerComponents.get',
			{
				map_id: input.map_id,
				layer_id: input.layer_id,
				component_id: input.component_id,
			},
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layerComponentsGet'],

	update: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.layerComponentsUpdate.parse(rawInput);
		const response = await makeFeltRequest<LayerComponent>(
			`/maps/${encodeURIComponent(input.map_id)}/layers/${encodeURIComponent(input.layer_id)}/components/${encodeURIComponent(input.component_id)}`,
			ctx.key,
			{
				method: 'POST',
				body: input.component,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.layerComponentsUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layerComponents.update',
			{
				map_id: input.map_id,
				layer_id: input.layer_id,
				component_id: input.component_id,
			},
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layerComponentsUpdate'],

	delete: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.layerComponentsDelete.parse(rawInput);
		await makeFeltRequest<void>(
			`/maps/${encodeURIComponent(input.map_id)}/layers/${encodeURIComponent(input.layer_id)}/components/${encodeURIComponent(input.component_id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = FeltEndpointOutputSchemas.layerComponentsDelete.parse({
			success: true,
			id: input.component_id,
		});
		await logEventFromContext(
			ctx,
			'felt.layerComponents.delete',
			{
				map_id: input.map_id,
				layer_id: input.layer_id,
				component_id: input.component_id,
			},
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layerComponentsDelete'],
};
