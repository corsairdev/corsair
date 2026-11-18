import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const get: InstantlyEndpoints['domainForwardingGet'] = (ctx, input) =>
	call(
		ctx,
		'domainForwardingGet',
		'domainForwarding.get',
		input,
		({ domain }) => ({
			method: 'GET',
			path: `/domains/${segment(domain)}/forwarding`,
		}),
		{ log: ({ domain }) => ({ domain }) },
	);

export const set: InstantlyEndpoints['domainForwardingSet'] = (ctx, input) =>
	call(
		ctx,
		'domainForwardingSet',
		'domainForwarding.set',
		input,
		({ domain, ...body }) => ({
			method: 'PUT',
			path: `/domains/${segment(domain)}/forwarding`,
			body,
		}),
		{ log: ({ domain }) => ({ domain }) },
	);

export const remove: InstantlyEndpoints['domainForwardingRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'domainForwardingRemove',
		'domainForwarding.remove',
		input,
		({ domain }) => ({
			method: 'DELETE',
			path: `/domains/${segment(domain)}/forwarding`,
		}),
		{ log: ({ domain }) => ({ domain }) },
	);
