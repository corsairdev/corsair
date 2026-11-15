import type { InboxkitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const initiate: InboxkitEndpoints['consentRequestsInitiate'] = (
	ctx,
	input,
) =>
	call(ctx, 'consentRequestsInitiate', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/consent-request/initiate',
		body,
	}));

export const getStatus: InboxkitEndpoints['consentRequestsGetStatus'] = (
	ctx,
	input,
) =>
	call(ctx, 'consentRequestsGetStatus', input, ({ requestId }) => ({
		method: 'GET',
		path: `/v1/api/mailboxes/consent-request/status/${segment(requestId)}`,
	}));

export const list: InboxkitEndpoints['consentRequestsList'] = (ctx, input) =>
	call(ctx, 'consentRequestsList', input, (query) => ({
		method: 'GET',
		path: '/v1/api/mailboxes/consent-requests',
		query,
	}));
