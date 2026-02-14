export type FileCapabilities = {
	canAddChildren?: boolean;
	canChangeCopyRequiresWriterPermission?: boolean;
	canChangeViewersCanCopyContent?: boolean;
	canComment?: boolean;
	canCopy?: boolean;
	canDelete?: boolean;
	canDeleteChildren?: boolean;
	canDownload?: boolean;
	canEdit?: boolean;
	canListChildren?: boolean;
	canModifyContent?: boolean;
	canModifyContentRestriction?: boolean;
	canMoveChildrenOutOfDrive?: boolean;
	canMoveChildrenOutOfTeamDrive?: boolean;
	canMoveChildrenWithinDrive?: boolean;
	canMoveItemIntoTeamDrive?: boolean;
	canMoveItemOutOfDrive?: boolean;
	canMoveItemWithinDrive?: boolean;
	canReadRevisions?: boolean;
	canReadTeamDrive?: boolean;
	canRemoveChildren?: boolean;
	canRename?: boolean;
	canShare?: boolean;
	canTrash?: boolean;
	canTrashChildren?: boolean;
	canUntrash?: boolean;
};

export type FileContentHints = {
	indexableText?: string;
	thumbnail?: {
		image?: string;
		mimeType?: string;
	};
};

export type FileImageMediaMetadata = {
	width?: number;
	height?: number;
	rotation?: number;
	location?: {
		latitude?: number;
		longitude?: number;
		altitude?: number;
	};
	time?: string;
	cameraMake?: string;
	cameraModel?: string;
	exposureTime?: number;
	fNumber?: number;
	isoSpeed?: number;
	exposureBias?: number;
	maxApertureValue?: number;
	focalLength?: number;
	focalLength35mm?: number;
	lens?: string;
	colorSpace?: string;
	subjectDistance?: number;
	meteringMode?: string;
	sensor?: string;
	flashUsed?: boolean;
	exposureMode?: string;
	whiteBalance?: string;
};

export type FileVideoMediaMetadata = {
	width?: number;
	height?: number;
	durationMillis?: number;
};

export type FileShortcutDetails = {
	targetId?: string;
	targetMimeType?: string;
};

export type FileContentRestriction = {
	readOnly?: boolean;
	reason?: string;
	restrictingUser?: {
		kind?: string;
		displayName?: string;
		photoLink?: string;
		me?: boolean;
		permissionId?: string;
		emailAddress?: string;
	};
	restrictionTime?: string;
	type?: string;
};

export type File = {
	id?: string;
	name?: string;
	mimeType?: string;
	description?: string;
	starred?: boolean;
	trashed?: boolean;
	explicitlyTrashed?: boolean;
	parents?: string[];
	properties?: Record<string, string>;
	appProperties?: Record<string, string>;
	spaces?: string[];
	version?: string;
	webViewLink?: string;
	webContentLink?: string;
	iconLink?: string;
	hasThumbnail?: boolean;
	thumbnailLink?: string;
	thumbnailVersion?: string;
	viewedByMe?: boolean;
	viewedByMeTime?: string;
	createdTime?: string;
	modifiedTime?: string;
	modifiedByMeTime?: string;
	modifiedByMe?: boolean;
	shared?: boolean;
	ownedByMe?: boolean;
	capabilities?: FileCapabilities;
	viewersCanCopyContent?: boolean;
	copyRequiresWriterPermission?: boolean;
	writersCanShare?: boolean;
	permissions?: Permission[];
	permissionIds?: string[];
	hasAugmentedPermissions?: boolean;
	folderColorRgb?: string;
	originalFilename?: string;
	fullFileExtension?: string;
	fileExtension?: string;
	md5Checksum?: string;
	size?: string;
	quotaBytesUsed?: string;
	headRevisionId?: string;
	contentHints?: FileContentHints;
	imageMediaMetadata?: FileImageMediaMetadata;
	videoMediaMetadata?: FileVideoMediaMetadata;
	isAppAuthorized?: boolean;
	exportLinks?: Record<string, string>;
	shortcutDetails?: FileShortcutDetails;
	contentRestriction?: FileContentRestriction;
	resourceKey?: string;
	linkShareMetadata?: {
		securityUpdateEligible?: boolean;
		securityUpdateEnabled?: boolean;
	};
	sha1Checksum?: string;
	sha256Checksum?: string;
};

export type FileList = {
	kind?: string;
	nextPageToken?: string;
	incompleteSearch?: boolean;
	files?: File[];
};

export type Permission = {
	id?: string;
	type?: 'user' | 'group' | 'domain' | 'anyone';
	emailAddress?: string;
	domain?: string;
	role?:
		| 'owner'
		| 'organizer'
		| 'fileOrganizer'
		| 'writer'
		| 'commenter'
		| 'reader';
	allowFileDiscovery?: boolean;
	displayName?: string;
	photoLink?: string;
	expirationTime?: string;
	teamDrivePermissionDetails?: Array<{
		teamDrivePermissionType?: 'file' | 'member';
		role?: 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
		inheritedFrom?: string;
		inherited?: boolean;
	}>;
	deleted?: boolean;
	view?: 'user' | 'domain';
	pendingOwner?: boolean;
};

export type PermissionList = {
	kind?: string;
	nextPageToken?: string;
	permissions?: Permission[];
};

export type Change = {
	kind?: string;
	type?: 'file' | 'drive' | 'driveTrash' | 'teamDrive';
	changeType?: 'file' | 'drive' | 'driveTrash' | 'teamDrive';
	time?: string;
	removed?: boolean;
	fileId?: string;
	file?: File;
	driveId?: string;
	drive?: SharedDrive;
	teamDriveId?: string;
	teamDrive?: SharedDrive;
};

export type ChangeList = {
	kind?: string;
	newStartPageToken?: string;
	nextPageToken?: string;
	changes?: Change[];
};

export type SharedDrive = {
	kind?: string;
	id?: string;
	name?: string;
	themeId?: string;
	colorRgb?: string;
	capabilities?: {
		canAddChildren?: boolean;
		canChangeCopyRequiresWriterPermissionRestriction?: boolean;
		canChangeDomainUsersOnlyRestriction?: boolean;
		canChangeDriveBackground?: boolean;
		canChangeDriveMembersOnlyRestriction?: boolean;
		canComment?: boolean;
		canCopy?: boolean;
		canDeleteChildren?: boolean;
		canDeleteDrive?: boolean;
		canDownload?: boolean;
		canEdit?: boolean;
		canListChildren?: boolean;
		canManageMembers?: boolean;
		canReadRevisions?: boolean;
		canRename?: boolean;
		canRenameDrive?: boolean;
		canShare?: boolean;
		canTrashChildren?: boolean;
	};
	createdTime?: string;
	hidden?: boolean;
	restrictions?: {
		adminManagedRestrictions?: boolean;
		copyRequiresWriterPermission?: boolean;
		domainUsersOnly?: boolean;
		driveMembersOnly?: boolean;
	};
};

export type SharedDriveList = {
	kind?: string;
	nextPageToken?: string;
	drives?: SharedDrive[];
};

export type CreateFileRequest = {
	name?: string;
	mimeType?: string;
	parents?: string[];
	description?: string;
	starred?: boolean;
	properties?: Record<string, string>;
	appProperties?: Record<string, string>;
};

export type UpdateFileRequest = {
	name?: string;
	description?: string;
	starred?: boolean;
	trashed?: boolean;
	parents?: string[];
	properties?: Record<string, string>;
	appProperties?: Record<string, string>;
};

export type CopyFileRequest = {
	name?: string;
	parents?: string[];
};

export type CreatePermissionRequest = {
	type?: 'user' | 'group' | 'domain' | 'anyone';
	role?:
		| 'owner'
		| 'organizer'
		| 'fileOrganizer'
		| 'writer'
		| 'commenter'
		| 'reader';
	emailAddress?: string;
	domain?: string;
	allowFileDiscovery?: boolean;
	expirationTime?: string;
	sendNotificationEmail?: boolean;
	emailMessage?: string;
};

export type CreateSharedDriveRequest = {
	name?: string;
	themeId?: string;
	colorRgb?: string;
	restrictions?: {
		adminManagedRestrictions?: boolean;
		copyRequiresWriterPermission?: boolean;
		domainUsersOnly?: boolean;
		driveMembersOnly?: boolean;
	};
};

export type UpdateSharedDriveRequest = {
	name?: string;
	themeId?: string;
	colorRgb?: string;
	restrictions?: {
		adminManagedRestrictions?: boolean;
		copyRequiresWriterPermission?: boolean;
		domainUsersOnly?: boolean;
		driveMembersOnly?: boolean;
	};
};
