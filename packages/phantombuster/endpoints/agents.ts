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
	FetchDeletedAgentsInput,
	FetchDeletedAgentsResponse,
	LaunchAgentInput,
	LaunchAgentResponse,
	LaunchAgentSoonInput,
	LaunchAgentSoonResponse,
	SaveAgentInput,
	SaveAgentResponse,
	StopAgentInput,
	StopAgentResponse,
	UnscheduleAllAgentsInput,
	UnscheduleAllAgentsResponse,
} from './types';

export const fetchAll = async (
	ctx: PhantomBusterContext,
	_input: FetchAllAgentsInput,
): Promise<FetchAllAgentsResponse> => {
	const response = await makePhantomBusterRequest<FetchAllAgentsResponse>(
		'/agents/fetch-all',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'phantombuster.agents.fetchAll',
		{},
		'completed',
	);

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

	await logEventFromContext(
		ctx,
		'phantombuster.agents.fetch',
		{ id },
		'completed',
	);

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
			body: { ...input },
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
	const { id } = input;

	// unknown: POST bodies are endpoint-specific JSON shapes accepted by makePhantomBusterRequest.
	const body: Record<string, unknown> = { id };
	if (input.argument !== undefined) body.argument = input.argument;
	if (input.arguments !== undefined) body.arguments = input.arguments;
	if (input.bonusArgument !== undefined)
		body.bonusArgument = input.bonusArgument;
	if (input.saveArgument !== undefined) body.saveArgument = input.saveArgument;
	if (input.saveArguments !== undefined)
		body.saveArguments = input.saveArguments;
	if (input.manualLaunch !== undefined) body.manualLaunch = input.manualLaunch;
	if (input.maxInstanceCount !== undefined)
		body.maxInstanceCount = input.maxInstanceCount;

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

	// unknown: POST bodies are endpoint-specific JSON shapes accepted by makePhantomBusterRequest.
	const body: Record<string, unknown> = { id };
	if (input.softAbort !== undefined) body.softAbort = input.softAbort;
	if (input.cascadeToAllSlaves !== undefined)
		body.cascadeToAllSlaves = input.cascadeToAllSlaves;
	if (input.dontLaunchSoon !== undefined)
		body.dontLaunchSoon = input.dontLaunchSoon;
	if (input.switchToManualLaunch !== undefined)
		body.switchToManualLaunch = input.switchToManualLaunch;

	const response = await makePhantomBusterRequest<StopAgentResponse>(
		'/agents/stop',
		ctx.key,
		{
			method: 'POST',
			body,
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

export const launchSoon = async (
	ctx: PhantomBusterContext,
	input: LaunchAgentSoonInput,
): Promise<LaunchAgentSoonResponse> => {
	// unknown: POST bodies are endpoint-specific JSON shapes accepted by makePhantomBusterRequest.
	const body: Record<string, unknown> = {
		id: input.id,
		minutes: input.minutes,
	};
	if (input.argument !== undefined) body.argument = input.argument;
	if (input.arguments !== undefined) body.arguments = input.arguments;
	if (input.saveArgument !== undefined) body.saveArgument = input.saveArgument;
	if (input.saveArguments !== undefined)
		body.saveArguments = input.saveArguments;

	const response = await makePhantomBusterRequest<LaunchAgentSoonResponse>(
		'/agents/launch-soon',
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'phantombuster.agents.launchSoon',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const unscheduleAll = async (
	ctx: PhantomBusterContext,
	_input: UnscheduleAllAgentsInput,
): Promise<UnscheduleAllAgentsResponse> => {
	const response = await makePhantomBusterRequest<UnscheduleAllAgentsResponse>(
		'/agents/unschedule-all',
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'phantombuster.agents.unscheduleAll',
		{},
		'completed',
	);

	return response;
};

export const fetchDeleted = async (
	ctx: PhantomBusterContext,
	_input: FetchDeletedAgentsInput,
): Promise<FetchDeletedAgentsResponse> => {
	const response = await makePhantomBusterRequest<FetchDeletedAgentsResponse>(
		'/agents/fetch-deleted',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'phantombuster.agents.fetchDeleted',
		{},
		'completed',
	);

	return response;
};

export const fetchOutput = async (
	ctx: PhantomBusterContext,
	input: FetchAgentOutputInput,
): Promise<FetchAgentOutputResponse> => {
	const { id } = input;

	const query: Record<string, string | number | boolean | undefined> = { id };
	if (input.fromOutputPos !== undefined)
		query.fromOutputPos = input.fromOutputPos;
	if (input.prevContainerId !== undefined)
		query.prevContainerId = input.prevContainerId;
	if (input.prevStatus !== undefined) query.prevStatus = input.prevStatus;
	if (input.prevRuntimeEventIndex !== undefined)
		query.prevRuntimeEventIndex = input.prevRuntimeEventIndex;

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
