import { makeCloseRequest } from '../client';
import type { CloseContext } from '../index';
import type {
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsDeleteInput,
	ContactsDeleteResponse,
	ContactsGetInput,
	ContactsGetResponse,
	ContactsListInput,
	ContactsListResponse,
	ContactsUpdateInput,
	ContactsUpdateResponse,
} from './types';

export const contactsList = async (
	ctx: CloseContext,
	input?: ContactsListInput,
): Promise<ContactsListResponse> => {
	const res = await makeCloseRequest<ContactsListResponse>(
		'contact/',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);
	return res;
};

export const contactsGet = async (
	ctx: CloseContext,
	input: ContactsGetInput,
): Promise<ContactsGetResponse> => {
	const res = await makeCloseRequest<ContactsGetResponse>(
		`contact/${input.id}/`,
		ctx.key,
		{ method: 'GET' },
	);
	return res;
};

export const contactsCreate = async (
	ctx: CloseContext,
	input: ContactsCreateInput,
): Promise<ContactsCreateResponse> => {
	const res = await makeCloseRequest<ContactsCreateResponse>(
		'contact/',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);
	return res;
};

export const contactsUpdate = async (
	ctx: CloseContext,
	input: ContactsUpdateInput,
): Promise<ContactsUpdateResponse> => {
	const { id, ...body } = input;
	const res = await makeCloseRequest<ContactsUpdateResponse>(
		`contact/${id}/`,
		ctx.key,
		{
			method: 'PUT',
			body: body as Record<string, unknown>,
		},
	);
	return res;
};

export const contactsDelete = async (
	ctx: CloseContext,
	input: ContactsDeleteInput,
): Promise<ContactsDeleteResponse> => {
	await makeCloseRequest<unknown>(`contact/${input.id}/`, ctx.key, {
		method: 'DELETE',
	});
	return { success: true, id: input.id };
};
