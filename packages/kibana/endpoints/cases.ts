import { z } from 'zod';
import { logEventFromContext } from 'corsair/core';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

// Spec paths verified in Kibana OpenAPI spec (kibana.json):
// POST /api/cases (opId createCaseDefaultSpace, body required),
// GET /api/cases/_find (opId findCasesDefaultSpace).
// The create-case body varies by connector — accepted as a validated record.

export const CasesCreateInputSchema = z.object({
	title: z.string(),
	description: z.string(),
	owner: z.enum(['cases', 'observability', 'securitySolution']),
	connector: z.record(z.string(), z.unknown()),
	settings: z
		.object({
			syncAlerts: z.boolean(),
			extractObservables: z.boolean().optional(),
		})
		.passthrough(),
	tags: z.array(z.string()),
	body: z.record(z.string(), z.unknown()).optional(),
});
export type CasesCreateInput = z.infer<typeof CasesCreateInputSchema>;

export const CasesCreateResponseSchema = z
	.object({
		id: z.string().optional(),
		title: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type CasesCreateResponse = z.infer<typeof CasesCreateResponseSchema>;

export const CasesListInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
	search: z.string().optional(),
	status: z.string().optional(),
	severity: z.string().optional(),
	assignees: z.union([z.string(), z.array(z.string())]).optional(),
	tags: z.union([z.string(), z.array(z.string())]).optional(),
	sort_field: z.string().optional(),
	sort_order: z.string().optional(),
});
export type CasesListInput = z.infer<typeof CasesListInputSchema>;

export const CasesListResponseSchema = z
	.object({
		page: z.number().optional(),
		per_page: z.number().optional(),
		total: z.number().optional(),
		cases: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type CasesListResponse = z.infer<typeof CasesListResponseSchema>;

type Ctx = Parameters<KibanaEndpoints['casesList']>[0];

async function baseUrlOf(ctx: Ctx): Promise<string> {
	return ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
}

export const create: KibanaEndpoints['casesCreate'] = async (ctx, input) => {
	const baseUrl = await baseUrlOf(ctx);
	const { title, description, owner, connector, settings, tags, body } = input;
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['casesCreate']
	>('api/cases', baseUrl, ctx.key, {
		method: 'POST',
		body: {
			...(body ?? {}),
			title,
			description,
			owner,
			connector,
			settings,
			tags,
		},
	});
	await logEventFromContext(
		ctx,
		'kibana.cases.create',
		{ title, owner },
		'completed',
	);
	return response;
};

export const list: KibanaEndpoints['casesList'] = async (ctx, input) => {
	const baseUrl = await baseUrlOf(ctx);
	const query: Record<string, string | number | boolean | undefined> = {};
	const join = (v: string | string[] | undefined) =>
		Array.isArray(v) ? v.join(',') : v;
	if (input.page !== undefined) query.page = input.page;
	if (input.per_page !== undefined) query.per_page = input.per_page;
	if (input.search !== undefined) query.search = input.search;
	if (input.status !== undefined) query.status = input.status;
	if (input.severity !== undefined) query.severity = input.severity;
	const assignees = join(input.assignees);
	if (assignees !== undefined) query.assignees = assignees;
	const tags = join(input.tags);
	if (tags !== undefined) query.tags = tags;
	if (input.sort_field !== undefined) query.sort_field = input.sort_field;
	if (input.sort_order !== undefined) query.sort_order = input.sort_order;
	const response = await makeKibanaRequest<KibanaEndpointOutputs['casesList']>(
		'api/cases/_find',
		baseUrl,
		ctx.key,
		{ method: 'GET', query },
	);
	await logEventFromContext(ctx, 'kibana.cases.list', { ...input }, 'completed');
	return response;
};
