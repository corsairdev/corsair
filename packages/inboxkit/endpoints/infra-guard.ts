import type { InboxkitEndpoints } from '..';
import { call } from './call';

export const list: InboxkitEndpoints['infraGuardList'] = (ctx, input) =>
	call(ctx, 'infraGuardList', input, (body) => ({
		method: 'POST',
		path: '/v1/api/infra-guard/list',
		body,
	}));

export const get: InboxkitEndpoints['infraGuardGet'] = (ctx, input) =>
	call(ctx, 'infraGuardGet', input, (query) => ({
		method: 'GET',
		path: '/v1/api/infra-guard/details',
		query,
	}));

export const enable: InboxkitEndpoints['infraGuardEnable'] = (ctx, input) =>
	call(ctx, 'infraGuardEnable', input, (body) => ({
		method: 'POST',
		path: '/v1/api/infra-guard/enable',
		body,
	}));

export const cancel: InboxkitEndpoints['infraGuardCancel'] = (ctx, input) =>
	call(ctx, 'infraGuardCancel', input, (body) => ({
		method: 'POST',
		path: '/v1/api/infra-guard/cancel',
		body,
	}));

export const getStats: InboxkitEndpoints['infraGuardGetStats'] = (ctx, input) =>
	call(ctx, 'infraGuardGetStats', input, () => ({
		method: 'GET',
		path: '/v1/api/infra-guard/stats',
	}));

export const getPricing: InboxkitEndpoints['infraGuardGetPricing'] = (
	ctx,
	input,
) =>
	call(ctx, 'infraGuardGetPricing', input, () => ({
		method: 'GET',
		path: '/v1/api/infra-guard/pricing',
	}));

export const getBlacklistHistory: InboxkitEndpoints['infraGuardGetBlacklistHistory'] =
	(ctx, input) =>
		call(ctx, 'infraGuardGetBlacklistHistory', input, (query) => ({
			method: 'GET',
			path: '/v1/api/infra-guard/blacklist-history',
			query,
		}));

export const getDnsHistory: InboxkitEndpoints['infraGuardGetDnsHistory'] = (
	ctx,
	input,
) =>
	call(ctx, 'infraGuardGetDnsHistory', input, (query) => ({
		method: 'GET',
		path: '/v1/api/infra-guard/dns-history',
		query,
	}));

export const getBounceMetrics: InboxkitEndpoints['infraGuardGetBounceMetrics'] =
	(ctx, input) =>
		call(ctx, 'infraGuardGetBounceMetrics', input, (query) => ({
			method: 'GET',
			path: '/v1/api/infra-guard/bounce-metrics',
			query,
		}));

export const getBounceHistory: InboxkitEndpoints['infraGuardGetBounceHistory'] =
	(ctx, input) =>
		call(ctx, 'infraGuardGetBounceHistory', input, (query) => ({
			method: 'GET',
			path: '/v1/api/infra-guard/bounce-history',
			query,
		}));

export const updateSettings: InboxkitEndpoints['infraGuardUpdateSettings'] = (
	ctx,
	input,
) =>
	call(ctx, 'infraGuardUpdateSettings', input, (body) => ({
		method: 'POST',
		path: '/v1/api/infra-guard/update-settings',
		body,
	}));

export const triggerCheck: InboxkitEndpoints['infraGuardTriggerCheck'] = (
	ctx,
	input,
) =>
	call(ctx, 'infraGuardTriggerCheck', input, (body) => ({
		method: 'POST',
		path: '/v1/api/infra-guard/trigger-check',
		body,
	}));

export const listAlerts: InboxkitEndpoints['infraGuardListAlerts'] = (
	ctx,
	input,
) =>
	call(ctx, 'infraGuardListAlerts', input, (body) => ({
		method: 'POST',
		path: '/v1/api/infra-guard/alerts',
		body,
	}));

export const acknowledgeAlert: InboxkitEndpoints['infraGuardAcknowledgeAlert'] =
	(ctx, input) =>
		call(ctx, 'infraGuardAcknowledgeAlert', input, (body) => ({
			method: 'POST',
			path: '/v1/api/infra-guard/acknowledge-alert',
			body,
		}));

export const resolveAlert: InboxkitEndpoints['infraGuardResolveAlert'] = (
	ctx,
	input,
) =>
	call(ctx, 'infraGuardResolveAlert', input, (body) => ({
		method: 'POST',
		path: '/v1/api/infra-guard/resolve-alert',
		body,
	}));

export const listActionItems: InboxkitEndpoints['infraGuardListActionItems'] = (
	ctx,
	input,
) =>
	call(ctx, 'infraGuardListActionItems', input, (body) => ({
		method: 'POST',
		path: '/v1/api/infra-guard/action-items',
		body,
	}));

export const getActionItemStats: InboxkitEndpoints['infraGuardGetActionItemStats'] =
	(ctx, input) =>
		call(ctx, 'infraGuardGetActionItemStats', input, () => ({
			method: 'GET',
			path: '/v1/api/infra-guard/action-items/stats',
		}));

export const resolveActionItem: InboxkitEndpoints['infraGuardResolveActionItem'] =
	(ctx, input) =>
		call(ctx, 'infraGuardResolveActionItem', input, (body) => ({
			method: 'POST',
			path: '/v1/api/infra-guard/resolve-action-item',
			body,
		}));

export const dismissActionItem: InboxkitEndpoints['infraGuardDismissActionItem'] =
	(ctx, input) =>
		call(ctx, 'infraGuardDismissActionItem', input, (body) => ({
			method: 'POST',
			path: '/v1/api/infra-guard/dismiss-action-item',
			body,
		}));
