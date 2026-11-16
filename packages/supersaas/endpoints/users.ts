import type { SupersaasEndpoints } from '..';
import { segment } from '../client';
import { call, created, createdOrUpdated, deletion, updated } from './shared';
import {
	SupersaasEndpointInputSchemas as Inputs,
	SupersaasEndpointOutputSchemas as Outputs,
} from './types';

export const list: SupersaasEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		(query) => ({ method: 'GET', path: '/users', query }),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const get: SupersaasEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/users/${segment(id)}` }),
		{ log: ({ id }) => ({ userId: id }) },
	);

export const create: SupersaasEndpoints['usersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.create',
			input: Inputs.usersCreate,
			output: Outputs.usersCreate,
		},
		input,
		(user) => ({
			method: 'POST',
			path: '/users',
			body: { user },
			responseHeader: 'Location',
		}),
		{
			shape: (raw) => created(raw),
			// The login name is often an email address, so only the new id is
			// logged.
			log: (_, result) => ({ userId: result.id }),
		},
	);

/**
 * Supplying your own key in the path turns the create into an update of that
 * key, so this is the route to use when your own database owns the identifier.
 */
export const createWithKey: SupersaasEndpoints['usersCreateWithKey'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'users.createWithKey',
			input: Inputs.usersCreateWithKey,
			output: Outputs.usersCreateWithKey,
		},
		input,
		({ key, ...user }) => ({
			method: 'POST',
			path: `/users/${segment(key)}`,
			body: { user },
			responseHeader: 'Location',
		}),
		{
			// A reused key is an update: an empty 200 without Location.
			shape: (raw, { key }) => createdOrUpdated(raw, key),
			log: (_, result) => ({ userId: result.id }),
		},
	);

/**
 * A PUT to an unknown id creates it. `notfound` is how a caller asks for a 404
 * or a silent 200 instead, which the input documents.
 */
export const update: SupersaasEndpoints['usersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.update',
			input: Inputs.usersUpdate,
			output: Outputs.usersUpdate,
		},
		input,
		({ id, notfound, ...user }) => ({
			method: 'PUT',
			path: `/users/${segment(id)}`,
			query: { notfound },
			body: { user },
		}),
		{
			shape: (raw, { id }) => updated(raw, id),
			log: ({ id }) => ({ userId: id }),
		},
	);

export const remove: SupersaasEndpoints['usersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.delete',
			input: Inputs.usersDelete,
			output: Outputs.usersDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/users/${segment(id)}` }),
		{
			shape: (raw, { id }) => deletion(raw, id),
			log: ({ id }) => ({ userId: id }),
		},
	);
