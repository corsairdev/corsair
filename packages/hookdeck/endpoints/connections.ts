import { logEventFromContext } from 'corsair/core';
import type { HookdeckEndpoints } from '..';
import { makeHookdeckRequest } from '../client';
import {
	HookdeckEndpointInputSchemas,
	HookdeckEndpointOutputSchemas,
} from './types';

export const connectionsList: HookdeckEndpoints['connectionsList'] = async (
	ctx,
	input,
) => {
	const parsedInput = HookdeckEndpointInputSchemas.connectionsList.parse(input);
	const raw = await makeHookdeckRequest<unknown>('connections', ctx.key, {
		method: 'GET',
		query: { ...parsedInput },
	});
	const response = HookdeckEndpointOutputSchemas.connectionsList.parse(raw);

	await logEventFromContext(
		ctx,
		'hookdeck.connections.list',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const connectionsCreate: HookdeckEndpoints['connectionsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HookdeckEndpointInputSchemas.connectionsCreate.parse(input);
	const raw = await makeHookdeckRequest<unknown>('connections', ctx.key, {
		method: 'POST',
		body: { ...parsedInput },
	});
	const response = HookdeckEndpointOutputSchemas.connectionsCreate.parse(raw);

	await logEventFromContext(
		ctx,
		'hookdeck.connections.create',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const connectionsGet: HookdeckEndpoints['connectionsGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = HookdeckEndpointInputSchemas.connectionsGet.parse(input);
	const raw = await makeHookdeckRequest<unknown>(
		`connections/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const response = HookdeckEndpointOutputSchemas.connectionsGet.parse(raw);

	await logEventFromContext(
		ctx,
		'hookdeck.connections.get',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const connectionsUpdate: HookdeckEndpoints['connectionsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HookdeckEndpointInputSchemas.connectionsUpdate.parse(input);
	const { id, ...body } = parsedInput;
	const raw = await makeHookdeckRequest<unknown>(
		`connections/${encodeURIComponent(id)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);
	const response = HookdeckEndpointOutputSchemas.connectionsUpdate.parse(raw);

	await logEventFromContext(
		ctx,
		'hookdeck.connections.update',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const connectionsDelete: HookdeckEndpoints['connectionsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HookdeckEndpointInputSchemas.connectionsDelete.parse(input);
	const raw = await makeHookdeckRequest<unknown>(
		`connections/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const response = HookdeckEndpointOutputSchemas.connectionsDelete.parse(raw);

	await logEventFromContext(
		ctx,
		'hookdeck.connections.delete',
		{ ...parsedInput },
		'completed',
	);
	return response;
};
