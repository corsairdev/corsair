import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const ConfigureCloudStorageRedirectUrlInputSchema = z.object({
	userId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const ConfigureCloudStorageRedirectUrlOutputSchema = z
	.object({})
	.passthrough();

export type ConfigureCloudStorageRedirectUrlParams = z.infer<
	typeof ConfigureCloudStorageRedirectUrlInputSchema
>;

export const configureCloudStorageRedirectUrl = async (
	ctxOrClient: DocusignExecutionContext,
	params: ConfigureCloudStorageRedirectUrlParams,
) => {
	const input = ConfigureCloudStorageRedirectUrlInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/cloud_storage`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return ConfigureCloudStorageRedirectUrlOutputSchema.parse(data);
};

export const DeleteUserAuthForCloudStorageProvidersInputSchema = z.object({
	userId: z.string(),
	serviceId: z.string(),
});

export const DeleteUserAuthForCloudStorageProvidersOutputSchema = z
	.object({})
	.passthrough();

export type DeleteUserAuthForCloudStorageProvidersParams = z.infer<
	typeof DeleteUserAuthForCloudStorageProvidersInputSchema
>;

export const deleteUserAuthForCloudStorageProviders = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteUserAuthForCloudStorageProvidersParams,
) => {
	const input = DeleteUserAuthForCloudStorageProvidersInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/users/${input.userId}/cloud_storage/${input.serviceId}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteUserAuthForCloudStorageProvidersOutputSchema.parse(data);
};

export const DeleteUserCloudStorageAuthenticationInputSchema = z.object({
	userId: z.string(),
});

export const DeleteUserCloudStorageAuthenticationOutputSchema = z
	.object({})
	.passthrough();

export type DeleteUserCloudStorageAuthenticationParams = z.infer<
	typeof DeleteUserCloudStorageAuthenticationInputSchema
>;

export const deleteUserCloudStorageAuthentication = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteUserCloudStorageAuthenticationParams,
) => {
	const input = DeleteUserCloudStorageAuthenticationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/users/${input.userId}/cloud_storage`, {
		method: 'DELETE',
	});
	return DeleteUserCloudStorageAuthenticationOutputSchema.parse(data);
};

export const GetUserCloudStorageProviderConfigurationInputSchema = z.object({
	userId: z.string(),
	serviceId: z.string(),
	redirectUrl: z.string().optional(),
});

export const GetUserCloudStorageProviderConfigurationOutputSchema = z
	.object({})
	.passthrough();

export type GetUserCloudStorageProviderConfigurationParams = z.infer<
	typeof GetUserCloudStorageProviderConfigurationInputSchema
>;

export const getUserCloudStorageProviderConfiguration = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetUserCloudStorageProviderConfigurationParams,
) => {
	const input =
		GetUserCloudStorageProviderConfigurationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.redirectUrl !== undefined)
		query.append('redirectUrl', String(input.redirectUrl));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/users/${input.userId}/cloud_storage/${input.serviceId}` + qs,
		{
			method: 'GET',
		},
	);
	return GetUserCloudStorageProviderConfigurationOutputSchema.parse(data);
};

export const ListCloudStorageItemsInputSchema = z.object({
	userId: z.string(),
	serviceId: z.string(),
	cloud_storage_folder_path: z.string().optional(),
	count: z.string().optional(),
	order: z.string().optional(),
	order_by: z.string().optional(),
	search_text: z.string().optional(),
	start_position: z.string().optional(),
});

export const ListCloudStorageItemsOutputSchema = z.object({}).passthrough();

export type ListCloudStorageItemsParams = z.infer<
	typeof ListCloudStorageItemsInputSchema
>;

export const listCloudStorageItems = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListCloudStorageItemsParams,
) => {
	const input = ListCloudStorageItemsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.cloud_storage_folder_path !== undefined)
		query.append(
			'cloud_storage_folder_path',
			String(input.cloud_storage_folder_path),
		);
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.order !== undefined) query.append('order', String(input.order));
	if (input.order_by !== undefined)
		query.append('order_by', String(input.order_by));
	if (input.search_text !== undefined)
		query.append('search_text', String(input.search_text));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/users/${input.userId}/cloud_storage/${input.serviceId}/folders` + qs,
		{
			method: 'GET',
		},
	);
	return ListCloudStorageItemsOutputSchema.parse(data);
};

export const RetrieveCloudStorageProviderConfigurationInputSchema = z.object({
	userId: z.string(),
	redirectUrl: z.string().optional(),
});

export const RetrieveCloudStorageProviderConfigurationOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveCloudStorageProviderConfigurationParams = z.infer<
	typeof RetrieveCloudStorageProviderConfigurationInputSchema
>;

export const retrieveCloudStorageProviderConfiguration = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveCloudStorageProviderConfigurationParams,
) => {
	const input =
		RetrieveCloudStorageProviderConfigurationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.redirectUrl !== undefined)
		query.append('redirectUrl', String(input.redirectUrl));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/users/${input.userId}/cloud_storage` + qs,
		{
			method: 'GET',
		},
	);
	return RetrieveCloudStorageProviderConfigurationOutputSchema.parse(data);
};

export const RetrieveItemsInCloudStorageFolderInputSchema = z.object({
	userId: z.string(),
	serviceId: z.string(),
	folderId: z.string(),
	cloud_storage_folder_path: z.string().optional(),
	cloud_storage_folderid_plain: z.string().optional(),
	count: z.string().optional(),
	order: z.string().optional(),
	order_by: z.string().optional(),
	search_text: z.string().optional(),
	sky_drive_skip_token: z.string().optional(),
	start_position: z.string().optional(),
});

export const RetrieveItemsInCloudStorageFolderOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveItemsInCloudStorageFolderParams = z.infer<
	typeof RetrieveItemsInCloudStorageFolderInputSchema
>;

export const retrieveItemsInCloudStorageFolder = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveItemsInCloudStorageFolderParams,
) => {
	const input = RetrieveItemsInCloudStorageFolderInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.cloud_storage_folder_path !== undefined)
		query.append(
			'cloud_storage_folder_path',
			String(input.cloud_storage_folder_path),
		);
	if (input.cloud_storage_folderid_plain !== undefined)
		query.append(
			'cloud_storage_folderid_plain',
			String(input.cloud_storage_folderid_plain),
		);
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.order !== undefined) query.append('order', String(input.order));
	if (input.order_by !== undefined)
		query.append('order_by', String(input.order_by));
	if (input.search_text !== undefined)
		query.append('search_text', String(input.search_text));
	if (input.sky_drive_skip_token !== undefined)
		query.append('sky_drive_skip_token', String(input.sky_drive_skip_token));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/users/${input.userId}/cloud_storage/${input.serviceId}/folders/${input.folderId}` +
			qs,
		{
			method: 'GET',
		},
	);
	return RetrieveItemsInCloudStorageFolderOutputSchema.parse(data);
};

export const CloudStorageInputSchemas = {
	configureCloudStorageRedirectUrl: ConfigureCloudStorageRedirectUrlInputSchema,
	deleteUserAuthForCloudStorageProviders:
		DeleteUserAuthForCloudStorageProvidersInputSchema,
	deleteUserCloudStorageAuthentication:
		DeleteUserCloudStorageAuthenticationInputSchema,
	getUserCloudStorageProviderConfiguration:
		GetUserCloudStorageProviderConfigurationInputSchema,
	listCloudStorageItems: ListCloudStorageItemsInputSchema,
	retrieveCloudStorageProviderConfiguration:
		RetrieveCloudStorageProviderConfigurationInputSchema,
	retrieveItemsInCloudStorageFolder:
		RetrieveItemsInCloudStorageFolderInputSchema,
};

export const CloudStorageOutputSchemas = {
	configureCloudStorageRedirectUrl:
		ConfigureCloudStorageRedirectUrlOutputSchema,
	deleteUserAuthForCloudStorageProviders:
		DeleteUserAuthForCloudStorageProvidersOutputSchema,
	deleteUserCloudStorageAuthentication:
		DeleteUserCloudStorageAuthenticationOutputSchema,
	getUserCloudStorageProviderConfiguration:
		GetUserCloudStorageProviderConfigurationOutputSchema,
	listCloudStorageItems: ListCloudStorageItemsOutputSchema,
	retrieveCloudStorageProviderConfiguration:
		RetrieveCloudStorageProviderConfigurationOutputSchema,
	retrieveItemsInCloudStorageFolder:
		RetrieveItemsInCloudStorageFolderOutputSchema,
};
