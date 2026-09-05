import { z } from 'zod';
import { logEventFromContext } from 'corsair/core';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

// Spec paths verified in Kibana OpenAPI spec (kibana.json):
// POST|PUT|GET|DELETE /api/alerting/rule/{id},
// GET /api/alerting/rules/_find, GET /api/alerting/rule_types.
// Rule create/update bodies vary by rule type — accepted as a validated
// record instead of an invented fixed shape.

export const AlertingRuleCreateInputSchema = z.object({
	id: z.string(),
	body: z.record(z.string(), z.unknown()),
});
export type AlertingRuleCreateInput = z.infer<typeof AlertingRuleCreateInputSchema>;

export const AlertingRuleCreateResponseSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		consumer: z.string().optional(),
	})
	.passthrough();
export type AlertingRuleCreateResponse = z.infer<
	typeof AlertingRuleCreateResponseSchema
>;

export const AlertingRulesListInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
	search: z.string().optional(),
	filter: z.string().optional(),
	sort_field: z.string().optional(),
	sort_order: z.string().optional(),
});
export type AlertingRulesListInput = z.infer<typeof AlertingRulesListInputSchema>;

export const AlertingRulesListResponseSchema = z
	.object({
		page: z.number().optional(),
		per_page: z.number().optional(),
		total: z.number().optional(),
		data: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type AlertingRulesListResponse = z.infer<
	typeof AlertingRulesListResponseSchema
>;

export const AlertingRuleDeleteInputSchema = z.object({
	id: z.string(),
});
export type AlertingRuleDeleteInput = z.infer<typeof AlertingRuleDeleteInputSchema>;

export const AlertingRuleDeleteResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type AlertingRuleDeleteResponse = z.infer<
	typeof AlertingRuleDeleteResponseSchema
>;

export const AlertingRuleTypesListInputSchema = z.object({});
export type AlertingRuleTypesListInput = z.infer<
	typeof AlertingRuleTypesListInputSchema
>;

export const AlertingRuleTypesListResponseSchema = z
	.object({
		rule_types: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type AlertingRuleTypesListResponse = z.infer<
	typeof AlertingRuleTypesListResponseSchema
>;

type Ctx = Parameters<KibanaEndpoints['alertingRulesList']>[0];

async function baseUrlOf(ctx: Ctx): Promise<string> {
	return ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
}

export const createRule: KibanaEndpoints['alertingRuleCreate'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['alertingRuleCreate']
	>(`api/alerting/rule/${encodeURIComponent(input.id)}`, baseUrl, ctx.key, {
		method: 'POST',
		body: input.body,
	});
	await logEventFromContext(ctx, 'kibana.alerting.createRule', { id: input.id }, 'completed');
	return response;
};

export const listRules: KibanaEndpoints['alertingRulesList'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.per_page !== undefined) query.per_page = input.per_page;
	if (input.search !== undefined) query.search = input.search;
	if (input.filter !== undefined) query.filter = input.filter;
	if (input.sort_field !== undefined) query.sort_field = input.sort_field;
	if (input.sort_order !== undefined) query.sort_order = input.sort_order;
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['alertingRulesList']
	>('api/alerting/rules/_find', baseUrl, ctx.key, { method: 'GET', query });
	await logEventFromContext(ctx, 'kibana.alerting.listRules', { ...input }, 'completed');
	return response;
};

export const deleteRule: KibanaEndpoints['alertingRuleDelete'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['alertingRuleDelete']
	>(`api/alerting/rule/${encodeURIComponent(input.id)}`, baseUrl, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'kibana.alerting.deleteRule', { ...input }, 'completed');
	return response;
};

export const listRuleTypes: KibanaEndpoints['alertingRuleTypesList'] = async (
	ctx,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['alertingRuleTypesList']
	>('api/alerting/rule_types', baseUrl, ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'kibana.alerting.listRuleTypes', {}, 'completed');
	return response;
};
