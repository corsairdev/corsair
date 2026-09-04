import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const AddContactsToContactsListInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddContactsToContactsListOutputSchema = z.object({}).passthrough();

export type AddContactsToContactsListParams = z.infer<
	typeof AddContactsToContactsListInputSchema
>;

export const addContactsToContactsList = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddContactsToContactsListParams,
) => {
	const input = AddContactsToContactsListInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/contacts`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return AddContactsToContactsListOutputSchema.parse(data);
};

export const DeleteContactFromAccountInputSchema = z.object({
	contactId: z.string(),
});

export const DeleteContactFromAccountOutputSchema = z.object({}).passthrough();

export type DeleteContactFromAccountParams = z.infer<
	typeof DeleteContactFromAccountInputSchema
>;

export const deleteContactFromAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteContactFromAccountParams,
) => {
	const input = DeleteContactFromAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/contacts/${encodeURIComponent(input.contactId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteContactFromAccountOutputSchema.parse(data);
};

export const DeleteMultipleContactsFromAccountInputSchema = z.object({});

export const DeleteMultipleContactsFromAccountOutputSchema = z
	.object({})
	.passthrough();

export type DeleteMultipleContactsFromAccountParams = z.infer<
	typeof DeleteMultipleContactsFromAccountInputSchema
>;

export const deleteMultipleContactsFromAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteMultipleContactsFromAccountParams,
) => {
	const input = DeleteMultipleContactsFromAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/contacts`, {
		method: 'DELETE',
	});
	return DeleteMultipleContactsFromAccountOutputSchema.parse(data);
};

export const GetDocusignAccountContactsInputSchema = z.object({
	contactId: z.string(),
	cloud_provider: z.string().optional(),
});

export const GetDocusignAccountContactsOutputSchema = z
	.object({})
	.passthrough();

export type GetDocusignAccountContactsParams = z.infer<
	typeof GetDocusignAccountContactsInputSchema
>;

export const getDocusignAccountContacts = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetDocusignAccountContactsParams,
) => {
	const input = GetDocusignAccountContactsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.cloud_provider !== undefined)
		query.append('cloud_provider', String(input.cloud_provider));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/contacts/${encodeURIComponent(input.contactId)}` + qs,
		{
			method: 'GET',
		},
	);
	return GetDocusignAccountContactsOutputSchema.parse(data);
};

export const UpdateContactsInformationInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateContactsInformationOutputSchema = z.object({}).passthrough();

export type UpdateContactsInformationParams = z.infer<
	typeof UpdateContactsInformationInputSchema
>;

export const updateContactsInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateContactsInformationParams,
) => {
	const input = UpdateContactsInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/contacts`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateContactsInformationOutputSchema.parse(data);
};

export const ContactsInputSchemas = {
	addContactsToContactsList: AddContactsToContactsListInputSchema,
	deleteContactFromAccount: DeleteContactFromAccountInputSchema,
	deleteMultipleContactsFromAccount:
		DeleteMultipleContactsFromAccountInputSchema,
	getDocusignAccountContacts: GetDocusignAccountContactsInputSchema,
	updateContactsInformation: UpdateContactsInformationInputSchema,
};

export const ContactsOutputSchemas = {
	addContactsToContactsList: AddContactsToContactsListOutputSchema,
	deleteContactFromAccount: DeleteContactFromAccountOutputSchema,
	deleteMultipleContactsFromAccount:
		DeleteMultipleContactsFromAccountOutputSchema,
	getDocusignAccountContacts: GetDocusignAccountContactsOutputSchema,
	updateContactsInformation: UpdateContactsInformationOutputSchema,
};
