import type { InboxkitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const list: InboxkitEndpoints['verifiedDomainsList'] = (ctx, input) =>
	call(ctx, 'verifiedDomainsList', input, () => ({
		method: 'GET',
		path: '/v1/api/verified-domains',
	}));

export const add: InboxkitEndpoints['verifiedDomainsAdd'] = (ctx, input) =>
	call(ctx, 'verifiedDomainsAdd', input, (body) => ({
		method: 'POST',
		path: '/v1/api/verified-domains',
		body,
	}));

export const verify: InboxkitEndpoints['verifiedDomainsVerify'] = (
	ctx,
	input,
) =>
	call(ctx, 'verifiedDomainsVerify', input, ({ uid }) => ({
		method: 'POST',
		path: `/v1/api/verified-domains/${segment(uid)}/verify`,
	}));

export const remove: InboxkitEndpoints['verifiedDomainsRemove'] = (
	ctx,
	input,
) =>
	call(ctx, 'verifiedDomainsRemove', input, ({ uid }) => ({
		method: 'DELETE',
		path: `/v1/api/verified-domains/${segment(uid)}`,
	}));
