import { makeZohoBiginRequest } from '../client';
import type {
	ZohoBiginEndpointInputs,
	ZohoBiginEndpointOutputs,
	ZohoBiginEndpoints,
} from '../index';

export const getUsers: ZohoBiginEndpoints['getUsers'] = async (
	ctx,
	input: ZohoBiginEndpointInputs['getUsers'],
) => {
	return await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getUsers']>(
		'users',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);
};

export const getUser: ZohoBiginEndpoints['getUser'] = async (
	ctx,
	input: ZohoBiginEndpointInputs['getUser'],
) => {
	const { id } = input;
	return await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getUser']>(
		`users/${id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
};

export const updateUser: ZohoBiginEndpoints['updateUser'] = async (
	ctx,
	input: ZohoBiginEndpointInputs['updateUser'],
) => {
	const { id, data } = input;
	return await makeZohoBiginRequest<ZohoBiginEndpointOutputs['updateUser']>(
		`users/${id}`,
		ctx.key,
		{
			method: 'PUT',
			body: { users: [{ ...data, id }] },
		},
	);
};

export const updateUsers: ZohoBiginEndpoints['updateUsers'] = async (
	ctx,
	input: ZohoBiginEndpointInputs['updateUsers'],
) => {
	return await makeZohoBiginRequest<ZohoBiginEndpointOutputs['updateUsers']>(
		'users',
		ctx.key,
		{
			method: 'PUT',
			body: input,
		},
	);
};

export const getRoles: ZohoBiginEndpoints['getRoles'] = async (ctx) => {
	return await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getRoles']>(
		'settings/roles',
		ctx.key,
		{
			method: 'GET',
		},
	);
};

export const getProfiles: ZohoBiginEndpoints['getProfiles'] = async (ctx) => {
	return await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getProfiles']>(
		'settings/profiles',
		ctx.key,
		{
			method: 'GET',
		},
	);
};

export const getOrganization: ZohoBiginEndpoints['getOrganization'] = async (
	ctx,
) => {
	return await makeZohoBiginRequest<
		ZohoBiginEndpointOutputs['getOrganization']
	>('org', ctx.key, {
		method: 'GET',
	});
};

export const uploadOrganizationPhoto: ZohoBiginEndpoints['uploadOrganizationPhoto'] =
	async (ctx, input: ZohoBiginEndpointInputs['uploadOrganizationPhoto']) => {
		return await makeZohoBiginRequest<
			ZohoBiginEndpointOutputs['uploadOrganizationPhoto']
		>('org/photo', ctx.key, {
			method: 'POST',
			body: input.file,
		});
	};
