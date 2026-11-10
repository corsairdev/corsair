import type { InboxkitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const getCapabilities: InboxkitEndpoints['forwardingGetCapabilities'] = (
	ctx,
	input,
) =>
	call(ctx, 'forwardingGetCapabilities', input, () => ({
		method: 'GET',
		path: '/v1/api/mailboxes/forwarding/capabilities',
	}));

export const setup: InboxkitEndpoints['forwardingSetup'] = (ctx, input) =>
	call(ctx, 'forwardingSetup', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/forwarding/setup',
		body,
	}));

export const setupAdvanced: InboxkitEndpoints['forwardingSetupAdvanced'] = (
	ctx,
	input,
) =>
	call(ctx, 'forwardingSetupAdvanced', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/forwarding/setup',
		body,
	}));

export const update: InboxkitEndpoints['forwardingUpdate'] = (ctx, input) =>
	call(ctx, 'forwardingUpdate', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/forwarding/update',
		body,
	}));

export const remove: InboxkitEndpoints['forwardingRemove'] = (ctx, input) =>
	call(ctx, 'forwardingRemove', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/forwarding/remove',
		body,
	}));

export const listJobs: InboxkitEndpoints['forwardingListJobs'] = (ctx, input) =>
	call(ctx, 'forwardingListJobs', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/forwarding/jobs',
		body,
	}));

export const listRules: InboxkitEndpoints['forwardingListRules'] = (
	ctx,
	input,
) =>
	call(ctx, 'forwardingListRules', input, (query) => ({
		method: 'GET',
		path: '/v1/api/mailboxes/forwarding/rules',
		query,
	}));

export const getRule: InboxkitEndpoints['forwardingGetRule'] = (ctx, input) =>
	call(ctx, 'forwardingGetRule', input, ({ uid }) => ({
		method: 'GET',
		path: `/v1/api/mailboxes/forwarding/rules/${segment(uid)}`,
	}));

export const updateRule: InboxkitEndpoints['forwardingUpdateRule'] = (
	ctx,
	input,
) =>
	call(ctx, 'forwardingUpdateRule', input, ({ uid, ...body }) => ({
		method: 'POST',
		path: `/v1/api/mailboxes/forwarding/rules/${segment(uid)}/update`,
		body,
	}));

export const deleteRule: InboxkitEndpoints['forwardingDeleteRule'] = (
	ctx,
	input,
) =>
	call(ctx, 'forwardingDeleteRule', input, ({ uid }) => ({
		method: 'POST',
		path: `/v1/api/mailboxes/forwarding/rules/${segment(uid)}/delete`,
	}));
