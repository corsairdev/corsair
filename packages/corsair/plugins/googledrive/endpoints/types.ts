import { z } from 'zod';
import type {
	File,
	FileList,
	Permission,
	SharedDrive,
	SharedDriveList,
} from '../types';

const FilesListInputSchema = z.object({
	q: z.string().optional(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
	spaces: z.string().optional(),
	corpora: z.string().optional(),
	driveId: z.string().optional(),
	includeItemsFromAllDrives: z.boolean().optional(),
	includePermissionsForView: z.string().optional(),
	orderBy: z.string().optional(),
	supportsAllDrives: z.boolean().optional(),
	supportsTeamDrives: z.boolean().optional(),
	teamDriveId: z.string().optional(),
});

const FilesGetInputSchema = z.object({
	fileId: z.string(),
	acknowledgeAbuse: z.boolean().optional(),
	supportsAllDrives: z.boolean().optional(),
	supportsTeamDrives: z.boolean().optional(),
	includePermissionsForView: z.string().optional(),
});

const FilesCreateFromTextInputSchema = z.object({
	name: z.string(),
	content: z.string(),
	mimeType: z.string().optional(),
	parents: z.array(z.string()).optional(),
	description: z.string().optional(),
});

const FilesUploadInputSchema = z.object({
	name: z.string(),
	mimeType: z.string().optional(),
	parents: z.array(z.string()).optional(),
	description: z.string().optional(),
});

const FilesUpdateInputSchema = z.object({
	fileId: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	starred: z.boolean().optional(),
	trashed: z.boolean().optional(),
	parents: z.array(z.string()).optional(),
	addParents: z.string().optional(),
	removeParents: z.string().optional(),
	properties: z.record(z.string()).optional(),
	appProperties: z.record(z.string()).optional(),
	supportsAllDrives: z.boolean().optional(),
	supportsTeamDrives: z.boolean().optional(),
});

const FilesDeleteInputSchema = z.object({
	fileId: z.string(),
	supportsAllDrives: z.boolean().optional(),
	supportsTeamDrives: z.boolean().optional(),
});

const FilesCopyInputSchema = z.object({
	fileId: z.string(),
	name: z.string().optional(),
	parents: z.array(z.string()).optional(),
	supportsAllDrives: z.boolean().optional(),
	supportsTeamDrives: z.boolean().optional(),
});

const FilesMoveInputSchema = z.object({
	fileId: z.string(),
	addParents: z.string().optional(),
	removeParents: z.string().optional(),
	supportsAllDrives: z.boolean().optional(),
	supportsTeamDrives: z.boolean().optional(),
});

const FilesDownloadInputSchema = z.object({
	fileId: z.string(),
	acknowledgeAbuse: z.boolean().optional(),
});

const FilesShareInputSchema = z.object({
	fileId: z.string(),
	type: z.enum(['user', 'group', 'domain', 'anyone']).optional(),
	role: z
		.enum([
			'owner',
			'organizer',
			'fileOrganizer',
			'writer',
			'commenter',
			'reader',
		])
		.optional(),
	emailAddress: z.string().optional(),
	domain: z.string().optional(),
	allowFileDiscovery: z.boolean().optional(),
	expirationTime: z.string().optional(),
	sendNotificationEmail: z.boolean().optional(),
	emailMessage: z.string().optional(),
	supportsAllDrives: z.boolean().optional(),
	supportsTeamDrives: z.boolean().optional(),
	moveToNewOwnersRoot: z.boolean().optional(),
	transferOwnership: z.boolean().optional(),
});

const FoldersCreateInputSchema = z.object({
	name: z.string(),
	parents: z.array(z.string()).optional(),
	description: z.string().optional(),
});

const FoldersGetInputSchema = z.object({
	folderId: z.string(),
	supportsAllDrives: z.boolean().optional(),
	supportsTeamDrives: z.boolean().optional(),
	includePermissionsForView: z.string().optional(),
});

const FoldersListInputSchema = z.object({
	q: z.string().optional(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
	spaces: z.string().optional(),
	corpora: z.string().optional(),
	driveId: z.string().optional(),
	includeItemsFromAllDrives: z.boolean().optional(),
	includePermissionsForView: z.string().optional(),
	orderBy: z.string().optional(),
	supportsAllDrives: z.boolean().optional(),
	supportsTeamDrives: z.boolean().optional(),
	teamDriveId: z.string().optional(),
});

const FoldersDeleteInputSchema = z.object({
	folderId: z.string(),
	supportsAllDrives: z.boolean().optional(),
	supportsTeamDrives: z.boolean().optional(),
});

const FoldersShareInputSchema = z.object({
	folderId: z.string(),
	type: z.enum(['user', 'group', 'domain', 'anyone']).optional(),
	role: z
		.enum([
			'owner',
			'organizer',
			'fileOrganizer',
			'writer',
			'commenter',
			'reader',
		])
		.optional(),
	emailAddress: z.string().optional(),
	domain: z.string().optional(),
	allowFileDiscovery: z.boolean().optional(),
	expirationTime: z.string().optional(),
	sendNotificationEmail: z.boolean().optional(),
	emailMessage: z.string().optional(),
	supportsAllDrives: z.boolean().optional(),
	supportsTeamDrives: z.boolean().optional(),
	moveToNewOwnersRoot: z.boolean().optional(),
	transferOwnership: z.boolean().optional(),
});

const SharedDrivesCreateInputSchema = z.object({
	name: z.string(),
	requestId: z.string().optional(),
	themeId: z.string().optional(),
	colorRgb: z.string().optional(),
	restrictions: z
		.object({
			adminManagedRestrictions: z.boolean().optional(),
			copyRequiresWriterPermission: z.boolean().optional(),
			domainUsersOnly: z.boolean().optional(),
			driveMembersOnly: z.boolean().optional(),
		})
		.optional(),
});

const SharedDrivesGetInputSchema = z.object({
	driveId: z.string(),
	useDomainAdminAccess: z.boolean().optional(),
});

const SharedDrivesListInputSchema = z.object({
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
	q: z.string().optional(),
	useDomainAdminAccess: z.boolean().optional(),
});

const SharedDrivesUpdateInputSchema = z.object({
	driveId: z.string(),
	name: z.string().optional(),
	themeId: z.string().optional(),
	colorRgb: z.string().optional(),
	restrictions: z
		.object({
			adminManagedRestrictions: z.boolean().optional(),
			copyRequiresWriterPermission: z.boolean().optional(),
			domainUsersOnly: z.boolean().optional(),
			driveMembersOnly: z.boolean().optional(),
		})
		.optional(),
	useDomainAdminAccess: z.boolean().optional(),
});

const SharedDrivesDeleteInputSchema = z.object({
	driveId: z.string(),
});

const SearchFilesAndFoldersInputSchema = z.object({
	q: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
	spaces: z.string().optional(),
	corpora: z.string().optional(),
	driveId: z.string().optional(),
	includeItemsFromAllDrives: z.boolean().optional(),
	includePermissionsForView: z.string().optional(),
	orderBy: z.string().optional(),
	supportsAllDrives: z.boolean().optional(),
	supportsTeamDrives: z.boolean().optional(),
	teamDriveId: z.string().optional(),
});

export const GoogleDriveEndpointInputSchemas = {
	filesList: FilesListInputSchema,
	filesGet: FilesGetInputSchema,
	filesCreateFromText: FilesCreateFromTextInputSchema,
	filesUpload: FilesUploadInputSchema,
	filesUpdate: FilesUpdateInputSchema,
	filesDelete: FilesDeleteInputSchema,
	filesCopy: FilesCopyInputSchema,
	filesMove: FilesMoveInputSchema,
	filesDownload: FilesDownloadInputSchema,
	filesShare: FilesShareInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersGet: FoldersGetInputSchema,
	foldersList: FoldersListInputSchema,
	foldersDelete: FoldersDeleteInputSchema,
	foldersShare: FoldersShareInputSchema,
	sharedDrivesCreate: SharedDrivesCreateInputSchema,
	sharedDrivesGet: SharedDrivesGetInputSchema,
	sharedDrivesList: SharedDrivesListInputSchema,
	sharedDrivesUpdate: SharedDrivesUpdateInputSchema,
	sharedDrivesDelete: SharedDrivesDeleteInputSchema,
	searchFilesAndFolders: SearchFilesAndFoldersInputSchema,
} as const;

export type GoogleDriveEndpointInputs = {
	[K in keyof typeof GoogleDriveEndpointInputSchemas]: z.infer<
		(typeof GoogleDriveEndpointInputSchemas)[K]
	>;
};

const FileSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	mimeType: z.string().optional(),
	description: z.string().optional(),
	starred: z.boolean().optional(),
	trashed: z.boolean().optional(),
	explicitlyTrashed: z.boolean().optional(),
	parents: z.array(z.string()).optional(),
	properties: z.record(z.string()).optional(),
	appProperties: z.record(z.string()).optional(),
	spaces: z.array(z.string()).optional(),
	version: z.string().optional(),
	webViewLink: z.string().optional(),
	webContentLink: z.string().optional(),
	iconLink: z.string().optional(),
	hasThumbnail: z.boolean().optional(),
	thumbnailLink: z.string().optional(),
	thumbnailVersion: z.string().optional(),
	viewedByMe: z.boolean().optional(),
	viewedByMeTime: z.string().optional(),
	createdTime: z.string().optional(),
	modifiedTime: z.string().optional(),
	modifiedByMeTime: z.string().optional(),
	modifiedByMe: z.boolean().optional(),
	shared: z.boolean().optional(),
	ownedByMe: z.boolean().optional(),
	permissionIds: z.array(z.string()).optional(),
	hasAugmentedPermissions: z.boolean().optional(),
	folderColorRgb: z.string().optional(),
	originalFilename: z.string().optional(),
	fullFileExtension: z.string().optional(),
	fileExtension: z.string().optional(),
	md5Checksum: z.string().optional(),
	size: z.string().optional(),
	quotaBytesUsed: z.string().optional(),
	headRevisionId: z.string().optional(),
	isAppAuthorized: z.boolean().optional(),
	resourceKey: z.string().optional(),
	sha1Checksum: z.string().optional(),
	sha256Checksum: z.string().optional(),
});

const FileListSchema = z.object({
	kind: z.string().optional(),
	nextPageToken: z.string().optional(),
	incompleteSearch: z.boolean().optional(),
	files: z.array(FileSchema).optional(),
});

const PermissionSchema = z.object({
	id: z.string().optional(),
	type: z.enum(['user', 'group', 'domain', 'anyone']).optional(),
	emailAddress: z.string().optional(),
	domain: z.string().optional(),
	role: z
		.enum([
			'owner',
			'organizer',
			'fileOrganizer',
			'writer',
			'commenter',
			'reader',
		])
		.optional(),
	allowFileDiscovery: z.boolean().optional(),
	displayName: z.string().optional(),
	photoLink: z.string().optional(),
	expirationTime: z.string().optional(),
	deleted: z.boolean().optional(),
	view: z.enum(['user', 'domain']).optional(),
	pendingOwner: z.boolean().optional(),
});

const SharedDriveSchema = z.object({
	kind: z.string().optional(),
	id: z.string().optional(),
	name: z.string().optional(),
	themeId: z.string().optional(),
	colorRgb: z.string().optional(),
	createdTime: z.string().optional(),
	hidden: z.boolean().optional(),
});

const SharedDriveListSchema = z.object({
	kind: z.string().optional(),
	nextPageToken: z.string().optional(),
	drives: z.array(SharedDriveSchema).optional(),
});

export const GoogleDriveEndpointOutputSchemas = {
	filesList: FileListSchema,
	filesGet: FileSchema,
	filesCreateFromText: FileSchema,
	filesUpload: FileSchema,
	filesUpdate: FileSchema,
	filesDelete: z.void(),
	filesCopy: FileSchema,
	filesMove: FileSchema,
	filesDownload: z.any(),
	filesShare: PermissionSchema,
	foldersCreate: FileSchema,
	foldersGet: FileSchema,
	foldersList: FileListSchema,
	foldersDelete: z.void(),
	foldersShare: PermissionSchema,
	sharedDrivesCreate: SharedDriveSchema,
	sharedDrivesGet: SharedDriveSchema,
	sharedDrivesList: SharedDriveListSchema,
	sharedDrivesUpdate: SharedDriveSchema,
	sharedDrivesDelete: z.void(),
	searchFilesAndFolders: FileListSchema,
} as const;

export type GoogleDriveEndpointOutputs = {
	filesList: FileList;
	filesGet: File;
	filesCreateFromText: File;
	filesUpload: File;
	filesUpdate: File;
	filesDelete: void;
	filesCopy: File;
	filesMove: File;
	filesDownload: any;
	filesShare: Permission;
	foldersCreate: File;
	foldersGet: File;
	foldersList: FileList;
	foldersDelete: void;
	foldersShare: Permission;
	sharedDrivesCreate: SharedDrive;
	sharedDrivesGet: SharedDrive;
	sharedDrivesList: SharedDriveList;
	sharedDrivesUpdate: SharedDrive;
	sharedDrivesDelete: void;
	searchFilesAndFolders: FileList;
};
