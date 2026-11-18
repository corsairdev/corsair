import type { InboxkitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { saveDomains } from './store';

export const list: InboxkitEndpoints['domainsList'] = (ctx, input) =>
	call(
		ctx,
		'domainsList',
		input,
		(body) => ({ method: 'POST', path: '/v1/api/domains/list', body }),
		{
			after: (result, _parsed, workspaceId) =>
				saveDomains(ctx, result.domains ?? [], workspaceId),
		},
	);

export const listAssignable: InboxkitEndpoints['domainsListAssignable'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsListAssignable', input, (query) => ({
		method: 'GET',
		path: '/v1/api/domains/assignable',
		query,
	}));

export const checkAvailability: InboxkitEndpoints['domainsCheckAvailability'] =
	(ctx, input) =>
		call(ctx, 'domainsCheckAvailability', input, (query) => ({
			method: 'GET',
			path: '/v1/api/domains/available',
			query,
		}));

export const checkBanned: InboxkitEndpoints['domainsCheckBanned'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsCheckBanned', input, (query) => ({
		method: 'GET',
		path: '/v1/api/domains/banned',
		query,
	}));

export const search: InboxkitEndpoints['domainsSearch'] = (ctx, input) =>
	call(ctx, 'domainsSearch', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/search',
		body,
	}));

export const checkWorkspaceAvailability: InboxkitEndpoints['domainsCheckWorkspaceAvailability'] =
	(ctx, input) =>
		call(ctx, 'domainsCheckWorkspaceAvailability', input, (body) => ({
			method: 'POST',
			path: '/v1/api/domains/check-workspace-availability',
			body,
		}));

export const register: InboxkitEndpoints['domainsRegister'] = (ctx, input) =>
	call(ctx, 'domainsRegister', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/register',
		body,
	}));

export const remove: InboxkitEndpoints['domainsRemove'] = (ctx, input) =>
	call(ctx, 'domainsRemove', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/remove',
		body,
	}));

export const setForwarding: InboxkitEndpoints['domainsSetForwarding'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsSetForwarding', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/forwarding',
		body,
	}));

export const setCatchAll: InboxkitEndpoints['domainsSetCatchAll'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsSetCatchAll', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/catch-all',
		body,
	}));

export const removeCatchAll: InboxkitEndpoints['domainsRemoveCatchAll'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsRemoveCatchAll', input, (body) => ({
		method: 'DELETE',
		path: '/v1/api/domains/catch-all',
		body,
	}));

export const setDmarc: InboxkitEndpoints['domainsSetDmarc'] = (ctx, input) =>
	call(ctx, 'domainsSetDmarc', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/dmarc',
		body,
	}));

export const removeDmarc: InboxkitEndpoints['domainsRemoveDmarc'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsRemoveDmarc', input, (body) => ({
		method: 'DELETE',
		path: '/v1/api/domains/dmarc',
		body,
	}));

export const connect: InboxkitEndpoints['domainsConnect'] = (ctx, input) =>
	call(ctx, 'domainsConnect', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/nameservers',
		body,
	}));

export const checkPropagation: InboxkitEndpoints['domainsCheckPropagation'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsCheckPropagation', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/nameservers/check-propagation',
		body,
	}));

export const regenerateNameservers: InboxkitEndpoints['domainsRegenerateNameservers'] =
	(ctx, input) =>
		call(ctx, 'domainsRegenerateNameservers', input, (body) => ({
			method: 'POST',
			path: '/v1/api/domains/nameservers/regenerate',
			body,
		}));

export const updatePrivacy: InboxkitEndpoints['domainsUpdatePrivacy'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsUpdatePrivacy', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/privacy',
		body,
	}));

export const updateContacts: InboxkitEndpoints['domainsUpdateContacts'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsUpdateContacts', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/contacts',
		body,
	}));

export const requestRenewal: InboxkitEndpoints['domainsRequestRenewal'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsRequestRenewal', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/renewals/request',
		body,
	}));

export const getRenewalStatus: InboxkitEndpoints['domainsGetRenewalStatus'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsGetRenewalStatus', input, (query) => ({
		method: 'GET',
		path: '/v1/api/domains/renewals/status',
		query,
	}));

export const moveWorkspace: InboxkitEndpoints['domainsMoveWorkspace'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsMoveWorkspace', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/move-workspace',
		body,
	}));

export const previewMove: InboxkitEndpoints['domainsPreviewMove'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsPreviewMove', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/move-workspace/preview',
		body,
	}));

export const getMoveStatus: InboxkitEndpoints['domainsGetMoveStatus'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsGetMoveStatus', input, ({ move_id }) => ({
		method: 'GET',
		path: `/v1/api/domains/move-workspace/status/${segment(move_id)}`,
	}));

export const rotate: InboxkitEndpoints['domainsRotate'] = (ctx, input) =>
	call(ctx, 'domainsRotate', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/rotate',
		body,
	}));

export const previewRotation: InboxkitEndpoints['domainsPreviewRotation'] = (
	ctx,
	input,
) =>
	call(ctx, 'domainsPreviewRotation', input, (body) => ({
		method: 'POST',
		path: '/v1/api/domains/rotate/preview',
		body,
	}));

export const getRotationStatus: InboxkitEndpoints['domainsGetRotationStatus'] =
	(ctx, input) =>
		call(ctx, 'domainsGetRotationStatus', input, ({ rotation_id }) => ({
			method: 'GET',
			path: `/v1/api/domains/rotate/status/${segment(rotation_id)}`,
		}));
