import type { InboxkitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const searchDomains: InboxkitEndpoints['prewarmSearchDomains'] = (
	ctx,
	input,
) =>
	call(ctx, 'prewarmSearchDomains', input, (body) => ({
		method: 'POST',
		path: '/v1/api/prewarm/search-domains',
		body,
	}));

export const searchMailboxes: InboxkitEndpoints['prewarmSearchMailboxes'] = (
	ctx,
	input,
) =>
	call(ctx, 'prewarmSearchMailboxes', input, (body) => ({
		method: 'POST',
		path: '/v1/api/prewarm/search-mailboxes',
		body,
	}));

export const checkAvailability: InboxkitEndpoints['prewarmCheckAvailability'] =
	(ctx, input) =>
		call(ctx, 'prewarmCheckAvailability', input, (body) => ({
			method: 'POST',
			path: '/v1/api/prewarm/check-availability',
			body,
		}));

export const buy: InboxkitEndpoints['prewarmBuy'] = (ctx, input) =>
	call(ctx, 'prewarmBuy', input, (body) => ({
		method: 'POST',
		path: '/v1/api/prewarm/buy-domain',
		body,
	}));

export const getOrderStatus: InboxkitEndpoints['prewarmGetOrderStatus'] = (
	ctx,
	input,
) =>
	call(ctx, 'prewarmGetOrderStatus', input, ({ order_uid }) => ({
		method: 'GET',
		path: `/v1/api/prewarm/order-status/${segment(order_uid)}`,
	}));
