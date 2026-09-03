import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const AddNewUsersToASpecifiedAccountInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddNewUsersToASpecifiedAccountOutputSchema = z
	.object({})
	.passthrough();

export type AddNewUsersToASpecifiedAccountParams = z.infer<
	typeof AddNewUsersToASpecifiedAccountInputSchema
>;

export const addNewUsersToASpecifiedAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddNewUsersToASpecifiedAccountParams,
) => {
	const input = AddNewUsersToASpecifiedAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return AddNewUsersToASpecifiedAccountOutputSchema.parse(data);
};

export const AddOrUpdateUserCustomSettingsInputSchema = z.object({
	userId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddOrUpdateUserCustomSettingsOutputSchema = z
	.object({})
	.passthrough();

export type AddOrUpdateUserCustomSettingsParams = z.infer<
	typeof AddOrUpdateUserCustomSettingsInputSchema
>;

export const addOrUpdateUserCustomSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddOrUpdateUserCustomSettingsParams,
) => {
	const input = AddOrUpdateUserCustomSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/custom_settings`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return AddOrUpdateUserCustomSettingsOutputSchema.parse(data);
};

export const AddOrUpdateUserSignatureInputSchema = z.object({
	userId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddOrUpdateUserSignatureOutputSchema = z.object({}).passthrough();

export type AddOrUpdateUserSignatureParams = z.infer<
	typeof AddOrUpdateUserSignatureInputSchema
>;

export const addOrUpdateUserSignature = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddOrUpdateUserSignatureParams,
) => {
	const input = AddOrUpdateUserSignatureInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/signatures`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return AddOrUpdateUserSignatureOutputSchema.parse(data);
};

export const AddUserSignatureAndInitialsImagesInputSchema = z.object({
	userId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddUserSignatureAndInitialsImagesOutputSchema = z
	.object({})
	.passthrough();

export type AddUserSignatureAndInitialsImagesParams = z.infer<
	typeof AddUserSignatureAndInitialsImagesInputSchema
>;

export const addUserSignatureAndInitialsImages = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddUserSignatureAndInitialsImagesParams,
) => {
	const input = AddUserSignatureAndInitialsImagesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/signatures`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return AddUserSignatureAndInitialsImagesOutputSchema.parse(data);
};

export const ChangeUsersInAccountInputSchema = z.object({
	allow_all_languages: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const ChangeUsersInAccountOutputSchema = z.object({}).passthrough();

export type ChangeUsersInAccountParams = z.infer<
	typeof ChangeUsersInAccountInputSchema
>;

export const changeUsersInAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: ChangeUsersInAccountParams,
) => {
	const input = ChangeUsersInAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.allow_all_languages !== undefined)
		query.append('allow_all_languages', String(input.allow_all_languages));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/users` + qs, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return ChangeUsersInAccountOutputSchema.parse(data);
};

export const CloseUsersInAccountInputSchema = z.object({
	delete: z.string().optional(),
});

export const CloseUsersInAccountOutputSchema = z.object({}).passthrough();

export type CloseUsersInAccountParams = z.infer<
	typeof CloseUsersInAccountInputSchema
>;

export const closeUsersInAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: CloseUsersInAccountParams,
) => {
	const input = CloseUsersInAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.delete !== undefined) query.append('delete', String(input.delete));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/users` + qs, {
		method: 'DELETE',
	});
	return CloseUsersInAccountOutputSchema.parse(data);
};

export const CreateOrUpdateUserAuthorizationsInputSchema = z.object({
	userId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateOrUpdateUserAuthorizationsOutputSchema = z
	.object({})
	.passthrough();

export type CreateOrUpdateUserAuthorizationsParams = z.infer<
	typeof CreateOrUpdateUserAuthorizationsInputSchema
>;

export const createOrUpdateUserAuthorizations = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateOrUpdateUserAuthorizationsParams,
) => {
	const input = CreateOrUpdateUserAuthorizationsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/authorizations`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return CreateOrUpdateUserAuthorizationsOutputSchema.parse(data);
};

export const CreateUserAuthorizationForAgentUserInputSchema = z.object({
	userId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateUserAuthorizationForAgentUserOutputSchema = z
	.object({})
	.passthrough();

export type CreateUserAuthorizationForAgentUserParams = z.infer<
	typeof CreateUserAuthorizationForAgentUserInputSchema
>;

export const createUserAuthorizationForAgentUser = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateUserAuthorizationForAgentUserParams,
) => {
	const input = CreateUserAuthorizationForAgentUserInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/authorization`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return CreateUserAuthorizationForAgentUserOutputSchema.parse(data);
};

export const DeleteCustomUserSettingsInputSchema = z.object({
	userId: z.string(),
});

export const DeleteCustomUserSettingsOutputSchema = z.object({}).passthrough();

export type DeleteCustomUserSettingsParams = z.infer<
	typeof DeleteCustomUserSettingsInputSchema
>;

export const deleteCustomUserSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteCustomUserSettingsParams,
) => {
	const input = DeleteCustomUserSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/custom_settings`, {
		method: 'DELETE',
	});
	return DeleteCustomUserSettingsOutputSchema.parse(data);
};

export const DeleteUserAuthorizationInputSchema = z.object({
	userId: z.string(),
	authorizationId: z.string(),
});

export const DeleteUserAuthorizationOutputSchema = z.object({}).passthrough();

export type DeleteUserAuthorizationParams = z.infer<
	typeof DeleteUserAuthorizationInputSchema
>;

export const deleteUserAuthorization = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteUserAuthorizationParams,
) => {
	const input = DeleteUserAuthorizationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/users/${input.userId}/authorization/${input.authorizationId}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteUserAuthorizationOutputSchema.parse(data);
};

export const DeleteUserAuthorizationsInputSchema = z.object({
	userId: z.string(),
});

export const DeleteUserAuthorizationsOutputSchema = z.object({}).passthrough();

export type DeleteUserAuthorizationsParams = z.infer<
	typeof DeleteUserAuthorizationsInputSchema
>;

export const deleteUserAuthorizations = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteUserAuthorizationsParams,
) => {
	const input = DeleteUserAuthorizationsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/authorizations`, {
		method: 'DELETE',
	});
	return DeleteUserAuthorizationsOutputSchema.parse(data);
};

export const DeleteUserInitialsOrSignatureImageInputSchema = z.object({
	userId: z.string(),
	signatureId: z.string(),
	imageType: z.string(),
});

export const DeleteUserInitialsOrSignatureImageOutputSchema = z
	.object({})
	.passthrough();

export type DeleteUserInitialsOrSignatureImageParams = z.infer<
	typeof DeleteUserInitialsOrSignatureImageInputSchema
>;

export const deleteUserInitialsOrSignatureImage = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteUserInitialsOrSignatureImageParams,
) => {
	const input = DeleteUserInitialsOrSignatureImageInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/users/${input.userId}/signatures/${input.signatureId}/${input.imageType}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteUserInitialsOrSignatureImageOutputSchema.parse(data);
};

export const DeleteUserProfileImageInputSchema = z.object({
	userId: z.string(),
});

export const DeleteUserProfileImageOutputSchema = z.object({}).passthrough();

export type DeleteUserProfileImageParams = z.infer<
	typeof DeleteUserProfileImageInputSchema
>;

export const deleteUserProfileImage = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteUserProfileImageParams,
) => {
	const input = DeleteUserProfileImageInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/profile/image`, {
		method: 'DELETE',
	});
	return DeleteUserProfileImageOutputSchema.parse(data);
};

export const GetAgentUserAuthorizationsInputSchema = z.object({
	userId: z.string(),
	active_only: z.string().optional(),
	count: z.string().optional(),
	email_substring: z.string().optional(),
	include_closed_users: z.string().optional(),
	permissions: z.string().optional(),
	start_position: z.string().optional(),
	task_source: z.string().optional(),
	task_type: z.string().optional(),
	user_name_substring: z.string().optional(),
});

export const GetAgentUserAuthorizationsOutputSchema = z
	.object({})
	.passthrough();

export type GetAgentUserAuthorizationsParams = z.infer<
	typeof GetAgentUserAuthorizationsInputSchema
>;

export const getAgentUserAuthorizations = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetAgentUserAuthorizationsParams,
) => {
	const input = GetAgentUserAuthorizationsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.active_only !== undefined)
		query.append('active_only', String(input.active_only));
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.email_substring !== undefined)
		query.append('email_substring', String(input.email_substring));
	if (input.include_closed_users !== undefined)
		query.append('include_closed_users', String(input.include_closed_users));
	if (input.permissions !== undefined)
		query.append('permissions', String(input.permissions));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	if (input.task_source !== undefined)
		query.append('task_source', String(input.task_source));
	if (input.task_type !== undefined)
		query.append('task_type', String(input.task_type));
	if (input.user_name_substring !== undefined)
		query.append('user_name_substring', String(input.user_name_substring));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/users/${input.userId}/authorizations/agent` + qs,
		{
			method: 'GET',
		},
	);
	return GetAgentUserAuthorizationsOutputSchema.parse(data);
};

export const GetUserAuthorizationDetailsInputSchema = z.object({
	userId: z.string(),
	authorizationId: z.string(),
});

export const GetUserAuthorizationDetailsOutputSchema = z
	.object({})
	.passthrough();

export type GetUserAuthorizationDetailsParams = z.infer<
	typeof GetUserAuthorizationDetailsInputSchema
>;

export const getUserAuthorizationDetails = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetUserAuthorizationDetailsParams,
) => {
	const input = GetUserAuthorizationDetailsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/users/${input.userId}/authorization/${input.authorizationId}`,
		{
			method: 'GET',
		},
	);
	return GetUserAuthorizationDetailsOutputSchema.parse(data);
};

export const GetUserAuthorizationsForPrincipalInputSchema = z.object({
	userId: z.string(),
	active_only: z.string().optional(),
	count: z.string().optional(),
	email_substring: z.string().optional(),
	include_closed_users: z.string().optional(),
	permissions: z.string().optional(),
	start_position: z.string().optional(),
	task_source: z.string().optional(),
	task_type: z.string().optional(),
	user_name_substring: z.string().optional(),
});

export const GetUserAuthorizationsForPrincipalOutputSchema = z
	.object({})
	.passthrough();

export type GetUserAuthorizationsForPrincipalParams = z.infer<
	typeof GetUserAuthorizationsForPrincipalInputSchema
>;

export const getUserAuthorizationsForPrincipal = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetUserAuthorizationsForPrincipalParams,
) => {
	const input = GetUserAuthorizationsForPrincipalInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.active_only !== undefined)
		query.append('active_only', String(input.active_only));
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.email_substring !== undefined)
		query.append('email_substring', String(input.email_substring));
	if (input.include_closed_users !== undefined)
		query.append('include_closed_users', String(input.include_closed_users));
	if (input.permissions !== undefined)
		query.append('permissions', String(input.permissions));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	if (input.task_source !== undefined)
		query.append('task_source', String(input.task_source));
	if (input.task_type !== undefined)
		query.append('task_type', String(input.task_type));
	if (input.user_name_substring !== undefined)
		query.append('user_name_substring', String(input.user_name_substring));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/users/${input.userId}/authorizations` + qs,
		{
			method: 'GET',
		},
	);
	return GetUserAuthorizationsForPrincipalOutputSchema.parse(data);
};

export const GetUserInformationByIdInputSchema = z.object({
	userId: z.string(),
	additional_info: z.string().optional(),
	email: z.string().optional(),
	include_license: z.string().optional(),
});

export const GetUserInformationByIdOutputSchema = z.object({}).passthrough();

export type GetUserInformationByIdParams = z.infer<
	typeof GetUserInformationByIdInputSchema
>;

export const getUserInformationById = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetUserInformationByIdParams,
) => {
	const input = GetUserInformationByIdInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.additional_info !== undefined)
		query.append('additional_info', String(input.additional_info));
	if (input.email !== undefined) query.append('email', String(input.email));
	if (input.include_license !== undefined)
		query.append('include_license', String(input.include_license));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/users/${input.userId}` + qs, {
		method: 'GET',
	});
	return GetUserInformationByIdOutputSchema.parse(data);
};

export const ListUsersForAccountInputSchema = z.object({
	additional_info: z.string().optional(),
	alternate_admins_only: z.string().optional(),
	count: z.string().optional(),
	domain_users_only: z.string().optional(),
	email: z.string().optional(),
	email_substring: z.string().optional(),
	group_id: z.string().optional(),
	include_license: z.string().optional(),
	include_usersettings_for_csv: z.string().optional(),
	login_status: z.string().optional(),
	not_group_id: z.string().optional(),
	start_position: z.string().optional(),
	status: z.string().optional(),
	user_name_substring: z.string().optional(),
});

export const ListUsersForAccountOutputSchema = z.object({}).passthrough();

export type ListUsersForAccountParams = z.infer<
	typeof ListUsersForAccountInputSchema
>;

export const listUsersForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListUsersForAccountParams,
) => {
	const input = ListUsersForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.additional_info !== undefined)
		query.append('additional_info', String(input.additional_info));
	if (input.alternate_admins_only !== undefined)
		query.append('alternate_admins_only', String(input.alternate_admins_only));
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.domain_users_only !== undefined)
		query.append('domain_users_only', String(input.domain_users_only));
	if (input.email !== undefined) query.append('email', String(input.email));
	if (input.email_substring !== undefined)
		query.append('email_substring', String(input.email_substring));
	if (input.group_id !== undefined)
		query.append('group_id', String(input.group_id));
	if (input.include_license !== undefined)
		query.append('include_license', String(input.include_license));
	if (input.include_usersettings_for_csv !== undefined)
		query.append(
			'include_usersettings_for_csv',
			String(input.include_usersettings_for_csv),
		);
	if (input.login_status !== undefined)
		query.append('login_status', String(input.login_status));
	if (input.not_group_id !== undefined)
		query.append('not_group_id', String(input.not_group_id));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	if (input.status !== undefined) query.append('status', String(input.status));
	if (input.user_name_substring !== undefined)
		query.append('user_name_substring', String(input.user_name_substring));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/users` + qs, {
		method: 'GET',
	});
	return ListUsersForAccountOutputSchema.parse(data);
};

export const RemoveUserSignatureInformationInputSchema = z.object({
	userId: z.string(),
	signatureId: z.string(),
});

export const RemoveUserSignatureInformationOutputSchema = z
	.object({})
	.passthrough();

export type RemoveUserSignatureInformationParams = z.infer<
	typeof RemoveUserSignatureInformationInputSchema
>;

export const removeUserSignatureInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: RemoveUserSignatureInformationParams,
) => {
	const input = RemoveUserSignatureInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/users/${input.userId}/signatures/${input.signatureId}`,
		{
			method: 'DELETE',
		},
	);
	return RemoveUserSignatureInformationOutputSchema.parse(data);
};

export const RetrieveCustomUserSettingsInputSchema = z.object({
	userId: z.string(),
});

export const RetrieveCustomUserSettingsOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveCustomUserSettingsParams = z.infer<
	typeof RetrieveCustomUserSettingsInputSchema
>;

export const retrieveCustomUserSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveCustomUserSettingsParams,
) => {
	const input = RetrieveCustomUserSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/custom_settings`, {
		method: 'GET',
	});
	return RetrieveCustomUserSettingsOutputSchema.parse(data);
};

export const RetrieveUserAccountSettingsInputSchema = z.object({
	userId: z.string(),
});

export const RetrieveUserAccountSettingsOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveUserAccountSettingsParams = z.infer<
	typeof RetrieveUserAccountSettingsInputSchema
>;

export const retrieveUserAccountSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveUserAccountSettingsParams,
) => {
	const input = RetrieveUserAccountSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/settings`, {
		method: 'GET',
	});
	return RetrieveUserAccountSettingsOutputSchema.parse(data);
};

export const RetrieveUserProfileImageInputSchema = z.object({
	userId: z.string(),
	encoding: z.string().optional(),
});

export const RetrieveUserProfileImageOutputSchema = z.unknown();

export type RetrieveUserProfileImageParams = z.infer<
	typeof RetrieveUserProfileImageInputSchema
>;

export const retrieveUserProfileImage = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveUserProfileImageParams,
) => {
	const input = RetrieveUserProfileImageInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.encoding !== undefined)
		query.append('encoding', String(input.encoding));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/users/${input.userId}/profile/image` + qs,
		{
			method: 'GET',
		},
	);
	return RetrieveUserProfileImageOutputSchema.parse(data);
};

export const RetrieveUserProfileInformationInputSchema = z.object({
	userId: z.string(),
});

export const RetrieveUserProfileInformationOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveUserProfileInformationParams = z.infer<
	typeof RetrieveUserProfileInformationInputSchema
>;

export const retrieveUserProfileInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveUserProfileInformationParams,
) => {
	const input = RetrieveUserProfileInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/profile`, {
		method: 'GET',
	});
	return RetrieveUserProfileInformationOutputSchema.parse(data);
};

export const RetrieveUserSignatureDefinitionsInputSchema = z.object({
	userId: z.string(),
	stamp_type: z.string().optional(),
});

export const RetrieveUserSignatureDefinitionsOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveUserSignatureDefinitionsParams = z.infer<
	typeof RetrieveUserSignatureDefinitionsInputSchema
>;

export const retrieveUserSignatureDefinitions = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveUserSignatureDefinitionsParams,
) => {
	const input = RetrieveUserSignatureDefinitionsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.stamp_type !== undefined)
		query.append('stamp_type', String(input.stamp_type));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/users/${input.userId}/signatures` + qs, {
		method: 'GET',
	});
	return RetrieveUserSignatureDefinitionsOutputSchema.parse(data);
};

export const RetrieveUserSignatureImageInputSchema = z.object({
	userId: z.string(),
	signatureId: z.string(),
	imageType: z.string(),
	include_chrome: z.string().optional(),
});

export const RetrieveUserSignatureImageOutputSchema = z.unknown();

export type RetrieveUserSignatureImageParams = z.infer<
	typeof RetrieveUserSignatureImageInputSchema
>;

export const retrieveUserSignatureImage = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveUserSignatureImageParams,
) => {
	const input = RetrieveUserSignatureImageInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include_chrome !== undefined)
		query.append('include_chrome', String(input.include_chrome));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/users/${input.userId}/signatures/${input.signatureId}/${input.imageType}` +
			qs,
		{
			method: 'GET',
		},
	);
	return RetrieveUserSignatureImageOutputSchema.parse(data);
};

export const RetrieveUserSignatureInformationInputSchema = z.object({
	userId: z.string(),
	signatureId: z.string(),
});

export const RetrieveUserSignatureInformationOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveUserSignatureInformationParams = z.infer<
	typeof RetrieveUserSignatureInformationInputSchema
>;

export const retrieveUserSignatureInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveUserSignatureInformationParams,
) => {
	const input = RetrieveUserSignatureInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/users/${input.userId}/signatures/${input.signatureId}`,
		{
			method: 'GET',
		},
	);
	return RetrieveUserSignatureInformationOutputSchema.parse(data);
};

export const SetUserSignatureImageInputSchema = z.object({
	userId: z.string(),
	signatureId: z.string(),
	imageType: z.string(),
	transparent_png: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const SetUserSignatureImageOutputSchema = z.object({}).passthrough();

export type SetUserSignatureImageParams = z.infer<
	typeof SetUserSignatureImageInputSchema
>;

export const setUserSignatureImage = async (
	ctxOrClient: DocusignExecutionContext,
	params: SetUserSignatureImageParams,
) => {
	const input = SetUserSignatureImageInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.transparent_png !== undefined)
		query.append('transparent_png', String(input.transparent_png));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/users/${input.userId}/signatures/${input.signatureId}/${input.imageType}` +
			qs,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return SetUserSignatureImageOutputSchema.parse(data);
};

export const UpdateUserAccountSettingsInputSchema = z.object({
	userId: z.string(),
	allow_all_languages: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateUserAccountSettingsOutputSchema = z.object({}).passthrough();

export type UpdateUserAccountSettingsParams = z.infer<
	typeof UpdateUserAccountSettingsInputSchema
>;

export const updateUserAccountSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateUserAccountSettingsParams,
) => {
	const input = UpdateUserAccountSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.allow_all_languages !== undefined)
		query.append('allow_all_languages', String(input.allow_all_languages));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/users/${input.userId}/settings` + qs, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateUserAccountSettingsOutputSchema.parse(data);
};

export const UpdateUserAuthorizationDatesInputSchema = z.object({
	userId: z.string(),
	authorizationId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateUserAuthorizationDatesOutputSchema = z
	.object({})
	.passthrough();

export type UpdateUserAuthorizationDatesParams = z.infer<
	typeof UpdateUserAuthorizationDatesInputSchema
>;

export const updateUserAuthorizationDates = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateUserAuthorizationDatesParams,
) => {
	const input = UpdateUserAuthorizationDatesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/users/${input.userId}/authorization/${input.authorizationId}`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateUserAuthorizationDatesOutputSchema.parse(data);
};

export const UpdateUserInformationForSpecifiedUserInputSchema = z.object({
	userId: z.string(),
	allow_all_languages: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateUserInformationForSpecifiedUserOutputSchema = z
	.object({})
	.passthrough();

export type UpdateUserInformationForSpecifiedUserParams = z.infer<
	typeof UpdateUserInformationForSpecifiedUserInputSchema
>;

export const updateUserInformationForSpecifiedUser = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateUserInformationForSpecifiedUserParams,
) => {
	const input = UpdateUserInformationForSpecifiedUserInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.allow_all_languages !== undefined)
		query.append('allow_all_languages', String(input.allow_all_languages));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/users/${input.userId}` + qs, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateUserInformationForSpecifiedUserOutputSchema.parse(data);
};

export const UpdateUserProfileImageInputSchema = z.object({
	userId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateUserProfileImageOutputSchema = z.object({}).passthrough();

export type UpdateUserProfileImageParams = z.infer<
	typeof UpdateUserProfileImageInputSchema
>;

export const updateUserProfileImage = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateUserProfileImageParams,
) => {
	const input = UpdateUserProfileImageInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/profile/image`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateUserProfileImageOutputSchema.parse(data);
};

export const UpdateUserProfileInformationInputSchema = z.object({
	userId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateUserProfileInformationOutputSchema = z
	.object({})
	.passthrough();

export type UpdateUserProfileInformationParams = z.infer<
	typeof UpdateUserProfileInformationInputSchema
>;

export const updateUserProfileInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateUserProfileInformationParams,
) => {
	const input = UpdateUserProfileInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/profile`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateUserProfileInformationOutputSchema.parse(data);
};

export const UpdateUserSignatureByIdInputSchema = z.object({
	userId: z.string(),
	signatureId: z.string(),
	close_existing_signature: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateUserSignatureByIdOutputSchema = z.object({}).passthrough();

export type UpdateUserSignatureByIdParams = z.infer<
	typeof UpdateUserSignatureByIdInputSchema
>;

export const updateUserSignatureById = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateUserSignatureByIdParams,
) => {
	const input = UpdateUserSignatureByIdInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.close_existing_signature !== undefined)
		query.append(
			'close_existing_signature',
			String(input.close_existing_signature),
		);
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/users/${input.userId}/signatures/${input.signatureId}` + qs,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateUserSignatureByIdOutputSchema.parse(data);
};

export const UsersInputSchemas = {
	addNewUsersToASpecifiedAccount: AddNewUsersToASpecifiedAccountInputSchema,
	addOrUpdateUserCustomSettings: AddOrUpdateUserCustomSettingsInputSchema,
	addOrUpdateUserSignature: AddOrUpdateUserSignatureInputSchema,
	addUserSignatureAndInitialsImages:
		AddUserSignatureAndInitialsImagesInputSchema,
	changeUsersInAccount: ChangeUsersInAccountInputSchema,
	closeUsersInAccount: CloseUsersInAccountInputSchema,
	createOrUpdateUserAuthorizations: CreateOrUpdateUserAuthorizationsInputSchema,
	createUserAuthorizationForAgentUser:
		CreateUserAuthorizationForAgentUserInputSchema,
	deleteCustomUserSettings: DeleteCustomUserSettingsInputSchema,
	deleteUserAuthorization: DeleteUserAuthorizationInputSchema,
	deleteUserAuthorizations: DeleteUserAuthorizationsInputSchema,
	deleteUserInitialsOrSignatureImage:
		DeleteUserInitialsOrSignatureImageInputSchema,
	deleteUserProfileImage: DeleteUserProfileImageInputSchema,
	getAgentUserAuthorizations: GetAgentUserAuthorizationsInputSchema,
	getUserAuthorizationDetails: GetUserAuthorizationDetailsInputSchema,
	getUserAuthorizationsForPrincipal:
		GetUserAuthorizationsForPrincipalInputSchema,
	getUserInformationById: GetUserInformationByIdInputSchema,
	listUsersForAccount: ListUsersForAccountInputSchema,
	removeUserSignatureInformation: RemoveUserSignatureInformationInputSchema,
	retrieveCustomUserSettings: RetrieveCustomUserSettingsInputSchema,
	retrieveUserAccountSettings: RetrieveUserAccountSettingsInputSchema,
	retrieveUserProfileImage: RetrieveUserProfileImageInputSchema,
	retrieveUserProfileInformation: RetrieveUserProfileInformationInputSchema,
	retrieveUserSignatureDefinitions: RetrieveUserSignatureDefinitionsInputSchema,
	retrieveUserSignatureImage: RetrieveUserSignatureImageInputSchema,
	retrieveUserSignatureInformation: RetrieveUserSignatureInformationInputSchema,
	setUserSignatureImage: SetUserSignatureImageInputSchema,
	updateUserAccountSettings: UpdateUserAccountSettingsInputSchema,
	updateUserAuthorizationDates: UpdateUserAuthorizationDatesInputSchema,
	updateUserInformationForSpecifiedUser:
		UpdateUserInformationForSpecifiedUserInputSchema,
	updateUserProfileImage: UpdateUserProfileImageInputSchema,
	updateUserProfileInformation: UpdateUserProfileInformationInputSchema,
	updateUserSignatureById: UpdateUserSignatureByIdInputSchema,
};

export const UsersOutputSchemas = {
	addNewUsersToASpecifiedAccount: AddNewUsersToASpecifiedAccountOutputSchema,
	addOrUpdateUserCustomSettings: AddOrUpdateUserCustomSettingsOutputSchema,
	addOrUpdateUserSignature: AddOrUpdateUserSignatureOutputSchema,
	addUserSignatureAndInitialsImages:
		AddUserSignatureAndInitialsImagesOutputSchema,
	changeUsersInAccount: ChangeUsersInAccountOutputSchema,
	closeUsersInAccount: CloseUsersInAccountOutputSchema,
	createOrUpdateUserAuthorizations:
		CreateOrUpdateUserAuthorizationsOutputSchema,
	createUserAuthorizationForAgentUser:
		CreateUserAuthorizationForAgentUserOutputSchema,
	deleteCustomUserSettings: DeleteCustomUserSettingsOutputSchema,
	deleteUserAuthorization: DeleteUserAuthorizationOutputSchema,
	deleteUserAuthorizations: DeleteUserAuthorizationsOutputSchema,
	deleteUserInitialsOrSignatureImage:
		DeleteUserInitialsOrSignatureImageOutputSchema,
	deleteUserProfileImage: DeleteUserProfileImageOutputSchema,
	getAgentUserAuthorizations: GetAgentUserAuthorizationsOutputSchema,
	getUserAuthorizationDetails: GetUserAuthorizationDetailsOutputSchema,
	getUserAuthorizationsForPrincipal:
		GetUserAuthorizationsForPrincipalOutputSchema,
	getUserInformationById: GetUserInformationByIdOutputSchema,
	listUsersForAccount: ListUsersForAccountOutputSchema,
	removeUserSignatureInformation: RemoveUserSignatureInformationOutputSchema,
	retrieveCustomUserSettings: RetrieveCustomUserSettingsOutputSchema,
	retrieveUserAccountSettings: RetrieveUserAccountSettingsOutputSchema,
	retrieveUserProfileImage: RetrieveUserProfileImageOutputSchema,
	retrieveUserProfileInformation: RetrieveUserProfileInformationOutputSchema,
	retrieveUserSignatureDefinitions:
		RetrieveUserSignatureDefinitionsOutputSchema,
	retrieveUserSignatureImage: RetrieveUserSignatureImageOutputSchema,
	retrieveUserSignatureInformation:
		RetrieveUserSignatureInformationOutputSchema,
	setUserSignatureImage: SetUserSignatureImageOutputSchema,
	updateUserAccountSettings: UpdateUserAccountSettingsOutputSchema,
	updateUserAuthorizationDates: UpdateUserAuthorizationDatesOutputSchema,
	updateUserInformationForSpecifiedUser:
		UpdateUserInformationForSpecifiedUserOutputSchema,
	updateUserProfileImage: UpdateUserProfileImageOutputSchema,
	updateUserProfileInformation: UpdateUserProfileInformationOutputSchema,
	updateUserSignatureById: UpdateUserSignatureByIdOutputSchema,
};
