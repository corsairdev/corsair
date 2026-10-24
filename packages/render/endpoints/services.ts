import { logEventFromContext } from 'corsair/core';
import type { RenderEndpoints } from '..';
import { makeRenderRequest } from '../client';
import type { ListServicesOutput, ServiceOutput } from './types';

export const listServices: RenderEndpoints['listServices'] = async (
	ctx,
	input,
) => {
	const response = await makeRenderRequest<ListServicesOutput>(
		'/v1/services',
		ctx.key,
		{ method: 'GET', query: input },
	);

	await logEventFromContext(ctx, 'render.services.list', input, 'completed');
	return response;
};

const serviceRequest = async <T>(
	ctx: { key: string },
	serviceId: string,
	path: string,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
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
