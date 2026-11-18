import type { InboxkitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const list: InboxkitEndpoints['tagsList'] = (ctx, input) =>
	call(ctx, 'tagsList', input, () => ({ method: 'GET', path: '/v1/api/tags' }));

export const create: InboxkitEndpoints['tagsCreate'] = (ctx, input) =>
	call(ctx, 'tagsCreate', input, (body) => ({
		method: 'POST',
		path: '/v1/api/tags',
		body,
	}));

export const assign: InboxkitEndpoints['tagsAssign'] = (ctx, input) =>
	call(ctx, 'tagsAssign', input, (body) => ({
		method: 'POST',
		path: '/v1/api/tags/assign',
		body,
	}));

export const deleteOp: InboxkitEndpoints['tagsDelete'] = (ctx, input) =>
	call(ctx, 'tagsDelete', input, ({ uid }) => ({
		method: 'DELETE',
		path: `/v1/api/tags/${segment(uid)}`,
	}));
