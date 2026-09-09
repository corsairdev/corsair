import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterEndpoints } from '../index';
import type {
	FetchAllContainersResponse,
	FetchContainerOutputResponse,
	FetchContainerResponse,
	FetchContainerResultObjectResponse,
} from './types';

export const fetchAll: PhantomBusterEndpoints['fetchAllContainers'] = async (
	ctx,
	input,
) => {
	const { agentId, limit } = input;

	const query: Record<string, string | number | boolean | undefined> = {
		agentId,
	};
	if (limit !== undefined) query.limit = limit;

	const response =
		await makePhantomBusterRequest<FetchAllContainersResponse>(
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

export const fetch: PhantomBusterEndpoints['fetchContainer'] = async (ctx, input) => {
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

export const fetchOutput: PhantomBusterEndpoints['fetchContainerOutput'] =
	async (ctx, input) => {
		const { id } = input;

		const response =
			await makePhantomBusterRequest<FetchContainerOutputResponse>(
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

export const fetchResultObject: PhantomBusterEndpoints['fetchContainerResultObject'] =
	async (ctx, input) => {
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
