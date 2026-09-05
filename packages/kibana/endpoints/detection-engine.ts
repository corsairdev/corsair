import { z } from 'zod';
import { logEventFromContext } from 'corsair/core';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

// Spec paths verified in Kibana OpenAPI spec (kibana.json):
// GET /api/detection_engine/rules/_find (opId FindRules),
// POST /api/detection_engine/signals/search (opId SearchAlerts).
// The alerts search body is an Elasticsearch query — accepted as a validated
// record instead of an invented fixed shape.

export const DetectionRulesFindInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
	filter: z.string().optional(),
	sort_field: z.string().optional(),
	sort_order: z.string().optional(),
	fields: z.union([z.string(), z.array(z.string())]).optional(),
});
export type DetectionRulesFindInput = z.infer<typeof DetectionRulesFindInputSchema>;

export const DetectionRulesFindResponseSchema = z
	.object({
		page: z.number().optional(),
		per_page: z.number().optional(),
		total: z.number().optional(),
		data: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type DetectionRulesFindResponse = z.infer<
	typeof DetectionRulesFindResponseSchema
>;

export const AlertsFindInputSchema = z.object({
	query: z.record(z.string(), z.unknown()).optional(),
	aggs: z.record(z.string(), z.unknown()).optional(),
	size: z.number().optional(),
});
export type AlertsFindInput = z.infer<typeof AlertsFindInputSchema>;

export const AlertsFindResponseSchema = z
	.object({
		hits: z.record(z.string(), z.unknown()).optional(),
		aggregations: z.record(z.string(), z.unknown()).optional(),
		took: z.number().optional(),
		timed_out: z.boolean().optional(),
	})
	.passthrough();
export type AlertsFindResponse = z.infer<typeof AlertsFindResponseSchema>;

type Ctx = Parameters<KibanaEndpoints['detectionRulesFind']>[0];

async function baseUrlOf(ctx: Ctx): Promise<string> {
	return ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
}

export const findRules: KibanaEndpoints['detectionRulesFind'] = async (
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
	if (input.fields !== undefined)
		query.fields = Array.isArray(input.fields)
			? input.fields.join(',')
			: input.fields;
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['detectionRulesFind']
	>('api/detection_engine/rules/_find', baseUrl, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'kibana.detection.findRules', { ...input }, 'completed');
	return response;
};

export const findAlerts: KibanaEndpoints['detectionAlertsFind'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['detectionAlertsFind']
	>('api/detection_engine/signals/search', baseUrl, ctx.key, {
		method: 'POST',
		body: { ...input },
	});
	await logEventFromContext(ctx, 'kibana.detection.findAlerts', {}, 'completed');
	return response;
};
