import type { InboxkitEndpoints } from '..';
import { call } from './call';

export const listPlatforms: InboxkitEndpoints['sequencersListPlatforms'] = (
	ctx,
	input,
) =>
	call(ctx, 'sequencersListPlatforms', input, () => ({
		method: 'GET',
		path: '/v1/api/sequencers/platforms',
	}));

export const list: InboxkitEndpoints['sequencersList'] = (ctx, input) =>
	call(ctx, 'sequencersList', input, (body) => ({
		method: 'POST',
		path: '/v1/api/sequencers/list',
		body,
	}));

export const getTags: InboxkitEndpoints['sequencersGetTags'] = (ctx, input) =>
	call(ctx, 'sequencersGetTags', input, (body) => ({
		method: 'POST',
		path: '/v1/api/sequencers/get-sequencers-tags',
		body,
	}));

export const add: InboxkitEndpoints['sequencersAdd'] = (ctx, input) =>
	call(ctx, 'sequencersAdd', input, (body) => ({
		method: 'POST',
		path: '/v1/api/sequencers/add',
		body,
	}));

export const update: InboxkitEndpoints['sequencersUpdate'] = (ctx, input) =>
	call(ctx, 'sequencersUpdate', input, (body) => ({
		method: 'POST',
		path: '/v1/api/sequencers/update',
		body,
	}));

export const deleteOp: InboxkitEndpoints['sequencersDelete'] = (ctx, input) =>
	call(ctx, 'sequencersDelete', input, (body) => ({
		method: 'POST',
		path: '/v1/api/sequencers/delete',
		body,
	}));

export const exportMailboxes: InboxkitEndpoints['sequencersExportMailboxes'] = (
	ctx,
	input,
) =>
	call(ctx, 'sequencersExportMailboxes', input, (body) => ({
		method: 'POST',
		path: '/v1/api/sequencers/export',
		body,
	}));

export const getExportStatus: InboxkitEndpoints['sequencersGetExportStatus'] = (
	ctx,
	input,
) =>
	call(ctx, 'sequencersGetExportStatus', input, (body) => ({
		method: 'POST',
		path: '/v1/api/sequencers/export/status',
		body,
	}));

export const verifyLemlistOtp: InboxkitEndpoints['sequencersVerifyLemlistOtp'] =
	(ctx, input) =>
		call(ctx, 'sequencersVerifyLemlistOtp', input, (body) => ({
			method: 'POST',
			path: '/v1/api/sequencers/lemlist/verify',
			body,
		}));
