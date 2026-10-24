import type { RenderEndpoints } from '..';
import { makeRenderRequest } from '../client';

type Context = { key: string };
// Stricter typing is not feasible because metric filters differ by Render
// resource and are validated by the registered endpoint schema.
type Input = Record<string, unknown>;

const metric = <T>(ctx: Context, path: string, input: Input) =>
	makeRenderRequest<T>(path, ctx.key, {
		method: 'GET',
		query: input as Record<
			string,
			string | number | boolean | string[] | undefined
		>,
	});

export const getActiveConnections: RenderEndpoints['getActiveConnections'] = (
	ctx,
	input,
) => metric(ctx, '/v1/metrics/active-connections', input);
export const getBandwidthSources: RenderEndpoints['getBandwidthSources'] = (
	ctx,
	input,
) => metric(ctx, '/v1/metrics/bandwidth-sources', input);
export const getCpu: RenderEndpoints['getCpu'] = (ctx, input) =>
	metric(ctx, '/v1/metrics/cpu', input);
export const getCpuLimit: RenderEndpoints['getCpuLimit'] = (ctx, input) =>
	metric(ctx, '/v1/metrics/cpu-limit', input);
export const getDiskCapacity: RenderEndpoints['getDiskCapacity'] = (
	ctx,
	input,
) => metric(ctx, '/v1/metrics/disk-capacity', input);
export const getDiskUsage: RenderEndpoints['getDiskUsage'] = (ctx, input) =>
	metric(ctx, '/v1/metrics/disk-usage', input);
export const getInstanceCount: RenderEndpoints['getInstanceCount'] = (
	ctx,
	input,
) => metric(ctx, '/v1/metrics/instance-count', input);
export const getMemory: RenderEndpoints['getMemory'] = (ctx, input) =>
	metric(ctx, '/v1/metrics/memory', input);
export const getMemoryLimit: RenderEndpoints['getMemoryLimit'] = (ctx, input) =>
	metric(ctx, '/v1/metrics/memory-limit', input);
export const getMemoryTarget: RenderEndpoints['getMemoryTarget'] = (
	ctx,
	input,
) => metric(ctx, '/v1/metrics/memory-target', input);
export const listApplicationFilterValues: RenderEndpoints['listApplicationFilterValues'] =
	(ctx, input) => metric(ctx, '/v1/metrics/filters/application', input);
