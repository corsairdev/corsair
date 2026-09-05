import { z } from 'zod';
import { logEventFromContext } from 'corsair/core';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

// Spec: https://www.elastic.co/docs/api/doc/kibana (opIds: search-dashboards,
// create-dashboard, get-dashboard, upsert-dashboard, delete-dashboard).
// Paths verified in the Kibana OpenAPI spec (kibana.json):
// GET+POST /api/dashboards, GET+PUT+DELETE /api/dashboards/{id}.
// Request/response shapes are not detailed in the spec — outputs are
// passthrough-validated and inputs carry the documented fields.

export const DashboardsSearchInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
});
export type DashboardsSearchInput = z.infer<typeof DashboardsSearchInputSchema>;

export const DashboardsSearchResponseSchema = z
	.object({
		data: z.array(z.record(z.string(), z.unknown())).optional(),
		meta: z
			.object({
				total: z.number().optional(),
				page: z.number().optional(),
				per_page: z.number().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type DashboardsSearchResponse = z.infer<
	typeof DashboardsSearchResponseSchema
>;

export const DashboardsCreateInputSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	panels: z.array(z.record(z.string(), z.unknown())).optional(),
	dashboard_id: z.string().optional(),
});
export type DashboardsCreateInput = z.infer<typeof DashboardsCreateInputSchema>;

export const DashboardsCreateResponseSchema = z
	.object({
		id: z.string().optional(),
		title: z.string().optional(),
	})
	.passthrough();
export type DashboardsCreateResponse = z.infer<
	typeof DashboardsCreateResponseSchema
>;

export const DashboardsGetInputSchema = z.object({
	id: z.string(),
});
export type DashboardsGetInput = z.infer<typeof DashboardsGetInputSchema>;

export const DashboardsGetResponseSchema = z
	.object({
		id: z.string().optional(),
		title: z.string().optional(),
	})
	.passthrough();
export type DashboardsGetResponse = z.infer<typeof DashboardsGetResponseSchema>;

export const DashboardsUpsertInputSchema = z.object({
	id: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	panels: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type DashboardsUpsertInput = z.infer<typeof DashboardsUpsertInputSchema>;

export const DashboardsUpsertResponseSchema = DashboardsGetResponseSchema;
export type DashboardsUpsertResponse = z.infer<
	typeof DashboardsUpsertResponseSchema
>;

export const DashboardsDeleteInputSchema = z.object({
	id: z.string(),
});
export type DashboardsDeleteInput = z.infer<typeof DashboardsDeleteInputSchema>;

export const DashboardsDeleteResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type DashboardsDeleteResponse = z.infer<
	typeof DashboardsDeleteResponseSchema
>;

async function baseUrlOf(
	ctx: Parameters<KibanaEndpoints['dashboardsSearch']>[0],
): Promise<string> {
	return ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
}

export const search: KibanaEndpoints['dashboardsSearch'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.per_page !== undefined) query.per_page = input.per_page;
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['dashboardsSearch']
	>('api/dashboards', baseUrl, ctx.key, { method: 'GET', query });
	await logEventFromContext(ctx, 'kibana.dashboards.search', { ...input }, 'completed');
	return response;
};

export const create: KibanaEndpoints['dashboardsCreate'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['dashboardsCreate']
	>('api/dashboards', baseUrl, ctx.key, {
		method: 'POST',
		body: { ...input },
	});
	await logEventFromContext(ctx, 'kibana.dashboards.create', { ...input }, 'completed');
	return response;
};

export const get: KibanaEndpoints['dashboardsGet'] = async (ctx, input) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['dashboardsGet']
	>(`api/dashboards/${encodeURIComponent(input.id)}`, baseUrl, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'kibana.dashboards.get', { ...input }, 'completed');
	return response;
};

export const upsert: KibanaEndpoints['dashboardsUpsert'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const { id, ...body } = input;
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['dashboardsUpsert']
	>(`api/dashboards/${encodeURIComponent(id)}`, baseUrl, ctx.key, {
		method: 'PUT',
		body,
	});
	await logEventFromContext(ctx, 'kibana.dashboards.upsert', { ...input }, 'completed');
	return response;
};

export const remove: KibanaEndpoints['dashboardsDelete'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['dashboardsDelete']
	>(`api/dashboards/${encodeURIComponent(input.id)}`, baseUrl, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'kibana.dashboards.delete', { ...input }, 'completed');
	return response;
};
