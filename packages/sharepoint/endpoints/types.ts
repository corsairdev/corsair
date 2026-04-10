import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-schemas — Microsoft Graph API format
// ─────────────────────────────────────────────────────────────────────────────

const SharepointListSchema = z
	.object({
		id: z.string().optional(),
		displayName: z.string().optional(),
		description: z.string().optional(),
		webUrl: z.string().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		list: z
			.object({
				hidden: z.boolean().optional(),
				template: z.string().optional(),
				contentTypesEnabled: z.boolean().optional(),
			})
			.optional(),
	})
	.passthrough();

const SharepointItemSchema = z
	.object({
		id: z.string().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		webUrl: z.string().optional(),
		fields: z.record(z.unknown()).optional(),
		'@odata.etag': z.string().optional(),
	})
	.passthrough();

// Graph API DriveItem — used for both files and folders
const SharepointFileSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		webUrl: z.string().optional(),
		size: z.number().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		file: z.record(z.unknown()).optional(),
		folder: z.record(z.unknown()).optional(),
		parentReference: z.record(z.unknown()).optional(),
	})
	.passthrough();

const SharepointFolderSchema = SharepointFileSchema;

const SharepointUserSchema = z
	.object({
		id: z.string().optional(),
		displayName: z.string().optional(),
		mail: z.string().optional(),
		userPrincipalName: z.string().optional(),
		jobTitle: z.string().nullable().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Lists
// ─────────────────────────────────────────────────────────────────────────────

const ListsListAllInputSchema = z.object({});

const ListsListAllResponseSchema = z.object({
	value: z.array(SharepointListSchema).optional(),
});

const ListsGetByTitleInputSchema = z.object({
	list_title: z.string(),
});

const ListsGetByTitleResponseSchema = SharepointListSchema;

const ListsGetByGuidInputSchema = z.object({
	list_guid: z.string(),
});

const ListsGetByGuidResponseSchema = SharepointListSchema;

const ListsCreateInputSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	template: z.number().optional(),
	enable_versioning: z.boolean().optional(),
});

const ListsCreateResponseSchema = SharepointListSchema;

const ListsUpdateInputSchema = z.object({
	list_title: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	enable_versioning: z.boolean().optional(),
});

const ListsUpdateResponseSchema = z.object({
	success: z.boolean(),
});

const ListsDeleteInputSchema = z.object({
	list_guid: z.string(),
});

const ListsDeleteResponseSchema = z.object({
	success: z.boolean(),
});

const ListsDeleteByTitleInputSchema = z.object({
	list_title: z.string(),
});

const ListsDeleteByTitleResponseSchema = z.object({
	success: z.boolean(),
});

const ListsListColumnsInputSchema = z.object({
	list_title: z.string(),
});

const ListFieldSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		displayName: z.string().optional(),
		required: z.boolean().optional(),
		hidden: z.boolean().optional(),
		readOnly: z.boolean().optional(),
		defaultValue: z.string().nullable().optional(),
	})
	.passthrough();

const ListsListColumnsResponseSchema = z.object({
	value: z.array(ListFieldSchema).optional(),
});

const ListsGetChangesInputSchema = z.object({
	list_title: z.string(),
	change_token: z.string().optional(),
});

const ListsGetChangesResponseSchema = z.object({
	value: z.array(SharepointItemSchema).optional(),
	'@odata.deltaLink': z.string().optional(),
	'@odata.nextLink': z.string().optional(),
});

const ListsRenderDataAsStreamInputSchema = z.object({
	list_title: z.string(),
	view_xml: z.string().optional(),
	row_limit: z.number().optional(),
	paging_info: z.string().optional(),
});

const ListsRenderDataAsStreamResponseSchema = z
	.object({
		Row: z.array(z.record(z.unknown())).optional(),
		NextHref: z.string().optional(),
		PrevHref: z.string().optional(),
		FirstRow: z.number().optional(),
		LastRow: z.number().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Items
// ─────────────────────────────────────────────────────────────────────────────

const ItemsListInputSchema = z.object({
	list_title: z.string(),
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	order_by: z.string().optional(),
	top: z.number().optional(),
	skip: z.number().optional(),
});

const ItemsListResponseSchema = z.object({
	value: z.array(SharepointItemSchema).optional(),
});

const ItemsListByGuidInputSchema = z.object({
	list_guid: z.string(),
	filter: z.string().optional(),
	select: z.string().optional(),
	top: z.number().optional(),
	skip: z.number().optional(),
});

const ItemsListByGuidResponseSchema = z.object({
	value: z.array(SharepointItemSchema).optional(),
});

const ItemsGetInputSchema = z.object({
	list_title: z.string(),
	item_id: z.number(),
	select: z.string().optional(),
	expand: z.string().optional(),
});

const ItemsGetResponseSchema = SharepointItemSchema;

const ItemsCreateInputSchema = z.object({
	list_title: z.string(),
	fields: z.record(z.unknown()),
});

const ItemsCreateResponseSchema = SharepointItemSchema;

const ItemsCreateByGuidInputSchema = z.object({
	list_guid: z.string(),
	fields: z.record(z.unknown()),
});

const ItemsCreateByGuidResponseSchema = SharepointItemSchema;

const ItemsCreateInFolderInputSchema = z.object({
	list_title: z.string(),
	folder_path: z.string(),
	fields: z.record(z.unknown()),
});

const ItemsCreateInFolderResponseSchema = SharepointItemSchema;

const ItemsUpdateInputSchema = z.object({
	list_title: z.string(),
	item_id: z.number(),
	fields: z.record(z.unknown()),
	etag: z.string().optional(),
});

const ItemsUpdateResponseSchema = z.object({
	success: z.boolean(),
});

const ItemsDeleteInputSchema = z.object({
	list_title: z.string(),
	item_id: z.number(),
});

const ItemsDeleteResponseSchema = z.object({
	success: z.boolean(),
});

const ItemsRecycleInputSchema = z.object({
	list_title: z.string(),
	item_id: z.number(),
});

const ItemsRecycleResponseSchema = z.object({
	value: z.string().optional(),
});

const ItemsGetVersionInputSchema = z.object({
	list_title: z.string(),
	item_id: z.number(),
	version_id: z.number(),
});

const ItemsGetVersionResponseSchema = z
	.object({
		id: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		fields: z.record(z.unknown()).optional(),
	})
	.passthrough();

const ItemsGetEtagInputSchema = z.object({
	list_title: z.string(),
	item_id: z.number(),
});

const ItemsGetEtagResponseSchema = z.object({
	etag: z.string(),
});

const ItemsAddAttachmentInputSchema = z.object({
	item_id: z.number(),
	list_title: z.string(),
	file_name: z.string(),
	content_text: z.string().optional(),
	content_base64: z.string().optional(),
});

const ItemsAddAttachmentResponseSchema = z.object({
	FileName: z.string().optional(),
	ServerRelativeUrl: z.string().optional(),
});

const ItemsGetAttachmentContentInputSchema = z.object({
	list_title: z.string(),
	item_id: z.number(),
	file_name: z.string(),
});

const ItemsGetAttachmentContentResponseSchema = z.object({
	content: z.string().optional(),
	fileName: z.string().optional(),
});

const ItemsListAttachmentsInputSchema = z.object({
	list_title: z.string(),
	item_id: z.number(),
});

const AttachmentSchema = z
	.object({
		FileName: z.string().optional(),
		ServerRelativeUrl: z.string().optional(),
	})
	.passthrough();

const ItemsListAttachmentsResponseSchema = z.object({
	value: z.array(AttachmentSchema).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Files
// ─────────────────────────────────────────────────────────────────────────────

const FilesUploadInputSchema = z.object({
	folder_server_relative_url: z.string(),
	file_name: z.string(),
	content_text: z.string().optional(),
	content_base64: z.string().optional(),
	overwrite: z.boolean().optional(),
});

const FilesUploadResponseSchema = SharepointFileSchema;

const FilesDownloadInputSchema = z.object({
	server_relative_url: z.string(),
});

const FilesDownloadResponseSchema = z.object({
	content: z.string(),
	fileName: z.string().optional(),
	mimeType: z.string().optional(),
});

const FilesListInFolderInputSchema = z.object({
	folder_server_relative_url: z.string(),
	filter: z.string().optional(),
	select: z.string().optional(),
});

const FilesListInFolderResponseSchema = z.object({
	value: z.array(SharepointFileSchema).optional(),
});

const FilesRecycleInputSchema = z.object({
	server_relative_url: z.string(),
});

const FilesRecycleResponseSchema = z.object({
	value: z.string().optional(),
});

const FilesCheckInInputSchema = z.object({
	server_relative_path: z.string(),
	comment: z.string().optional(),
	checkintype: z.number().optional(),
});

const FilesCheckInResponseSchema = z.object({
	status: z.number().optional(),
	message: z.string().optional(),
	server_relative_path: z.string().optional(),
});

const FilesCheckOutInputSchema = z.object({
	server_relative_path: z.string(),
});

const FilesCheckOutResponseSchema = z.object({
	message: z.string().optional(),
	server_relative_path: z.string().optional(),
});

const FilesUndoCheckoutInputSchema = z.object({
	server_relative_path: z.string(),
});

const FilesUndoCheckoutResponseSchema = z.object({
	message: z.string().optional(),
	server_relative_path: z.string().optional(),
});

const FilesGetInputSchema = z.object({
	server_relative_url: z.string(),
});

const FilesGetResponseSchema = SharepointFileSchema;

// ─────────────────────────────────────────────────────────────────────────────
// Folders
// ─────────────────────────────────────────────────────────────────────────────

const FoldersCreateInputSchema = z.object({
	server_relative_url: z.string(),
});

const FoldersCreateResponseSchema = SharepointFolderSchema;

const FoldersGetInputSchema = z.object({
	server_relative_url: z.string(),
});

const FoldersGetResponseSchema = SharepointFolderSchema;

const FoldersGetAllInputSchema = z.object({
	list_title: z.string().optional(),
	server_relative_url: z.string().optional(),
});

const FoldersGetAllResponseSchema = z.object({
	value: z.array(SharepointFolderSchema).optional(),
});

const FoldersListSubfoldersInputSchema = z.object({
	server_relative_url: z.string(),
});

const FoldersListSubfoldersResponseSchema = z.object({
	value: z.array(SharepointFolderSchema).optional(),
});

const FoldersDeleteInputSchema = z.object({
	server_relative_url: z.string(),
});

const FoldersDeleteResponseSchema = z.object({
	success: z.boolean(),
});

const FoldersRenameInputSchema = z.object({
	server_relative_url: z.string(),
	new_name: z.string(),
});

const FoldersRenameResponseSchema = z.object({
	success: z.boolean(),
	new_server_relative_url: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────────────────────

const UsersGetCurrentInputSchema = z.object({});

const UsersGetCurrentResponseSchema = SharepointUserSchema;

const UsersCreateInputSchema = z.object({
	login_name: z.string(),
});

const UsersCreateResponseSchema = SharepointUserSchema;

const UsersFindInputSchema = z.object({
	search_value: z.string(),
});

const UsersFindResponseSchema = z.object({
	value: z.array(SharepointUserSchema).optional(),
});

const UsersRemoveInputSchema = z.object({
	login_name: z.string(),
});

const UsersRemoveResponseSchema = z.object({
	success: z.boolean(),
});

const UsersEnsureInputSchema = z.object({
	login_name: z.string(),
});

const UsersEnsureResponseSchema = SharepointUserSchema;

const UsersListSiteInputSchema = z.object({});

const UsersListSiteResponseSchema = z.object({
	value: z.array(SharepointUserSchema).optional(),
});

const GraphGroupSchema = z
	.object({
		id: z.string().optional(),
		displayName: z.string().optional(),
		description: z.string().optional(),
		mail: z.string().optional(),
	})
	.passthrough();

const UsersListGroupsInputSchema = z.object({});

const UsersListGroupsResponseSchema = z.object({
	value: z.array(GraphGroupSchema).optional(),
});

const UsersGetGroupUsersInputSchema = z.object({
	group_name: z.string(),
});

const UsersGetGroupUsersResponseSchema = z.object({
	value: z.array(SharepointUserSchema).optional(),
});

const UsersGetGroupUsersByIdInputSchema = z.object({
	group_id: z.number(),
});

const UsersGetGroupUsersByIdResponseSchema = z.object({
	value: z.array(SharepointUserSchema).optional(),
});

const UsersGetEffectivePermissionsInputSchema = z.object({
	user_login_name: z.string(),
});

const UsersGetEffectivePermissionsResponseSchema = SharepointUserSchema;

// ─────────────────────────────────────────────────────────────────────────────
// Search
// ─────────────────────────────────────────────────────────────────────────────

const SearchQueryInputSchema = z.object({
	query_text: z.string(),
	row_limit: z.number().optional(),
	start_row: z.number().optional(),
	select_properties: z.array(z.string()).optional(),
	refiners: z.string().optional(),
	refinement_filters: z.string().optional(),
	sort_list: z
		.array(z.object({ Property: z.string(), Direction: z.number() }))
		.optional(),
});

const SearchHitSchema = z
	.object({
		hitId: z.string().optional(),
		rank: z.number().optional(),
		summary: z.string().optional(),
		resource: z.record(z.unknown()).optional(),
	})
	.passthrough();

const SearchHitsContainerSchema = z.object({
	hits: z.array(SearchHitSchema).optional(),
	total: z.number().optional(),
	moreResultsAvailable: z.boolean().optional(),
});

const SearchQueryResponseSchema = z
	.object({
		value: z
			.array(
				z.object({
					searchTerms: z.array(z.string()).optional(),
					hitsContainers: z.array(SearchHitsContainerSchema).optional(),
				}),
			)
			.optional(),
	})
	.passthrough();

const SearchSuggestInputSchema = z.object({
	query_text: z.string(),
	show_people_name_suggestions: z.boolean().optional(),
	max_suggestion_results: z.number().optional(),
	is_prefix_match: z.boolean().optional(),
});

const SearchSuggestResponseSchema = z
	.object({
		value: z.array(z.record(z.unknown())).optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Content Types
// ─────────────────────────────────────────────────────────────────────────────

const ContentTypeSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		group: z.string().optional(),
		hidden: z.boolean().optional(),
	})
	.passthrough();

const ContentTypesGetInputSchema = z.object({
	content_type_id: z.string(),
});

const ContentTypesGetResponseSchema = ContentTypeSchema;

const ContentTypesGetAllInputSchema = z.object({});

const ContentTypesGetAllResponseSchema = z.object({
	value: z.array(ContentTypeSchema).optional(),
});

const ContentTypesGetForListInputSchema = z.object({
	list_title: z.string(),
});

const ContentTypesGetForListResponseSchema = z.object({
	value: z.array(ContentTypeSchema).optional(),
});

const ContentTypesGetByIdInputSchema = z.object({
	list_title: z.string(),
	content_type_id: z.string(),
});

const ContentTypesGetByIdResponseSchema = ContentTypeSchema;

const ContentTypesCreateInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	group: z.string().optional(),
	id: z.union([z.object({ StringValue: z.string() }), z.string()]).optional(),
});

const ContentTypesCreateResponseSchema = ContentTypeSchema;

const ContentTypesUpdateInputSchema = z.object({
	content_type_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	group: z.string().optional(),
});

const ContentTypesUpdateResponseSchema = z.object({
	success: z.boolean(),
});

const ContentTypesAddFieldLinkInputSchema = z.object({
	listid: z.string(),
	contenttypeid: z.string(),
	field_internal_name: z.string(),
	hidden: z.boolean().optional(),
	required: z.boolean().optional(),
});

const ContentTypesAddFieldLinkResponseSchema = z
	.object({
		field_link: z
			.object({
				Id: z.string().optional(),
				Name: z.string().optional(),
				Hidden: z.boolean().optional(),
				Required: z.boolean().optional(),
				FieldInternalName: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

const ContentTypesCreateListFieldInputSchema = z.object({
	list_title: z.string(),
	field_type: z.string(),
	internal_name: z.string(),
	display_name: z.string(),
	required: z.boolean().optional(),
	choices: z.array(z.string()).optional(),
	default_value: z.string().optional(),
});

const ContentTypesCreateListFieldResponseSchema = ListFieldSchema;

// ─────────────────────────────────────────────────────────────────────────────
// Permissions
// ─────────────────────────────────────────────────────────────────────────────

const PermissionsAddRoleToItemInputSchema = z.object({
	list_title: z.string(),
	item_id: z.number(),
	principal_id: z.number(),
	role_definition_id: z.number(),
});

const PermissionsAddRoleToItemResponseSchema = z.object({
	message: z.string().optional(),
	list_title: z.string().optional(),
	item_id: z.number().optional(),
	principal_id: z.number().optional(),
	role_definition_id: z.number().optional(),
});

const PermissionsAddRoleToListInputSchema = z.object({
	list_title: z.string(),
	principal_id: z.number(),
	role_definition_id: z.number(),
});

const PermissionsAddRoleToListResponseSchema = z.object({
	success: z.boolean().optional(),
	status_code: z.number().optional(),
});

const PermissionsBreakInheritanceOnItemInputSchema = z.object({
	list_title: z.string(),
	item_id: z.number(),
	copy_role_assignments: z.boolean().optional(),
	clear_subscopes: z.boolean().optional(),
});

const PermissionsBreakInheritanceOnItemResponseSchema = z.object({
	message: z.string().optional(),
});

const PermissionsBreakInheritanceOnListInputSchema = z.object({
	list_title: z.string(),
	copy_role_assignments: z.boolean(),
	clear_subscopes: z.boolean(),
});

const PermissionsBreakInheritanceOnListResponseSchema = z.object({
	message: z.string().optional(),
});

const RoleDefinitionSchema = z
	.object({
		id: z.union([z.number(), z.string()]).optional(),
		Name: z.string().optional(),
		Description: z.string().optional(),
	})
	.passthrough();

const PermissionsGetRoleDefinitionsInputSchema = z.object({});

const PermissionsGetRoleDefinitionsResponseSchema = z.object({
	value: z.array(RoleDefinitionSchema).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Web / Site
// ─────────────────────────────────────────────────────────────────────────────

const WebInfoSchema = z
	.object({
		id: z.string().optional(),
		displayName: z.string().optional(),
		description: z.string().optional(),
		webUrl: z.string().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		siteCollection: z.record(z.unknown()).optional(),
	})
	.passthrough();

const WebGetInfoInputSchema = z.object({});

const WebGetInfoResponseSchema = WebInfoSchema;

const WebGetSiteCollectionInfoInputSchema = z.object({});

const WebGetSiteCollectionInfoResponseSchema = WebInfoSchema;

const WebGetSitePageInputSchema = z.object({
	page_server_relative_url: z.string(),
});

const WebGetSitePageResponseSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		title: z.string().optional(),
		webUrl: z.string().optional(),
	})
	.passthrough();

const WebCreateSubsiteInputSchema = z.object({
	title: z.string(),
	url: z.string(),
	description: z.string().optional(),
	web_template: z.string().optional(),
	language: z.number().optional(),
	use_unique_permissions: z.boolean().optional(),
});

const WebCreateSubsiteResponseSchema = WebInfoSchema;

const WebUpdateSiteInputSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
});

const WebUpdateSiteResponseSchema = z.object({
	success: z.boolean(),
});

const WebGetContextInfoInputSchema = z.object({});

const WebGetContextInfoResponseSchema = z
	.object({
		FormDigestValue: z.string().optional(),
		FormDigestTimeoutSeconds: z.number().optional(),
		LibraryVersion: z.string().optional(),
		SiteFullUrl: z.string().optional(),
		WebFullUrl: z.string().optional(),
	})
	.passthrough();

const WebGetDriveItemByPathInputSchema = z.object({
	site_id: z.string(),
	path: z.string(),
});

const DriveItemSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		size: z.number().optional(),
		webUrl: z.string().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		file: z.record(z.unknown()).optional(),
		folder: z.record(z.unknown()).optional(),
	})
	.passthrough();

const WebGetDriveItemByPathResponseSchema = DriveItemSchema;

const WebLogEventInputSchema = z.object({
	entry_type: z.number(),
	event_code: z.number(),
	message: z.string(),
});

const WebLogEventResponseSchema = z.object({
	success: z.boolean(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Recycle Bin
// ─────────────────────────────────────────────────────────────────────────────

const RecycleBinItemSchema = z
	.object({
		Id: z.string().optional(),
		Title: z.string().optional(),
		DirName: z.string().optional(),
		LeafName: z.string().optional(),
		DeletedDate: z.string().optional(),
		DeletedByName: z.string().optional(),
		Size: z.string().optional(),
		ItemType: z.number().optional(),
	})
	.passthrough();

const RecycleBinListInputSchema = z.object({
	row_limit: z.number().optional(),
	is_ascending: z.boolean().optional(),
});

const RecycleBinListResponseSchema = z.object({
	value: z.array(RecycleBinItemSchema).optional(),
});

const RecycleBinRestoreInputSchema = z.object({
	item_id: z.string(),
});

const RecycleBinRestoreResponseSchema = z.object({
	success: z.boolean(),
});

const RecycleBinDeletePermanentInputSchema = z.object({
	item_id: z.string(),
});

const RecycleBinDeletePermanentResponseSchema = z.object({
	success: z.boolean(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Drive (Microsoft Graph)
// ─────────────────────────────────────────────────────────────────────────────

const DriveGetAnalyticsInputSchema = z.object({
	site_id: z.string(),
	item_id: z.string(),
});

const DriveGetAnalyticsResponseSchema = z
	.object({
		allTime: z
			.object({
				access: z
					.object({
						actionCount: z.number().optional(),
						actorCount: z.number().optional(),
					})
					.optional(),
			})
			.optional(),
	})
	.passthrough();

const DriveListRecentItemsInputSchema = z.object({
	site_id: z.string(),
});

const DriveListRecentItemsResponseSchema = z.object({
	value: z.array(DriveItemSchema).optional(),
});

const DriveRestoreVersionInputSchema = z.object({
	site_id: z.string(),
	item_id: z.string(),
	version_id: z.string(),
});

const DriveRestoreVersionResponseSchema = z.object({
	success: z.boolean(),
});

const DriveDeleteVersionInputSchema = z.object({
	site_id: z.string(),
	item_id: z.string(),
	version_id: z.string(),
});

const DriveDeleteVersionResponseSchema = z.object({
	success: z.boolean(),
});

const DriveCreateSharingLinkInputSchema = z.object({
	site_id: z.string(),
	item_id: z.string(),
	type: z.enum(['view', 'edit', 'embed']),
	scope: z.enum(['anonymous', 'organization', 'users']).optional(),
	expiration_date_time: z.string().optional(),
	password: z.string().optional(),
});

const DriveCreateSharingLinkResponseSchema = z
	.object({
		id: z.string().optional(),
		type: z.string().optional(),
		link: z
			.object({
				type: z.string().optional(),
				webUrl: z.string().optional(),
				scope: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

const DriveUpdateItemInputSchema = z.object({
	site_id: z.string(),
	item_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	parent_reference: z
		.object({ driveId: z.string().optional(), id: z.string().optional() })
		.optional(),
});

const DriveUpdateItemResponseSchema = DriveItemSchema;

// ─────────────────────────────────────────────────────────────────────────────
// Social / Follow
// ─────────────────────────────────────────────────────────────────────────────

const SocialFollowInputSchema = z.object({
	actor_type: z.number(),
	content_uri: z.string().optional(),
	id: z.string().optional(),
	tag_guid: z.string().optional(),
});

const SocialFollowResponseSchema = z.object({
	value: z.number().optional(),
});

const SocialIsFollowedInputSchema = z.object({
	actor_type: z.number(),
	content_uri: z.string().optional(),
	id: z.string().optional(),
	tag_guid: z.string().optional(),
});

const SocialIsFollowedResponseSchema = z.object({
	value: z.boolean().optional(),
});

const SocialActorSchema = z
	.object({
		AccountName: z.string().optional(),
		ActorType: z.number().optional(),
		ContentUri: z.string().optional(),
		Id: z.string().optional(),
		ImageUri: z.string().nullable().optional(),
		Name: z.string().optional(),
		StatusText: z.string().optional(),
		Uri: z.string().optional(),
	})
	.passthrough();

const SocialGetFollowedInputSchema = z.object({
	types: z.number().optional(),
});

const SocialGetFollowedResponseSchema = z.object({
	value: z.array(SocialActorSchema).optional(),
});

const SocialGetFollowersInputSchema = z.object({});

const SocialGetFollowersResponseSchema = z.object({
	value: z.array(SocialActorSchema).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Subscriptions
// ─────────────────────────────────────────────────────────────────────────────

const WebhookSubscriptionSchema = z
	.object({
		id: z.string().optional(),
		clientState: z.string().nullable().optional(),
		expirationDateTime: z.string().optional(),
		notificationUrl: z.string().optional(),
		resource: z.string().optional(),
	})
	.passthrough();

const WebhookSubscriptionsGetInputSchema = z.object({
	list_id: z.string(),
	subscription_id: z.string(),
});

const WebhookSubscriptionsGetResponseSchema = WebhookSubscriptionSchema;

const WebhookSubscriptionsGetAllInputSchema = z.object({
	list_id: z.string(),
});

const WebhookSubscriptionsGetAllResponseSchema = z.object({
	value: z.array(WebhookSubscriptionSchema).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Aggregated schemas
// ─────────────────────────────────────────────────────────────────────────────

export const SharepointEndpointInputSchemas = {
	listsListAll: ListsListAllInputSchema,
	listsGetByTitle: ListsGetByTitleInputSchema,
	listsGetByGuid: ListsGetByGuidInputSchema,
	listsCreate: ListsCreateInputSchema,
	listsUpdate: ListsUpdateInputSchema,
	listsDelete: ListsDeleteInputSchema,
	listsDeleteByTitle: ListsDeleteByTitleInputSchema,
	listsListColumns: ListsListColumnsInputSchema,
	listsGetChanges: ListsGetChangesInputSchema,
	listsRenderDataAsStream: ListsRenderDataAsStreamInputSchema,
	itemsList: ItemsListInputSchema,
	itemsListByGuid: ItemsListByGuidInputSchema,
	itemsGet: ItemsGetInputSchema,
	itemsCreate: ItemsCreateInputSchema,
	itemsCreateByGuid: ItemsCreateByGuidInputSchema,
	itemsCreateInFolder: ItemsCreateInFolderInputSchema,
	itemsUpdate: ItemsUpdateInputSchema,
	itemsDelete: ItemsDeleteInputSchema,
	itemsRecycle: ItemsRecycleInputSchema,
	itemsGetVersion: ItemsGetVersionInputSchema,
	itemsGetEtag: ItemsGetEtagInputSchema,
	itemsAddAttachment: ItemsAddAttachmentInputSchema,
	itemsGetAttachmentContent: ItemsGetAttachmentContentInputSchema,
	itemsListAttachments: ItemsListAttachmentsInputSchema,
	filesUpload: FilesUploadInputSchema,
	filesDownload: FilesDownloadInputSchema,
	filesListInFolder: FilesListInFolderInputSchema,
	filesRecycle: FilesRecycleInputSchema,
	filesCheckIn: FilesCheckInInputSchema,
	filesCheckOut: FilesCheckOutInputSchema,
	filesUndoCheckout: FilesUndoCheckoutInputSchema,
	filesGet: FilesGetInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersGet: FoldersGetInputSchema,
	foldersGetAll: FoldersGetAllInputSchema,
	foldersListSubfolders: FoldersListSubfoldersInputSchema,
	foldersDelete: FoldersDeleteInputSchema,
	foldersRename: FoldersRenameInputSchema,
	usersGetCurrent: UsersGetCurrentInputSchema,
	usersCreate: UsersCreateInputSchema,
	usersFind: UsersFindInputSchema,
	usersRemove: UsersRemoveInputSchema,
	usersEnsure: UsersEnsureInputSchema,
	usersListSite: UsersListSiteInputSchema,
	usersListGroups: UsersListGroupsInputSchema,
	usersGetGroupUsers: UsersGetGroupUsersInputSchema,
	usersGetGroupUsersById: UsersGetGroupUsersByIdInputSchema,
	usersGetEffectivePermissions: UsersGetEffectivePermissionsInputSchema,
	searchQuery: SearchQueryInputSchema,
	searchSuggest: SearchSuggestInputSchema,
	contentTypesGet: ContentTypesGetInputSchema,
	contentTypesGetAll: ContentTypesGetAllInputSchema,
	contentTypesGetForList: ContentTypesGetForListInputSchema,
	contentTypesGetById: ContentTypesGetByIdInputSchema,
	contentTypesCreate: ContentTypesCreateInputSchema,
	contentTypesUpdate: ContentTypesUpdateInputSchema,
	contentTypesAddFieldLink: ContentTypesAddFieldLinkInputSchema,
	contentTypesCreateListField: ContentTypesCreateListFieldInputSchema,
	permissionsAddRoleToItem: PermissionsAddRoleToItemInputSchema,
	permissionsAddRoleToList: PermissionsAddRoleToListInputSchema,
	permissionsBreakInheritanceOnItem:
		PermissionsBreakInheritanceOnItemInputSchema,
	permissionsBreakInheritanceOnList:
		PermissionsBreakInheritanceOnListInputSchema,
	permissionsGetRoleDefinitions: PermissionsGetRoleDefinitionsInputSchema,
	webGetInfo: WebGetInfoInputSchema,
	webGetSiteCollectionInfo: WebGetSiteCollectionInfoInputSchema,
	webGetSitePage: WebGetSitePageInputSchema,
	webCreateSubsite: WebCreateSubsiteInputSchema,
	webUpdateSite: WebUpdateSiteInputSchema,
	webGetContextInfo: WebGetContextInfoInputSchema,
	webGetDriveItemByPath: WebGetDriveItemByPathInputSchema,
	webLogEvent: WebLogEventInputSchema,
	recycleBinList: RecycleBinListInputSchema,
	recycleBinRestore: RecycleBinRestoreInputSchema,
	recycleBinDeletePermanent: RecycleBinDeletePermanentInputSchema,
	driveGetAnalytics: DriveGetAnalyticsInputSchema,
	driveListRecentItems: DriveListRecentItemsInputSchema,
	driveRestoreVersion: DriveRestoreVersionInputSchema,
	driveDeleteVersion: DriveDeleteVersionInputSchema,
	driveCreateSharingLink: DriveCreateSharingLinkInputSchema,
	driveUpdateItem: DriveUpdateItemInputSchema,
	socialFollow: SocialFollowInputSchema,
	socialIsFollowed: SocialIsFollowedInputSchema,
	socialGetFollowed: SocialGetFollowedInputSchema,
	socialGetFollowers: SocialGetFollowersInputSchema,
	webhookSubscriptionsGet: WebhookSubscriptionsGetInputSchema,
	webhookSubscriptionsGetAll: WebhookSubscriptionsGetAllInputSchema,
} as const;

export type SharepointEndpointInputs = {
	[K in keyof typeof SharepointEndpointInputSchemas]: z.infer<
		(typeof SharepointEndpointInputSchemas)[K]
	>;
};

export const SharepointEndpointOutputSchemas = {
	listsListAll: ListsListAllResponseSchema,
	listsGetByTitle: ListsGetByTitleResponseSchema,
	listsGetByGuid: ListsGetByGuidResponseSchema,
	listsCreate: ListsCreateResponseSchema,
	listsUpdate: ListsUpdateResponseSchema,
	listsDelete: ListsDeleteResponseSchema,
	listsDeleteByTitle: ListsDeleteByTitleResponseSchema,
	listsListColumns: ListsListColumnsResponseSchema,
	listsGetChanges: ListsGetChangesResponseSchema,
	listsRenderDataAsStream: ListsRenderDataAsStreamResponseSchema,
	itemsList: ItemsListResponseSchema,
	itemsListByGuid: ItemsListByGuidResponseSchema,
	itemsGet: ItemsGetResponseSchema,
	itemsCreate: ItemsCreateResponseSchema,
	itemsCreateByGuid: ItemsCreateByGuidResponseSchema,
	itemsCreateInFolder: ItemsCreateInFolderResponseSchema,
	itemsUpdate: ItemsUpdateResponseSchema,
	itemsDelete: ItemsDeleteResponseSchema,
	itemsRecycle: ItemsRecycleResponseSchema,
	itemsGetVersion: ItemsGetVersionResponseSchema,
	itemsGetEtag: ItemsGetEtagResponseSchema,
	itemsAddAttachment: ItemsAddAttachmentResponseSchema,
	itemsGetAttachmentContent: ItemsGetAttachmentContentResponseSchema,
	itemsListAttachments: ItemsListAttachmentsResponseSchema,
	filesUpload: FilesUploadResponseSchema,
	filesDownload: FilesDownloadResponseSchema,
	filesListInFolder: FilesListInFolderResponseSchema,
	filesRecycle: FilesRecycleResponseSchema,
	filesCheckIn: FilesCheckInResponseSchema,
	filesCheckOut: FilesCheckOutResponseSchema,
	filesUndoCheckout: FilesUndoCheckoutResponseSchema,
	filesGet: FilesGetResponseSchema,
	foldersCreate: FoldersCreateResponseSchema,
	foldersGet: FoldersGetResponseSchema,
	foldersGetAll: FoldersGetAllResponseSchema,
	foldersListSubfolders: FoldersListSubfoldersResponseSchema,
	foldersDelete: FoldersDeleteResponseSchema,
	foldersRename: FoldersRenameResponseSchema,
	usersGetCurrent: UsersGetCurrentResponseSchema,
	usersCreate: UsersCreateResponseSchema,
	usersFind: UsersFindResponseSchema,
	usersRemove: UsersRemoveResponseSchema,
	usersEnsure: UsersEnsureResponseSchema,
	usersListSite: UsersListSiteResponseSchema,
	usersListGroups: UsersListGroupsResponseSchema,
	usersGetGroupUsers: UsersGetGroupUsersResponseSchema,
	usersGetGroupUsersById: UsersGetGroupUsersByIdResponseSchema,
	usersGetEffectivePermissions: UsersGetEffectivePermissionsResponseSchema,
	searchQuery: SearchQueryResponseSchema,
	searchSuggest: SearchSuggestResponseSchema,
	contentTypesGet: ContentTypesGetResponseSchema,
	contentTypesGetAll: ContentTypesGetAllResponseSchema,
	contentTypesGetForList: ContentTypesGetForListResponseSchema,
	contentTypesGetById: ContentTypesGetByIdResponseSchema,
	contentTypesCreate: ContentTypesCreateResponseSchema,
	contentTypesUpdate: ContentTypesUpdateResponseSchema,
	contentTypesAddFieldLink: ContentTypesAddFieldLinkResponseSchema,
	contentTypesCreateListField: ContentTypesCreateListFieldResponseSchema,
	permissionsAddRoleToItem: PermissionsAddRoleToItemResponseSchema,
	permissionsAddRoleToList: PermissionsAddRoleToListResponseSchema,
	permissionsBreakInheritanceOnItem:
		PermissionsBreakInheritanceOnItemResponseSchema,
	permissionsBreakInheritanceOnList:
		PermissionsBreakInheritanceOnListResponseSchema,
	permissionsGetRoleDefinitions: PermissionsGetRoleDefinitionsResponseSchema,
	webGetInfo: WebGetInfoResponseSchema,
	webGetSiteCollectionInfo: WebGetSiteCollectionInfoResponseSchema,
	webGetSitePage: WebGetSitePageResponseSchema,
	webCreateSubsite: WebCreateSubsiteResponseSchema,
	webUpdateSite: WebUpdateSiteResponseSchema,
	webGetContextInfo: WebGetContextInfoResponseSchema,
	webGetDriveItemByPath: WebGetDriveItemByPathResponseSchema,
	webLogEvent: WebLogEventResponseSchema,
	recycleBinList: RecycleBinListResponseSchema,
	recycleBinRestore: RecycleBinRestoreResponseSchema,
	recycleBinDeletePermanent: RecycleBinDeletePermanentResponseSchema,
	driveGetAnalytics: DriveGetAnalyticsResponseSchema,
	driveListRecentItems: DriveListRecentItemsResponseSchema,
	driveRestoreVersion: DriveRestoreVersionResponseSchema,
	driveDeleteVersion: DriveDeleteVersionResponseSchema,
	driveCreateSharingLink: DriveCreateSharingLinkResponseSchema,
	driveUpdateItem: DriveUpdateItemResponseSchema,
	socialFollow: SocialFollowResponseSchema,
	socialIsFollowed: SocialIsFollowedResponseSchema,
	socialGetFollowed: SocialGetFollowedResponseSchema,
	socialGetFollowers: SocialGetFollowersResponseSchema,
	webhookSubscriptionsGet: WebhookSubscriptionsGetResponseSchema,
	webhookSubscriptionsGetAll: WebhookSubscriptionsGetAllResponseSchema,
} as const;

export type SharepointEndpointOutputs = {
	[K in keyof typeof SharepointEndpointOutputSchemas]: z.infer<
		(typeof SharepointEndpointOutputSchemas)[K]
	>;
};

// Named response type exports
export type ListsListAllResponse = z.infer<typeof ListsListAllResponseSchema>;
export type ListsGetByTitleResponse = z.infer<
	typeof ListsGetByTitleResponseSchema
>;
export type ListsGetByGuidResponse = z.infer<
	typeof ListsGetByGuidResponseSchema
>;
export type ListsCreateResponse = z.infer<typeof ListsCreateResponseSchema>;
export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>;
export type ItemsGetResponse = z.infer<typeof ItemsGetResponseSchema>;
export type ItemsCreateResponse = z.infer<typeof ItemsCreateResponseSchema>;
export type FilesUploadResponse = z.infer<typeof FilesUploadResponseSchema>;
export type FilesDownloadResponse = z.infer<typeof FilesDownloadResponseSchema>;
export type FoldersCreateResponse = z.infer<typeof FoldersCreateResponseSchema>;
export type UsersGetCurrentResponse = z.infer<
	typeof UsersGetCurrentResponseSchema
>;
export type SearchQueryResponse = z.infer<typeof SearchQueryResponseSchema>;
export type WebGetInfoResponse = z.infer<typeof WebGetInfoResponseSchema>;
