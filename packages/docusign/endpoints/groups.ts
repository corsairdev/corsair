import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const AddExistingBrandToGroupInputSchema = z.object({
	groupId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddExistingBrandToGroupOutputSchema = z.object({}).passthrough();

export type AddExistingBrandToGroupParams = z.infer<
	typeof AddExistingBrandToGroupInputSchema
>;

export const addExistingBrandToGroup = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddExistingBrandToGroupParams,
) => {
	const input = AddExistingBrandToGroupInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/groups/${input.groupId}/brands`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return AddExistingBrandToGroupOutputSchema.parse(data);
};

export const AddMembersToSigningGroupInputSchema = z.object({
	signingGroupId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddMembersToSigningGroupOutputSchema = z.object({}).passthrough();

export type AddMembersToSigningGroupParams = z.infer<
	typeof AddMembersToSigningGroupInputSchema
>;

export const addMembersToSigningGroup = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddMembersToSigningGroupParams,
) => {
	const input = AddMembersToSigningGroupInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/signing_groups/${input.signingGroupId}/users`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return AddMembersToSigningGroupOutputSchema.parse(data);
};

export const AddUsersToExistingGroupInputSchema = z.object({
	groupId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddUsersToExistingGroupOutputSchema = z.object({}).passthrough();

export type AddUsersToExistingGroupParams = z.infer<
	typeof AddUsersToExistingGroupInputSchema
>;

export const addUsersToExistingGroup = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddUsersToExistingGroupParams,
) => {
	const input = AddUsersToExistingGroupInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/groups/${input.groupId}/users`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return AddUsersToExistingGroupOutputSchema.parse(data);
};

export const CreateGroupsForAccountInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateGroupsForAccountOutputSchema = z.object({}).passthrough();

export type CreateGroupsForAccountParams = z.infer<
	typeof CreateGroupsForAccountInputSchema
>;

export const createGroupsForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateGroupsForAccountParams,
) => {
	const input = CreateGroupsForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/groups`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return CreateGroupsForAccountOutputSchema.parse(data);
};

export const CreateNewAccountPermissionProfileInputSchema = z.object({
	include: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateNewAccountPermissionProfileOutputSchema = z
	.object({})
	.passthrough();

export type CreateNewAccountPermissionProfileParams = z.infer<
	typeof CreateNewAccountPermissionProfileInputSchema
>;

export const createNewAccountPermissionProfile = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateNewAccountPermissionProfileParams,
) => {
	const input = CreateNewAccountPermissionProfileInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include !== undefined)
		query.append('include', String(input.include));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/permission_profiles` + qs, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return CreateNewAccountPermissionProfileOutputSchema.parse(data);
};

export const CreateSigningGroupInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateSigningGroupOutputSchema = z.object({}).passthrough();

export type CreateSigningGroupParams = z.infer<
	typeof CreateSigningGroupInputSchema
>;

export const createSigningGroup = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateSigningGroupParams,
) => {
	const input = CreateSigningGroupInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/signing_groups`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return CreateSigningGroupOutputSchema.parse(data);
};

export const DeleteAccountPermissionProfileInputSchema = z.object({
	permissionProfileId: z.string(),
	move_users_to: z.string().optional(),
});

export const DeleteAccountPermissionProfileOutputSchema = z
	.object({})
	.passthrough();

export type DeleteAccountPermissionProfileParams = z.infer<
	typeof DeleteAccountPermissionProfileInputSchema
>;

export const deleteAccountPermissionProfile = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteAccountPermissionProfileParams,
) => {
	const input = DeleteAccountPermissionProfileInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.move_users_to !== undefined)
		query.append('move_users_to', String(input.move_users_to));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/permission_profiles/${input.permissionProfileId}` + qs,
		{
			method: 'DELETE',
		},
	);
	return DeleteAccountPermissionProfileOutputSchema.parse(data);
};

export const DeleteBrandFromGroupInputSchema = z.object({
	groupId: z.string(),
});

export const DeleteBrandFromGroupOutputSchema = z.object({}).passthrough();

export type DeleteBrandFromGroupParams = z.infer<
	typeof DeleteBrandFromGroupInputSchema
>;

export const deleteBrandFromGroup = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteBrandFromGroupParams,
) => {
	const input = DeleteBrandFromGroupInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/groups/${input.groupId}/brands`, {
		method: 'DELETE',
	});
	return DeleteBrandFromGroupOutputSchema.parse(data);
};

export const DeleteMembersFromSigningGroupInputSchema = z.object({
	signingGroupId: z.string(),
});

export const DeleteMembersFromSigningGroupOutputSchema = z
	.object({})
	.passthrough();

export type DeleteMembersFromSigningGroupParams = z.infer<
	typeof DeleteMembersFromSigningGroupInputSchema
>;

export const deleteMembersFromSigningGroup = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteMembersFromSigningGroupParams,
) => {
	const input = DeleteMembersFromSigningGroupInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/signing_groups/${input.signingGroupId}/users`,
		{
			method: 'DELETE',
		},
	);
	return DeleteMembersFromSigningGroupOutputSchema.parse(data);
};

export const DeleteOneOrMoreSigningGroupsInputSchema = z.object({});

export const DeleteOneOrMoreSigningGroupsOutputSchema = z
	.object({})
	.passthrough();

export type DeleteOneOrMoreSigningGroupsParams = z.infer<
	typeof DeleteOneOrMoreSigningGroupsInputSchema
>;

export const deleteOneOrMoreSigningGroups = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteOneOrMoreSigningGroupsParams,
) => {
	const input = DeleteOneOrMoreSigningGroupsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/signing_groups`, {
		method: 'DELETE',
	});
	return DeleteOneOrMoreSigningGroupsOutputSchema.parse(data);
};

export const DeleteUserGroupInputSchema = z.object({});

export const DeleteUserGroupOutputSchema = z.object({}).passthrough();

export type DeleteUserGroupParams = z.infer<typeof DeleteUserGroupInputSchema>;

export const deleteUserGroup = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteUserGroupParams,
) => {
	const input = DeleteUserGroupInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/groups`, {
		method: 'DELETE',
	});
	return DeleteUserGroupOutputSchema.parse(data);
};

export const DeleteUsersFromGroupInputSchema = z.object({
	groupId: z.string(),
});

export const DeleteUsersFromGroupOutputSchema = z.object({}).passthrough();

export type DeleteUsersFromGroupParams = z.infer<
	typeof DeleteUsersFromGroupInputSchema
>;

export const deleteUsersFromGroup = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteUsersFromGroupParams,
) => {
	const input = DeleteUsersFromGroupInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/groups/${input.groupId}/users`, {
		method: 'DELETE',
	});
	return DeleteUsersFromGroupOutputSchema.parse(data);
};

export const GetBrandsInformationForGroupInputSchema = z.object({
	groupId: z.string(),
});

export const GetBrandsInformationForGroupOutputSchema = z
	.object({})
	.passthrough();

export type GetBrandsInformationForGroupParams = z.infer<
	typeof GetBrandsInformationForGroupInputSchema
>;

export const getBrandsInformationForGroup = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetBrandsInformationForGroupParams,
) => {
	const input = GetBrandsInformationForGroupInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/groups/${input.groupId}/brands`, {
		method: 'GET',
	});
	return GetBrandsInformationForGroupOutputSchema.parse(data);
};

export const GetGroupsInformationForAccountInputSchema = z.object({
	count: z.string().optional(),
	group_type: z.string().optional(),
	include_usercount: z.string().optional(),
	search_text: z.string().optional(),
	start_position: z.string().optional(),
});

export const GetGroupsInformationForAccountOutputSchema = z
	.object({})
	.passthrough();

export type GetGroupsInformationForAccountParams = z.infer<
	typeof GetGroupsInformationForAccountInputSchema
>;

export const getGroupsInformationForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetGroupsInformationForAccountParams,
) => {
	const input = GetGroupsInformationForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.group_type !== undefined)
		query.append('group_type', String(input.group_type));
	if (input.include_usercount !== undefined)
		query.append('include_usercount', String(input.include_usercount));
	if (input.search_text !== undefined)
		query.append('search_text', String(input.search_text));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/groups` + qs, {
		method: 'GET',
	});
	return GetGroupsInformationForAccountOutputSchema.parse(data);
};

export const GetListOfAccountPermissionProfilesInputSchema = z.object({
	include: z.string().optional(),
});

export const GetListOfAccountPermissionProfilesOutputSchema = z
	.object({})
	.passthrough();

export type GetListOfAccountPermissionProfilesParams = z.infer<
	typeof GetListOfAccountPermissionProfilesInputSchema
>;

export const getListOfAccountPermissionProfiles = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetListOfAccountPermissionProfilesParams,
) => {
	const input = GetListOfAccountPermissionProfilesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include !== undefined)
		query.append('include', String(input.include));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/permission_profiles` + qs, {
		method: 'GET',
	});
	return GetListOfAccountPermissionProfilesOutputSchema.parse(data);
};

export const GetMembersOfASigningGroupInputSchema = z.object({
	signingGroupId: z.string(),
});

export const GetMembersOfASigningGroupOutputSchema = z.object({}).passthrough();

export type GetMembersOfASigningGroupParams = z.infer<
	typeof GetMembersOfASigningGroupInputSchema
>;

export const getMembersOfASigningGroup = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetMembersOfASigningGroupParams,
) => {
	const input = GetMembersOfASigningGroupInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/signing_groups/${input.signingGroupId}/users`,
		{
			method: 'GET',
		},
	);
	return GetMembersOfASigningGroupOutputSchema.parse(data);
};

export const GetPermissionProfileForAccountInputSchema = z.object({
	permissionProfileId: z.string(),
	include: z.string().optional(),
});

export const GetPermissionProfileForAccountOutputSchema = z
	.object({})
	.passthrough();

export type GetPermissionProfileForAccountParams = z.infer<
	typeof GetPermissionProfileForAccountInputSchema
>;

export const getPermissionProfileForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetPermissionProfileForAccountParams,
) => {
	const input = GetPermissionProfileForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include !== undefined)
		query.append('include', String(input.include));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/permission_profiles/${input.permissionProfileId}` + qs,
		{
			method: 'GET',
		},
	);
	return GetPermissionProfileForAccountOutputSchema.parse(data);
};

export const GetSigningGroupInformationInputSchema = z.object({
	signingGroupId: z.string(),
});

export const GetSigningGroupInformationOutputSchema = z
	.object({})
	.passthrough();

export type GetSigningGroupInformationParams = z.infer<
	typeof GetSigningGroupInformationInputSchema
>;

export const getSigningGroupInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetSigningGroupInformationParams,
) => {
	const input = GetSigningGroupInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/signing_groups/${input.signingGroupId}`, {
		method: 'GET',
	});
	return GetSigningGroupInformationOutputSchema.parse(data);
};

export const GetUsersInGroupInputSchema = z.object({
	groupId: z.string(),
	count: z.string().optional(),
	start_position: z.string().optional(),
});

export const GetUsersInGroupOutputSchema = z.object({}).passthrough();

export type GetUsersInGroupParams = z.infer<typeof GetUsersInGroupInputSchema>;

export const getUsersInGroup = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetUsersInGroupParams,
) => {
	const input = GetUsersInGroupInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/groups/${input.groupId}/users` + qs, {
		method: 'GET',
	});
	return GetUsersInGroupOutputSchema.parse(data);
};

export const RetrieveAccountSigningGroupsInputSchema = z.object({
	group_type: z.string().optional(),
	include_users: z.string().optional(),
});

export const RetrieveAccountSigningGroupsOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveAccountSigningGroupsParams = z.infer<
	typeof RetrieveAccountSigningGroupsInputSchema
>;

export const retrieveAccountSigningGroups = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveAccountSigningGroupsParams,
) => {
	const input = RetrieveAccountSigningGroupsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.group_type !== undefined)
		query.append('group_type', String(input.group_type));
	if (input.include_users !== undefined)
		query.append('include_users', String(input.include_users));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/signing_groups` + qs, {
		method: 'GET',
	});
	return RetrieveAccountSigningGroupsOutputSchema.parse(data);
};

export const UpdateGroupInformationInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateGroupInformationOutputSchema = z.object({}).passthrough();

export type UpdateGroupInformationParams = z.infer<
	typeof UpdateGroupInformationInputSchema
>;

export const updateGroupInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateGroupInformationParams,
) => {
	const input = UpdateGroupInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/groups`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateGroupInformationOutputSchema.parse(data);
};

export const UpdatePermissionProfileSettingsInputSchema = z.object({
	permissionProfileId: z.string(),
	include: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdatePermissionProfileSettingsOutputSchema = z
	.object({})
	.passthrough();

export type UpdatePermissionProfileSettingsParams = z.infer<
	typeof UpdatePermissionProfileSettingsInputSchema
>;

export const updatePermissionProfileSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdatePermissionProfileSettingsParams,
) => {
	const input = UpdatePermissionProfileSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include !== undefined)
		query.append('include', String(input.include));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/permission_profiles/${input.permissionProfileId}` + qs,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdatePermissionProfileSettingsOutputSchema.parse(data);
};

export const UpdateSigningGroupDetailsInputSchema = z.object({
	signingGroupId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateSigningGroupDetailsOutputSchema = z.object({}).passthrough();

export type UpdateSigningGroupDetailsParams = z.infer<
	typeof UpdateSigningGroupDetailsInputSchema
>;

export const updateSigningGroupDetails = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateSigningGroupDetailsParams,
) => {
	const input = UpdateSigningGroupDetailsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/signing_groups/${input.signingGroupId}`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateSigningGroupDetailsOutputSchema.parse(data);
};

export const UpdateSigningGroupNamesInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateSigningGroupNamesOutputSchema = z.object({}).passthrough();

export type UpdateSigningGroupNamesParams = z.infer<
	typeof UpdateSigningGroupNamesInputSchema
>;

export const updateSigningGroupNames = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateSigningGroupNamesParams,
) => {
	const input = UpdateSigningGroupNamesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/signing_groups`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateSigningGroupNamesOutputSchema.parse(data);
};

export const GroupsInputSchemas = {
	addExistingBrandToGroup: AddExistingBrandToGroupInputSchema,
	addMembersToSigningGroup: AddMembersToSigningGroupInputSchema,
	addUsersToExistingGroup: AddUsersToExistingGroupInputSchema,
	createGroupsForAccount: CreateGroupsForAccountInputSchema,
	createNewAccountPermissionProfile:
		CreateNewAccountPermissionProfileInputSchema,
	createSigningGroup: CreateSigningGroupInputSchema,
	deleteAccountPermissionProfile: DeleteAccountPermissionProfileInputSchema,
	deleteBrandFromGroup: DeleteBrandFromGroupInputSchema,
	deleteMembersFromSigningGroup: DeleteMembersFromSigningGroupInputSchema,
	deleteOneOrMoreSigningGroups: DeleteOneOrMoreSigningGroupsInputSchema,
	deleteUserGroup: DeleteUserGroupInputSchema,
	deleteUsersFromGroup: DeleteUsersFromGroupInputSchema,
	getBrandsInformationForGroup: GetBrandsInformationForGroupInputSchema,
	getGroupsInformationForAccount: GetGroupsInformationForAccountInputSchema,
	getListOfAccountPermissionProfiles:
		GetListOfAccountPermissionProfilesInputSchema,
	getMembersOfASigningGroup: GetMembersOfASigningGroupInputSchema,
	getPermissionProfileForAccount: GetPermissionProfileForAccountInputSchema,
	getSigningGroupInformation: GetSigningGroupInformationInputSchema,
	getUsersInGroup: GetUsersInGroupInputSchema,
	retrieveAccountSigningGroups: RetrieveAccountSigningGroupsInputSchema,
	updateGroupInformation: UpdateGroupInformationInputSchema,
	updatePermissionProfileSettings: UpdatePermissionProfileSettingsInputSchema,
	updateSigningGroupDetails: UpdateSigningGroupDetailsInputSchema,
	updateSigningGroupNames: UpdateSigningGroupNamesInputSchema,
};

export const GroupsOutputSchemas = {
	addExistingBrandToGroup: AddExistingBrandToGroupOutputSchema,
	addMembersToSigningGroup: AddMembersToSigningGroupOutputSchema,
	addUsersToExistingGroup: AddUsersToExistingGroupOutputSchema,
	createGroupsForAccount: CreateGroupsForAccountOutputSchema,
	createNewAccountPermissionProfile:
		CreateNewAccountPermissionProfileOutputSchema,
	createSigningGroup: CreateSigningGroupOutputSchema,
	deleteAccountPermissionProfile: DeleteAccountPermissionProfileOutputSchema,
	deleteBrandFromGroup: DeleteBrandFromGroupOutputSchema,
	deleteMembersFromSigningGroup: DeleteMembersFromSigningGroupOutputSchema,
	deleteOneOrMoreSigningGroups: DeleteOneOrMoreSigningGroupsOutputSchema,
	deleteUserGroup: DeleteUserGroupOutputSchema,
	deleteUsersFromGroup: DeleteUsersFromGroupOutputSchema,
	getBrandsInformationForGroup: GetBrandsInformationForGroupOutputSchema,
	getGroupsInformationForAccount: GetGroupsInformationForAccountOutputSchema,
	getListOfAccountPermissionProfiles:
		GetListOfAccountPermissionProfilesOutputSchema,
	getMembersOfASigningGroup: GetMembersOfASigningGroupOutputSchema,
	getPermissionProfileForAccount: GetPermissionProfileForAccountOutputSchema,
	getSigningGroupInformation: GetSigningGroupInformationOutputSchema,
	getUsersInGroup: GetUsersInGroupOutputSchema,
	retrieveAccountSigningGroups: RetrieveAccountSigningGroupsOutputSchema,
	updateGroupInformation: UpdateGroupInformationOutputSchema,
	updatePermissionProfileSettings: UpdatePermissionProfileSettingsOutputSchema,
	updateSigningGroupDetails: UpdateSigningGroupDetailsOutputSchema,
	updateSigningGroupNames: UpdateSigningGroupNamesOutputSchema,
};
