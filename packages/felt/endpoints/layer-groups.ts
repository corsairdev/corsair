import { logEventFromContext } from 'corsair/core';
import { makeFeltRequest } from '../client';
import type { FeltEndpoints } from '../index';
import type { LayerGroup } from './types';
import { FeltEndpointInputSchemas, FeltEndpointOutputSchemas } from './types';

export const LayerGroups = {
	list: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layerGroupsList.parse(rawInput);
		const response = await makeFeltRequest<LayerGroup[]>(
			`/maps/${encodeURIComponent(input.map_id)}/layer_groups`,
			ctx.key,
			{
				method: 'GET',
				query:
					input.include_uploading !== undefined
						? { include_uploading: input.include_uploading }
						: undefined,
			},
		);
		const parsed = FeltEndpointOutputSchemas.layerGroupsList.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layerGroups.list',
			{ map_id: input.map_id, count: parsed.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layerGroupsList'],

	get: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layerGroupsGet.parse(rawInput);
		const response = await makeFeltRequest<LayerGroup>(
			`/maps/${encodeURIComponent(input.map_id)}/layer_groups/${encodeURIComponent(input.layer_group_id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = FeltEndpointOutputSchemas.layerGroupsGet.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layerGroups.get',
			{ map_id: input.map_id, layer_group_id: input.layer_group_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layerGroupsGet'],

	update: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layerGroupsUpdate.parse(rawInput);
		const { map_id, layer_group_id, ...body } = input;
		const response = await makeFeltRequest<LayerGroup>(
			`/maps/${encodeURIComponent(map_id)}/layer_groups/${encodeURIComponent(layer_group_id)}`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed = FeltEndpointOutputSchemas.layerGroupsUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layerGroups.update',
			{ map_id, layer_group_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layerGroupsUpdate'],

	updateBulk: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.layerGroupsUpdateBulk.parse(rawInput);
		const response = await makeFeltRequest<LayerGroup[]>(
			`/maps/${encodeURIComponent(input.map_id)}/layer_groups`,
			ctx.key,
			{
				method: 'POST',
				body: input.layer_groups,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.layerGroupsUpdateBulk.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layerGroups.updateBulk',
			{ map_id: input.map_id, count: parsed.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layerGroupsUpdateBulk'],

	delete: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layerGroupsDelete.parse(rawInput);
		await makeFeltRequest<void>(
			`/maps/${encodeURIComponent(input.map_id)}/layer_groups/${encodeURIComponent(input.layer_group_id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = FeltEndpointOutputSchemas.layerGroupsDelete.parse({
			success: true,
			id: input.layer_group_id,
		});
		await logEventFromContext(
			ctx,
			'felt.layerGroups.delete',
			{ map_id: input.map_id, layer_group_id: input.layer_group_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layerGroupsDelete'],

	publish: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.layerGroupsPublish.parse(rawInput);
		const { map_id, layer_group_id, ...body } = input;
		const response = await makeFeltRequest<LayerGroup>(
			`/maps/${encodeURIComponent(map_id)}/layer_groups/${encodeURIComponent(layer_group_id)}/publish`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed = FeltEndpointOutputSchemas.layerGroupsPublish.parse(response);
		await logEventFromContext(
			ctx,
			'felt.layerGroups.publish',
			{ map_id, layer_group_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['layerGroupsPublish'],
};
