import { z } from 'zod';
import { logEventFromContext } from 'corsair/core';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

// Spec paths verified in Kibana OpenAPI spec (kibana.json):
// POST|PUT|GET|DELETE /api/actions/connector/{id},
// GET /api/actions/connectors, GET /api/actions/connector_types.
// Connector config/secrets vary by connector type — accepted as validated
// records instead of invented fixed shapes.

export const ConnectorsCreateInputSchema = z.object({
	id: z.string(),
	connector_type_id: z.string(),
	name: z.string(),
	config: z.record(z.string(), z.unknown()).optional(),
	secrets: z.record(z.string(), z.unknown()).optional(),
});
export type ConnectorsCreateInput = z.infer<typeof ConnectorsCreateInputSchema>;

export const ConnectorsCreateResponseSchema = z
	.object({
		id: z.string().optional(),
		connector_type_id: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();
export type ConnectorsCreateResponse = z.infer<
	typeof ConnectorsCreateResponseSchema
>;

export const ConnectorsGetInputSchema = z.object({
	id: z.string(),
});
export type ConnectorsGetInput = z.infer<typeof ConnectorsGetInputSchema>;

export const ConnectorsGetResponseSchema = ConnectorsCreateResponseSchema;
export type ConnectorsGetResponse = z.infer<typeof ConnectorsGetResponseSchema>;

export const ConnectorsListInputSchema = z.object({});
export type ConnectorsListInput = z.infer<typeof ConnectorsListInputSchema>;

export const ConnectorsListResponseSchema = z.array(
	z.record(z.string(), z.unknown()),
);
export type ConnectorsListResponse = z.infer<typeof ConnectorsListResponseSchema>;

export const ConnectorsDeleteInputSchema = z.object({
	id: z.string(),
});
export type ConnectorsDeleteInput = z.infer<typeof ConnectorsDeleteInputSchema>;

export const ConnectorsDeleteResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ConnectorsDeleteResponse = z.infer<
	typeof ConnectorsDeleteResponseSchema
>;

export const ConnectorTypesListInputSchema = z.object({
	feature_id: z.string().optional(),
});
export type ConnectorTypesListInput = z.infer<
	typeof ConnectorTypesListInputSchema
>;

export const ConnectorTypesListResponseSchema = z
	.object({
		connector_types: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type ConnectorTypesListResponse = z.infer<
	typeof ConnectorTypesListResponseSchema
>;

type Ctx = Parameters<KibanaEndpoints['connectorsList']>[0];

async function baseUrlOf(ctx: Ctx): Promise<string> {
	return ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
}

export const create: KibanaEndpoints['connectorsCreate'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const { id, ...body } = input;
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['connectorsCreate']
	>(`api/actions/connector/${encodeURIComponent(id)}`, baseUrl, ctx.key, {
		method: 'POST',
		body,
	});
	await logEventFromContext(ctx, 'kibana.connectors.create', { id }, 'completed');
	return response;
};

export const get: KibanaEndpoints['connectorsGet'] = async (ctx, input) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['connectorsGet']
	>(`api/actions/connector/${encodeURIComponent(input.id)}`, baseUrl, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'kibana.connectors.get', { ...input }, 'completed');
	return response;
};

export const list: KibanaEndpoints['connectorsList'] = async (ctx) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['connectorsList']
	>('api/actions/connectors', baseUrl, ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'kibana.connectors.list', {}, 'completed');
	return response;
};

export const remove: KibanaEndpoints['connectorsDelete'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['connectorsDelete']
	>(`api/actions/connector/${encodeURIComponent(input.id)}`, baseUrl, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'kibana.connectors.delete', { ...input }, 'completed');
	return response;
};

export const listTypes: KibanaEndpoints['connectorTypesList'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['connectorTypesList']
	>('api/actions/connector_types', baseUrl, ctx.key, {
		method: 'GET',
		query:
			input.feature_id !== undefined ? { feature_id: input.feature_id } : undefined,
	});
	await logEventFromContext(
		ctx,
		'kibana.connectors.listTypes',
		{ ...input },
		'completed',
	);
	return response;
};
