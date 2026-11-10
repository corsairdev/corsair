import type { InboxkitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const list: InboxkitEndpoints['warmupList'] = (ctx, input) =>
	call(ctx, 'warmupList', input, (body) => ({
		method: 'POST',
		path: '/v1/api/warmup/list',
		body,
	}));

export const get: InboxkitEndpoints['warmupGet'] = (ctx, input) =>
	call(ctx, 'warmupGet', input, (query) => ({
		method: 'GET',
		path: '/v1/api/warmup/details',
		query,
	}));

export const getStats: InboxkitEndpoints['warmupGetStats'] = (ctx, input) =>
	call(ctx, 'warmupGetStats', input, () => ({
		method: 'GET',
		path: '/v1/api/warmup/stats',
	}));

export const getPricing: InboxkitEndpoints['warmupGetPricing'] = (ctx, input) =>
	call(ctx, 'warmupGetPricing', input, () => ({
		method: 'GET',
		path: '/v1/api/warmup/pricing',
	}));

export const add: InboxkitEndpoints['warmupAdd'] = (ctx, input) =>
	call(ctx, 'warmupAdd', input, (body) => ({
		method: 'POST',
		path: '/v1/api/warmup/add',
		body,
	}));

export const pause: InboxkitEndpoints['warmupPause'] = (ctx, input) =>
	call(ctx, 'warmupPause', input, (body) => ({
		method: 'POST',
		path: '/v1/api/warmup/pause',
		body,
	}));

export const resume: InboxkitEndpoints['warmupResume'] = (ctx, input) =>
	call(ctx, 'warmupResume', input, (body) => ({
		method: 'POST',
		path: '/v1/api/warmup/resume',
		body,
	}));

export const cancel: InboxkitEndpoints['warmupCancel'] = (ctx, input) =>
	call(ctx, 'warmupCancel', input, (body) => ({
		method: 'POST',
		path: '/v1/api/warmup/cancel',
		body,
	}));

export const updateSettings: InboxkitEndpoints['warmupUpdateSettings'] = (
	ctx,
	input,
) =>
	call(ctx, 'warmupUpdateSettings', input, (body) => ({
		method: 'POST',
		path: '/v1/api/warmup/update-settings',
		body,
	}));

export const createConnectLink: InboxkitEndpoints['warmupCreateConnectLink'] = (
	ctx,
	input,
) =>
	call(ctx, 'warmupCreateConnectLink', input, (body) => ({
		method: 'POST',
		path: '/v1/api/warmup/external/connect-links',
		body,
	}));

export const getConnectLink: InboxkitEndpoints['warmupGetConnectLink'] = (
	ctx,
	input,
) =>
	call(ctx, 'warmupGetConnectLink', input, ({ connection_id }) => ({
		method: 'GET',
		path: `/v1/api/warmup/external/connect-links/${segment(connection_id)}`,
	}));

export const addSmtpMailboxes: InboxkitEndpoints['warmupAddSmtpMailboxes'] = (
	ctx,
	input,
) =>
	call(ctx, 'warmupAddSmtpMailboxes', input, (body) => ({
		method: 'POST',
		path: '/v1/api/warmup/external/smtp-mailboxes',
		body,
	}));

export const listConnectedMailboxes: InboxkitEndpoints['warmupListConnectedMailboxes'] =
	(ctx, input) =>
		call(ctx, 'warmupListConnectedMailboxes', input, (query) => ({
			method: 'GET',
			path: '/v1/api/warmup/external/mailboxes',
			query,
		}));

export const disconnectMailbox: InboxkitEndpoints['warmupDisconnectMailbox'] = (
	ctx,
	input,
) =>
	call(ctx, 'warmupDisconnectMailbox', input, ({ uid }) => ({
		method: 'DELETE',
		path: `/v1/api/warmup/external/mailboxes/${segment(uid)}`,
	}));
