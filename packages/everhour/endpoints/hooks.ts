import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';
import type { EverhourWebhook } from '../schema/database';

export const listWebhooks: EverhourEndpoints['listWebhooks'] = async (ctx) => {
	return makeEverhourRequest<EverhourWebhook[]>('/hooks', ctx.key);
};

export const getWebhook: EverhourEndpoints['getWebhook'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<EverhourWebhook>(
		`/hooks/${options.hookId}`,
		ctx.key,
	);
};

export const createWebhook: EverhourEndpoints['createWebhook'] = async (
	ctx,
	options,
) => {
	const { targetUrl, events, project } = options;
	return makeEverhourRequest<EverhourWebhook>('/hooks', ctx.key, {
		method: 'POST',
		body: { targetUrl, events, project },
	});
};

export const updateWebhook: EverhourEndpoints['updateWebhook'] = async (
	ctx,
	options,
) => {
	const { hookId, events } = options;
	return makeEverhourRequest<EverhourWebhook>(`/hooks/${hookId}`, ctx.key, {
		method: 'PUT',
		body: { events },
	});
};

export const deleteWebhook: EverhourEndpoints['deleteWebhook'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<void>(`/hooks/${options.hookId}`, ctx.key, {
		method: 'DELETE',
	});
};
