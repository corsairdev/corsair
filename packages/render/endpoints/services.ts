import { logEventFromContext } from 'corsair/core';
import { makeRenderRequest } from '../client';
import type { RenderEndpoints } from '../index';
import type {
	DeployOutput,
	ListServicesOutput,
	NoContentOutput,
	OutboundIpsOutput,
	ServiceOutput,
	TriggerDeployOutput,
} from './types';

// unknown: Render resource records are provider-defined; each operation's
// output schema parses them at the bound endpoint.
type RenderRecord = Record<string, unknown>;
type RenderResourceList = RenderRecord[];

// Render declares these list filters as `style: form, explode: false`, so a
// multi-value filter is one comma-separated value (`name=a,b`), not a
// repeated key (`name=a&name=b`).
const commaSeparated = <T extends RenderRecord>(input: T) =>
	Object.fromEntries(
		Object.entries(input).map(([key, value]) => [
			key,
			Array.isArray(value) ? value.join(',') : value,
		]),
	);

export const listServices: RenderEndpoints['listServices'] = async (
	ctx,
	input,
) => {
	const response = await makeRenderRequest<ListServicesOutput>(
		'/v1/services',
		ctx.key,
		{ method: 'GET', query: commaSeparated(input) },
	);

	await logEventFromContext(ctx, 'render.services.list', input, 'completed');
	return response;
};

export const createService: RenderEndpoints['createService'] = (ctx, input) =>
	makeRenderRequest('/v1/services', ctx.key, { method: 'POST', body: input });

const serviceRequest = async <T>(
	ctx: { key: string },
	serviceId: string,
	path: string,
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	// unknown: service write fields differ by operation and are schema-validated.
	body?: Record<string, unknown>,
) =>
	makeRenderRequest<T>(
		`/v1/services/${encodeServiceId(serviceId)}${path}`,
		ctx.key,
		{
			method,
			body,
		},
	);

const encodeServiceId = (serviceId: string) => {
	if (
		!serviceId ||
		serviceId === '.' ||
		serviceId === '..' ||
		/[\\/]/.test(serviceId)
	) {
		throw new Error('Invalid Render service ID');
	}
	return encodeURIComponent(serviceId);
};

export const retrieveService: RenderEndpoints['retrieveService'] = async (
	ctx,
	input,
) => serviceRequest<ServiceOutput>(ctx, input.serviceId, '', 'GET');

export const deleteService: RenderEndpoints['deleteService'] = async (
	ctx,
	input,
) => serviceRequest<Record<string, never>>(ctx, input.serviceId, '', 'DELETE');

export const updateService: RenderEndpoints['updateService'] = async (
	ctx,
	input,
) => {
	const { serviceId, ...body } = input;
	return serviceRequest<ServiceOutput>(ctx, serviceId, '', 'PATCH', body);
};

export const triggerDeploy: RenderEndpoints['triggerDeploy'] = async (
	ctx,
	input,
) => {
	const { serviceId, ...body } = input;
	return serviceRequest<TriggerDeployOutput>(
		ctx,
		serviceId,
		'/deploys',
		'POST',
		body,
	);
};

export const listDeploys: RenderEndpoints['listDeploys'] = async (
	ctx,
	input,
) => {
	const { serviceId, ...query } = input;
	return makeRenderRequest<RenderResourceList>(
		`/v1/services/${encodeServiceId(serviceId)}/deploys`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
};

export const purgeServiceCache: RenderEndpoints['purgeServiceCache'] = async (
	ctx,
	input,
) =>
	serviceRequest<NoContentOutput>(ctx, input.serviceId, '/cache/purge', 'POST');

export const cancelDeploy: RenderEndpoints['cancelDeploy'] = async (
	ctx,
	input,
) =>
	serviceRequest<DeployOutput>(
		ctx,
		input.serviceId,
		`/deploys/${encodeServiceId(input.deployId)}/cancel`,
		'POST',
	);

export const rollbackDeploy: RenderEndpoints['rollbackDeploy'] = async (
	ctx,
	input,
) => {
	const { serviceId, deployId } = input;
	return serviceRequest<DeployOutput>(ctx, serviceId, '/rollback', 'POST', {
		deployId,
	});
};

export const listServiceEvents: RenderEndpoints['listServiceEvents'] = (
	ctx,
	input,
) => serviceRequest<RenderResourceList>(ctx, input.serviceId, '/events', 'GET');

export const listOutboundIps: RenderEndpoints['listOutboundIps'] = (
	ctx,
	input,
) =>
	serviceRequest<OutboundIpsOutput>(
		ctx,
		input.serviceId,
		'/outbound-ips',
		'GET',
	);

export const listServiceJobs: RenderEndpoints['listServiceJobs'] = (
	ctx,
	input,
) => serviceRequest<RenderResourceList>(ctx, input.serviceId, '/jobs', 'GET');

export const retrieveServiceJob: RenderEndpoints['retrieveServiceJob'] = (
	ctx,
	input,
) =>
	serviceRequest<RenderRecord>(
		ctx,
		input.serviceId,
		`/jobs/${encodeServiceId(input.jobId)}`,
		'GET',
	);

export const createServiceJob: RenderEndpoints['createServiceJob'] = (
	ctx,
	input,
) => {
	const { startCommand, planId } = input;
	return serviceRequest<RenderRecord>(ctx, input.serviceId, '/jobs', 'POST', {
		startCommand,
		planId,
	});
};

export const cancelServiceJob: RenderEndpoints['cancelServiceJob'] = async (
	ctx,
	input,
) =>
	serviceRequest<RenderRecord>(
		ctx,
		input.serviceId,
		`/jobs/${encodeServiceId(input.jobId)}/cancel`,
		'POST',
	);

export const restartService: RenderEndpoints['restartService'] = async (
	ctx,
	input,
) => serviceRequest<NoContentOutput>(ctx, input.serviceId, '/restart', 'POST');

export const suspendService: RenderEndpoints['suspendService'] = async (
	ctx,
	input,
) => serviceRequest<NoContentOutput>(ctx, input.serviceId, '/suspend', 'POST');

export const resumeService: RenderEndpoints['resumeService'] = async (
	ctx,
	input,
) => serviceRequest<NoContentOutput>(ctx, input.serviceId, '/resume', 'POST');

export const scaleService: RenderEndpoints['scaleService'] = (ctx, input) =>
	serviceRequest<NoContentOutput>(ctx, input.serviceId, '/scale', 'POST', {
		numInstances: input.numInstances,
	});

export const updateAutoscaling: RenderEndpoints['updateAutoscaling'] = (
	ctx,
	input,
) => {
	const { serviceId, ...body } = input;
	return serviceRequest(ctx, serviceId, '/autoscaling', 'PUT', body);
};

export const deleteAutoscaling: RenderEndpoints['deleteAutoscaling'] = (
	ctx,
	input,
) => serviceRequest(ctx, input.serviceId, '/autoscaling', 'DELETE');

export const createServicePreview: RenderEndpoints['createServicePreview'] = (
	ctx,
	input,
) => {
	const { serviceId, ...body } = input;
	return serviceRequest(ctx, serviceId, '/preview', 'POST', body);
};

export const deleteServiceHeader: RenderEndpoints['deleteServiceHeader'] = (
	ctx,
	input,
) =>
	serviceRequest(
		ctx,
		input.serviceId,
		`/headers/${encodeServiceId(input.headerId)}`,
		'DELETE',
	);

export const patchServiceRoute: RenderEndpoints['patchServiceRoute'] = (
	ctx,
	input,
) =>
	serviceRequest(
		ctx,
		input.serviceId,
		`/routes/${encodeServiceId(input.routeId)}`,
		'PATCH',
		{ priority: input.priority },
	);

export const deleteServiceRoute: RenderEndpoints['deleteServiceRoute'] = (
	ctx,
	input,
) =>
	serviceRequest(
		ctx,
		input.serviceId,
		`/routes/${encodeServiceId(input.routeId)}`,
		'DELETE',
	);

export const listServiceEnvVars: RenderEndpoints['listServiceEnvVars'] = (
	ctx,
	input,
) => {
	const { serviceId, ...query } = input;
	return makeRenderRequest(
		`/v1/services/${encodeServiceId(serviceId)}/env-vars`,
		ctx.key,
		{ method: 'GET', query },
	);
};

export const deleteServiceEnvVar: RenderEndpoints['deleteServiceEnvVar'] = (
	ctx,
	input,
) =>
	serviceRequest(
		ctx,
		input.serviceId,
		`/env-vars/${encodeServiceId(input.envVarKey)}`,
		'DELETE',
	);

export const listServiceHeaders: RenderEndpoints['listServiceHeaders'] = (
	ctx,
	input,
) => {
	const { serviceId, ...query } = input;
	return makeRenderRequest(
		`/v1/services/${encodeServiceId(serviceId)}/headers`,
		ctx.key,
		{ method: 'GET', query: commaSeparated(query) },
	);
};

export const listServiceCustomDomains: RenderEndpoints['listServiceCustomDomains'] =
	(ctx, input) => {
		const { serviceId, ...query } = input;
		return makeRenderRequest(
			`/v1/services/${encodeServiceId(serviceId)}/custom-domains`,
			ctx.key,
			{ method: 'GET', query: commaSeparated(query) },
		);
	};

export const deleteServiceCustomDomain: RenderEndpoints['deleteServiceCustomDomain'] =
	(ctx, input) =>
		serviceRequest(
			ctx,
			input.serviceId,
			`/custom-domains/${encodeServiceId(input.customDomainNameOrID)}`,
			'DELETE',
		);
