import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type {
	CreateBranchInput,
	CreateBranchResponse,
	DeleteBranchInput,
	DeleteBranchResponse,
	FetchAllBranchesInput,
	FetchAllBranchesResponse,
	FetchBranchesDiffInput,
	FetchBranchesDiffResponse,
	ReleaseBranchInput,
	ReleaseBranchResponse,
} from './types';

export const fetchAll = async (
	ctx: PhantomBusterContext,
	_input: FetchAllBranchesInput,
): Promise<FetchAllBranchesResponse> => {
	const response = await makePhantomBusterRequest<FetchAllBranchesResponse>(
		'/branches/fetch-all',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'phantombuster.branches.fetchAll',
		{},
		'completed',
	);

	return response;
};

export const fetchDiff = async (
	ctx: PhantomBusterContext,
	input: FetchBranchesDiffInput,
): Promise<FetchBranchesDiffResponse> => {
	const response = await makePhantomBusterRequest<FetchBranchesDiffResponse>(
		'/branches/diff',
		ctx.key,
		{
			method: 'GET',
			query: { name: input.name },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.branches.fetchDiff',
		{},
		'completed',
	);

	return response;
};

export const create = async (
	ctx: PhantomBusterContext,
	input: CreateBranchInput,
): Promise<CreateBranchResponse> => {
	const response = await makePhantomBusterRequest<CreateBranchResponse>(
		'/branches/create',
		ctx.key,
		{
			method: 'POST',
			body: { name: input.name },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.branches.create',
		{ name: input.name },
		'completed',
	);

	return response;
};

export const remove = async (
	ctx: PhantomBusterContext,
	input: DeleteBranchInput,
): Promise<DeleteBranchResponse> => {
	const response = await makePhantomBusterRequest<DeleteBranchResponse>(
		'/branches/delete',
		ctx.key,
		{
			method: 'POST',
			body: { id: input.id },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.branches.delete',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const release = async (
	ctx: PhantomBusterContext,
	input: ReleaseBranchInput,
): Promise<ReleaseBranchResponse> => {
	const response = await makePhantomBusterRequest<ReleaseBranchResponse>(
		'/branches/release',
		ctx.key,
		{
			method: 'POST',
			body: { name: input.name, scriptIds: [...input.scriptIds] },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.branches.release',
		{ name: input.name },
		'completed',
	);

	return response;
};
