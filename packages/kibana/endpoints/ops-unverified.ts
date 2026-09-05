import { z } from 'zod';
import { logEventFromContext } from 'corsair/core';
import type { KibanaEndpoints } from '..';
import { KibanaAPIError, makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

// HONESTY NOTE on path verification (live-tested 2026-09-05 against
// Elastic Cloud serverless 9.6.0):
// - reporting jobs (GET api/reporting/jobs): PARTIALLY verified — the
//   /api/reporting/jobs/* family is the long-documented reporting API
//   (Elastic history; reporting plugin reports "available" on this
//   deployment), but every list variant (GET api/reporting/jobs,
//   GET/POST .../jobs/list, /internal/... equivalents) returns 404 on
//   serverless. The jobs listing API is not exposed on serverless; verify
//   on a stateful stack before relying on it.
// - node metrics (_nodes/stats): path VERIFIED real (serverless answers 410
//   "exists but is not available when running in serverless mode"), but it
//   only returns data on stateful/self-hosted Elasticsearch.
// - index management indices (GET api/index_management/indices): path
//   VERIFIED real (serverless answers 400 "exists but is not available with
//   the current configuration"), but disabled on serverless. Works where the
//   Index Management UI is enabled.
// Outputs are passthrough-validated.

export const ReportingJobsListInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
});
export type ReportingJobsListInput = z.infer<typeof ReportingJobsListInputSchema>;

export const ReportingJobsListResponseSchema = z
	.object({
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
	await logEventFromContext(ctx, 'kibana.reporting.listJobs', { ...input }, 'completed');
	return response;
};

export const nodeMetrics: KibanaEndpoints['nodeMetricsGet'] = async (
	ctx,
	input,
) => {
	// Node stats is an Elasticsearch API, not a Kibana one — it must go to
	// the Elasticsearch host (plugin option `elasticsearchBaseUrl`).
	// Fail closed when it is missing: falling back to the Kibana host would
	// silently call the wrong service.
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
	await logEventFromContext(ctx, 'kibana.metrics.nodeMetrics', { ...input }, 'completed');
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
	await logEventFromContext(ctx, 'kibana.index.listIndices', { ...input }, 'completed');
	return response;
};
