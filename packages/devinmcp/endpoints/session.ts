import { logEventFromContext } from 'corsair/core';
import type { DevinMcpEndpoints } from '..';
import { makeDevinMcpRequest } from '../client';
import type { DevinMcpEndpointOutputs } from './types';

export const create: DevinMcpEndpoints['createSession'] = async (
	ctx,
	input,
) => {
	const response = await makeDevinMcpRequest<
		DevinMcpEndpointOutputs['createSession']
	>('v1/sessions', ctx.key, {
		method: 'POST',
		body: { ...input },
	});
	await logEventFromContext(
		ctx,
		'devinmcp.session.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: DevinMcpEndpoints['getSession'] = async (ctx, input) => {
	const response = await makeDevinMcpRequest<
		DevinMcpEndpointOutputs['getSession']
	>(`v1/sessions/${input.session_id}`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'devinmcp.session.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: DevinMcpEndpoints['listSessions'] = async (ctx, input) => {
	const response = await makeDevinMcpRequest<
		DevinMcpEndpointOutputs['listSessions']
	>('v1/sessions', ctx.key, {
		method: 'GET',
		query: { limit: input.limit, offset: input.offset },
	});
	await logEventFromContext(
		ctx,
		'devinmcp.session.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const sendMessage: DevinMcpEndpoints['sendMessage'] = async (
	ctx,
	input,
) => {
	const response = await makeDevinMcpRequest<
		DevinMcpEndpointOutputs['sendMessage']
	>(`v1/sessions/${encodeURIComponent(input.session_id)}/message`, ctx.key, {
		method: 'POST',
		body: { message: input.message },
	});
	await logEventFromContext(
		ctx,
		'devinmcp.session.sendMessage',
		{ ...input },
		'completed',
	);
	return response;
};
