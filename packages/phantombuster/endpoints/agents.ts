import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type {
	DeleteAgentInput,
	DeleteAgentResponse,
	FetchAgentInput,
	FetchAgentOutputInput,
	FetchAgentOutputResponse,
	FetchAgentResponse,
	FetchAllAgentsInput,
	FetchAllAgentsResponse,
	LaunchAgentInput,
	LaunchAgentResponse,
	SaveAgentInput,
	SaveAgentResponse,
	StopAgentInput,
	StopAgentResponse,
} from './types';

export const fetchAll = async (
	ctx: PhantomBusterContext,
	input: FetchAllAgentsInput,
): Promise<FetchAllAgentsResponse> => {
	const { search } = input ?? {};

	const response = await makePhantomBusterRequest<FetchAllAgentsResponse>(
		'/agents/fetch-all',
		ctx.key,
		{
			method: 'GET',
			query: search ? { search } : undefined,
		},
	);

	await logEventFromContext(ctx, 'phantombuster.agents.fetchAll', {}, 'completed');

	return response;
};

export const fetch = async (
	ctx: PhantomBusterContext,
	input: FetchAgentInput,
): Promise<FetchAgentResponse> => {
	const { id } = input;

	const response = await makePhantomBusterRequest<FetchAgentResponse>(
		'/agents/fetch',
		ctx.key,
		{
			method: 'GET',
			query: { id },
		},
	);

	await logEventFromContext(ctx, 'phantombuster.agents.fetch', { id }, 'completed');

	return response;
};

export const save = async (
	ctx: PhantomBusterContext,
	input: SaveAgentInput,
): Promise<SaveAgentResponse> => {
	const response = await makePhantomBusterRequest<SaveAgentResponse>(
		'/agents/save',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	const agentId = input.id ?? response.id;
	await logEventFromContext(
		ctx,
		'phantombuster.agents.save',
		{ id: agentId },
		'completed',
	);

	return response;
};

export const remove = async (
	ctx: PhantomBusterContext,
	input: DeleteAgentInput,
): Promise<DeleteAgentResponse> => {
	const { id } = input;

	const response = await makePhantomBusterRequest<DeleteAgentResponse>(
		'/agents/delete',
		ctx.key,
		{
			method: 'POST',
			body: { id },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.agents.delete',
		{ id },
		'completed',
	);

	return response;
};

export const launch = async (
	ctx: PhantomBusterContext,
	input: LaunchAgentInput,
): Promise<LaunchAgentResponse> => {
	const { id, argument, manualCookieSession } = input;

	const body: Record<string, unknown> = { id };
	if (argument !== undefined) body.argument = argument;
	if (manualCookieSession !== undefined)
		body.manualCookieSession = manualCookieSession;

	const response = await makePhantomBusterRequest<LaunchAgentResponse>(
		'/agents/launch',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.agents.launch',
		{ id },
		'completed',
	);

	return response;
};

export const stop = async (
	ctx: PhantomBusterContext,
	input: StopAgentInput,
): Promise<StopAgentResponse> => {
	const { id } = input;

	const response = await makePhantomBusterRequest<StopAgentResponse>(
		'/agents/stop',
		ctx.key,
		{
			method: 'POST',
			body: { id },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.agents.stop',
		{ id },
		'completed',
	);

	return response;
};

export const fetchOutput = async (
	ctx: PhantomBusterContext,
	input: FetchAgentOutputInput,
): Promise<FetchAgentOutputResponse> => {
	const { id, status, mode, since } = input;

	const query: Record<string, string | number | boolean | undefined> = { id };
	if (status !== undefined) query.status = status;
	if (mode !== undefined) query.mode = mode;
	if (since !== undefined) query.since = since;

	const response = await makePhantomBusterRequest<FetchAgentOutputResponse>(
		'/agents/fetch-output',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.agents.fetchOutput',
		{ id },
		'completed',
	);

	return response;
};
