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
import {
	ContactsCreateInputSchema,
	ContactsCreateResponseSchema,
	ContactsDeleteInputSchema,
	ContactsDeleteResponseSchema,
	ContactsGetInputSchema,
	ContactsGetResponseSchema,
	ContactsListInputSchema,
	ContactsListResponseSchema,
	ContactsUpdateInputSchema,
	ContactsUpdateResponseSchema,
} from './types';

export const contactsList = async (
	ctx: CloseContext,
	input?: ContactsListInput,
): Promise<ContactsListResponse> => {
	const parsedInput = input ? ContactsListInputSchema.parse(input) : undefined;
	const res = await makeCloseRequest<unknown>('contact/', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});
	return ContactsListResponseSchema.parse(res);
};

export const contactsGet = async (
	ctx: CloseContext,
	input: ContactsGetInput,
): Promise<ContactsGetResponse> => {
	const parsedInput = ContactsGetInputSchema.parse(input);
	const res = await makeCloseRequest<unknown>(
		`contact/${parsedInput.id}/`,
		ctx.key,
		{ method: 'GET' },
	);
	return ContactsGetResponseSchema.parse(res);
};

export const contactsCreate = async (
	ctx: CloseContext,
	input: ContactsCreateInput,
): Promise<ContactsCreateResponse> => {
	const parsedInput = ContactsCreateInputSchema.parse(input);
	const res = await makeCloseRequest<unknown>('contact/', ctx.key, {
		method: 'POST',
		body: parsedInput as Record<string, unknown>,
	});
	return ContactsCreateResponseSchema.parse(res);
};

export const contactsUpdate = async (
	ctx: CloseContext,
	input: ContactsUpdateInput,
): Promise<ContactsUpdateResponse> => {
	const parsedInput = ContactsUpdateInputSchema.parse(input);
	const { id, ...body } = parsedInput;
	const res = await makeCloseRequest<unknown>(`contact/${id}/`, ctx.key, {
		method: 'PUT',
		body: body as Record<string, unknown>,
	});
	return ContactsUpdateResponseSchema.parse(res);
};

export const contactsDelete = async (
	ctx: CloseContext,
	input: ContactsDeleteInput,
): Promise<ContactsDeleteResponse> => {
	const parsedInput = ContactsDeleteInputSchema.parse(input);
	await makeCloseRequest<unknown>(`contact/${parsedInput.id}/`, ctx.key, {
		method: 'DELETE',
	});
	return ContactsDeleteResponseSchema.parse({
		success: true,
		id: parsedInput.id,
	});
};
