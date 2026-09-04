import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const AddFileToWorkspaceInputSchema = z.object({
	workspaceId: z.string(),
	folderId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddFileToWorkspaceOutputSchema = z.object({}).passthrough();

export type AddFileToWorkspaceParams = z.infer<
	typeof AddFileToWorkspaceInputSchema
>;

export const addFileToWorkspace = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddFileToWorkspaceParams,
) => {
	const input = AddFileToWorkspaceInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/workspaces/${encodeURIComponent(input.workspaceId)}/folders/${encodeURIComponent(input.folderId)}/files`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return AddFileToWorkspaceOutputSchema.parse(data);
};

export const CreateACollaborativeWorkspaceInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateACollaborativeWorkspaceOutputSchema = z
	.object({})
	.passthrough();

export type CreateACollaborativeWorkspaceParams = z.infer<
	typeof CreateACollaborativeWorkspaceInputSchema
>;

export const createACollaborativeWorkspace = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateACollaborativeWorkspaceParams,
) => {
	const input = CreateACollaborativeWorkspaceInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/workspaces`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return CreateACollaborativeWorkspaceOutputSchema.parse(data);
};

export const DeleteExistingWorkspaceLogicallyInputSchema = z.object({
	workspaceId: z.string(),
});

export const DeleteExistingWorkspaceLogicallyOutputSchema = z
	.object({})
	.passthrough();

export type DeleteExistingWorkspaceLogicallyParams = z.infer<
	typeof DeleteExistingWorkspaceLogicallyInputSchema
>;

export const deleteExistingWorkspaceLogically = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteExistingWorkspaceLogicallyParams,
) => {
	const input = DeleteExistingWorkspaceLogicallyInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/workspaces/${encodeURIComponent(input.workspaceId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteExistingWorkspaceLogicallyOutputSchema.parse(data);
};

export const DeleteWorkspaceFilesOrFoldersInputSchema = z.object({
	workspaceId: z.string(),
	folderId: z.string(),
});

export const DeleteWorkspaceFilesOrFoldersOutputSchema = z
	.object({})
	.passthrough();

export type DeleteWorkspaceFilesOrFoldersParams = z.infer<
	typeof DeleteWorkspaceFilesOrFoldersInputSchema
>;

export const deleteWorkspaceFilesOrFolders = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteWorkspaceFilesOrFoldersParams,
) => {
	const input = DeleteWorkspaceFilesOrFoldersInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/workspaces/${encodeURIComponent(input.workspaceId)}/folders/${encodeURIComponent(input.folderId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteWorkspaceFilesOrFoldersOutputSchema.parse(data);
};

export const GetWorkspaceFileInputSchema = z.object({
	workspaceId: z.string(),
	folderId: z.string(),
	fileId: z.string(),
	is_download: z.string().optional(),
	pdf_version: z.string().optional(),
});

export const GetWorkspaceFileOutputSchema = z.unknown();

export type GetWorkspaceFileParams = z.infer<
	typeof GetWorkspaceFileInputSchema
>;

export const getWorkspaceFile = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetWorkspaceFileParams,
) => {
	const input = GetWorkspaceFileInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.is_download !== undefined)
		query.append('is_download', String(input.is_download));
	if (input.pdf_version !== undefined)
		query.append('pdf_version', String(input.pdf_version));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/workspaces/${encodeURIComponent(input.workspaceId)}/folders/${encodeURIComponent(input.folderId)}/files/${encodeURIComponent(input.fileId)}` +
			qs,
		{
			method: 'GET',
		},
	);
	return GetWorkspaceFileOutputSchema.parse(data);
};

export const GetWorkspaceFolderContentsInputSchema = z.object({
	workspaceId: z.string(),
	folderId: z.string(),
	count: z.string().optional(),
	include_files: z.string().optional(),
	include_sub_folders: z.string().optional(),
	include_thumbnails: z.string().optional(),
	include_user_detail: z.string().optional(),
	start_position: z.string().optional(),
	workspace_user_id: z.string().optional(),
});

export const GetWorkspaceFolderContentsOutputSchema = z
	.object({})
	.passthrough();

export type GetWorkspaceFolderContentsParams = z.infer<
	typeof GetWorkspaceFolderContentsInputSchema
>;

export const getWorkspaceFolderContents = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetWorkspaceFolderContentsParams,
) => {
	const input = GetWorkspaceFolderContentsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.include_files !== undefined)
		query.append('include_files', String(input.include_files));
	if (input.include_sub_folders !== undefined)
		query.append('include_sub_folders', String(input.include_sub_folders));
	if (input.include_thumbnails !== undefined)
		query.append('include_thumbnails', String(input.include_thumbnails));
	if (input.include_user_detail !== undefined)
		query.append('include_user_detail', String(input.include_user_detail));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	if (input.workspace_user_id !== undefined)
		query.append('workspace_user_id', String(input.workspace_user_id));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/workspaces/${encodeURIComponent(input.workspaceId)}/folders/${encodeURIComponent(input.folderId)}` +
			qs,
		{
			method: 'GET',
		},
	);
	return GetWorkspaceFolderContentsOutputSchema.parse(data);
};

export const ListWorkspaceFilePagesInputSchema = z.object({
	workspaceId: z.string(),
	folderId: z.string(),
	fileId: z.string(),
	count: z.string().optional(),
	dpi: z.string().optional(),
	max_height: z.string().optional(),
	max_width: z.string().optional(),
	start_position: z.string().optional(),
});

export const ListWorkspaceFilePagesOutputSchema = z.object({}).passthrough();

export type ListWorkspaceFilePagesParams = z.infer<
	typeof ListWorkspaceFilePagesInputSchema
>;

export const listWorkspaceFilePages = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListWorkspaceFilePagesParams,
) => {
	const input = ListWorkspaceFilePagesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.dpi !== undefined) query.append('dpi', String(input.dpi));
	if (input.max_height !== undefined)
		query.append('max_height', String(input.max_height));
	if (input.max_width !== undefined)
		query.append('max_width', String(input.max_width));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/workspaces/${encodeURIComponent(input.workspaceId)}/folders/${encodeURIComponent(input.folderId)}/files/${encodeURIComponent(input.fileId)}/pages` +
			qs,
		{
			method: 'GET',
		},
	);
	return ListWorkspaceFilePagesOutputSchema.parse(data);
};

export const ListWorkspacesInputSchema = z.object({});

export const ListWorkspacesOutputSchema = z.object({}).passthrough();

export type ListWorkspacesParams = z.infer<typeof ListWorkspacesInputSchema>;

export const listWorkspaces = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListWorkspacesParams,
) => {
	const input = ListWorkspacesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/workspaces`, {
		method: 'GET',
	});
	return ListWorkspacesOutputSchema.parse(data);
};

export const RetrievePropertiesAboutWorkspaceInputSchema = z.object({
	workspaceId: z.string(),
});

export const RetrievePropertiesAboutWorkspaceOutputSchema = z
	.object({})
	.passthrough();

export type RetrievePropertiesAboutWorkspaceParams = z.infer<
	typeof RetrievePropertiesAboutWorkspaceInputSchema
>;

export const retrievePropertiesAboutWorkspace = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrievePropertiesAboutWorkspaceParams,
) => {
	const input = RetrievePropertiesAboutWorkspaceInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/workspaces/${encodeURIComponent(input.workspaceId)}`,
		{
			method: 'GET',
		},
	);
	return RetrievePropertiesAboutWorkspaceOutputSchema.parse(data);
};

export const UpdateWorkspaceInformationInputSchema = z.object({
	workspaceId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateWorkspaceInformationOutputSchema = z
	.object({})
	.passthrough();

export type UpdateWorkspaceInformationParams = z.infer<
	typeof UpdateWorkspaceInformationInputSchema
>;

export const updateWorkspaceInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateWorkspaceInformationParams,
) => {
	const input = UpdateWorkspaceInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/workspaces/${encodeURIComponent(input.workspaceId)}`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateWorkspaceInformationOutputSchema.parse(data);
};

export const UpdateWorkspaceItemMetadataInputSchema = z.object({
	workspaceId: z.string(),
	folderId: z.string(),
	fileId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateWorkspaceItemMetadataOutputSchema = z
	.object({})
	.passthrough();

export type UpdateWorkspaceItemMetadataParams = z.infer<
	typeof UpdateWorkspaceItemMetadataInputSchema
>;

export const updateWorkspaceItemMetadata = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateWorkspaceItemMetadataParams,
) => {
	const input = UpdateWorkspaceItemMetadataInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/workspaces/${encodeURIComponent(input.workspaceId)}/folders/${encodeURIComponent(input.folderId)}/files/${encodeURIComponent(input.fileId)}`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateWorkspaceItemMetadataOutputSchema.parse(data);
};

export const WorkspacesInputSchemas = {
	addFileToWorkspace: AddFileToWorkspaceInputSchema,
	createACollaborativeWorkspace: CreateACollaborativeWorkspaceInputSchema,
	deleteExistingWorkspaceLogically: DeleteExistingWorkspaceLogicallyInputSchema,
	deleteWorkspaceFilesOrFolders: DeleteWorkspaceFilesOrFoldersInputSchema,
	getWorkspaceFile: GetWorkspaceFileInputSchema,
	getWorkspaceFolderContents: GetWorkspaceFolderContentsInputSchema,
	listWorkspaceFilePages: ListWorkspaceFilePagesInputSchema,
	listWorkspaces: ListWorkspacesInputSchema,
	retrievePropertiesAboutWorkspace: RetrievePropertiesAboutWorkspaceInputSchema,
	updateWorkspaceInformation: UpdateWorkspaceInformationInputSchema,
	updateWorkspaceItemMetadata: UpdateWorkspaceItemMetadataInputSchema,
};

export const WorkspacesOutputSchemas = {
	addFileToWorkspace: AddFileToWorkspaceOutputSchema,
	createACollaborativeWorkspace: CreateACollaborativeWorkspaceOutputSchema,
	deleteExistingWorkspaceLogically:
		DeleteExistingWorkspaceLogicallyOutputSchema,
	deleteWorkspaceFilesOrFolders: DeleteWorkspaceFilesOrFoldersOutputSchema,
	getWorkspaceFile: GetWorkspaceFileOutputSchema,
	getWorkspaceFolderContents: GetWorkspaceFolderContentsOutputSchema,
	listWorkspaceFilePages: ListWorkspaceFilePagesOutputSchema,
	listWorkspaces: ListWorkspacesOutputSchema,
	retrievePropertiesAboutWorkspace:
		RetrievePropertiesAboutWorkspaceOutputSchema,
	updateWorkspaceInformation: UpdateWorkspaceInformationOutputSchema,
	updateWorkspaceItemMetadata: UpdateWorkspaceItemMetadataOutputSchema,
};
