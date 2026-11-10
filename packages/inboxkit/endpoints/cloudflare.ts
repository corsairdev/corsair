import type { InboxkitEndpoints } from '..';
import { call } from './call';

export const connect: InboxkitEndpoints['cloudflareConnect'] = (ctx, input) =>
	call(ctx, 'cloudflareConnect', input, (body) => ({
		method: 'POST',
		path: '/v1/api/cloudflare-domains/connect',
		body,
	}));

export const list: InboxkitEndpoints['cloudflareList'] = (ctx, input) =>
	call(ctx, 'cloudflareList', input, (query) => ({
		method: 'GET',
		path: '/v1/api/cloudflare-domains/list',
		query,
	}));

export const get: InboxkitEndpoints['cloudflareGet'] = (ctx, input) =>
	call(ctx, 'cloudflareGet', input, (query) => ({
		method: 'GET',
		path: '/v1/api/cloudflare-domains/details',
		query,
	}));

export const disconnect: InboxkitEndpoints['cloudflareDisconnect'] = (
	ctx,
	input,
) =>
	call(ctx, 'cloudflareDisconnect', input, (body) => ({
		method: 'POST',
		path: '/v1/api/cloudflare-domains/disconnect',
		body,
	}));

export const listZones: InboxkitEndpoints['cloudflareListZones'] = (
	ctx,
	input,
) =>
	call(ctx, 'cloudflareListZones', input, (query) => ({
		method: 'GET',
		path: '/v1/api/cloudflare-domains/zones',
		query,
	}));
