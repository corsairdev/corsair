import { logEventFromContext } from 'corsair/core';
import { makeXquikRequest } from '../client';
import type { XquikEndpoints } from '../index';
import { baseUrlFromOptions } from './helpers';
import type { XquikEndpointOutputs } from './types';

export const list: XquikEndpoints['webhooksList'] = async (ctx) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['webhooksList']>(
		'/webhooks',
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.webhooks.list',
		{ count: response.webhooks.length },
		'completed',
	);

	return response;
};

export const create: XquikEndpoints['webhooksCreate'] = async (ctx, input) => {
	const response = await makeXquikRequest<
		XquikEndpointOutputs['webhooksCreate']
	>('/webhooks', ctx.key, {
		baseUrl: baseUrlFromOptions(ctx.options),
		body: input,
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'xquik.webhooks.create',
		{ eventTypes: input.eventTypes },
		'completed',
	);

	return response;
};

export const update: XquikEndpoints['webhooksUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const response = await makeXquikRequest<
		XquikEndpointOutputs['webhooksUpdate']
	>(`/webhooks/${id}`, ctx.key, {
		baseUrl: baseUrlFromOptions(ctx.options),
		body,
		method: 'PATCH',
	});

	await logEventFromContext(ctx, 'xquik.webhooks.update', { id }, 'completed');

	return response;
};

export const deactivate: XquikEndpoints['webhooksDeactivate'] = async (
	ctx,
	input,
) => {
	const response = await makeXquikRequest<
		XquikEndpointOutputs['webhooksDeactivate']
	>(`/webhooks/${input.id}`, ctx.key, {
		baseUrl: baseUrlFromOptions(ctx.options),
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'xquik.webhooks.deactivate',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const deliveries: XquikEndpoints['webhooksDeliveries'] = async (
	ctx,
	input,
) => {
	const response = await makeXquikRequest<
		XquikEndpointOutputs['webhooksDeliveries']
	>(`/webhooks/${input.id}/deliveries`, ctx.key, {
		baseUrl: baseUrlFromOptions(ctx.options),
	});

	await logEventFromContext(
		ctx,
		'xquik.webhooks.deliveries',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const test: XquikEndpoints['webhooksTest'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['webhooksTest']>(
		`/webhooks/${input.id}/test`,
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
			method: 'POST',
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.webhooks.test',
		{ id: input.id, success: response.success },
		'completed',
	);

	return response;
};
