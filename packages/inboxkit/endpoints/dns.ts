import type { InboxkitEndpoints } from '..';
import { call } from './call';

export const list: InboxkitEndpoints['dnsList'] = (ctx, input) =>
	call(ctx, 'dnsList', input, (query) => ({
		method: 'GET',
		path: '/v1/api/dns/list',
		query,
	}));

export const add: InboxkitEndpoints['dnsAdd'] = (ctx, input) =>
	call(ctx, 'dnsAdd', input, (body) => ({
		method: 'POST',
		path: '/v1/api/dns/add',
		body,
	}));

export const update: InboxkitEndpoints['dnsUpdate'] = (ctx, input) =>
	call(ctx, 'dnsUpdate', input, (body) => ({
		method: 'POST',
		path: '/v1/api/dns/update',
		body,
	}));

export const deleteRecords: InboxkitEndpoints['dnsDeleteRecords'] = (
	ctx,
	input,
) =>
	call(ctx, 'dnsDeleteRecords', input, (body) => ({
		method: 'POST',
		path: '/v1/api/dns/delete',
		body,
	}));

export const verify: InboxkitEndpoints['dnsVerify'] = (ctx, input) =>
	call(ctx, 'dnsVerify', input, (body) => ({
		method: 'POST',
		path: '/v1/api/dns/verify',
		body,
	}));

export const repair: InboxkitEndpoints['dnsRepair'] = (ctx, input) =>
	call(ctx, 'dnsRepair', input, (body) => ({
		method: 'POST',
		path: '/v1/api/dns/repair',
		body,
	}));
