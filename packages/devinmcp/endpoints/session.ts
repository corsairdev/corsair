import { logEventFromContext } from 'corsair/core';
import type { DevinMcpEndpoints } from '..';
import { makeDevinMcpRequest } from '../client';
import type {
	CreateSessionInput,
	DevinMcpEndpointOutputs,
	ListSessionsInput,
} from './types';

function sessionsPath(orgId: string, sessionId?: string): string {
	const org = encodeURIComponent(orgId);
	if (sessionId === undefined) {
		return `v3/organizations/${org}/sessions`;
	}
	return `v3/organizations/${org}/sessions/${encodeURIComponent(sessionId)}`;
}

function omitUndefined(
	value: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(value).filter(([, item]) => item !== undefined),
	);
}

function createBody(input: CreateSessionInput): Record<string, unknown> {
	const { org_id: _orgId, ...rest } = input;
	return omitUndefined(rest);
}

function listQuery(
	input: ListSessionsInput,
): Record<string, string | number | boolean | undefined> | undefined {
	const qs = omitUndefined({
		first: input.first,
		after: input.after,
		tags: input.tags,
		user_ids: input.user_ids,
		session_ids: input.session_ids,
	});
	if (Object.keys(qs).length === 0) return undefined;
	return { qs: JSON.stringify(qs) };
}

export const create: DevinMcpEndpoints['createSession'] = async (
	ctx,
	input,
) => {
	const response = await makeDevinMcpRequest<
		DevinMcpEndpointOutputs['createSession']
	>(sessionsPath(input.org_id), ctx.key, {
		method: 'POST',
		body: createBody(input),
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
	>(sessionsPath(input.org_id, input.session_id), ctx.key, { method: 'GET' });
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
	>(sessionsPath(input.org_id), ctx.key, {
		method: 'GET',
		query: listQuery(input),
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
	>(`${sessionsPath(input.org_id, input.session_id)}/messages`, ctx.key, {
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
