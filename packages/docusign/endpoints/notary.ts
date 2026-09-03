import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const CreateNotaryJurisdictionObjectInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateNotaryJurisdictionObjectOutputSchema = z
	.object({})
	.passthrough();

export type CreateNotaryJurisdictionObjectParams = z.infer<
	typeof CreateNotaryJurisdictionObjectInputSchema
>;

export const createNotaryJurisdictionObject = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateNotaryJurisdictionObjectParams,
) => {
	const input = CreateNotaryJurisdictionObjectInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/v2.1/current_user/notary/jurisdictions`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return CreateNotaryJurisdictionObjectOutputSchema.parse(data);
};

export const DeleteNotaryJurisdictionInputSchema = z.object({
	jurisdictionId: z.string(),
});

export const DeleteNotaryJurisdictionOutputSchema = z.object({}).passthrough();

export type DeleteNotaryJurisdictionParams = z.infer<
	typeof DeleteNotaryJurisdictionInputSchema
>;

export const deleteNotaryJurisdiction = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteNotaryJurisdictionParams,
) => {
	const input = DeleteNotaryJurisdictionInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/v2.1/current_user/notary/jurisdictions/${input.jurisdictionId}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteNotaryJurisdictionOutputSchema.parse(data);
};

export const GetNotaryJournalsInputSchema = z.object({
	count: z.string().optional(),
	search_text: z.string().optional(),
	start_position: z.string().optional(),
});

export const GetNotaryJournalsOutputSchema = z.object({}).passthrough();

export type GetNotaryJournalsParams = z.infer<
	typeof GetNotaryJournalsInputSchema
>;

export const getNotaryJournals = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetNotaryJournalsParams,
) => {
	const input = GetNotaryJournalsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.search_text !== undefined)
		query.append('search_text', String(input.search_text));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/v2.1/current_user/notary/journals` + qs, {
		method: 'GET',
	});
	return GetNotaryJournalsOutputSchema.parse(data);
};

export const GetNotaryJurisdictionObjectInputSchema = z.object({
	jurisdictionId: z.string(),
});

export const GetNotaryJurisdictionObjectOutputSchema = z
	.object({})
	.passthrough();

export type GetNotaryJurisdictionObjectParams = z.infer<
	typeof GetNotaryJurisdictionObjectInputSchema
>;

export const getNotaryJurisdictionObject = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetNotaryJurisdictionObjectParams,
) => {
	const input = GetNotaryJurisdictionObjectInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/v2.1/current_user/notary/jurisdictions/${input.jurisdictionId}`,
		{
			method: 'GET',
		},
	);
	return GetNotaryJurisdictionObjectOutputSchema.parse(data);
};

export const GetNotaryUserSettingsInputSchema = z.object({
	include_jurisdictions: z.string().optional(),
});

export const GetNotaryUserSettingsOutputSchema = z.object({}).passthrough();

export type GetNotaryUserSettingsParams = z.infer<
	typeof GetNotaryUserSettingsInputSchema
>;

export const getNotaryUserSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetNotaryUserSettingsParams,
) => {
	const input = GetNotaryUserSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include_jurisdictions !== undefined)
		query.append('include_jurisdictions', String(input.include_jurisdictions));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/v2.1/current_user/notary` + qs, {
		method: 'GET',
	});
	return GetNotaryUserSettingsOutputSchema.parse(data);
};

export const ListNotaryJournalsInputSchema = z.object({
	count: z.string().optional(),
	search_text: z.string().optional(),
	start_position: z.string().optional(),
});

export const ListNotaryJournalsOutputSchema = z.object({}).passthrough();

export type ListNotaryJournalsParams = z.infer<
	typeof ListNotaryJournalsInputSchema
>;

export const listNotaryJournals = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListNotaryJournalsParams,
) => {
	const input = ListNotaryJournalsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.search_text !== undefined)
		query.append('search_text', String(input.search_text));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/v2.1/current_user/notary/journals` + qs, {
		method: 'GET',
	});
	return ListNotaryJournalsOutputSchema.parse(data);
};

export const ListRegisteredNotaryJurisdictionsInputSchema = z.object({});

export const ListRegisteredNotaryJurisdictionsOutputSchema = z
	.object({})
	.passthrough();

export type ListRegisteredNotaryJurisdictionsParams = z.infer<
	typeof ListRegisteredNotaryJurisdictionsInputSchema
>;

export const listRegisteredNotaryJurisdictions = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListRegisteredNotaryJurisdictionsParams,
) => {
	const input = ListRegisteredNotaryJurisdictionsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/v2.1/current_user/notary/jurisdictions`, {
		method: 'GET',
	});
	return ListRegisteredNotaryJurisdictionsOutputSchema.parse(data);
};

export const RegisterCurrentUserAsNotaryInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const RegisterCurrentUserAsNotaryOutputSchema = z
	.object({})
	.passthrough();

export type RegisterCurrentUserAsNotaryParams = z.infer<
	typeof RegisterCurrentUserAsNotaryInputSchema
>;

export const registerCurrentUserAsNotary = async (
	ctxOrClient: DocusignExecutionContext,
	params: RegisterCurrentUserAsNotaryParams,
) => {
	const input = RegisterCurrentUserAsNotaryInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/v2.1/current_user/notary`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return RegisterCurrentUserAsNotaryOutputSchema.parse(data);
};

export const UpdateNotaryJurisdictionInfoInputSchema = z.object({
	jurisdictionId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateNotaryJurisdictionInfoOutputSchema = z
	.object({})
	.passthrough();

export type UpdateNotaryJurisdictionInfoParams = z.infer<
	typeof UpdateNotaryJurisdictionInfoInputSchema
>;

export const updateNotaryJurisdictionInfo = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateNotaryJurisdictionInfoParams,
) => {
	const input = UpdateNotaryJurisdictionInfoInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/v2.1/current_user/notary/jurisdictions/${input.jurisdictionId}`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateNotaryJurisdictionInfoOutputSchema.parse(data);
};

export const UpdateUserNotaryInformationInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateUserNotaryInformationOutputSchema = z
	.object({})
	.passthrough();

export type UpdateUserNotaryInformationParams = z.infer<
	typeof UpdateUserNotaryInformationInputSchema
>;

export const updateUserNotaryInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateUserNotaryInformationParams,
) => {
	const input = UpdateUserNotaryInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/v2.1/current_user/notary`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateUserNotaryInformationOutputSchema.parse(data);
};

export const NotaryInputSchemas = {
	createNotaryJurisdictionObject: CreateNotaryJurisdictionObjectInputSchema,
	deleteNotaryJurisdiction: DeleteNotaryJurisdictionInputSchema,
	getNotaryJournals: GetNotaryJournalsInputSchema,
	getNotaryJurisdictionObject: GetNotaryJurisdictionObjectInputSchema,
	getNotaryUserSettings: GetNotaryUserSettingsInputSchema,
	listNotaryJournals: ListNotaryJournalsInputSchema,
	listRegisteredNotaryJurisdictions:
		ListRegisteredNotaryJurisdictionsInputSchema,
	registerCurrentUserAsNotary: RegisterCurrentUserAsNotaryInputSchema,
	updateNotaryJurisdictionInfo: UpdateNotaryJurisdictionInfoInputSchema,
	updateUserNotaryInformation: UpdateUserNotaryInformationInputSchema,
};

export const NotaryOutputSchemas = {
	createNotaryJurisdictionObject: CreateNotaryJurisdictionObjectOutputSchema,
	deleteNotaryJurisdiction: DeleteNotaryJurisdictionOutputSchema,
	getNotaryJournals: GetNotaryJournalsOutputSchema,
	getNotaryJurisdictionObject: GetNotaryJurisdictionObjectOutputSchema,
	getNotaryUserSettings: GetNotaryUserSettingsOutputSchema,
	listNotaryJournals: ListNotaryJournalsOutputSchema,
	listRegisteredNotaryJurisdictions:
		ListRegisteredNotaryJurisdictionsOutputSchema,
	registerCurrentUserAsNotary: RegisterCurrentUserAsNotaryOutputSchema,
	updateNotaryJurisdictionInfo: UpdateNotaryJurisdictionInfoOutputSchema,
	updateUserNotaryInformation: UpdateUserNotaryInformationOutputSchema,
};
