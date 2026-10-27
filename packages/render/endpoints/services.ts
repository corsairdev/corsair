import { logEventFromContext } from 'corsair/core';
import { makeRenderRequest } from '../client';
import type { RenderEndpoints } from '../index';
import type { ListServicesOutput, ServiceOutput } from './types';

type RenderResourceList = Record<string, unknown>[];

export const listServices: RenderEndpoints['listServices'] = async (
	ctx,
	input,
) => {
	const query = Object.fromEntries(
		Object.entries(input).map(([key, value]) => [
			key,
			Array.isArray(value) ? value.join(',') : value,
		]),
	);
	const response = await makeRenderRequest<ListServicesOutput>(
		'/v1/services',
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(ctx, 'render.services.list', input, 'completed');
	return response;
};

const serviceRequest = async <T>(
	ctx: { key: string },
	serviceId: string,
	path: string,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
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
	return serviceRequest<unknown>(ctx, serviceId, '/deploys', 'POST', body);
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
			query: query as Record<
				string,
				string | number | boolean | string[] | undefined
			>,
		},
	);
};

export const purgeServiceCache: RenderEndpoints['purgeServiceCache'] = async (
	ctx,
	input,
) => serviceRequest<unknown>(ctx, input.serviceId, '/cache/purge', 'POST');

export const cancelDeploy: RenderEndpoints['cancelDeploy'] = async (
	ctx,
	input,
) =>
	serviceRequest<unknown>(
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
	return serviceRequest<unknown>(ctx, serviceId, '/rollback', 'POST', {
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
	serviceRequest<RenderResourceList>(
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
	serviceRequest<Record<string, unknown>>(
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
	return serviceRequest<Record<string, unknown>>(
		ctx,
		input.serviceId,
		'/jobs',
		'POST',
		{ startCommand, planId },
	);
};

export const cancelServiceJob: RenderEndpoints['cancelServiceJob'] = async (
	ctx,
	input,
) =>
	serviceRequest<Record<string, unknown>>(
		ctx,
		input.serviceId,
		`/jobs/${encodeServiceId(input.jobId)}/cancel`,
		'POST',
	);

export const restartService: RenderEndpoints['restartService'] = async (
	ctx,
	input,
) => serviceRequest<unknown>(ctx, input.serviceId, '/restart', 'POST');

export const suspendService: RenderEndpoints['suspendService'] = async (
	ctx,
	input,
) => serviceRequest<unknown>(ctx, input.serviceId, '/suspend', 'POST');

export const resumeService: RenderEndpoints['resumeService'] = async (
	ctx,
	input,
) => serviceRequest<unknown>(ctx, input.serviceId, '/resume', 'POST');
