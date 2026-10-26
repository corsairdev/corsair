import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['templatesList'] = async (ctx, input) => {
	GmicloudEndpointInputSchemas.templatesList.parse(input);
	const result = GmicloudEndpointOutputSchemas.templatesList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/templates',
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.templates.list', {}, 'completed');
	return result;
};

export const create: GmicloudEndpoints['templatesCreate'] = async (
	ctx,
	input,
) => {
	const body = GmicloudEndpointInputSchemas.templatesCreate.parse(input);
	const result = GmicloudEndpointOutputSchemas.templatesCreate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/templates',
			body,
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.templates.create', {}, 'completed');
	return result;
};

export const get: GmicloudEndpoints['templatesGet'] = async (ctx, input) => {
	const { id } = GmicloudEndpointInputSchemas.templatesGet.parse(input);
	const result = GmicloudEndpointOutputSchemas.templatesGet.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/templates/{id}',
			path: { id },
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.templates.get', { id }, 'completed');
	return result;
};

export const update: GmicloudEndpoints['templatesUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } =
		GmicloudEndpointInputSchemas.templatesUpdate.parse(input);
	const result = GmicloudEndpointOutputSchemas.templatesUpdate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'PUT',
			url: 'v1/templates/{id}',
			path: { id },
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.templates.update',
		{ id },
		'completed',
	);
	return result;
};

export const remove: GmicloudEndpoints['templatesDelete'] = async (
	ctx,
	input,
) => {
	const { id } = GmicloudEndpointInputSchemas.templatesDelete.parse(input);
	const result = GmicloudEndpointOutputSchemas.templatesDelete.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'DELETE',
			url: 'v1/templates/{id}',
			path: { id },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.templates.delete',
		{ id },
		'completed',
	);
	return result;
};
