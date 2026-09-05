import { z } from 'zod';
import { logEventFromContext } from 'corsair/core';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

// Spec paths verified in Kibana OpenAPI spec (kibana.json):
// GET /api/data_views (opId getAllDataViewsDefault),
// POST /api/data_views/data_view (opId createDataViewDefaultw, body required
// with data_view.title).

export const DataViewsListInputSchema = z.object({});
export type DataViewsListInput = z.infer<typeof DataViewsListInputSchema>;

export const DataViewsListResponseSchema = z
	.object({
		data_view: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type DataViewsListResponse = z.infer<typeof DataViewsListResponseSchema>;

export const DataViewsCreateInputSchema = z.object({
	title: z.string(),
	name: z.string().optional(),
	id: z.string().optional(),
	timeFieldName: z.string().optional(),
	override: z.boolean().optional(),
});
export type DataViewsCreateInput = z.infer<typeof DataViewsCreateInputSchema>;

export const DataViewsCreateResponseSchema = z
	.object({
		data_view: z
			.object({
				id: z.string().optional(),
				title: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type DataViewsCreateResponse = z.infer<typeof DataViewsCreateResponseSchema>;

type Ctx = Parameters<KibanaEndpoints['dataViewsList']>[0];

async function baseUrlOf(ctx: Ctx): Promise<string> {
	return ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
}

export const list: KibanaEndpoints['dataViewsList'] = async (ctx) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['dataViewsList']
	>('api/data_views', baseUrl, ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'kibana.dataViews.list', {}, 'completed');
	return response;
};

export const create: KibanaEndpoints['dataViewsCreate'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const { override, ...view } = input;
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['dataViewsCreate']
	>('api/data_views/data_view', baseUrl, ctx.key, {
		method: 'POST',
		body: {
			data_view: { ...view },
			...(override !== undefined ? { override } : {}),
		},
	});
	await logEventFromContext(ctx, 'kibana.dataViews.create', { ...input }, 'completed');
	return response;
};
