import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import { makeHoneyHiveRequest } from '../client';
import type {
	MetricsCreateInput,
	MetricsCreateResponse,
	MetricsCreateVersionInput,
	MetricsCreateVersionResponse,
	MetricsDeleteInput,
	MetricsDeleteResponse,
	MetricsDeployVersionInput,
	MetricsDeployVersionResponse,
	MetricsListInput,
	MetricsListResponse,
	MetricsListVersionsInput,
	MetricsListVersionsResponse,
	MetricsRunInput,
	MetricsRunResponse,
	MetricsUpdateInput,
	MetricsUpdateResponse,
} from './types';

export async function listMetrics(
	ctx: HoneyHiveContext,
	input: MetricsListInput,
): Promise<MetricsListResponse> {
	const response = await makeHoneyHiveRequest<MetricsListResponse>(
		'/v1/metrics',
		ctx.key,
		{ method: 'GET', query: input },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.list',
		{ count: response.metrics?.length },
		'completed',
	);

	return response;
}

export async function createMetric(
	ctx: HoneyHiveContext,
	input: MetricsCreateInput,
): Promise<MetricsCreateResponse> {
	const response = await makeHoneyHiveRequest<MetricsCreateResponse>(
		'/v1/metrics',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.create',
		{ metric_id: response.metric_id },
		'completed',
	);

	return response;
}

export async function updateMetric(
	ctx: HoneyHiveContext,
	input: MetricsUpdateInput,
): Promise<MetricsUpdateResponse> {
	const { metric_id, ...body } = input;
	const response = await makeHoneyHiveRequest<MetricsUpdateResponse>(
		`/v1/metrics/${encodeURIComponent(metric_id)}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.update',
		{ metric_id },
		'completed',
	);

	return response;
}

export async function deleteMetric(
	ctx: HoneyHiveContext,
	input: MetricsDeleteInput,
): Promise<MetricsDeleteResponse> {
	const response = await makeHoneyHiveRequest<MetricsDeleteResponse>(
		`/v1/metrics/${encodeURIComponent(input.metric_id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.delete',
		{ metric_id: input.metric_id },
		'completed',
	);

	return response;
}

export async function runMetric(
	ctx: HoneyHiveContext,
	input: MetricsRunInput,
): Promise<MetricsRunResponse> {
	const response = await makeHoneyHiveRequest<MetricsRunResponse>(
		'/v1/metrics/run',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.run',
		{ success: response.success },
		'completed',
	);

	return response;
}

export async function listMetricVersions(
	ctx: HoneyHiveContext,
	input: MetricsListVersionsInput,
): Promise<MetricsListVersionsResponse> {
	const response = await makeHoneyHiveRequest<MetricsListVersionsResponse>(
		`/v1/metrics/${encodeURIComponent(input.metric_id)}/versions`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.listVersions',
		{ metric_id: input.metric_id, count: response.data?.length },
		'completed',
	);

	return response;
}

export async function createMetricVersion(
	ctx: HoneyHiveContext,
	input: MetricsCreateVersionInput,
): Promise<MetricsCreateVersionResponse> {
	const { metric_id, ...body } = input;
	const response = await makeHoneyHiveRequest<MetricsCreateVersionResponse>(
		`/v1/metrics/${encodeURIComponent(metric_id)}/versions`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.createVersion',
		{ metric_id },
		'completed',
	);

	return response;
}

export async function deployMetricVersion(
	ctx: HoneyHiveContext,
	input: MetricsDeployVersionInput,
): Promise<MetricsDeployVersionResponse> {
	const response = await makeHoneyHiveRequest<MetricsDeployVersionResponse>(
		`/v1/metrics/${encodeURIComponent(input.metric_id)}/versions/${encodeURIComponent(input.version_name)}/deploy`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.deployVersion',
		{ metric_id: input.metric_id, version_name: input.version_name },
		'completed',
	);

	return response;
}

export const Metrics = {
	list: listMetrics,
	create: createMetric,
	update: updateMetric,
	delete: deleteMetric,
	run: runMetric,
	listVersions: listMetricVersions,
	createVersion: createMetricVersion,
	deployVersion: deployMetricVersion,
};
