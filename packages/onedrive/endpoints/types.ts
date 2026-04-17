import { z } from 'zod';

// ── Shared Sub-Schemas ────────────────────────────────────────────────────────

// A single identity principal (user, app, or device)
const IdentitySchema = z
	.object({
		id: z.string().optional(),
		displayName: z.string().optional(),
	})
	.passthrough();

// Microsoft Graph identitySet: user/application/device
const IdentitySetSchema = z
	.object({
		user: IdentitySchema.optional(),
		application: IdentitySchema.optional(),
		device: IdentitySchema.optional(),
	})
	.passthrough();

// SharePoint-extended identity set (adds siteUser / siteGroup / group)
const SiteUserSchema = z
	.object({
		id: z.string().optional(),
		displayName: z.string().optional(),
		loginName: z.string().optional(),
		email: z.string().optional(),
	})
	.passthrough();

const SiteGroupSchema = z
	.object({
		id: z.string().optional(),
		displayName: z.string().optional(),
		loginName: z.string().optional(),
	})
	.passthrough();

const IdentityRefSchema = IdentitySetSchema.extend({
	siteUser: SiteUserSchema.optional(),
	siteGroup: SiteGroupSchema.optional(),
	group: IdentitySchema.optional(),
});

// Sharing link returned inside a Permission
const SharingLinkSchema = z
	.object({
		type: z.string().optional(),
		scope: z.string().optional(),
		webUrl: z.string().optional(),
		webHtml: z.string().optional(),
		preventsDownload: z.boolean().optional(),
		application: IdentitySchema.optional(),
	})
	.passthrough();

// Thumbnail entry (large/medium/small/source inside a ThumbnailSet)
const ThumbnailSchema = z
	.object({
		height: z.number().optional(),
		width: z.number().optional(),
		url: z.string().optional(),
		content: z.string().optional(),
	})
	.passthrough();

// ThumbnailSet — one element of the thumbnails value array
const ThumbnailSetSchema = z
	.object({
		id: z.string().optional(),
		large: ThumbnailSchema.optional(),
		medium: ThumbnailSchema.optional(),
		small: ThumbnailSchema.optional(),
		source: ThumbnailSchema.optional(),
	})
	.passthrough();

// DriveItem version entry
const DriveItemVersionSchema = z
	.object({
		id: z.string(),
		lastModifiedDateTime: z.string().optional(),
		size: z.number().optional(),
		lastModifiedBy: IdentitySetSchema.optional(),
		published: z
			.object({
				level: z.string().optional(),
				versionId: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

// Item activity entry
const ItemActivitySchema = z
	.object({
		id: z.string().optional(),
		// action sub-types vary; capture the known keys, passthrough the rest
		action: z
			.object({
				comment: z.record(z.unknown()).optional(),
				create: z.record(z.unknown()).optional(),
				delete: z.record(z.unknown()).optional(),
				edit: z.record(z.unknown()).optional(),
				mention: z.record(z.unknown()).optional(),
				move: z.record(z.unknown()).optional(),
				rename: z.record(z.unknown()).optional(),
				restore: z.record(z.unknown()).optional(),
				share: z.record(z.unknown()).optional(),
				version: z.record(z.unknown()).optional(),
			})
			.passthrough()
			.optional(),
		actor: IdentitySetSchema.optional(),
		times: z
			.object({ recordedTime: z.string().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();

// Microsoft Graph subscription resource
const SubscriptionSchema = z
	.object({
		id: z.string().optional(),
		resource: z.string().nullable().optional(),
		changeType: z.string().nullable().optional(),
		clientState: z.string().nullable().optional(),
		notificationUrl: z.string().nullable().optional(),
		expirationDateTime: z.string().nullable().optional(),
		applicationId: z.string().nullable().optional(),
		creatorId: z.string().nullable().optional(),
		notificationQueryOptions: z.string().nullable().optional(),
		lifecycleNotificationUrl: z.string().nullable().optional(),
	})
	.passthrough();

// SharePoint-specific site IDs facet
const SharepointIdsSchema = z
	.object({
		siteId: z.string().optional(),
		siteUrl: z.string().optional(),
		webId: z.string().optional(),
		webUrl: z.string().optional(),
		listId: z.string().optional(),
		tenantId: z.string().optional(),
	})
	.passthrough();

// SharePoint site collection facet
const SiteCollectionSchema = z
	.object({
		hostname: z.string().optional(),
		dataLocationCode: z.string().optional(),
		root: z.object({}).passthrough().optional(),
	})
	.passthrough();

// SharePoint list object (returned by listSiteLists)
const SharepointListSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		displayName: z.string().optional(),
		description: z.string().optional(),
		webUrl: z.string().optional(),
		eTag: z.string().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		createdBy: IdentitySetSchema.optional(),
		lastModifiedBy: IdentitySetSchema.optional(),
		list: z
			.object({
				hidden: z.boolean().optional(),
				template: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

// SharePoint list item (fields are dynamic per list — typed as passthrough)
const SharepointListItemSchema = z
	.object({
		id: z.string().optional(),
		eTag: z.string().optional(),
		webUrl: z.string().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		contentType: z
			.object({
				id: z.string().optional(),
				name: z.string().optional(),
			})
			.passthrough()
			.optional(),
		fields: z.record(z.unknown()).optional(),
		createdBy: IdentitySetSchema.optional(),
		lastModifiedBy: IdentitySetSchema.optional(),
	})
	.passthrough();

// SharePoint column definition (type-specific facets use passthrough)
const ColumnDefinitionSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		displayName: z.string().optional(),
		description: z.string().optional(),
		columnGroup: z.string().optional(),
		indexed: z.boolean().optional(),
		readOnly: z.boolean().optional(),
		required: z.boolean().optional(),
		hidden: z.boolean().optional(),
		enforceUniqueValues: z.boolean().optional(),
		boolean: z.object({}).passthrough().optional(),
		text: z
			.object({
				allowMultipleLines: z.boolean().optional(),
				maxLength: z.number().optional(),
				textType: z.string().optional(),
			})
			.passthrough()
			.optional(),
		number: z
			.object({
				decimalPlaces: z.string().optional(),
				displayAs: z.string().optional(),
				maximum: z.number().optional(),
				minimum: z.number().optional(),
			})
			.passthrough()
			.optional(),
		dateTime: z
			.object({
				displayAs: z.string().optional(),
				format: z.string().optional(),
			})
			.passthrough()
			.optional(),
		choice: z
			.object({
				allowTextEntry: z.boolean().optional(),
				choices: z.array(z.string()).optional(),
				displayAs: z.string().optional(),
			})
			.passthrough()
			.optional(),
		lookup: z
			.object({
				allowMultipleValues: z.boolean().optional(),
				columnName: z.string().optional(),
				listId: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

// DriveItem base (without children to avoid circular reference at the schema level)
const DriveItemBaseSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		size: z.number().optional(),
		webUrl: z.string().optional(),
		eTag: z.string().optional(),
		cTag: z.string().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		createdBy: IdentitySetSchema.optional(),
		lastModifiedBy: IdentitySetSchema.optional(),
		parentReference: z
			.object({
				driveId: z.string().optional(),
				id: z.string().optional(),
				path: z.string().optional(),
				name: z.string().optional(),
				siteId: z.string().optional(),
			})
			.passthrough()
			.optional(),
		file: z
			.object({
				mimeType: z.string().optional(),
				hashes: z
					.object({
						quickXorHash: z.string().optional(),
						sha1Hash: z.string().optional(),
						sha256Hash: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		folder: z
			.object({
				childCount: z.number().optional(),
			})
			.passthrough()
			.optional(),
		deleted: z
			.object({
				state: z.string().optional(),
			})
			.passthrough()
			.optional(),
		'@microsoft.graph.downloadUrl': z.string().optional(),
	})
	.passthrough();

// Full DriveItem — adds one level of children (covers all real API use cases)
const DriveItemSchema = DriveItemBaseSchema.extend({
	children: z.array(DriveItemBaseSchema).optional(),
});

const DriveSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		driveType: z.string().optional(),
		webUrl: z.string().optional(),
		description: z.string().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		owner: IdentitySetSchema.optional(),
		quota: z
			.object({
				deleted: z.number().optional(),
				remaining: z.number().optional(),
				total: z.number().optional(),
				used: z.number().optional(),
				state: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const PermissionSchema = z
	.object({
		id: z.string().optional(),
		link: SharingLinkSchema.optional(),
		roles: z.array(z.string()).optional(),
		grantedTo: IdentityRefSchema.optional(),
		grantedToV2: IdentityRefSchema.optional(),
		hasPassword: z.boolean().optional(),
		expirationDateTime: z.string().optional(),
	})
	.passthrough();

// ── Items Input Schemas ───────────────────────────────────────────────────────

const ItemsGetInputSchema = z.object({
	item_id: z.string(),
	drive_id: z.string().optional(),
	select_fields: z.array(z.string()).optional(),
	expand_relations: z.array(z.string()).optional(),
});

export type ItemsGetInput = z.infer<typeof ItemsGetInputSchema>;

const ItemsUpdateMetadataInputSchema = z.object({
	item_id: z.string(),
	drive_id: z.string().optional(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	group_id: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	ifMatch: z.string().optional(),
	fileSystemInfo: z
		.object({
			createdDateTime: z.string().optional(),
			lastAccessedDateTime: z.string().optional(),
			lastModifiedDateTime: z.string().optional(),
		})
		.optional(),
	parent_reference_id: z.string().optional(),
	parent_reference_drive_id: z.string().optional(),
	// any/unknown for additional_properties since they are arbitrary key-value pairs
	additional_properties: z.record(z.unknown()).optional(),
});

export type ItemsUpdateMetadataInput = z.infer<
	typeof ItemsUpdateMetadataInputSchema
>;

const ItemsDeleteInputSchema = z.object({
	item_id: z.string(),
	if_match: z.string().optional(),
});

export type ItemsDeleteInput = z.infer<typeof ItemsDeleteInputSchema>;

const ItemsDeletePermanentlyInputSchema = z.object({
	item_id: z.string(),
	drive_id: z.string(),
});

export type ItemsDeletePermanentlyInput = z.infer<
	typeof ItemsDeletePermanentlyInputSchema
>;

const ItemsCopyInputSchema = z.object({
	item_id: z.string(),
	name: z.string().optional(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	drive_id: z.string().optional(),
	group_id: z.string().optional(),
	children_only: z.boolean().optional(),
	parent_reference: z
		.object({
			id: z.string().optional(),
			driveId: z.string().optional(),
		})
		.optional(),
	conflict_behavior: z.enum(['fail', 'replace', 'rename']).optional(),
	include_all_version_history: z.boolean().optional(),
});

export type ItemsCopyInput = z.infer<typeof ItemsCopyInputSchema>;

const ItemsMoveInputSchema = z.object({
	itemId: z.string(),
	parentReference: z.object({
		id: z.string(),
		driveId: z.string(),
	}),
	name: z.string().optional(),
	siteId: z.string().optional(),
	userId: z.string().optional(),
	driveId: z.string().optional(),
	groupId: z.string().optional(),
	description: z.string().optional(),
});

export type ItemsMoveInput = z.infer<typeof ItemsMoveInputSchema>;

const ItemsRestoreInputSchema = z.object({
	item_id: z.string(),
	name: z.string().optional(),
	parent_reference_id: z.string().optional(),
});

export type ItemsRestoreInput = z.infer<typeof ItemsRestoreInputSchema>;

const ItemsSearchInputSchema = z.object({
	q: z.string(),
	top: z.number().optional(),
	expand: z.string().optional(),
	select: z.string().optional(),
	orderby: z.string().optional(),
	drive_id: z.string().optional(),
	skip_token: z.string().optional(),
	search_scope: z.enum(['drive', 'root']).optional(),
	stripped_annotations: z.array(z.string()).optional(),
	transformed_path_query: z.string().optional(),
	transformed_kql_operator: z.string().optional(),
	transformed_parent_query: z.string().optional(),
	transformed_wildcard_query: z.string().optional(),
});

export type ItemsSearchInput = z.infer<typeof ItemsSearchInputSchema>;

const ItemsCheckinInputSchema = z.object({
	drive_id: z.string(),
	driveItem_id: z.string(),
	comment: z.string().optional(),
	checkInAs: z.string().optional(),
});

export type ItemsCheckinInput = z.infer<typeof ItemsCheckinInputSchema>;

const ItemsCheckoutInputSchema = z.object({
	drive_id: z.string(),
	driveItem_id: z.string(),
});

export type ItemsCheckoutInput = z.infer<typeof ItemsCheckoutInputSchema>;

const ItemsDiscardCheckoutInputSchema = z.object({
	drive_id: z.string(),
	driveItem_id: z.string(),
});

export type ItemsDiscardCheckoutInput = z.infer<
	typeof ItemsDiscardCheckoutInputSchema
>;

const ItemsFollowInputSchema = z.object({
	drive_id: z.string(),
	driveItem_id: z.string(),
});

export type ItemsFollowInput = z.infer<typeof ItemsFollowInputSchema>;

const ItemsUnfollowInputSchema = z.object({
	id: z.string(),
});

export type ItemsUnfollowInput = z.infer<typeof ItemsUnfollowInputSchema>;

const ItemsGetFollowedInputSchema = z.object({
	drive_id: z.string(),
	driveItem_id: z.string(),
});

export type ItemsGetFollowedInput = z.infer<typeof ItemsGetFollowedInputSchema>;

const ItemsGetVersionsInputSchema = z.object({
	item_id: z.string(),
	drive_id: z.string().optional(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	group_id: z.string().optional(),
});

export type ItemsGetVersionsInput = z.infer<typeof ItemsGetVersionsInputSchema>;

const ItemsGetThumbnailsInputSchema = z.object({
	item_id: z.string(),
	drive_id: z.string().optional(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	group_id: z.string().optional(),
	select: z.string().optional(),
	original_orientation: z.boolean().optional(),
});

export type ItemsGetThumbnailsInput = z.infer<
	typeof ItemsGetThumbnailsInputSchema
>;

const ItemsDownloadInputSchema = z.object({
	item_id: z.string(),
	file_name: z.string(),
	drive_id: z.string().optional(),
	user_id: z.string().optional(),
	format: z.enum(['pdf', 'html']).optional(),
	if_none_match: z.string().optional(),
});

export type ItemsDownloadInput = z.infer<typeof ItemsDownloadInputSchema>;

const ItemsDownloadByPathInputSchema = z.object({
	item_path: z.string(),
	file_name: z.string(),
});

export type ItemsDownloadByPathInput = z.infer<
	typeof ItemsDownloadByPathInputSchema
>;

const ItemsDownloadAsFormatInputSchema = z.object({
	path_and_filename: z.string(),
	file_name: z.string(),
	format: z.enum(['pdf', 'html']),
});

export type ItemsDownloadAsFormatInput = z.infer<
	typeof ItemsDownloadAsFormatInputSchema
>;

const ItemsDownloadVersionInputSchema = z.object({
	item_id: z.string(),
	version_id: z.string(),
	file_name: z.string(),
	drive_id: z.string().optional(),
});

export type ItemsDownloadVersionInput = z.infer<
	typeof ItemsDownloadVersionInputSchema
>;

const ItemsUpdateContentInputSchema = z.object({
	item_id: z.string(),
	name: z.string().optional(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	drive_id: z.string().optional(),
	group_id: z.string().optional(),
	file_size: z.number().optional(),
	description: z.string().optional(),
	defer_commit: z.boolean().optional(),
	media_source: z
		.object({
			contentCategory: z.string().optional(),
		})
		.optional(),
	if_match_etag: z.string().optional(),
	file_system_info: z
		.object({
			createdDateTime: z.string().optional(),
			lastAccessedDateTime: z.string().optional(),
			lastModifiedDateTime: z.string().optional(),
		})
		.optional(),
	conflict_behavior: z.string().optional(),
	drive_item_source: z
		.object({
			externalId: z.string().optional(),
			application: z.string().optional(),
		})
		.optional(),
	if_none_match_etag: z.string().optional(),
});

export type ItemsUpdateContentInput = z.infer<
	typeof ItemsUpdateContentInputSchema
>;

const ItemsPreviewInputSchema = z.object({
	item_id: z.string(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	drive_id: z.string().optional(),
	group_id: z.string().optional(),
	share_id: z.string().optional(),
	page: z.string().optional(),
	zoom: z.number().optional(),
});

export type ItemsPreviewInput = z.infer<typeof ItemsPreviewInputSchema>;

const ItemsGetDriveItemBySharingUrlInputSchema = z.object({
	sharing_url: z.string().optional(),
	prefer_redeem: z
		.enum(['redeemSharingLinkIfNecessary', 'redeemSharingLink'])
		.optional(),
	select_fields: z.array(z.string()).optional(),
	expand_children: z.boolean().optional(),
	share_id_or_encoded_url: z.string().optional(),
});

export type ItemsGetDriveItemBySharingUrlInput = z.infer<
	typeof ItemsGetDriveItemBySharingUrlInputSchema
>;

const ItemsListFolderChildrenInputSchema = z.object({
	top: z.number().optional(),
	expand: z.array(z.string()).optional(),
	select: z.array(z.string()).optional(),
	orderby: z.string().optional(),
	site_id: z.string().optional(),
	drive_id: z.string().optional(),
	next_link: z.string().optional(),
	skip_token: z.string().optional(),
	folder_path: z.string().optional(),
	use_me_drive: z.boolean().optional(),
	folder_item_id: z.string().optional(),
});

export type ItemsListFolderChildrenInput = z.infer<
	typeof ItemsListFolderChildrenInputSchema
>;

const ItemsListActivitiesInputSchema = z.object({
	item_id: z.string(),
	drive_id: z.string(),
	top: z.number().optional(),
	skip: z.string().optional(),
	expand: z.array(z.string()).optional(),
	filter: z.string().optional(),
	select: z.array(z.string()).optional(),
	orderby: z.string().optional(),
});

export type ItemsListActivitiesInput = z.infer<
	typeof ItemsListActivitiesInputSchema
>;

// ── Items Output Schemas ──────────────────────────────────────────────────────

const ItemsGetResponseSchema = DriveItemSchema;
export type ItemsGetResponse = z.infer<typeof ItemsGetResponseSchema>;

const ItemsUpdateMetadataResponseSchema = z.object({
	id: z.string(),
	cTag: z.string().optional(),
	eTag: z.string().optional(),
	file: z.object({ mimeType: z.string().optional() }).optional(),
	name: z.string(),
	size: z.number().optional(),
	folder: z.object({ childCount: z.number().optional() }).optional(),
	webUrl: z.string().optional(),
	createdDateTime: z.string().optional(),
	lastModifiedDateTime: z.string().optional(),
});
export type ItemsUpdateMetadataResponse = z.infer<
	typeof ItemsUpdateMetadataResponseSchema
>;

const ItemsDeleteResponseSchema = z.object({
	message: z.string(),
});
export type ItemsDeleteResponse = z.infer<typeof ItemsDeleteResponseSchema>;

const ItemsDeletePermanentlyResponseSchema = z.object({
	message: z.string(),
});
export type ItemsDeletePermanentlyResponse = z.infer<
	typeof ItemsDeletePermanentlyResponseSchema
>;

const ItemsCopyResponseSchema = z.object({
	name: z.string().optional(),
	item_id: z.string().optional(),
	message: z.string(),
	web_url: z.string().optional(),
	monitor_url: z.string().optional(),
	status_code: z.number(),
});
export type ItemsCopyResponse = z.infer<typeof ItemsCopyResponseSchema>;

const ItemsMoveResponseSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	size: z.number().optional(),
	webUrl: z.string().optional(),
	parentReference: z
		.object({
			driveId: z.string().optional(),
			id: z.string().optional(),
			path: z.string().optional(),
		})
		.optional(),
});
export type ItemsMoveResponse = z.infer<typeof ItemsMoveResponseSchema>;

const ItemsRestoreResponseSchema = z.object({
	id: z.string(),
	file: z.object({ mimeType: z.string().optional() }).optional(),
	name: z.string(),
	size: z.number().optional(),
	folder: z.object({ childCount: z.number().optional() }).optional(),
	webUrl: z.string().optional(),
	deleted: z.object({ state: z.string().optional() }).optional(),
	createdDateTime: z.string().optional(),
	parentReference: z
		.object({
			driveId: z.string().optional(),
			id: z.string().optional(),
			path: z.string().optional(),
		})
		.optional(),
	lastModifiedDateTime: z.string().optional(),
});
export type ItemsRestoreResponse = z.infer<typeof ItemsRestoreResponseSchema>;

const ItemsSearchResponseSchema = z.object({
	value: z.array(DriveItemSchema),
	'@odata.nextLink': z.string().optional(),
});
export type ItemsSearchResponse = z.infer<typeof ItemsSearchResponseSchema>;

const ItemsCheckinResponseSchema = z.object({
	message: z.string(),
});
export type ItemsCheckinResponse = z.infer<typeof ItemsCheckinResponseSchema>;

const ItemsCheckoutResponseSchema = z.object({
	message: z.string(),
});
export type ItemsCheckoutResponse = z.infer<typeof ItemsCheckoutResponseSchema>;

const ItemsDiscardCheckoutResponseSchema = z.object({
	message: z.string(),
});
export type ItemsDiscardCheckoutResponse = z.infer<
	typeof ItemsDiscardCheckoutResponseSchema
>;

const ItemsFollowResponseSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	size: z.number().optional(),
	webUrl: z.string().optional(),
	createdDateTime: z.string().optional(),
	lastModifiedDateTime: z.string().optional(),
});
export type ItemsFollowResponse = z.infer<typeof ItemsFollowResponseSchema>;

const ItemsUnfollowResponseSchema = z.object({
	message: z.string(),
});
export type ItemsUnfollowResponse = z.infer<typeof ItemsUnfollowResponseSchema>;

const ItemsGetFollowedResponseSchema = z.object({
	id: z.string(),
	file: z.object({ mimeType: z.string().optional() }).optional(),
	name: z.string(),
	size: z.number().optional(),
	folder: z.object({ childCount: z.number().optional() }).optional(),
	webUrl: z.string().optional(),
	followed: z.boolean().optional(),
});
export type ItemsGetFollowedResponse = z.infer<
	typeof ItemsGetFollowedResponseSchema
>;

const ItemsGetVersionsResponseSchema = z.object({
	value: z.array(DriveItemVersionSchema),
});
export type ItemsGetVersionsResponse = z.infer<
	typeof ItemsGetVersionsResponseSchema
>;

const ItemsGetThumbnailsResponseSchema = z.object({
	value: z.array(ThumbnailSetSchema),
});
export type ItemsGetThumbnailsResponse = z.infer<
	typeof ItemsGetThumbnailsResponseSchema
>;

const ItemsDownloadResponseSchema = z.object({
	content: z.string(),
});
export type ItemsDownloadResponse = z.infer<typeof ItemsDownloadResponseSchema>;

const ItemsDownloadByPathResponseSchema = z.object({
	content: z.string(),
});
export type ItemsDownloadByPathResponse = z.infer<
	typeof ItemsDownloadByPathResponseSchema
>;

const ItemsDownloadAsFormatResponseSchema = z.object({
	content: z.string(),
});
export type ItemsDownloadAsFormatResponse = z.infer<
	typeof ItemsDownloadAsFormatResponseSchema
>;

const ItemsDownloadVersionResponseSchema = z.object({
	content: z.string(),
});
export type ItemsDownloadVersionResponse = z.infer<
	typeof ItemsDownloadVersionResponseSchema
>;

const ItemsUpdateContentResponseSchema = z.object({
	uploadUrl: z.string().optional(),
	expirationDateTime: z.string().optional(),
	nextExpectedRanges: z.array(z.string()).optional(),
});
export type ItemsUpdateContentResponse = z.infer<
	typeof ItemsUpdateContentResponseSchema
>;

const ItemsPreviewResponseSchema = z.object({
	getUrl: z.string().optional(),
	postUrl: z.string().optional(),
	postParameters: z.string().optional(),
});
export type ItemsPreviewResponse = z.infer<typeof ItemsPreviewResponseSchema>;

const ItemsGetDriveItemBySharingUrlResponseSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	size: z.number().optional(),
	webUrl: z.string().optional(),
	eTag: z.string().optional(),
	cTag: z.string().optional(),
	createdDateTime: z.string().optional(),
	lastModifiedDateTime: z.string().optional(),
	file: z.object({ mimeType: z.string().optional() }).optional(),
	folder: z.object({ childCount: z.number().optional() }).optional(),
	'@microsoft.graph.downloadUrl': z.string().optional(),
	parentReference: z
		.object({
			driveId: z.string().optional(),
			id: z.string().optional(),
			path: z.string().optional(),
		})
		.optional(),
	item_id: z.string().optional(),
	drive_id: z.string().optional(),
});
export type ItemsGetDriveItemBySharingUrlResponse = z.infer<
	typeof ItemsGetDriveItemBySharingUrlResponseSchema
>;

const ItemsListFolderChildrenResponseSchema = z.object({
	value: z.array(DriveItemSchema),
	'@odata.nextLink': z.string().optional(),
});
export type ItemsListFolderChildrenResponse = z.infer<
	typeof ItemsListFolderChildrenResponseSchema
>;

const ItemsListActivitiesResponseSchema = z.object({
	value: z.array(ItemActivitySchema),
	'@odata.nextLink': z.string().optional(),
});
export type ItemsListActivitiesResponse = z.infer<
	typeof ItemsListActivitiesResponseSchema
>;

// ── Drive Input Schemas ───────────────────────────────────────────────────────

const DriveGetInputSchema = z.object({
	drive_id: z.string(),
	select_fields: z.array(z.string()).optional(),
	expand_fields: z.array(z.string()).optional(),
});
export type DriveGetInput = z.infer<typeof DriveGetInputSchema>;

const DriveGetGroupInputSchema = z.object({
	group_id: z.string(),
	select_fields: z.array(z.string()).optional(),
});
export type DriveGetGroupInput = z.infer<typeof DriveGetGroupInputSchema>;

const DriveListInputSchema = z.object({
	top: z.number().optional(),
	expand: z.string().optional(),
	select: z.string().optional(),
	orderby: z.string().optional(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	group_id: z.string().optional(),
	skip_token: z.string().optional(),
});
export type DriveListInput = z.infer<typeof DriveListInputSchema>;

const DriveGetRootInputSchema = z.object({
	select_fields: z.array(z.string()).optional(),
});
export type DriveGetRootInput = z.infer<typeof DriveGetRootInputSchema>;

const DriveGetSpecialFolderInputSchema = z.object({
	special_folder_name: z.enum(['documents', 'photos', 'cameraroll']),
	select_fields: z.array(z.string()).optional(),
	expand_relations: z.array(z.string()).optional(),
});
export type DriveGetSpecialFolderInput = z.infer<
	typeof DriveGetSpecialFolderInputSchema
>;

const DriveGetQuotaInputSchema = z.object({
	select_fields: z.array(z.string()).optional(),
});
export type DriveGetQuotaInput = z.infer<typeof DriveGetQuotaInputSchema>;

const DriveGetRecentItemsInputSchema = z.object({
	top: z.number().optional(),
	select: z.string().optional(),
});
export type DriveGetRecentItemsInput = z.infer<
	typeof DriveGetRecentItemsInputSchema
>;

const DriveGetSharedItemsInputSchema = z.object({
	allow_external: z.boolean().optional(),
});
export type DriveGetSharedItemsInput = z.infer<
	typeof DriveGetSharedItemsInputSchema
>;

const DriveListActivitiesInputSchema = z.object({
	top: z.number().optional(),
});
export type DriveListActivitiesInput = z.infer<
	typeof DriveListActivitiesInputSchema
>;

const DriveListChangesInputSchema = z.object({
	top: z.number().optional(),
	token: z.string().optional(),
	expand: z.string().optional(),
	select: z.string().optional(),
});
export type DriveListChangesInput = z.infer<typeof DriveListChangesInputSchema>;

const DriveListBundlesInputSchema = z.object({
	drive_id: z.string(),
	top: z.number().optional(),
	expand: z.string().optional(),
	filter: z.string().optional(),
	select: z.string().optional(),
	orderby: z.string().optional(),
	skip_token: z.string().optional(),
});
export type DriveListBundlesInput = z.infer<typeof DriveListBundlesInputSchema>;

// ── Drive Output Schemas ──────────────────────────────────────────────────────

const DriveGetResponseSchema = DriveSchema;
export type DriveGetResponse = z.infer<typeof DriveGetResponseSchema>;

const DriveGetGroupResponseSchema = DriveSchema;
export type DriveGetGroupResponse = z.infer<typeof DriveGetGroupResponseSchema>;

const DriveListResponseSchema = z.object({
	value: z.array(DriveSchema),
	'@odata.nextLink': z.string().optional(),
});
export type DriveListResponse = z.infer<typeof DriveListResponseSchema>;

const DriveGetRootResponseSchema = DriveItemBaseSchema.extend({
	name: z.string(),
	// root facet marks this item as the drive root — always an empty object
	root: z.object({}).passthrough().optional(),
	description: z.string().optional(),
});
export type DriveGetRootResponse = z.infer<typeof DriveGetRootResponseSchema>;

const DriveGetSpecialFolderResponseSchema = DriveItemSchema.extend({
	name: z.string(),
});
export type DriveGetSpecialFolderResponse = z.infer<
	typeof DriveGetSpecialFolderResponseSchema
>;

const DriveGetQuotaResponseSchema = DriveSchema;
export type DriveGetQuotaResponse = z.infer<typeof DriveGetQuotaResponseSchema>;

const DriveGetRecentItemsResponseSchema = z.object({
	value: z.array(DriveItemSchema),
	'@odata.nextLink': z.string().optional(),
});
export type DriveGetRecentItemsResponse = z.infer<
	typeof DriveGetRecentItemsResponseSchema
>;

const DriveGetSharedItemsResponseSchema = z.object({
	value: z.array(DriveItemSchema),
});
export type DriveGetSharedItemsResponse = z.infer<
	typeof DriveGetSharedItemsResponseSchema
>;

const DriveListActivitiesResponseSchema = z.object({
	value: z.array(ItemActivitySchema),
	'@odata.nextLink': z.string().optional(),
});
export type DriveListActivitiesResponse = z.infer<
	typeof DriveListActivitiesResponseSchema
>;

const DriveListChangesResponseSchema = z.object({
	value: z.array(DriveItemSchema),
	'@odata.nextLink': z.string().optional(),
	'@odata.deltaLink': z.string().optional(),
});
export type DriveListChangesResponse = z.infer<
	typeof DriveListChangesResponseSchema
>;

const DriveListBundlesResponseSchema = z.object({
	value: z.array(DriveItemSchema),
	'@odata.nextLink': z.string().optional(),
});
export type DriveListBundlesResponse = z.infer<
	typeof DriveListBundlesResponseSchema
>;

// ── Files Input Schemas ───────────────────────────────────────────────────────

const FilesCreateFolderInputSchema = z.object({
	name: z.string(),
	user_id: z.string().optional(),
	description: z.string().optional(),
	parent_folder: z.string().optional(),
});
export type FilesCreateFolderInput = z.infer<
	typeof FilesCreateFolderInputSchema
>;

const FilesCreateTextFileInputSchema = z.object({
	name: z.string(),
	content: z.string(),
	folder: z.string().optional(),
	user_id: z.string().optional(),
	conflict_behavior: z.enum(['fail', 'replace', 'rename']).optional(),
});
export type FilesCreateTextFileInput = z.infer<
	typeof FilesCreateTextFileInputSchema
>;

const FilesFindFileInputSchema = z.object({
	name: z.string(),
	folder: z.string().optional(),
	user_id: z.string().optional(),
	include_metadata: z.boolean().optional(),
});
export type FilesFindFileInput = z.infer<typeof FilesFindFileInputSchema>;

const FilesFindFolderInputSchema = z.object({
	name: z.string().optional(),
	top: z.number().optional(),
	expand: z.string().optional(),
	folder: z.string().optional(),
	select: z.array(z.string()).optional(),
	orderby: z.string().optional(),
	user_id: z.string().optional(),
	skip_token: z.string().optional(),
});
export type FilesFindFolderInput = z.infer<typeof FilesFindFolderInputSchema>;

const FilesListInputSchema = z.object({
	top: z.number().optional(),
	select: z.array(z.string()).optional(),
	user_id: z.string().optional(),
});
export type FilesListInput = z.infer<typeof FilesListInputSchema>;

const FilesUploadInputSchema = z.object({
	file: z.object({
		name: z.string(),
		s3key: z.string(),
		mimetype: z.string(),
	}),
	folder: z.string().optional(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	drive_id: z.string().optional(),
	description: z.string().optional(),
	defer_commit: z.boolean().optional(),
	if_match_etag: z.string().optional(),
	file_system_info: z
		.object({
			createdDateTime: z.string().optional(),
			lastAccessedDateTime: z.string().optional(),
			lastModifiedDateTime: z.string().optional(),
		})
		.optional(),
	conflict_behavior: z.enum(['rename', 'fail', 'replace']).optional(),
});
export type FilesUploadInput = z.infer<typeof FilesUploadInputSchema>;

// ── Files Output Schemas ──────────────────────────────────────────────────────

const FilesCreateFolderResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	webUrl: z.string().optional(),
});
export type FilesCreateFolderResponse = z.infer<
	typeof FilesCreateFolderResponseSchema
>;

const FilesCreateTextFileResponseSchema = z.object({
	id: z.string(),
	file: z.object({ mimeType: z.string().optional() }).optional(),
	name: z.string(),
	size: z.number().optional(),
});
export type FilesCreateTextFileResponse = z.infer<
	typeof FilesCreateTextFileResponseSchema
>;

const FilesFindFileResponseSchema = z.object({
	value: z.array(DriveItemSchema),
	odata_context: z.string().optional(),
});
export type FilesFindFileResponse = z.infer<typeof FilesFindFileResponseSchema>;

const FilesFindFolderResponseSchema = z.object({
	value: z.array(DriveItemSchema),
	'@odata.nextLink': z.string().optional(),
});
export type FilesFindFolderResponse = z.infer<
	typeof FilesFindFolderResponseSchema
>;

const FilesListResponseSchema = z.object({
	value: z.array(DriveItemSchema),
	'@odata.nextLink': z.string().optional(),
});
export type FilesListResponse = z.infer<typeof FilesListResponseSchema>;

const FilesUploadResponseSchema = z.object({
	id: z.string(),
	file: z.object({ mimeType: z.string().optional() }).optional(),
	name: z.string(),
	size: z.number().optional(),
});
export type FilesUploadResponse = z.infer<typeof FilesUploadResponseSchema>;

// ── Permissions Input Schemas ─────────────────────────────────────────────────

const PermissionsGetForItemInputSchema = z.object({
	item_id: z.string(),
	drive_id: z.string().optional(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	group_id: z.string().optional(),
	item_path: z.string().optional(),
	select: z.string().optional(),
	if_none_match: z.string().optional(),
});
export type PermissionsGetForItemInput = z.infer<
	typeof PermissionsGetForItemInputSchema
>;

const PermissionsCreateForItemInputSchema = z.object({
	drive_id: z.string(),
	driveItem_id: z.string(),
	roles: z.array(z.string()),
	grantedToV2: z.object({
		// any/unknown for siteGroup since SharePoint group shape varies
		siteGroup: z.record(z.unknown()).optional(),
		// any/unknown for application since app identity shape varies
		application: z.record(z.unknown()).optional(),
	}),
});
export type PermissionsCreateForItemInput = z.infer<
	typeof PermissionsCreateForItemInputSchema
>;

const PermissionsUpdateForItemInputSchema = z.object({
	item_id: z.string(),
	permission_id: z.string(),
	roles: z.array(z.string()),
	drive_id: z.string().optional(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	group_id: z.string().optional(),
});
export type PermissionsUpdateForItemInput = z.infer<
	typeof PermissionsUpdateForItemInputSchema
>;

const PermissionsDeleteFromItemInputSchema = z.object({
	item_id: z.string(),
	perm_id: z.string(),
	drive_id: z.string().optional(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	group_id: z.string().optional(),
});
export type PermissionsDeleteFromItemInput = z.infer<
	typeof PermissionsDeleteFromItemInputSchema
>;

const PermissionsInviteUserInputSchema = z.object({
	item_id: z.string(),
	roles: z.array(z.string()),
	recipients: z.array(z.record(z.string())),
	drive_id: z.string().optional(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	group_id: z.string().optional(),
	message: z.string().optional(),
	password: z.string().optional(),
	require_sign_in: z.boolean().optional(),
	send_invitation: z.boolean().optional(),
	expiration_date_time: z.string().optional(),
	retain_inherited_permissions: z.boolean().optional(),
});
export type PermissionsInviteUserInput = z.infer<
	typeof PermissionsInviteUserInputSchema
>;

const PermissionsCreateLinkInputSchema = z.object({
	item_id: z.string(),
	type: z.enum(['view', 'edit', 'embed']),
	scope: z.enum(['anonymous', 'organization', 'users']).optional(),
	site_id: z.string().optional(),
	user_id: z.string().optional(),
	drive_id: z.string().optional(),
	group_id: z.string().optional(),
	password: z.string().optional(),
	expiration_date_time: z.string().optional(),
	retain_inherited_permissions: z.boolean().optional(),
});
export type PermissionsCreateLinkInput = z.infer<
	typeof PermissionsCreateLinkInputSchema
>;

const PermissionsListSharePermissionsInputSchema = z.object({
	shared_drive_item_id: z.string(),
});
export type PermissionsListSharePermissionsInput = z.infer<
	typeof PermissionsListSharePermissionsInputSchema
>;

const PermissionsDeleteSharePermissionInputSchema = z.object({
	shared_drive_item_id: z.string(),
});
export type PermissionsDeleteSharePermissionInput = z.infer<
	typeof PermissionsDeleteSharePermissionInputSchema
>;

const PermissionsGrantSharePermissionInputSchema = z.object({
	encoded_sharing_url: z.string(),
	roles: z.array(z.string()),
	recipients: z.array(z.record(z.string())),
});
export type PermissionsGrantSharePermissionInput = z.infer<
	typeof PermissionsGrantSharePermissionInputSchema
>;

const PermissionsGetShareInputSchema = z.object({
	share_id_or_encoded_sharing_url: z.string(),
	prefer_redeem: z
		.enum(['redeemSharingLinkIfNecessary', 'redeemSharingLink'])
		.optional(),
	expand_children: z.boolean().optional(),
});
export type PermissionsGetShareInput = z.infer<
	typeof PermissionsGetShareInputSchema
>;

// ── Permissions Output Schemas ────────────────────────────────────────────────

const PermissionsGetForItemResponseSchema = z.object({
	value: z.array(PermissionSchema),
	'@odata.nextLink': z.string().optional(),
});
export type PermissionsGetForItemResponse = z.infer<
	typeof PermissionsGetForItemResponseSchema
>;

const PermissionsCreateForItemResponseSchema = PermissionSchema;
export type PermissionsCreateForItemResponse = z.infer<
	typeof PermissionsCreateForItemResponseSchema
>;

const PermissionsUpdateForItemResponseSchema = PermissionSchema;
export type PermissionsUpdateForItemResponse = z.infer<
	typeof PermissionsUpdateForItemResponseSchema
>;

const PermissionsDeleteFromItemResponseSchema = z.object({
	message: z.string(),
});
export type PermissionsDeleteFromItemResponse = z.infer<
	typeof PermissionsDeleteFromItemResponseSchema
>;

const PermissionsInviteUserResponseSchema = z.object({
	value: z.array(PermissionSchema),
});
export type PermissionsInviteUserResponse = z.infer<
	typeof PermissionsInviteUserResponseSchema
>;

const PermissionsCreateLinkResponseSchema = z.object({
	id: z.string().optional(),
	link: SharingLinkSchema.optional(),
	roles: z.array(z.string()).optional(),
	shareId: z.string().optional(),
	hasPassword: z.boolean().optional(),
});
export type PermissionsCreateLinkResponse = z.infer<
	typeof PermissionsCreateLinkResponseSchema
>;

const PermissionsListSharePermissionsResponseSchema = z.object({
	id: z.string().optional(),
	link: SharingLinkSchema.optional(),
	roles: z.array(z.string()).optional(),
	hasPassword: z.boolean().optional(),
});
export type PermissionsListSharePermissionsResponse = z.infer<
	typeof PermissionsListSharePermissionsResponseSchema
>;

const PermissionsDeleteSharePermissionResponseSchema = z.object({
	message: z.string(),
});
export type PermissionsDeleteSharePermissionResponse = z.infer<
	typeof PermissionsDeleteSharePermissionResponseSchema
>;

const PermissionsGrantSharePermissionResponseSchema = z.object({
	value: z.array(PermissionSchema),
});
export type PermissionsGrantSharePermissionResponse = z.infer<
	typeof PermissionsGrantSharePermissionResponseSchema
>;

const PermissionsGetShareResponseSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	root: z.object({}).passthrough().optional(),
	items: z.array(DriveItemSchema).optional(),
	owner: IdentitySetSchema.optional(),
	children: z.array(DriveItemSchema).optional(),
});
export type PermissionsGetShareResponse = z.infer<
	typeof PermissionsGetShareResponseSchema
>;

// ── SharePoint Input Schemas ──────────────────────────────────────────────────

const SharepointGetSiteInputSchema = z.object({
	site_id: z.string(),
	expand: z.string().optional(),
	select: z.string().optional(),
});
export type SharepointGetSiteInput = z.infer<
	typeof SharepointGetSiteInputSchema
>;

const SharepointGetSitePageInputSchema = z.object({
	site_id: z.string(),
	page_id: z.string(),
	expand: z.string().optional(),
	select: z.string().optional(),
});
export type SharepointGetSitePageInput = z.infer<
	typeof SharepointGetSitePageInputSchema
>;

const SharepointGetListItemsInputSchema = z.object({
	site_id: z.string(),
	list_id: z.string(),
	top: z.number().optional(),
	skip: z.number().optional(),
	count: z.boolean().optional(),
	expand: z.string().optional(),
	filter: z.string().optional(),
	select: z.string().optional(),
	orderby: z.string().optional(),
});
export type SharepointGetListItemsInput = z.infer<
	typeof SharepointGetListItemsInputSchema
>;

const SharepointListSiteListsInputSchema = z.object({
	site_id: z.string(),
	top: z.number().optional(),
	skip: z.number().optional(),
	count: z.boolean().optional(),
	expand: z.string().optional(),
	filter: z.string().optional(),
	select: z.string().optional(),
	orderby: z.string().optional(),
});
export type SharepointListSiteListsInput = z.infer<
	typeof SharepointListSiteListsInputSchema
>;

const SharepointListSiteColumnsInputSchema = z.object({
	site_id: z.string(),
	top: z.number().optional(),
	skip: z.number().optional(),
	count: z.boolean().optional(),
	expand: z.string().optional(),
	filter: z.string().optional(),
	select: z.string().optional(),
	orderby: z.string().optional(),
});
export type SharepointListSiteColumnsInput = z.infer<
	typeof SharepointListSiteColumnsInputSchema
>;

const SharepointListSiteSubsitesInputSchema = z.object({
	site_id: z.string(),
	top: z.number().optional(),
	skip: z.number().optional(),
	count: z.boolean().optional(),
	expand: z.string().optional(),
	filter: z.string().optional(),
	select: z.string().optional(),
	orderby: z.string().optional(),
});
export type SharepointListSiteSubsitesInput = z.infer<
	typeof SharepointListSiteSubsitesInputSchema
>;

const SharepointListListItemsDeltaInputSchema = z.object({
	site_id: z.string(),
	list_id: z.string(),
	top: z.number().optional(),
	token: z.string().optional(),
	expand: z.string().optional(),
	select: z.string().optional(),
});
export type SharepointListListItemsDeltaInput = z.infer<
	typeof SharepointListListItemsDeltaInputSchema
>;

const SharepointListSiteItemsDeltaInputSchema = z.object({
	site_id: z.string(),
	top: z.number().optional(),
	token: z.string().optional(),
	expand: z.string().optional(),
	select: z.string().optional(),
});
export type SharepointListSiteItemsDeltaInput = z.infer<
	typeof SharepointListSiteItemsDeltaInputSchema
>;

// ── SharePoint Output Schemas ─────────────────────────────────────────────────

const SharepointGetSiteResponseSchema = z.object({
	id: z.string(),
	eTag: z.string().optional(),
	name: z.string().optional(),
	webUrl: z.string().optional(),
	description: z.string().optional(),
	displayName: z.string().optional(),
	sharepointIds: SharepointIdsSchema.optional(),
	isPersonalSite: z.boolean().optional(),
	siteCollection: SiteCollectionSchema.optional(),
	createdDateTime: z.string().optional(),
	lastModifiedDateTime: z.string().optional(),
});
export type SharepointGetSiteResponse = z.infer<
	typeof SharepointGetSiteResponseSchema
>;

const SharepointGetSitePageResponseSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	title: z.string().optional(),
	webUrl: z.string().optional(),
});
export type SharepointGetSitePageResponse = z.infer<
	typeof SharepointGetSitePageResponseSchema
>;

const SharepointGetListItemsResponseSchema = z.object({
	value: z.array(SharepointListItemSchema),
	'@odata.count': z.number().optional(),
	'@odata.nextLink': z.string().optional(),
});
export type SharepointGetListItemsResponse = z.infer<
	typeof SharepointGetListItemsResponseSchema
>;

const SharepointListSiteListsResponseSchema = z.object({
	value: z.array(SharepointListSchema),
	'@odata.count': z.number().optional(),
	'@odata.nextLink': z.string().optional(),
});
export type SharepointListSiteListsResponse = z.infer<
	typeof SharepointListSiteListsResponseSchema
>;

const SharepointListSiteColumnsResponseSchema = z.object({
	value: z.array(ColumnDefinitionSchema),
	'@odata.count': z.number().optional(),
	'@odata.nextLink': z.string().optional(),
});
export type SharepointListSiteColumnsResponse = z.infer<
	typeof SharepointListSiteColumnsResponseSchema
>;

const SharepointListSiteSubsitesResponseSchema = z.object({
	value: z.array(SharepointGetSiteResponseSchema),
	'@odata.count': z.number().optional(),
	'@odata.nextLink': z.string().optional(),
});
export type SharepointListSiteSubsitesResponse = z.infer<
	typeof SharepointListSiteSubsitesResponseSchema
>;

const SharepointListListItemsDeltaResponseSchema = z.object({
	value: z.array(SharepointListItemSchema),
	'@odata.nextLink': z.string().optional(),
	'@odata.deltaLink': z.string().optional(),
});
export type SharepointListListItemsDeltaResponse = z.infer<
	typeof SharepointListListItemsDeltaResponseSchema
>;

const SharepointListSiteItemsDeltaResponseSchema = z.object({
	value: z.array(DriveItemSchema),
	'@odata.nextLink': z.string().optional(),
	'@odata.deltaLink': z.string().optional(),
});
export type SharepointListSiteItemsDeltaResponse = z.infer<
	typeof SharepointListSiteItemsDeltaResponseSchema
>;

// ── Subscriptions Input Schemas ───────────────────────────────────────────────

const SubscriptionsListInputSchema = z.object({});
export type SubscriptionsListInput = z.infer<
	typeof SubscriptionsListInputSchema
>;

// ── Subscriptions Output Schemas ──────────────────────────────────────────────

const SubscriptionsListResponseSchema = z.object({
	value: z.array(SubscriptionSchema),
	'@odata.nextLink': z.string().optional(),
});
export type SubscriptionsListResponse = z.infer<
	typeof SubscriptionsListResponseSchema
>;

// ── Endpoint I/O Maps ────────────────────────────────────────────────────────

export type OnedriveEndpointInputs = {
	// Items
	itemsGet: ItemsGetInput;
	itemsUpdateMetadata: ItemsUpdateMetadataInput;
	itemsDelete: ItemsDeleteInput;
	itemsDeletePermanently: ItemsDeletePermanentlyInput;
	itemsCopy: ItemsCopyInput;
	itemsMove: ItemsMoveInput;
	itemsRestore: ItemsRestoreInput;
	itemsSearch: ItemsSearchInput;
	itemsCheckin: ItemsCheckinInput;
	itemsCheckout: ItemsCheckoutInput;
	itemsDiscardCheckout: ItemsDiscardCheckoutInput;
	itemsFollow: ItemsFollowInput;
	itemsUnfollow: ItemsUnfollowInput;
	itemsGetFollowed: ItemsGetFollowedInput;
	itemsGetVersions: ItemsGetVersionsInput;
	itemsGetThumbnails: ItemsGetThumbnailsInput;
	itemsDownload: ItemsDownloadInput;
	itemsDownloadByPath: ItemsDownloadByPathInput;
	itemsDownloadAsFormat: ItemsDownloadAsFormatInput;
	itemsDownloadVersion: ItemsDownloadVersionInput;
	itemsUpdateContent: ItemsUpdateContentInput;
	itemsPreview: ItemsPreviewInput;
	itemsGetDriveItemBySharingUrl: ItemsGetDriveItemBySharingUrlInput;
	itemsListFolderChildren: ItemsListFolderChildrenInput;
	itemsListActivities: ItemsListActivitiesInput;
	// Drive
	driveGet: DriveGetInput;
	driveGetGroup: DriveGetGroupInput;
	driveList: DriveListInput;
	driveGetRoot: DriveGetRootInput;
	driveGetSpecialFolder: DriveGetSpecialFolderInput;
	driveGetQuota: DriveGetQuotaInput;
	driveGetRecentItems: DriveGetRecentItemsInput;
	driveGetSharedItems: DriveGetSharedItemsInput;
	driveListActivities: DriveListActivitiesInput;
	driveListChanges: DriveListChangesInput;
	driveListBundles: DriveListBundlesInput;
	// Files
	filesCreateFolder: FilesCreateFolderInput;
	filesCreateTextFile: FilesCreateTextFileInput;
	filesFindFile: FilesFindFileInput;
	filesFindFolder: FilesFindFolderInput;
	filesList: FilesListInput;
	filesUpload: FilesUploadInput;
	// Permissions
	permissionsGetForItem: PermissionsGetForItemInput;
	permissionsCreateForItem: PermissionsCreateForItemInput;
	permissionsUpdateForItem: PermissionsUpdateForItemInput;
	permissionsDeleteFromItem: PermissionsDeleteFromItemInput;
	permissionsInviteUser: PermissionsInviteUserInput;
	permissionsCreateLink: PermissionsCreateLinkInput;
	permissionsListSharePermissions: PermissionsListSharePermissionsInput;
	permissionsDeleteSharePermission: PermissionsDeleteSharePermissionInput;
	permissionsGrantSharePermission: PermissionsGrantSharePermissionInput;
	permissionsGetShare: PermissionsGetShareInput;
	// SharePoint
	sharepointGetSite: SharepointGetSiteInput;
	sharepointGetSitePage: SharepointGetSitePageInput;
	sharepointGetListItems: SharepointGetListItemsInput;
	sharepointListSiteLists: SharepointListSiteListsInput;
	sharepointListSiteColumns: SharepointListSiteColumnsInput;
	sharepointListSiteSubsites: SharepointListSiteSubsitesInput;
	sharepointListListItemsDelta: SharepointListListItemsDeltaInput;
	sharepointListSiteItemsDelta: SharepointListSiteItemsDeltaInput;
	// Subscriptions
	subscriptionsList: SubscriptionsListInput;
};

export type OnedriveEndpointOutputs = {
	// Items
	itemsGet: ItemsGetResponse;
	itemsUpdateMetadata: ItemsUpdateMetadataResponse;
	itemsDelete: ItemsDeleteResponse;
	itemsDeletePermanently: ItemsDeletePermanentlyResponse;
	itemsCopy: ItemsCopyResponse;
	itemsMove: ItemsMoveResponse;
	itemsRestore: ItemsRestoreResponse;
	itemsSearch: ItemsSearchResponse;
	itemsCheckin: ItemsCheckinResponse;
	itemsCheckout: ItemsCheckoutResponse;
	itemsDiscardCheckout: ItemsDiscardCheckoutResponse;
	itemsFollow: ItemsFollowResponse;
	itemsUnfollow: ItemsUnfollowResponse;
	itemsGetFollowed: ItemsGetFollowedResponse;
	itemsGetVersions: ItemsGetVersionsResponse;
	itemsGetThumbnails: ItemsGetThumbnailsResponse;
	itemsDownload: ItemsDownloadResponse;
	itemsDownloadByPath: ItemsDownloadByPathResponse;
	itemsDownloadAsFormat: ItemsDownloadAsFormatResponse;
	itemsDownloadVersion: ItemsDownloadVersionResponse;
	itemsUpdateContent: ItemsUpdateContentResponse;
	itemsPreview: ItemsPreviewResponse;
	itemsGetDriveItemBySharingUrl: ItemsGetDriveItemBySharingUrlResponse;
	itemsListFolderChildren: ItemsListFolderChildrenResponse;
	itemsListActivities: ItemsListActivitiesResponse;
	// Drive
	driveGet: DriveGetResponse;
	driveGetGroup: DriveGetGroupResponse;
	driveList: DriveListResponse;
	driveGetRoot: DriveGetRootResponse;
	driveGetSpecialFolder: DriveGetSpecialFolderResponse;
	driveGetQuota: DriveGetQuotaResponse;
	driveGetRecentItems: DriveGetRecentItemsResponse;
	driveGetSharedItems: DriveGetSharedItemsResponse;
	driveListActivities: DriveListActivitiesResponse;
	driveListChanges: DriveListChangesResponse;
	driveListBundles: DriveListBundlesResponse;
	// Files
	filesCreateFolder: FilesCreateFolderResponse;
	filesCreateTextFile: FilesCreateTextFileResponse;
	filesFindFile: FilesFindFileResponse;
	filesFindFolder: FilesFindFolderResponse;
	filesList: FilesListResponse;
	filesUpload: FilesUploadResponse;
	// Permissions
	permissionsGetForItem: PermissionsGetForItemResponse;
	permissionsCreateForItem: PermissionsCreateForItemResponse;
	permissionsUpdateForItem: PermissionsUpdateForItemResponse;
	permissionsDeleteFromItem: PermissionsDeleteFromItemResponse;
	permissionsInviteUser: PermissionsInviteUserResponse;
	permissionsCreateLink: PermissionsCreateLinkResponse;
	permissionsListSharePermissions: PermissionsListSharePermissionsResponse;
	permissionsDeleteSharePermission: PermissionsDeleteSharePermissionResponse;
	permissionsGrantSharePermission: PermissionsGrantSharePermissionResponse;
	permissionsGetShare: PermissionsGetShareResponse;
	// SharePoint
	sharepointGetSite: SharepointGetSiteResponse;
	sharepointGetSitePage: SharepointGetSitePageResponse;
	sharepointGetListItems: SharepointGetListItemsResponse;
	sharepointListSiteLists: SharepointListSiteListsResponse;
	sharepointListSiteColumns: SharepointListSiteColumnsResponse;
	sharepointListSiteSubsites: SharepointListSiteSubsitesResponse;
	sharepointListListItemsDelta: SharepointListListItemsDeltaResponse;
	sharepointListSiteItemsDelta: SharepointListSiteItemsDeltaResponse;
	// Subscriptions
	subscriptionsList: SubscriptionsListResponse;
};

export const OnedriveEndpointInputSchemas: Record<
	keyof OnedriveEndpointInputs,
	z.ZodTypeAny
> = {
	// Items
	itemsGet: ItemsGetInputSchema,
	itemsUpdateMetadata: ItemsUpdateMetadataInputSchema,
	itemsDelete: ItemsDeleteInputSchema,
	itemsDeletePermanently: ItemsDeletePermanentlyInputSchema,
	itemsCopy: ItemsCopyInputSchema,
	itemsMove: ItemsMoveInputSchema,
	itemsRestore: ItemsRestoreInputSchema,
	itemsSearch: ItemsSearchInputSchema,
	itemsCheckin: ItemsCheckinInputSchema,
	itemsCheckout: ItemsCheckoutInputSchema,
	itemsDiscardCheckout: ItemsDiscardCheckoutInputSchema,
	itemsFollow: ItemsFollowInputSchema,
	itemsUnfollow: ItemsUnfollowInputSchema,
	itemsGetFollowed: ItemsGetFollowedInputSchema,
	itemsGetVersions: ItemsGetVersionsInputSchema,
	itemsGetThumbnails: ItemsGetThumbnailsInputSchema,
	itemsDownload: ItemsDownloadInputSchema,
	itemsDownloadByPath: ItemsDownloadByPathInputSchema,
	itemsDownloadAsFormat: ItemsDownloadAsFormatInputSchema,
	itemsDownloadVersion: ItemsDownloadVersionInputSchema,
	itemsUpdateContent: ItemsUpdateContentInputSchema,
	itemsPreview: ItemsPreviewInputSchema,
	itemsGetDriveItemBySharingUrl: ItemsGetDriveItemBySharingUrlInputSchema,
	itemsListFolderChildren: ItemsListFolderChildrenInputSchema,
	itemsListActivities: ItemsListActivitiesInputSchema,
	// Drive
	driveGet: DriveGetInputSchema,
	driveGetGroup: DriveGetGroupInputSchema,
	driveList: DriveListInputSchema,
	driveGetRoot: DriveGetRootInputSchema,
	driveGetSpecialFolder: DriveGetSpecialFolderInputSchema,
	driveGetQuota: DriveGetQuotaInputSchema,
	driveGetRecentItems: DriveGetRecentItemsInputSchema,
	driveGetSharedItems: DriveGetSharedItemsInputSchema,
	driveListActivities: DriveListActivitiesInputSchema,
	driveListChanges: DriveListChangesInputSchema,
	driveListBundles: DriveListBundlesInputSchema,
	// Files
	filesCreateFolder: FilesCreateFolderInputSchema,
	filesCreateTextFile: FilesCreateTextFileInputSchema,
	filesFindFile: FilesFindFileInputSchema,
	filesFindFolder: FilesFindFolderInputSchema,
	filesList: FilesListInputSchema,
	filesUpload: FilesUploadInputSchema,
	// Permissions
	permissionsGetForItem: PermissionsGetForItemInputSchema,
	permissionsCreateForItem: PermissionsCreateForItemInputSchema,
	permissionsUpdateForItem: PermissionsUpdateForItemInputSchema,
	permissionsDeleteFromItem: PermissionsDeleteFromItemInputSchema,
	permissionsInviteUser: PermissionsInviteUserInputSchema,
	permissionsCreateLink: PermissionsCreateLinkInputSchema,
	permissionsListSharePermissions: PermissionsListSharePermissionsInputSchema,
	permissionsDeleteSharePermission: PermissionsDeleteSharePermissionInputSchema,
	permissionsGrantSharePermission: PermissionsGrantSharePermissionInputSchema,
	permissionsGetShare: PermissionsGetShareInputSchema,
	// SharePoint
	sharepointGetSite: SharepointGetSiteInputSchema,
	sharepointGetSitePage: SharepointGetSitePageInputSchema,
	sharepointGetListItems: SharepointGetListItemsInputSchema,
	sharepointListSiteLists: SharepointListSiteListsInputSchema,
	sharepointListSiteColumns: SharepointListSiteColumnsInputSchema,
	sharepointListSiteSubsites: SharepointListSiteSubsitesInputSchema,
	sharepointListListItemsDelta: SharepointListListItemsDeltaInputSchema,
	sharepointListSiteItemsDelta: SharepointListSiteItemsDeltaInputSchema,
	// Subscriptions
	subscriptionsList: SubscriptionsListInputSchema,
} as const;

export const OnedriveEndpointOutputSchemas: Record<
	keyof OnedriveEndpointOutputs,
	z.ZodTypeAny
> = {
	// Items
	itemsGet: ItemsGetResponseSchema,
	itemsUpdateMetadata: ItemsUpdateMetadataResponseSchema,
	itemsDelete: ItemsDeleteResponseSchema,
	itemsDeletePermanently: ItemsDeletePermanentlyResponseSchema,
	itemsCopy: ItemsCopyResponseSchema,
	itemsMove: ItemsMoveResponseSchema,
	itemsRestore: ItemsRestoreResponseSchema,
	itemsSearch: ItemsSearchResponseSchema,
	itemsCheckin: ItemsCheckinResponseSchema,
	itemsCheckout: ItemsCheckoutResponseSchema,
	itemsDiscardCheckout: ItemsDiscardCheckoutResponseSchema,
	itemsFollow: ItemsFollowResponseSchema,
	itemsUnfollow: ItemsUnfollowResponseSchema,
	itemsGetFollowed: ItemsGetFollowedResponseSchema,
	itemsGetVersions: ItemsGetVersionsResponseSchema,
	itemsGetThumbnails: ItemsGetThumbnailsResponseSchema,
	itemsDownload: ItemsDownloadResponseSchema,
	itemsDownloadByPath: ItemsDownloadByPathResponseSchema,
	itemsDownloadAsFormat: ItemsDownloadAsFormatResponseSchema,
	itemsDownloadVersion: ItemsDownloadVersionResponseSchema,
	itemsUpdateContent: ItemsUpdateContentResponseSchema,
	itemsPreview: ItemsPreviewResponseSchema,
	itemsGetDriveItemBySharingUrl: ItemsGetDriveItemBySharingUrlResponseSchema,
	itemsListFolderChildren: ItemsListFolderChildrenResponseSchema,
	itemsListActivities: ItemsListActivitiesResponseSchema,
	// Drive
	driveGet: DriveGetResponseSchema,
	driveGetGroup: DriveGetGroupResponseSchema,
	driveList: DriveListResponseSchema,
	driveGetRoot: DriveGetRootResponseSchema,
	driveGetSpecialFolder: DriveGetSpecialFolderResponseSchema,
	driveGetQuota: DriveGetQuotaResponseSchema,
	driveGetRecentItems: DriveGetRecentItemsResponseSchema,
	driveGetSharedItems: DriveGetSharedItemsResponseSchema,
	driveListActivities: DriveListActivitiesResponseSchema,
	driveListChanges: DriveListChangesResponseSchema,
	driveListBundles: DriveListBundlesResponseSchema,
	// Files
	filesCreateFolder: FilesCreateFolderResponseSchema,
	filesCreateTextFile: FilesCreateTextFileResponseSchema,
	filesFindFile: FilesFindFileResponseSchema,
	filesFindFolder: FilesFindFolderResponseSchema,
	filesList: FilesListResponseSchema,
	filesUpload: FilesUploadResponseSchema,
	// Permissions
	permissionsGetForItem: PermissionsGetForItemResponseSchema,
	permissionsCreateForItem: PermissionsCreateForItemResponseSchema,
	permissionsUpdateForItem: PermissionsUpdateForItemResponseSchema,
	permissionsDeleteFromItem: PermissionsDeleteFromItemResponseSchema,
	permissionsInviteUser: PermissionsInviteUserResponseSchema,
	permissionsCreateLink: PermissionsCreateLinkResponseSchema,
	permissionsListSharePermissions:
		PermissionsListSharePermissionsResponseSchema,
	permissionsDeleteSharePermission:
		PermissionsDeleteSharePermissionResponseSchema,
	permissionsGrantSharePermission:
		PermissionsGrantSharePermissionResponseSchema,
	permissionsGetShare: PermissionsGetShareResponseSchema,
	// SharePoint
	sharepointGetSite: SharepointGetSiteResponseSchema,
	sharepointGetSitePage: SharepointGetSitePageResponseSchema,
	sharepointGetListItems: SharepointGetListItemsResponseSchema,
	sharepointListSiteLists: SharepointListSiteListsResponseSchema,
	sharepointListSiteColumns: SharepointListSiteColumnsResponseSchema,
	sharepointListSiteSubsites: SharepointListSiteSubsitesResponseSchema,
	sharepointListListItemsDelta: SharepointListListItemsDeltaResponseSchema,
	sharepointListSiteItemsDelta: SharepointListSiteItemsDeltaResponseSchema,
	// Subscriptions
	subscriptionsList: SubscriptionsListResponseSchema,
} as const;
