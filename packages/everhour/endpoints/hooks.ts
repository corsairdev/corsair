import { makeEverhourRequest } from '../client';
import type { EverhourWebhook } from '../schema/database';

export const listWebhooks = async (ctx: any) => {
	return makeEverhourRequest<EverhourWebhook[]>('/hooks', ctx.key);
};

export const getWebhook = async (ctx: any, options: { hookId: string }) => {
	return makeEverhourRequest<EverhourWebhook>(
		`/hooks/${options.hookId}`,
		ctx.key,
	);
};

export const createWebhook = async (
	ctx: any,
	options: { targetUrl: string; events: string[]; project?: string | null },
) => {
	const { targetUrl, events, project } = options;
	return makeEverhourRequest<EverhourWebhook>('/hooks', ctx.key, {
		method: 'POST',
		body: { targetUrl, events, project },
	});
};

export const updateWebhook = async (
	ctx: any,
	options: { hookId: string; events: string[] },
) => {
	const { hookId, events } = options;
	return makeEverhourRequest<EverhourWebhook>(`/hooks/${hookId}`, ctx.key, {
		method: 'PUT',
		body: { events },
	});
};

export const deleteWebhook = async (ctx: any, options: { hookId: string }) => {
	return makeEverhourRequest<void>(`/hooks/${options.hookId}`, ctx.key, {
		method: 'DELETE',
	});
};
