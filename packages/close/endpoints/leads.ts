import { makeCloseRequest } from '../client';
import type { CloseContext } from '../index';
import type {
	LeadsCreateInput,
	LeadsCreateResponse,
	LeadsDeleteInput,
	LeadsDeleteResponse,
	LeadsGetInput,
	LeadsGetResponse,
	LeadsListInput,
	LeadsListResponse,
	LeadsUpdateInput,
	LeadsUpdateResponse,
} from './types';

export const leadsList = async (
	ctx: CloseContext,
	input?: LeadsListInput,
): Promise<LeadsListResponse> => {
	const res = await makeCloseRequest<LeadsListResponse>('lead/', ctx.key, {
		method: 'GET',
		query: input,
	});
	return res;
};

export const leadsGet = async (
	ctx: CloseContext,
	input: LeadsGetInput,
): Promise<LeadsGetResponse> => {
	const res = await makeCloseRequest<LeadsGetResponse>(
		`lead/${input.id}/`,
		ctx.key,
		{ method: 'GET' },
	);
	return res;
};

export const leadsCreate = async (
	ctx: CloseContext,
	input: LeadsCreateInput,
): Promise<LeadsCreateResponse> => {
	const res = await makeCloseRequest<LeadsCreateResponse>('lead/', ctx.key, {
		method: 'POST',
		body: input as Record<string, unknown>,
	});
	return res;
};

export const leadsUpdate = async (
	ctx: CloseContext,
	input: LeadsUpdateInput,
): Promise<LeadsUpdateResponse> => {
	const { id, ...body } = input;
	const res = await makeCloseRequest<LeadsUpdateResponse>(
		`lead/${id}/`,
		ctx.key,
		{
			method: 'PUT',
			body: body as Record<string, unknown>,
		},
	);
	return res;
};

export const leadsDelete = async (
	ctx: CloseContext,
	input: LeadsDeleteInput,
): Promise<LeadsDeleteResponse> => {
	await makeCloseRequest<unknown>(`lead/${input.id}/`, ctx.key, {
		method: 'DELETE',
	});
	return { success: true, id: input.id };
};
