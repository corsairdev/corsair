import type { StormboardEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StormboardEndpointInputSchemas as Inputs,
	StormboardEndpointOutputSchemas as Outputs,
} from './types';

export const create: StormboardEndpoints['stormsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.create',
			input: Inputs.stormsCreate,
			output: Outputs.stormsCreate,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/storms',
			body,
		}),
		{
			log: (_, result) => ({ stormId: result.id ?? undefined }),
		},
	);

export const get: StormboardEndpoints['stormsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.get',
			input: Inputs.stormsGet,
			output: Outputs.stormsGet,
		},
		input,
		({ stormId, thumbnail }) => ({
			method: 'GET',
			path: `/storms/${segment(stormId)}`,
			query: { thumbnail },
		}),
		{
			log: (_, result) => ({ stormId: result.storm.id ?? undefined }),
		},
	);

export const update: StormboardEndpoints['stormsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.update',
			input: Inputs.stormsUpdate,
			output: Outputs.stormsUpdate,
		},
		input,
		({ stormId, ...body }) => ({
			method: 'PUT',
			path: `/storms/${segment(stormId)}`,
			body,
		}),
	);

export const updateLegend: StormboardEndpoints['stormsUpdateLegend'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'storms.updateLegend',
			input: Inputs.stormsUpdateLegend,
			output: Outputs.stormsUpdateLegend,
		},
		input,
		({ stormId, color }) => ({
			method: 'PUT',
			path: `/storms/${segment(stormId)}/legend`,
			body: { color },
		}),
	);

export const getTemplate: StormboardEndpoints['stormsGetTemplate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'storms.getTemplate',
			input: Inputs.stormsGetTemplate,
			output: Outputs.stormsGetTemplate,
		},
		input,
		({ stormId }) => ({
			method: 'GET',
			path: `/storms/${segment(stormId)}/template`,
		}),
	);

export const updateSection: StormboardEndpoints['stormsUpdateSection'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'storms.updateSection',
			input: Inputs.stormsUpdateSection,
			output: Outputs.stormsUpdateSection,
		},
		input,
		({ stormId, sectionIndex, ...body }) => ({
			method: 'PUT',
			path: `/storms/${segment(stormId)}/section/${segment(sectionIndex)}`,
			body,
		}),
	);

export const getAccess: StormboardEndpoints['stormsGetAccess'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.getAccess',
			input: Inputs.stormsGetAccess,
			output: Outputs.stormsGetAccess,
		},
		input,
		({ stormId }) => ({
			method: 'GET',
			path: `/storms/${segment(stormId)}/access`,
		}),
		{
			log: (_, result) => ({ type: result.type ?? undefined }),
		},
	);

export const listIdeas: StormboardEndpoints['stormsListIdeas'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.listIdeas',
			input: Inputs.stormsListIdeas,
			output: Outputs.stormsListIdeas,
		},
		input,
		({ stormId, lastModifiedMin }) => ({
			method: 'GET',
			path: `/storms/${segment(stormId)}/ideas`,
			query: { lastModifiedMin },
		}),
		{
			log: (_, result) => ({ count: result.ideas.length }),
		},
	);

export const listUsers: StormboardEndpoints['stormsListUsers'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.listUsers',
			input: Inputs.stormsListUsers,
			output: Outputs.stormsListUsers,
		},
		input,
		({ stormId }) => ({
			method: 'GET',
			path: `/storms/${segment(stormId)}/users`,
		}),
		{
			log: (_, result) => ({ count: result.users.length }),
		},
	);

export const list: StormboardEndpoints['stormsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.list',
			input: Inputs.stormsList,
			output: Outputs.stormsList,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/storms/list',
			query,
		}),
		{
			log: (_, result) => ({
				count: result.storms.length,
				hasMore: result.hasmore ?? undefined,
			}),
		},
	);

export const listInvites: StormboardEndpoints['stormsListInvites'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'storms.listInvites',
			input: Inputs.stormsListInvites,
			output: Outputs.stormsListInvites,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/storms/invites',
			query,
		}),
		{
			log: (_, result) => ({ count: result.storms.length }),
		},
	);

export const listConnectors: StormboardEndpoints['stormsListConnectors'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'storms.listConnectors',
			input: Inputs.stormsListConnectors,
			output: Outputs.stormsListConnectors,
		},
		input,
		({ stormId }) => ({
			method: 'GET',
			path: `/storms/${segment(stormId)}/connectors`,
		}),
		{
			log: (_, result) => ({ count: result.connectors.length }),
		},
	);

// Closing a Storm answers {"message": "Storm closed"} and can be undone
// with reopen, so it is a write rather than a destructive delete.
export const close: StormboardEndpoints['stormsClose'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.close',
			input: Inputs.stormsClose,
			output: Outputs.stormsClose,
		},
		input,
		({ stormId }) => ({
			method: 'DELETE',
			path: `/storms/${segment(stormId)}/close`,
		}),
		{
			log: () => ({ closed: true }),
		},
	);

export const reopen: StormboardEndpoints['stormsReopen'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.reopen',
			input: Inputs.stormsReopen,
			output: Outputs.stormsReopen,
		},
		input,
		({ stormId }) => ({
			method: 'POST',
			path: `/storms/${segment(stormId)}/reopen`,
			body: {},
		}),
		{
			log: () => ({ reopened: true }),
		},
	);

export const invite: StormboardEndpoints['stormsInvite'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.invite',
			input: Inputs.stormsInvite,
			output: Outputs.stormsInvite,
		},
		input,
		({ stormId, participants, message, type }) => ({
			method: 'POST',
			path: `/storms/${segment(stormId)}/invite`,
			body: { participants, message, type },
		}),
		{
			log: (_, result) => ({ invited: result.invited ?? undefined }),
		},
	);

export const acceptInvite: StormboardEndpoints['stormsAcceptInvite'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'storms.acceptInvite',
			input: Inputs.stormsAcceptInvite,
			output: Outputs.stormsAcceptInvite,
		},
		input,
		({ stormId }) => ({
			method: 'POST',
			path: `/storms/${segment(stormId)}/invite/accept`,
			body: {},
		}),
	);

export const declineInvite: StormboardEndpoints['stormsDeclineInvite'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'storms.declineInvite',
			input: Inputs.stormsDeclineInvite,
			output: Outputs.stormsDeclineInvite,
		},
		input,
		({ stormId }) => ({
			method: 'POST',
			path: `/storms/${segment(stormId)}/invite/decline`,
			body: {},
		}),
	);

export const join: StormboardEndpoints['stormsJoin'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.join',
			input: Inputs.stormsJoin,
			output: Outputs.stormsJoin,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/storms/join',
			body,
		}),
	);

export const leave: StormboardEndpoints['stormsLeave'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.leave',
			input: Inputs.stormsLeave,
			output: Outputs.stormsLeave,
		},
		input,
		({ stormId }) => ({
			method: 'POST',
			path: `/storms/${segment(stormId)}/leave`,
			body: {},
		}),
	);

export const duplicate: StormboardEndpoints['stormsDuplicate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.duplicate',
			input: Inputs.stormsDuplicate,
			output: Outputs.stormsDuplicate,
		},
		input,
		({ stormId, stormname }) => ({
			method: 'POST',
			path: `/storms/${segment(stormId)}/duplicate`,
			body: { stormname },
		}),
		{
			log: (_, result) => ({ newStormId: result.id ?? undefined }),
		},
	);

export const favorite: StormboardEndpoints['stormsFavorite'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'storms.favorite',
			input: Inputs.stormsFavorite,
			output: Outputs.stormsFavorite,
		},
		input,
		({ stormId }) => ({
			method: 'POST',
			path: `/storms/${segment(stormId)}/favorite`,
			body: {},
		}),
		{
			log: () => ({ favorited: true }),
		},
	);

export const unfavorite: StormboardEndpoints['stormsUnfavorite'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'storms.unfavorite',
			input: Inputs.stormsUnfavorite,
			output: Outputs.stormsUnfavorite,
		},
		input,
		({ stormId }) => ({
			method: 'DELETE',
			path: `/storms/${segment(stormId)}/favorite`,
		}),
		{
			log: () => ({ favorited: false }),
		},
	);
