import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

// Spec paths verified in Kibana OpenAPI spec (kibana.json):
// GET /api/endpoint_list/items/_find (opId FindEndpointListItems),
// GET /api/security/entity_store/status (response contains engines[] + status),
// GET /api/security/entity_store/entities.
// The engines list is the `engines` array inside the entity-store status
// response — no separate engines endpoint exists in the spec.

export const EndpointListItemsInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
	filter: z.string().optional(),
	sort_field: z.string().optional(),
	sort_order: z.string().optional(),
});
export type EndpointListItemsInput = z.infer<
	typeof EndpointListItemsInputSchema
>;

export const EndpointListItemsResponseSchema = z
	.object({
		page: z.number().optional(),
		per_page: z.number().optional(),
		total: z.number().optional(),
		data: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type EndpointListItemsResponse = z.infer<
	typeof EndpointListItemsResponseSchema
>;

export const EntityStoreStatusInputSchema = z.object({
	include_components: z.boolean().optional(),
});
export type EntityStoreStatusInput = z.infer<
	typeof EntityStoreStatusInputSchema
>;

export const EntityStoreStatusResponseSchema = z
	.object({
		status: z.string().optional(),
		engines: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type EntityStoreStatusResponse = z.infer<
	typeof EntityStoreStatusResponseSchema
>;

export const EntityStoreEnginesInputSchema = z.object({});
export type EntityStoreEnginesInput = z.infer<
	typeof EntityStoreEnginesInputSchema
>;

export const EntityStoreEnginesResponseSchema = z
	.object({
		engines: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type EntityStoreEnginesResponse = z.infer<
	typeof EntityStoreEnginesResponseSchema
>;

export const EntityStoreEntitiesListInputSchema = z.object({
	filter: z.string().optional(),
	filterQuery: z.string().optional(),
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).max(10000).optional(),
	size: z.number().int().min(1).optional(),
	searchAfter: z.string().optional(),
	source: z.union([z.string(), z.array(z.string())]).optional(),
	fields: z.union([z.string(), z.array(z.string())]).optional(),
	sort_field: z.string().optional(),
	sort_order: z.string().optional(),
	entity_types: z.union([z.string(), z.array(z.string())]).optional(),
});
export type EntityStoreEntitiesListInput = z.infer<
	typeof EntityStoreEntitiesListInputSchema
>;

export const EntityStoreEntitiesListResponseSchema = z
	.object({
		records: z.array(z.record(z.string(), z.unknown())).optional(),
		total: z.number().optional(),
	})
	.passthrough();
export type EntityStoreEntitiesListResponse = z.infer<
	typeof EntityStoreEntitiesListResponseSchema
>;

type Ctx = Parameters<KibanaEndpoints['endpointListItems']>[0];

async function baseUrlOf(ctx: Ctx): Promise<string> {
	return ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
}

export const listEndpointItems: KibanaEndpoints['endpointListItems'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.per_page !== undefined) query.per_page = input.per_page;
	if (input.filter !== undefined) query.filter = input.filter;
	if (input.sort_field !== undefined) query.sort_field = input.sort_field;
	if (input.sort_order !== undefined) query.sort_order = input.sort_order;
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['endpointListItems']
	>('api/endpoint_list/items/_find', baseUrl, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'kibana.security.listEndpointItems',
		{ ...input },
		'completed',
	);
	return response;
};

export const entityStoreStatus: KibanaEndpoints['entityStoreStatus'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['entityStoreStatus']
	>('api/security/entity_store/status', baseUrl, ctx.key, {
		method: 'GET',
		query:
			input.include_components !== undefined
				? { include_components: input.include_components }
				: undefined,
	});
	await logEventFromContext(
		ctx,
		'kibana.security.entityStoreStatus',
		{ ...input },
		'completed',
	);
	return response;
};

export const entityStoreEngines: KibanaEndpoints['entityStoreEngines'] = async (
	ctx,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['entityStoreEngines']
	>('api/security/entity_store/status', baseUrl, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'kibana.security.entityStoreEngines',
		{},
		'completed',
	);
	return response;
};

export const entitiesList: KibanaEndpoints['entityStoreEntitiesList'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	// The API has two pagination modes (per spec param descriptions):
	// - page mode: page, per_page, filterQuery, sort_field, sort_order
	// - search-after mode: filter (KQL), size, searchAfter
	// Mixing them returns unfiltered results or is rejected, so only send
	// the params of the selected mode.
	const query: Record<string, string | number | boolean | undefined> = {};
	const joinList = (v: string | string[] | undefined) =>
		Array.isArray(v) ? v.join(',') : v;
	const entityTypes = joinList(input.entity_types);
	if (entityTypes !== undefined) query.entity_types = entityTypes;
	if (input.searchAfter !== undefined) {
		if (input.filter !== undefined) query.filter = input.filter;
		if (input.size !== undefined) query.size = input.size;
		query.searchAfter = input.searchAfter;
		const source = joinList(input.source);
		if (source !== undefined) query.source = source;
		const fields = joinList(input.fields);
		if (fields !== undefined) query.fields = fields;
	} else {
		if (input.filterQuery !== undefined) query.filterQuery = input.filterQuery;
		if (input.page !== undefined) query.page = input.page;
		if (input.per_page !== undefined) query.per_page = input.per_page;
		if (input.sort_field !== undefined) query.sort_field = input.sort_field;
		if (input.sort_order !== undefined) query.sort_order = input.sort_order;
	}
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['entityStoreEntitiesList']
	>('api/security/entity_store/entities', baseUrl, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'kibana.security.entitiesList',
		{ ...input },
		'completed',
	);
	return response;
};
