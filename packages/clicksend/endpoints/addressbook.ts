import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext } from '../index';

// ── Shared ────────────────────────────────────────────────────────────────────

export const EmptyResultSchema = z.union([
	z.array(z.never()),
	z.record(z.string(), z.string()),
	z.boolean(),
	z.null(),
]);
export type EmptyResult = z.infer<typeof EmptyResultSchema>;

export const AddressbookContactListObjectSchema = z
	.object({
		list_id: z.number().int().optional(),
		list_name: z.string().optional(),
		contact_count: z.number().optional(),
	})
	.passthrough();
export type AddressbookContactListObject = z.infer<
	typeof AddressbookContactListObjectSchema
>;

export const AddressbookContactObjectSchema = z
	.object({
		contact_id: z.number().int().optional(),
		list_id: z.number().int().optional(),
		phone_number: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		custom_1: z.string().optional(),
		custom_2: z.string().optional(),
		custom_3: z.string().optional(),
		custom_4: z.string().optional(),
		date_added: z.string().optional(),
		date_updated: z.string().optional(),
		fax_number: z.string().optional(),
		organization_name: z.string().optional(),
		email: z.string().optional(),
		address_line_1: z.string().optional(),
		address_line_2: z.string().optional(),
		address_city: z.string().optional(),
		address_state: z.string().optional(),
		address_postal_code: z.string().optional(),
		address_country: z.string().optional(),
	})
	.passthrough();
export type AddressbookContactObject = z.infer<
	typeof AddressbookContactObjectSchema
>;

// ── contactLists.update ───────────────────────────────────────────────────────

export const AddressbookUpdateContactListInputSchema = z
	.object({
		list_id: z.number().int().positive(),
		list_name: z.string().min(1),
	})
	.strict();
export type AddressbookUpdateContactListInput = z.infer<
	typeof AddressbookUpdateContactListInputSchema
>;

export const AddressbookUpdateContactListResponseSchema =
	AddressbookContactListObjectSchema;
export type AddressbookUpdateContactListResponse = z.infer<
	typeof AddressbookUpdateContactListResponseSchema
>;

export const updateContactList: CorsairEndpoint<
	ClickSendContext,
	AddressbookUpdateContactListInput,
	AddressbookUpdateContactListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`lists/${input.list_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: { list_name: input.list_name },
			responseSchema: AddressbookUpdateContactListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contactLists.update',
		{ list_id: input.list_id },
		'completed',
	);

	return response;
};

// ── contactLists.delete ───────────────────────────────────────────────────────

export const AddressbookDeleteContactListInputSchema = z
	.object({
		list_id: z.number().int().positive(),
	})
	.strict();
export type AddressbookDeleteContactListInput = z.infer<
	typeof AddressbookDeleteContactListInputSchema
>;

export const AddressbookDeleteContactListResponseSchema = EmptyResultSchema;
export type AddressbookDeleteContactListResponse = z.infer<
	typeof AddressbookDeleteContactListResponseSchema
>;

export const deleteContactList: CorsairEndpoint<
	ClickSendContext,
	AddressbookDeleteContactListInput,
	AddressbookDeleteContactListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`lists/${input.list_id}`,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: AddressbookDeleteContactListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contactLists.delete',
		{ list_id: input.list_id },
		'completed',
	);

	return response;
};

// ── contactLists.get ──────────────────────────────────────────────────────────

export const AddressbookGetContactListInputSchema = z
	.object({
		list_id: z.number().int().positive(),
	})
	.strict();
export type AddressbookGetContactListInput = z.infer<
	typeof AddressbookGetContactListInputSchema
>;

export const AddressbookGetContactListResponseSchema =
	AddressbookContactListObjectSchema;
export type AddressbookGetContactListResponse = z.infer<
	typeof AddressbookGetContactListResponseSchema
>;

export const getContactList: CorsairEndpoint<
	ClickSendContext,
	AddressbookGetContactListInput,
	AddressbookGetContactListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`lists/${input.list_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: AddressbookGetContactListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contactLists.get',
		{ list_id: input.list_id },
		'completed',
	);

	return response;
};

// ── contacts.get ──────────────────────────────────────────────────────────────

export const AddressbookGetContactInputSchema = z
	.object({
		list_id: z.number().int().positive(),
		contact_id: z.number().int().positive(),
	})
	.strict();
export type AddressbookGetContactInput = z.infer<
	typeof AddressbookGetContactInputSchema
>;

export const AddressbookGetContactResponseSchema =
	AddressbookContactObjectSchema;
export type AddressbookGetContactResponse = z.infer<
	typeof AddressbookGetContactResponseSchema
>;

export const getContact: CorsairEndpoint<
	ClickSendContext,
	AddressbookGetContactInput,
	AddressbookGetContactResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`lists/${input.list_id}/contacts/${input.contact_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: AddressbookGetContactResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contacts.get',
		{ list_id: input.list_id, contact_id: input.contact_id },
		'completed',
	);

	return response;
};

// ── contacts.update ───────────────────────────────────────────────────────────

export const AddressbookUpdateContactInputSchema = z
	.object({
		list_id: z.number().int().positive(),
		contact_id: z.number().int().positive(),
		phone_number: z.string().optional(),
		email: z.string().optional(),
		fax_number: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		organization_name: z.string().optional(),
		address_line_1: z.string().optional(),
		address_line_2: z.string().optional(),
		address_city: z.string().optional(),
		address_state: z.string().optional(),
		address_postal_code: z.string().optional(),
		address_country: z.string().optional(),
		custom_1: z.string().optional(),
		custom_2: z.string().optional(),
		custom_3: z.string().optional(),
		custom_4: z.string().optional(),
	})
	.strict();
export type AddressbookUpdateContactInput = z.infer<
	typeof AddressbookUpdateContactInputSchema
>;

export const AddressbookUpdateContactResponseSchema =
	AddressbookContactObjectSchema;
export type AddressbookUpdateContactResponse = z.infer<
	typeof AddressbookUpdateContactResponseSchema
>;

export const updateContact: CorsairEndpoint<
	ClickSendContext,
	AddressbookUpdateContactInput,
	AddressbookUpdateContactResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`lists/${input.list_id}/contacts/${input.contact_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {
				phone_number: input.phone_number,
				email: input.email,
				fax_number: input.fax_number,
				first_name: input.first_name,
				last_name: input.last_name,
				organization_name: input.organization_name,
				address_line_1: input.address_line_1,
				address_line_2: input.address_line_2,
				address_city: input.address_city,
				address_state: input.address_state,
				address_postal_code: input.address_postal_code,
				address_country: input.address_country,
				custom_1: input.custom_1,
				custom_2: input.custom_2,
				custom_3: input.custom_3,
				custom_4: input.custom_4,
			},
			responseSchema: AddressbookUpdateContactResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contacts.update',
		{ list_id: input.list_id, contact_id: input.contact_id },
		'completed',
	);

	return response;
};

// ── contacts.delete ───────────────────────────────────────────────────────────

export const AddressbookDeleteContactInputSchema = z
	.object({
		list_id: z.number().int().positive(),
		contact_id: z.number().int().positive(),
	})
	.strict();
export type AddressbookDeleteContactInput = z.infer<
	typeof AddressbookDeleteContactInputSchema
>;

export const AddressbookDeleteContactResponseSchema = EmptyResultSchema;
export type AddressbookDeleteContactResponse = z.infer<
	typeof AddressbookDeleteContactResponseSchema
>;

export const deleteContact: CorsairEndpoint<
	ClickSendContext,
	AddressbookDeleteContactInput,
	AddressbookDeleteContactResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`lists/${input.list_id}/contacts/${input.contact_id}`,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: AddressbookDeleteContactResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contacts.delete',
		{ list_id: input.list_id, contact_id: input.contact_id },
		'completed',
	);

	return response;
};

// ── contacts.copy ─────────────────────────────────────────────────────────────

export const AddressbookCopyContactInputSchema = z
	.object({
		from_list_id: z.number().int().positive(),
		contact_id: z.number().int().positive(),
		to_list_id: z.number().int().positive(),
	})
	.strict();
export type AddressbookCopyContactInput = z.infer<
	typeof AddressbookCopyContactInputSchema
>;

export const AddressbookCopyContactResponseSchema =
	AddressbookContactObjectSchema;
export type AddressbookCopyContactResponse = z.infer<
	typeof AddressbookCopyContactResponseSchema
>;

export const copyContact: CorsairEndpoint<
	ClickSendContext,
	AddressbookCopyContactInput,
	AddressbookCopyContactResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`lists/${input.from_list_id}/contacts/${input.contact_id}/copy/${input.to_list_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {},
			responseSchema: AddressbookCopyContactResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contacts.copy',
		{
			from_list_id: input.from_list_id,
			contact_id: input.contact_id,
			to_list_id: input.to_list_id,
		},
		'completed',
	);

	return response;
};

// ── contacts.transfer ─────────────────────────────────────────────────────────

export const AddressbookTransferContactInputSchema = z
	.object({
		from_list_id: z.number().int().positive(),
		contact_id: z.number().int().positive(),
		to_list_id: z.number().int().positive(),
	})
	.strict();
export type AddressbookTransferContactInput = z.infer<
	typeof AddressbookTransferContactInputSchema
>;

export const AddressbookTransferContactResponseSchema =
	AddressbookContactObjectSchema;
export type AddressbookTransferContactResponse = z.infer<
	typeof AddressbookTransferContactResponseSchema
>;

export const transferContact: CorsairEndpoint<
	ClickSendContext,
	AddressbookTransferContactInput,
	AddressbookTransferContactResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`lists/${input.from_list_id}/contacts/${input.contact_id}/transfer/${input.to_list_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {},
			responseSchema: AddressbookTransferContactResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contacts.transfer',
		{
			from_list_id: input.from_list_id,
			contact_id: input.contact_id,
			to_list_id: input.to_list_id,
		},
		'completed',
	);

	return response;
};

// ── contacts.import ───────────────────────────────────────────────────────────

export const AddressbookImportContactsInputSchema = z
	.object({
		list_id: z.number().int().positive(),
		file_url: z.string().min(1),
		field_order: z.array(z.string()),
	})
	.strict();
export type AddressbookImportContactsInput = z.infer<
	typeof AddressbookImportContactsInputSchema
>;

export const AddressbookImportContactsResponseSchema = z
	.object({
		msg: z.string().optional(),
		ids: z.array(z.string()).optional(),
		id: z.union([z.string(), z.number()]).optional(),
	})
	.passthrough();
export type AddressbookImportContactsResponse = z.infer<
	typeof AddressbookImportContactsResponseSchema
>;

export const importContacts: CorsairEndpoint<
	ClickSendContext,
	AddressbookImportContactsInput,
	AddressbookImportContactsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`lists/${input.list_id}/import`,
		username,
		apiKey,
		{
			method: 'POST',
			body: { file_url: input.file_url, field_order: input.field_order },
			responseSchema: AddressbookImportContactsResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contacts.import',
		{ list_id: input.list_id },
		'completed',
	);

	return response;
};

// ── contacts.importFields ─────────────────────────────────────────────────────

export const AddressbookListImportFieldsInputSchema = z
	.object({
		list_id: z.number().int().positive(),
	})
	.strict();
export type AddressbookListImportFieldsInput = z.infer<
	typeof AddressbookListImportFieldsInputSchema
>;

export const AddressbookImportFieldSchema = z
	.object({
		field: z.string(),
		label: z.string(),
	})
	.passthrough();
export type AddressbookImportField = z.infer<
	typeof AddressbookImportFieldSchema
>;

export const AddressbookListImportFieldsResponseSchema = z.array(
	AddressbookImportFieldSchema,
);
export type AddressbookListImportFieldsResponse = z.infer<
	typeof AddressbookListImportFieldsResponseSchema
>;

export const listImportFields: CorsairEndpoint<
	ClickSendContext,
	AddressbookListImportFieldsInput,
	AddressbookListImportFieldsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`lists/${input.list_id}/import-fields`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: AddressbookListImportFieldsResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contacts.importFields',
		{ list_id: input.list_id },
		'completed',
	);

	return response;
};

// ── contacts.importPreview ────────────────────────────────────────────────────

export const AddressbookPreviewCsvImportInputSchema = z
	.object({
		list_id: z.number().int().positive(),
		file_url: z.string().min(1),
	})
	.strict();
export type AddressbookPreviewCsvImportInput = z.infer<
	typeof AddressbookPreviewCsvImportInputSchema
>;

export const AddressbookPreviewCsvImportResponseSchema = z
	.object({
		row: z.array(z.string()).optional(),
	})
	.passthrough();
export type AddressbookPreviewCsvImportResponse = z.infer<
	typeof AddressbookPreviewCsvImportResponseSchema
>;

export const previewCsvImport: CorsairEndpoint<
	ClickSendContext,
	AddressbookPreviewCsvImportInput,
	AddressbookPreviewCsvImportResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`lists/${input.list_id}/import-csv-preview`,
		username,
		apiKey,
		{
			method: 'POST',
			body: { file_url: input.file_url },
			responseSchema: AddressbookPreviewCsvImportResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contacts.importPreview',
		{ list_id: input.list_id },
		'completed',
	);

	return response;
};

// ── contacts.removeOptedOut ───────────────────────────────────────────────────

export const AddressbookRemoveOptedOutContactsInputSchema = z
	.object({
		list_id: z.number().int().positive(),
		opt_out_list_id: z.number().int().positive(),
	})
	.strict();
export type AddressbookRemoveOptedOutContactsInput = z.infer<
	typeof AddressbookRemoveOptedOutContactsInputSchema
>;

export const AddressbookRemoveOptedOutContactsResponseSchema = z
	.object({
		deleted: z.number().optional(),
	})
	.passthrough();
export type AddressbookRemoveOptedOutContactsResponse = z.infer<
	typeof AddressbookRemoveOptedOutContactsResponseSchema
>;

export const removeOptedOutContacts: CorsairEndpoint<
	ClickSendContext,
	AddressbookRemoveOptedOutContactsInput,
	AddressbookRemoveOptedOutContactsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`lists/${input.list_id}/remove-opted-out-contacts/${input.opt_out_list_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {},
			responseSchema: AddressbookRemoveOptedOutContactsResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contacts.removeOptedOut',
		{ list_id: input.list_id, opt_out_list_id: input.opt_out_list_id },
		'completed',
	);

	return response;
};

// ── contacts.search ───────────────────────────────────────────────────────────

export const AddressbookSearchContactsListsInputSchema = z
	.object({
		q: z.string().min(1),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type AddressbookSearchContactsListsInput = z.infer<
	typeof AddressbookSearchContactsListsInputSchema
>;

export const AddressbookSearchContactsListItemSchema = z
	.object({
		contact: z.string().optional(),
		contacts_count: z.number().optional(),
		id: z.union([z.number(), z.string()]).optional(),
		name: z.string().optional(),
		type: z.string().optional(),
	})
	.passthrough();
export type AddressbookSearchContactsListItem = z.infer<
	typeof AddressbookSearchContactsListItemSchema
>;

export const AddressbookSearchContactsListsResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(AddressbookSearchContactsListItemSchema).optional(),
	})
	.passthrough();
export type AddressbookSearchContactsListsResponse = z.infer<
	typeof AddressbookSearchContactsListsResponseSchema
>;

export const searchContactsLists: CorsairEndpoint<
	ClickSendContext,
	AddressbookSearchContactsListsInput,
	AddressbookSearchContactsListsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'search/contacts-lists',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				q: input.q,
				page: input.page,
				limit: input.limit,
			},
			responseSchema: AddressbookSearchContactsListsResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contacts.search',
		{ q: input.q, page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

// ── contacts.suggestions ──────────────────────────────────────────────────────

export const AddressbookGetContactSuggestionsInputSchema = z
	.object({})
	.strict();
export type AddressbookGetContactSuggestionsInput = z.infer<
	typeof AddressbookGetContactSuggestionsInputSchema
>;

export const AddressbookContactSuggestionSchema = z
	.object({
		contact_id: z.number().int().optional(),
		list_id: z.number().int().optional(),
		phone_number: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		custom_1: z.string().optional(),
		custom_2: z.string().optional(),
		custom_3: z.string().optional(),
		custom_4: z.string().optional(),
		date_added: z.string().optional(),
		date_updated: z.string().optional(),
		fax_number: z.string().optional(),
		organization_name: z.string().optional(),
		email: z.string().optional(),
		address_line_1: z.string().optional(),
		address_line_2: z.string().optional(),
		address_city: z.string().optional(),
		address_state: z.string().optional(),
		address_postal_code: z.string().optional(),
		address_country: z.string().optional(),
		_list_name: z.string().optional(),
	})
	.passthrough();
export type AddressbookContactSuggestion = z.infer<
	typeof AddressbookContactSuggestionSchema
>;

export const AddressbookGetContactSuggestionsResponseSchema = z.array(
	AddressbookContactSuggestionSchema,
);
export type AddressbookGetContactSuggestionsResponse = z.infer<
	typeof AddressbookGetContactSuggestionsResponseSchema
>;

export const getContactSuggestions: CorsairEndpoint<
	ClickSendContext,
	AddressbookGetContactSuggestionsInput,
	AddressbookGetContactSuggestionsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'contact-suggestions',
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: AddressbookGetContactSuggestionsResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.contacts.suggestions',
		{ ...input },
		'completed',
	);

	return response;
};
