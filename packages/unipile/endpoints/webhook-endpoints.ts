import type { UnipileEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

const ENDPOINTS = '/v2/webhooks/endpoints/';

export const list: UnipileEndpoints['webhookEndpointsList'] = (ctx, input) =>
	call(
		ctx,
		'webhookEndpointsList',
		'webhookEndpoints.list',
		input,
		(parsed) => ({
			method: 'GET',
			path: ENDPOINTS,
			query: { offset: parsed.offset, limit: parsed.limit },
		}),
	);

export const get: UnipileEndpoints['webhookEndpointsGet'] = (ctx, input) =>
	call(ctx, 'webhookEndpointsGet', 'webhookEndpoints.get', input, (parsed) => ({
		method: 'GET',
		path: `${ENDPOINTS}${segment(parsed.id)}`,
	}));

export const create: UnipileEndpoints['webhookEndpointsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'webhookEndpointsCreate',
		'webhookEndpoints.create',
		input,
		(parsed) => ({ method: 'POST', path: ENDPOINTS, body: parsed }),
	);

export const update: UnipileEndpoints['webhookEndpointsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'webhookEndpointsUpdate',
		'webhookEndpoints.update',
		input,
		(parsed) => {
			const { id, ...body } = parsed;
			return { method: 'PATCH', path: `${ENDPOINTS}${segment(id)}`, body };
		},
	);

export const remove: UnipileEndpoints['webhookEndpointsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'webhookEndpointsDelete',
		'webhookEndpoints.delete',
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `${ENDPOINTS}${segment(parsed.id)}`,
		}),
	);
