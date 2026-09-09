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
	const { agentId, limit } = input;

	const query: Record<string, string | number | boolean | undefined> = {
		agentId,
	};
	if (limit !== undefined) query.limit = limit;

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

	const response = await makePhantomBusterRequest<FetchContainerResponse>(
		'/containers/fetch',
		ctx.key,
		{
			method: 'GET',
			query: { id },
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

	const response = await makePhantomBusterRequest<FetchContainerOutputResponse>(
		'/containers/fetch-output',
		ctx.key,
		{
			method: 'GET',
			query: { id },
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
