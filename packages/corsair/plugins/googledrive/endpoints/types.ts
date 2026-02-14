import { z } from 'zod';
import type {
	File,
	FileList,
	Permission,
	SharedDrive,
	SharedDriveList,
} from '../types';

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
