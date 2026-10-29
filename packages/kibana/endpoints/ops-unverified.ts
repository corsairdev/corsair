import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { KibanaEndpoints } from '..';
import { KibanaAPIError, makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

// Live-tested 2026-09-09 on Elastic Cloud serverless:
// - reporting jobs: not in kibana.json; 404 on serverless (stateful-only).
// - _nodes/stats: Elasticsearch API via elasticsearchBaseUrl (stateful-only).
// - index_management/indices: real path, 400 "not available" on serverless.
// Outputs are passthrough-validated.

export const ReportingJobsListInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
});
export type ReportingJobsListInput = z.infer<
	typeof ReportingJobsListInputSchema
>;

export const ReportingJobsListResponseSchema = z
	.object({
		// Job entries are provider-defined; unknown allows safe extension.
		jobs: z.array(z.record(z.string(), z.unknown())).optional(),
		total: z.number().optional(),
	})
	.passthrough();
export type ReportingJobsListResponse = z.infer<
	typeof ReportingJobsListResponseSchema
>;

export const NodeMetricsInputSchema = z.object({
	node_id: z.string().optional(),
	metric: z.union([z.string(), z.array(z.string())]).optional(),
});
export type NodeMetricsInput = z.infer<typeof NodeMetricsInputSchema>;

export const NodeMetricsResponseSchema = z
	.object({
		// Node payloads are provider-defined; unknown allows safe extension.
		nodes: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
export type NodeMetricsResponse = z.infer<typeof NodeMetricsResponseSchema>;

export const IndexIndicesInputSchema = z.object({
	index: z.string().optional(),
});
export type IndexIndicesInput = z.infer<typeof IndexIndicesInputSchema>;

export const IndexIndicesResponseSchema = z
	.object({
		// Index entries are provider-defined; unknown allows safe extension.
		indices: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type IndexIndicesResponse = z.infer<typeof IndexIndicesResponseSchema>;

type Ctx = Parameters<KibanaEndpoints['reportingJobsList']>[0];

async function baseUrlOf(ctx: Ctx): Promise<string> {
	return ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
}

export const listJobs: KibanaEndpoints['reportingJobsList'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.per_page !== undefined) query.per_page = input.per_page;
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['reportingJobsList']
	>('api/reporting/jobs', baseUrl, ctx.key, { method: 'GET', query });
	await logEventFromContext(
		ctx,
		'kibana.reporting.listJobs',
		{ ...input },
		'completed',
	);
	return response;
};

export const nodeMetrics: KibanaEndpoints['nodeMetricsGet'] = async (
	ctx,
	input,
) => {
	// Node stats is an Elasticsearch API — must use elasticsearchBaseUrl.
	// Fail closed when missing instead of calling the wrong service.
	const esBase = ctx.options.elasticsearchBaseUrl;
	if (!esBase) {
		throw new KibanaAPIError(
			'Elasticsearch base URL is required for node metrics (set elasticsearchBaseUrl)',
			'MISSING_ES_BASE_URL',
		);
	}
	const metric = input.metric
		? Array.isArray(input.metric)
			? input.metric.join(',')
			: input.metric
		: undefined;
	const path =
		'_nodes/stats' +
		(input.node_id ? `/${encodeURIComponent(input.node_id)}` : '') +
		(metric ? `/${encodeURIComponent(metric)}` : '');
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['nodeMetricsGet']
	>(path, esBase, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'kibana.metrics.nodeMetrics',
		{ ...input },
		'completed',
	);
	return response;
};

export const listIndices: KibanaEndpoints['indexIndicesList'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['indexIndicesList']
	>('api/index_management/indices', baseUrl, ctx.key, {
		method: 'GET',
		query: input.index !== undefined ? { index: input.index } : undefined,
	});
	await logEventFromContext(
		ctx,
		'kibana.index.listIndices',
		{ ...input },
		'completed',
	);
	return response;
};
