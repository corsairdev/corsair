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
import {
	OpportunitiesCreateInputSchema,
	OpportunitiesCreateResponseSchema,
	OpportunitiesDeleteInputSchema,
	OpportunitiesDeleteResponseSchema,
	OpportunitiesGetInputSchema,
	OpportunitiesGetResponseSchema,
	OpportunitiesListInputSchema,
	OpportunitiesListResponseSchema,
	OpportunitiesUpdateInputSchema,
	OpportunitiesUpdateResponseSchema,
} from './types';

export const opportunitiesList = async (
	ctx: CloseContext,
	input?: OpportunitiesListInput,
): Promise<OpportunitiesListResponse> => {
	const parsedInput = input
		? OpportunitiesListInputSchema.parse(input)
		: undefined;
	const res = await makeCloseRequest<unknown>('opportunity/', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});
	return OpportunitiesListResponseSchema.parse(res);
};

export const opportunitiesGet = async (
	ctx: CloseContext,
	input: OpportunitiesGetInput,
): Promise<OpportunitiesGetResponse> => {
	const parsedInput = OpportunitiesGetInputSchema.parse(input);
	const res = await makeCloseRequest<unknown>(
		`opportunity/${parsedInput.id}/`,
		ctx.key,
		{ method: 'GET' },
	);
	return OpportunitiesGetResponseSchema.parse(res);
};

export const opportunitiesCreate = async (
	ctx: CloseContext,
	input: OpportunitiesCreateInput,
): Promise<OpportunitiesCreateResponse> => {
	const parsedInput = OpportunitiesCreateInputSchema.parse(input);
	const res = await makeCloseRequest<unknown>('opportunity/', ctx.key, {
		method: 'POST',
		body: parsedInput as Record<string, unknown>,
	});
	return OpportunitiesCreateResponseSchema.parse(res);
};

export const opportunitiesUpdate = async (
	ctx: CloseContext,
	input: OpportunitiesUpdateInput,
): Promise<OpportunitiesUpdateResponse> => {
	const parsedInput = OpportunitiesUpdateInputSchema.parse(input);
	const { id, ...body } = parsedInput;
	const res = await makeCloseRequest<unknown>(`opportunity/${id}/`, ctx.key, {
		method: 'PUT',
		body: body as Record<string, unknown>,
	});
	return OpportunitiesUpdateResponseSchema.parse(res);
};

export const opportunitiesDelete = async (
	ctx: CloseContext,
	input: OpportunitiesDeleteInput,
): Promise<OpportunitiesDeleteResponse> => {
	const parsedInput = OpportunitiesDeleteInputSchema.parse(input);
	await makeCloseRequest<unknown>(`opportunity/${parsedInput.id}/`, ctx.key, {
		method: 'DELETE',
	});
	return OpportunitiesDeleteResponseSchema.parse({
		success: true,
		id: parsedInput.id,
	});
};
