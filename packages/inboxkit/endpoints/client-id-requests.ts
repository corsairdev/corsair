import type { InboxkitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const initiate: InboxkitEndpoints['clientIdRequestsInitiate'] = (
	ctx,
	input,
) =>
	call(ctx, 'clientIdRequestsInitiate', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/client-id-request/initiate',
		body,
	}));

export const getStatus: InboxkitEndpoints['clientIdRequestsGetStatus'] = (
	ctx,
	input,
) =>
	call(ctx, 'clientIdRequestsGetStatus', input, ({ requestId }) => ({
		method: 'GET',
		path: `/v1/api/mailboxes/client-id-request/status/${segment(requestId)}`,
	}));

export const list: InboxkitEndpoints['clientIdRequestsList'] = (ctx, input) =>
	call(ctx, 'clientIdRequestsList', input, (query) => ({
		method: 'GET',
		path: '/v1/api/mailboxes/client-id-requests',
		query,
	}));
