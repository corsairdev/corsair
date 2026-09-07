import { makeCloseRequest } from '../client';
import type { CloseContext } from '../index';
import type {
	OpportunitiesCreateInput,
	OpportunitiesCreateResponse,
	OpportunitiesDeleteInput,
	OpportunitiesDeleteResponse,
	OpportunitiesGetInput,
	OpportunitiesGetResponse,
	OpportunitiesListInput,
	OpportunitiesListResponse,
	OpportunitiesUpdateInput,
	OpportunitiesUpdateResponse,
} from './types';

export const opportunitiesList = async (
	ctx: CloseContext,
	input?: OpportunitiesListInput,
): Promise<OpportunitiesListResponse> => {
	const res = await makeCloseRequest<OpportunitiesListResponse>(
		'opportunity/',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);
	return res;
};

export const opportunitiesGet = async (
	ctx: CloseContext,
	input: OpportunitiesGetInput,
): Promise<OpportunitiesGetResponse> => {
	const res = await makeCloseRequest<OpportunitiesGetResponse>(
		`opportunity/${input.id}/`,
		ctx.key,
		{ method: 'GET' },
	);
	return res;
};

export const opportunitiesCreate = async (
	ctx: CloseContext,
	input: OpportunitiesCreateInput,
): Promise<OpportunitiesCreateResponse> => {
	const res = await makeCloseRequest<OpportunitiesCreateResponse>(
		'opportunity/',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);
	return res;
};

export const opportunitiesUpdate = async (
	ctx: CloseContext,
	input: OpportunitiesUpdateInput,
): Promise<OpportunitiesUpdateResponse> => {
	const { id, ...body } = input;
	const res = await makeCloseRequest<OpportunitiesUpdateResponse>(
		`opportunity/${id}/`,
		ctx.key,
		{
			method: 'PUT',
			body: body as Record<string, unknown>,
		},
	);
	return res;
};

export const opportunitiesDelete = async (
	ctx: CloseContext,
	input: OpportunitiesDeleteInput,
): Promise<OpportunitiesDeleteResponse> => {
	await makeCloseRequest<unknown>(`opportunity/${input.id}/`, ctx.key, {
		method: 'DELETE',
	});
	return { success: true, id: input.id };
};
