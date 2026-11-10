import type { InboxkitEndpoints } from '..';
import { call } from './call';
import { saveMailboxes } from './store';

export const list: InboxkitEndpoints['mailboxesList'] = (ctx, input) =>
	call(
		ctx,
		'mailboxesList',
		input,
		(body) => ({ method: 'POST', path: '/v1/api/mailboxes/list', body }),
		{
			after: (result, _parsed, workspaceId) =>
				saveMailboxes(ctx, result.mailboxes ?? [], workspaceId),
		},
	);

export const get: InboxkitEndpoints['mailboxesGet'] = (ctx, input) =>
	call(ctx, 'mailboxesGet', input, (query) => ({
		method: 'GET',
		path: '/v1/api/mailboxes/details',
		query,
	}));

export const checkAvailability: InboxkitEndpoints['mailboxesCheckAvailability'] =
	(ctx, input) =>
		call(ctx, 'mailboxesCheckAvailability', input, (query) => ({
			method: 'GET',
			path: '/v1/api/mailboxes/availability',
			query,
		}));

export const getStatus: InboxkitEndpoints['mailboxesGetStatus'] = (
	ctx,
	input,
) =>
	call(ctx, 'mailboxesGetStatus', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/status',
		body,
	}));

export const getFailureReason: InboxkitEndpoints['mailboxesGetFailureReason'] =
	(ctx, input) =>
		call(ctx, 'mailboxesGetFailureReason', input, (body) => ({
			method: 'POST',
			path: '/v1/api/mailboxes/failure-reason',
			body,
		}));

export const buy: InboxkitEndpoints['mailboxesBuy'] = (ctx, input) =>
	call(ctx, 'mailboxesBuy', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/buy',
		body,
	}));

export const cancel: InboxkitEndpoints['mailboxesCancel'] = (ctx, input) =>
	call(ctx, 'mailboxesCancel', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/cancel',
		body,
	}));

export const uncancel: InboxkitEndpoints['mailboxesUncancel'] = (ctx, input) =>
	call(ctx, 'mailboxesUncancel', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/uncancel',
		body,
	}));

export const reactivate: InboxkitEndpoints['mailboxesReactivate'] = (
	ctx,
	input,
) =>
	call(ctx, 'mailboxesReactivate', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/reactivate',
		body,
	}));

export const reactivateRebuy: InboxkitEndpoints['mailboxesReactivateRebuy'] = (
	ctx,
	input,
) =>
	call(ctx, 'mailboxesReactivateRebuy', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/reactivate-rebuy',
		body,
	}));

export const update: InboxkitEndpoints['mailboxesUpdate'] = (ctx, input) =>
	call(ctx, 'mailboxesUpdate', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/update',
		body,
	}));

export const updateProfilePicture: InboxkitEndpoints['mailboxesUpdateProfilePicture'] =
	(ctx, input) =>
		call(ctx, 'mailboxesUpdateProfilePicture', input, (body) => ({
			method: 'POST',
			path: '/v1/api/mailboxes/profile-picture',
			body,
		}));

export const changeUsername: InboxkitEndpoints['mailboxesChangeUsername'] = (
	ctx,
	input,
) =>
	call(ctx, 'mailboxesChangeUsername', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/username',
		body,
	}));

export const changePassword: InboxkitEndpoints['mailboxesChangePassword'] = (
	ctx,
	input,
) =>
	call(ctx, 'mailboxesChangePassword', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/password',
		body,
	}));

export const showCredentials: InboxkitEndpoints['mailboxesShowCredentials'] = (
	ctx,
	input,
) =>
	call(ctx, 'mailboxesShowCredentials', input, (query) => ({
		method: 'GET',
		path: '/v1/api/mailboxes/show-credentials',
		query,
	}));

export const generateTotp: InboxkitEndpoints['mailboxesGenerateTotp'] = (
	ctx,
	input,
) =>
	call(ctx, 'mailboxesGenerateTotp', input, (query) => ({
		method: 'GET',
		path: '/v1/api/mailboxes/generate-totp',
		query,
	}));

export const addSignature: InboxkitEndpoints['mailboxesAddSignature'] = (
	ctx,
	input,
) =>
	call(ctx, 'mailboxesAddSignature', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/add-signature',
		body,
	}));

export const deleteSignature: InboxkitEndpoints['mailboxesDeleteSignature'] = (
	ctx,
	input,
) =>
	call(ctx, 'mailboxesDeleteSignature', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/delete-signature',
		body,
	}));

export const resetup: InboxkitEndpoints['mailboxesResetup'] = (ctx, input) =>
	call(ctx, 'mailboxesResetup', input, (body) => ({
		method: 'POST',
		path: '/v1/api/mailboxes/resetup',
		body,
	}));

export const getResetupStatus: InboxkitEndpoints['mailboxesGetResetupStatus'] =
	(ctx, input) =>
		call(ctx, 'mailboxesGetResetupStatus', input, (query) => ({
			method: 'GET',
			path: '/v1/api/mailboxes/resetup-status',
			query,
		}));
