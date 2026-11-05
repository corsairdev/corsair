import { closeResourcePath, makeCloseRequestForCtx } from '../client';
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
import {
	LeadsCreateInputSchema,
	LeadsCreateResponseSchema,
	LeadsDeleteInputSchema,
	LeadsDeleteResponseSchema,
	LeadsGetInputSchema,
	LeadsGetResponseSchema,
	LeadsListInputSchema,
	LeadsListResponseSchema,
	LeadsUpdateInputSchema,
	LeadsUpdateResponseSchema,
} from './types';

export const leadsList = async (
	ctx: CloseContext,
	input?: LeadsListInput,
): Promise<LeadsListResponse> => {
	const parsedInput =
		input === undefined ? undefined : LeadsListInputSchema.parse(input);
	const res = await makeCloseRequestForCtx<unknown>(ctx, 'lead/', {
		method: 'GET',
		query: parsedInput,
	});
	return LeadsListResponseSchema.parse(res);
};

export const leadsGet = async (
	ctx: CloseContext,
	input: LeadsGetInput,
): Promise<LeadsGetResponse> => {
	const parsedInput = LeadsGetInputSchema.parse(input);
	const res = await makeCloseRequestForCtx<unknown>(
		ctx,
		closeResourcePath('lead', parsedInput.id),
		{ method: 'GET' },
	);
	return LeadsGetResponseSchema.parse(res);
};

export const leadsCreate = async (
	ctx: CloseContext,
	input: LeadsCreateInput,
): Promise<LeadsCreateResponse> => {
	const parsedInput = LeadsCreateInputSchema.parse(input);
	const res = await makeCloseRequestForCtx<unknown>(ctx, 'lead/', {
		method: 'POST',
		body: parsedInput as Record<string, unknown>,
	});
	return LeadsCreateResponseSchema.parse(res);
};

export const leadsUpdate = async (
	ctx: CloseContext,
	input: LeadsUpdateInput,
): Promise<LeadsUpdateResponse> => {
	const parsedInput = LeadsUpdateInputSchema.parse(input);
	const { id, ...body } = parsedInput;
	const res = await makeCloseRequestForCtx<unknown>(
		ctx,
		closeResourcePath('lead', id),
		{
			method: 'PUT',
			body: body as Record<string, unknown>,
		},
	);
	return LeadsUpdateResponseSchema.parse(res);
};

export const leadsDelete = async (
	ctx: CloseContext,
	input: LeadsDeleteInput,
): Promise<LeadsDeleteResponse> => {
	const parsedInput = LeadsDeleteInputSchema.parse(input);
	await makeCloseRequestForCtx<unknown>(
		ctx,
		closeResourcePath('lead', parsedInput.id),
		{
			method: 'DELETE',
		},
	);
	return LeadsDeleteResponseSchema.parse({ success: true, id: parsedInput.id });
};
