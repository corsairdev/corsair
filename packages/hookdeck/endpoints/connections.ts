import { logEventFromContext } from 'corsair/core';
import type { HookdeckEndpoints } from '..';
import { makeHookdeckRequest } from '../client';
import type { HookdeckEndpointOutputs } from './types';

export const connectionsList: HookdeckEndpoints['connectionsList'] = async (
	ctx,
	input,
) => {
	const response = await makeHookdeckRequest<
		HookdeckEndpointOutputs['connectionsList']
	>('connections', ctx.key, { method: 'GET', query: { ...input } });
	await logEventFromContext(
		ctx,
		'hookdeck.connections.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const connectionsCreate: HookdeckEndpoints['connectionsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeHookdeckRequest<
		HookdeckEndpointOutputs['connectionsCreate']
	>('connections', ctx.key, { method: 'POST', body: { ...input } });
	await logEventFromContext(
		ctx,
		'hookdeck.connections.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const connectionsGet: HookdeckEndpoints['connectionsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeHookdeckRequest<
		HookdeckEndpointOutputs['connectionsGet']
	>(`connections/${input.id}`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'hookdeck.connections.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const connectionsUpdate: HookdeckEndpoints['connectionsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const response = await makeHookdeckRequest<
		HookdeckEndpointOutputs['connectionsUpdate']
	>(`connections/${id}`, ctx.key, { method: 'PUT', body });
	await logEventFromContext(
		ctx,
		'hookdeck.connections.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const connectionsDelete: HookdeckEndpoints['connectionsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeHookdeckRequest<
		HookdeckEndpointOutputs['connectionsDelete']
	>(`connections/${input.id}`, ctx.key, { method: 'DELETE' });
	await logEventFromContext(
		ctx,
		'hookdeck.connections.delete',
		{ ...input },
		'completed',
	);
	return response;
};
