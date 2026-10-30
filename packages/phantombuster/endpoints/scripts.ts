import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type {
	DeleteScriptInput,
	DeleteScriptResponse,
	FetchAllScriptsInput,
	FetchAllScriptsResponse,
	FetchScriptCodeInput,
	FetchScriptCodeResponse,
	FetchScriptInput,
	FetchScriptResponse,
	SaveScriptInput,
	SaveScriptResponse,
	UpdateScriptAccessListInput,
	UpdateScriptAccessListResponse,
	UpdateScriptVisibilityInput,
	UpdateScriptVisibilityResponse,
} from './types';

export const fetch = async (
	ctx: PhantomBusterContext,
	input: FetchScriptInput,
): Promise<FetchScriptResponse> => {
	const response = await makePhantomBusterRequest<FetchScriptResponse>(
		'/scripts/fetch',
		ctx.key,
		{
			method: 'GET',
			query: {
				id: input.id,
				branch: input.branch,
				environment: input.environment,
				withCode: input.withCode,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.scripts.fetch',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const fetchAll = async (
	ctx: PhantomBusterContext,
	input: FetchAllScriptsInput,
): Promise<FetchAllScriptsResponse> => {
	const response = await makePhantomBusterRequest<FetchAllScriptsResponse>(
		'/scripts/fetch-all',
		ctx.key,
		{
			method: 'GET',
			query: {
				org: input.org,
				branch: input.branch,
				exclude: input.exclude,
				scriptIds:
					input.scriptIds === undefined
						? undefined
						: Array.isArray(input.scriptIds)
							? input.scriptIds.join(',')
							: input.scriptIds,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.scripts.fetchAll',
		{},
		'completed',
	);

	return response;
};

export const fetchCode = async (
	ctx: PhantomBusterContext,
	input: FetchScriptCodeInput,
): Promise<FetchScriptCodeResponse> => {
	const response = await makePhantomBusterRequest<FetchScriptCodeResponse>(
		'/scripts/code',
		ctx.key,
		{
			method: 'GET',
			query: {
				script: input.script,
				org: input.org,
				branch: input.branch,
				environment: input.environment,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.scripts.fetchCode',
		{},
		'completed',
	);

	return response;
};

export const updateVisibility = async (
	ctx: PhantomBusterContext,
	input: UpdateScriptVisibilityInput,
): Promise<UpdateScriptVisibilityResponse> => {
	const response =
		await makePhantomBusterRequest<UpdateScriptVisibilityResponse>(
			'/scripts/visibility',
			ctx.key,
			{
				method: 'POST',
				body: {
					name: input.name,
					branch: input.branch,
					visibility: input.visibility,
				},
			},
		);

	await logEventFromContext(
		ctx,
		'phantombuster.scripts.updateVisibility',
		{ name: input.name },
		'completed',
	);

	return response;
};

export const updateAccessList = async (
	ctx: PhantomBusterContext,
	input: UpdateScriptAccessListInput,
): Promise<UpdateScriptAccessListResponse> => {
	// unknown: POST bodies are endpoint-specific JSON shapes accepted by makePhantomBusterRequest.
	const body: Record<string, unknown> = {
		name: input.name,
		branch: input.branch,
	};
	if (input.add !== undefined) body.add = input.add;
	if (input.remove !== undefined) body.remove = input.remove;

	const response =
		await makePhantomBusterRequest<UpdateScriptAccessListResponse>(
			'/scripts/access-list',
			ctx.key,
			{ method: 'POST', body },
		);

	await logEventFromContext(
		ctx,
		'phantombuster.scripts.updateAccessList',
		{ name: input.name },
		'completed',
	);

	return response;
};

export const save = async (
	ctx: PhantomBusterContext,
	input: SaveScriptInput,
): Promise<SaveScriptResponse> => {
	const response = await makePhantomBusterRequest<SaveScriptResponse>(
		'/scripts/save',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
	);

	await logEventFromContext(ctx, 'phantombuster.scripts.save', {}, 'completed');

	return response;
};

export const remove = async (
	ctx: PhantomBusterContext,
	input: DeleteScriptInput,
): Promise<DeleteScriptResponse> => {
	const response = await makePhantomBusterRequest<DeleteScriptResponse>(
		'/scripts/delete',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.scripts.delete',
		{ id: input.id },
		'completed',
	);

	return response;
};
