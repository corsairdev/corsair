import { z } from 'zod';

const id = z.string().min(1);
const numericId = z.union([
	id,
	z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
]);
const fields = z.string().min(1).optional();
const cursor = z.string().min(1).optional();
const pageSize = z.number().int().positive().optional();
const listOptions = {
	fields,
	limit: pageSize,
	after: cursor,
	before: cursor,
};
const cursorOptions = { limit: pageSize, after: cursor, before: cursor };
const status = z.enum(['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED']);
const budget = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const suggestionObjective = z.enum([
	'APP_INSTALLS',
	'BRAND_AWARENESS',
	'CONVERSIONS',
	'EVENT_RESPONSES',
	'LEAD_GENERATION',
	'LINK_CLICKS',
	'LOCAL_AWARENESS',
	'MESSAGES',
	'OFFER_CLAIMS',
	'OUTCOME_APP_PROMOTION',
	'OUTCOME_AWARENESS',
	'OUTCOME_ENGAGEMENT',
	'OUTCOME_LEADS',
	'OUTCOME_SALES',
	'OUTCOME_TRAFFIC',
	'PAGE_LIKES',
	'POST_ENGAGEMENT',
	'PRODUCT_CATALOG_SALES',
	'REACH',
	'STORE_VISITS',
	'VIDEO_VIEWS',
]);
const suggestionOptimizationGoal = z.enum([
	'NONE',
	'APP_INSTALLS',
	'AD_RECALL_LIFT',
	'ENGAGED_USERS',
	'EVENT_RESPONSES',
	'IMPRESSIONS',
	'LEAD_GENERATION',
	'QUALITY_LEAD',
	'LINK_CLICKS',
	'OFFSITE_CONVERSIONS',
	'PAGE_LIKES',
	'POST_ENGAGEMENT',
	'QUALITY_CALL',
	'REACH',
	'LANDING_PAGE_VIEWS',
	'VISIT_INSTAGRAM_PROFILE',
	'ENGAGED_PAGE_VIEWS',
	'VALUE',
	'THRUPLAY',
	'DERIVED_EVENTS',
	'APP_INSTALLS_AND_OFFSITE_CONVERSIONS',
	'CONVERSATIONS',
	'IN_APP_VALUE',
	'MESSAGING_PURCHASE_CONVERSION',
	'MESSAGING_DEEP_CONVERSATION_AND_FOLLOW',
	'SUBSCRIBERS',
	'REMINDERS_SET',
	'MEANINGFUL_CALL_ATTEMPT',
	'PROFILE_VISIT',
	'PROFILE_AND_PAGE_ENGAGEMENT',
	'ADVERTISER_SILOED_VALUE',
	'AUTOMATIC_OBJECTIVE',
	'MESSAGING_APPOINTMENT_CONVERSION',
]);

// Meta objects have a large, versioned set of optional fields. `passthrough`
// keeps documented forward-compatible response fields while validating IDs.
export const MetaAdsObjectSchema = z
	.object({
		id: z.string(),
		account_id: z.string().optional(),
		name: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		configured_status: z.string().nullable().optional(),
		effective_status: z.string().nullable().optional(),
	})
	.passthrough();

const MetaAdsPagingSchema = z.object({
	cursors: z
		.object({ before: z.string().optional(), after: z.string().optional() })
		.optional(),
	hasNextPage: z.boolean(),
});

export const MetaAdsListSchema = z.object({
	data: z.array(MetaAdsObjectSchema),
	paging: MetaAdsPagingSchema.optional(),
});

const StudyActorSchema = z
	.object({ id: z.string(), name: z.string().optional() })
	.passthrough();
const AdRuleSchema = z
	.object({
		id: z.string(),
		account_id: z.string().optional(),
		created_by: StudyActorSchema.optional(),
		created_time: z.string().optional(),
		disable_error_code: z.number().int().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		updated_time: z.string().optional(),
	})
	.passthrough();
const AdRuleListSchema = z.object({
	data: z.array(AdRuleSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const AdStudySchema = z
	.object({
		id: z.string(),
		business: StudyActorSchema.nullable().optional(),
		canceled_time: z.string().nullable().optional(),
		cooldown_start_time: z.string().nullable().optional(),
		created_by: StudyActorSchema.nullable().optional(),
		created_time: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		end_time: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		observation_end_time: z.string().nullable().optional(),
		results_first_available_date: z.string().nullable().optional(),
		start_time: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		updated_by: StudyActorSchema.nullable().optional(),
		updated_time: z.string().nullable().optional(),
	})
	.passthrough();
const AdStudyListSchema = z.object({
	data: z.array(AdStudySchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const StudyViewersListSchema = z.object({
	data: z.array(StudyActorSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
// Graph may add preview fields; keep the documented HTML body and pass the rest through.
const AdPreviewSchema = z.object({ body: z.string() }).passthrough();
const AdPreviewsListSchema = z.object({
	data: z.array(AdPreviewSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const CreativeInsightValueSchema = z
	.object({ key: z.string(), value: z.string() })
	.passthrough();
const CreativeInsightsSchema = z
	.object({ aesthetics: z.array(CreativeInsightValueSchema).optional() })
	.passthrough();
const CreativeInsightsListSchema = z.object({
	data: z.array(CreativeInsightsSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const AudienceAdAccountSchema = z.object({ id: z.string() }).passthrough();
const AudienceAdAccountsListSchema = z.object({
	data: z.array(AudienceAdAccountSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const StudyCreateSchema = z
	.object({
		id: z.string(),
		cell_ids: z.array(z.string()).optional(),
		objective_ids: z.array(z.string()).optional(),
	})
	.passthrough();
const StudyUpdateSchema = z
	.object({
		success: z.boolean(),
		cell_ids: z.array(z.string()).optional(),
		objective_ids: z.array(z.string()).optional(),
	})
	.passthrough();

export const MetaAdsMutationSchema = z
	.object({ id: z.string().optional(), success: z.boolean().optional() })
	.refine((value) => value.id !== undefined || value.success !== undefined);

export const MetaAdsDeleteSchema = z.object({ success: z.boolean() });

export const AccountListInputSchema = z
	.object({
		fields,
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
export const AccountGetInputSchema = z
	.object({ accountId: id, fields })
	.strict();
export const AccountSchema = MetaAdsObjectSchema;

export const AccountUsersListSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			name: z.string().optional(),
			tasks: z.array(z.string()).optional(),
		}),
	),
	paging: MetaAdsListSchema.shape.paging,
});

// AdImage adds documented fields over time; validate known fields and pass through the rest.
const AdImageSchema = z
	.object({
		hash: z.string(),
		id: z.string().optional(),
		account_id: z.string().optional(),
		created_time: z.string().optional(),
		creatives: z.array(z.string()).optional(),
		height: z.number().int().optional(),
		name: z.string().optional(),
		original_height: z.number().int().optional(),
		original_width: z.number().int().optional(),
		permalink_url: z.string().optional(),
		// Known values ACTIVE, INTERNAL, DELETED; open so a new Meta status doesn't fail the read.
		status: z.enum(['ACTIVE', 'INTERNAL', 'DELETED']).or(z.string()).optional(),
		updated_time: z.string().optional(),
		url: z.string().optional(),
		url_128: z.string().optional(),
		width: z.number().int().optional(),
	})
	.passthrough();
const AdImagesListSchema = z.object({
	data: z.array(AdImageSchema),
	paging: MetaAdsListSchema.shape.paging,
	summary: z.object({ total_count: z.number().int().optional() }).optional(),
});
const AdImageListInput = z
	.object({
		accountId: id,
		name: z.string().min(1).optional(),
		hashes: z.array(z.string().min(1)).min(1).optional(),
		minHeight: z.number().int().positive().optional(),
		minWidth: z.number().int().positive().optional(),
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
const AdImageBase64 = z
	.string()
	.min(4)
	.regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
const AdImageUploadInput = z.union([
	z.object({ accountId: id, bytes: AdImageBase64 }).strict(),
	z
		.object({
			accountId: id,
			copyFrom: z
				.object({ sourceAccountId: id, hash: z.string().min(1) })
				.strict(),
		})
		.strict(),
]);
const AdImageUploadSchema = z.object({
	images: z.record(
		z.string(),
		z.object({
			hash: z.string(),
			url: z.string().optional(),
			url_128: z.string().optional(),
			url_256: z.string().optional(),
			url_256_height: z.number().int().optional(),
			url_256_width: z.number().int().optional(),
			height: z.number().int().optional(),
			width: z.number().int().optional(),
			name: z.string().optional(),
		}),
	),
});
const AdImageDeleteInput = z
	.object({ accountId: id, hash: z.string().min(1), imageId: id.optional() })
	.strict();

const accountListInput = AccountListInputSchema;
const accountListOutput = MetaAdsListSchema;
const accountGetInput = AccountGetInputSchema;
const accountGetOutput = AccountSchema;
const accountUsersListInput = z
	.object({ accountId: id, limit: pageSize, after: cursor, before: cursor })
	.strict();
const accountActivitiesListInput = z
	.object({ accountId: id, ...cursorOptions })
	.strict();
const accountAssignedUsersListInput = z
	.object({ accountId: id, businessId: id, ...cursorOptions })
	.strict();
const accountAssignUserInput = z
	.object({
		accountId: id,
		userId: id,
		tasks: z
			.array(z.enum(['MANAGE', 'ADVERTISE', 'ANALYZE', 'DRAFT', 'AA_ANALYZE']))
			.optional(),
	})
	.strict();
const accountRemoveUserInput = z.object({ accountId: id, userId: id }).strict();
const accountControlsCreateInput = z
	.object({
		accountId: id,
		audienceControls: z
			.object({
				ageMin: z.number().int().nonnegative(),
				// Meta defines these as advanced-targeting JSON; its nested catalog is versioned and extensible.
				geoLocations: z.record(z.string(), z.unknown()).optional(),
				// `unknown` is needed for Meta's documented nested targeting exclusion structures.
				excludedGeoLocations: z.record(z.string(), z.unknown()).optional(),
				// `unknown` is needed for the provider-defined audience-control exclusion JSON.
				exclusions: z.record(z.string(), z.unknown()).optional(),
			})
			.strict(),
		placementControls: z
			.object({
				placementExclusions: z
					.array(
						z.enum([
							'AUDIENCE_NETWORK_CLASSIC',
							'AUDIENCE_NETWORK_REWARDED_VIDEO',
							'AUDIENCE_NETWORK_INSTREAM_VIDEO',
							'FACEBOOK_MARKETPLACE',
							'FACEBOOK_RIGHT_HAND_COLUMN',
						]),
					)
					.optional(),
				campaignIdsToSetAp: z.array(id).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const accountAgenciesListInput = z
	.object({ accountId: id, ...cursorOptions })
	.strict();
const accountAgencyRemoveInput = z
	.object({ accountId: id, businessId: id })
	.strict();
const accountSubscribedAppInput = z
	.object({ accountId: id, appId: id.optional() })
	.strict();
const accountTrackingCreateInput = z
	.object({
		accountId: id,
		// Meta documents tracking_specs only as a generic Object, with no nested field contract.
		trackingSpecs: z.record(z.string(), z.unknown()),
	})
	.strict();
const accountPixelCreateInput = z
	.object({ accountId: id, name: z.string().min(1).optional() })
	.strict();
const accountPixelsListInput = z
	.object({ accountId: id, ...cursorOptions })
	.strict();
const pixelFields = z.enum([
	'id',
	'automatic_matching_fields',
	'can_proxy',
	'code',
	'config',
	'creation_time',
	'data_use_setting',
	'description',
	'duplicate_entries',
	'enable_auto_assign_to_accounts',
	'enable_automatic_matching',
	'event_stats',
	'event_time_max',
	'event_time_min',
	'first_party_cookie_status',
	'has_1p_pixel_event',
	'is_consolidated_container',
	'is_created_by_business',
	'is_crm',
	'is_mta_use',
	'is_restricted_use',
	'is_unavailable',
	'last_fired_time',
	'last_upload_app',
	'last_upload_app_changed_time',
	'match_rate_approx',
	'matched_entries',
	'name',
	'valid_entries',
]);
const pixelGetInput = z
	.object({ pixelId: id, fields: z.array(pixelFields).min(1).optional() })
	.strict();
// Response objects stay open: Meta adds pixel fields between versions.
const pixelSchema = z
	.object({
		id,
		automatic_matching_fields: z.array(z.string()).optional(),
		can_proxy: z.boolean().optional(),
		code: z.string().optional(),
		config: z.string().optional(),
		creation_time: z.string().optional(),
		data_use_setting: z.string().optional(),
		description: z.string().optional(),
		duplicate_entries: z.number().int().optional(),
		enable_auto_assign_to_accounts: z.boolean().optional(),
		enable_automatic_matching: z.boolean().optional(),
		event_stats: z.string().optional(),
		event_time_max: z.number().int().optional(),
		event_time_min: z.number().int().optional(),
		first_party_cookie_status: z.string().optional(),
		has_1p_pixel_event: z.boolean().optional(),
		is_consolidated_container: z.boolean().optional(),
		is_created_by_business: z.boolean().optional(),
		is_crm: z.boolean().optional(),
		is_mta_use: z.boolean().optional(),
		is_restricted_use: z.boolean().optional(),
		is_unavailable: z.boolean().optional(),
		last_fired_time: z.string().optional(),
		last_upload_app: z.string().optional(),
		last_upload_app_changed_time: z.number().int().optional(),
		match_rate_approx: z.number().int().optional(),
		matched_entries: z.number().int().optional(),
		name: z.string().optional(),
		valid_entries: z.number().int().optional(),
	})
	.passthrough();
const accountPixelsListSchema = z.object({
	data: z.array(pixelSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
	summary: z
		.object({ total_count: z.number().int().nonnegative().optional() })
		.optional(),
});
const pixelUpdateInput = z
	.object({
		pixelId: id,
		automaticMatchingFields: z
			.array(
				z.enum([
					'em',
					'fn',
					'ln',
					'ph',
					'ge',
					'zp',
					'ct',
					'st',
					'country',
					'db',
					'external_id',
				]),
			)
			.optional(),
		dataUseSetting: z
			.enum(['EMPTY', 'ADVERTISING_AND_ANALYTICS', 'ANALYTICS_ONLY'])
			.optional(),
		enableAutomaticMatching: z.boolean().optional(),
		firstPartyCookieStatus: z
			.enum([
				'EMPTY',
				'FIRST_PARTY_COOKIE_ENABLED',
				'FIRST_PARTY_COOKIE_DISABLED',
			])
			.optional(),
		name: z.string().min(1).optional(),
		serverEventsBusinessIds: z.array(id).optional(),
		serverEventsBusinessIdsAdd: z.array(id).optional(),
		serverEventsBusinessIdsRemove: z.array(id).optional(),
	})
	.strict()
	.refine((value) =>
		Object.entries(value).some(
			([key, fieldValue]) => key !== 'pixelId' && fieldValue !== undefined,
		),
	);
const pixelUpdateOutput = z.object({ success: z.boolean() });
const publisherBlockListCreateInput = z
	.object({ accountId: id, name: z.string().min(1).optional() })
	.strict();
const accountPlacePageSetsCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1),
		parentPageId: id,
		locationTypes: z.array(z.enum(['recent', 'home'])).optional(),
	})
	.strict();
const customConversionCreateInput = z
	.object({
		accountId: id,
		actionSourceType: z
			.enum([
				'app',
				'chat',
				'email',
				'other',
				'phone_call',
				'physical_store',
				'system_generated',
				'website',
				'business_messaging',
			])
			.optional(),
		advancedRule: z.string().optional(),
		customEventType: z
			.enum([
				'ADD_PAYMENT_INFO',
				'ADD_TO_CART',
				'ADD_TO_WISHLIST',
				'COMPLETE_REGISTRATION',
				'CONTENT_VIEW',
				'INITIATED_CHECKOUT',
				'LEAD',
				'PURCHASE',
				'SEARCH',
				'CONTACT',
				'CUSTOMIZE_PRODUCT',
				'DONATE',
				'FIND_LOCATION',
				'SCHEDULE',
				'START_TRIAL',
				'SUBMIT_APPLICATION',
				'SUBSCRIBE',
				'LISTING_INTERACTION',
				'FACEBOOK_SELECTED',
				'OTHER',
			])
			.optional(),
		defaultConversionValue: z.number().finite().optional(),
		description: z.string().optional(),
		eventSourceId: numericId.optional(),
		name: z.string().min(1),
		rule: z.string().optional(),
	})
	.strict();
const CustomConversionCreateSchema = z.object({
	id,
	is_custom_event_type_predicted: z.string(),
});
const audienceTermsAcceptInput = z
	.object({ accountId: id, termsId: id, businessId: id.optional() })
	.strict();
const CreatedIdSchema = z.object({ id });
// Meta documents an evolving event_type catalog; event records retain only documented fields plus forward-compatible JSON.
const AccountActivitySchema = z
	.object({
		actor_id: z.string().optional(),
		actor_name: z.string().optional(),
		application_id: z.string().optional(),
		application_name: z.string().optional(),
		date_time_in_timezone: z.string().optional(),
		event_time: z.string().optional(),
		event_type: z.string(),
		extra_data: z.string().optional(),
		object_id: z.string().optional(),
		object_name: z.string().optional(),
		object_type: z.string().optional(),
		translated_event_type: z.string().optional(),
	})
	.passthrough();
export const AccountActivitiesListSchema = z.object({
	data: z.array(AccountActivitySchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const AccountAssignedUsersListSchema = z.object({
	data: z.array(
		z.object({
			id,
			permitted_tasks: z.array(z.string()).optional(),
			tasks: z.array(z.string()),
		}),
	),
	paging: MetaAdsListSchema.shape.paging.optional(),
	summary: z
		.object({ total_count: z.number().int().nonnegative().optional() })
		.optional(),
});
const AccountAgencySchema = z.object({
	id,
	access_requested_time: z.string().optional(),
	access_status: z.string().optional(),
	access_updated_time: z.string().optional(),
	permitted_tasks: z.array(z.string()).optional(),
});
const AccountAgenciesListSchema = z.object({
	data: z.array(AccountAgencySchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const AccountControlCreateSchema = z
	.object({
		id: z.string().optional(),
		success: z.boolean().optional(),
		error_code: z.string().optional(),
		error_message: z.string().optional(),
	})
	.refine((value) => value.id !== undefined || value.success !== undefined);
const AccountMutationSchema = z.object({ success: z.boolean() });
const BroadTargetingCategoriesListSchema = z.object({
	data: z.array(
		z.object({
			id: z.union([z.string(), z.number().int()]),
			name: z.string(),
			parent_category: z.string().optional(),
			size_lower_bound: z.number().int().optional(),
			size_upper_bound: z.number().int().optional(),
			type: z.number().int().optional(),
			type_name: z.string().optional(),
		}),
	),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const videosDeleteInput = z.object({ accountId: id, videoId: id }).strict();

const asyncSetFields = z.enum([
	'id',
	'owner_id',
	'name',
	'is_completed',
	'total_count',
	'initial_count',
	'in_progress_count',
	'success_count',
	'error_count',
	'canceled_count',
	'notification_mode',
]);
const asyncRequestFields = z.enum(['id', 'scope_object_id', 'status']);
const asyncRequestStatus = z.enum([
	'INITIAL',
	'IN_PROGRESS',
	'SUCCESS',
	'ERROR',
	'CANCELED',
	'PENDING_DEPENDENCY',
	'CANCELED_DEPENDENCY',
	'ERROR_DEPENDENCY',
	'ERROR_CONFLICTS',
	'USER_CANCELED',
	'USER_CANCELED_DEPENDENCY',
	'PROCESS_BY_EVENT_PROCESSOR',
	'PROCESS_BY_AD_ASYNC_ENGINE',
	'Initial',
	'In_progress',
	'Success',
	'Error',
	'Canceled',
]);
const asyncSetListInput = z
	.object({
		accountId: id,
		isCompleted: z.boolean().optional(),
		...cursorOptions,
	})
	.strict();
const asyncAdSpec = z.record(z.string().min(1), z.string());
const asyncRequestSetCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1),
		adSpecs: z.array(asyncAdSpec).min(1),
	})
	.strict();
const asyncSetGetInput = z
	.object({
		requestSetId: numericId,
		fields: z.array(asyncSetFields).min(1).optional(),
	})
	.strict();
const asyncSetUpdateInput = z
	.object({ requestSetId: numericId, name: z.string().min(1) })
	.strict();
const asyncSetCancelInput = z.object({ requestSetId: numericId }).strict();
const asyncRequestListInput = z
	.object({
		requestSetId: numericId,
		status: z.array(asyncRequestStatus).min(1).optional(),
		fields: z.array(asyncRequestFields).min(1).optional(),
		...cursorOptions,
	})
	.strict();
const asyncRequestsForAdSetListInput = z
	.object({
		adSetId: id,
		status: z.array(asyncRequestStatus).min(1).optional(),
		fields: z.array(asyncRequestFields).min(1).optional(),
		...cursorOptions,
	})
	.strict();
const asyncRequestCancelInput = z.object({ requestId: numericId }).strict();

const AsyncRequestSetSchema = z
	.object({
		id: numericId,
		owner_id: numericId.optional(),
		name: z.string().optional(),
		is_completed: z.boolean().optional(),
		total_count: z.number().int().optional(),
		initial_count: z.number().int().optional(),
		in_progress_count: z.number().int().optional(),
		success_count: z.number().int().optional(),
		error_count: z.number().int().optional(),
		canceled_count: z.number().int().optional(),
		notification_mode: z.enum(['OFF', 'ON_COMPLETE']).or(z.string()).optional(),
	})
	.passthrough();
const AsyncRequestSchema = z
	.object({
		id: numericId,
		scope_object_id: numericId.optional(),
		// Open so a status Meta adds later doesn't fail the list.
		status: asyncRequestStatus.or(z.string()).optional(),
	})
	.passthrough();
const AsyncRequestSetsListSchema = z.object({
	data: z.array(AsyncRequestSetSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const AsyncRequestsListSchema = z.object({
	data: z.array(AsyncRequestSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const AsyncRequestSetCreateSchema = z.object({
	id: numericId,
});
// Graph answers these node writes with `true` or `{ success: true }` depending on the node version.
const GraphBooleanResultSchema = z.union([
	z.literal(true),
	z.object({ success: z.boolean() }).passthrough(),
]);
const AsyncRequestSetUpdateSchema = GraphBooleanResultSchema;

const adLabelListInput = z.object({ accountId: id, ...cursorOptions }).strict();
const adLabelGetInput = z.object({ labelId: id, fields }).strict();
const adLabelCreateInput = z
	.object({ accountId: id, name: z.string().min(1) })
	.strict();
const adLabelUpdateInput = z
	.object({ labelId: id, name: z.string().min(1) })
	.strict();
const adLabelDeleteInput = z.object({ labelId: id }).strict();
const adLabelReferenceInput = z.union([
	z.object({ id }).strict(),
	z.object({ name: z.string().min(1) }).strict(),
]);
const labelAssociationFields = {
	adlabels: z.array(adLabelReferenceInput).min(1).max(50),
	executionOptions: z.array(z.literal('validate_only')).optional(),
};
const campaignLabelsAddInput = z
	.object({ campaignId: id, ...labelAssociationFields })
	.strict();
const adLabelsAddInput = z
	.object({ adId: id, ...labelAssociationFields })
	.strict();
const creativeLabelsAddInput = z
	.object({ creativeId: id, adlabels: labelAssociationFields.adlabels })
	.strict();
const adLabelCampaignsListInput = z
	.object({ labelId: id, ...cursorOptions })
	.strict();
const adLabelAdSetsListInput = z
	.object({ labelId: id, ...cursorOptions })
	.strict();
const adLabelAdsListInput = z
	.object({ labelId: id, ...cursorOptions })
	.strict();
const adLabelCreativesListInput = z
	.object({ labelId: id, ...cursorOptions })
	.strict();
const AdLabelAssociationSchema = z.object({ success: z.boolean() });
const AdLabelSchema = z
	.object({
		id: id,
		name: z.string().optional(),
		created_time: z.string().optional(),
		updated_time: z.string().optional(),
	})
	.passthrough();
const AdLabelsListSchema = z.object({
	data: z.array(AdLabelSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
	summary: z.object({ total_count: z.number().int().optional() }).optional(),
});

const campaignListInput = z.object({ accountId: id, ...listOptions }).strict();
const campaignAdSetsListInput = z
	.object({ campaignId: id, ...listOptions })
	.strict();
const campaignAdsListInput = z
	.object({ campaignId: id, ...listOptions })
	.strict();
const campaignCopiesListInput = z
	.object({ campaignId: id, ...listOptions })
	.strict();
const renameOptionsInput = z
	.object({
		renameStrategy: z
			.enum(['DEEP_RENAME', 'ONLY_TOP_LEVEL_RENAME', 'NO_RENAME'])
			.optional(),
		renamePrefix: z.string().max(100).optional(),
		renameSuffix: z.string().max(100).optional(),
	})
	.strict();
const campaignCopyInput = z
	.object({ campaignId: id, renameOptions: renameOptionsInput.optional() })
	.strict();
const budgetScheduleRange = z.union([
	z.number().int().positive(),
	z.string().min(1),
]);
const campaignBudgetSchedulesListInput = z
	.object({
		campaignId: id,
		timeStart: budgetScheduleRange.optional(),
		timeStop: budgetScheduleRange.optional(),
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
const campaignBudgetScheduleCreateInput = z
	.object({
		campaignId: id,
		budgetValue: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		budgetValueType: z.enum(['ABSOLUTE', 'MULTIPLIER']),
		timeStart: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		timeEnd: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
	})
	.strict()
	.refine((value) => value.timeEnd > value.timeStart)
	.refine((value) => value.timeEnd - value.timeStart >= 10_800);
const campaignGetInput = z.object({ campaignId: id, fields }).strict();
const campaignAdStudiesListInput = z
	.object({ campaignId: id, ...cursorOptions })
	.strict();
const accountImpactingAdStudiesListInput = z
	.object({ accountId: id, ...cursorOptions })
	.strict();
const accountAdRulesLibraryListInput = z
	.object({ accountId: id, ...cursorOptions })
	.strict();
const accountActiveAdRulesListInput = z
	.object({
		accountId: id,
		selectedIds: z.array(id).min(1),
		passEvaluation: z.boolean().optional(),
		...cursorOptions,
	})
	.strict();
const adRuleComparisonOperator = z.enum([
	'GREATER_THAN',
	'LESS_THAN',
	'EQUAL',
	'NOT_EQUAL',
	'IN_RANGE',
	'NOT_IN_RANGE',
	'IN',
	'NOT_IN',
	'CONTAIN',
	'NOT_CONTAIN',
	'ANY',
	'ALL',
	'NONE',
]);
// `unknown` is needed for documented provider-defined Ad Rule filter and action values, which may be objects.
const adRuleDynamicValue = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.array(z.union([z.string(), z.number(), z.boolean()])),
	z.record(z.string(), z.unknown()),
]);
const adRuleEvaluationSpec = z
	.object({
		evaluationType: z.enum(['SCHEDULE', 'TRIGGER']),
		filters: z
			.array(
				z
					.object({
						field: z.string().min(1),
						value: adRuleDynamicValue,
						operator: adRuleComparisonOperator,
					})
					.strict(),
			)
			.min(1),
		trigger: z
			.object({
				type: z.enum([
					'METADATA_CREATION',
					'METADATA_UPDATE',
					'STATS_MILESTONE',
					'STATS_CHANGE',
					'DELIVERY_INSIGHTS_CHANGE',
				]),
				field: z.string().min(1).optional(),
				value: adRuleDynamicValue.optional(),
				operator: adRuleComparisonOperator.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const adRuleExecutionSpec = z
	.object({
		executionType: z.enum([
			'DCO',
			'PAUSE',
			'REBALANCE_BUDGET',
			'CHANGE_BUDGET',
			'CHANGE_BID',
			'ROTATE',
			'UNPAUSE',
			'CHANGE_CAMPAIGN_BUDGET',
			'ADD_INTEREST_RELAXATION',
			'ADD_QUESTIONNAIRE_INTERESTS',
			'INCREASE_RADIUS',
			'UPDATE_CREATIVE',
			'UPDATE_LAX_BUDGET',
			'UPDATE_LAX_DURATION',
			'AUDIENCE_CONSOLIDATION',
			'AUDIENCE_CONSOLIDATION_ASK_FIRST',
			'AD_RECOMMENDATION_APPLY',
		]),
		isOnceOff: z.boolean().optional(),
		executionOptions: z
			.array(
				z
					.object({
						field: z.string().min(1),
						value: adRuleDynamicValue,
						operator: z.enum(['EQUAL', 'IN']),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
const adRuleScheduleSpec = z
	.object({
		scheduleType: z.enum(['DAILY', 'HOURLY', 'SEMI_HOURLY', 'CUSTOM']),
		schedule: z
			.array(
				z
					.object({
						startMinute: z.number().int().optional(),
						endMinute: z.number().int().optional(),
						days: z.array(z.number().int()).optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
const accountAdRuleCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1),
		evaluationSpec: adRuleEvaluationSpec,
		executionSpec: adRuleExecutionSpec,
		scheduleSpec: adRuleScheduleSpec.optional(),
		status: z.enum(['ENABLED', 'DISABLED', 'DELETED', 'HAS_ISSUES']).optional(),
	})
	.strict()
	.refine(
		(value) =>
			value.evaluationSpec.evaluationType !== 'TRIGGER' ||
			value.evaluationSpec.trigger !== undefined,
	)
	.refine(
		(value) =>
			value.evaluationSpec.evaluationType !== 'SCHEDULE' ||
			value.scheduleSpec !== undefined,
	);
const accountBroadTargetingCategoriesListInput = z
	.object({
		accountId: id,
		customCategoriesOnly: z.boolean().optional(),
		...cursorOptions,
	})
	.strict();
const accountSmartSuggestedAdsListInput = z
	.object({
		accountId: id,
		objective: suggestionObjective.optional(),
		optimizationGoal: suggestionOptimizationGoal.optional(),
		pixelId: id.optional(),
		productSetId: id.optional(),
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
const accountSuggestedAdsListInput = z
	.object({
		accountId: id,
		applicationId: id.optional(),
		cmsId: id.optional(),
		countries: z.array(z.string().min(1)).optional(),
		objective: z.string().min(1).optional(),
		optimizationGoal: suggestionOptimizationGoal.optional(),
		pixelId: id.optional(),
		promotedObjectPageId: id.optional(),
		promotedObjectProductSetId: id.optional(),
		rankBy: z.string().min(1).optional(),
		useCase: z
			.enum([
				'AD_STRATEGIES',
				'AUTOMATED_APP_ADS',
				'AUTOMATED_SHOPPING_ADS',
				'AUTOMATED_SHOPPING_ADS_MDSA',
				'LEAD_GEN_ASC_ADS',
				'MANUAL_FLOW_APP_ADS',
				'MANUAL_FLOW_SHOPS_ADS',
				'MANUAL_FLOW_WEBSITE_ADS',
				'MANUAL_FLOW_WEBSITE_AND_APP_ADS',
				'SALES_WEB_APP_ADS',
			])
			.optional(),
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
// `unknown` is needed for nested targeting keys documented by Meta's separate, versioned Targeting contract.
const reachEstimateTargetingSpec = z
	.record(z.string(), z.unknown())
	.refine((value) => {
		const geoLocations = z
			.record(z.string(), z.unknown())
			.safeParse(value.geo_locations);
		return (
			geoLocations.success &&
			z.array(z.string().min(2)).min(1).safeParse(geoLocations.data.countries)
				.success
		);
	});
const accountReachEstimateInput = z
	.object({
		accountId: id,
		objectStoreUrl: z.string().url().optional(),
		targetingSpec: reachEstimateTargetingSpec,
	})
	.strict();
// AdAccountReachEstimate also returns `estimate_ready`; keep the node open for fields Meta adds.
const ReachEstimateSchema = z
	.object({
		users_lower_bound: z.number().int(),
		users_upper_bound: z.number().int(),
		estimate_ready: z.boolean().optional(),
	})
	.passthrough();
const ReachEstimateResponseSchema = z
	.object({
		data: ReachEstimateSchema,
		paging: MetaAdsListSchema.shape.paging.optional(),
	})
	.passthrough();
const reachFrequencyPredictionFields = z.enum([
	'id',
	'account_id',
	'audience_size_lower_bound',
	'audience_size_upper_bound',
	'campaign_group_id',
	'campaign_id',
	'campaign_time_start',
	'campaign_time_stop',
	'curve_budget_reach',
	'daily_impression_curve',
	'destination_id',
	'expiration_time',
	'external_budget',
	'external_impression',
	'external_maximum_budget',
	'external_maximum_impression',
	'external_maximum_reach',
	'external_minimum_budget',
	'external_minimum_impression',
	'external_minimum_reach',
	'external_reach',
	'frequency_cap',
	'frequency_distribution_map',
	'frequency_distribution_map_agg',
	'grp_dmas_audience_size',
	'holdout_percentage',
	'instagram_destination_id',
	'interval_frequency_cap',
	'interval_frequency_cap_reset_period',
	'is_io',
	'name',
	'placement_breakdown',
	'prediction_mode',
	'prediction_progress',
	'reservation_status',
	'status',
	'story_event_type',
	'target_spec',
	'time_created',
	'time_updated',
]);
const reachFrequencyPredictionSchema = z
	.object({
		id,
		account_id: z.union([z.string(), z.number().int()]).optional(),
		audience_size_lower_bound: z.number().int().nonnegative().optional(),
		audience_size_upper_bound: z.number().int().nonnegative().optional(),
		campaign_group_id: numericId.optional(),
		campaign_id: id.optional(),
		campaign_time_start: z.string().optional(),
		campaign_time_stop: z.string().optional(),
		curve_budget_reach: z.string().optional(),
		daily_impression_curve: z.array(z.number()).optional(),
		destination_id: numericId.optional(),
		expiration_time: z.string().optional(),
		external_budget: z.number().int().optional(),
		external_impression: z.number().int().nonnegative().optional(),
		external_maximum_budget: z.number().int().optional(),
		external_maximum_impression: z.number().int().nonnegative().optional(),
		external_maximum_reach: z.number().int().nonnegative().optional(),
		external_minimum_budget: z.number().int().optional(),
		external_minimum_impression: z.number().int().nonnegative().optional(),
		external_minimum_reach: z.number().int().nonnegative().optional(),
		external_reach: z.number().int().nonnegative().optional(),
		frequency_cap: z.number().int().nonnegative().optional(),
		frequency_distribution_map: z
			.array(
				z.object({
					key: z.number().int().nonnegative(),
					value: z.array(z.number().nonnegative()),
				}),
			)
			.optional(),
		frequency_distribution_map_agg: z
			.array(
				z.object({
					key: z.number().int().nonnegative(),
					value: z.array(z.number().int().nonnegative()),
				}),
			)
			.optional(),
		grp_dmas_audience_size: z.number().nonnegative().optional(),
		holdout_percentage: z.number().int().min(0).max(100).optional(),
		instagram_destination_id: id.optional(),
		interval_frequency_cap: z.number().int().nonnegative().optional(),
		interval_frequency_cap_reset_period: z.number().int().positive().optional(),
		is_io: z.boolean().optional(),
		name: z.string().optional(),
		placement_breakdown: z
			.object({
				msite: z.number().optional(),
				android: z.number().optional(),
				ios: z.number().optional(),
				desktop: z.number().optional(),
				ig_android: z.number().optional(),
				ig_ios: z.number().optional(),
				ig_reels: z.number().optional(),
				ig_story: z.number().optional(),
				explore_home: z.number().optional(),
				ig_others: z.number().optional(),
				audience_network: z.number().optional(),
				instant_articles: z.number().optional(),
				instream_videos: z.number().optional(),
				suggested_videos: z.number().optional(),
			})
			.passthrough()
			.optional(),
		// Documented codes: prediction_mode 0/1, reservation_status 0/1/2, story_event_type 0/128/256/384.
		// Kept as integers so a code Meta adds later doesn't fail the read.
		prediction_mode: z.number().int().optional(),
		prediction_progress: z.number().int().min(0).max(100).optional(),
		reservation_status: z.number().int().optional(),
		status: z.number().int().optional(),
		story_event_type: z.number().int().optional(),
		target_spec: z.string().optional(),
		time_created: z.string().optional(),
		time_updated: z.string().optional(),
	})
	.passthrough();
const reachFrequencyPredictionsListSchema = z.object({
	data: z.array(reachFrequencyPredictionSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const reachFrequencyPredictionGetInput = z
	.object({
		predictionId: id,
		fields: z.array(reachFrequencyPredictionFields).min(1).optional(),
	})
	.strict();
const reachFrequencyPredictionsListInput = z
	.object({
		accountId: id,
		fields: z.array(reachFrequencyPredictionFields).min(1).optional(),
		...cursorOptions,
	})
	.strict();
const reachFrequencyDayPart = z
	.object({
		startMinute: z.number().int().min(0).max(1439),
		endMinute: z.number().int().min(1).max(1440),
		days: z.array(z.number().int().min(0).max(6)).min(1),
		timezoneType: z.enum(['USER', 'ADVERTISER']).optional(),
	})
	.strict()
	.refine((value) => value.endMinute - value.startMinute >= 180);
const reachFrequencyTopicsSpec = z
	.object({
		isAllTrending: z.boolean().optional(),
		isSpecialBudgetAlloc: z.boolean().optional(),
		trendingTopics: z
			.array(
				z.enum([
					'TRENDING_ALL',
					'TRENDING_FASHION',
					'TRENDING_BEAUTY',
					'TRENDING_SPORTS',
					'TRENDING_FOOD',
					'TRENDING_CARS',
					'TRENDING_BEAUTY_FASHION',
					'TRENDING_FITNESS',
					'TRENDING_MOVIES',
					'TRENDING_PETS_ANIMALS',
					'TRENDING_VIDEO_GAMING',
					'TRENDING_ALL_VERIFIED',
					'TRENDING_MUSIC',
					'TRENDING_SUPERBOWL',
					'TRENDING_NBC_WINTER_OLYMPICS',
					'TRENDING_BASKETBALL',
					'TRENDING_TRAVEL',
					'TRENDING_BUSINESS_FINANCE',
					'TRENDING_BASKETBALL_NBA_PLAYOFFS',
					'TRENDING_DISNEY_WOMENS_MARCH_MADNESS_2026',
					'TRENDING_DISNEY_SPORTS',
					'TRENDING_VANITY_FAIR_OSCARS_2026',
					'TRENDING_VANITY_FAIR_ALL',
					'TRENDING_SOCCER',
					'TRENDING_ELECTRONICS_TECHNOLOGY',
					'TRENDING_HEALTH_WELLNESS',
					'TRENDING_DISNEY_NBA_2026',
					'TRENDING_VOGUE_METGALA_2026',
					'TRENDING_CONDE_METGALA_2026',
					'TRENDING_CONDE_ALL',
					'TRENDING_FOX_SPORTS',
					'TRENDING_NBC_LOVE_ISLAND_2026',
					'TRENDING_PEACOCK_ALL',
					'TRENDING_BACK_TO_SCHOOL',
					'TRENDING_CAR_RACING',
					'TRENDING_SPANISH',
					'TRENDING_BASKETBALL_PEAK_SEASON',
					'TRENDING_AGRIBUSINESS',
					'TRENDING_LIBERTADORES',
					'TRENDING_FOOTBALL',
					'TRENDING_TENNIS_US_OPEN',
					'TRENDING_LIBERTADORES_LALIGA',
					'POE_SPORTS',
					'POE_FOOD',
					'POE_TRAVEL',
					'POE_MOVIES',
					'POE_MUSIC',
					'POE_TOY',
				]),
			)
			.optional(),
	})
	.strict();
// `unknown` is needed for documented nested advanced-targeting keys; size/country limits are enforced at this boundary.
const reachFrequencyTargetSpec = z
	.record(z.string(), z.unknown())
	.refine((value) => {
		const serialized = JSON.stringify(value);
		if (typeof serialized !== 'string' || serialized.length > 65_000)
			return false;
		const geoLocations = z
			.record(z.string(), z.unknown())
			.safeParse(value.geo_locations);
		if (!geoLocations.success || geoLocations.data.countries === undefined) {
			return true;
		}
		const countries = z
			.array(z.string())
			.safeParse(geoLocations.data.countries);
		return !countries.success || countries.data.length <= 1;
	});
const reachFrequencyPredictionCreateInput = z
	.object({
		accountId: id,
		budget: z.number().int().positive().max(Number.MAX_SAFE_INTEGER).optional(),
		campaignGroupId: numericId.optional(),
		dayPartingSchedule: z.array(reachFrequencyDayPart).min(1).optional(),
		dealId: numericId.optional(),
		destinationId: numericId.optional(),
		destinationIds: z.array(numericId).min(1).optional(),
		endTime: z
			.number()
			.int()
			.positive()
			.max(Number.MAX_SAFE_INTEGER)
			.optional(),
		frequencyCap: z.number().int().positive().optional(),
		instreamPackages: z
			.array(
				z.enum([
					'NORMAL',
					'PREMIUM',
					'SPORTS',
					'ENTERTAINMENT',
					'BEAUTY',
					'FOOD',
					'SPANISH',
					'REGULAR_ANIMALS_PETS',
					'REGULAR_FOOD',
					'REGULAR_GAMES',
					'REGULAR_POLITICS',
					'REGULAR_SPORTS',
					'REGULAR_STYLE',
					'REGULAR_TV_MOVIES',
				]),
			)
			.optional(),
		intervalFrequencyCapResetPeriod: z
			.number()
			.int()
			.positive()
			.multipleOf(24)
			.optional(),
		numCurvePoints: z.number().int().positive().max(800).optional(),
		objective: z
			.enum([
				'BRAND_AWARENESS',
				'LINK_CLICKS',
				'POST_ENGAGEMENT',
				'MOBILE_APP_INSTALLS',
				'WEBSITE_CONVERSIONS',
				'REACH',
				'VIDEO_VIEWS',
			])
			.optional(),
		optimizationGoal: z.string().min(1).optional(),
		predictionMode: z.union([z.literal(0), z.literal(1)]).optional(),
		reach: z.number().int().positive().optional(),
		rfPredictionIdToShare: numericId.optional(),
		startTime: z.number().int().positive().optional(),
		stopTime: z.number().int().positive().optional(),
		storyEventType: z
			.union([z.literal(0), z.literal(128), z.literal(256), z.literal(384)])
			.optional(),
		targetSpec: reachFrequencyTargetSpec.optional(),
		// `unknown` is needed because Meta documents this nested JSON object without a field schema.
		metaMomentMakerSpec: z.record(z.string(), z.unknown()).optional(),
		trendingTopicsSpec: reachFrequencyTopicsSpec.optional(),
	})
	.strict()
	.refine(
		(value) => !(value.endTime !== undefined && value.stopTime !== undefined),
	)
	.refine((value) =>
		value.predictionMode === 0
			? value.reach !== undefined
			: value.predictionMode === 1
				? value.budget !== undefined
				: (value.reach === undefined) !== (value.budget === undefined),
	)
	.refine(
		(value) =>
			value.startTime === undefined ||
			(value.stopTime ?? value.endTime) === undefined ||
			(value.stopTime ?? value.endTime ?? 0) > value.startTime,
	);
const reachFrequencyPredictionCreateOutput = z.object({ id });
const campaignAdRulesGovernedListInput = z
	.object({
		campaignId: id,
		passEvaluation: z.boolean().optional(),
		...cursorOptions,
	})
	.strict();
const adSetAdRulesGovernedListInput = z
	.object({
		adSetId: id,
		passEvaluation: z.boolean().optional(),
		...cursorOptions,
	})
	.strict();
const studyGetInput = z.object({ studyId: id, fields }).strict();
const studyRelatedAccountsListInput = z.object({ studyId: id }).strict();
const studyViewersListInput = z.object({ studyId: id }).strict();
const studyCellInput = z
	.object({
		name: z.string().min(1),
		treatmentPercentage: z.number().min(10).max(100),
		controlPercentage: z.number().min(0).max(100).optional(),
		adSetIds: z.array(id).min(1),
	})
	.strict();
const studyCreateInput = z
	.object({
		businessId: id,
		name: z.string().min(1),
		description: z.string().optional(),
		startTime: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		endTime: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		type: z.literal('SPLIT_TEST'),
		cells: z.array(studyCellInput).min(2),
	})
	.strict()
	.refine((value) => value.endTime > value.startTime)
	.refine(
		(value) =>
			// Round the total to hundredths so float error (33.3 + 33.3 + 33.4 = 100.00000000000001)
			// doesn't reject a valid split; rounding each cell first would reject 50.005 + 49.995.
			Math.round(
				value.cells.reduce(
					(total, cell) => total + cell.treatmentPercentage,
					0,
				) * 100,
			) <= 10_000,
	);
const studyUpdateInput = z
	.object({
		studyId: id,
		name: z.string().min(1).optional(),
		description: z.string().optional(),
		endTime: z
			.number()
			.int()
			.positive()
			.max(Number.MAX_SAFE_INTEGER)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			value.name !== undefined ||
			value.description !== undefined ||
			value.endTime !== undefined,
	);
const budgetScheduleGetInput = z.object({ periodId: id, fields }).strict();
const campaignCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1),
		objective: z.enum([
			'OUTCOME_AWARENESS',
			'OUTCOME_ENGAGEMENT',
			'OUTCOME_LEADS',
			'OUTCOME_SALES',
			'OUTCOME_TRAFFIC',
			'OUTCOME_APP_PROMOTION',
			'APP_INSTALLS',
			'BRAND_AWARENESS',
			'CONVERSIONS',
			'LEAD_GENERATION',
			'LINK_CLICKS',
			'REACH',
			'VIDEO_VIEWS',
		]),
		specialAdCategories: z.array(
			z.enum([
				'NONE',
				'EMPLOYMENT',
				'HOUSING',
				'CREDIT',
				'ISSUES_ELECTIONS_POLITICS',
				'ONLINE_GAMBLING_AND_GAMING',
				'FINANCIAL_PRODUCTS_SERVICES',
			]),
		),
		status: z.enum(['ACTIVE', 'PAUSED']).optional(),
		dailyBudget: budget.optional(),
		lifetimeBudget: budget.optional(),
		// Meta v24+ requires is_adset_budget_sharing_enabled when the budget sits on the ad sets.
		adsetBudgetSharing: z.boolean().optional(),
		idempotencyKey: z
			.string()
			.regex(/^[A-Za-z0-9_-]{1,128}$/)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			!(value.dailyBudget !== undefined && value.lifetimeBudget !== undefined),
	)
	.refine(
		(value) =>
			!(
				value.adsetBudgetSharing === true &&
				(value.dailyBudget !== undefined || value.lifetimeBudget !== undefined)
			),
		{
			message:
				'adsetBudgetSharing only applies to campaigns without a campaign budget',
		},
	);
const campaignUpdateInput = z
	.object({
		campaignId: id,
		name: z.string().min(1).optional(),
		status: status.optional(),
		dailyBudget: budget.optional(),
		lifetimeBudget: budget.optional(),
		spendCap: budget.optional(),
	})
	.strict()
	.refine((value) =>
		Object.entries(value).some(
			([key, fieldValue]) => key !== 'campaignId' && fieldValue !== undefined,
		),
	);

const adSetListInput = z.object({ accountId: id, ...listOptions }).strict();
const adSetAdsListInput = z.object({ adSetId: id, ...listOptions }).strict();
const adSetAdCreativesListInput = z
	.object({ adSetId: id, ...cursorOptions })
	.strict();
const adSetCopiesListInput = z.object({ adSetId: id, ...listOptions }).strict();
const adSetCopyInput = z
	.object({
		adSetId: id,
		campaignId: id.optional(),
		renameOptions: renameOptionsInput.optional(),
	})
	.strict();
const adSetBudgetSchedulesListInput = z
	.object({
		adSetId: id,
		timeStart: budgetScheduleRange.optional(),
		timeStop: budgetScheduleRange.optional(),
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
const adSetBudgetScheduleCreateInput = z
	.object({
		adSetId: id,
		budgetValue: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		budgetValueType: z.enum(['ABSOLUTE', 'MULTIPLIER']),
		timeStart: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		timeEnd: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
	})
	.strict()
	.refine((value) => value.timeEnd > value.timeStart)
	.refine((value) => value.timeEnd - value.timeStart >= 10_800);
const adSetGetInput = z.object({ adSetId: id, fields }).strict();
const adSetActivitiesListInput = z
	.object({
		adSetId: id,
		after: cursor,
		businessId: id.optional(),
		category: z
			.enum([
				'ACCOUNT',
				'AD',
				'AD_KEYWORDS',
				'AD_SET',
				'AUDIENCE',
				'BID',
				'BUDGET',
				'CAMPAIGN',
				'DATE',
				'STATUS',
				'TARGETING',
			])
			.optional(),
		limit: pageSize,
		since: z.string().min(1).optional(),
		uid: z.number().int().positive().optional(),
		until: z.string().min(1).optional(),
	})
	.strict();
const adSetAdStudiesListInput = z
	.object({ adSetId: id, ...cursorOptions })
	.strict();
// `unknown` is necessary because targeting contains provider-defined nested, versioned JSON keys.
const targeting = z.record(z.string(), z.unknown());
const adSetCreateInput = z
	.object({
		accountId: id,
		campaignId: id,
		name: z.string().min(1),
		optimizationGoal: z.enum([
			'NONE',
			'APP_INSTALLS',
			'AD_RECALL_LIFT',
			'ENGAGED_USERS',
			'EVENT_RESPONSES',
			'IMPRESSIONS',
			'LEAD_GENERATION',
			'QUALITY_LEAD',
			'LINK_CLICKS',
			'OFFSITE_CONVERSIONS',
			'PAGE_LIKES',
			'POST_ENGAGEMENT',
			'QUALITY_CALL',
			'REACH',
			'LANDING_PAGE_VIEWS',
			'VISIT_INSTAGRAM_PROFILE',
			'ENGAGED_PAGE_VIEWS',
			'VALUE',
			'THRUPLAY',
			'DERIVED_EVENTS',
			'APP_INSTALLS_AND_OFFSITE_CONVERSIONS',
			'CONVERSATIONS',
			'IN_APP_VALUE',
			'MESSAGING_PURCHASE_CONVERSION',
			'MESSAGING_DEEP_CONVERSATION_AND_FOLLOW',
			'SUBSCRIBERS',
			'REMINDERS_SET',
			'MEANINGFUL_CALL_ATTEMPT',
			'PROFILE_VISIT',
			'PROFILE_AND_PAGE_ENGAGEMENT',
			'ADVERTISER_SILOED_VALUE',
			'AUTOMATIC_OBJECTIVE',
			'MESSAGING_APPOINTMENT_CONVERSION',
		]),
		billingEvent: z.enum([
			'APP_INSTALLS',
			'CLICKS',
			'IMPRESSIONS',
			'LINK_CLICKS',
			'NONE',
			'OFFER_CLAIMS',
			'PAGE_LIKES',
			'POST_ENGAGEMENT',
			'THRUPLAY',
			'PURCHASE',
			'LISTING_INTERACTION',
		]),
		targeting,
		bidStrategy: z
			.enum([
				'LOWEST_COST_WITHOUT_CAP',
				'LOWEST_COST_WITH_BID_CAP',
				'COST_CAP',
				'LOWEST_COST_WITH_MIN_ROAS',
			])
			.optional(),
		bidAmount: budget.optional(),
		// Documented promoted_object keys; Meta requires one for conversion, lead, app and page-like goals.
		promotedObject: z
			.object({
				pixel_id: id.optional(),
				custom_event_type: z.string().min(1).optional(),
				custom_conversion_id: id.optional(),
				page_id: id.optional(),
				application_id: id.optional(),
				object_store_url: z.string().url().optional(),
				product_catalog_id: id.optional(),
				product_set_id: id.optional(),
				event_id: id.optional(),
				offline_conversion_data_set_id: id.optional(),
				whatsapp_phone_number: z.string().min(1).optional(),
			})
			.strict()
			.refine((value) => Object.values(value).some((v) => v !== undefined), {
				message: 'promotedObject needs at least one field',
			})
			.optional(),
		status: z.enum(['ACTIVE', 'PAUSED']).optional(),
		dailyBudget: budget.optional(),
		lifetimeBudget: budget.optional(),
		startTime: z.string().optional(),
		endTime: z.string().optional(),
		idempotencyKey: z
			.string()
			.regex(/^[A-Za-z0-9_-]{1,128}$/)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			!(value.dailyBudget !== undefined && value.lifetimeBudget !== undefined),
	)
	.refine(
		(value) =>
			value.lifetimeBudget === undefined || value.endTime !== undefined,
	)
	.refine(
		(value) =>
			value.bidAmount !== undefined ||
			(value.bidStrategy !== 'LOWEST_COST_WITH_BID_CAP' &&
				value.bidStrategy !== 'COST_CAP'),
		{
			message:
				'bidAmount is required for LOWEST_COST_WITH_BID_CAP and COST_CAP',
		},
	);
const adSetUpdateInput = z
	.object({
		adSetId: id,
		name: z.string().min(1).optional(),
		status: status.optional(),
		dailyBudget: budget.optional(),
		lifetimeBudget: budget.optional(),
		endTime: z.string().optional(),
	})
	.strict()
	.refine((value) =>
		Object.entries(value).some(
			([key, fieldValue]) => key !== 'adSetId' && fieldValue !== undefined,
		),
	);

const adListInput = z.object({ accountId: id, ...listOptions }).strict();
const adAdCreativesListInput = z
	.object({ adId: id, ...cursorOptions })
	.strict();
const adCopiesListInput = z.object({ adId: id, ...listOptions }).strict();
const adCopyInput = z
	.object({
		adId: id,
		adSetId: id.optional(),
		renameOptions: renameOptionsInput.optional(),
	})
	.strict();
const adGetInput = z.object({ adId: id, fields }).strict();
const adAdStudiesListInput = z.object({ adId: id, ...cursorOptions }).strict();
const adAdRulesGovernedListInput = z
	.object({
		adId: id,
		passEvaluation: z.boolean().optional(),
		...cursorOptions,
	})
	.strict();
// Nested content fields are provider-defined JSON objects with versioned documented subfields.
const creativeStoryContent = z.record(z.string(), z.unknown());
const creativeObjectStorySpec = z
	.object({
		page_id: id,
		link_data: creativeStoryContent.optional(),
		photo_data: creativeStoryContent.optional(),
		video_data: creativeStoryContent.optional(),
		text_data: creativeStoryContent.optional(),
		template_data: creativeStoryContent.optional(),
	})
	.strict()
	.refine(
		(value) =>
			[
				value.link_data,
				value.photo_data,
				value.video_data,
				value.text_data,
				value.template_data,
			].filter((spec) => spec !== undefined).length === 1,
	);
const creativeAuthorizationCategory = z.enum([
	'POLITICAL',
	'POLITICAL_WITH_DIGITALLY_CREATED_MEDIA',
]);
const asyncCreativeSpec = z
	.object({
		name: z.string().min(1).max(100),
		objectStoryId: id.optional(),
		objectStorySpec: creativeObjectStorySpec.optional(),
		authorizationCategory: creativeAuthorizationCategory.optional(),
	})
	.strict()
	.refine(
		(value) =>
			(value.objectStoryId === undefined) !==
			(value.objectStorySpec === undefined),
	);
const asyncCreativeCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1),
		creativeSpec: asyncCreativeSpec,
	})
	.strict();
const adCreateInput = z
	.object({
		accountId: id,
		adSetId: id,
		name: z.string().min(1),
		conversionDomain: z
			.string()
			.min(3)
			.max(253)
			.regex(
				/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?))+$/i,
			)
			.optional(),
		creativeId: id.optional(),
		creativeSpec: z
			.object({
				name: z.string().min(1).max(100),
				objectStorySpec: creativeObjectStorySpec,
				authorizationCategory: creativeAuthorizationCategory.optional(),
			})
			.strict()
			.optional(),
		status: z.enum(['ACTIVE', 'PAUSED']).optional(),
		idempotencyKey: z
			.string()
			.regex(/^[A-Za-z0-9_-]{1,128}$/)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			(value.creativeId === undefined) !== (value.creativeSpec === undefined),
	);
const adUpdateInput = z
	.object({
		adId: id,
		name: z.string().min(1).optional(),
		status: status.optional(),
	})
	.strict()
	.refine((value) => value.name !== undefined || value.status !== undefined);

const creativeListInput = z.object({ accountId: id, ...listOptions }).strict();
const creativeGetInput = z.object({ creativeId: id, fields }).strict();
const creativeCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1).max(100),
		objectStoryId: id.optional(),
		objectStorySpec: creativeObjectStorySpec.optional(),
		authorizationCategory: creativeAuthorizationCategory.optional(),
		idempotencyKey: z
			.string()
			.regex(/^[A-Za-z0-9_-]{1,128}$/)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			(value.objectStoryId === undefined) !==
			(value.objectStorySpec === undefined),
	);
const creativeUpdateInput = z
	.object({ creativeId: id, name: z.string().min(1).max(100) })
	.strict();
const creativeDeleteInput = z.object({ creativeId: id }).strict();
const creativeInsightsListInput = z
	.object({ creativeId: id, ...cursorOptions })
	.strict();
const previewAdFormat = z.enum([
	'DESKTOP_FEED_STANDARD',
	'MOBILE_FEED_STANDARD',
	'RIGHT_COLUMN_STANDARD',
	'INSTAGRAM_STANDARD',
	'INSTAGRAM_STORY',
	'FACEBOOK_STORY_MOBILE',
	'INSTAGRAM_REELS',
]);
const accountGeneratePreviewsInput = z
	.object({
		accountId: id,
		adFormat: previewAdFormat,
		creativeSpec: z
			.object({ objectStorySpec: creativeObjectStorySpec })
			.strict(),
		...cursorOptions,
	})
	.strict();
const creativePreviewsListInput = z
	.object({
		creativeId: id,
		adFormat: previewAdFormat,
		creativeFeature: z
			.enum([
				'ig_video_native_subtitle',
				'image_animation',
				'product_browsing',
				'product_metadata_automation',
				'profile_card',
				'standard_enhancements_catalog',
				'text_overlay_translation',
			])
			.optional(),
		dynamicAssetLabel: z.string().min(1).optional(),
		productItemIds: z.array(id).min(1).optional(),
		startDate: z.string().datetime().optional(),
		endDate: z.string().datetime().optional(),
		width: z.number().int().positive().optional(),
		height: z.number().int().positive().optional(),
		...cursorOptions,
	})
	.strict();
const adsPreviewsListInput = z
	.object({
		adId: id,
		adFormat: previewAdFormat,
		creativeFeature: z
			.enum([
				'ig_video_native_subtitle',
				'image_animation',
				'product_browsing',
				'product_metadata_automation',
				'profile_card',
				'standard_enhancements_catalog',
				'text_overlay_translation',
			])
			.optional(),
		dynamicAssetLabel: z.string().min(1).optional(),
		productItemIds: z.array(id).min(1).optional(),
		startDate: z.string().datetime().optional(),
		endDate: z.string().datetime().optional(),
		width: z.number().int().positive().optional(),
		height: z.number().int().positive().optional(),
		...cursorOptions,
	})
	.strict();

const audienceListInput = z.object({ accountId: id, ...listOptions }).strict();
const audienceAdAccountsListInput = z
	.object({
		audienceId: id,
		permissions: z.enum(['targeting', 'targeting_and_insights']).optional(),
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
const audienceAdsListInput = z
	.object({ audienceId: id, ...listOptions })
	.strict();
const audienceGetInput = z.object({ audienceId: id, fields }).strict();
const audienceCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1),
		description: z.string().optional(),
		customerFileSource: z
			.enum([
				'USER_PROVIDED_ONLY',
				'PARTNER_PROVIDED_ONLY',
				'BOTH_USER_AND_PARTNER_PROVIDED',
			])
			.optional(),
		subtype: z.literal('CUSTOM').default('CUSTOM'),
	})
	.strict();
const audienceUpdateInput = z
	.object({
		audienceId: id,
		name: z.string().min(1).optional(),
		description: z.string().optional(),
	})
	.strict()
	.refine(
		(value) => value.name !== undefined || value.description !== undefined,
	);
const audienceDeleteInput = z.object({ audienceId: id }).strict();
const audienceAccountsShareInput = z
	.object({
		audienceId: id,
		adAccountIds: z.array(id).min(1),
		permissions: z.enum(['targeting', 'targeting_and_insights']),
		replace: z.boolean().optional(),
	})
	.strict();
const audienceAccountsUnshareInput = z
	.object({ audienceId: id, adAccountIds: z.array(id).min(1) })
	.strict();
const AudienceSharingSchema = z.object({
	success: z.boolean(),
	sharing_data: z.array(
		z.object({
			ad_acct_id: z.string(),
			business_id: z.union([z.string(), z.number().int()]).optional(),
			audience_share_status: z.string().optional(),
			errors: z.array(z.string()).optional(),
		}),
	),
});
const audienceSessionsListInput = z
	.object({
		audienceId: id,
		// `/users` answers session_id as a number or a numeric string; accept both.
		sessionId: z
			.union([
				z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
				z.string().regex(/^[1-9][0-9]*$/),
			])
			.optional(),
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
const audienceSessionsListOutput = z.object({
	data: z.array(
		z.object({
			end_time: z.string().optional(),
			num_invalid_entries: z.string().optional(),
			num_matched: z.string().optional(),
			num_received: z.string().optional(),
			progress: z.string().optional(),
			session_id: z.string().optional(),
			stage: z.string().optional(),
			start_time: z.string().optional(),
		}),
	),
	paging: MetaAdsListSchema.shape.paging,
});
const audienceMemberSchema = z.enum(['EMAIL_SHA256', 'PHONE_SHA256']);
const sha256Hash = z.string().regex(/^[a-f0-9]{64}$/);
const audienceUsersAddInput = z
	.object({
		audienceId: id,
		schema: audienceMemberSchema,
		hashes: z.array(sha256Hash).min(1).max(10_000),
		sessionId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		batchSequence: z.number().int().positive(),
		lastBatch: z.boolean(),
		estimatedTotal: z.number().int().nonnegative().optional(),
	})
	.strict();
const audienceUsersReplaceInput = z
	.object({
		audienceId: id,
		schema: audienceMemberSchema,
		hashes: z.array(sha256Hash).min(1).max(10_000),
		sessionId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		batchSequence: z.number().int().positive(),
		lastBatch: z.boolean(),
		estimatedTotal: z.number().int().nonnegative().optional(),
	})
	.strict();
const audienceUsersRemoveInput = z
	.object({
		audienceId: id,
		schema: audienceMemberSchema,
		hashes: z.array(sha256Hash).min(1).max(10_000),
	})
	.strict();
const audienceUsersResultSchema = z.object({
	audience_id: z.string(),
	session_id: z.union([z.string(), z.number().int()]),
	num_received: z.number().int(),
	num_invalid_entries: z.number().int(),
	// invalid_entry_samples can echo submitted identifiers, so it is intentionally stripped.
});
// `usersreplace` answers with the ad account instead of the audience id.
const audienceUsersReplaceResultSchema = z.object({
	account_id: z.union([z.string(), z.number().int()]).optional(),
	audience_id: z.string().optional(),
	session_id: z.union([z.string(), z.number().int()]),
	num_received: z.number().int(),
	num_invalid_entries: z.number().int(),
	// invalid_entry_samples can echo submitted identifiers, so it is intentionally stripped.
});

const insightFields = z
	.array(
		z.enum([
			'impressions',
			'reach',
			'frequency',
			'spend',
			'clicks',
			'inline_link_clicks',
			'cpc',
			'cpm',
			'ctr',
			'inline_link_click_ctr',
			'outbound_clicks',
			'unique_clicks',
			'unique_impressions',
			'actions',
			'action_values',
			'cost_per_action_type',
			'ad_name',
			'campaign_name',
			'adset_name',
			'objective',
			'optimization_goal',
			'publisher_platform',
			'platform_position',
			'device_platform',
			'age',
			'gender',
			'country',
			'region',
			'hourly_stats_aggregated_by_advertiser_time_zone',
			'hourly_stats_aggregated_by_audience_time_zone',
			'date_start',
			'date_stop',
			'account_id',
			'campaign_id',
			'adset_id',
			'ad_id',
		]),
	)
	.min(1);
const insightBreakdown = z.enum([
	'action_device',
	'action_canvas_component_name',
	'action_carousel_card_id',
	'action_carousel_card_name',
	'action_destination',
	'action_reaction',
	'action_target_id',
	'action_type',
	'action_video_sound',
	'action_video_type',
	'ad_format_asset',
	'age',
	'app_id',
	'body_asset',
	'call_to_action_asset',
	'country',
	'creative_automation_asset_id',
	'description_asset',
	'device_platform',
	'dma',
	'frequency_value',
	'gender',
	'hourly_stats_aggregated_by_advertiser_time_zone',
	'hourly_stats_aggregated_by_audience_time_zone',
	'image_asset',
	'impression_device',
	'link_url_asset',
	'pa_creator_ig_handle',
	'place_page_id',
	'platform_position',
	'product_id',
	'publisher_platform',
	'region',
	'skan_campaign_id',
	'skan_conversion_id',
	'title_asset',
	'user_segment_key',
	'video_asset',
]);
const insightActionBreakdown = z.enum([
	'action_device',
	'action_canvas_component_name',
	'action_carousel_card_id',
	'action_carousel_card_name',
	'action_destination',
	'action_reaction',
	'action_target_id',
	'action_type',
	'action_video_sound',
	'action_video_type',
]);
const insightAttributionWindow = z.enum([
	'1d_view',
	'7d_view',
	'28d_view',
	'1d_click',
	'7d_click',
	'28d_click',
	'1d_ev',
	'dda',
	'default',
	'7d_view_first_conversion',
	'28d_view_first_conversion',
	'7d_view_all_conversions',
	'28d_view_all_conversions',
	'skan_view',
	'skan_click',
	'skan_click_second_postback',
	'skan_view_second_postback',
	'skan_click_third_postback',
	'skan_view_third_postback',
	'incrementality',
	'custom',
	'1d_sequenced',
	'7d_sequenced',
	'28d_sequenced',
]);
const insightFilter = z
	.object({
		field: z.string().min(1),
		operator: z.enum([
			'EQUAL',
			'NOT_EQUAL',
			'GREATER_THAN',
			'GREATER_THAN_OR_EQUAL',
			'LESS_THAN',
			'LESS_THAN_OR_EQUAL',
			'IN_RANGE',
			'NOT_IN_RANGE',
			'CONTAIN',
			'NOT_CONTAIN',
			'CONTAINS_ANY',
			'CONTAINS_ALL',
			'NOT_CONTAINS_ANY',
			'STEM_MATCH',
			'IN',
			'NOT_IN',
			'STARTS_WITH',
			'ENDS_WITH',
			'ANY',
			'ALL',
			'AFTER',
			'BEFORE',
			'ON_OR_AFTER',
			'ON_OR_BEFORE',
			'NONE',
			'TOP',
		]),
		value: z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.array(z.union([z.string(), z.number(), z.boolean()])),
		]),
	})
	.strict();
const insightTimeIncrement = z.union([
	z.enum(['monthly', 'all_days']),
	z.number().int().min(1).max(90),
]);
const datePreset = z.enum([
	'today',
	'yesterday',
	'this_month',
	'last_month',
	'this_quarter',
	'maximum',
	'data_maximum',
	'last_3d',
	'last_7d',
	'last_14d',
	'last_28d',
	'last_30d',
	'last_90d',
	'last_week_mon_sun',
	'last_week_sun_sat',
	'last_quarter',
	'last_year',
	'this_week_mon_today',
	'this_week_sun_today',
	'this_year',
]);
const insightParamsShape = {
	fields: insightFields,
	datePreset: datePreset.optional(),
	since: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	until: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	level: z.enum(['account', 'campaign', 'adset', 'ad']).optional(),
	breakdowns: z.array(insightBreakdown).min(1).optional(),
	actionBreakdowns: z.array(insightActionBreakdown).min(1).optional(),
	actionAttributionWindows: z.array(insightAttributionWindow).min(1).optional(),
	filtering: z.array(insightFilter).min(1).optional(),
	timeIncrement: insightTimeIncrement.optional(),
	sort: z.array(z.string().min(1)).max(1).optional(),
	summary: z.array(insightFields.element).min(1).optional(),
	summaryActionBreakdowns: z.array(insightActionBreakdown).min(1).optional(),
	defaultSummary: z.boolean().optional(),
	productIdLimit: z.number().int().positive().optional(),
};
const insightRequestShape = { accountId: id, ...insightParamsShape };
type InsightsParameterShape = {
	datePreset?: string;
	since?: string;
	until?: string;
	actionBreakdowns?: string[];
	fields: string[];
	summaryActionBreakdowns?: string[];
	summary?: string[];
	defaultSummary?: boolean;
};
// Generic over the schema itself so each insights operation keeps its own input type.
const validateInsightsParameters = <
	S extends z.ZodType<InsightsParameterShape>,
>(
	schema: S,
): S =>
	schema
		.refine((value) => !(value.datePreset && (value.since || value.until)))
		.refine(
			(value) => (value.since === undefined) === (value.until === undefined),
		)
		.refine(
			(value) =>
				value.actionBreakdowns === undefined ||
				value.fields.includes('actions'),
		)
		.refine(
			(value) =>
				value.summaryActionBreakdowns === undefined ||
				value.summary !== undefined ||
				value.defaultSummary === true,
		);
const insightsInput = validateInsightsParameters(
	z
		.object({
			...insightRequestShape,
			limit: pageSize,
			after: cursor,
			before: cursor,
		})
		.strict(),
);
const insightsForCampaignInput = validateInsightsParameters(
	z
		.object({
			...insightParamsShape,
			campaignId: id,
			limit: pageSize,
			after: cursor,
			before: cursor,
		})
		.strict(),
);
const insightsForAdSetInput = validateInsightsParameters(
	z
		.object({
			...insightParamsShape,
			adSetId: id,
			limit: pageSize,
			after: cursor,
			before: cursor,
		})
		.strict(),
);
const insightsForAdInput = validateInsightsParameters(
	z
		.object({
			...insightParamsShape,
			adId: id,
			limit: pageSize,
			after: cursor,
			before: cursor,
		})
		.strict(),
);
const insightsAsyncCreateInput = validateInsightsParameters(
	z.object(insightRequestShape).strict(),
);
const insightsAsyncReportInput = z
	.object({
		reportRunId: numericId,
		fields: z
			.array(
				z.enum([
					'id',
					'account_id',
					'time_ref',
					'time_completed',
					'async_status',
					'async_percent_completion',
					'error_code',
					'error_message',
					'error_subcode',
					'error_user_title',
					'error_user_msg',
				]),
			)
			.min(1)
			.optional(),
	})
	.strict();
const insightsAsyncResultsInput = z
	.object({
		reportRunId: numericId,
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
// Ad report-run nodes expose additional provider-documented status fields not selected by this schema.
const AsyncReportSchema = z
	.object({
		id: numericId.optional(),
		account_id: z.string().optional(),
		time_ref: z.number().optional(),
		time_completed: z.number().optional(),
		async_status: z.string().optional(),
		async_percent_completion: z.number().optional(),
		error_code: z.number().optional(),
		error_message: z.string().optional(),
		error_subcode: z.number().optional(),
		error_user_title: z.string().optional(),
		error_user_msg: z.string().optional(),
	})
	.passthrough();
const InsightsAsyncCreateSchema = z.object({
	report_run_id: numericId,
});
const copiedObjectIdsSchema = z.array(
	z.object({
		// Open enum: Meta adds copied object types over time.
		ad_object_type: z
			.enum([
				'unique_adcreative',
				'ad',
				'ad_set',
				'campaign',
				'opportunities',
				'privacy_info_center',
				'topline',
				'ad_account',
				'product',
			])
			.or(z.string()),
		source_id: id,
		copied_id: id,
	}),
);
const campaignCopyOutputSchema = z
	.object({
		copied_campaign_id: id,
		ad_object_ids: copiedObjectIdsSchema.optional(),
	})
	.passthrough();
const adSetCopyOutputSchema = z
	.object({
		copied_adset_id: id,
		ad_object_ids: copiedObjectIdsSchema.optional(),
	})
	.passthrough();
const adCopyOutputSchema = z.object({ copied_ad_id: id }).passthrough();
const HighDemandPeriodSchema = z
	.object({
		id: z.string(),
		budget_value: z.union([z.number(), z.string()]).optional(),
		budget_value_type: z
			.enum(['ABSOLUTE', 'MULTIPLIER'])
			.or(z.string())
			.optional(),
		recurrence_type: z.string().optional(),
		time_end: z.union([z.string(), z.number()]).optional(),
		time_start: z.union([z.string(), z.number()]).optional(),
	})
	.passthrough();
const HighDemandPeriodsListSchema = z.object({
	data: z.array(HighDemandPeriodSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const HighDemandPeriodCreateSchema = z.object({ id });
const InsightsFeatureName = z.enum([
	'comscore',
	'impression_device',
	'time_of_day_viewer_tz',
	'frequency_value',
]);
const InsightsFeaturesListInput = z
	.object({ accountId: id, ...cursorOptions })
	.strict();
const InsightsEnabledFeaturesListInput = z
	.object({ accountId: id, ...cursorOptions })
	.strict();
// Outputs stay open (feature names and types Meta adds later); the enable input stays strict.
const InsightsFeaturesListSchema = z.object({
	data: z.array(
		z.object({
			feature_name: InsightsFeatureName.or(z.string()),
			feature_type: z.string(),
		}),
	),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const InsightsEnabledFeaturesListSchema = z.object({
	data: z.array(
		z.object({
			feature_name: InsightsFeatureName.or(z.string()),
			status: z.string(),
			insights_effective_date: z.string().optional(),
		}),
	),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const InsightsFeatureEnableInput = z
	.object({ accountId: id, featureName: InsightsFeatureName })
	.strict();
const InsightsFeatureEnableSchema = z.object({ id: z.string() });
// Action statistic fields vary by metric and attribution window in Meta's documented response.
const InsightActionStatSchema = z
	.object({ action_type: z.string().optional(), value: z.string().optional() })
	.passthrough();
export const InsightsListSchema = z.object({
	data: z.array(
		z
			.object({
				account_id: z.string().optional(),
				campaign_id: z.string().optional(),
				adset_id: z.string().optional(),
				ad_id: z.string().optional(),
				date_start: z.string().optional(),
				date_stop: z.string().optional(),
				impressions: z.string().optional(),
				reach: z.string().optional(),
				frequency: z.string().optional(),
				spend: z.string().optional(),
				clicks: z.string().optional(),
				inline_link_clicks: z.string().optional(),
				cpc: z.string().optional(),
				cpm: z.string().optional(),
				ctr: z.string().optional(),
				inline_link_click_ctr: z.string().optional(),
				outbound_clicks: z.array(InsightActionStatSchema).optional(),
				unique_clicks: z.string().optional(),
				unique_impressions: z.string().optional(),
				actions: z.array(InsightActionStatSchema).optional(),
				action_values: z.array(InsightActionStatSchema).optional(),
				ad_name: z.string().optional(),
				campaign_name: z.string().optional(),
				adset_name: z.string().optional(),
				age: z.string().optional(),
				gender: z.string().optional(),
				country: z.string().optional(),
				region: z.string().optional(),
			})
			// Insights metrics depend on the requested field set and are extensible in Meta's docs.
			.passthrough(),
	),
	paging: MetaAdsListSchema.shape.paging,
	// Summary metrics vary with the requested field set and are validated as an object.
	summary: z.record(z.string(), z.unknown()).optional(),
});

export type MetaAdsEndpointInputs = {
	accountsList: z.infer<typeof accountListInput>;
	accountsGet: z.infer<typeof accountGetInput>;
	accountsUsersList: z.infer<typeof accountUsersListInput>;
	accountsActivitiesList: z.infer<typeof accountActivitiesListInput>;
	accountsAssignedUsersList: z.infer<typeof accountAssignedUsersListInput>;
	accountsAssignUser: z.infer<typeof accountAssignUserInput>;
	accountsRemoveUser: z.infer<typeof accountRemoveUserInput>;
	accountsControlsCreate: z.infer<typeof accountControlsCreateInput>;
	accountsAgenciesList: z.infer<typeof accountAgenciesListInput>;
	accountsAgencyRemove: z.infer<typeof accountAgencyRemoveInput>;
	accountsSubscribedAppUpdate: z.infer<typeof accountSubscribedAppInput>;
	accountsSubscribedAppRemove: z.infer<typeof accountSubscribedAppInput>;
	accountsTrackingCreate: z.infer<typeof accountTrackingCreateInput>;
	pixelsCreate: z.infer<typeof accountPixelCreateInput>;
	accountsPixelsList: z.infer<typeof accountPixelsListInput>;
	pixelsGet: z.infer<typeof pixelGetInput>;
	pixelsUpdate: z.infer<typeof pixelUpdateInput>;
	publisherBlockListsCreate: z.infer<typeof publisherBlockListCreateInput>;
	accountsImpactingAdStudiesList: z.infer<
		typeof accountImpactingAdStudiesListInput
	>;
	accountsAdRulesLibraryList: z.infer<typeof accountAdRulesLibraryListInput>;
	accountsAdRulesLibraryCreate: z.infer<typeof accountAdRuleCreateInput>;
	accountsActiveAdRulesList: z.infer<typeof accountActiveAdRulesListInput>;
	accountsGeneratePreviews: z.infer<typeof accountGeneratePreviewsInput>;
	accountsBroadTargetingCategoriesList: z.infer<
		typeof accountBroadTargetingCategoriesListInput
	>;
	accountsSmartSuggestedAdsList: z.infer<
		typeof accountSmartSuggestedAdsListInput
	>;
	accountsSuggestedAdsList: z.infer<typeof accountSuggestedAdsListInput>;
	accountsPlacePageSetsCreate: z.infer<typeof accountPlacePageSetsCreateInput>;
	accountsReachEstimate: z.infer<typeof accountReachEstimateInput>;
	customConversionsCreate: z.infer<typeof customConversionCreateInput>;
	reachFrequencyPredictionsGet: z.infer<
		typeof reachFrequencyPredictionGetInput
	>;
	reachFrequencyPredictionsList: z.infer<
		typeof reachFrequencyPredictionsListInput
	>;
	reachFrequencyPredictionsCreate: z.infer<
		typeof reachFrequencyPredictionCreateInput
	>;
	labelsList: z.infer<typeof adLabelListInput>;
	labelsGet: z.infer<typeof adLabelGetInput>;
	labelsCreate: z.infer<typeof adLabelCreateInput>;
	labelsUpdate: z.infer<typeof adLabelUpdateInput>;
	labelsDelete: z.infer<typeof adLabelDeleteInput>;
	labelsAdsList: z.infer<typeof adLabelAdsListInput>;
	labelsAdSetsList: z.infer<typeof adLabelAdSetsListInput>;
	labelsCampaignsList: z.infer<typeof adLabelCampaignsListInput>;
	labelsCreativesList: z.infer<typeof adLabelCreativesListInput>;
	imagesList: z.infer<typeof AdImageListInput>;
	imagesUpload: z.infer<typeof AdImageUploadInput>;
	imagesDelete: z.infer<typeof AdImageDeleteInput>;
	campaignsList: z.infer<typeof campaignListInput>;
	campaignsAdSetsList: z.infer<typeof campaignAdSetsListInput>;
	campaignsAdsList: z.infer<typeof campaignAdsListInput>;
	campaignsCopiesList: z.infer<typeof campaignCopiesListInput>;
	campaignsCopy: z.infer<typeof campaignCopyInput>;
	campaignsLabelsAdd: z.infer<typeof campaignLabelsAddInput>;
	campaignsBudgetSchedulesList: z.infer<
		typeof campaignBudgetSchedulesListInput
	>;
	campaignsBudgetScheduleCreate: z.infer<
		typeof campaignBudgetScheduleCreateInput
	>;
	campaignsAdStudiesList: z.infer<typeof campaignAdStudiesListInput>;
	campaignsAdRulesGovernedList: z.infer<
		typeof campaignAdRulesGovernedListInput
	>;
	highDemandPeriodsGet: z.infer<typeof budgetScheduleGetInput>;
	campaignsGet: z.infer<typeof campaignGetInput>;
	campaignsCreate: z.infer<typeof campaignCreateInput>;
	campaignsUpdate: z.infer<typeof campaignUpdateInput>;
	campaignsDelete: { campaignId: string };
	adSetsList: z.infer<typeof adSetListInput>;
	adSetsAdsList: z.infer<typeof adSetAdsListInput>;
	adSetsAdCreativesList: z.infer<typeof adSetAdCreativesListInput>;
	adSetsCopiesList: z.infer<typeof adSetCopiesListInput>;
	adSetsCopy: z.infer<typeof adSetCopyInput>;
	adSetsBudgetSchedulesList: z.infer<typeof adSetBudgetSchedulesListInput>;
	adSetsBudgetScheduleCreate: z.infer<typeof adSetBudgetScheduleCreateInput>;
	adSetsActivitiesList: z.infer<typeof adSetActivitiesListInput>;
	adSetsAdStudiesList: z.infer<typeof adSetAdStudiesListInput>;
	adSetsAdRulesGovernedList: z.infer<typeof adSetAdRulesGovernedListInput>;
	adSetsGet: z.infer<typeof adSetGetInput>;
	adSetsCreate: z.infer<typeof adSetCreateInput>;
	adSetsUpdate: z.infer<typeof adSetUpdateInput>;
	adSetsDelete: { adSetId: string };
	adsList: z.infer<typeof adListInput>;
	adsAdCreativesList: z.infer<typeof adAdCreativesListInput>;
	adsCopiesList: z.infer<typeof adCopiesListInput>;
	adsCopy: z.infer<typeof adCopyInput>;
	adsLabelsAdd: z.infer<typeof adLabelsAddInput>;
	adsAdStudiesList: z.infer<typeof adAdStudiesListInput>;
	adsAdRulesGovernedList: z.infer<typeof adAdRulesGovernedListInput>;
	adsPreviewsList: z.infer<typeof adsPreviewsListInput>;
	adsGet: z.infer<typeof adGetInput>;
	adsCreate: z.infer<typeof adCreateInput>;
	adsUpdate: z.infer<typeof adUpdateInput>;
	adsDelete: { adId: string };
	creativesList: z.infer<typeof creativeListInput>;
	creativesGet: z.infer<typeof creativeGetInput>;
	creativesCreate: z.infer<typeof creativeCreateInput>;
	creativesUpdate: z.infer<typeof creativeUpdateInput>;
	creativesDelete: z.infer<typeof creativeDeleteInput>;
	creativesLabelsAdd: z.infer<typeof creativeLabelsAddInput>;
	creativesInsightsList: z.infer<typeof creativeInsightsListInput>;
	creativesPreviewsList: z.infer<typeof creativePreviewsListInput>;
	audiencesList: z.infer<typeof audienceListInput>;
	audiencesAdAccountsList: z.infer<typeof audienceAdAccountsListInput>;
	audiencesAdsList: z.infer<typeof audienceAdsListInput>;
	audiencesGet: z.infer<typeof audienceGetInput>;
	audiencesCreate: z.input<typeof audienceCreateInput>;
	audiencesAcceptTerms: z.infer<typeof audienceTermsAcceptInput>;
	audiencesUpdate: z.infer<typeof audienceUpdateInput>;
	audiencesDelete: z.infer<typeof audienceDeleteInput>;
	audiencesSessionsList: z.infer<typeof audienceSessionsListInput>;
	audiencesUsersAdd: z.infer<typeof audienceUsersAddInput>;
	audiencesUsersRemove: z.infer<typeof audienceUsersRemoveInput>;
	audiencesUsersReplace: z.infer<typeof audienceUsersReplaceInput>;
	audiencesAdAccountsShare: z.infer<typeof audienceAccountsShareInput>;
	audiencesAdAccountsUnshare: z.infer<typeof audienceAccountsUnshareInput>;
	studiesGet: z.infer<typeof studyGetInput>;
	studiesCreate: z.infer<typeof studyCreateInput>;
	studiesUpdate: z.infer<typeof studyUpdateInput>;
	studiesRelatedAccountsList: z.infer<typeof studyRelatedAccountsListInput>;
	studiesViewersList: z.infer<typeof studyViewersListInput>;
	videosDelete: z.infer<typeof videosDeleteInput>;
	asyncCreativesList: z.infer<typeof asyncSetListInput>;
	asyncCreativesCreate: z.infer<typeof asyncCreativeCreateInput>;
	asyncRequestSetsList: z.infer<typeof asyncSetListInput>;
	asyncRequestSetsCreate: z.infer<typeof asyncRequestSetCreateInput>;
	asyncRequestSetsGet: z.infer<typeof asyncSetGetInput>;
	asyncRequestSetsUpdate: z.infer<typeof asyncSetUpdateInput>;
	asyncRequestSetsCancel: z.infer<typeof asyncSetCancelInput>;
	asyncRequestsListForSet: z.infer<typeof asyncRequestListInput>;
	asyncRequestsListForAdSet: z.infer<typeof asyncRequestsForAdSetListInput>;
	asyncRequestsCancel: z.infer<typeof asyncRequestCancelInput>;
	insightsList: z.infer<typeof insightsInput>;
	insightsListForCampaign: z.infer<typeof insightsForCampaignInput>;
	insightsListForAdSet: z.infer<typeof insightsForAdSetInput>;
	insightsListForAd: z.infer<typeof insightsForAdInput>;
	insightsCreateAsync: z.infer<typeof insightsAsyncCreateInput>;
	insightsGetAsyncReport: z.infer<typeof insightsAsyncReportInput>;
	insightsGetAsyncResults: z.infer<typeof insightsAsyncResultsInput>;
	insightsListFeatures: z.infer<typeof InsightsFeaturesListInput>;
	insightsListEnabledFeatures: z.infer<typeof InsightsEnabledFeaturesListInput>;
	insightsEnableFeature: z.infer<typeof InsightsFeatureEnableInput>;
};

export type MetaAdsEndpointOutputs = {
	accountsList: z.infer<typeof accountListOutput>;
	accountsGet: z.infer<typeof accountGetOutput>;
	accountsUsersList: z.infer<typeof AccountUsersListSchema>;
	accountsActivitiesList: z.infer<typeof AccountActivitiesListSchema>;
	accountsAssignedUsersList: z.infer<typeof AccountAssignedUsersListSchema>;
	accountsAssignUser: z.infer<typeof AccountMutationSchema>;
	accountsRemoveUser: z.infer<typeof AccountMutationSchema>;
	accountsControlsCreate: z.infer<typeof AccountControlCreateSchema>;
	accountsAgenciesList: z.infer<typeof AccountAgenciesListSchema>;
	accountsAgencyRemove: z.infer<typeof AccountMutationSchema>;
	accountsSubscribedAppUpdate: z.infer<typeof AccountMutationSchema>;
	accountsSubscribedAppRemove: z.infer<typeof AccountMutationSchema>;
	accountsTrackingCreate: z.infer<typeof AccountMutationSchema>;
	pixelsCreate: z.infer<typeof CreatedIdSchema>;
	accountsPixelsList: z.infer<typeof accountPixelsListSchema>;
	pixelsGet: z.infer<typeof pixelSchema>;
	pixelsUpdate: z.infer<typeof pixelUpdateOutput>;
	publisherBlockListsCreate: z.infer<typeof CreatedIdSchema>;
	accountsImpactingAdStudiesList: z.infer<typeof AdStudyListSchema>;
	accountsAdRulesLibraryList: z.infer<typeof AdRuleListSchema>;
	accountsAdRulesLibraryCreate: z.infer<typeof CreatedIdSchema>;
	accountsActiveAdRulesList: z.infer<typeof AdRuleListSchema>;
	accountsGeneratePreviews: z.infer<typeof AdPreviewsListSchema>;
	accountsBroadTargetingCategoriesList: z.infer<
		typeof BroadTargetingCategoriesListSchema
	>;
	accountsSmartSuggestedAdsList: z.infer<typeof MetaAdsListSchema>;
	accountsSuggestedAdsList: z.infer<typeof MetaAdsListSchema>;
	accountsPlacePageSetsCreate: z.infer<typeof CreatedIdSchema>;
	accountsReachEstimate: z.infer<typeof ReachEstimateResponseSchema>;
	customConversionsCreate: z.infer<typeof CustomConversionCreateSchema>;
	reachFrequencyPredictionsGet: z.infer<typeof reachFrequencyPredictionSchema>;
	reachFrequencyPredictionsList: z.infer<
		typeof reachFrequencyPredictionsListSchema
	>;
	reachFrequencyPredictionsCreate: z.infer<
		typeof reachFrequencyPredictionCreateOutput
	>;
	labelsList: z.infer<typeof AdLabelsListSchema>;
	labelsGet: z.infer<typeof AdLabelSchema>;
	labelsCreate: z.infer<typeof MetaAdsMutationSchema>;
	labelsUpdate: z.infer<typeof AdLabelAssociationSchema>;
	labelsDelete: z.infer<typeof MetaAdsDeleteSchema>;
	labelsAdsList: z.infer<typeof MetaAdsListSchema>;
	labelsAdSetsList: z.infer<typeof MetaAdsListSchema>;
	labelsCampaignsList: z.infer<typeof MetaAdsListSchema>;
	labelsCreativesList: z.infer<typeof MetaAdsListSchema>;
	imagesList: z.infer<typeof AdImagesListSchema>;
	imagesUpload: z.infer<typeof AdImageUploadSchema>;
	imagesDelete: z.infer<typeof MetaAdsDeleteSchema>;
	campaignsList: z.infer<typeof MetaAdsListSchema>;
	campaignsAdSetsList: z.infer<typeof MetaAdsListSchema>;
	campaignsAdsList: z.infer<typeof MetaAdsListSchema>;
	campaignsCopiesList: z.infer<typeof MetaAdsListSchema>;
	campaignsCopy: z.infer<typeof campaignCopyOutputSchema>;
	campaignsLabelsAdd: z.infer<typeof AdLabelAssociationSchema>;
	campaignsBudgetSchedulesList: z.infer<typeof HighDemandPeriodsListSchema>;
	campaignsBudgetScheduleCreate: z.infer<typeof HighDemandPeriodCreateSchema>;
	campaignsAdStudiesList: z.infer<typeof AdStudyListSchema>;
	campaignsAdRulesGovernedList: z.infer<typeof AdRuleListSchema>;
	highDemandPeriodsGet: z.infer<typeof HighDemandPeriodSchema>;
	campaignsGet: z.infer<typeof MetaAdsObjectSchema>;
	campaignsCreate: z.infer<typeof MetaAdsMutationSchema>;
	campaignsUpdate: { success: boolean };
	campaignsDelete: z.infer<typeof MetaAdsDeleteSchema>;
	adSetsList: z.infer<typeof MetaAdsListSchema>;
	adSetsAdsList: z.infer<typeof MetaAdsListSchema>;
	adSetsAdCreativesList: z.infer<typeof MetaAdsListSchema>;
	adSetsCopiesList: z.infer<typeof MetaAdsListSchema>;
	adSetsCopy: z.infer<typeof adSetCopyOutputSchema>;
	adSetsBudgetSchedulesList: z.infer<typeof HighDemandPeriodsListSchema>;
	adSetsBudgetScheduleCreate: z.infer<typeof HighDemandPeriodCreateSchema>;
	adSetsActivitiesList: z.infer<typeof AccountActivitiesListSchema>;
	adSetsAdStudiesList: z.infer<typeof AdStudyListSchema>;
	adSetsAdRulesGovernedList: z.infer<typeof AdRuleListSchema>;
	adSetsGet: z.infer<typeof MetaAdsObjectSchema>;
	adSetsCreate: z.infer<typeof MetaAdsMutationSchema>;
	adSetsUpdate: { success: boolean };
	adSetsDelete: z.infer<typeof MetaAdsDeleteSchema>;
	adsList: z.infer<typeof MetaAdsListSchema>;
	adsAdCreativesList: z.infer<typeof MetaAdsListSchema>;
	adsCopiesList: z.infer<typeof MetaAdsListSchema>;
	adsCopy: z.infer<typeof adCopyOutputSchema>;
	adsLabelsAdd: z.infer<typeof AdLabelAssociationSchema>;
	adsAdStudiesList: z.infer<typeof AdStudyListSchema>;
	adsAdRulesGovernedList: z.infer<typeof AdRuleListSchema>;
	adsPreviewsList: z.infer<typeof AdPreviewsListSchema>;
	adsGet: z.infer<typeof MetaAdsObjectSchema>;
	adsCreate: z.infer<typeof MetaAdsMutationSchema>;
	adsUpdate: { success: boolean };
	adsDelete: z.infer<typeof MetaAdsDeleteSchema>;
	creativesList: z.infer<typeof MetaAdsListSchema>;
	creativesGet: z.infer<typeof MetaAdsObjectSchema>;
	creativesCreate: z.infer<typeof MetaAdsMutationSchema>;
	creativesUpdate: z.infer<typeof MetaAdsDeleteSchema>;
	creativesDelete: z.infer<typeof MetaAdsDeleteSchema>;
	creativesLabelsAdd: z.infer<typeof AdLabelAssociationSchema>;
	creativesInsightsList: z.infer<typeof CreativeInsightsListSchema>;
	creativesPreviewsList: z.infer<typeof AdPreviewsListSchema>;
	audiencesList: z.infer<typeof MetaAdsListSchema>;
	audiencesAdAccountsList: z.infer<typeof AudienceAdAccountsListSchema>;
	audiencesAdsList: z.infer<typeof MetaAdsListSchema>;
	audiencesGet: z.infer<typeof MetaAdsObjectSchema>;
	audiencesCreate: z.infer<typeof MetaAdsMutationSchema>;
	audiencesAcceptTerms: z.infer<typeof AccountMutationSchema>;
	audiencesUpdate: { success: boolean };
	audiencesDelete: z.infer<typeof MetaAdsDeleteSchema>;
	audiencesSessionsList: z.infer<typeof audienceSessionsListOutput>;
	audiencesUsersAdd: z.infer<typeof audienceUsersResultSchema>;
	audiencesUsersRemove: z.infer<typeof audienceUsersResultSchema>;
	audiencesUsersReplace: z.infer<typeof audienceUsersReplaceResultSchema>;
	audiencesAdAccountsShare: z.infer<typeof AudienceSharingSchema>;
	audiencesAdAccountsUnshare: z.infer<typeof MetaAdsDeleteSchema>;
	studiesGet: z.infer<typeof AdStudySchema>;
	studiesCreate: z.infer<typeof StudyCreateSchema>;
	studiesUpdate: z.infer<typeof StudyUpdateSchema>;
	studiesRelatedAccountsList: z.infer<typeof MetaAdsListSchema>;
	studiesViewersList: z.infer<typeof StudyViewersListSchema>;
	videosDelete: z.infer<typeof MetaAdsDeleteSchema>;
	asyncCreativesList: z.infer<typeof AsyncRequestSetsListSchema>;
	asyncCreativesCreate: z.infer<typeof AsyncRequestSetCreateSchema>;
	asyncRequestSetsList: z.infer<typeof AsyncRequestSetsListSchema>;
	asyncRequestSetsCreate: z.infer<typeof AsyncRequestSetCreateSchema>;
	asyncRequestSetsGet: z.infer<typeof AsyncRequestSetSchema>;
	asyncRequestSetsUpdate: z.infer<typeof AsyncRequestSetUpdateSchema>;
	asyncRequestSetsCancel: z.infer<typeof GraphBooleanResultSchema>;
	asyncRequestsListForSet: z.infer<typeof AsyncRequestsListSchema>;
	asyncRequestsListForAdSet: z.infer<typeof AsyncRequestsListSchema>;
	asyncRequestsCancel: z.infer<typeof GraphBooleanResultSchema>;
	insightsList: z.infer<typeof InsightsListSchema>;
	insightsListForCampaign: z.infer<typeof InsightsListSchema>;
	insightsListForAdSet: z.infer<typeof InsightsListSchema>;
	insightsListForAd: z.infer<typeof InsightsListSchema>;
	insightsCreateAsync: z.infer<typeof InsightsAsyncCreateSchema>;
	insightsGetAsyncReport: z.infer<typeof AsyncReportSchema>;
	insightsGetAsyncResults: z.infer<typeof InsightsListSchema>;
	insightsListFeatures: z.infer<typeof InsightsFeaturesListSchema>;
	insightsListEnabledFeatures: z.infer<
		typeof InsightsEnabledFeaturesListSchema
	>;
	insightsEnableFeature: z.infer<typeof InsightsFeatureEnableSchema>;
};

export const MetaAdsEndpointInputSchemas = {
	accountsList: accountListInput,
	accountsGet: accountGetInput,
	accountsUsersList: accountUsersListInput,
	accountsActivitiesList: accountActivitiesListInput,
	accountsAssignedUsersList: accountAssignedUsersListInput,
	accountsAssignUser: accountAssignUserInput,
	accountsRemoveUser: accountRemoveUserInput,
	accountsControlsCreate: accountControlsCreateInput,
	accountsAgenciesList: accountAgenciesListInput,
	accountsAgencyRemove: accountAgencyRemoveInput,
	accountsSubscribedAppUpdate: accountSubscribedAppInput,
	accountsSubscribedAppRemove: accountSubscribedAppInput,
	accountsTrackingCreate: accountTrackingCreateInput,
	pixelsCreate: accountPixelCreateInput,
	accountsPixelsList: accountPixelsListInput,
	pixelsGet: pixelGetInput,
	pixelsUpdate: pixelUpdateInput,
	publisherBlockListsCreate: publisherBlockListCreateInput,
	accountsImpactingAdStudiesList: accountImpactingAdStudiesListInput,
	accountsAdRulesLibraryList: accountAdRulesLibraryListInput,
	accountsAdRulesLibraryCreate: accountAdRuleCreateInput,
	accountsActiveAdRulesList: accountActiveAdRulesListInput,
	accountsGeneratePreviews: accountGeneratePreviewsInput,
	accountsBroadTargetingCategoriesList:
		accountBroadTargetingCategoriesListInput,
	accountsSmartSuggestedAdsList: accountSmartSuggestedAdsListInput,
	accountsSuggestedAdsList: accountSuggestedAdsListInput,
	accountsPlacePageSetsCreate: accountPlacePageSetsCreateInput,
	accountsReachEstimate: accountReachEstimateInput,
	customConversionsCreate: customConversionCreateInput,
	reachFrequencyPredictionsGet: reachFrequencyPredictionGetInput,
	reachFrequencyPredictionsList: reachFrequencyPredictionsListInput,
	reachFrequencyPredictionsCreate: reachFrequencyPredictionCreateInput,
	labelsList: adLabelListInput,
	labelsGet: adLabelGetInput,
	labelsCreate: adLabelCreateInput,
	labelsUpdate: adLabelUpdateInput,
	labelsDelete: adLabelDeleteInput,
	labelsAdsList: adLabelAdsListInput,
	labelsAdSetsList: adLabelAdSetsListInput,
	labelsCampaignsList: adLabelCampaignsListInput,
	labelsCreativesList: adLabelCreativesListInput,
	imagesList: AdImageListInput,
	imagesUpload: AdImageUploadInput,
	imagesDelete: AdImageDeleteInput,
	campaignsList: campaignListInput,
	campaignsAdSetsList: campaignAdSetsListInput,
	campaignsAdsList: campaignAdsListInput,
	campaignsCopiesList: campaignCopiesListInput,
	campaignsCopy: campaignCopyInput,
	campaignsLabelsAdd: campaignLabelsAddInput,
	campaignsBudgetSchedulesList: campaignBudgetSchedulesListInput,
	campaignsBudgetScheduleCreate: campaignBudgetScheduleCreateInput,
	campaignsAdStudiesList: campaignAdStudiesListInput,
	campaignsAdRulesGovernedList: campaignAdRulesGovernedListInput,
	highDemandPeriodsGet: budgetScheduleGetInput,
	campaignsGet: campaignGetInput,
	campaignsCreate: campaignCreateInput,
	campaignsUpdate: campaignUpdateInput,
	campaignsDelete: z.object({ campaignId: id }).strict(),
	adSetsList: adSetListInput,
	adSetsAdsList: adSetAdsListInput,
	adSetsAdCreativesList: adSetAdCreativesListInput,
	adSetsCopiesList: adSetCopiesListInput,
	adSetsCopy: adSetCopyInput,
	adSetsBudgetSchedulesList: adSetBudgetSchedulesListInput,
	adSetsBudgetScheduleCreate: adSetBudgetScheduleCreateInput,
	adSetsActivitiesList: adSetActivitiesListInput,
	adSetsAdStudiesList: adSetAdStudiesListInput,
	adSetsAdRulesGovernedList: adSetAdRulesGovernedListInput,
	adSetsGet: adSetGetInput,
	adSetsCreate: adSetCreateInput,
	adSetsUpdate: adSetUpdateInput,
	adSetsDelete: z.object({ adSetId: id }).strict(),
	adsList: adListInput,
	adsAdCreativesList: adAdCreativesListInput,
	adsCopiesList: adCopiesListInput,
	adsCopy: adCopyInput,
	adsLabelsAdd: adLabelsAddInput,
	adsAdStudiesList: adAdStudiesListInput,
	adsAdRulesGovernedList: adAdRulesGovernedListInput,
	adsPreviewsList: adsPreviewsListInput,
	adsGet: adGetInput,
	adsCreate: adCreateInput,
	adsUpdate: adUpdateInput,
	adsDelete: z.object({ adId: id }).strict(),
	creativesList: creativeListInput,
	creativesGet: creativeGetInput,
	creativesCreate: creativeCreateInput,
	creativesUpdate: creativeUpdateInput,
	creativesDelete: creativeDeleteInput,
	creativesLabelsAdd: creativeLabelsAddInput,
	creativesInsightsList: creativeInsightsListInput,
	creativesPreviewsList: creativePreviewsListInput,
	audiencesList: audienceListInput,
	audiencesAdAccountsList: audienceAdAccountsListInput,
	audiencesAdsList: audienceAdsListInput,
	audiencesGet: audienceGetInput,
	audiencesCreate: audienceCreateInput,
	audiencesAcceptTerms: audienceTermsAcceptInput,
	audiencesUpdate: audienceUpdateInput,
	audiencesDelete: audienceDeleteInput,
	audiencesSessionsList: audienceSessionsListInput,
	audiencesUsersAdd: audienceUsersAddInput,
	audiencesUsersRemove: audienceUsersRemoveInput,
	audiencesUsersReplace: audienceUsersReplaceInput,
	audiencesAdAccountsShare: audienceAccountsShareInput,
	audiencesAdAccountsUnshare: audienceAccountsUnshareInput,
	studiesGet: studyGetInput,
	studiesCreate: studyCreateInput,
	studiesUpdate: studyUpdateInput,
	studiesRelatedAccountsList: studyRelatedAccountsListInput,
	studiesViewersList: studyViewersListInput,
	videosDelete: videosDeleteInput,
	asyncCreativesList: asyncSetListInput,
	asyncCreativesCreate: asyncCreativeCreateInput,
	asyncRequestSetsList: asyncSetListInput,
	asyncRequestSetsCreate: asyncRequestSetCreateInput,
	asyncRequestSetsGet: asyncSetGetInput,
	asyncRequestSetsUpdate: asyncSetUpdateInput,
	asyncRequestSetsCancel: asyncSetCancelInput,
	asyncRequestsListForSet: asyncRequestListInput,
	asyncRequestsListForAdSet: asyncRequestsForAdSetListInput,
	asyncRequestsCancel: asyncRequestCancelInput,
	insightsList: insightsInput,
	insightsListForCampaign: insightsForCampaignInput,
	insightsListForAdSet: insightsForAdSetInput,
	insightsListForAd: insightsForAdInput,
	insightsCreateAsync: insightsAsyncCreateInput,
	insightsGetAsyncReport: insightsAsyncReportInput,
	insightsGetAsyncResults: insightsAsyncResultsInput,
	insightsListFeatures: InsightsFeaturesListInput,
	insightsListEnabledFeatures: InsightsEnabledFeaturesListInput,
	insightsEnableFeature: InsightsFeatureEnableInput,
} as const;

export const MetaAdsEndpointOutputSchemas = {
	accountsList: accountListOutput,
	accountsGet: accountGetOutput,
	accountsUsersList: AccountUsersListSchema,
	accountsActivitiesList: AccountActivitiesListSchema,
	accountsAssignedUsersList: AccountAssignedUsersListSchema,
	accountsAssignUser: AccountMutationSchema,
	accountsRemoveUser: AccountMutationSchema,
	accountsControlsCreate: AccountControlCreateSchema,
	accountsAgenciesList: AccountAgenciesListSchema,
	accountsAgencyRemove: AccountMutationSchema,
	accountsSubscribedAppUpdate: AccountMutationSchema,
	accountsSubscribedAppRemove: AccountMutationSchema,
	accountsTrackingCreate: AccountMutationSchema,
	pixelsCreate: CreatedIdSchema,
	accountsPixelsList: accountPixelsListSchema,
	pixelsGet: pixelSchema,
	pixelsUpdate: pixelUpdateOutput,
	publisherBlockListsCreate: CreatedIdSchema,
	accountsImpactingAdStudiesList: AdStudyListSchema,
	accountsAdRulesLibraryList: AdRuleListSchema,
	accountsAdRulesLibraryCreate: CreatedIdSchema,
	accountsActiveAdRulesList: AdRuleListSchema,
	accountsGeneratePreviews: AdPreviewsListSchema,
	accountsBroadTargetingCategoriesList: BroadTargetingCategoriesListSchema,
	accountsSmartSuggestedAdsList: MetaAdsListSchema,
	accountsSuggestedAdsList: MetaAdsListSchema,
	accountsPlacePageSetsCreate: CreatedIdSchema,
	accountsReachEstimate: ReachEstimateResponseSchema,
	customConversionsCreate: CustomConversionCreateSchema,
	reachFrequencyPredictionsGet: reachFrequencyPredictionSchema,
	reachFrequencyPredictionsList: reachFrequencyPredictionsListSchema,
	reachFrequencyPredictionsCreate: reachFrequencyPredictionCreateOutput,
	labelsList: AdLabelsListSchema,
	labelsGet: AdLabelSchema,
	labelsCreate: MetaAdsMutationSchema,
	labelsUpdate: AdLabelAssociationSchema,
	labelsDelete: MetaAdsDeleteSchema,
	labelsAdsList: MetaAdsListSchema,
	labelsAdSetsList: MetaAdsListSchema,
	labelsCampaignsList: MetaAdsListSchema,
	labelsCreativesList: MetaAdsListSchema,
	imagesList: AdImagesListSchema,
	imagesUpload: AdImageUploadSchema,
	imagesDelete: MetaAdsDeleteSchema,
	campaignsList: MetaAdsListSchema,
	campaignsAdSetsList: MetaAdsListSchema,
	campaignsAdsList: MetaAdsListSchema,
	campaignsCopiesList: MetaAdsListSchema,
	campaignsCopy: campaignCopyOutputSchema,
	campaignsLabelsAdd: AdLabelAssociationSchema,
	campaignsBudgetSchedulesList: HighDemandPeriodsListSchema,
	campaignsBudgetScheduleCreate: HighDemandPeriodCreateSchema,
	campaignsAdStudiesList: AdStudyListSchema,
	campaignsAdRulesGovernedList: AdRuleListSchema,
	highDemandPeriodsGet: HighDemandPeriodSchema,
	campaignsGet: MetaAdsObjectSchema,
	campaignsCreate: MetaAdsMutationSchema,
	campaignsUpdate: MetaAdsDeleteSchema,
	campaignsDelete: MetaAdsDeleteSchema,
	adSetsList: MetaAdsListSchema,
	adSetsAdsList: MetaAdsListSchema,
	adSetsAdCreativesList: MetaAdsListSchema,
	adSetsCopiesList: MetaAdsListSchema,
	adSetsCopy: adSetCopyOutputSchema,
	adSetsBudgetSchedulesList: HighDemandPeriodsListSchema,
	adSetsBudgetScheduleCreate: HighDemandPeriodCreateSchema,
	adSetsActivitiesList: AccountActivitiesListSchema,
	adSetsAdStudiesList: AdStudyListSchema,
	adSetsAdRulesGovernedList: AdRuleListSchema,
	adSetsGet: MetaAdsObjectSchema,
	adSetsCreate: MetaAdsMutationSchema,
	adSetsUpdate: MetaAdsDeleteSchema,
	adSetsDelete: MetaAdsDeleteSchema,
	adsList: MetaAdsListSchema,
	adsAdCreativesList: MetaAdsListSchema,
	adsCopiesList: MetaAdsListSchema,
	adsCopy: adCopyOutputSchema,
	adsLabelsAdd: AdLabelAssociationSchema,
	adsAdStudiesList: AdStudyListSchema,
	adsAdRulesGovernedList: AdRuleListSchema,
	adsPreviewsList: AdPreviewsListSchema,
	adsGet: MetaAdsObjectSchema,
	adsCreate: MetaAdsMutationSchema,
	adsUpdate: MetaAdsDeleteSchema,
	adsDelete: MetaAdsDeleteSchema,
	creativesList: MetaAdsListSchema,
	creativesGet: MetaAdsObjectSchema,
	creativesCreate: MetaAdsMutationSchema,
	creativesUpdate: MetaAdsDeleteSchema,
	creativesDelete: MetaAdsDeleteSchema,
	creativesLabelsAdd: AdLabelAssociationSchema,
	creativesInsightsList: CreativeInsightsListSchema,
	creativesPreviewsList: AdPreviewsListSchema,
	audiencesList: MetaAdsListSchema,
	audiencesAdAccountsList: AudienceAdAccountsListSchema,
	audiencesAdsList: MetaAdsListSchema,
	audiencesGet: MetaAdsObjectSchema,
	audiencesCreate: MetaAdsMutationSchema,
	audiencesAcceptTerms: AccountMutationSchema,
	audiencesUpdate: MetaAdsDeleteSchema,
	audiencesDelete: MetaAdsDeleteSchema,
	audiencesSessionsList: audienceSessionsListOutput,
	audiencesUsersAdd: audienceUsersResultSchema,
	audiencesUsersRemove: audienceUsersResultSchema,
	audiencesUsersReplace: audienceUsersReplaceResultSchema,
	audiencesAdAccountsShare: AudienceSharingSchema,
	audiencesAdAccountsUnshare: MetaAdsDeleteSchema,
	studiesGet: AdStudySchema,
	studiesCreate: StudyCreateSchema,
	studiesUpdate: StudyUpdateSchema,
	studiesRelatedAccountsList: MetaAdsListSchema,
	studiesViewersList: StudyViewersListSchema,
	videosDelete: MetaAdsDeleteSchema,
	asyncCreativesList: AsyncRequestSetsListSchema,
	asyncCreativesCreate: AsyncRequestSetCreateSchema,
	asyncRequestSetsList: AsyncRequestSetsListSchema,
	asyncRequestSetsCreate: AsyncRequestSetCreateSchema,
	asyncRequestSetsGet: AsyncRequestSetSchema,
	asyncRequestSetsUpdate: AsyncRequestSetUpdateSchema,
	asyncRequestSetsCancel: GraphBooleanResultSchema,
	asyncRequestsListForSet: AsyncRequestsListSchema,
	asyncRequestsListForAdSet: AsyncRequestsListSchema,
	asyncRequestsCancel: GraphBooleanResultSchema,
	insightsList: InsightsListSchema,
	insightsListForCampaign: InsightsListSchema,
	insightsListForAdSet: InsightsListSchema,
	insightsListForAd: InsightsListSchema,
	insightsCreateAsync: InsightsAsyncCreateSchema,
	insightsGetAsyncReport: AsyncReportSchema,
	insightsGetAsyncResults: InsightsListSchema,
	insightsListFeatures: InsightsFeaturesListSchema,
	insightsListEnabledFeatures: InsightsEnabledFeaturesListSchema,
	insightsEnableFeature: InsightsFeatureEnableSchema,
} as const;

type Assert<T extends true> = T;
type SameKeys<Left, Right> = [
	Exclude<keyof Left, keyof Right>,
	Exclude<keyof Right, keyof Left>,
] extends [never, never]
	? true
	: false;
type MetaAdsOutputSchemaKeysMatch = Assert<
	SameKeys<MetaAdsEndpointOutputs, typeof MetaAdsEndpointOutputSchemas>
>;
