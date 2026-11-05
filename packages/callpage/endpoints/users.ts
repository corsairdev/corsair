import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import type { CallPageEndpoints } from '../index';
import { deleteUser, patchUser, saveUsers } from './persist';
import type { CallPageEndpointOutputs } from './types';
import {
	CallPageEndpointInputSchemas,
	CallPageEndpointOutputSchemas,
} from './types';

export const list: CallPageEndpoints['usersList'] = async (ctx, rawInput) => {
	const input = CallPageEndpointInputSchemas.usersList.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['usersList']
	>('/api/v1/external/users/all', ctx.key, {
		query: input,
		schema: CallPageEndpointOutputSchemas.usersList,
	});
	await saveUsers(ctx, result);
	await logEventFromContext(ctx, 'callpage.users.list', input, 'completed');
	return result;
};

export const get: CallPageEndpoints['usersGet'] = async (ctx, rawInput) => {
	const input = CallPageEndpointInputSchemas.usersGet.parse(rawInput);
	const result = await makeCallPageRequest<CallPageEndpointOutputs['usersGet']>(
		'/api/v1/external/users/get',
		ctx.key,
		{ query: input, schema: CallPageEndpointOutputSchemas.usersGet },
	);
	await saveUsers(ctx, [result]);
	await logEventFromContext(ctx, 'callpage.users.get', input, 'completed');
	return result;
};

export const create: CallPageEndpoints['usersCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = CallPageEndpointInputSchemas.usersCreate.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['usersCreate']
	>('/api/v1/external/users/create', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.usersCreate,
	});
	await patchUser(ctx, {
		id: result.id,
		name: input.name,
		tel: input.tel,
		email: input.email,
		role: input.role ? { slug: input.role } : undefined,
	});
	await logEventFromContext(ctx, 'callpage.users.create', input, 'completed');
	return result;
};

export const update: CallPageEndpoints['usersUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = CallPageEndpointInputSchemas.usersUpdate.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['usersUpdate']
	>('/api/v1/external/users/update', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.usersUpdate,
	});
	await patchUser(ctx, {
		id: input.id,
		name: input.name,
		tel: input.tel,
		email: input.email,
		role: input.role ? { slug: input.role } : undefined,
	});
	await logEventFromContext(ctx, 'callpage.users.update', input, 'completed');
	return result;
};

export const remove: CallPageEndpoints['usersDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = CallPageEndpointInputSchemas.usersDelete.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['usersDelete']
	>('/api/v1/external/users/delete', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.usersDelete,
	});
	await deleteUser(ctx, input.id);
	await logEventFromContext(ctx, 'callpage.users.delete', input, 'completed');
	return result;
};
