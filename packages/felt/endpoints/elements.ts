import { logEventFromContext } from 'corsair/core';
import { makeFeltRequest } from '../client';
import type { FeltEndpoints } from '../index';
import type { ElementGroup, GeoJson } from './types';
import { FeltEndpointInputSchemas, FeltEndpointOutputSchemas } from './types';

export const Elements = {
	list: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.elementsList.parse(rawInput);
		const response = await makeFeltRequest<GeoJson>(
			`/maps/${encodeURIComponent(input.map_id)}/elements`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = FeltEndpointOutputSchemas.elementsList.parse(response);
		await logEventFromContext(
			ctx,
			'felt.elements.list',
			{ map_id: input.map_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['elementsList'],

	upsert: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.elementsUpsert.parse(rawInput);
		const response = await makeFeltRequest<GeoJson>(
			`/maps/${encodeURIComponent(input.map_id)}/elements`,
			ctx.key,
			{
				method: 'POST',
				body: {
					type: input.type ?? 'FeatureCollection',
					features: input.features,
				},
			},
		);
		const parsed = FeltEndpointOutputSchemas.elementsUpsert.parse(response);
		await logEventFromContext(
			ctx,
			'felt.elements.upsert',
			{ map_id: input.map_id, count: input.features.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['elementsUpsert'],

	delete: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.elementsDelete.parse(rawInput);
		await makeFeltRequest<void>(
			`/maps/${encodeURIComponent(input.map_id)}/elements/${encodeURIComponent(input.element_id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = FeltEndpointOutputSchemas.elementsDelete.parse({
			success: true,
			id: input.element_id,
		});
		await logEventFromContext(
			ctx,
			'felt.elements.delete',
			{ map_id: input.map_id, element_id: input.element_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['elementsDelete'],

	listGroups: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.elementsListGroups.parse(rawInput);
		const response = await makeFeltRequest<ElementGroup[]>(
			`/maps/${encodeURIComponent(input.map_id)}/element_groups`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = FeltEndpointOutputSchemas.elementsListGroups.parse(response);
		await logEventFromContext(
			ctx,
			'felt.elements.listGroups',
			{ map_id: input.map_id, count: parsed.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['elementsListGroups'],

	getGroup: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.elementsGetGroup.parse(rawInput);
		const response = await makeFeltRequest<GeoJson>(
			`/maps/${encodeURIComponent(input.map_id)}/element_groups/${encodeURIComponent(input.group_id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = FeltEndpointOutputSchemas.elementsGetGroup.parse(response);
		await logEventFromContext(
			ctx,
			'felt.elements.getGroup',
			{ map_id: input.map_id, group_id: input.group_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['elementsGetGroup'],

	upsertGroups: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.elementsUpsertGroups.parse(rawInput);
		const response = await makeFeltRequest<ElementGroup[]>(
			`/maps/${encodeURIComponent(input.map_id)}/element_groups`,
			ctx.key,
			{
				method: 'POST',
				body: input.groups,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.elementsUpsertGroups.parse(response);
		await logEventFromContext(
			ctx,
			'felt.elements.upsertGroups',
			{ map_id: input.map_id, count: parsed.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['elementsUpsertGroups'],
};
