import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type {
	FetchAllContainersInput,
	FetchAllContainersResponse,
	FetchContainerInput,
	FetchContainerOutputInput,
	FetchContainerOutputResponse,
	FetchContainerResponse,
	FetchContainerResultObjectInput,
	FetchContainerResultObjectResponse,
} from './types';

export const fetchAll = async (
	ctx: PhantomBusterContext,
	input: FetchAllContainersInput,
): Promise<FetchAllContainersResponse> => {
	const { agentId } = input;

	const query: Record<string, string | number | boolean | undefined> = {
		agentId,
	};
	if (input.beforeEndedAt !== undefined)
		query.beforeEndedAt = input.beforeEndedAt;
	if (input.limit !== undefined) query.limit = input.limit;
	if (input.mode !== undefined) query.mode = input.mode;
	if (input.withRuntimeEvents !== undefined)
		query.withRuntimeEvents = input.withRuntimeEvents;

	const response = await makePhantomBusterRequest<FetchAllContainersResponse>(
		'/containers/fetch-all',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.containers.fetchAll',
		{ agentId },
		'completed',
	);

	return response;
};

export const fetch = async (
	ctx: PhantomBusterContext,
	input: FetchContainerInput,
): Promise<FetchContainerResponse> => {
	const { id } = input;

	const query: Record<string, string | number | boolean | undefined> = { id };
	if (input.withResultObject !== undefined)
		query.withResultObject = input.withResultObject;
	if (input.withOutput !== undefined) query.withOutput = input.withOutput;
	if (input.withRuntimeEvents !== undefined)
		query.withRuntimeEvents = input.withRuntimeEvents;
	if (input.withNewerAndOlderContainerId !== undefined)
		query.withNewerAndOlderContainerId = input.withNewerAndOlderContainerId;

	const response = await makePhantomBusterRequest<FetchContainerResponse>(
		'/containers/fetch',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.containers.fetch',
		{ id },
		'completed',
	);

	return response;
};

export const fetchOutput = async (
	ctx: PhantomBusterContext,
	input: FetchContainerOutputInput,
): Promise<FetchContainerOutputResponse> => {
	const { id } = input;

	const query: Record<string, string | number | boolean | undefined> = { id };
	if (input.mode !== undefined) query.mode = input.mode;

	const response = await makePhantomBusterRequest<FetchContainerOutputResponse>(
		'/containers/fetch-output',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.containers.fetchOutput',
		{ id },
		'completed',
	);

	return response;
};

export const fetchResultObject = async (
	ctx: PhantomBusterContext,
	input: FetchContainerResultObjectInput,
): Promise<FetchContainerResultObjectResponse> => {
	const { id } = input;

	const response =
		await makePhantomBusterRequest<FetchContainerResultObjectResponse>(
			'/containers/fetch-result-object',
			ctx.key,
			{
				method: 'GET',
				query: { id },
			},
		);

	await logEventFromContext(
		ctx,
		'phantombuster.containers.fetchResultObject',
		{ id },
		'completed',
	);

	return response;
};
