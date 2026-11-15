import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import {
	classicKey,
	makeHoneyHiveRequest,
	resolveDataPlaneUrl,
} from '../client';
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
import {
	HoneyHiveEndpointInputSchemas,
	HoneyHiveEndpointOutputSchemas,
} from './types';

export async function listMetrics(
	ctx: HoneyHiveContext,
	input: MetricsListInput,
): Promise<MetricsListResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.metricsList.parse(input);
	const response = await makeHoneyHiveRequest<MetricsListResponse>(
		'/v1/metrics',
		classicKey(ctx),
		{
			method: 'GET',
			baseUrl: await resolveDataPlaneUrl(ctx),
			query: parsedInput,
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.metricsList.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.list',
		{ count: parsed.metrics?.length },
		'completed',
	);

	return parsed;
}

export async function createMetric(
	ctx: HoneyHiveContext,
	input: MetricsCreateInput,
): Promise<MetricsCreateResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.metricsCreate.parse(input);
	const response = await makeHoneyHiveRequest<MetricsCreateResponse>(
		'/v1/metrics',
		classicKey(ctx),
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body: parsedInput,
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.metricsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.create',
		{ metric_id: parsed.metric_id },
		'completed',
	);

	return parsed;
}

export async function updateMetric(
	ctx: HoneyHiveContext,
	input: MetricsUpdateInput,
): Promise<MetricsUpdateResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.metricsUpdate.parse(input);
	const { metric_id, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<MetricsUpdateResponse>(
		`/v1/metrics/${encodeURIComponent(metric_id)}`,
		classicKey(ctx),
		{
			method: 'PUT',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body,
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.metricsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.update',
		{ metric_id },
		'completed',
	);

	return parsed;
}

export async function deleteMetric(
	ctx: HoneyHiveContext,
	input: MetricsDeleteInput,
): Promise<MetricsDeleteResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.metricsDelete.parse(input);
	const response = await makeHoneyHiveRequest<MetricsDeleteResponse>(
		`/v1/metrics/${encodeURIComponent(parsedInput.metric_id)}`,
		classicKey(ctx),
		{
			method: 'DELETE',
			baseUrl: await resolveDataPlaneUrl(ctx),
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.metricsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.delete',
		{ metric_id: parsedInput.metric_id },
		'completed',
	);

	return parsed;
}

export async function runMetric(
	ctx: HoneyHiveContext,
	input: MetricsRunInput,
): Promise<MetricsRunResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.metricsRun.parse(input);
	const response = await makeHoneyHiveRequest<MetricsRunResponse>(
		'/v1/metrics/run',
		classicKey(ctx),
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body: parsedInput,
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.metricsRun.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.run',
		{ success: parsed.success },
		'completed',
	);

	return parsed;
}

export async function listMetricVersions(
	ctx: HoneyHiveContext,
	input: MetricsListVersionsInput,
): Promise<MetricsListVersionsResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.metricsListVersions.parse(input);
	const response = await makeHoneyHiveRequest<MetricsListVersionsResponse>(
		`/v1/metrics/${encodeURIComponent(parsedInput.metric_id)}/versions`,
		classicKey(ctx),
		{
			method: 'GET',
			baseUrl: await resolveDataPlaneUrl(ctx),
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.metricsListVersions.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.listVersions',
		{ metric_id: parsedInput.metric_id, count: parsed.data?.length },
		'completed',
	);

	return parsed;
}

export async function createMetricVersion(
	ctx: HoneyHiveContext,
	input: MetricsCreateVersionInput,
): Promise<MetricsCreateVersionResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.metricsCreateVersion.parse(input);
	const { metric_id, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<MetricsCreateVersionResponse>(
		`/v1/metrics/${encodeURIComponent(metric_id)}/versions`,
		classicKey(ctx),
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body,
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.metricsCreateVersion.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.createVersion',
		{ metric_id },
		'completed',
	);

	return parsed;
}

export async function deployMetricVersion(
	ctx: HoneyHiveContext,
	input: MetricsDeployVersionInput,
): Promise<MetricsDeployVersionResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.metricsDeployVersion.parse(input);
	const response = await makeHoneyHiveRequest<MetricsDeployVersionResponse>(
		`/v1/metrics/${encodeURIComponent(parsedInput.metric_id)}/versions/${encodeURIComponent(parsedInput.version_name)}/deploy`,
		classicKey(ctx),
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.metricsDeployVersion.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.metrics.deployVersion',
		{
			metric_id: parsedInput.metric_id,
			version_name: parsedInput.version_name,
		},
		'completed',
	);

	return parsed;
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
