import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['usersList'] = (ctx, input) =>
	callCeligo(ctx, 'users.list', In.usersList, Out.usersList, input, (i) => ({
		method: 'GET',
		save: 'users',
		path: ['ashares'],
		query: { userType: i.userType },
		empty: [],
	}));

export const get: CeligoEndpoints['usersGet'] = (ctx, input) =>
	callCeligo(ctx, 'users.get', In.usersGet, Out.usersGet, input, (i) => ({
		method: 'GET',
		save: 'users',
		path: ['ashares', i.id],
	}));

export const invite: CeligoEndpoints['usersInvite'] = (ctx, input) =>
	callCeligo(
		ctx,
		'users.invite',
		In.usersInvite,
		Out.usersInvite,
		input,
		(i) => ({
			method: 'POST',
			save: 'users',
			path: ['invite'],
			body: i,
		}),
	);

export const inviteMultiple: CeligoEndpoints['usersInviteMultiple'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'users.inviteMultiple',
		In.usersInviteMultiple,
		Out.usersInviteMultiple,
		input,
		(i) => ({
			method: 'POST',
			path: ['invite', 'multiple'],
			body: i,
		}),
	);

export const update: CeligoEndpoints['usersUpdate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'users.update',
		In.usersUpdate,
		Out.usersUpdate,
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: ['ashares', id],
			body,
			empty: { success: true },
		}),
	);

export const remove: CeligoEndpoints['usersDelete'] = (ctx, input) =>
	callCeligo(
		ctx,
		'users.delete',
		In.usersDelete,
		Out.usersDelete,
		input,
		(i) => ({
			method: 'DELETE',
			drop: 'users',
			path: ['ashares', i.id],
			empty: { success: true },
		}),
	);
